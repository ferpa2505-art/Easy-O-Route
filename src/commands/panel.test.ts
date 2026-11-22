import http from 'http';
import { AddressInfo } from 'net';
import { buildPanelEnv, normalizeOmniUrl, parsePort } from '../utils/panel';

// panel/server.js is plain JavaScript shipped next to the CLI.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createPanelServer, isAllowedHost, loadConfig, READ_ONLY_PATHS } = require('../../panel/server.js');

describe('parsePort', () => {
  it('uses 8090 by default and accepts valid ports', () => {
    expect(parsePort(undefined)).toBe(8090);
    expect(parsePort('9000')).toBe(9000);
  });

  it('rejects ports that are not numbers in range', () => {
    expect(() => parsePort('abc')).toThrow('Invalid port');
    expect(() => parsePort('0')).toThrow('Invalid port');
    expect(() => parsePort('70000')).toThrow('Invalid port');
  });
});

describe('normalizeOmniUrl', () => {
  it('removes trailing slashes and keeps the address', () => {
    expect(normalizeOmniUrl('http://localhost:20128/')).toBe('http://localhost:20128');
  });

  it('only accepts http(s) addresses', () => {
    expect(() => normalizeOmniUrl('ftp://x')).toThrow('Use http:// or https://');
    expect(() => normalizeOmniUrl('not a url')).toThrow('Invalid OmniRoute address');
  });
});

describe('buildPanelEnv', () => {
  it('sets the token only when there is one', () => {
    const withToken = buildPanelEnv({}, { port: 1, omniUrl: 'http://x', token: 'abc' });
    const without = buildPanelEnv({}, { port: 1, omniUrl: 'http://x', token: '' });
    expect(withToken.OMNIROUTE_TOKEN).toBe('abc');
    expect('OMNIROUTE_TOKEN' in without).toBe(false);
    expect(without.PORT).toBe('1');
  });
});

describe('loadConfig', () => {
  it('listens on localhost by default and falls back to port 8090', () => {
    const config = loadConfig({ PORT: 'nope' });
    expect(config.host).toBe('127.0.0.1');
    expect(config.port).toBe(8090);
    expect(config.omniUrl).toBe('http://localhost:20128');
  });
});

describe('isAllowedHost', () => {
  it('accepts localhost names and refuses anything else', () => {
    expect(isAllowedHost('localhost:8090')).toBe(true);
    expect(isAllowedHost('127.0.0.1:8090')).toBe(true);
    expect(isAllowedHost('evil.example')).toBe(false);
    expect(isAllowedHost('192.168.0.9:8090')).toBe(false);
    expect(isAllowedHost('192.168.0.9:8090', ['192.168.0.9'])).toBe(true);
  });
});

describe('panel server', () => {
  const seen: { method?: string; url?: string; authorization?: string }[] = [];
  let upstream: http.Server;
  let panel: http.Server;
  let panelPort = 0;

  const request = (
    pathName: string,
    options: { method?: string; headers?: Record<string, string> } = {}
  ): Promise<{ status: number; body: string }> =>
    new Promise((resolve, reject) => {
      const req = http.request(
        { host: '127.0.0.1', port: panelPort, path: pathName, method: options.method ?? 'GET', headers: options.headers },
        (res) => {
          let body = '';
          res.on('data', (chunk) => (body += chunk));
          res.on('end', () => resolve({ status: res.statusCode ?? 0, body }));
        }
      );
      req.on('error', reject);
      req.end();
    });

  beforeAll(async () => {
    upstream = http.createServer((req, res) => {
      seen.push({ method: req.method, url: req.url, authorization: req.headers.authorization });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end('{"ok":true}');
    });
    await new Promise<void>((resolve) => upstream.listen(0, '127.0.0.1', resolve));
    const upstreamPort = (upstream.address() as AddressInfo).port;

    panel = createPanelServer({
      port: 0,
      host: '127.0.0.1',
      omniUrl: `http://127.0.0.1:${upstreamPort}`,
      token: 'test-token',
      extraHosts: [],
    });
    await new Promise<void>((resolve) => panel.listen(0, '127.0.0.1', resolve));
    panelPort = (panel.address() as AddressInfo).port;
  });

  afterAll(async () => {
    await new Promise((resolve) => panel.close(resolve));
    await new Promise((resolve) => upstream.close(resolve));
  });

  beforeEach(() => {
    seen.length = 0;
  });

  it('forwards read-only routes and adds the token from the environment', async () => {
    const res = await request('/api/providers');
    expect(res.status).toBe(200);
    expect(seen).toHaveLength(1);
    expect(seen[0].authorization).toBe('Bearer test-token');
  });

  it('keeps the token typed in the panel instead of replacing it', async () => {
    await request('/api/usage/request-logs?limit=12', { headers: { Authorization: 'Bearer typed' } });
    expect(seen[0].authorization).toBe('Bearer typed');
    expect(seen[0].url).toBe('/api/usage/request-logs?limit=12');
  });

  it('refuses anything but GET and HEAD on the API', async () => {
    const res = await request('/api/providers', { method: 'POST' });
    expect(res.status).toBe(405);
    expect(seen).toHaveLength(0);
  });

  it('refuses API routes that are not on the read-only list', async () => {
    const res = await request('/api/settings');
    expect(res.status).toBe(403);
    expect(seen).toHaveLength(0);
    expect(READ_ONLY_PATHS).toContain('/api/providers');
  });

  it('refuses requests whose Host header is not localhost', async () => {
    const res = await request('/api/providers', { headers: { Host: 'evil.example' } });
    expect(res.status).toBe(403);
    expect(seen).toHaveLength(0);
  });

  it('serves the panel, returns 404 for missing files and falls back to the panel for other routes', async () => {
    const index = await request('/');
    expect(index.status).toBe(200);
    expect(index.body).toContain('Easy-o-Route');
    expect((await request('/media/missing.mp4')).status).toBe(404);
    expect((await request('/some/route')).status).toBe(200);
  });
});
