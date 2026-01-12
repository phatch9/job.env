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

