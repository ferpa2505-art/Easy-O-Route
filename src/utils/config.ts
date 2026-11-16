import fs from 'fs';
import path from 'path';
import os from 'os';
import { logError, logInfo, logWarn } from './logger';
import { PATHS } from './constants';

// Config interface
export interface Config {
  version: string;
  omniroute: {
    port: number;
    host: string;
    autostart: boolean;
  };
  easyORoute: {
    lastBackup: string;
    autoBackup: boolean;
    backupInterval: string;
  };
}

// API Key interface
export interface APIKey {
  id: string;
  name: string;
  key: string;
  provider: string;
  createdAt: string;
  lastUsed: string;
}

// Provider interface
export interface Provider {
  id: string;
  name: string;
  type: string;
  apiKey?: string;
  customModels: string[];
  enabled: boolean;
  connected: boolean;
  lastTested: string;
}

// Combo interface
export interface Combo {
  id: string;
  name: string;
  description: string;
  strategy: string;
  models: string[];
  enabled: boolean;
  createdAt: string;
  lastUsed: string;
}

// Backup interface
export interface Backup {
  id: string;
  name: string;
  path: string;
  createdAt: string;
  size: number;
}

// Get config directory path
const getConfigDir = (): string => {
  const homeDir = os.homedir();
  const configDir = path.join(homeDir, PATHS.CONFIG_DIR);
  
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
  
  return configDir;
};

// Get config file path
const getConfigPath = (filename: string): string => {
  return path.join(getConfigDir(), filename);
};

// Check if file exists
export const fileExists = (filename: string): boolean => {
  return fs.existsSync(getConfigPath(filename));
};

// Read JSON file
export const readJsonFile = <T>(filename: string, defaultValue?: T): T => {
  const filePath = getConfigPath(filename);
  
  if (!fs.existsSync(filePath)) {
    if (defaultValue) {
      return defaultValue;
    }
    throw new Error(`File ${filename} not found`);
  }
  
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data) as T;
  } catch (error) {
    logError(`Error reading ${filename}: ${error}`);
    if (defaultValue) {
      return defaultValue;
    }
    throw error;
  }
};

// Write JSON file
export const writeJsonFile = <T>(filename: string, data: T): void => {
  const filePath = getConfigPath(filename);
  
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    logInfo(`Config saved to ${filePath}`);
  } catch (error) {
    logError(`Error writing ${filename}: ${error}`);
    throw error;
  }
};

// Delete file
export const deleteFile = (filename: string): void => {
  const filePath = getConfigPath(filename);
  
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    logInfo(`File ${filename} deleted`);
  } else {
    logWarn(`File ${filename} not found`);
  }
};

// Read config
export const readConfig = (): Config => {
  try {
    return readJsonFile<Config>(PATHS.CONFIG, {
      version: '1.0.0',
      omniroute: {
        port: 20128,
        host: 'localhost',
        autostart: false,
      },
      easyORoute: {
        lastBackup: '',
        autoBackup: false,
        backupInterval: '7d',
      },
    });
  } catch {
    // Create default config if not exists
    const defaultConfig: Config = {
      version: '1.0.0',
      omniroute: {
        port: 20128,
        host: 'localhost',
        autostart: false,
      },
      easyORoute: {
        lastBackup: '',
        autoBackup: false,
        backupInterval: '7d',
      },
    };
    writeJsonFile(PATHS.CONFIG, defaultConfig);
    return defaultConfig;
  }
};

// Write config
export const writeConfig = (config: Config): void => {
  writeJsonFile(PATHS.CONFIG, config);
};

// Read API keys
export const readAPIKeys = (): APIKey[] => {
  try {
    return readJsonFile<APIKey[]>(PATHS.API_KEYS, []);
  } catch {
    return [];
  }
};

// Write API keys
export const writeAPIKeys = (apiKeys: APIKey[]): void => {
  writeJsonFile(PATHS.API_KEYS, apiKeys);
};

// Add API key
export const addAPIKey = (apiKey: APIKey): void => {
  const apiKeys = readAPIKeys();
  apiKeys.push(apiKey);
  writeAPIKeys(apiKeys);
};

// Remove API key
export const removeAPIKey = (id: string): void => {
  const apiKeys = readAPIKeys();
  const filtered = apiKeys.filter(key => key.id !== id);
  writeAPIKeys(filtered);
};

// Get API key by ID
export const getAPIKeyById = (id: string): APIKey | undefined => {
  const apiKeys = readAPIKeys();
  return apiKeys.find(key => key.id === id);
};

// Read providers
export const readProviders = (): Provider[] => {
  try {
    return readJsonFile<Provider[]>(PATHS.PROVIDERS, []);
  } catch {
    return [];
  }
};

// Write providers
export const writeProviders = (providers: Provider[]): void => {
  writeJsonFile(PATHS.PROVIDERS, providers);
};

// Add provider
export const addProvider = (provider: Provider): void => {
  const providers = readProviders();
  providers.push(provider);
  writeProviders(providers);
};

// Remove provider
export const removeProvider = (id: string): void => {
  const providers = readProviders();
  const filtered = providers.filter(p => p.id !== id);
  writeProviders(filtered);
};

// Get provider by ID
export const getProviderById = (id: string): Provider | undefined => {
  const providers = readProviders();
  return providers.find(p => p.id === id);
};

// Read combos
export const readCombos = (): Combo[] => {
  try {
    return readJsonFile<Combo[]>(PATHS.COMBOS, []);
  } catch {
    return [];
  }
};

// Write combos
export const writeCombos = (combos: Combo[]): void => {
  writeJsonFile(PATHS.COMBOS, combos);
};

// Add combo
export const addCombo = (combo: Combo): void => {
  const combos = readCombos();
  combos.push(combo);
  writeCombos(combos);
};

// Remove combo
export const removeCombo = (id: string): void => {
  const combos = readCombos();
  const filtered = combos.filter(c => c.id !== id);
  writeCombos(filtered);
};

// Get combo by ID or name
export const getComboById = (id: string): Combo | undefined => {
  const combos = readCombos();
  return combos.find(c => c.id === id || c.name === id);
};

// Get backup directory
export const getBackupDir = (): string => {
  const backupDir = path.join(getConfigDir(), PATHS.BACKUPS);
  
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  return backupDir;
};

// List backups
export const listBackups = (): Backup[] => {
  const backupDir = getBackupDir();
  const files = fs.readdirSync(backupDir);
  
  return files
    .filter(file => file.endsWith('.json'))
    .map(file => {
      const filePath = path.join(backupDir, file);
      const stats = fs.statSync(filePath);
      
      return {
        id: file.replace('.json', ''),
        name: file.replace('.json', ''),
        path: filePath,
        createdAt: stats.birthtime.toISOString(),
        size: stats.size,
      };
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Create backup
export const createBackup = (name?: string): Backup => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupName = name || `backup-${timestamp}`;
  const backupFile = `${backupName}.json`;
  const backupDir = getBackupDir();
  const backupPath = path.join(backupDir, backupFile);
  
  const backupData = {
    config: readConfig(),
    apiKeys: readAPIKeys(),
    providers: readProviders(),
    combos: readCombos(),
    createdAt: new Date().toISOString(),
  };
  
  fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2), 'utf-8');
  
  const stats = fs.statSync(backupPath);
  
  return {
    id: backupName,
    name: backupName,
    path: backupPath,
    createdAt: stats.birthtime.toISOString(),
    size: stats.size,
  };
};

// Restore backup
export const restoreBackup = (backupName: string): void => {
  const backupDir = getBackupDir();
  const backupPath = path.join(backupDir, `${backupName}.json`);
  
  if (!fs.existsSync(backupPath)) {
    throw new Error(`Backup ${backupName} not found`);
  }
  
  const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));
  
  writeConfig(backupData.config);
  writeAPIKeys(backupData.apiKeys);
  writeProviders(backupData.providers);
  writeCombos(backupData.combos);
  
  logInfo(`Backup ${backupName} restored successfully`);
};

// Delete backup
export const deleteBackup = (backupName: string): void => {
  const backupDir = getBackupDir();
  const backupPath = path.join(backupDir, `${backupName}.json`);
  
  if (fs.existsSync(backupPath)) {
    fs.unlinkSync(backupPath);
    logInfo(`Backup ${backupName} deleted`);
  } else {
    logWarn(`Backup ${backupName} not found`);
  }
};

// Generate unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
};

// Get timestamp
export const getTimestamp = (): string => {
  return new Date().toISOString();
};
