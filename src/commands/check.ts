import { Command } from 'commander';
import { execSync, spawnSync } from 'child_process';
import {
  logInfo,
  logSuccess,
  logError,
  logWarn,
  logTitle,
  logSection,
  logItem,
  logList,
} from '../utils/logger';
import {
  SUGGESTED_ECONOMIC_COMBO,
  getMissingFreeProviders,
  COMBO_TIPS,
} from '../utils/freeProviders';
import { OMNIROUTE } from '../utils/constants';
import {
  MIN_COMBO_CONTEXT,
  ComboLike,
  analyzeComboContext,
  apiGet,
  extractJson,
  findApiKey,
  isServerUp,
  maskEmails,
} from '../utils/omniroute';

interface Issue {
  type: 'error' | 'warn';
  message: string;
  fix?: string;
}

// Roda um comando e devolve a saída (mesmo quando o comando termina com código diferente de zero)
function runCapture(command: string, timeoutMs = 120000): string {
  try {
    return execSync(command, { stdio: 'pipe', timeout: timeoutMs }).toString();
  } catch (error: unknown) {
    const e = error as { stdout?: Buffer | string };
    return e.stdout ? e.stdout.toString() : '';
  }
}

function formatTokens(value: number): string {
  return value >= 1_000_000
    ? `${(value / 1_000_000).toFixed(1).replace('.0', '')} mi`
    : `${Math.round(value / 1000)} mil`;
}

export const checkCommand = new Command('check')
  .description('Verificar configuração do OmniRoute e sugerir melhorias')
  .option('-f, --fix', 'Tentar corrigir problemas automaticamente')
  .option('-v, --verbose', 'Exibir informações detalhadas (saída completa do doctor)')
  .option('-k, --api-key <chave>', 'Chave do OmniRoute para checar o contexto dos combos (ou use OMNIROUTE_API_KEY)')
  .action(async (options) => {
    try {
      logTitle('🔍 Verificação Completa do OmniRoute');

      const issues: Issue[] = [];
      const suggestions: string[] = [];

      // 1. Instalação
      logSection('1. Verificando Instalação do OmniRoute');

      try {
        const raw = execSync('omniroute --version', { stdio: 'pipe' }).toString();
        const version = raw.split(/\r?\n/).map(l => l.trim()).filter(l => /^\d+\.\d+\.\d+/.test(l)).pop() || raw.trim();
        logItem('Versão do OmniRoute', version);

        if (version === OMNIROUTE.VERSION) {
          logSuccess(`OmniRoute está na versão testada (${OMNIROUTE.VERSION})`);
        } else {
          logInfo(`Versão diferente da testada pelo Easy-O-Route (${OMNIROUTE.VERSION}). Normalmente funciona; se algo falhar, confira o changelog.`);
        }
      } catch {
        issues.push({
          type: 'error',
          message: 'OmniRoute não está instalado',
          fix: 'npm install -g omniroute',
        });
      }

      // 2. Servidor
      logSection('2. Verificando se o OmniRoute está rodando');

      const serverUp = await isServerUp();
      if (serverUp) {
        logSuccess(`OmniRoute está rodando! (${OMNIROUTE.LOCAL_URL})`);
      } else {
        issues.push({
          type: 'warn',
          message: 'OmniRoute não está rodando ou não está acessível',
          // --no-tray evita o travamento do ícone da bandeja visto no Windows após atualizações
          fix: 'omniroute serve --daemon --no-tray --no-open',
        });
      }

      // 3. Ambiente
      logSection('3. Verificando Ambiente');

      try {
        const nodeVersion = execSync('node --version').toString().trim();
        const npmVersion = execSync('npm --version').toString().trim();

        logItem('Node.js', nodeVersion);
        logItem('npm', npmVersion);

        if (!nodeVersion.startsWith('v24') && !nodeVersion.startsWith('v22')) {
          issues.push({
            type: 'warn',
            message: `Node.js ${nodeVersion} - Recomendado: v24.x (LTS) ou v22.22.2 em diante`,
            fix: undefined,
          });
        }
      } catch {
        issues.push({ type: 'error', message: 'Node.js não encontrado' });
      }

      // 4. Provedores
      logSection('4. Verificando Provedores Conectados');

      let connectedIds: string[] = [];

      try {
        // Comando fixo (sem entrada do usuário), então o uso do shell é seguro
        const result = spawnSync('omniroute providers list --json', {
          encoding: 'utf8',
          stdio: ['ignore', 'pipe', 'ignore'],
          shell: true,
          timeout: 60000,
        });
        const data = extractJson(result.stdout || '') as
          | { providers?: unknown[]; connections?: unknown[] }
          | unknown[]
          | null;
        const list = (Array.isArray(data) ? data : data?.providers || data?.connections || []) as Array<
          Record<string, unknown>
        >;

        if (list.length > 0) {
          const active = list.filter(p => p.isActive !== false && p.active !== false);
          connectedIds = active.map(p => `${p.name || ''} ${p.provider || p.id || ''}`);
          const names = Array.from(new Set(active.map(p => maskEmails(String(p.name || p.provider || p.id || '')))));

          logItem('Conexões de provedores', `${list.length} (${active.length} ativas)`);
          logInfo(`Ativas: ${names.join(', ')}`);

          if (active.length < 3) {
            issues.push({
              type: 'warn',
              message: 'Menos de 3 provedores ativos: conecte mais para ter fallback',
            });
          } else {
            logSuccess('Você tem uma boa quantidade de provedores conectados!');
          }

          if (!connectedIds.some(p => /anthropic|deepseek/i.test(p))) {
            logInfo('Considere um provedor pago (como o DeepSeek) só como última reserva');
          }

          const missing = getMissingFreeProviders(connectedIds);
          if (missing.length > 0) {
            const shown = missing.slice(0, 3).map(p => p.displayName).join(', ');
            const more = missing.length > 3 ? ` e mais ${missing.length - 3}` : '';
            logInfo(`Provedores gratuitos que você ainda não conectou: ${shown}${more}`);
            suggestions.push(`Veja como conectar os que faltam: easy-o-route providers --add ${missing[0].name}`);
          } else {
            logSuccess('Todos os provedores gratuitos que o Easy-O-Route conhece estão conectados!');
          }
        } else {
          logWarn('Nenhum provedor conectado');
          logInfo(`Conecte provedores no painel: ${OMNIROUTE.LOCAL_URL}`);
          suggestions.push('Comece por: easy-o-route providers --setup-guide');
        }
      } catch {
        logWarn('Não foi possível listar provedores (verifique se o OmniRoute está rodando)');
      }

      // 5. Combos
      logSection('5. Verificando Combos');

      try {
        const apiKey = findApiKey(options.apiKey);
        let combos: ComboLike[] = [];
        let contexts: Record<string, number> = {};
        let contextChecked = false;

        let combosRead = false;

        if (apiKey && serverUp) {
          // Logo depois de iniciar, o servidor responde mas ainda está carregando: tenta algumas vezes
          for (let attempt = 1; attempt <= 4 && !contextChecked; attempt++) {
            try {
              const combosData = await apiGet<{ combos?: ComboLike[] } | ComboLike[]>('/api/combos', apiKey);
              combos = Array.isArray(combosData) ? combosData : combosData.combos || [];
              combosRead = true;
              const modelsData = await apiGet<{ data?: Array<{ id: string; context_length?: number }> }>(
                '/v1/models',
                apiKey
              );
              contexts = {};
              for (const m of modelsData.data || []) {
                if (m.context_length) contexts[m.id] = m.context_length;
              }
              contextChecked = true;
            } catch {
              if (attempt < 4) {
                logInfo(`O OmniRoute ainda está carregando; tentando de novo em 10 segundos (${attempt}/3)...`);
                await new Promise(resolve => setTimeout(resolve, 10000));
              }
            }
          }
        }

        if (combos.length === 0) {
          const result = spawnSync('omniroute combo list --json', {
            encoding: 'utf8',
            stdio: ['ignore', 'pipe', 'ignore'],
            shell: true,
            timeout: 60000,
          });
          const data = extractJson(result.stdout || '') as { combos?: ComboLike[] } | ComboLike[] | null;
          if (data !== null) {
            combos = Array.isArray(data) ? data : data?.combos || [];
            combosRead = true;
          }
        }

        if (combos.length > 0) {
          logItem('Combos configurados', `${combos.length} combos`);
          combos.forEach(combo => {
            const steps = (combo.models || []).length;
            logInfo(`- ${combo.name || combo.id}: ${steps} passos`);
          });

          const hasEconomico = combos.some(c => (c.name || c.id || '').toLowerCase().includes('economico'));
          if (!hasEconomico) {
            suggestions.push(
              `Crie um combo "${SUGGESTED_ECONOMIC_COMBO.name}" (gratuitos na frente): ${OMNIROUTE.LOCAL_URL} → Combinações → Criar Combo`
            );
          } else {
            logSuccess('Você já tem combos configurados!');
          }

          if (contextChecked) {
            const problems = analyzeComboContext(combos, contexts, MIN_COMBO_CONTEXT);
            if (problems.length === 0) {
              logSuccess(`Todos os passos dos combos aceitam ${formatTokens(MIN_COMBO_CONTEXT)} tokens ou mais`);
            }
            for (const p of problems) {
              const detail = p.smallSteps.map(s => `${s.model} (${formatTokens(s.context)})`).join(', ');
              issues.push({
                type: 'warn',
                message:
                  `Combo "${p.combo}": contexto pequeno em ${p.smallSteps.length} passo(s): ${detail}. ` +
                  `No OmniRoute 3.8.54, o limite do combo é o do menor passo (${formatTokens(p.minContext)}): ` +
                  'pedidos maiores falham em todos os passos ("Context limit reached" no Claude Code). ' +
                  `Retire esses passos ou troque por modelos de ${formatTokens(MIN_COMBO_CONTEXT)} tokens ou mais.`,
              });
            }
          } else {
            logInfo('Para checar o contexto dos passos, defina OMNIROUTE_API_KEY ou use --api-key');
          }
        } else if (!combosRead) {
          // Não deu para ler: não afirma que "não há combos"
          issues.push({
            type: 'warn',
            message: 'Não foi possível ler os combos (o servidor pode ainda estar iniciando). Rode o check de novo em 1 minuto.',
          });
        } else {
          logWarn('Nenhum combo configurado');
          logInfo(`Crie um combo no painel: ${OMNIROUTE.LOCAL_URL}`);
          suggestions.push(COMBO_TIPS[0]);
        }
      } catch {
        logWarn('Não foi possível listar combos (verifique se o OmniRoute está rodando)');
      }

      // 6. Início automático
      logSection('6. Verificando Início Automático');

      try {
        const autostartStatus = runCapture('omniroute autostart status');
        if (/\|\s*true\s*\|/.test(autostartStatus) || (/enabled/i.test(autostartStatus) && !/disabled/i.test(autostartStatus))) {
          const mechanism = /\|\s*true\s*\|\s*([\w-]+)/.exec(autostartStatus);
          logSuccess(`Início automático ativado${mechanism ? ` (${mechanism[1]})` : ''}`);
        } else if (/false|disabled/i.test(autostartStatus)) {
          issues.push({
            type: 'warn',
            message: 'Início automático desativado',
            fix: 'omniroute autostart enable',
          });
        } else {
          logWarn('Não foi possível interpretar o estado do início automático');
        }
      } catch {
        logWarn('Não foi possível verificar início automático');
      }

      // 7. Doctor
      logSection('7. Executando omniroute doctor');

      try {
        const doctorOutput = runCapture('omniroute doctor');
        if (options.verbose) {
          logInfo('--- Saída completa do omniroute doctor ---');
          console.log(maskEmails(doctorOutput));
          logInfo('------------------------------------------');
        }

        const toolsNotLinked: string[] = [];
        for (const raw of doctorOutput.split(/\r?\n/)) {
          const line = raw.trim();
          if (/^(ERROR|FAIL)/.test(line)) {
            issues.push({ type: 'error', message: line });
          } else if (/^WARN/.test(line)) {
            const cli = /^WARN CLI:\s*([^:]+):\s*(.*)$/.exec(line);
            if (cli) {
              // Ferramenta de IA que o usuário não instalou não é problema
              if (/not installed/i.test(cli[2])) continue;
              if (/not configured/i.test(cli[2])) {
                toolsNotLinked.push(cli[1].trim());
                continue;
              }
              issues.push({ type: 'warn', message: line });
            } else if (/Port availability/i.test(line) && serverUp) {
              // Porta em uso é o esperado quando o próprio OmniRoute está rodando
              continue;
            } else if (/Server liveness|CLI machine token/i.test(line) && serverUp) {
              // Falha momentânea (por exemplo, logo depois de iniciar): o servidor já responde
              continue;
            } else {
              issues.push({ type: 'warn', message: line });
            }
          }
        }

        const summary = /Summary:\s*(\d+) ok,\s*(\d+) warning\(s\),\s*(\d+) failure\(s\)/i.exec(doctorOutput);
        if (summary) {
          logInfo(`Resultado do doctor: ${summary[1]} ok, ${summary[2]} avisos, ${summary[3]} falhas (avisos sobre ferramentas não instaladas são ignorados aqui)`);
        }
        if (toolsNotLinked.length > 0) {
          logInfo(
            `ℹ️ Ferramentas reconhecidas e ainda não ligadas ao OmniRoute: ${toolsNotLinked.join(', ')}. ` +
              'Se você usa atalhos como claude-eco, isso é normal.'
          );
        }
      } catch {
        logWarn('Não foi possível executar omniroute doctor');
      }

      // Resumo
      logSection('📋 Resumo da Verificação');

      const errors = issues.filter(i => i.type === 'error');
      const warns = issues.filter(i => i.type === 'warn');

      if (errors.length > 0) {
        logList(errors.map(i => `❌ ERRO: ${i.message}`), `❌ ERROS (${errors.length})`);
      }

      if (warns.length > 0) {
        logList(warns.map(i => `⚠️ AVISO: ${i.message}`), `⚠️ AVISOS (${warns.length})`);
      }

      if (suggestions.length > 0) {
        logList(suggestions.map(s => `💡 ${s}`), '💡 SUGESTÕES');
      }

      if (errors.length === 0 && warns.length === 0) {
        logSuccess('Tudo certo! Nenhum problema encontrado.');
      }

      // Corrige o que tem comando de correção
      const fixable = issues.filter(i => i.fix);
      if (options.fix && fixable.length > 0) {
        logSection('🔧 Tentando corrigir problemas...');

        for (const issue of fixable) {
          logInfo(`Corrigindo: ${issue.message}`);
          try {
            execSync(issue.fix as string, { stdio: 'inherit' });
            logSuccess(`Corrigido: ${issue.message}`);
          } catch (fixError: unknown) {
            const message = fixError instanceof Error ? fixError.message : String(fixError);
            logError(`Falha ao corrigir: ${issue.message} - ${message}`);
          }
        }
      } else if (fixable.length > 0) {
        logInfo(`${fixable.length} problema(s) têm correção automática: rode easy-o-route check --fix`);
      }

      logSection('✅ Verificação Concluída');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      logError(`Erro ao verificar configuração: ${message}`);
      process.exit(1);
    }
  });
