import { Command } from 'commander';
import chalk from 'chalk';
import { EASY_OROUTE, OMNIROUTE } from '../utils/constants';
import {
  logInfo,
  logTitle,
  logItem,
} from '../utils/logger';

// Version command
export const versionCommand = new Command('version')
  .description('Versão do Easy-O-Route')
  .action(() => {
    logTitle('📦 Versões');
    
    logInfo('');
    logItem('Easy-O-Route', EASY_OROUTE.VERSION);
    logItem('Nome', EASY_OROUTE.NAME);
    logItem('Descrição', EASY_OROUTE.DESCRIPTION);
    logItem('Autor', EASY_OROUTE.AUTHOR);
    logItem('Repositório', EASY_OROUTE.REPOSITORY);
    logItem('Licença', EASY_OROUTE.LICENSE);
    logInfo('');
    
    logItem('OmniRoute (base)', OMNIROUTE.VERSION);
    logItem('OmniRoute URL', OMNIROUTE.URL);
    logInfo('');
    
    console.log(chalk.cyan('='.repeat(60)));
    console.log(chalk.cyan('✨ Easy-O-Route - O facilitador definitivo para o OmniRoute'));
    console.log(chalk.cyan('='.repeat(60)));
  });
