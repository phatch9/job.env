# CI/CD Documentation

This document explains the Continuous Integration and Continuous Deployment pipeline for JobHunt.

## Overview

JobHunt uses GitHub Actions for automated testing, validation, and deployment. Our CI/CD pipeline enforces strict quality gates to maintain code quality and reliability.

## Workflows

### 1. CI Workflow (`ci.yml`)

**Triggers:**

- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

**Jobs:**

#### Quality Gates

Runs on every push and PR:

```yaml
- ESLint validation (zero errors/warnings)
- TypeScript type checking (zero errors)
- All tests passing
- Test coverage report (optional Codecov upload)
- Production build verification
```

**Node.js Version:** 20.x

**Timeout:** 10 minutes

#### Commit Lint

Validates commit messages on PRs:

```yaml
- Validates all commits in the PR
- Ensures Conventional Commits format
- Blocks merge if commit messages invalid
```

**Runs:** Only on pull requests

**Timeout:** 5 minutes
#### Commit Lint

Validates commit messages on PRs:

```yaml
- Validates all commits in the PR
- Ensures Conventional Commits format
- Blocks merge if commit messages invalid
```

**Runs:** Only on pull requests

**Timeout:** 5 minutes

#### Docker Build

Tests Docker image build:

```yaml
- Builds Docker image
- Caches layers for performance
- Ensures Dockerfile is valid
```

**Timeout:** 15 minutes

#### All Checks Passed

Final gate that:

- Waits for all jobs to complete
- Fails if any job failed
- Required for PR merge

### 2. Deploy Workflow (`deploy.yml`)

**Triggers:**

- Push to `main` branch
- Manual workflow dispatch

**Process:**

1. Run quality gates (lint, typecheck, test)
2. Deploy to Vercel production
3. Post-deployment notification

**Requirements:**

Vercel secrets must be configured:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

**Timeout:** 10 minutes

## Local Quality Enforcement

### Pre-commit Hooks (Husky)

**Installed:** Automatically via `yarn install`

**Hooks:**

#### `.husky/pre-commit`

Runs before every commit:

1. **Lint-staged**: Auto-fix and format changed files
2. **ESLint**: Validate all code
3. **TypeScript**: Type checking
4. **Tests**: Run test suite

If any step fails, commit is blocked.

#### `.husky/commit-msg`

Validates commit message format:

- Enforces Conventional Commits
- Checks message structure
- Validates commit type
- Ensures subject line length

### Lint-staged Configuration

Auto-fixes and formats staged files:

```json
{
  "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md,yml,yaml}": ["prettier --write"]
}
```

## Commit Message Standards

### Format

```
<type>: <subject>

[optional body]

[optional footer]
```

### Required Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style (formatting)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test changes
- `build`: Build system changes
- `ci`: CI/CD changes
- `chore`: Other changes
- `revert`: Revert previous commit

### Rules

- Subject line max 100 characters
- Use lowercase for type
- No period at end of subject
- Use imperative mood ("add" not "added")
- Body and footer separated by blank line

### Examples

```bash
# Good
feat: add drag-and-drop to kanban board
fix: resolve authentication redirect loop
docs: update setup instructions

# Bad
Add feature      # Missing type
feat: Added.     # Wrong mood, has period
FEAT: change     # Uppercase type
```