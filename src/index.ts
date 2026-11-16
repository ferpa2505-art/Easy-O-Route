#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import figlet from 'figlet';
import { setupCommand } from './commands/setup';
import { apiCommand } from './commands/api';
import { providerCommand } from './commands/provider';
import { comboCommand } from './commands/combo';
import { backupCommand } from './commands/backup';
import { validateCommand } from './commands/validate';
import { statusCommand } from './commands/status';
import { versionCommand } from './commands/version';
import { logError, logInfo, logSuccess, logWarn } from './utils/logger';

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
    .version('1.0.0', '-v, --version', 'Output the current version')
    .option('-d, --debug', 'Enable debug mode')
    .hook('preAction', (thisCommand) => {
      if (thisCommand.opts().debug) {
        process.env.DEBUG = 'true';
      }
    });

  // Register commands
  program.addCommand(setupCommand);
  program.addCommand(apiCommand);
  program.addCommand(providerCommand);
  program.addCommand(comboCommand);
  program.addCommand(backupCommand);
  program.addCommand(validateCommand);
  program.addCommand(statusCommand);
  program.addCommand(versionCommand);

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
