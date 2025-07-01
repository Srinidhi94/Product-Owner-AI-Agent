# AI Product Owner Extension - Local Testing Guide

## 🎯 Quick Answer
**NO**, you do **NOT** need to publish to the VS Code marketplace to test locally! You can install the extension directly from the `.vsix` file we just created.

## 📦 What We Have Ready

✅ **Extension Package**: `ai-product-owner-agent-1.0.0.vsix` (5.84MB)  
✅ **TypeScript Compiled**: All source code compiled successfully  
✅ **Dependencies Bundled**: Extension is self-contained  
✅ **Production Ready**: All development references cleaned up  

## 🚀 Step-by-Step Local Testing

### Step 1: Install the Extension Locally

**Method A: VS Code Command Line**
```bash
# From the project directory
code --install-extension ai-product-owner-agent-1.0.0.vsix
```

**Method B: VS Code UI**
1. Open VS Code
2. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
3. Type "Extensions: Install from VSIX..."
4. Select the file: `ai-product-owner-agent-1.0.0.vsix`
5. Click "Install"
6. **Restart VS Code** when prompted

### Step 2: Verify Installation
After restart, you should see:
- 🤖 **Robot icon** in the Activity Bar (left sidebar)
- **"AI Product Owner"** in the Extensions list
- Commands available in Command Palette

### Step 3: Configure Jira Connection

**3.1 Get Jira API Token**
1. Go to: [https://id.atlassian.com/manage-profile/security/api-tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Click "Create API token"
3. Label it: "AI Product Owner Extension"
4. Copy the generated token

**3.2 Configure Extension**
1. Press `Ctrl+Shift+P` → "AI Product Owner: Configure Settings"
2. Enter your details:
   ```
   Jira Base URL: your-company.atlassian.net
   Email: your-email@company.com
   API Token: [paste your token]
   ```

**3.3 Test Connection**
1. Press `Ctrl+Shift+P` → "AI Product Owner: Test Jira Connection"
2. Wait for: ✅ "Jira connection successful!"

### Step 4: Run Your First Analysis

**4.1 Prepare Test Environment**
```bash
# Option 1: Use with existing Go project
cd /path/to/your/go/project
code .

# Option 2: Use without Go project (Jira-only analysis)
# Just open any folder in VS Code
```

**4.2 Start Analysis**
1. Press `Ctrl+Shift+A` (the extension's keyboard shortcut)
2. Or Command Palette → "AI Product Owner: Analyze Epic"
3. Enter an epic key: `PROJ-123` (replace with real epic from your Jira)

**4.3 Follow the Workflow**
The extension will guide you through:
1. **Jira Data Fetching**: Retrieves epic and stories
2. **Codebase Analysis**: Scans Go files (if available)
3. **Prompt Generation**: Creates comprehensive analysis prompt
4. **GitHub Copilot Integration**: Copy prompt to Copilot Chat
5. **Documentation Generation**: Saves results to markdown files

## 🧪 Testing Scenarios

### Test 1: Basic Functionality
**Goal**: Verify extension loads and basic commands work
```
1. Install extension ✓
2. Open Command Palette ✓
3. Find "AI Product Owner" commands ✓
4. Check Activity Bar for robot icon ✓
```

### Test 2: Jira Integration
**Goal**: Test Jira API connectivity
```
1. Configure Jira settings ✓
2. Test connection ✓
3. Try fetching a real epic ✓
4. Verify epic data appears in output ✓
```

### Test 3: Go Codebase Analysis
**Goal**: Test static code analysis
```
1. Open folder with Go files ✓
2. Run analysis on any epic ✓
3. Verify Go files are detected ✓
4. Check codebase summary in output ✓
```

### Test 4: End-to-End Workflow
**Goal**: Complete analysis workflow
```
1. Configure Jira ✓
2. Open Go project ✓
3. Run epic analysis ✓
4. Copy generated prompt ✓
5. Use with GitHub Copilot ✓
6. Save results to files ✓
```

## 📂 Expected Output Structure

After a successful analysis, you'll find:
```
your-project/
└── docs/analysis/[EPIC-KEY]/
    ├── comprehensive-analysis.md    # Main analysis with prompts
    ├── jira-context.json           # Epic and stories data
    ├── codebase-context.json       # Go analysis results
    └── analysis-metadata.json      # Analysis metadata
```

## 🔍 Troubleshooting

### Common Issues & Solutions

**❌ "Extension not activated"**
```
Solution: Restart VS Code after installation
Command: Developer: Reload Window
```

**❌ "Jira authentication failed"**
```
Cause: Invalid email, token, or URL
Solution: 
1. Verify email matches Jira login
2. Generate new API token
3. Test with curl:
   curl -u email@company.com:token https://company.atlassian.net/rest/api/3/myself
```

**❌ "Epic not found"**
```
Cause: Epic key format or permissions
Solution:
1. Use correct format: PROJECT-123 (uppercase, with dash)
2. Verify access in Jira web interface
3. Check project permissions
```

**❌ "No Go files found"**
```
Cause: Not in Go workspace
Solution:
1. Open folder containing .go files, OR
2. Continue with Jira-only analysis
```

**❌ "GitHub Copilot not responding"**
```
Cause: Copilot not installed/activated
Solution:
1. Install GitHub Copilot extension
2. Verify subscription is active
3. Test Copilot in other files
```

### Debug Information

**Enable Debug Mode:**
1. Open VS Code Settings
2. Search "AI Product Owner"
3. Enable "Debug: Enable Verbose Logging"
4. Check Output panel: View → Output → "AI Product Owner"

**Check Extension Logs:**
```
1. View → Output
2. Select "AI Product Owner" from dropdown
3. Look for error messages and connection details
```

## 🛠️ Development Testing

### Test Extension Changes
If you modify the source code:

```bash
# 1. Recompile TypeScript
npm run compile

# 2. Repackage extension
npx vsce package --no-dependencies

# 3. Reinstall updated version
code --install-extension ai-product-owner-agent-1.0.0.vsix

# 4. Restart VS Code
# Developer: Reload Window
```

### Test Different Scenarios
1. **Large Go Projects**: Test with 100+ Go files
2. **Complex Epics**: Test with epics having 10+ stories
3. **Error Conditions**: Test with invalid Jira URLs, expired tokens
4. **Performance**: Test analysis completion times

## 📋 Testing Checklist

### Pre-Testing Setup
- [ ] VS Code 1.74.0+ installed
- [ ] GitHub Copilot extension installed
- [ ] Valid Jira account with API access
- [ ] Test epic accessible in Jira

### Installation Testing
- [ ] Extension installs without errors
- [ ] Robot icon appears in Activity Bar
- [ ] Commands appear in Command Palette
- [ ] Extension activates on first use

### Configuration Testing
- [ ] Jira settings can be configured
- [ ] Connection test succeeds
- [ ] Invalid credentials show proper errors
- [ ] Settings persist between sessions

### Analysis Testing
- [ ] Epic analysis starts successfully
- [ ] Jira data retrieved correctly
- [ ] Go codebase analyzed (if available)
- [ ] Comprehensive prompt generated
- [ ] Output files created in correct location

### Integration Testing
- [ ] GitHub Copilot integration works
- [ ] Generated prompts are comprehensive
- [ ] Analysis results are actionable
- [ ] Error handling works gracefully

## 🎉 Success Indicators

You'll know the extension is working correctly when:

✅ **Installation**: Robot icon in Activity Bar, commands in palette  
✅ **Configuration**: Connection test passes, settings saved  
✅ **Analysis**: Epic data fetched, Go files analyzed, prompt generated  
✅ **Output**: Markdown files created with comprehensive analysis  
✅ **Integration**: Copilot prompts work and generate useful responses  

## 📞 Getting Help

If you encounter issues:

1. **Check Output Logs**: View → Output → "AI Product Owner"
2. **Enable Debug Mode**: Settings → AI Product Owner → Enable Verbose Logging
3. **Test Components**: Test Jira connection and Go analysis separately
4. **Compare with Curl**: Test Jira API directly with curl commands

## 🚀 Next Steps After Testing

Once local testing is successful:

1. **Gather Feedback**: Test with team members
2. **Document Issues**: Note any bugs or improvement areas
3. **Refine Configuration**: Optimize settings for your environment
4. **Plan Distribution**: Use the packaging system for team deployment

---

**Ready to Test!** 🎯

Your extension is packaged and ready for local testing. No marketplace publishing required - just install the `.vsix` file and start analyzing epics! 