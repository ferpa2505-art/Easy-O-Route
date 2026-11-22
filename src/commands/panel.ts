import { Command } from 'commander';
import { spawn } from 'child_process';
import fs from 'fs';
import { logError, logInfo, logWarn } from '../utils/logger';
import { promptHidden } from '../utils/prompt';
import {
  DEFAULT_OMNIROUTE_URL,
  DEFAULT_PANEL_PORT,
  buildPanelEnv,
  normalizeOmniUrl,
  panelServerPath,
  parsePort,
} from '../utils/panel';

const openBrowser = (url: string): void => {
  const [command, args]: [string, string[]] =
    process.platform === 'win32'
      ? ['cmd', ['/c', 'start', '', url]]
      : process.platform === 'darwin'
        ? ['open', [url]]
        : ['xdg-open', [url]];
  try {
    const child = spawn(command, args, { stdio: 'ignore', detached: true });
    child.on('error', () => logInfo(`Open ${url} in your browser.`));
    child.unref();
  } catch {
    logInfo(`Open ${url} in your browser.`);
  }
};

interface PanelCliOptions {
  port?: string;
  omniUrl?: string;
  open?: boolean;
  tokenPrompt?: boolean;
}

export const panelCommand = new Command('panel')
  .description('Start the topology panel: a live view of your OmniRoute providers and requests')
  .option('-p, --port <port>', 'port for the panel', String(DEFAULT_PANEL_PORT))
  .option('--omni-url <url>', 'OmniRoute address', DEFAULT_OMNIROUTE_URL)
  .option('--no-open', 'do not open the browser')
  .option('--no-token-prompt', 'do not ask for the OmniRoute token')
  .action(async (options: PanelCliOptions) => {
    try {
      const port = parsePort(options.port);
      const omniUrl = normalizeOmniUrl(options.omniUrl);
      const serverPath = panelServerPath();
      if (!fs.existsSync(serverPath)) {
        throw new Error(`Panel files not found at ${serverPath}. Reinstall Easy-O-Route.`);
      }

      // The token comes from the environment or a hidden prompt; it is never stored on disk.
      let token = process.env.OMNIROUTE_TOKEN || '';
      if (!token && options.tokenPrompt !== false) {
        token = await promptHidden('OmniRoute token (oma_live_..., press Enter to skip): ');
        if (!token) {
          logWarn('No token: if OmniRoute asks for one, paste it in the panel (Connect OmniRoute).');
        }
      }

      const url = `http://localhost:${port}`;
      const child = spawn(process.execPath, [serverPath], {
        env: buildPanelEnv(process.env, { port, omniUrl, token }),
        stdio: 'inherit',
      });
      child.on('exit', (code) => process.exit(code ?? 0));
      child.on('error', (error) => {
        logError(`Could not start the panel: ${error.message}`);
        process.exit(1);
      });

      if (options.open !== false) setTimeout(() => openBrowser(url), 800);
    } catch (error) {
      logError(error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });
