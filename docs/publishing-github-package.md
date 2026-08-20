# Publishing as a GitHub Package & CI/CD Workflows

This guide details how `vector-doc-engine` uses GitHub Actions workflows and Git hooks to automate type checking, testing, building, and publishing.

## Automated GitHub Actions Workflows

This repository includes 2 production GitHub Workflows:

### Continuous Integration (`.github/workflows/ci.yml`)

- **Triggers**: On every push and pull request to main / master.
- **Matrix**: Runs against Node.js 18.x and 20.x.
- **Tasks**:
  1. Installs dependencies (`npm ci`).
  2. Runs TypeScript type checks & compilation (`npm run build`).
  3. Verifies build artifacts in `./dist/`.

### Automated Package Publishing (`.github/workflows/publish.yml`)

- **Triggers**: On GitHub Release publish OR manual dispatch.
- **Tasks**:
  1. Compiles TypeScript package to `./dist/`.
  2. Authenticates with GitHub Packages using `${{ secrets.GITHUB_TOKEN }}`.
  3. Publishes `@dileepwick/vector-doc-engine` to `https://npm.pkg.github.com`.

## Git Pre-Commit Hooks (`.githooks/pre-commit`)

This repository uses version-controlled pre-commit hooks located in `.githooks/`.

### Enforced Checks Before Every Commit

1. `npx tsc --noEmit` (Type-checks code to prevent broken TypeScript from being committed).
2. `npm run build` (Ensures package builds cleanly to `./dist`).

### Enabling Hooks Locally

```bash
git config core.hooksPath .githooks
```

*(Automatically configured when running `npm install` via the `prepare` lifecycle script).*

## Manual Publishing Instructions

If publishing manually from your local terminal:

```bash
# 1. Compile TypeScript package into ./dist
npm run build

# 2. Authenticate with GitHub Packages registry
npm login --scope=@dileepwick --registry=https://npm.pkg.github.com

# 3. Publish package
npm publish
```

## Installing the Package in Other Projects

In any external project, create a `.npmrc` file:

```text
@dileepwick:registry=https://npm.pkg.github.com
```

Then install via `npm`:

```bash
npm install @dileepwick/vector-doc-engine
```

Or install directly via Git:

```bash
npm install git+https://github.com/DileepWick/vector-doc-engine.git
```
