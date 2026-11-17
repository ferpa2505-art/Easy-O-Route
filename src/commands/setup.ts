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
import { OMNIROUTE } from '../utils/constants';

// Packages that need their install scripts allowed on some systems
const ALLOW_SCRIPTS_PACKAGES = 'omniroute,keytar,onnxruntime-node,@parcel/watcher,@swc/core,protobufjs,esbuild';

// Install OmniRoute globally. Retries once with --allow-scripts if the plain install fails.
function installOmniRoute(): boolean {
  logInfo('📦 Instalando OmniRoute...');
  try {
    execSync('npm install -g omniroute --force', { stdio: 'inherit' });
    return true;
  } catch {
    logInfo('🔄 Tentando novamente com --allow-scripts...');
    try {
      execSync(`npm install -g omniroute --allow-scripts=${ALLOW_SCRIPTS_PACKAGES} --force`, {
        stdio: 'inherit',
      });
      return true;
    } catch (installError: any) {
      logError('❌ Falha ao instalar OmniRoute');
      logError(installError.message);
      return false;
    }
  }
}

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

        const major = Number(nodeVersion.replace(/^v/, '').split('.')[0]);
        if (major < 18) {
          logError('❌ Node.js 18 ou superior é necessário. Atualize em: https://nodejs.org');
          return;
        }
      } catch {
        logError('❌ Node.js não encontrado. Instale o Node.js em: https://nodejs.org');
        return;
      }

      // Step 2: Install OmniRoute
      if (!options.skipOmniroute) {
        logSection('2. Instalando OmniRoute');

        let alreadyInstalled = false;
        try {
          const current = execSync('omniroute --version', { stdio: 'pipe' }).toString().trim();
          alreadyInstalled = current.includes(OMNIROUTE.VERSION);
          if (alreadyInstalled) {
            logInfo(`✅ OmniRoute ${OMNIROUTE.VERSION} já está instalado`);
          }
        } catch {
          // Not installed: fall through to installation
        }

        if (!alreadyInstalled || options.force) {
          if (!installOmniRoute()) {
            return;
          }
          logSuccess('✅ OmniRoute instalado com sucesso!');
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
        } catch {
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
      logItem('Painel', OMNIROUTE.LOCAL_URL);
      logInfo('');

      logSuccess('✅ Configuração inicial concluída!');
      logInfo('');
      logInfo('Próximos passos:');
      logInfo('1. Inicie o OmniRoute: omniroute');
      logInfo(`2. Acesse: ${OMNIROUTE.LOCAL_URL}`);
      logInfo('3. Troque a senha padrão');
      logInfo('4. Conecte seus provedores');

    } catch (error: any) {
      logError(`❌ Erro durante a configuração: ${error.message}`);
      process.exit(1);
    }
  });
