# AI Product Owner Agent - User Guide

## 📋 Table of Contents
1. [Getting Started](#getting-started)
2. [Installation & Setup](#installation--setup)
3. [Configuration](#configuration)
4. [Using the Extension](#using-the-extension)
5. [Workflow Examples](#workflow-examples)
6. [Troubleshooting](#troubleshooting)
7. [Best Practices](#best-practices)
8. [FAQ](#faq)

## 🚀 Getting Started

The AI Product Owner Agent helps you analyze Jira epics and Go codebases to generate comprehensive technical documentation using GitHub Copilot. This extension transforms business requirements into actionable technical designs with visual diagrams and implementation plans.

### What You'll Need
- ✅ VS Code (version 1.74.0 or higher)
- ✅ Jira instance with API access
- ✅ Jira API token
- ✅ Go workspace (optional but recommended)
- ✅ GitHub Copilot extension (for prompt execution)

### Key Features
- 🔍 **Epic Analysis**: Fetch and analyze Jira epics with stories
- 🏗️ **Codebase Integration**: Analyze Go project structure and patterns
- 🤖 **AI-Powered Prompts**: Generate specialized prompts for Copilot
- 📊 **Visual Documentation**: Create Mermaid diagrams and technical specs
- 🔄 **Multi-Stage Analysis**: 5-stage comprehensive analysis workflow

## 📦 Installation & Setup

### Step 1: Install the Extension
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "AI Product Owner Agent"
4. Click "Install"

### Step 2: Get Your Jira API Token
1. Go to [Atlassian Account Settings](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Click "Create API token"
3. Give it a name like "AI Product Owner Agent"
4. Copy the generated token (save it securely!)

### Step 3: First-Time Setup
When you first activate the extension, you'll see a welcome message:

```
🚀 Welcome to AI Product Owner Agent!
Would you like a quick walkthrough to get started?
```

Choose "Configure Now" to set up your credentials immediately.

## ⚙️ Configuration

### Open Configuration Settings
Use any of these methods:
- **Command Palette**: `Ctrl+Shift+P` → "AI Product Owner: Configure Settings"
- **Activity Bar**: Click the robot icon → Configure Settings
- **Settings Menu**: File → Preferences → Settings → Search "AI Product Owner"

### Required Settings

#### Jira Configuration
```json
{
  "aiProductOwner.jira.baseUrl": "your-company.atlassian.net",
  "aiProductOwner.jira.email": "your-email@company.com",
  "aiProductOwner.jira.token": "your-api-token-here"
}
```

**⚠️ Important**: Don't include `https://` in the base URL - just use `company.atlassian.net`

#### Output Configuration
```json
{
  "aiProductOwner.output.directory": "./docs/analysis",
  "aiProductOwner.output.generateDiagrams": true
}
```

#### Analysis Configuration
```json
{
  "aiProductOwner.analysis.maxSolutions": 2,
  "aiProductOwner.codebase.includeTests": false
}
```

### Test Your Configuration
After setting up, test your connection:
1. Open Command Palette (`Ctrl+Shift+P`)
2. Run "AI Product Owner: Test Jira Connection"
3. Wait for the connection test to complete

You should see: ✅ "Jira connection successful!"

## 🎯 Using the Extension

### Basic Workflow

#### 1. Open Your Go Project
```bash
# Open your Go project in VS Code
code /path/to/your/go/project
```

#### 2. Start Epic Analysis
**Method 1: Command Palette**
- Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
- Type "AI Product Owner: Analyze Epic"
- Press Enter

**Method 2: Keyboard Shortcut**
- Press `Ctrl+Shift+A` (Windows/Linux) or `Cmd+Shift+A` (Mac)

**Method 3: Activity Bar**
- Click the robot icon in the activity bar
- Click "Analyze Epic"

#### 3. Enter Epic Key
When prompted, enter your Jira epic key:
```
Enter Jira Epic Key: PROJ-123
```

**Valid formats:**
- `PROJ-123` ✅
- `BACKEND-456` ✅  
- `USER-STORY-789` ✅
- `proj123` ❌ (must include dash)

#### 4. Watch the Analysis Progress
The extension will show detailed progress:

```
⏳ Analyzing Epic PROJ-123
├── Initialize Jira client (10%)
├── Test connection (25%)
├── Fetch epic data (50%)
├── Analyze codebase (75%)
└── Generate prompts (100%)
```

#### 5. Execute Multi-Stage Analysis
The extension guides you through 5 analysis stages:

1. **🎯 Business Analysis** (5-10 minutes)
2. **🏗️ Technical Architecture** (10-15 minutes)
3. **⚙️ Implementation Design** (10-15 minutes)
4. **📋 Development Plan** (5-10 minutes)
5. **⚠️ Risk Assessment** (5-10 minutes)

### Interactive Workflow

For each stage, you'll see:

```
🎯 Business Analysis Stage

📋 Copy the prompt below and paste it into GitHub Copilot Chat:

[Generated Prompt Content]

Actions:
[Open Copilot Chat] [Copy Prompt] [Stage Complete]
```

**Steps for each stage:**
1. Click "Copy Prompt" to copy the generated prompt
2. Click "Open Copilot Chat" (or open manually)
3. Paste the prompt in Copilot Chat
4. Wait for Copilot's complete response
5. Copy Copilot's response to the output file
6. Click "Stage Complete" to continue

### Output Structure

After analysis, you'll find generated files in:
```
your-project/
└── docs/analysis/PROJ-123/
    ├── 01-business-analysis.md
    ├── 02-technical-architecture.md
    ├── 03-implementation-design.md
    ├── 04-development-plan.md
    ├── 05-risk-assessment.md
    └── analysis-summary.md
```

## 📝 Workflow Examples

### Example 1: User Authentication Epic

**Epic**: `AUTH-101 - Implement OAuth 2.0 Authentication`

**Input Data:**
```
Stories: 5 stories, 34 story points
Codebase: 45 Go files, JWT patterns detected
Components: auth-service, user-management
```

**Generated Output:**
- Business requirements analysis with stakeholder mapping
- Technical architecture with OAuth 2.0 flow diagrams
- Implementation design with API specifications
- Development timeline with task breakdown
- Risk assessment with security considerations

### Example 2: Microservice Migration

**Epic**: `BACKEND-205 - Migrate Monolith to Microservices`

**Input Data:**
```
Stories: 12 stories, 89 story points
Codebase: 200+ Go files, Database patterns
Components: user-service, order-service, payment-service
```

**Generated Output:**
- Service boundary analysis
- Migration strategy with dependency mapping
- Database decomposition plan
- Deployment and monitoring strategy
- Risk mitigation for data consistency

## 🔧 Troubleshooting

### Common Issues

#### ❌ "Jira authentication failed"

**Symptoms:**
```
🔐 Jira authentication failed during Epic Analysis.
This usually means your API token is invalid or expired.
```

**Solutions:**
1. **Check Token Validity**
   - Go to [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
   - Verify your token hasn't expired
   - Generate a new token if needed

2. **Verify Email Address**
   - Ensure you're using the exact email associated with your Jira account
   - Check for typos in the email configuration

3. **Test Manually**
   ```bash
   curl -u your-email@company.com:your-token \
     https://your-company.atlassian.net/rest/api/3/myself
   ```

#### ❌ "Epic not found"

**Symptoms:**
```
🔍 Epic "PROJ-123" not found during Epic Analysis.
```

**Solutions:**
1. **Check Epic Key Format**
   - Must be uppercase: `PROJ-123` not `proj-123`
   - Must include dash: `PROJ-123` not `PROJ123`
   - Must exist in Jira

2. **Verify Permissions**
   - Ensure you can view the epic in Jira web interface
   - Check project access permissions
   - Verify the epic is in the correct project

3. **Try Project Analysis**
   - If epic access fails, try the project key instead
   - Example: `PROJ` instead of `PROJ-123`

#### ❌ "No Go files found"

**Symptoms:**
```
📁 No Go files found in the current workspace.
```

**Solutions:**
1. **Check Workspace**
   - Ensure you've opened a folder containing Go files
   - Look for `.go` files in subdirectories
   - Verify VS Code workspace is correctly set

2. **Continue Without Codebase**
   - Click "Continue Anyway" to analyze epic only
   - Analysis will focus on Jira data without code context

#### ❌ "GitHub Copilot integration issue"

**Symptoms:**
```
🤖 GitHub Copilot integration issue during Epic Analysis.
```

**Solutions:**
1. **Install Copilot Extension**
   - Go to Extensions marketplace
   - Search for "GitHub Copilot"
   - Install and activate the extension

2. **Manual Workflow**
   - Use the "Manual Copy/Paste" option
   - Copy prompts manually to Copilot Chat
   - Follow the guided workflow

#### ⚠️ "Rate limit exceeded"

**Symptoms:**
```
⏳ Jira API rate limit exceeded during Epic Analysis.
Please wait 60 seconds before retrying.
```

**Solutions:**
1. **Wait and Retry**
   - Click "Wait and Retry" to automatically retry
   - Extension shows countdown timer

2. **Adjust Settings**
   ```json
   {
     "aiProductOwner.network.retryAttempts": 5,
     "aiProductOwner.network.timeoutSeconds": 60
   }
   ```

### Debug Mode

Enable verbose logging for detailed troubleshooting:

```json
{
  "aiProductOwner.debug.enableVerboseLogging": true
}
```

Then check the output panel: View → Output → "AI Product Owner - Error Handler"

### Getting Help

1. **Check Output Panel**
   - View → Output → "AI Product Owner"
   - Look for detailed error messages

2. **Test Individual Components**
   - Use "Test Jira Connection" command
   - Verify codebase analysis separately

3. **Reset Configuration**
   - Clear all settings and reconfigure
   - Use "AI Product Owner: Configure Settings"

## 💡 Best Practices

### Epic Selection
- **Choose Well-Defined Epics**: Select epics with clear stories and acceptance criteria
- **Moderate Scope**: 5-15 stories work best (50-150 story points)
- **Technical Epics**: Focus on implementation-heavy epics rather than pure research

### Codebase Preparation
- **Clean Project Structure**: Organize Go files in logical packages
- **Up-to-Date Dependencies**: Ensure `go.mod` reflects current dependencies
- **Document Patterns**: Use consistent naming and architecture patterns

### Prompt Optimization
- **Review Before Execution**: Read generated prompts before pasting to Copilot
- **Add Context**: Include additional context in Copilot conversations
- **Iterate on Output**: Ask Copilot for clarifications or improvements

### Output Management
- **Version Control**: Commit generated documentation to Git
- **Regular Updates**: Re-run analysis when epics change significantly
- **Team Sharing**: Share analysis results with development team

### Quality Assurance
- **Validate Diagrams**: Ensure all Mermaid diagrams render correctly
- **Review Technical Decisions**: Have senior developers review architectural choices
- **Test Implementation Plans**: Validate development timelines with team

## ❓ FAQ

### General Questions

**Q: What types of projects work best with this extension?**
A: Go microservices, REST APIs, and backend systems. Works best with well-structured codebases and clear Jira epic definitions.

**Q: Do I need GitHub Copilot to use this extension?**
A: While Copilot integration is recommended, you can use the generated prompts with any AI assistant manually.

**Q: Can I use this with other programming languages?**
A: Currently optimized for Go, but the Jira analysis and prompt generation work with any project type.

### Configuration Questions

**Q: Where are my API tokens stored?**
A: Tokens are stored securely in VS Code's built-in secrets storage, not in plain text configuration files.

**Q: Can I use this with Jira Server (on-premise)?**
A: Yes, just set the `baseUrl` to your on-premise Jira server URL.

**Q: How do I share configuration with my team?**
A: Share workspace settings (output directories, analysis preferences) but keep credentials personal.

### Usage Questions

**Q: How long does a typical analysis take?**
A: 30-60 minutes total (5-15 minutes per stage), depending on epic complexity and your interaction with Copilot.

**Q: Can I pause and resume analysis?**
A: Yes, the extension supports pausing between stages. Your progress is automatically saved.

**Q: What if my epic changes during analysis?**
A: Re-run the analysis to get updated prompts with current epic data.

### Troubleshooting Questions

**Q: Why do I get permission errors?**
A: Ensure your Jira account has "Browse Projects" permission and access to the specific epic's project.

**Q: What if the extension crashes?**
A: Check the Output panel for error details, restart VS Code, and try again. Enable debug logging for more information.

**Q: Can I customize the prompt templates?**
A: Currently, templates are built-in, but you can modify the generated prompts before using them with Copilot.

### Advanced Questions

**Q: How do I integrate this with CI/CD?**
A: Generate documentation as part of your development workflow and commit the output to version control.

**Q: Can I automate epic analysis?**
A: The extension is designed for interactive use, but you could build automation around the underlying analysis components.

**Q: How do I contribute improvements?**
A: See the Developer Guide for contribution guidelines and development setup instructions.

---

## 🎯 Next Steps

1. **Complete Setup**: Ensure Jira connection is working
2. **Try First Epic**: Start with a small, well-defined epic
3. **Explore Features**: Test different types of epics and codebases
4. **Share Results**: Show generated documentation to your team
5. **Provide Feedback**: Help improve the extension with your experience

For technical details and customization options, see the [Developer Guide](DEVELOPER_GUIDE.md). 