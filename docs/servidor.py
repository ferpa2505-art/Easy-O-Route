import json, os, threading, webbrowser
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

ROOT = os.path.dirname(os.path.abspath(__file__))
CFG = json.load(open(os.path.join(ROOT, "config.json"), encoding="utf-8"))
UPSTREAM = CFG.get("omniroute", "http://localhost:20128").rstrip("/")
TOKEN = (CFG.get("token") or "").strip()
PORT = int(CFG.get("port", 8080))


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=ROOT, **k)

    def log_message(self, *a):
        pass

    def _send(self, status, payload, ctype="application/json"):
        self.send_response(status)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(payload)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(payload)

    def _proxy(self, method):
        target = UPSTREAM + self.path.replace("/api", "", 1)
        length = int(self.headers.get("Content-Length") or 0)
        body = self.rfile.read(length) if length else None

        headers = {"Accept": self.headers.get("Accept", "application/json")}
        if TOKEN:
            headers["Authorization"] = "Bearer " + TOKEN
        if self.headers.get("Content-Type"):
            headers["Content-Type"] = self.headers["Content-Type"]

        req = Request(target, data=body, headers=headers, method=method)
        try:
            with urlopen(req, timeout=20) as res:
                self._send(res.status, res.read(), res.headers.get("Content-Type", "application/json"))
        except HTTPError as e:
            self._send(e.code, e.read(), e.headers.get("Content-Type", "application/json"))
        except URLError as e:
            self._send(502, json.dumps({"error": "upstream", "detail": str(e.reason)}).encode())

    def do_GET(self):
        if self.path == "/api/health":
            return self._send(200, b'{"ok":true}')
        if self.path.startswith("/api/"):
            return self._proxy("GET")
        super().do_GET()

    def do_POST(self):
        if self.path.startswith("/api/"):
            return self._proxy("POST")
        super().do_POST()

    def do_PUT(self):
        if self.path.startswith("/api/"):
            return self._proxy("PUT")
        self._send(405, b"{}")

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Content-Length", "0")
        self.end_headers()


if __name__ == "__main__":
    url = f"http://localhost:{PORT}/dashboard.html"
    print("Easy-O-Route em " + url)
    if not TOKEN:
        print("Aviso: token vazio em config.json")
    threading.Timer(1.0, lambda: webbrowser.open(url)).start()
    ThreadingHTTPServer(("127.0.0.1", PORT), Handler).serve_forever()
