import { Command } from 'commander';
import { execSync } from 'child_process';
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

export const checkCommand = new Command('check')
  .description('Verificar configuração do OmniRoute e sugerir melhorias')
  .option('-f, --fix', 'Tentar corrigir problemas automaticamente')
  .option('-v, --verbose', 'Exibir informações detalhadas')
  .action(async (options) => {
    try {
      logTitle('🔍 Verificação Completa do OmniRoute');

      // Track issues
      const issues: { type: 'error' | 'warn' | 'info'; message: string; fix?: string }[] = [];
      const suggestions: string[] = [];

      // 1. Check if OmniRoute is installed
      logSection('1. Verificando Instalação do OmniRoute');
      
      try {
        const version = execSync('omniroute --version').toString().trim();
        logItem('Versão do OmniRoute', version);
        
        // Check if outdated
        if (version === '3.8.52') {
          issues.push({
            type: 'warn',
            message: 'OmniRoute está desatualizado (3.8.52 → 3.8.53)',
            fix: 'npm update -g omniroute'
          });
        } else if (version === '3.8.53') {
          logSuccess('✅ OmniRoute está na versão mais recente!');
        }
      } catch {
        issues.push({
          type: 'error',
          message: 'OmniRoute não está instalado',
          fix: 'npm install -g omniroute'
        });
      }

      // 2. Check if OmniRoute is running
      logSection('2. Verificando se o OmniRoute está rodando');
      
      try {
        execSync('curl -s http://localhost:20128/v1/models -H "Authorization: Bearer CHANGEME" 2>&1', { stdio: 'pipe' });
        logSuccess('✅ OmniRoute está rodando!');
      } catch {
        issues.push({
          type: 'warn',
          message: 'OmniRoute não está rodando',
          fix: 'omniroute'
        });
      }

      // 3. Check Node.js version
      logSection('3. Verificando Ambiente');
      
      try {
        const nodeVersion = execSync('node --version').toString().trim();
        const npmVersion = execSync('npm --version').toString().trim();
        
        logItem('Node.js', nodeVersion);
        logItem('npm', npmVersion);
        
        if (!nodeVersion.startsWith('v24') && !nodeVersion.startsWith('v22')) {
          issues.push({
            type: 'warn',
            message: `Node.js ${nodeVersion} - Recomendado: v24.x ou v22.x`,
            fix: 'Instale Node.js LTS em nodejs.org'
          });
        }
      } catch (error: any) {
        issues.push({
          type: 'error',
          message: 'Node.js não encontrado',
          fix: 'Instale Node.js em nodejs.org'
        });
      }

      // 4. Check providers
      logSection('4. Verificando Provedores Conectados');
      
      try {
        const providersOutput = execSync('omniroute providers list --json 2>&1').toString();
        const providers = JSON.parse(providersOutput);
        
        if (providers && providers.length > 0) {
          logItem('Provedores conectados', `${providers.length} provedores`);
          
          // Check for recommended providers
          const providerNames = providers.map((p: any) => p.name || p.id).join(', ');
          logInfo(`Provedores: ${providerNames}`);
          
          // Suggest more providers if less than 3
          if (providers.length < 3) {
            suggestions.push('💡 Conecte pelo menos 3 provedores para melhor fallback (Mistral, NVIDIA, Groq)');
          }
          
          // Check for paid providers
          const paidProviders = ['anthropic', 'deepseek'];
          const hasPaid = providers.some((p: any) => 
            paidProviders.some(paid => (p.name || p.id).toLowerCase().includes(paid))
          );
          
          if (!hasPaid) {
            suggestions.push('💡 Considere adicionar um provedor pago (DeepSeek) como última reserva');
          }
          
        } else {
          issues.push({
            type: 'error',
            message: 'Nenhum provedor conectado',
            fix: 'Conecte provedores no painel: http://localhost:20128'
          });
        }
      } catch (error: any) {
        issues.push({
          type: 'error',
          message: 'Não foi possível listar provedores',
          fix: 'omniroute providers list'
        });
      }

      // 5. Check combos
      logSection('5. Verificando Combos');
      
      try {
        const combosOutput = execSync('omniroute combo list --json 2>&1').toString();
        const combos = JSON.parse(combosOutput);
        
        if (combos && combos.length > 0) {
          logItem('Combos configurados', `${combos.length} combos`);
          combos.forEach((combo: any) => {
            logInfo(`- ${combo.name || combo.id}: ${combo.models?.length || 0} modelos`);
          });
          
          // Suggest economico combo
          const hasEconomico = combos.some((c: any) => (c.name || c.id).toLowerCase().includes('economico'));
          if (!hasEconomico) {
            suggestions.push('💡 Crie um combo "economico" com gratuitos na frente e pagos por último');
          }
          
        } else {
          issues.push({
            type: 'error',
            message: 'Nenhum combo configurado',
            fix: 'Crie um combo no painel: http://localhost:20128'
          });
        }
      } catch (error: any) {
        issues.push({
          type: 'error',
          message: 'Não foi possível listar combos',
          fix: 'omniroute combo list'
        });
      }

      // 6. Check if autostart is enabled
      logSection('6. Verificando Início Automático');
      
      try {
        const autostartStatus = execSync('omniroute autostart status').toString();
        logInfo(autostartStatus.trim());
        
        if (autostartStatus.includes('disabled')) {
          issues.push({
            type: 'warn',
            message: 'Início automático desativado',
            fix: 'omniroute autostart enable'
          });
        }
      } catch {
        logWarn('⚠️ Não foi possível verificar início automático');
      }

      // 7. Check doctor
      logSection('7. Executando omniroute doctor');
      
      try {
        const doctorOutput = execSync('omniroute doctor').toString();
        logInfo('--- Output do omniroute doctor ---');
        console.log(doctorOutput);
        logInfo('-----------------------------------');
        
        // Parse doctor output for issues
        const doctorLines = doctorOutput.split('\n');
        doctorLines.forEach(line => {
          if (line.includes('ERROR') || line.includes('FAIL')) {
            issues.push({
              type: 'error',
              message: line.trim(),
              fix: 'omniroute doctor'
            });
          } else if (line.includes('WARN')) {
            issues.push({
              type: 'warn',
              message: line.trim(),
              fix: 'omniroute doctor'
            });
          }
        });
      } catch (error: any) {
        logWarn('⚠️ Não foi possível executar omniroute doctor');
      }

      // Display issues
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
        logList(suggestions, '💡 SUGESTÕES');
      }
      
      if (errors.length === 0 && warns.length === 0 && suggestions.length === 0) {
        logSuccess('✅ Tudo está perfeito! Nenhum problema encontrado.');
      }

      // Fix issues if requested
      if (options.fix && issues.length > 0) {
        logSection('🔧 Tentando corrigir problemas...');
        
        for (const issue of issues) {
          if (issue.fix) {
            logInfo(`Corrigindo: ${issue.message}`);
            try {
              execSync(issue.fix, { stdio: 'inherit' });
              logSuccess(`✅ Corrigido: ${issue.message}`);
            } catch (fixError: any) {
              logError(`❌ Falha ao corrigir: ${issue.message} - ${fixError.message}`);
            }
          }
        }
      }

      logSection('✅ Verificação Concluída');
      
    } catch (error: any) {
      logError(`❌ Erro ao verificar configuração: ${error.message}`);
      process.exit(1);
    }
  });
