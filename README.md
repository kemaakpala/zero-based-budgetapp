# Every Pound (£) — Zero-Based Budget App

A personal budgeting app built on the zero-based principle: every pound of income is assigned a job before the month begins. Users set a Starting Salary, organise their spending into Budget Groups and Budget Items, then track actual Transactions against those assignments throughout the Budget Cycle.

## Prerequisites

- **Node.js** v22+ (developed on v22.19)
- **npm** (ships with Node)

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server (http://localhost:3000)
npm start
```

The app uses localStorage for all persistence — there is no backend or database to configure.

## Running Tests

```bash
# Run the full test suite
npm test
```

- Test runner: **Vitest** with **jsdom**
- DOM assertions: **@testing-library/react**
- Tests live alongside their source files (e.g. `Button/Button.test.jsx`)

### Testing Philosophy: TDD

This project follows **test-driven development**. When building features or fixing bugs:

1. **Red** — write a failing test that describes the desired behaviour
2. **Green** — write the minimum code to make it pass
3. **Refactor** — clean up while keeping tests green

Write tests before implementation, not after. Test observable behaviour (what the user sees, what the function returns), not implementation details.

> **AI agents**: Use the `tdd` skill when building features or fixing bugs.

## Developer Best Practices

### Project Structure

```
src/
├── Component/          # Presentational components (receive props, render UI)
│   └── index.jsx       # Barrel export — register new components here
├── Container/          # Stateful page-level containers (own state, pass it down)
├── Settings/           # Setup wizard / template editor
├── Layout/             # App shell (header, nav, footer)
├── Routes/             # Router configuration
├── Error/              # Error boundary page
├── utils/              # Business logic, helpers, constants
└── mocks/              # Test fixture data
```

For the full architecture rules (state management, derived values, persistence, month isolation), see [`AGENTS.md`](AGENTS.md). Those rules apply to all contributors — human and AI alike.

### Adding a New Component

1. Create a folder under `src/Component/` named after the component (e.g. `MyWidget/`)
2. Add the component file: `MyWidget/MyWidget.jsx`
3. Add styles in a `styles/` subdirectory: `MyWidget/styles/MyWidget.css`
4. Add a test file: `MyWidget/MyWidget.test.jsx`
5. **Register it in the barrel file** at `src/Component/index.jsx` — this is how other parts of the app import components

### CSS Conventions

- **Vanilla CSS only** — no Tailwind, no CSS-in-JS
- Stylesheets are **co-located** with their components in a `styles/` subdirectory
- Global styles and CSS custom properties live in `src/index.css` and `src/App.css`
- No strict naming convention (e.g. BEM) is enforced, but keep class names descriptive and scoped to the component

### Formatting

- **Prettier** handles all code formatting
- **Husky + lint-staged** runs Prettier automatically on staged files at commit time
- You don't need to run Prettier manually — just commit and it formats for you
- If you want to format everything: `npx prettier --write "src/**/*.{js,jsx,css,json,md}"`

### Domain Language

The project uses a strict glossary of domain terms (Budget Group, Budget Item, Payee, Remaining, etc.). Before writing code, read [`CONTEXT.md`](CONTEXT.md) so your naming aligns with the established language.

### Architectural Decisions

Non-obvious design choices are recorded as ADRs in [`docs/adr/`](docs/adr/). Check these before proposing changes to core patterns like data persistence or month initialisation.

### Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. Every commit message must follow this structure:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Common types include:
- `feat`: A new feature for the user
- `fix`: A bug fix for the user
- `docs`: Changes to documentation
- `style`: Formatting, missing semi-colons, etc. (no production code change)
- `refactor`: Refactoring production code (no bug fix or new feature)
- `test`: Adding missing tests or refactoring existing tests
- `chore`: Updating build tasks, package manager configs, Husky setup, etc. (no production code change)

> **AI agents**: Always format your commit messages using the Conventional Commits specification.

## Workflow


- **Branch strategy**: Commit directly to `main` (CI and branch protection are planned for the future)
- **Commit Messages**: Follow the Conventional Commits specification (see above)
- **Before committing**: Run `npm test` to make sure you haven't broken anything
- **Formatting**: Handled automatically by Husky on commit

## Documentation Map

| Document | Purpose |
|----------|---------|
| [`CONTEXT.md`](CONTEXT.md) | Domain glossary — the single source of truth for terminology |
| [`AGENTS.md`](AGENTS.md) | Architecture rules, data shapes, and coding conventions |
| [`docs/adr/`](docs/adr/) | Architectural Decision Records |
| [`FUTURE_IMPROVEMENTS.md`](FUTURE_IMPROVEMENTS.md) | Planned features and deferred work |
