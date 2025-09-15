# AI Product Owner Agent

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/Srinidhi94/Product-Owner-AI-Agent/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![VS Code](https://img.shields.io/badge/VS%20Code-1.74%2B-blue)](https://code.visualstudio.com/)

Turn Jira epics into detailed technical documentation in under an hour. This VS Code extension analyzes your codebase and creates comprehensive project documentation using AI.

## What It Does

**Reduces technical analysis time from days to under an hour** while maintaining principal engineer-level documentation quality.

The extension connects to your Jira epics, analyzes your codebase, and guides you through creating detailed technical documentation using GitHub Copilot.

## Key Features

- **Smart Codebase Analysis** - Automatically detects languages, frameworks, and architecture patterns
- **Secure Jira Integration** - Uses API tokens stored in VS Code's secure storage
- **Manual AI Integration** - Copy/paste workflow with GitHub Copilot (no API keys needed)
- **Progress Tracking** - 30-second interval updates with cancellation options
- **Structured Output** - Organized markdown documentation ready for your team

## Quick Start

1. **Install & Configure**

   - Install the extension from VS Code Marketplace
   - Run: `Ctrl/Cmd + Shift + P` → "AI Product Owner: Configure Settings"
   - Add your Jira URL and API token

2. **Analyze Your Epic**

   - Run: `Ctrl/Cmd + Shift + P` → "AI Product Owner: Analyze Epic"
   - Enter your Jira epic key (e.g., "PROJ-123")

3. **Follow the 5-Stage Workflow**
   - Copy generated prompts to GitHub Copilot
   - Paste AI responses back into the extension
   - Get comprehensive documentation automatically

## How It Works

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Jira Epic   │───▶│ Codebase    │───▶│ AI Analysis │
│ Data Fetch  │    │ Analysis    │    │ Workflow    │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Requirements│    │ Languages   │    │ 5 Stages of │
│ & Stories   │    │ Frameworks  │    │ Documentation│
└─────────────┘    └─────────────┘    └─────────────┘
```

## 5-Stage Analysis Process

**Stage 1: Product Requirements**

- Business context and user needs
- Feature requirements from Jira stories

**Stage 2: System Architecture**

- High-level system design
- Component relationships

**Stage 3: Technical Design**

- Implementation specifications
- Technology choices

**Stage 4: Implementation Strategy**

- Development approach
- Best practices and patterns

**Stage 5: Sprint Planning**

- Task breakdown
- Development timeline

## Generated Documentation

The extension creates comprehensive documentation using **context file architecture** in an epic-specific folder structure:

```
ai-analysis/
└── [EPIC-KEY]/
    ├── README.md          # Project overview and setup
    ├── CONTEXT.md         # Project context and constraints
    ├── JIRA.md           # Epic and story details
    ├── CODEBASE.md       # Technical patterns and architecture
    ├── PROMPTS.md        # Generated prompts for each stage
    └── ANALYSIS.md       # Analysis outputs from all stages
```

### Context File Architecture Benefits

- **60-70% Token Reduction**: Streamlined prompts reference context files instead of embedding large contexts
- **Enhanced AI Grounding**: Context files provide explicit grounding for better analysis accuracy
- **Better Maintainability**: Context written once, referenced by all analysis stages
- **Anti-Hallucination Protocol**: Explicit context file references prevent AI from making unfounded assumptions

### Key Features

- **Epic-Specific Organization**: Each Jira epic gets its own analysis folder with dedicated context files
- **Comprehensive Coverage**: From business requirements to implementation strategy
- **GitHub Copilot Integration**: Seamless AI-powered analysis workflow with optimized prompts
- **Multi-Language Support**: Works with 9+ programming languages
- **Secure**: Jira credentials stored safely in VS Code

## Supported Languages

✅ **9+ Programming Languages:**

- JavaScript & TypeScript
- Python
- Java
- C#
- Go
- Rust
- PHP
- Ruby

## Installation

### From VS Code Marketplace

1. Open VS Code Extensions (`Ctrl/Cmd + Shift + X`)
2. Search "AI Product Owner Agent"
3. Click Install

### For Developers

```bash
git clone <repository-url>
cd ai-product-owner-agent
npm install
npm run compile
# Press F5 to launch Extension Development Host
```

## Setup

**Required:**

- VS Code 1.74.0+
- GitHub Copilot subscription
- Jira access with API token

**Get Your Jira API Token:**

1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
2. Create new token
3. Copy token to extension settings

## Available Commands

| Command                                    | Description                 |
| ------------------------------------------ | --------------------------- |
| `AI Product Owner: Analyze Epic`           | Start the analysis workflow |
| `AI Product Owner: Configure Settings`     | Setup Jira connection       |
| `AI Product Owner: Test Connection`        | Verify Jira access          |
| `AI Product Owner: Complete Stage`         | Mark current stage done     |
| `AI Product Owner: Cancel Analysis`        | Stop current analysis       |
| `AI Product Owner: Open Output Folder`     | View generated docs         |
| `AI Product Owner: Paste Copilot Response` | Add AI response             |

## Troubleshooting

**Connection Issues:**

- Verify Jira URL format: `https://company.atlassian.net`
- Check API token permissions
- Use "Test Connection" command

**Epic Not Found:**

- Ensure epic key format: `PROJECT-123`
- Verify epic exists and you have access
- Check project permissions

## License

MIT License
