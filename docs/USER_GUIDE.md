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

The AI Product Owner Agent is a professional VS Code extension that analyzes Jira epics and performs universal codebase analysis across multiple programming languages. It generates comprehensive technical documentation through GitHub Copilot integration and a sophisticated multi-stage analysis workflow.

### Supported Programming Languages
- **JavaScript** (.js, .mjs) - Frontend/backend applications
- **TypeScript** (.ts, .tsx) - Type-safe JavaScript development
- **Python** (.py) - Data science, web development, automation
- **Java** (.java) - Enterprise applications, microservices
- **Go** (.go) - Cloud-native applications, APIs
- **C#** (.cs) - .NET applications, enterprise solutions
- **PHP** (.php) - Web applications, content management
- **Ruby** (.rb) - Web applications, scripting
- **Rust** (.rs) - Systems programming, performance-critical applications

### System Requirements
- ✅ VS Code version 1.74.0 or higher
- ✅ Jira instance with API access
- ✅ Valid Jira API token
- ✅ Project workspace with supported languages
- ✅ GitHub Copilot extension (recommended)

### Core Capabilities
- 🔍 **Epic Analysis**: Comprehensive Jira epic and story analysis
- � **Universal Codebase Analysis**: Multi-language code structure analysis
- 🤖 **AI-Optimized Prompts**: Context-rich prompts for GitHub Copilot
- 📊 **Technical Documentation**: Automated generation of technical specifications
- 🔄 **Five-Stage Workflow**: Systematic analysis methodology
- 📈 **Visual Diagrams**: Mermaid-based architecture and flow diagrams

## 📦 Installation & Setup

### Step 1: Extension Installation
1. Open VS Code
2. Navigate to Extensions view (`Ctrl+Shift+X` / `Cmd+Shift+X`)
3. Search for "AI Product Owner Agent"
4. Click "Install" and wait for completion

### Step 2: Jira API Configuration
1. Access [Atlassian Account Settings](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Click "Create API token"
3. Provide a descriptive name: "AI Product Owner Agent"
4. Copy and securely store the generated token

### Step 3: Initial Configuration
Upon first activation, the extension displays a welcome dialog:

```
🚀 Welcome to AI Product Owner Agent!
Ready to configure your Jira integration and begin analysis?
```

Select "Configure Now" to initiate the setup wizard.

## ⚙️ Configuration

### Configuration Access Methods
Access configuration through any of these methods:
- **Command Palette**: `Ctrl+Shift+P` → "AI Product Owner: Configure Settings"
- **Activity Bar**: Click the robot icon → "Configure Settings"
- **VS Code Settings**: File → Preferences → Settings → Search "AI Product Owner"

### Required Configuration

#### Jira Integration Settings
```json
{
  "aiProductOwner.jira.baseUrl": "your-organization.atlassian.net",
  "aiProductOwner.jira.email": "your-email@organization.com",
  "aiProductOwner.jira.token": "your-secure-api-token"
}
```

**Security Note**: Exclude `https://` from baseUrl - use only `organization.atlassian.net`

#### Analysis Output Configuration
```json
{
  "aiProductOwner.output.directory": "./docs/analysis",
  "aiProductOwner.output.generateDiagrams": true,
  "aiProductOwner.output.includeMetadata": true
}
```

#### Universal Codebase Analysis Settings
```json
{
  "aiProductOwner.analysis.maxSolutions": 2,
  "aiProductOwner.codebase.includeTests": false,
  "aiProductOwner.codebase.supportedLanguages": [
    "javascript", "typescript", "python", "java", 
    "go", "csharp", "php", "ruby", "rust"
  ],
  "aiProductOwner.analysis.depthLevel": "comprehensive"
}
```

### Configuration Validation
After configuration, validate your setup:
1. Open Command Palette (`Ctrl+Shift+P`)
2. Execute "AI Product Owner: Test Jira Connection"
3. Wait for validation completion

Success indicator: ✅ "Jira connection established successfully!"

## 🎯 Using the Extension

### Analysis Workflow Overview

The extension follows a structured five-stage analysis process:

1. **Epic Analysis**: Jira data extraction and requirement analysis
2. **Codebase Discovery**: Universal language detection and structure mapping
3. **Architecture Analysis**: Cross-language dependency and pattern analysis
4. **Technical Planning**: Implementation strategy and approach definition
5. **Documentation Generation**: Comprehensive technical documentation creation

### Starting an Analysis

#### Method 1: Command Palette
1. Open Command Palette (`Ctrl+Shift+P`)
2. Type "AI Product Owner: Analyze Epic"
3. Select your target epic from the list
4. Follow the guided workflow

#### Method 2: Activity Bar Interface
1. Click the robot icon in the Activity Bar
2. Navigate to "Quick Actions" panel
3. Click "Analyze Epic"
4. Select your epic and workspace

### Interactive Analysis Process

```mermaid
graph LR
    A[Start Analysis] --> B[Epic Selection]
    B --> C[Codebase Scan]
    C --> D[Language Detection]
    D --> E[Analysis Generation]
    E --> F[Copilot Integration]
    F --> G[Documentation Output]
```

#### Stage-by-Stage Workflow

**Stage 1: Epic Analysis**
- Fetches Jira epic details, stories, and acceptance criteria
- Extracts business requirements and technical constraints
- Generates initial context for technical analysis

**Stage 2: Codebase Discovery**
- Scans workspace for supported programming languages
- Identifies project structure, frameworks, and patterns
- Maps file organization and module dependencies

**Stage 3: Architecture Analysis**
- Analyzes cross-language integrations and dependencies
- Identifies architectural patterns and design approaches
- Evaluates technical complexity and implementation challenges

**Stage 4: Technical Planning**
- Generates implementation strategies and approaches
- Creates task breakdown and development sequencing
- Identifies risks, dependencies, and technical decisions

**Stage 5: Documentation Generation**
- Produces comprehensive technical analysis
- Creates visual diagrams and architectural documentation
- Generates Copilot-ready prompts for detailed analysis

### Visual Workflow Overview
```mermaid
graph TD
    A[User Triggers Analysis] --> B[Extension Generates Prompts]
    B --> C[User Copies Prompt to Copilot/LLM]
    C --> D[LLM Generates Response]
    D --> E[User Uses "Paste Copilot Response" Command]
    E --> F[Extension Updates Documentation]
    F --> G[Ready for Review/Implementation]
```

### Basic Workflow

#### 1. Open Your Project
```bash
# Open your project in VS Code
code /path/to/your/project
```

#### 2. Start Epic Analysis
- **Command Palette**: `Ctrl+Shift+P` → "AI Product Owner: Analyze Epic"
- **Keyboard Shortcut**: `Ctrl+Shift+A` (Windows/Linux) or `Cmd+Shift+A` (Mac)
- **Activity Bar**: Click the robot icon → "Analyze Epic"

#### 3. Enter Epic Key
When prompted, enter your Jira epic key (e.g., `PROJ-123`).

#### 4. Watch the Analysis Progress
The extension will show detailed progress as it fetches Jira data, analyzes the codebase, and generates prompts.

#### 5. Execute Multi-Stage Analysis
The extension guides you through 5 analysis stages:
1. **🎯 Business Analysis**
2. **🏗️ Technical Architecture**
3. **⚙️ Implementation Design**
4. **📋 Development Plan**
5. **⚠️ Risk Assessment**

For each stage:
- Click "Copy Prompt" to copy the generated prompt
- Paste the prompt into Copilot Chat (or your LLM of choice)
- Wait for the LLM's complete response
- Copy the response and paste it into the designated section of the output file
- Click "Stage Complete" to continue

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
- Stories: 5 stories, 34 story points
- Codebase: 45 Go files, JWT patterns detected
- Components: auth-service, user-management

**Generated Output:**
- Business requirements analysis with stakeholder mapping
- Technical architecture with OAuth 2.0 flow diagrams
- Implementation design with API specifications
- Development timeline with task breakdown
- Risk assessment with security considerations

### Example 2: Microservice Migration
**Epic**: `BACKEND-205 - Migrate Monolith to Microservices`
- Stories: 12 stories, 89 story points
- Codebase: 200+ Go files, Database patterns
- Components: user-service, order-service, payment-service

**Generated Output:**
- Service boundary analysis
- Migration strategy with dependency mapping
- Database decomposition plan
- Deployment and monitoring strategy
- Risk mitigation for data consistency

## 🛠️ Troubleshooting

### Common Issues & Solutions
- **Jira authentication failed:** Check API token and email.
- **Epic not found:** Verify epic key and permissions.
- **No source files found:** Check project path and structure.
- **Copilot integration issue:** Ensure Copilot extension is installed and active.
- **Rate limit exceeded:** Wait and retry, or adjust network settings.

### Debug Mode
Enable verbose logging for detailed troubleshooting:
```json
{
  "aiProductOwner.debug.enableVerboseLogging": true
}
```
Check the output panel: View → Output → "AI Product Owner - Error Handler"

### Getting Help
- Check Output Panel: View → Output → "AI Product Owner"
- Test individual components: Use "Test Jira Connection" command
- Reset configuration: Use "AI Product Owner: Configure Settings"

## 💡 Best Practices
- **Epic Selection:** Choose well-defined epics with clear stories and acceptance criteria
- **Codebase Preparation:** Organize Go files in logical packages; ensure `go.mod` is up to date
- **Prompt Optimization:** Review generated prompts before using; add context as needed
- **Output Management:** Commit generated documentation to Git; re-run analysis when epics change
- **Quality Assurance:** Validate diagrams, review technical decisions, and test implementation plans

## ❓ FAQ

### General
- **Q: Do I need GitHub Copilot to use this extension?**
  - A: No, you can use any LLM (Claude, ChatGPT, etc.) with the generated prompts.
- **Q: Can I use this with other programming languages?**
  - A: Currently optimized for Go, but extensible to other languages.
- **Q: Where are my API tokens stored?**
  - A: Tokens are stored securely in VS Code's built-in secrets storage.
- **Q: Can I customize the prompt templates?**
  - A: Yes, prompt templates are extensible and can be tailored to your workflow.

### Usage
- **Q: How long does a typical analysis take?**
  - A: 30-60 minutes total, depending on epic complexity and LLM interaction.
- **Q: Can I pause and resume analysis?**
  - A: Yes, the extension supports pausing between stages.
- **Q: What if my epic changes during analysis?**
  - A: Re-run the analysis to get updated prompts and documentation.

### Advanced
- **Q: How do I integrate this with CI/CD?**
  - A: Generate documentation as part of your workflow and commit the output to version control.
- **Q: Can I automate epic analysis?**
  - A: The extension is designed for interactive use, but automation is on the roadmap.
- **Q: How do I contribute improvements?**
  - A: See the Developer Guide for contribution guidelines.

## 🎯 Next Steps
1. **Complete Setup:** Ensure Jira connection is working
2. **Try First Epic:** Start with a small, well-defined epic
3. **Explore Features:** Test different types of epics and codebases
4. **Share Results:** Show generated documentation to your team
5. **Provide Feedback:** Help improve the extension with your experience

For technical details and customization options, see the [Developer Guide](DEVELOPER_GUIDE.md). 