# Easy-O-Route

> **A friendly setup helper for [OmniRoute](https://github.com/cheaper-inference/OmniRoute): route your AI requests through free providers first and paid ones last.**

[![GitHub stars](https://img.shields.io/github/stars/ferpa2505-art/Easy-O-Route?style=social)](https://github.com/ferpa2505-art/Easy-O-Route/stargazers)
[![GitHub license](https://img.shields.io/github/license/ferpa2505-art/Easy-O-Route)](https://github.com/ferpa2505-art/Easy-O-Route/blob/main/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/ferpa2505-art/Easy-O-Route)](https://github.com/ferpa2505-art/Easy-O-Route/issues)
[![npm version](https://img.shields.io/npm/v/easy-o-route?label=npm)](https://www.npmjs.com/package/easy-o-route)
[![npm downloads](https://img.shields.io/npm/dw/easy-o-route)](https://www.npmjs.com/package/easy-o-route)

---

## What is Easy-O-Route?

**Easy-O-Route** is a command-line tool (CLI) and a set of Bash scripts that make it easier to install, configure and check [OmniRoute](https://github.com/cheaper-inference/OmniRoute), an AI gateway that lets you use several AI providers (Mistral, Groq, Google, NVIDIA, OpenRouter, and others) through one local endpoint.

The idea is simple: put **free providers first** in your fallback queue (a *combo*) and paid providers last, so you only pay when everything else fails.

> The project is based on the Portuguese guide *"IA BARATA de Verdade"* (see [`docs/`](docs/)). The documentation is currently written in Portuguese.

---

## Why use it?

- **Lower AI costs.** Free providers are tried first. The author reports an 89% cost reduction in their own usage (see [Author's reported results](#authors-reported-results)).
- **No deep technical knowledge required.** Short commands with clear output.
- **Local and under your control.** OmniRoute runs on your machine (`http://localhost:20128`), and you choose which providers are used.
- **Checks your setup.** `check` verifies your installation and suggests fixes.

---

## Requirements

- **Node.js 18 or newer** (for the CLI)
- **OmniRoute** installed (`easy-o-route setup` can install it for you)
- API keys from the providers you want to use (keep them in a password manager)

---

## Installation

### Option 1: Global install from npm (recommended)

```bash
npm install -g easy-o-route

# Check the installed version
easy-o-route --version
```

### Option 2: Install directly from GitHub

```bash
npm install -g https://github.com/ferpa2505-art/Easy-O-Route.git
```

### Option 3: Local development setup

```bash
git clone https://github.com/ferpa2505-art/Easy-O-Route.git
cd Easy-O-Route

npm install
npm run build

# Run the compiled CLI
node dist/index.js --help

# Optional: make the `easy-o-route` command available globally from this folder
npm link
```

### Option 4: Bash scripts only (no Node.js CLI)

```bash
curl -L https://raw.githubusercontent.com/ferpa2505-art/Easy-O-Route/main/scripts/setup.sh -o setup.sh
chmod +x setup.sh
./setup.sh
```

---

## Quick start

```bash
# 1. Install and configure OmniRoute
easy-o-route setup

# 2. Check that everything is working
easy-o-route check

# 3. See which free providers are available and how to add them
easy-o-route providers --recommended
easy-o-route providers --setup-guide

# 4. Watch your providers and requests live in the topology panel
easy-o-route panel
```

---

## Commands

```
Usage: easy-o-route [options] [command]

Commands:
  setup       Initial OmniRoute setup
  status      Show OmniRoute status
  check       Check the OmniRoute setup and suggest improvements
  providers   List, check and suggest AI providers (free and paid)
  panel       Start the live topology panel (providers, requests, errors)
  version     Show the Easy-O-Route version
  help        Display help

Options:
  -v, --version   Output the current version
  -d, --debug     Enable debug mode
  -h, --help      Display help for a command
```

### `setup`

```bash
easy-o-route setup                   # Full setup
easy-o-route setup --skip-omniroute  # Configure without installing OmniRoute
easy-o-route setup --force           # Reinstall
easy-o-route setup --autostart       # Start OmniRoute automatically
```

### `status`

```bash
easy-o-route status
easy-o-route status --verbose
```

### `check`

```bash
easy-o-route check           # Run all checks (installation, running service, Node.js, etc.)
easy-o-route check --verbose # More details
easy-o-route check --fix     # Try to fix issues automatically
```

### `providers`

```bash
easy-o-route providers                 # List providers
easy-o-route providers --free-only     # Only free providers
easy-o-route providers --recommended   # Recommended providers
easy-o-route providers --list-all      # All known providers
easy-o-route providers --setup-guide   # Quick setup guide, including a suggested "economico" combo
easy-o-route providers --check         # Check connected providers and suggest improvements
easy-o-route providers --add groq      # Instructions for adding one provider
```

---

## Topology panel

A live, bilingual (English / Portuguese) view of your OmniRoute: every active provider, the requests flowing through it and the connection state. New providers appear on their own when you add them in OmniRoute.

```bash
easy-o-route panel                      # opens http://localhost:8090
easy-o-route panel --port 9000 --omni-url http://localhost:20128
```

No CLI installed? Download the repository and run `panel/start.sh` (Linux/macOS) or `panel\start.ps1` (Windows). Only Node.js is needed.

### Connect it to OmniRoute (one time)

1. In OmniRoute, open the left side menu → **Settings → Access token → Create token**.
   Name: `Easy-o-Route` · Permission: **Administration – Manage** · Expiration: optional.
2. Copy the token (`oma_live_…`). It is shown only once.
3. Paste it in the panel (**Connect OmniRoute** → Token → **Connect**), or type it when the command asks, or set the `OMNIROUTE_TOKEN` environment variable.

The button in the footer tells you where you are: **red** = no access to OmniRoute, **amber** = OmniRoute answers but needs the token, **green** = connected and validated.

### What you get

- Providers and requests read from OmniRoute every 4 seconds; providers added or removed in OmniRoute show up or disappear automatically.
- Animated pipes between OmniRoute and each provider (request out, response back) and a tag with the model used.
- **When something fails**, click the failed request (or **How to fix an error**) to see the likely cause, step-by-step fixes and a button to search the web for a solution.
- Minimize the System and Requests panels to the footer, switch language (PT / EN) and theme (dark / medium / light).

### Security

- The panel listens on `127.0.0.1` only, answers only to `localhost` Host headers, and forwards only `GET` requests to a fixed list of read-only OmniRoute routes.
- The token is never written to disk. It lives in the environment of the panel process or in the browser page you pasted it into.
- Do not paste tokens or API keys in chats or issues. If one leaks, revoke it in OmniRoute and create a new one.

| Option | Meaning | Default |
|---|---|---|
| `-p, --port <port>` | Port of the panel | `8090` |
| `--omni-url <url>` | OmniRoute address | `http://localhost:20128` |
| `--no-open` | Do not open the browser | |
| `--no-token-prompt` | Do not ask for the token | |

---

## Example combo (fallback queue)

The CLI suggests an "economico" combo that uses free providers. You can create it in the OmniRoute dashboard at `http://localhost:20128` (Combos → New combo):

```yaml
combo: economico
description: Free providers for token savings
providers:
  - groq:       [llama-3.1-8b-instant, mixtral-8x7b-instruct-v0.1]
  - mistral:    [mistral-tiny, mistral-small]
  - openrouter: [openai/gpt-3.5-turbo, anthropic/claude-3-haiku]
  - together:   [meta-llama/Llama-3.1-8B-Instruct]
```

Model names and free-tier limits change often. Always check each provider's current documentation.

---

## Security

- **Never share API keys** in chats, issues, pull requests or screenshots.
- **Never commit keys** to Git. Use environment variables or a password manager.
- **Change the default OmniRoute password** (`CHANGEME`) on first access.
- **Use only official API keys.** Avoid "web" providers that rely on browser cookies.
- **Do not send sensitive data to free providers.** Check each provider's terms and data policy.

To report a vulnerability, please read [SECURITY.md](SECURITY.md) and do not open a public issue.

---

## Documentation

The guides are currently in Portuguese:

- [Documentation index](docs/README.md)
- [Quick guide](docs/GUIA-RAPIDO.md)
- [Installation guide](docs/INSTALACAO.md)
- Chapters 01–05 (concepts, OmniRoute, installation, first access) in [`docs/`](docs/)

---

## Project structure

```
src/
  index.ts              CLI entry point
  commands/             setup, status, check, providers, version, panel
  utils/                config, constants, logger, free-provider catalog
panel/                  topology panel: server.js, public/ (web page), start.sh, start.ps1
scripts/                setup.sh and start.sh (Bash, no Node.js needed)
docs/                   user guides (Portuguese)
.github/workflows/      CI: build, lint and publish
```

---

## Development

```bash
npm install
npm run build      # compile TypeScript to dist/
npm run dev        # run src/index.ts with ts-node
npm run lint       # ESLint
npm test           # Jest
```

Contributions are welcome:

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: describe your change"`
4. Push the branch: `git push origin feature/your-feature`
5. Open a pull request

Please open an issue first for larger changes.

---

## Author's reported results

These numbers come from the author's own usage. They have not been independently verified and will vary with your models, limits and workload.

| Metric | Value |
|--------|-------|
| Input tokens | 260.7 million |
| Output tokens | 1.3 million |
| Requests | 6,623 |
| Success rate (with combo) | 68% |
| List-price cost | US$ 63.07 |
| Real cost (free providers) | US$ 0.00 |
| Reported saving | 89% (vs. US$ 113.58 before) |

---

## License

Released under the [MIT License](LICENSE).

---

## Acknowledgements

- [OmniRoute](https://github.com/cheaper-inference/OmniRoute), the AI gateway this tool is built for
- [Fernando Paulino](https://github.com/ferpa2505-art), author of the guide *"IA BARATA de Verdade"*
- The open-source AI community

---

<div align="center">
  <p><strong>Easy-O-Route</strong>: the friendly helper for OmniRoute</p>
</div>
