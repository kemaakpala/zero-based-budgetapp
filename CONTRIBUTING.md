# Contributing Guidelines

Thank you for contributing to the Every Pound (£) Zero-Based Budget App! To maintain code quality, consistency, and a stable `main` branch, we follow a strict feature-branch and pull request workflow. These rules apply to both human developers and AI coding agents.

---

## The Branch & Pull Request Workflow

We enforce branch protection on the `main` branch. Direct pushes to `main` are blocked. All changes must be proposed via a Pull Request (PR).

1. **Create a Feature Branch:**
   Branch off of `main` with a descriptive name:

   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/your-bugfix-name
   ```

2. **Develop and Commit Locally:**
   Write code following the domain glossary in [CONTEXT.md](CONTEXT.md) and architectural guidelines in [AGENTS.md](AGENTS.md).
   - A local **pre-commit hook** (via Husky) will automatically run Prettier to format your staged files.

3. **Push and Verify Locally:**
   When you run `git push`, a local **pre-push hook** will automatically execute linting and tests:

   ```bash
   npm run lint
   npm test
   ```

   If either command fails, the push is aborted. Fix the issues locally before attempting to push again.

4. **Open a Pull Request:**
   Submit a PR from your branch targeting `main`.

5. **Wait for CI Status Checks:**
   A GitHub Actions CI workflow triggers on every PR to verify:
   - Formatting checks (`prettier --check`)
   - ESLint linting (`eslint src --max-warnings=0`)
   - Vitest test suite (`vitest run`)
   - Vulnerability audit (`npm audit --audit-level=high`)
   - Clean build check (`npm run build`)

6. **Merge the PR:**
   Once all status checks turn green, the PR is ready to merge. We recommend using **Squash and Merge** to keep the history clean.

---

## Local Verification Commands

To run the verification checks manually before committing or pushing:

- **Format Check:** `npx prettier --check .`
- **Lint Check:** `npm run lint`
- **Run Tests:** `npm test`
- **Security Audit:** `npm audit --audit-level=high`
- **Build Check:** `npm run build`
