# 🤖 AI Product Owner Agent - VS Code Extension

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://marketplace.visualstudio.com/items?itemName=your-company-internal.ai-product-owner-agent)
[![License](https://img.shields.io/badge/license-UNLICENSED-red.svg)](LICENSE)

> Transform Jira epics into comprehensive technical analysis with AI-powered automation

## ✨ What It Does

This VS Code extension connects your **Jira portfolio** with your **Go codebase** to generate comprehensive technical analysis through GitHub Copilot. It follows a structured Principal Engineer workflow:

1. **📋 Requirements Analysis** - Business requirements and dependencies
2. **🎯 Design Overview** - High-level architecture design  
3. **🔧 Technical Design** - Database, API, and business logic details
4. **🏗️ Infrastructure & NFR** - Infrastructure and non-functional requirements
5. **📝 Task Breakdown** - Ready-to-import Jira tasks with acceptance criteria

## 🚀 Quick Start

### Installation
1. Download the `.vsix` file from releases
2. Install: `code --install-extension ai-product-owner-agent-1.0.0.vsix`
3. Reload VS Code

### Configuration
1. **Open Command Palette** (`Cmd+Shift+P`)
2. **Run**: `AI Product Owner: Configure Settings`
3. **Enter your Jira details**:
   - **Base URL**: `company.atlassian.net`
   - **Email**: Your Jira email
   - **API Token**: [Generate here](https://id.atlassian.com/manage-profile/security/api-tokens)

### Usage
1. **Open your Go project** in VS Code
2. **Run**: `AI Product Owner: Analyze Epic`
3. **Enter Jira Epic Key** (e.g., `PROJ-123`)
4. **Follow the automated workflow** - each stage waits for your confirmation
5. **Complete technical analysis** generated automatically

## 🎯 Key Features

- **🔄 Sequential Automation**: Each analysis stage runs automatically with user confirmation
- **⏱️ Predictable Timing**: 1-minute intervals for all completion checks
- **🤖 Copilot Integration**: Automatically opens Copilot Chat with stage-specific prompts
- **📊 Comprehensive Analysis**: Principal Engineer-level technical depth
- **📋 Jira Ready**: Generates tasks ready for import to Jira
- **🔧 Codebase-Specific**: Analysis tailored to your actual Go codebase
- **📝 Clean Documentation**: Single master analysis document with all stages

## 🏗️ Architecture

### Analysis Stages
Each stage is designed for specific expertise levels:

- **Requirements & Design** (Principal Engineer role): Technical requirements analysis
- **Implementation Design** (Principal Engineer role): Detailed technical specifications  
- **Task Breakdown** (Product Owner role): Jira-ready implementation tasks

### Technical Stack
- **Frontend**: TypeScript + VS Code Extension API
- **Integration**: Jira REST API v3 + GitHub Copilot
- **Analysis**: Multi-stage analysis engine with intelligent prompt generation
- **Output**: Markdown documentation with Mermaid diagrams

## 🔧 Development

### Setup
```bash
git clone <repository>
cd ai-product-owner-agent
npm install
```

### Build & Test
```bash
npm run compile  # Build extension
npm test        # Run tests  
npm run lint    # Code quality
```

### Package
```bash
npx vsce package --no-dependencies
```

## 📋 Testing

The extension includes comprehensive tests covering:
- ✅ Basic functionality validation
- ✅ Error handling scenarios  
- ✅ Configuration management
- ✅ Data processing logic
- ✅ Utility functions

Run tests: `npm test`

## 🎯 Workflow Example

```
1. 📋 Requirements Analysis (5 min)
   → Copilot opens → Paste prompt → Generate analysis
   → 1-minute completion check → Confirm completion

2. 🎯 Design Overview (6 min)  
   → Copilot opens → Paste prompt → Generate design
   → 1-minute completion check → Confirm completion

3. 🔧 Technical Design (15 min)
   → Copilot opens → Paste prompt → Generate specs
   → 1-minute completion check → Confirm completion

4. 🏗️ Infrastructure & NFR (8 min)
   → Copilot opens → Paste prompt → Generate infrastructure
   → 1-minute completion check → Confirm completion

5. 📝 Task Breakdown (6 min)
   → Copilot opens → Paste prompt → Generate Jira tasks
   → 1-minute completion check → Complete!
```

## 📊 Output Structure

```
Analysis_EPIC-123_20241229_143022/
├── Master_Analysis_Document.md          # Complete analysis
├── Stage_1_Requirements_Analysis.md     # Requirements stage
├── Stage_2_Design_Overview.md          # Design stage  
├── Stage_3_Technical_Design.md         # Technical specs
├── Stage_4_Infrastructure_NFR.md       # Infrastructure
└── Stage_5_Task_Breakdown.md           # Jira tasks
```

## 🔍 Troubleshooting

### Common Issues

**❌ Jira Connection Failed**
- Verify base URL format: `company.atlassian.net` (no https://)
- Check API token is valid and not expired
- Ensure email matches Jira account

**❌ No Go Files Found**  
- Open Go project root in VS Code
- Ensure `.go` files exist in workspace
- Check file permissions

**❌ Copilot Not Opening**
- Install GitHub Copilot extension
- Sign in to GitHub Copilot
- Ensure Copilot Chat is enabled

### Debug Commands
- `AI Product Owner: Test Jira Connection`
- `AI Product Owner: Test Jira Data Fetch`  
- Enable verbose logging in settings

## 📝 Python POC

The repository includes `simple_poc.py` - a standalone Python script that demonstrates the core analysis functionality without VS Code dependencies.

```bash
python simple_poc.py --key PROJ-123 --email user@company.com --token TOKEN --url company.atlassian.net
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

## 📄 License

This project is licensed under UNLICENSED - see the LICENSE file for details.

---

**⚡ Transform your Jira epics into actionable technical analysis with AI precision!**
