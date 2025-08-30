# Branch Protection Configuration Guide

## Overview

This document provides the configuration settings for GitHub branch protection rules to ensure code quality and enforce the CI/CD pipeline as a required step for PR merges.

## Branch Protection Rules

### Main Branch Protection

Configure the following settings for the `main` branch:

#### Required Status Checks
- ✅ **Require status checks to pass before merging**
- ✅ **Require branches to be up to date before merging**

**Required Checks:**
```
CI/CD Pipeline / quality-gates
CI/CD Pipeline / unit-tests
CI/CD Pipeline / build-verification
CI/CD Pipeline / integration-tests
CI/CD Pipeline / pr-status-check
```

#### Pull Request Requirements
- ✅ **Require a pull request before merging**
- ✅ **Require approvals: 1**
- ✅ **Dismiss stale PR approvals when new commits are pushed**
- ✅ **Require review from code owners** (if CODEOWNERS file exists)

#### Additional Restrictions
- ✅ **Restrict pushes that create files larger than 100MB**
- ✅ **Require signed commits** (recommended for security)
- ✅ **Require linear history** (optional, for cleaner git history)
- ✅ **Allow force pushes: Disabled**
- ✅ **Allow deletions: Disabled**

#### Administrative Settings
- ✅ **Include administrators** (applies rules to repo admins too)

## Configuration Steps

### 1. Navigate to Branch Protection Settings
1. Go to your GitHub repository
2. Click **Settings** tab
3. Select **Branches** from the left sidebar
4. Click **Add rule** or edit existing rule for `main`

### 2. Configure Branch Name Pattern
```
Branch name pattern: main
```

### 3. Enable Required Status Checks
Check the box: **Require status checks to pass before merging**

Add these required status checks:
- `CI/CD Pipeline / quality-gates`
- `CI/CD Pipeline / unit-tests` 
- `CI/CD Pipeline / build-verification`
- `CI/CD Pipeline / integration-tests`
- `CI/CD Pipeline / pr-status-check`

### 4. Configure Pull Request Settings
- **Require a pull request before merging**: ✅
- **Required number of approvals before merging**: `1`
- **Dismiss stale PR approvals when new commits are pushed**: ✅
- **Require review from code owners**: ✅ (if applicable)

### 5. Additional Protection Settings
- **Restrict pushes that create files larger than 100MB**: ✅
- **Require signed commits**: ✅ (recommended)
- **Require linear history**: ✅ (optional)
- **Allow force pushes**: ❌
- **Allow deletions**: ❌
- **Include administrators**: ✅

## Develop Branch Protection (Optional)

If using a `develop` branch for integration:

#### Required Status Checks
```
CI/CD Pipeline / quality-gates
CI/CD Pipeline / unit-tests
CI/CD Pipeline / build-verification
CI/CD Pipeline / integration-tests
```

#### Pull Request Requirements
- ✅ **Require a pull request before merging**
- ✅ **Require approvals: 1**
- ✅ **Dismiss stale PR approvals when new commits are pushed**

## CODEOWNERS File (Optional)

Create `.github/CODEOWNERS` to automatically request reviews:

```
# Global owners
* @team-lead @senior-dev

# Documentation
*.md @tech-writer @team-lead

# Core extension files
src/extension.ts @senior-dev @architect
src/analysis/ @senior-dev
src/utils/ @team-lead

# Configuration and CI/CD
.github/ @devops-lead @team-lead
package.json @team-lead
jest.config.js @senior-dev

# Tests
tests/ @qa-lead @senior-dev
```

## Verification

After configuring branch protection:

1. **Test PR Creation**: Create a test PR and verify all checks are required
2. **Test Status Checks**: Ensure CI/CD pipeline runs automatically on PR creation
3. **Test Merge Blocking**: Verify that PRs cannot be merged if checks fail
4. **Test Review Requirements**: Confirm that approval is required before merge

## Troubleshooting

### Status Checks Not Appearing
- Ensure the GitHub Actions workflow has run at least once
- Check that the job names in the workflow match the required status checks
- Verify the workflow triggers on `pull_request` events

### Checks Always Failing
- Review the GitHub Actions logs for specific error messages
- Ensure all required secrets and environment variables are configured
- Check that the workflow file syntax is correct

### Unable to Merge Despite Green Checks
- Verify all required status checks are actually passing
- Check if branch is up to date with base branch
- Ensure all review requirements are met

## Security Considerations

1. **Signed Commits**: Require signed commits for enhanced security
2. **Administrator Inclusion**: Include administrators in branch protection rules
3. **Review Requirements**: Require at least one approval from code owners
4. **Status Check Requirements**: Ensure all CI/CD checks must pass

## Maintenance

- **Regular Review**: Review and update branch protection rules quarterly
- **Status Check Updates**: Update required status checks when workflow changes
- **Team Changes**: Update CODEOWNERS file when team structure changes
- **Security Audit**: Regularly audit branch protection settings for security compliance

---

**Last Updated**: 2025-08-30  
**Version**: 1.0  
**Maintainer**: DevOps Team
