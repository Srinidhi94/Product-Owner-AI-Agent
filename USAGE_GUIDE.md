# Usage Guide - AI Product Owner Single Comprehensive Prompt System

## 🚀 Quick Start

### 1. Demo Mode (Recommended First Run)
```bash
python simple_poc.py --demo
```
**What it does:**
- Uses mock Jira data (User Authentication System epic)
- Analyzes real Go codebase in current directory
- Generates comprehensive prompt in ~30 seconds

### 2. Real Jira Analysis
```bash
python simple_poc.py --key PROJ-123 --email user@company.com --token YOUR_TOKEN --url company.atlassian.net
```
**What it does:**
- Fetches real Jira epic/portfolio data
- Analyzes Go codebase in current directory
- Generates comprehensive prompt with real context

### 3. Custom Project Path
```bash
python simple_poc.py --demo --project /path/to/your/go/project
```
**What it does:**
- Uses demo Jira data
- Analyzes specified Go project
- Perfect for testing with different codebases

## 📋 Command Reference

### Required Arguments (for real Jira)
- `--key, -k`: Jira Epic/Portfolio key (e.g., `BACKEND-123`, `CSESC-456`)
- `--email, -e`: Your Jira email address
- `--token, -t`: Jira API token (get from: https://id.atlassian.com/manage-profile/security/api-tokens)
- `--url, -u`: Jira URL without https:// (e.g., `mycompany.atlassian.net`)

### Optional Arguments
- `--project, -p`: Path to Go project directory (default: current directory)
- `--demo, -d`: Use demo mode with mock data (overrides Jira args)

### Help
- `--help, -h`: Show all available options and examples

## 🎯 Step-by-Step Workflow

### Step 1: Run the Tool
Choose your approach:
```bash
# Option A: Demo mode (fastest)
python simple_poc.py --demo

# Option B: Real Jira data
python simple_poc.py --key EPIC-123 --email user@company.com --token YOUR_TOKEN --url company.atlassian.net
```

### Step 2: Review Output
The tool will:
- ✅ Analyze your Go codebase (or specified project)
- ✅ Generate a comprehensive prompt file
- ✅ Display success message with file path

Example output:
```
🚀 AI Product Owner PoC - Single Comprehensive Prompt Generator
======================================================================
🔍 Analyzing Go project at: /path/to/project
📄 Found 825 Go files
✅ Analysis complete: 2 packages, 23 structs, 193 functions
⚡ Generating single comprehensive prompt for Copilot...
💾 Saved single comprehensive prompt to: copilot_single_prompt_DEMO-123_20250628_192831.md

✅ Complete! Single comprehensive prompt saved to: /full/path/to/file.md
```

### Step 3: Use the Generated Prompt
1. **Open the generated file** (e.g., `copilot_single_prompt_DEMO-123_*.md`)
2. **Find the prompt section**: Look for "🎯 Copy This Complete Prompt into GitHub Copilot:"
3. **Copy the entire prompt**: Everything inside the code block (usually ~200+ lines)
4. **Paste into GitHub Copilot Chat**: VS Code, GitHub.com, or Copilot app
5. **Wait for response**: Copilot will generate comprehensive analysis (5-10 minutes)

### Step 4: Save the Analysis
- **Copy Copilot's complete response**
- **Save as markdown file** (e.g., `technical_analysis_PROJ-123.md`)
- **Use for sprint planning** and implementation

## 🔑 Getting Jira Credentials

### API Token Setup
1. Visit: https://id.atlassian.com/manage-profile/security/api-tokens
2. Click "Create API token"
3. Give it a name (e.g., "AI Product Owner Tool")
4. Copy the generated token
5. Use with your Jira email and domain

### Finding Your Jira URL
Your Jira URL is the domain you use to access Jira:
- ✅ Correct: `mycompany.atlassian.net`
- ❌ Wrong: `https://mycompany.atlassian.net`
- ❌ Wrong: `mycompany.atlassian.net/`

## 📊 What You Get

The generated prompt produces a comprehensive analysis covering:

### 📋 10 Analysis Sections:
1. **📊 Executive Summary** - Business objectives and technical approach
2. **🎯 Business Requirements** - Problem statement and user impact
3. **🏗️ Technical Assessment** - Architecture evaluation and constraints
4. **💡 Solution Alternatives** - 3-5 approaches with detailed comparison
5. **⚠️ Risk Matrix** - Comprehensive risk assessment with mitigations
6. **🗺️ Implementation Roadmap** - Phased approach with timelines
7. **📋 Jira Structure** - Ready-to-import epics and stories
8. **📝 Technical Specs** - API design, database, security details
9. **🔍 Decision Log** - Rationale for all technical choices
10. **❓ Open Questions** - Areas needing further investigation

### 🎯 Key Benefits:
- **⚡ Fast**: 5-10 minutes total workflow
- **🎯 Comprehensive**: Complete analysis in one Copilot response
- **📋 Actionable**: Ready-to-implement recommendations
- **🔄 Consistent**: Same quality analysis every time

## 🛠️ Troubleshooting

### Common Issues

#### "Missing required arguments"
```bash
❌ Missing required arguments. Either use --demo or provide all Jira credentials.
```
**Solution**: Either use `--demo` OR provide all Jira credentials (`--key`, `--email`, `--token`, `--url`)

#### "Failed to connect to Jira"
```bash
❌ Failed to connect to Jira. Please check your credentials.
```
**Solutions**:
- Verify API token is correct and hasn't expired
- Check email address matches your Jira account
- Ensure Jira URL is correct (without https://)
- Verify you have access to the specified epic

#### "Could not fetch Epic/Portfolio data"
```bash
❌ Could not fetch Epic/Portfolio data
```
**Solutions**:
- Check if the epic key exists and is accessible
- Verify you have permissions to view the epic
- Try a different epic key that you know exists

#### "No Go files found"
```bash
📄 Found 0 Go files
```
**Solutions**:
- Check if the project path contains Go files
- Use `--project /path/to/your/go/project` to specify correct path
- Try demo mode to verify the tool works: `--demo`

### Authentication Tips
- **API Token**: Must be a valid, non-expired token from https://id.atlassian.com/manage-profile/security/api-tokens
- **Email**: Must match your Jira account email exactly
- **URL**: Domain only, no https:// or trailing slashes
- **Permissions**: You must have access to read the specified epic

## 🎉 Success Tips

### 1. Start with Demo Mode
Always test with demo mode first:
```bash
python simple_poc.py --demo
```

### 2. Use Specific Epic Keys
- ✅ Good: `BACKEND-123`, `CSESC-456`, `PROJ-789`
- ❌ Bad: `backend`, `project`, `test`

### 3. Point to Go Projects
The tool works best with:
- Go microservices
- Go web applications
- Any project with `.go` files

### 4. Save Everything
- Keep the generated prompt file
- Save Copilot's analysis response
- Use both for documentation and implementation

Ready to generate your first comprehensive technical analysis! 🚀
