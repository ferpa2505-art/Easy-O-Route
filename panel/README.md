# Easy-O-Route topology panel

A live view of your [OmniRoute](https://github.com/diegosouzapw/OmniRoute): active providers, requests, errors and the connection state. English and Portuguese in one page (button **PT | EN** at the top).

## Run it

```bash
# with the CLI
easy-o-route panel

# or with only Node.js (from this folder)
./start.sh          # Linux / macOS
.\start.ps1         # Windows PowerShell
```

Then open <http://localhost:8090>. Options: `--port`, `--omni-url` (default `http://localhost:20128`), `--no-open`, `--no-token-prompt`. Environment variables: `PORT`, `OMNIROUTE_URL`, `OMNIROUTE_TOKEN`.

## Connect it to OmniRoute

1. In OmniRoute: left side menu → **Settings → Access token → Create token** (name `Easy-o-Route`, permission **Administration – Manage**, expiration optional).
2. Copy the token (`oma_live_…`, shown once).
3. Paste it in the panel (**Connect OmniRoute** → **Token** → **Connect**) or type it when the start script asks.

Footer button: **red** = no access to OmniRoute · **amber** = OmniRoute answers but needs the token · **green** = connected and validated.

## When something goes wrong

Click a failed request in the **Recent requests** panel, or **How to fix an error** in the Connect OmniRoute panel. You get the likely cause, the steps to fix it and a button that opens a web search (the search text is shown before you click). **Copy details** and **Open issue** prepare a report without any token in it.

## Security notes

- Listens on `127.0.0.1` only; answers only to `localhost` Host headers.
- Forwards only `GET` requests to `/api/monitoring/health`, `/api/providers`, `/api/provider-nodes` and `/api/usage/request-logs`.
- The token is never written to disk and never printed.

---

## Português

Painel de topologia ao vivo do OmniRoute: provedores ativos, requisições, erros e estado da conexão, em português e inglês (botão **PT | EN** no topo).

**Como usar:** `easy-o-route panel`, ou `./start.sh` (Linux/macOS) / `.\start.ps1` (Windows) dentro desta pasta, e abra <http://localhost:8090>.

**Conectar ao OmniRoute:** no OmniRoute, menu lateral esquerdo → **Configurações → Token de acesso → Criar token** (nome `Easy-o-Route`, permissão **Administração – Gerenciar**, expiração opcional). Copie o token (`oma_live_…`, aparece uma vez) e cole em **Conectar OmniRoute → Token → Conectar**.

**Botão do rodapé:** vermelho = sem acesso · âmbar = OmniRoute responde mas falta o token · verde = conectado e validado.

**Quando der erro:** clique na requisição com erro (ou em **Como resolver um erro**) para ver a causa provável, os passos e um botão para buscar a solução na web.

Nunca cole tokens ou chaves de API em chats ou issues. Se alguma vazar, revogue no OmniRoute e crie outra.
