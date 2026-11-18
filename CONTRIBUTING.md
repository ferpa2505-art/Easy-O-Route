# Contributing to Easy‑O‑Route

Thank you for your interest in improving **Easy‑O‑Route**! This guide explains how to set up the project locally, propose changes, and follow our best practices.

## 1. Code of Conduct

We expect all contributors to adhere to the [Contributor Code of Conduct](CODE_OF_CONDUCT.md). Please treat others with respect and consideration.

## 2. Getting Started

1. Fork the repository and clone your fork:
   ```bash
   git clone https://github.com/ferpa2505-art/Easy-O-Route.git
   cd Easy-O-Route
   ```
2. Create a new branch for your feature:
   ```bash
   git checkout -b feature/my-awesome-change
   ```

## 3. Development Environment

- **Node.js** ≥ 22.x (recommended 24.x).
- **npm** & **tsc** are already bundled through the scripts in the repo.

Install dependencies:

```bash
npm install
```

## 4. Code Style & Linting

We use:
- **TypeScript** for all source files.
- **ESLint** + **Prettier** for linting and formatting.

Run:

```bash
npm run lint     # lint all files
npm run format   # fix formatting
```

All changes **must** pass linting and formatting before merging.

## 5. Testing

Run the test suite with:

```bash
npm test
```

Add new tests for any new functionality. All tests must pass locally before submitting a PR.

## 6. Pull Requests

1. **Descriptions:** Use clear, concise titles.
2. **Scope:** Keep PRs focused on a single feature or bug fix.
3. **Documentation:** Update or add docs as needed.
4. **Commit Messages:** Follow conventional‑commits format (e.g., `feat: ...`, `fix: ...`).
5. **CI Checks:** Ensure the GitHub Actions CI passes.

After your PR lands, a reviewer will ensure that it meets the style guide and passes all checks. Once approved, it will be merged to `main`.

## 7. Issue Reporting

- Use the GitHub issue template.
- Provide a minimal reproducible example.
- Specify the expected behavior and the observed issue.

## 8. Contact

For general questions or support, feel free to open an issue or reach out on discussions.

Happy coding! 🚀