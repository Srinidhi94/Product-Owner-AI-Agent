#!/bin/bash

# AI Product Owner Extension - Packaging Script
# Creates distributable .vsix package for private team distribution

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions for colored output
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_header() {
    echo -e "\n${BLUE}🏗️  $1${NC}"
    echo "================================================"
}

# Check prerequisites
check_prerequisites() {
    log_header "Checking Prerequisites"
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js 16+ and try again."
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 16 ]; then
        log_error "Node.js version 16+ is required. Current version: $(node --version)"
        exit 1
    fi
    log_success "Node.js version: $(node --version)"
    
    # Check NPM
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed. Please install npm and try again."
        exit 1
    fi
    log_success "npm version: $(npm --version)"
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        log_error "package.json not found. Please run this script from the extension root directory."
        exit 1
    fi
    
    # Check if extension name matches
    EXTENSION_NAME=$(grep '"name"' package.json | head -1 | cut -d'"' -f4)
    if [ "$EXTENSION_NAME" != "epic-bridge" ]; then
        log_error "This script is for the Epic Bridge extension. Current package: $EXTENSION_NAME"
        exit 1
    fi
    
    log_success "Prerequisites check completed"
}

# Clean previous builds
clean_build() {
    log_header "Cleaning Previous Build"
    
    # Remove old build artifacts
    if [ -d "out" ]; then
        rm -rf out
        log_success "Removed old 'out' directory"
    fi
    
    # Remove old .vsix files
    if ls *.vsix 1> /dev/null 2>&1; then
        rm -f *.vsix
        log_success "Removed old .vsix files"
    fi
    
    # Remove old installation guide
    if [ -f "INSTALLATION.md" ]; then
        rm -f INSTALLATION.md
        log_success "Removed old installation guide"
    fi
    
    log_success "Build cleanup completed"
}

# Install dependencies
install_dependencies() {
    log_header "Installing Dependencies"
    
    log_info "Running npm install..."
    npm install
    
    # Verify critical dependencies
    if [ ! -d "node_modules/@types/vscode" ]; then
        log_error "VS Code types not found. Extension may not compile correctly."
        exit 1
    fi
    
    log_success "Dependencies installed successfully"
}

# Compile TypeScript
compile_extension() {
    log_header "Compiling TypeScript"
    
    log_info "Running TypeScript compilation..."
    npm run compile
    
    # Verify compilation output
    if [ ! -f "out/extension.js" ]; then
        log_error "Compilation failed. out/extension.js not found."
        exit 1
    fi
    
    # Check for TypeScript errors
    if npm run compile 2>&1 | grep -q "error TS"; then
        log_error "TypeScript compilation has errors. Please fix them before packaging."
        exit 1
    fi
    
    log_success "TypeScript compilation completed"
}

# Run tests
run_tests() {
    log_header "Running Tests"
    
    if [ -f "src/test/integration.test.ts" ]; then
        log_info "Running test suite..."
        if npm test; then
            log_success "All tests passed"
        else
            log_warning "Some tests failed, but continuing with packaging..."
        fi
    else
        log_warning "No tests found, skipping test execution"
    fi
}

# Package extension
package_extension() {
    log_header "Packaging Extension"
    
    # Check if vsce is available
    if ! npx vsce --version &> /dev/null; then
        log_info "Installing vsce (Visual Studio Code Extension manager)..."
        npm install -g vsce
    fi
    
    log_info "Creating .vsix package..."
    npx vsce package --no-dependencies
    
    # Find the generated .vsix file
    EXTENSION_FILE=$(ls *.vsix | head -1)
    if [ -z "$EXTENSION_FILE" ]; then
        log_error "Failed to create .vsix package"
        exit 1
    fi
    
    # Get file size for info
    FILE_SIZE=$(ls -lh "$EXTENSION_FILE" | awk '{print $5}')
    log_success "Extension packaged: $EXTENSION_FILE ($FILE_SIZE)"
    
    # Store filename for later use
    echo "$EXTENSION_FILE" > .last-package-name
}

# Create installation documentation
create_installation_guide() {
    log_header "Creating Installation Guide"
    
    # Get extension details
    EXTENSION_FILE=$(cat .last-package-name)
    EXTENSION_VERSION=$(grep '"version"' package.json | head -1 | cut -d'"' -f4)
    CURRENT_DATE=$(date '+%Y-%m-%d')
    
    cat > INSTALLATION.md << EOF
# AI Product Owner Extension - Installation Guide

**Version:** $EXTENSION_VERSION  
**Package:** $EXTENSION_FILE  
**Generated:** $CURRENT_DATE  

## 🚨 Important Notice

This extension is for **authorized team members only**. Do not distribute outside your organization.

## Prerequisites

Before installing the Epic Bridge extension, ensure you have:

- ✅ **VS Code 1.74.0 or higher**
- ✅ **GitHub Copilot extension** installed and activated
- ✅ **Jira API access** (email + API token)
- ✅ **Go workspace** (optional but recommended for full functionality)

### Checking Prerequisites

1. **Check VS Code Version:**
   \`\`\`bash
   code --version
   \`\`\`
   Should show version 1.74.0 or higher.

2. **Verify GitHub Copilot:**
   - Open VS Code
   - Check Extensions panel for "GitHub Copilot" (should be enabled)
   - Test with any file: type a comment and see if Copilot suggestions appear

3. **Prepare Jira Access:**
   - Get your Jira API token: [https://id.atlassian.com/manage-profile/security/api-tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
   - Note your Jira email and organization URL (e.g., company.atlassian.net)

## Installation Steps

### Step 1: Download Extension
Download the extension package file: **$EXTENSION_FILE**

### Step 2: Install Extension
Choose one of the following methods:

**Method A: Command Line Installation**
\`\`\`bash
code --install-extension $EXTENSION_FILE
\`\`\`

**Method B: VS Code UI Installation**
1. Open VS Code
2. Press \`Ctrl+Shift+P\` (Windows/Linux) or \`Cmd+Shift+P\` (Mac)
3. Type "Extensions: Install from VSIX"
4. Select the downloaded \`$EXTENSION_FILE\` file
5. Click "Install"

### Step 3: Verify Installation
1. Restart VS Code
2. Look for the robot icon (🤖) in the Activity Bar (left sidebar)
3. Check Command Palette for "AI Product Owner" commands

## First Time Setup

### Configure Jira Connection
1. **Open Settings:**
   - Command Palette → "AI Product Owner: Configure Settings"
   - Or press \`Ctrl+Shift+P\` and search for "Configure Settings"

2. **Enter Jira Details:**
   \`\`\`
   Jira Base URL: your-company.atlassian.net
   Email: your-email@company.com
   API Token: your-api-token-here
   \`\`\`

   **⚠️ Important:** 
   - Don't include \`https://\` in the base URL
   - Use your actual Jira login email
   - API token will be stored securely in VS Code

3. **Test Connection:**
   - Command Palette → "Epic Bridge: Test Jira Connection"
   - Wait for confirmation: ✅ "Jira connection successful!"

### Configure Output Settings (Optional)
Customize the output directory:

\`\`\`json
{
  "epicBridge.output.directory": "./docs/analysis"
}
\`\`\`

## First Analysis

### Quick Start
1. **Open Project** (optional):
   \`\`\`bash
   code /path/to/your/go/project
   \`\`\`

2. **Start Analysis:**
   - Press \`Ctrl+Shift+A\` (Windows/Linux) or \`Cmd+Shift+A\` (Mac)
   - Or Command Palette → "AI Product Owner: Analyze Epic"

3. **Enter Epic Key:**
   - Format: \`PROJ-123\` (must include project prefix and dash)
   - Example: \`AUTH-101\`, \`BACKEND-205\`, \`USER-456\`

4. **Follow Guided Workflow:**
   - Extension will guide you through 5 analysis stages
   - Copy prompts to GitHub Copilot Chat
   - Save Copilot responses to generated files

### Expected Output
After successful analysis, you'll find:

\`\`\`
your-project/
└── docs/analysis/EPIC-KEY/
    ├── 01-business-analysis.md
    ├── 02-technical-architecture.md
    ├── 03-implementation-design.md
    ├── 04-development-plan.md
    ├── 05-risk-assessment.md
    └── analysis-summary.md
\`\`\`

## Troubleshooting

### Common Issues

#### ❌ "Extension not found in marketplace"
**Cause:** This is a private extension, not available in public marketplace.  
**Solution:** Use the .vsix file installation method described above.

#### ❌ "Jira authentication failed"
**Cause:** Invalid credentials or expired API token.  
**Solutions:**
1. Verify email address matches your Jira account
2. Check API token hasn't expired
3. Test manually:
   \`\`\`bash
   curl -u your-email@company.com:your-token \\
     https://your-company.atlassian.net/rest/api/3/myself
   \`\`\`

#### ❌ "Epic not found"
**Cause:** Epic key format or permissions issue.  
**Solutions:**
1. Use correct format: \`PROJECT-123\` (uppercase, with dash)
2. Verify you can access the epic in Jira web interface
3. Check project permissions

#### ❌ "GitHub Copilot not responding"
**Cause:** Copilot not properly activated or quota exceeded.  
**Solutions:**
1. Check Copilot extension is enabled
2. Verify Copilot subscription is active
3. Try manual prompt copy/paste workflow

#### ❌ "No Go files found"
**Cause:** No Go files in current workspace.  
**Solution:** Either open a project or continue with Jira-only analysis.

### Getting Help

1. **Check Extension Output:**
   - View → Output → Select "AI Product Owner" from dropdown
   - Look for detailed error messages

2. **Enable Debug Mode:**
   - Settings → Search "AI Product Owner" 
   - Enable "Debug: Enable Verbose Logging"
   - Retry the operation and check output

3. **Contact Support:**
   - Internal team channel: #ai-product-owner-support
   - GitHub Issues: [Extension Issues](https://github.com/your-company/ai-product-owner-extension/issues)
   - Email: dev-tools-support@your-company.com

## Update Process

When a new version is released:

1. **Uninstall Current Version:**
   \`\`\`bash
   code --uninstall-extension your-company-internal.epic-bridge
   \`\`\`

2. **Install New Version:**
   \`\`\`bash
   code --install-extension epic-bridge-NEW-VERSION.vsix
   \`\`\`

3. **Restart VS Code**

4. **Verify Update:**
   - Check version in Extensions panel
   - Test basic functionality

## Security and Compliance

- 🔒 **API tokens** are stored securely in VS Code's encrypted storage
- 🔒 **No data** is sent to external services (except configured Jira instance)
- 🔒 **All analysis** is performed locally on your machine
- 🔒 **Generated documentation** stays within your workspace

## Usage Analytics

This extension does not collect usage analytics or telemetry data. All operations are performed locally.

---

**Installation Date:** $CURRENT_DATE  
**Package Version:** $EXTENSION_VERSION  
**Support:** dev-tools-support@your-company.com  

*This extension is for authorized team members only. Do not distribute externally.*
EOF

    log_success "Installation guide created: INSTALLATION.md"
}

# Create distribution package
create_distribution_package() {
    log_header "Creating Distribution Package"
    
    EXTENSION_FILE=$(cat .last-package-name)
    EXTENSION_VERSION=$(grep '"version"' package.json | head -1 | cut -d'"' -f4)
    DIST_DIR="epic-bridge-v$EXTENSION_VERSION"
    
    # Create distribution directory
    mkdir -p "$DIST_DIR"
    
    # Copy essential files
    cp "$EXTENSION_FILE" "$DIST_DIR/"
    cp "INSTALLATION.md" "$DIST_DIR/"
    cp "README.md" "$DIST_DIR/"
    cp "CHANGELOG.md" "$DIST_DIR/"
    
    # Copy documentation
    if [ -d "docs" ]; then
        cp -r "docs" "$DIST_DIR/"
    fi
    
    # Create quick reference
    cat > "$DIST_DIR/QUICK_START.md" << EOF
# Quick Start - Epic Bridge v$EXTENSION_VERSION

## Install
\`\`\`bash
code --install-extension $EXTENSION_FILE
\`\`\`

## Configure
1. Get Jira API token: https://id.atlassian.com/manage-profile/security/api-tokens
2. Run: "Epic Bridge: Configure Settings"
3. Test: "Epic Bridge: Test Jira Connection"

## Use
1. Press Ctrl+Shift+A
2. Enter epic key (e.g., PROJ-123)
3. Follow 5-stage guided workflow

See INSTALLATION.md for complete setup instructions.
EOF
    
    # Create archive
    if command -v zip &> /dev/null; then
        zip -r "$DIST_DIR.zip" "$DIST_DIR"
        log_success "Distribution package created: $DIST_DIR.zip"
    else
        log_warning "zip command not found. Distribution directory created: $DIST_DIR"
    fi
    
    log_success "Distribution package ready"
}

# Cleanup temporary files
cleanup() {
    log_header "Cleanup"
    
    if [ -f ".last-package-name" ]; then
        rm -f ".last-package-name"
    fi
    
    log_success "Cleanup completed"
}

# Main execution
main() {
    echo -e "${BLUE}"
    echo "================================================"
    echo "🚀 AI Product Owner Extension - Packaging Script"
    echo "================================================"
    echo -e "${NC}"
    
    check_prerequisites
    clean_build
    install_dependencies
    compile_extension
    run_tests
    package_extension
    create_installation_guide
    create_distribution_package
    cleanup
    
    echo -e "\n${GREEN}🎉 Packaging Complete!${NC}"
    echo "================================================"
    
    EXTENSION_FILE=$(ls *.vsix | head -1)
    EXTENSION_VERSION=$(grep '"version"' package.json | head -1 | cut -d'"' -f4)
    
    echo -e "${GREEN}✅ Extension Package:${NC} $EXTENSION_FILE"
    echo -e "${GREEN}✅ Version:${NC} $EXTENSION_VERSION"
    echo -e "${GREEN}✅ Installation Guide:${NC} INSTALLATION.md"
    echo -e "${GREEN}✅ Distribution Package:${NC} epic-bridge-v$EXTENSION_VERSION/"
    
    echo -e "\n${BLUE}Next Steps:${NC}"
    echo "1. Test the extension: code --install-extension $EXTENSION_FILE"
    echo "2. Distribute to team members with INSTALLATION.md"
    echo "3. Update internal documentation with new version"
    
    echo -e "\n${YELLOW}📋 Remember:${NC}"
    echo "- This is a private extension for authorized team members only"
    echo "- Include INSTALLATION.md with distribution"
    echo "- Update CHANGELOG.md before next release"
}

# Run main function
main "$@" 