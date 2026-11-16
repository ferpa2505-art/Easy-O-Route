import fs from 'fs';
import path from 'path';
import os from 'os';
import { logError, logInfo } from './logger';

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

// Get config directory path
const getConfigDir = (): string => {
  const homeDir = os.homedir();
  const configDir = path.join(homeDir, '.omniroute');
  
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
  } catch (error: any) {
    logError(`Error reading ${filename}: ${error.message}`);
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
  } catch (error: any) {
    logError(`Error writing ${filename}: ${error.message}`);
    throw error;
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

export { getConfigDir };
