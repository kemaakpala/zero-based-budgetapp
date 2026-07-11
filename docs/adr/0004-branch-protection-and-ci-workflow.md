# Branch protection and automated CI workflow

The main branch of the repository is protected to require a pull request before merging, including for administrators. Direct commits/pushes to the main branch are blocked. A GitHub Actions CI workflow is configured to run formatting, linting, tests, vulnerability audits, and build checks automatically on every pull request targeting the main branch.

This was chosen to transition the project from a direct-commit model to a disciplined feature-branch model. Even though the project has a single contributor initially, this enforces strict verification of all code changes before they land in the main branch. It prevents accidental regression, enforces clean commits, and prepares the repository for seamless onboarding of future contributors.

The trade-off is a slight increase in development friction: even simple changes (like document tweaks) must go through a pull request and wait for CI checks to pass. To keep this friction minimal, we chose not to require pull request approvals (allowing the solo developer to merge their own pull requests once CI is green) and configured the pre-commit and pre-push hooks to catch issues locally before they reach GitHub.
