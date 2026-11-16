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
} from '../utils/logger';

export const setupCommand = new Command('setup')
  .description('Configuração inicial do OmniRoute')
  .option('-f, --force', 'Forçar reinstalação')
  .option('-s, --skip-omniroute', 'Pular instalação do OmniRoute')
  .option('-a, --autostart', 'Configurar início automático')
  .action(async (options) => {
    try {
      logTitle('🚀 Configuração Inicial do OmniRoute');

      // Step 1: Check Node.js
      logSection('1. Verificando Node.js');
      try {
        const nodeVersion = execSync('node --version').toString().trim();
        const npmVersion = execSync('npm --version').toString().trim();
        
        logItem('Node.js', nodeVersion);
        logItem('npm', npmVersion);
        
        if (!nodeVersion.startsWith('v24') && !nodeVersion.startsWith('v22')) {
          logWarn('⚠️ Recomendado: Node.js 22.x ou 24.x');
        }
      } catch (error: any) {
        logError('❌ Node.js não encontrado. Instale o Node.js em: https://nodejs.org');
        return;
      }

      // Step 2: Install OmniRoute
      if (!options.skipOmniroute) {
        logSection('2. Instalando OmniRoute');
        
        try {
          const checkOmniRoute = execSync('omniroute --version 2>&1').toString().trim();
          
          if (checkOmniRoute.includes('3.8.52') && !options.force) {
            logInfo(`✅ OmniRoute já está instalado (versão: ${checkOmniRoute})`);
          } else {
            logInfo('📦 Instalando OmniRoute...');
            
            try {
              execSync('npm install -g omniroute --force 2>&1', { stdio: 'inherit' });
              logSuccess('✅ OmniRoute instalado com sucesso!');
            } catch (installError: any) {
              logInfo('🔄 Tentando com --allow-scripts...');
              execSync(
                'npm install -g omniroute --allow-scripts=omniroute,keytar,onnxruntime-node,@parcel/watcher,@swc/core,protobufjs,esbuild --force 2>&1',
                { stdio: 'inherit' }
              );
              logSuccess('✅ OmniRoute instalado com sucesso!');
            }
          }
        } catch {
          logInfo('📦 Instalando OmniRoute...');
          
          try {
            execSync('npm install -g omniroute --force 2>&1', { stdio: 'inherit' });
            logSuccess('✅ OmniRoute instalado com sucesso!');
          } catch (installError: any) {
            logError('❌ Falha ao instalar OmniRoute');
            logError(installError.message);
            return;
          }
        }
      }

      // Step 3: Verify OmniRoute
      logSection('3. Verificando OmniRoute');
      try {
        const version = execSync('omniroute --version').toString().trim();
        logItem('Versão do OmniRoute', version);
      } catch {
        logError('❌ OmniRoute não encontrado. Verifique a instalação.');
        return;
      }

      // Step 4: Configure autostart
      if (options.autostart) {
        logSection('4. Configurando Início Automático');
        
        try {
          execSync('omniroute autostart enable');
          logSuccess('✅ Início automático configurado!');
        } catch (error: any) {
          logWarn('⚠️ Não foi possível configurar início automático');
          logInfo('Tente manualmente: omniroute autostart enable');
        }
      }

      // Step 5: Summary
      logSection('✅ Configuração Concluída');
      
      logInfo('');
      logInfo('📋 Resumo:');
      logInfo('');
      logItem('Node.js', 'Instalado');
      logItem('OmniRoute', 'Instalado');
      logItem('Painel', 'http://localhost:20128');
      logInfo('');
      
      logSuccess('✅ Configuração inicial concluída!');
      logInfo('');
      logInfo('Próximos passos:');
      logInfo('1. Inicie o OmniRoute: omniroute');
      logInfo('2. Acesse: http://localhost:20128');
      logInfo('3. Troque a senha padrão');
      logInfo('4. Conecte seus provedores');
      
    } catch (error: any) {
      logError(`❌ Erro durante a configuração: ${error.message}`);
      process.exit(1);
    }
  });
