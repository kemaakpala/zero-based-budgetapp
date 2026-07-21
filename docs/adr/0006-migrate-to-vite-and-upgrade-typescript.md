# 6. Migrate build tool to Vite and upgrade TypeScript to v6.0.0

## Status

Accepted

## Context

The application was bootstrapped with Create React App (CRA), which uses `react-scripts`. CRA has been deprecated and its webpack-based build times are slow. We need to migrate the build system to Vite to speed up local development and production compilation. Additionally, we want to upgrade TypeScript to a modern, stable version that supports the ecosystem cleanly without version mismatch warnings.

## Decision

We decided to perform an in-place migration in the existing repository (preserving full git commit history) rather than porting files to a new repository. We will:

1. Uninstall `react-scripts` and install `vite` alongside React 19 plugins.
2. Move the HTML entry point from `public/index.html` to `./index.html` at the project root, updating its references to static assets and injecting the index script module.
3. Configure the Vite dev server to run on port `3000` to maintain compatibility with our Playwright E2E configuration, and configure the production build to compile to the `/build` directory.
4. Upgrade `typescript` to `^6.0.0` (which provides a stable programmatic API for `typescript-eslint` compatibility) rather than `v7.0.0`.

## Consequences

- Faster build times (Vite dev server start/hot module replacement).
- Simpler development tooling stack without webpack wrappers.
- The `react-scripts` dependency is removed.
- Full type-checking and stable ESLint integration without parser warnings.
