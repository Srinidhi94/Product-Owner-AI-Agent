# Epic Bridge - User Guide

## Overview

The Epic Bridge is a VS Code extension that analyzes Jira epics and generates comprehensive technical documentation. It supports multiple programming languages and integrates with GitHub Copilot for enhanced analysis.

## Supported Languages
- **JavaScript/TypeScript** - Frontend and backend applications
- **Python** - Data science, web development, automation
- **Java** - Enterprise applications, microservices
- **Go** - Cloud-native applications, APIs
- **C#** - .NET applications, enterprise solutions
- **PHP** - Web applications, content management
- **Ruby** - Web applications, scripting
- **Rust** - Systems programming, performance-critical applications

## Requirements
- VS Code version 1.74.0 or higher
- Jira instance with API access
- Valid Jira API token
- Project workspace with supported languages
- GitHub Copilot extension (recommended)

## Key Features
- **Epic Analysis**: Comprehensive Jira epic and story analysis
- **Multi-Language Support**: Universal codebase analysis across 9+ languages
- **AI Integration**: Context-rich prompts for GitHub Copilot
- **Documentation Generation**: Automated technical specifications
- **5-Stage Workflow**: Systematic analysis methodology

## Installation & Setup

### 1. Install Extension
1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X` / `Cmd+Shift+X`)
3. Search for "Epic Bridge"
4. Click "Install"

### 2. Get Jira API Token
1. Go to [Atlassian Account Settings](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Click "Create API token"
3. Name it "Epic Bridge"
4. Copy and save the token

### 3. Configure Settings
Access configuration via:
- Command Palette: `Ctrl+Shift+P` → "Epic Bridge: Configure Settings"
- VS Code Settings: Search "Epic Bridge"

## Configuration

### Jira Settings
```json
{
  "epicBridge.jira.baseUrl": "your-organization.atlassian.net",
  "epicBridge.jira.email": "your-email@organization.com",
  "epicBridge.jira.token": "your-api-token"
}
```

**Note**: Don't include `https://` in baseUrl

### Output Settings
```json
{
  "epicBridge.output.directory": "./docs/analysis"
}
```

### Test Connection
1. Open Command Palette (`Ctrl+Shift+P`)
2. Run "Epic Bridge: Test Jira Connection"
3. Look for: ✅ "Jira connection established successfully!"

## Using the Extension

### 5-Stage Analysis Workflow

The extension follows a structured analysis process:

1. **Product Requirements** - Jira data extraction and business analysis
2. **System Architecture** - High-level system design and patterns
3. **Technical Design** - Detailed implementation specifications
4. **Implementation Strategy** - Development approach and task breakdown
5. **Sprint Planning** - Ready-to-implement user stories

### How to Start Analysis

#### Method 1: Command Palette
1. Open Command Palette (`Ctrl+Shift+P`)
2. Type "AI Product Owner: Analyze Epic"
3. Enter your Jira epic key (e.g., `PROJ-123`)
4. Follow the guided workflow

#### Method 2: Activity Bar
1. Click the robot icon in the Activity Bar
2. Click "Analyze Epic"
3. Enter epic key and follow prompts

### Analysis Process

```
Start Analysis
    ↓
Epic Selection (Enter PROJ-123)
    ↓
Codebase Scan (Detect languages/frameworks)
    ↓
5-Stage Analysis Generation
    ↓
Documentation Output
```

### Stage Workflow

For each of the 5 stages:
1. Extension generates AI-optimized prompt with file editing instructions
2. Copy prompt to GitHub Copilot or your preferred LLM
3. AI automatically edits ANALYSIS.md with response and updates progress indicators
4. Move to next stage

### Output Files

Analysis creates organized documentation:
```
your-project/
└── docs/analysis/PROJ-123/
    ├── README.md           # Overview and summary
    ├── PROMPTS.md          # All generated prompts
    ├── ANALYSIS.md         # Complete analysis results
    └── CONTEXT.md          # Codebase context
```

## Example Workflows

### User Authentication Epic
**Epic**: `AUTH-101 - Implement OAuth 2.0 Authentication`
- **Input**: 5 stories, TypeScript/Node.js codebase
- **Output**: Business requirements, OAuth flow design, API specs, implementation tasks, security assessment

### Microservice Migration
**Epic**: `BACKEND-205 - Migrate Monolith to Microservices`
- **Input**: 12 stories, Java Spring Boot codebase
- **Output**: Service boundaries, migration strategy, database plan, deployment approach, risk mitigation

## Troubleshooting

### Common Issues
- **Jira authentication failed**: Check API token and email in settings
- **Epic not found**: Verify epic key and Jira permissions
- **No source files found**: Check project path and supported languages
- **Extension not responding**: Restart VS Code and try again

### Debug Mode
Check logs in: View → Output → "Epic Bridge"

### Getting Help
- Test connection: "Epic Bridge: Test Jira Connection"
- Reset settings: "Epic Bridge: Configure Settings"
- Check output panel for error details

## Best Practices
- **Epic Selection**: Choose well-defined epics with clear acceptance criteria
- **Codebase Organization**: Keep project structure clean and organized
- **Prompt Review**: Review generated prompts before using with LLMs
- **Documentation Management**: Commit generated docs to version control
- **Quality Checks**: Validate analysis results and implementation plans

## FAQ

**Q: Do I need GitHub Copilot?**  
A: No, you can use any LLM (Claude, ChatGPT, etc.) with the generated prompts.

**Q: How long does analysis take?**  
A: 30-60 minutes total, depending on epic complexity and LLM interaction.

**Q: Can I pause between stages?**  
A: Yes, the extension supports pausing and resuming analysis.

**Q: Where are API tokens stored?**  
A: Securely in VS Code's built-in secrets storage.

**Q: Can I customize prompts?**  
A: Yes, prompt templates can be tailored to your workflow.

## Next Steps
1. Complete Jira setup and test connection
2. Try analysis with a small, well-defined epic
3. Explore different codebase types and languages
4. Share generated documentation with your team
5. Provide feedback for improvements

For technical details, see the [Developer Guide](DEVELOPER_GUIDE.md). 