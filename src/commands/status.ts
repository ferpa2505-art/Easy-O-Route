import { Command } from 'commander';
import { execSync } from 'child_process';
import {
  logInfo,
  logSuccess,
  logError,
  logTitle,
  logSection,
  logItem,
} from '../utils/logger';

export const statusCommand = new Command('status')
  .description('Status do OmniRoute')
  .option('-v, --verbose', 'Exibir informações detalhadas')
  .action(async () => {
    try {
      logTitle('📊 Status do OmniRoute');

      // Check if OmniRoute is running
      logSection('1. Verificando se o OmniRoute está rodando');
      
      try {
        execSync('curl -s http://localhost:20128/v1/models -H "Authorization: Bearer CHANGEME" 2>&1', { stdio: 'pipe' });
        logSuccess('✅ OmniRoute está rodando!');
        logItem('URL', 'http://localhost:20128');
      } catch {
        logError('❌ OmniRoute não está rodando');
        logInfo('Para iniciar: omniroute');
      }

      // Check version
      logSection('2. Versão do OmniRoute');
      try {
        const version = execSync('omniroute --version').toString().trim();
        logItem('Versão instalada', version);
      } catch {
        logError('❌ Não foi possível verificar a versão');
      }

      // Check if installed
      logSection('3. Instalação');
      try {
        execSync('which omniroute 2>&1 || where omniroute 2>&1', { stdio: 'pipe' });
        logSuccess('✅ OmniRoute está instalado');
      } catch {
        logError('❌ OmniRoute não está instalado');
        logInfo('Para instalar: npm install -g omniroute');
      }

      // Check Node.js
      logSection('4. Ambiente');
      try {
        const nodeVersion = execSync('node --version').toString().trim();
        const npmVersion = execSync('npm --version').toString().trim();
        const osPlatform = process.platform;
        const osArch = process.arch;
        
        logItem('Node.js', nodeVersion);
        logItem('npm', npmVersion);
        logItem('Sistema', `${osPlatform} (${osArch})`);
      } catch (error: any) {
        logError(`❌ Erro ao verificar ambiente: ${error.message}`);
      }

      // Doctor check
      logSection('5. Check-up (omniroute doctor)');
      try {
        const doctorOutput = execSync('omniroute doctor').toString();
        logInfo('');
        console.log(doctorOutput);
        logInfo('');
      } catch (error: any) {
        logError('❌ não foi possível executar omniroute doctor');
      }

      logSection('✅ Status Verificado');
      
    } catch (error: any) {
      logError(`❌ Erro ao verificar status: ${error.message}`);
      process.exit(1);
    }
  });
