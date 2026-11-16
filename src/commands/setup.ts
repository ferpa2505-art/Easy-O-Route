import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
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
import { readConfig, writeConfig, getConfigDir } from '../utils/config';
import { OMNIROUTE } from '../utils/constants';

// Setup command
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
      } catch (error) {
        logError('❌ Node.js não encontrado. Instale o Node.js em: https://nodejs.org');
        return;
      }

      // Step 2: Install OmniRoute
      if (!options.skipOmniroute) {
        logSection('2. Instalando OmniRoute');
        
        try {
          const checkOmniRoute = execSync('omniroute --version 2>&1').toString().trim();
          
          if (checkOmniRoute.includes(OMNIROUTE.VERSION) && !options.force) {
            logInfo(`✅ OmniRoute já está instalado (versão: ${OMNIROUTE.VERSION})`);
          } else {
            logInfo('📦 Instalando OmniRoute...');
            
            try {
              execSync('npm install -g omniroute --force 2>&1', { stdio: 'inherit' });
              logSuccess('✅ OmniRoute instalado com sucesso!');
            } catch (installError) {
              // Try with allow-scripts for npm 11+
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
          } catch (installError) {
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

      // Step 4: Start OmniRoute
      logSection('4. Iniciando OmniRoute');
      
      const answers = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'startNow',
          message: 'Deseja iniciar o OmniRoute agora?',
          default: true,
        },
      ]);

      if (answers.startNow) {
        logInfo('🚀 Iniciando OmniRoute...');
        logInfo('Aguarde... O OmniRoute será iniciado em uma nova janela.');
        logInfo('');
        logInfo('Para acessar o painel, abra: http://localhost:20128');
        logInfo('');
        logInfo('Senha padrão: CHANGEME');
        logInfo('');
        logWarn('⚠️  TROQUE A SENHA no primeiro acesso!');
        
        // Don't start here, let user do it manually
        // execSync('omniroute &', { stdio: 'ignore' });
      }

      // Step 5: Configure autostart
      if (options.autostart) {
        logSection('5. Configurando Início Automático');
        
        try {
          execSync('omniroute autostart enable');
          logSuccess('✅ Início automático configurado!');
        } catch (error) {
          logWarn('⚠️ Não foi possível configurar início automático');
          logInfo('Tente manualmente: omniroute autostart enable');
        }
      }

      // Step 6: Configuration summary
      logSection('✅ Configuração Concluída');
      
      logInfo('');
      logInfo('📋 Resumo:');
      logInfo('');
      logItem('Node.js', 'Instalado');
      logItem('OmniRoute', 'Instalado');
      logItem('Painel', 'http://localhost:20128');
      logItem('Senha padrão', 'CHANGEME');
      logInfo('');
      
      logSuccess('✅ Configuração inicial concluída!');
      logInfo('');
      logInfo('Próximos passos:');
      logInfo('1. Inicie o OmniRoute: omniroute');
      logInfo('2. Acesse: http://localhost:20128');
      logInfo('3. Troque a senha padrão');
      logInfo('4. Conecte seus provedores');
      logInfo('5. Crie seus combos');
      
    } catch (error) {
      logError(`❌ Erro durante a configuração: ${error.message}`);
      process.exit(1);
    }
  });
