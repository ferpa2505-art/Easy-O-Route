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
} from '../utils/freeProviders';
import { OMNIROUTE } from '../utils/constants';

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
        
        // Compare with the version this tool was tested against
        if (version.includes(OMNIROUTE.VERSION)) {
          logSuccess(`✅ OmniRoute está na versão testada (${OMNIROUTE.VERSION})`);
        } else {
          issues.push({
            type: 'warn',
            message: `OmniRoute ${version} difere da versão testada pelo Easy-O-Route (${OMNIROUTE.VERSION})`,
            fix: 'npm install -g omniroute'
          });
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
        // Check if port 20128 is listening
        const netstatOutput = execSync('netstat -ano | findstr 20128 | findstr LISTENING 2>&1', { stdio: 'pipe' }).toString();
        if (netstatOutput.includes('LISTENING')) {
          logSuccess('✅ OmniRoute está rodando!');
        } else {
          throw new Error('Port not listening');
        }
      } catch {
        try {
          // Try to check using omniroute status command
          execSync('omniroute status 2>&1', { stdio: 'pipe' });
          logSuccess('✅ OmniRoute está rodando!');
        } catch {
          issues.push({
            type: 'warn',
            message: 'OmniRoute não está rodando ou não está acessível',
            fix: 'omniroute'
          });
        }
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
      
      let connectedProviders: string[] = [];
      
      // Suggest free providers
      suggestions.push('💡 Provedores gratuitos recomendados:');
      suggestions.push('   • Groq: Alta velocidade, modelos gratuitos (llama-3.1-8b-instant)');
      suggestions.push('   • Mistral: Bom custo-benefício (mistral-tiny, mistral-small)');
      suggestions.push('   • OpenRouter: Acesso a múltiplos provedores');
      suggestions.push('   • Together: Centenas de modelos de código aberto');
      suggestions.push('   • Fireworks: Modelos otimizados');
      suggestions.push('');
      suggestions.push('💡 Use: easy-o-route providers --setup-guide para ver instruções detalhadas');
      suggestions.push('💡 Use: easy-o-route providers --recommended para ver a lista completa');
      
      // Try to list providers
      try {
        // Use spawnSync with full path to npx
        // Fixed command string (no user input), so shell use is safe here
        const result = spawnSync('npx omniroute providers list --json', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], shell: true });
        const providersOutput = result.stdout || result.stderr || '';
        
        if (providersOutput && providersOutput.trim()) {
          // Remove any ANSI escape codes
          // eslint-disable-next-line no-control-regex
          const noAnsi = providersOutput.replace(/\u001b\[[0-9;]*m/g, '');
          // Find JSON in the output (starts with {)
          const jsonMatch = noAnsi.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const providers = JSON.parse(jsonMatch[0]);
            
            if (providers && providers.providers && providers.providers.length > 0) {
              const providersList = providers.providers;
              connectedProviders = providersList.map((p: any) => p.name || p.provider || p.id);
              logItem('Provedores conectados', `${providersList.length} provedores`);
              
              // Check for recommended providers
              const providerNames = connectedProviders.join(', ');
              logInfo(`Provedores: ${providerNames}`);
              
              // Suggest more providers if less than 3
              if (providersList.length < 3) {
                logWarn('⚠️ Recomendamos conectar pelo menos 3 provedores para melhor fallback');
              } else {
                logSuccess('✅ você tem uma boa quantidade de provedores conectados!');
              }
              
              // Check for paid providers
              const paidProviders = ['anthropic', 'deepseek'];
              const hasPaid = connectedProviders.some(p => 
                paidProviders.some(paid => p.toLowerCase().includes(paid))
              );
              
              if (!hasPaid) {
                logInfo('ℹ️ Considere adicionar um provedor pago (DeepSeek) como última reserva');
              }
              
              // Check for free providers and suggest missing ones
              const missingFreeProviders = getMissingFreeProviders(connectedProviders);
              if (missingFreeProviders.length > 0) {
                const missingNames = missingFreeProviders.map(p => p.displayName).join(', ');
                logInfo(`ℹ️ Adicione provedores gratuitos: ${missingNames.substring(0, 60)}${missingNames.length > 60 ? '...' : ''}`);
              } else {
                logSuccess('✅ Todos os provedores gratuitos recomendados estão conectados!');
              }
            } else {
              logWarn('⚠️ Nenhum provedor conectado');
              logInfo('ℹ️ Conecte provedores no painel: http://localhost:20128');
            }
          }
        }
      } catch (error: any) {
        // If we can't list providers, just show the suggestions
        logWarn('⚠️ Não foi possível listar provedores (verifique se o OmniRoute está rodando)');
      }

      // 5. Check combos
      logSection('5. Verificando Combos');
      
      // Suggest combo
      suggestions.push(`💡 Crie um combo "${SUGGESTED_ECONOMIC_COMBO.name}" para economia de tokens`);
      suggestions.push('   Provedores sugeridos: Groq, Mistral, OpenRouter, Together');
      suggestions.push('   Acesse: http://localhost:20128 → Combos → Novo Combo');
      suggestions.push('');
      
      // Try to list combos
      try {
        // Use spawnSync with full path to npx
        // Fixed command string (no user input), so shell use is safe here
        const result = spawnSync('npx omniroute combo list --json', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], shell: true });
        const combosOutput = result.stdout || result.stderr || '';
        
        if (combosOutput && combosOutput.trim()) {
          // Remove any ANSI escape codes
          // eslint-disable-next-line no-control-regex
          const noAnsi = combosOutput.replace(/\u001b\[[0-9;]*m/g, '');
          // Find JSON in the output (starts with {)
          const jsonMatch = noAnsi.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const combosData = JSON.parse(jsonMatch[0]);
            const combos = combosData.combos || combosData;
            
            if (Array.isArray(combos) && combos.length > 0) {
              logItem('Combos configurados', `${combos.length} combos`);
              combos.forEach((combo: any) => {
                logInfo(`- ${combo.name || combo.id}: ${combo.models?.length || 0} modelos`);
              });
              
              // Suggest economico combo
              const hasEconomico = combos.some((c: any) => (c.name || c.id).toLowerCase().includes('economico'));
              if (!hasEconomico && connectedProviders.length >= 3) {
                logInfo(`ℹ️ Sugestão: Crie um combo "${SUGGESTED_ECONOMIC_COMBO.name}" com seus provedores`);
              } else {
                logSuccess('✅ Você já tem combos configurados!');
              }
            } else {
              logWarn('⚠️ Nenhum combo configurado');
              logInfo('ℹ️ Crie um combo no painel: http://localhost:20128');
            }
          }
        }
      } catch (error: any) {
        // If we can't list combos, just show the suggestions
        logWarn('⚠️ Não foi possível listar combos (verifique se o OmniRoute está rodando)');
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
