#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import figlet from 'figlet';
import { setupCommand } from './commands/setup';
import { statusCommand } from './commands/status';
import { versionCommand } from './commands/version';
import { checkCommand } from './commands/check';
import { providersCommand } from './commands/providers';
import { updateCommand } from './commands/update';
import { autoupdateCommand } from './commands/autoupdate';
import { panelCommand } from './commands/panel';
import { logError } from './utils/logger';
import { EASY_OROUTE } from './utils/constants';

// Display banner
const displayBanner = () => {
  console.log(chalk.cyan(figlet.textSync('Easy-O-Route', { horizontalLayout: 'full' })));
  console.log(chalk.cyan('='.repeat(60)));
  console.log(chalk.green('✨ O Facilitador Definitivo para Configuração do OmniRoute'));
  console.log(chalk.cyan('='.repeat(60)));
  console.log('');
};

// Main function
export const main = () => {
  displayBanner();

  program
    .name('easy-o-route')
    .description('Facilitador de Configuracao do OmniRoute - CLI para gerenciar provedores, combos e chaves API')
    .version(EASY_OROUTE.VERSION, '-v, --version', 'Output the current version')
    .option('-d, --debug', 'Enable debug mode')
    .hook('preAction', (thisCommand) => {
      if (thisCommand.opts().debug) {
        process.env.DEBUG = 'true';
      }
    });

  // Register commands
  program.addCommand(setupCommand);
  program.addCommand(statusCommand);
  program.addCommand(versionCommand);
  program.addCommand(checkCommand);
  program.addCommand(providersCommand);
  program.addCommand(updateCommand);
  program.addCommand(autoupdateCommand);
  program.addCommand(panelCommand);

  // Help command
  program
    .command('help')
    .description('Display help for command')
    .action(() => {
      displayBanner();
      program.help();
    });

  // Parse arguments
  program.parse(process.argv);

  // If no arguments, show help
  if (program.args.length === 0) {
    displayBanner();
    program.help();
  }
};

// Handle errors
process.on('uncaughtException', (error) => {
  logError(`Error: ${error.message}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logError(`Unhandled rejection: ${reason}`);
  process.exit(1);
});

// Run main function
main();
