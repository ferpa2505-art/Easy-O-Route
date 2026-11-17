# Changelog

All notable changes to this project are documented here.

## [1.0.1]

### Fixed
- Build failed because of unused imports in an unregistered command.
- Hardcoded OmniRoute version checks replaced by a single constant (`OMNIROUTE.VERSION`).
- `setup.sh` and `start.sh` had Windows line endings, which broke them under bash.
- Installing from GitHub (`npm install -g <repo-url>`) did not build `dist/`; added a `prepare` script.
- npm package included internal files; added an explicit `files` list.
- CI ignored lint and test failures and auto-published on every push to `main`. Publishing now runs only when a release is published.
- Documentation index listed chapters that do not exist.

### Added
- `check` command to verify the OmniRoute installation, version, running status, environment, connected providers, combos and autostart; it also runs `omniroute doctor` and suggests fixes (`--fix`).
- `providers` command (free-provider suggestions, setup guide, `--check`).
- ESLint and Jest configuration, with initial tests for the free-provider catalog.
- `.gitattributes` to keep LF line endings in the repository.
- English README.

## [1.0.0]
- First public release.
