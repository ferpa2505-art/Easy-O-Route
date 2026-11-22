import path from 'path';

export const DEFAULT_PANEL_PORT = 8090;
export const DEFAULT_OMNIROUTE_URL = 'http://localhost:20128';

/** Validates a TCP port given on the command line. */
export const parsePort = (value: string | undefined): number => {
  const port = Number(value ?? DEFAULT_PANEL_PORT);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid port "${value}". Use a number between 1 and 65535.`);
  }
  return port;
};

/** Accepts only http(s) addresses and removes trailing slashes. */
export const normalizeOmniUrl = (value: string | undefined): string => {
  const raw = (value ?? DEFAULT_OMNIROUTE_URL).trim();
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error(`Invalid OmniRoute address "${raw}". Example: ${DEFAULT_OMNIROUTE_URL}`);
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error(`Invalid OmniRoute address "${raw}". Use http:// or https://.`);
  }
  return raw.replace(/\/+$/, '');
};

/** Environment for the panel server. The token is only set when there is one. */
export const buildPanelEnv = (
  base: NodeJS.ProcessEnv,
  options: { port: number; omniUrl: string; token?: string }
): NodeJS.ProcessEnv => ({
  ...base,
  PORT: String(options.port),
  OMNIROUTE_URL: options.omniUrl,
  ...(options.token ? { OMNIROUTE_TOKEN: options.token } : {}),
});

/** panel/server.js, relative to dist/utils (or src/utils when run with ts-node). */
export const panelServerPath = (): string => path.resolve(__dirname, '..', '..', 'panel', 'server.js');
