import { Command } from 'commander';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { logInfo, logSuccess, logError, logWarn, logTitle, logItem, logSection } from '../utils/logger';

const CONFIG_DIR = path.join(os.homedir(), '.easy-o-route');
const AUTOUPDATE_CONFIG = path.join(CONFIG_DIR, 'autoupdate.json');

interface AutoUpdateConfig {
  enabled: boolean;
  intervalHours: number;
  lastCheck?: string;
  notifyOnly?: boolean;
}

function ensureConfigDir(): void {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

function loadConfig(): AutoUpdateConfig {
  ensureConfigDir();
  if (fs.existsSync(AUTOUPDATE_CONFIG)) {
    try {
      return JSON.parse(fs.readFileSync(AUTOUPDATE_CONFIG, 'utf-8'));
    } catch {
      return { enabled: false, intervalHours: 24 };
    }
  }
  return { enabled: false, intervalHours: 24 };
}

function saveConfig(config: AutoUpdateConfig): void {
  ensureConfigDir();
  fs.writeFileSync(AUTOUPDATE_CONFIG, JSON.stringify(config, null, 2));
}

function getPlatformScheduleCommand(config: AutoUpdateConfig): string[] {
  const platform = os.platform();
  const nodePath = process.execPath;
  const scriptPath = path.join(__dirname, '..', '..', 'dist', 'index.js');
  // For Windows schtasks, we need to escape quotes for the /TR parameter
  // Format: /TR "\"path\to\node.exe\" \"path\to\script.js\" args"
  const winTaskRun = `"\\"${nodePath}\\" \\"${scriptPath}\\" update --check"`;

  if (platform === 'win32') {
    // Windows Task Scheduler
    const taskName = 'EasyOrouteAutoUpdate';
    if (config.enabled) {
      // For HOURLY schedule, /MO must be 1-23. For 24+ hours, use DAILY schedule
      let scheduleType = 'HOURLY';
      let modifier = config.intervalHours;
      if (config.intervalHours >= 24) {
        scheduleType = 'DAILY';
        modifier = Math.max(1, Math.floor(config.intervalHours / 24));
      } else if (config.intervalHours < 1) {
        modifier = 1;
      }
      return [
        `schtasks /Create /TN "${taskName}" /TR ${winTaskRun} /SC ${scheduleType} /MO ${modifier} /F`,
        `schtasks /Run /TN "${taskName}"`,
      ];
    } else {
      return [`schtasks /Delete /TN "${taskName}" /F`];
    }
  } else {
    // Linux/Mac - cron
    const cronEntry = `0 */${config.intervalHours} * * * ${scriptPath} >> ~/.easy-o-route/autoupdate.log 2>&1`;
    if (config.enabled) {
      return [
        `(crontab -l 2>/dev/null | grep -v "easy-o-route update --check"; echo "${cronEntry}") | crontab -`,
      ];
    } else {
      return [`(crontab -l 2>/dev/null | grep -v "easy-o-route update --check") | crontab -`];
    }
  }
}

async function runBackgroundCheck(notifyOnly: boolean = false): Promise<void> {
  try {
    const { execSync } = await import('child_process');
    const versionOutput = execSync('omniroute --version', { encoding: 'utf-8', timeout: 10000 }).toString().trim();

    // Load current version from constants (would need to be imported)
    // For now, just check if omniroute is available
    const config = loadConfig();
    config.lastCheck = new Date().toISOString();
    saveConfig(config);

    if (!notifyOnly) {
      logSuccess(`✅ Verificação automática concluída: ${versionOutput}`);
    }
  } catch (error: any) {
    if (!notifyOnly) {
      logError(`❌ Erro na verificação automática: ${error.message}`);
    }
  }
}

export const autoupdateCommand = new Command('autoupdate')
  .description('Gerencia verificação automática de atualizações do OmniRoute')
  .addCommand(
    new Command('enable')
      .description('Habilita verificação automática periódica')
      .option('-i, --interval <hours>', 'Intervalo em horas (padrão: 24)', '24')
      .option('-n, --notify-only', 'Apenas notificar, não instalar automaticamente')
      .action(async (options) => {
        const config = loadConfig();
        config.enabled = true;
        config.intervalHours = parseInt(options.interval, 10) || 24;
        config.notifyOnly = options.notifyOnly;
        saveConfig(config);

        const commands = getPlatformScheduleCommand(config);
        try {
          for (const cmd of commands) {
            execSync(cmd, { encoding: 'utf-8', stdio: 'inherit' });
          }
          logSuccess('✅ Verificação automática habilitada!');
          logInfo(`   Intervalo: a cada ${config.intervalHours} hora(s)`);
          logInfo(`   Modo: ${config.notifyOnly ? 'Apenas notificar' : 'Verificar e opcionalmente atualizar'}`);

          if (os.platform() !== 'win32') {
            logInfo('');
            logInfo('💡 Para ver logs: tail -f ~/.easy-o-route/autoupdate.log');
          }
        } catch (error: any) {
          logError(`❌ Falha ao configurar agendamento: ${error.message}`);
          logWarn('⚠️ Tente executar como administrador (Windows) ou verifique permissões do crontab (Linux/Mac)');
        }
      })
  )
  .addCommand(
    new Command('disable')
      .description('Desabilita verificação automática')
      .action(() => {
        const config = loadConfig();
        config.enabled = false;
        saveConfig(config);

        const commands = getPlatformScheduleCommand(config);
        try {
          for (const cmd of commands) {
            execSync(cmd, { encoding: 'utf-8', stdio: 'inherit' });
          }
          logSuccess('✅ Verificação automática desabilitada!');
        } catch (error: any) {
          logError(`❌ Falha ao remover agendamento: ${error.message}`);
        }
      })
  )
  .addCommand(
    new Command('status')
      .description('Mostra status da verificação automática')
      .action(() => {
        const config = loadConfig();
        logTitle('⚙️ STATUS DA VERIFICAÇÃO AUTOMÁTICA');
        logSection('Configuração');
        logItem('Habilitado', config.enabled ? 'Sim' : 'Não');
        logItem('Intervalo', `${config.intervalHours} hora(s)`);
        logItem('Modo', config.notifyOnly ? 'Apenas notificar' : 'Verificar');
        logItem('Última verificação', config.lastCheck || 'Nunca');

        logSection('Próximas execuções agendadas');
        const platform = os.platform();
        if (platform === 'win32') {
          try {
            const output = execSync('schtasks /Query /TN "EasyOrouteAutoUpdate" /V /FO LIST', { encoding: 'utf-8' });
            logInfo(output);
          } catch {
            logInfo('Nenhuma tarefa agendada encontrada');
          }
        } else {
          try {
            const output = execSync('crontab -l 2>/dev/null | grep "easy-o-route update"', { encoding: 'utf-8' });
            logInfo(output || 'Nenhuma entrada no crontab');
          } catch {
            logInfo('Nenhuma entrada no crontab');
          }
        }
      })
  )
  .addCommand(
    new Command('run')
      .description('Executa verificação agora (para testes)')
      .action(async () => {
        logTitle('🔄 EXECUTANDO VERIFICAÇÃO AGORA');
        await runBackgroundCheck(false);
      })
  );

// Export for use in background
export { runBackgroundCheck, loadConfig, saveConfig, AUTOUPDATE_CONFIG };