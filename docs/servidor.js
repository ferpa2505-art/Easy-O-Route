const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const ROOT = __dirname;
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'config.json'), 'utf8'));
const UPSTREAM = new URL((cfg.omniroute || 'http://localhost:20128').replace(/\/$/, ''));
const TOKEN = (cfg.token || '').trim();
const PORT = Number(cfg.port || 8080);

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' };

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');

  if (url.pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end('{"ok":true}');
  }

  if (url.pathname.startsWith('/api/')) {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const body = chunks.length ? Buffer.concat(chunks) : undefined;
    const headers = { Accept: req.headers.accept || 'application/json' };
    if (TOKEN) headers.Authorization = 'Bearer ' + TOKEN;
    if (req.headers['content-type']) headers['Content-Type'] = req.headers['content-type'];

    try {
      const upstream = await fetch(UPSTREAM.origin + url.pathname.replace('/api', '') + url.search, {
        method: req.method, headers, body
      });
      const buf = Buffer.from(await upstream.arrayBuffer());
      res.writeHead(upstream.status, {
        'Content-Type': upstream.headers.get('content-type') || 'application/json',
        'Content-Length': buf.length, 'Cache-Control': 'no-store'
      });
      return res.end(buf);
    } catch (e) {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'upstream', detail: String(e.message) }));
    }
  }

  const file = path.join(ROOT, decodeURIComponent(url.pathname === '/' ? '/dashboard.html' : url.pathname));
  if (!file.startsWith(ROOT) || !fs.existsSync(file)) {
    res.writeHead(404); return res.end('404');
  }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

server.listen(PORT, '127.0.0.1', () => {
  const link = `http://localhost:${PORT}/dashboard.html`;
  console.log('Easy-O-Route em ' + link);
  if (!TOKEN) console.log('Aviso: token vazio em config.json');
  setTimeout(() => exec(`start "" "${link}"`), 1000);
});