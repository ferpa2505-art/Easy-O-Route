# Changelog

All notable changes to **Easy-O-Route** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] - 2026-11-22

### Added

- `easy-o-route panel`: a live topology panel for OmniRoute (providers, requests, connection state) with an English/Portuguese switch, three themes, minimizable panels and animated pipes. Providers added or removed in OmniRoute appear and disappear on their own.
- "How to fix an error": click a failed request (or the button in the Connect OmniRoute panel) to see the likely cause, step-by-step fixes and a web-search button.
- `panel/start.sh` and `panel/start.ps1` to run the panel with only Node.js installed; they ask for the OmniRoute token with hidden input and keep it in memory only.

### Removed

- The old standalone dashboard in `docs/` (`dashboard.html`, `servidor.js`, `servidor.py`, `iniciar.bat`, `config.json`). It is replaced by `easy-o-route panel`. Its `config.json` stored a `token` field in the repository.

### Security

- The panel server listens on `127.0.0.1`, only answers to `localhost` Host headers and forwards only `GET` requests to a fixed list of read-only OmniRoute routes. The token is never written to disk.

## [1.0.1] - 2026-11-18

### Added

- English translations for all documentation files.
- `CONTRIBUTING.md` with contribution guidelines.
- `CHANGELOG.md` to track project changes.

### Changed

- Updated installation instructions in `INSTALACAO.md`.
- Improved provider setup guide in `GUIA-RAPIDO.md`.

### Fixed

- Corrected links in `README.md` to point to English versions.

## [1.0.0] - 2026-11-17

Initial release of **Easy-O-Route** with:

- CLI for OmniRoute configuration.
- Provider management commands.
- Combo creation and testing.
- Documentation in Portuguese.

[Unreleased]: https://github.com/ferpa2505-art/Easy-O-Route/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/ferpa2505-art/Easy-O-Route/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/ferpa2505-art/Easy-O-Route/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/ferpa2505-art/Easy-O-Route/releases/tag/v1.0.0

