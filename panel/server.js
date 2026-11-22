#!/usr/bin/env node
'use strict';

/**
 * Easy-O-Route topology panel server.
 *
 * Serves the panel in ./public and forwards a small read-only set of OmniRoute API routes.
 * The OmniRoute token is read only from the OMNIROUTE_TOKEN environment variable (or typed
 * in the panel); it is never written to disk or printed.
 *
 * Safety defaults:
 *  - listens on 127.0.0.1 only (set HOST to change it);
 *  - only GET/HEAD on a fixed list of read-only routes is forwarded, so a web page open in
 *    another tab cannot use the injected token to change OmniRoute settings;
 *  - requests whose Host header is not localhost are refused (DNS-rebinding protection).
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PUBLIC_DIR = path.resolve(__dirname, 'public');
const INDEX_FILE = 'index.html';
const ALLOWED_METHODS = new Set(['GET', 'HEAD']);
const READ_ONLY_PATHS = [
  '/api/monitoring/health',
  '/api/providers',
  '/api/provider-nodes',
  '/api/usage/request-logs',
];
const UPSTREAM_TIMEOUT_MS = 15000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
};

function loadConfig(env = process.env) {
  const port = Number(env.PORT || 8090);
  return {
    port: Number.isInteger(port) && port > 0 && port < 65536 ? port : 8090,
    host: env.HOST || '127.0.0.1',
    omniUrl: (env.OMNIROUTE_URL || 'http://localhost:20128').replace(/\/+$/, ''),
    token: env.OMNIROUTE_TOKEN || '',
    extraHosts: (env.ALLOWED_HOSTS || '').split(',').map((h) => h.trim().toLowerCase()).filter(Boolean),
  };
}

function isAllowedHost(hostHeader, extraHosts = []) {
  const host = String(hostHeader || '').toLowerCase().replace(/:\d+$/, '');
  return ['localhost', '127.0.0.1', '[::1]', ...extraHosts].includes(host);
}

function sendJson(res, code, body) {
  const buf = Buffer.from(JSON.stringify(body));
  res.writeHead(code, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': buf.length,
    'Cache-Control': 'no-store',
  });
  res.end(buf);
}

function isApiPath(pathname) {
  return pathname === '/api' || pathname.startsWith('/api/');
}

function proxy(config, req, res, target) {
  const mod = target.protocol === 'https:' ? https : http;
  const headers = { accept: req.headers.accept || 'application/json' };
  if (req.headers.authorization) headers.authorization = req.headers.authorization;
  else if (config.token) headers.authorization = 'Bearer ' + config.token;

  const upstream = mod.request(
    {
      protocol: target.protocol,
      hostname: target.hostname,
      port: target.port || (target.protocol === 'https:' ? 443 : 80),
      path: target.pathname + target.search,
      method: req.method,
      headers,
      timeout: UPSTREAM_TIMEOUT_MS,
    },
    (up) => {
      const out = {
        'Content-Type': up.headers['content-type'] || 'application/json',
        'Cache-Control': 'no-store',
      };
      res.writeHead(up.statusCode || 502, out);
      up.pipe(res);
    }
  );
  upstream.on('timeout', () => upstream.destroy(new Error('OmniRoute did not answer in time')));
  upstream.on('error', (err) => {
    if (res.headersSent) return res.destroy();
    sendJson(res, 502, {
      error: 'proxy_failed',
      detail: err.message,
      hint: 'Check that OmniRoute is running and that OMNIROUTE_URL (' + config.omniUrl + ') is correct.',
    });
  });
  upstream.end();
}

function streamFile(req, res, filePath, stat, contentType) {
  const headers = { 'Content-Type': contentType, 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-store' };
  const match = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
  if (!match) {
    res.writeHead(200, { ...headers, 'Content-Length': stat.size });
    return req.method === 'HEAD' ? res.end() : fs.createReadStream(filePath).pipe(res);
  }
  const suffixOnly = match[1] === '';
  const start = suffixOnly ? Math.max(stat.size - Number(match[2]), 0) : Number(match[1]);
  const end = suffixOnly || match[2] === '' ? stat.size - 1 : Math.min(Number(match[2]), stat.size - 1);
  if (start > end || start >= stat.size) {
    res.writeHead(416, { 'Content-Range': `bytes */${stat.size}` });
    return res.end();
  }
  res.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${stat.size}`, 'Content-Length': end - start + 1 });
  return req.method === 'HEAD' ? res.end() : fs.createReadStream(filePath, { start, end }).pipe(res);
}

function serveStatic(req, res, pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return sendJson(res, 400, { error: 'bad_request' });
  }
  if (decoded === '/' || decoded === '') decoded = '/' + INDEX_FILE;

  const filePath = path.resolve(PUBLIC_DIR, '.' + decoded);
  if (filePath !== path.join(PUBLIC_DIR, INDEX_FILE) && !filePath.startsWith(PUBLIC_DIR + path.sep)) {
    return sendJson(res, 403, { error: 'forbidden' });
  }

  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isFile()) {
      const type = MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
      return streamFile(req, res, filePath, stat, type);
    }
    // Unknown files with an extension are a real 404; other paths fall back to the panel.
    if (path.extname(decoded)) return sendJson(res, 404, { error: 'not_found', path: decoded });
    const index = path.join(PUBLIC_DIR, INDEX_FILE);
    fs.stat(index, (e2, st) => {
      if (e2) return sendJson(res, 404, { error: 'not_found', hint: 'panel/public/index.html is missing' });
      return streamFile(req, res, index, st, MIME['.html']);
    });
  });
}

function createPanelServer(config) {
  return http.createServer((req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'no-referrer');

    if (!isAllowedHost(req.headers.host, config.extraHosts)) {
      return sendJson(res, 403, { error: 'host_not_allowed', hint: 'Open the panel through http://localhost:' + config.port });
    }

    let url;
    try {
      url = new URL(req.url, 'http://localhost');
    } catch {
      return sendJson(res, 400, { error: 'bad_request' });
    }

    if (isApiPath(url.pathname)) {
      if (!ALLOWED_METHODS.has(req.method)) {
        return sendJson(res, 405, { error: 'method_not_allowed', hint: 'The panel only reads data from OmniRoute.' });
      }
      if (!READ_ONLY_PATHS.includes(url.pathname)) {
        return sendJson(res, 403, { error: 'route_not_allowed', allowed: READ_ONLY_PATHS });
      }
      let target;
      try {
        target = new URL(url.pathname + url.search, config.omniUrl);
      } catch (err) {
        return sendJson(res, 500, { error: 'invalid_omniroute_url', detail: err.message });
      }
      return proxy(config, req, res, target);
    }

    if (!ALLOWED_METHODS.has(req.method)) return sendJson(res, 405, { error: 'method_not_allowed' });
    return serveStatic(req, res, url.pathname);
  });
}

// Tells the user what is reachable right now, with the next step when something is missing.
function probe(config) {
  const check = (route) =>
    new Promise((resolve) => {
      let url;
      try {
        url = new URL(route, config.omniUrl);
      } catch {
        return resolve(0);
      }
      const mod = url.protocol === 'https:' ? https : http;
      const headers = config.token ? { authorization: 'Bearer ' + config.token } : {};
      const r = mod.request(
        { protocol: url.protocol, hostname: url.hostname, port: url.port || (url.protocol === 'https:' ? 443 : 80), path: url.pathname, method: 'GET', headers, timeout: 3000 },
        (resp) => { resp.resume(); resolve(resp.statusCode || 0); }
      );
      r.on('timeout', () => { r.destroy(); resolve(0); });
      r.on('error', () => resolve(0));
      r.end();
    });

  return Promise.all([check('/api/monitoring/health'), check('/api/providers')]).then(([health, providers]) => {
    if (health === 0) {
      console.log('  OmniRoute: NOT reachable at ' + config.omniUrl);
      console.log('  -> Start OmniRoute, or restart with the right address (OMNIROUTE_URL or --omni-url).');
    } else if (providers === 401 || providers === 403) {
      console.log('  OmniRoute: reachable, but it asked for a token.');
      console.log('  -> In OmniRoute: Settings > Access token > Create token (permission: Administration - Manage).');
      console.log('     Paste it in the panel (Connect OmniRoute) or restart with OMNIROUTE_TOKEN set.');
    } else {
      console.log('  OmniRoute: reachable' + (config.token ? ' and authenticated.' : '.'));
    }
  });
}

function startPanel(config = loadConfig()) {
  const server = createPanelServer(config);
  server.listen(config.port, config.host, () => {
    console.log('');
    console.log('  Easy-O-Route panel');
    console.log('  Panel:     http://localhost:' + config.port);
    console.log('  OmniRoute: ' + config.omniUrl);
    console.log('  Token:     ' + (config.token ? 'set (hidden)' : 'not set (paste it in the panel if OmniRoute asks)'));
    console.log('');
    probe(config).then(() => console.log(''));
  });
  server.on('error', (err) => {
    console.error(err.code === 'EADDRINUSE'
      ? '  Port ' + config.port + ' is already in use. Pick another one: --port ' + (config.port + 1)
      : '  Server error: ' + err.message);
    process.exit(1);
  });
  process.on('SIGINT', () => server.close(() => process.exit(0)));
  return server;
}

if (require.main === module) startPanel();

module.exports = { loadConfig, isAllowedHost, createPanelServer, startPanel, READ_ONLY_PATHS };
