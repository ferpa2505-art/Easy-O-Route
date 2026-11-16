import chalk from 'chalk';

// Log levels
 type LogLevel = 'info' | 'success' | 'warn' | 'error';

// Logger colors
const colors: Record<LogLevel, (text: string) => string> = {
  info: chalk.blue,
  success: chalk.green,
  warn: chalk.yellow,
  error: chalk.red,
};

// Icons
const icons: Record<LogLevel, string> = {
  info: 'ℹ️',
  success: '✅',
  warn: '⚠️',
  error: '❌',
};

/**
 * Log a message with a specific level
 */
export const log = (message: string, level: LogLevel = 'info'): void => {
  const color = colors[level] || chalk.white;
  const icon = icons[level] || '';
  const timestamp = new Date().toISOString();
  
  if (process.env.DEBUG) {
    console.log(chalk.gray(`[${timestamp}]`), color(`${icon} ${message}`));
  } else {
    console.log(color(`${icon} ${message}`));
  }
};

/**
 * Log info message
 */
export const logInfo = (message: string): void => {
  log(message, 'info');
};

/**
 * Log success message
 */
export const logSuccess = (message: string): void => {
  log(message, 'success');
};

/**
 * Log warning message
 */
export const logWarn = (message: string): void => {
  log(message, 'warn');
};

/**
 * Log error message
 */
export const logError = (message: string): void => {
  log(message, 'error');
};

/**
 * Log a title
 */
export const logTitle = (title: string): void => {
  console.log('');
  console.log(chalk.cyan('='.repeat(60)));
  console.log(chalk.bold.cyan(title));
  console.log(chalk.cyan('='.repeat(60)));
  console.log('');
};

/**
 * Log a section
 */
export const logSection = (section: string): void => {
  console.log('');
  console.log(chalk.magenta(`--- ${section} ---`));
  console.log('');
};

/**
 * Log a key-value pair
 */
export const logItem = (key: string, value: string | number | boolean): void => {
  const formattedValue = typeof value === 'boolean' ? (value ? chalk.green('Yes') : chalk.red('No')) : value;
  console.log(`${chalk.cyan(key.padEnd(30))}: ${formattedValue}`);
};

/**
 * Log a list
 */
export const logList = (items: string[], title?: string): void => {
  if (title) {
    console.log(chalk.bold(title));
  }
  items.forEach((item, index) => {
    console.log(`  ${chalk.cyan(`${index + 1}.`)} ${item}`);
  });
};

/**
 * Log a table
 */
export const logTable = (headers: string[], rows: string[][], title?: string): void => {
  if (title) {
    console.log(chalk.bold(title));
    console.log('');
  }
  
  // Calculate column widths
  const colWidths: number[] = headers.map((_, i) => {
    const maxWidth = Math.max(
      headers[i].length,
      ...rows.map(row => row[i]?.length || 0)
    );
    return Math.min(maxWidth, 40); // Max 40 chars
  });

  // Print header
  const headerLine = headers.map((h, i) => h.padEnd(colWidths[i])).join(' | ');
  console.log(chalk.bold(headerLine));
  console.log(chalk.gray('-'.repeat(headerLine.length)));

  // Print rows
  rows.forEach(row => {
    const rowLine = row.map((cell, i) => (cell || '').padEnd(colWidths[i])).join(' | ');
    console.log(rowLine);
  });
};

/**
 * Log a progress bar
 */
export const logProgress = (current: number, total: number, message: string): void => {
  const percentage = Math.round((current / total) * 100);
  const barLength = 30;
  const filled = Math.round((current / total) * barLength);
  const bar = '█'.repeat(filled) + '░'.repeat(barLength - filled);
  
  console.log(`\r${chalk.cyan(message)} ${chalk.green(bar)} ${chalk.white(`${percentage}%`)}`, {
    end: current === total ? '\n' : '',
  });
};

/**
 * Clear the console
 */
export const clearConsole = (): void => {
  console.clear();
};

/**
 * Log a newline
 */
export const logNewLine = (): void => {
  console.log('');
};
