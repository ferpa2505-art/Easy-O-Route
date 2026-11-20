import { Command } from 'commander';
import { execSync } from 'child_process';
import { logInfo, logSuccess, logError, logWarn, logTitle, logItem, logSection } from '../utils/logger';
import { OMNIROUTE } from '../utils/constants';
import * as readline from 'readline';

// Helper function para confirmação interativa
function confirmPrompt(question: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question + ' (s/n): ', (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 's' || answer.toLowerCase() === 'sim' || answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

export const updateCommand = new Command('update')
  .description('Atualiza o OmniRoute automaticamente')
  .option('-y, --yes', 'Confirmar atualização sem prompt')
  .option('-c, --check', 'Verificar apenas se há nova versão')
  .option('-d, --dry-run', 'Simular atualização sem executar')
  .action(async (options) => {
    try {
      if (options.check) {
        await checkForUpdates();
        return;
      }

      if (options.dryRun) {
        await simulateUpdate();
        return;
      }

      await performUpdate(options.yes ? true : undefined, options.dryRun);

    } catch (error: any) {
      logError(`❌ Erro na atualização: ${error.message}`);
      process.exit(1);
    }
  });

async function checkForUpdates(): Promise<void> {
  logTitle('🔍 VERIFICANDO NOVAS VERSÕES');

  logSection('Versão atual do OmniRoute');
  try {
    const currentVersion = execSync('omniroute --version').toString().trim();
    logItem('Atual', currentVersion);
  } catch {
    logError('❌ Não foi possível verificar a versão atual');
    process.exit(1);
  }

  logSection('Versão documentada no Easy-O-Route');
  logItem('Armazenada no codebase', OMNIROUTE.VERSION);

  logInfo('');
  logInfo('💡 Para atualizar, execute: easy-o-route update');
  logInfo(`   Ou headless: easy-o-route update --yes`);

  logSuccess('\n✅ Verificação concluída!');
}

async function simulateUpdate(): Promise<void> {
  logTitle('🔄 SIMULAÇÃO DE ATUALIZAÇÃO');

  logSection('Verificando OmniRoute');
  try {
    const currentVersion = execSync('omniroute --version').toString().trim();
    logSuccess(`OmniRoute instalado: ${currentVersion}`);
  } catch {
    logError('❌ OmniRoute não encontrado');
    process.exit(1);
  }

  logSection('Próxima versão');
  logInfo(`A mais recente é: ${OMNIROUTE.VERSION}`);

  // Note: currentVersion is scoped inside try block, so we need to handle this differently
  logInfo('✅ Simulação concluída - use --check para ver detalhes completos');
}

async function performUpdate(confirmed?: boolean, dryRun?: boolean): Promise<void> {
  logTitle('⬆️ ATUALIZAR OMNIROUTE');

  logSection('1. Verificando estado atual');

  let isRunning = false;
  let currentVersion = '';

  try {
    const statusOutput = execSync('omniroute status 2>&1', { encoding: 'utf-8' });
    if (statusOutput.includes('Running')) {
      isRunning = true;
      logSuccess('✅ OmniRoute está rodando');
    } else {
      logWarn('⚠️ OmniRoute não está rodando');
    }
  } catch {
    logWarn('⚠️ Não foi possível verificar o status');
  }

  try {
    currentVersion = execSync('omniroute --version').toString().trim();
    logItem('Versão atual', currentVersion);
  } catch {
    logError('❌ Não foi possível recuperar a versão atual');
    process.exit(1);
  }

  logInfo(`Versão documentada: ${OMNIROUTE.VERSION}`);

  if (currentVersion.includes(OMNIROUTE.VERSION)) {
    logSuccess(`✅ Você já está na última versão (${OMNIROUTE.VERSION})`);
    logInfo('Nenhuma atualização necessária');
    return;
  }

  logSection('2. Preparando atualização');

  if (isRunning) {
    logInfo('⚙️ OmniRoute está rodando');
    logWarn('');
    logWarn('⚠️ O OmniRoute requer que o servidor esteja parado para atualizar');

    if (!confirmed) {
      const answer = await confirmPrompt('Deseja parar o OmniRoute e atualizar?');
      if (!answer) {
        logInfo('Atualização cancelada');
        return;
      }
    }

    logInfo('');
    logInfo('🔒 Parando OmniRoute...');
    try {
      execSync('omniroute stop', { encoding: 'utf-8' });
      logSuccess('✅ OmniRoute parado com sucesso');
    } catch (error: any) {
      logError(`❌ Falha ao parar OmniRoute: ${error.message}`);
      logWarn('Tente executar: omniroute stop manualmente');
      process.exit(1);
    }
  } else {
    logSuccess('✅ OmniRoute não está rodando (continuando)');
  }

  logSection('3. Verificando nova versão');

  const latestVersion = OMNIROUTE.VERSION;
  logItem('Última versão', latestVersion);

  if (latestVersion.includes('3.8.')) {
    logInfo(`Comparando com versão documentada: ${latestVersion}`);
  }

  logSection('4. Executando install com npm');

  logInfo('⚠️ A interface do Omnis.navigateTo o update tool para ver changelog');
  logInfo('');
  logInfo('⬇️ Executando: npm install -g omniroute --force');

  try {
    if (dryRun) {
      logWarn('--- DRY RUN: comando não executado ---');
      logInfo('Comando simulado: npm install -g omniroute --force');
    } else {
      execSync('npm install -g omniroute --force', {
        stdio: 'inherit',
      });
    }

    logSuccess('✅ OmniRoute instalado com sucesso!');
  } catch (error: any) {
    logError('❌ Falha ao instalar OmniRoute');
    logError(error.message);
    logInfo('');
    logWarn('⚠️ Tente manualmente:');
    logInfo('  npm install -g omniroute --force');
    process.exit(1);
  }

  logSection('5. Verificando nova versão instalada');

  try {
    const newVersion = execSync('omniroute --version').toString().trim();
    logSuccess(`OmniRoute atualizado para: ${newVersion}`);

    if (newVersion.includes(OMNIROUTE.VERSION)) {
      logSuccess('✅ Nova versão está alinhada com Easy-O-Route!');
    } else {
      logWarn('⚠️ Versão instalada pode diferir da documentada');
    }
  } catch {
    logError('❌ Não foi possível verificar a nova versão');
  }

  logSection('6. Próximos passos');

  logInfo('');
  logInfo('✅ Atualização concluída!');

  logSection('Instruções');

  logInfo('1. Reiniciar OmniRoute:');
  logInfo('   omniroute start');
  logInfo('   Ou: omniroute');

  logInfo('');
  logInfo('2. Verificar versão:');
  logInfo('   omniroute --version');

  logInfo('');
  logInfo('3. Verificar changelog:');
  logInfo('   omniroute update (sem parar)');

  logInfo('');
  logInfo('4. Continue usando OmniRoute normalmente');

  logSection('');
  logInfo('');
  logSuccess('✅ Atualização concluída com sucesso!');
}

