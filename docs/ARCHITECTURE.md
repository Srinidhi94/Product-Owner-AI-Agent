# Architecture Documentation
## AI Product Owner Agent

**Version**: 1.0 | **Status**: Active

---

## Overview

The AI Product Owner Agent is a VS Code extension built with a modular architecture. It connects different components to analyze Jira epics and codebases, then generates technical documentation using AI.

## Key Design Principles

- **Simple & Modular** - Each component has a clear, single responsibility
- **Secure** - Credentials stored safely, no sensitive data persistence
- **Reliable** - Comprehensive error handling and user-friendly recovery
- **Extensible** - Easy to add new languages and features

---

## System Architecture

### Main Components

```
┌─────────────────────────────────────────────────────────────┐
│                    VS Code Extension                        │
├─────────────────────────────────────────────────────────────┤
│  Extension Entry Point (extension.ts)                      │
│  ├── Command registration & lifecycle management           │
│  ├── User interface & progress tracking                    │
│  └── Error handling & state management                     │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│              MultiStageAnalysisEngine                       │
│  ├── Workflow orchestration (5 stages)                     │
│  ├── 30-second progress intervals                          │
│  ├── User cancellation handling                            │
│  └── Stage completion management                           │
└─────────────────────────────────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│ JiraClient  │       │ Codebase    │       │ Document    │
│             │       │ Analyzer    │       │ Generator   │
│ • API calls │       │             │       │             │
│ • Auth      │       │ • Language  │       │ • File      │
│ • Retries   │       │   detection │       │   creation  │
│ • Rate      │       │ • Framework │       │ • Template  │
│   limiting  │       │   analysis  │       │   management│
└─────────────┘       │ • Pattern   │       │ • Output    │
                      │   detection │       │   formatting│
                      └─────────────┘       └─────────────┘
```

### How Components Work Together

**Step 1: User Starts Analysis**
```
User Command → Extension Entry Point → MultiStageAnalysisEngine
```

**Step 2: Data Collection**
```
MultiStageAnalysisEngine
├── JiraClient → Fetch epic data from Jira API
└── CodebaseAnalyzer → Scan workspace for languages/frameworks
```

**Step 3: Analysis Workflow**
```
For each of 5 stages:
├── Generate structured prompt
├── Copy prompt to clipboard
├── User pastes to GitHub Copilot
├── User pastes AI response back
└── Update documentation files
```

**Step 4: Progress & Completion**
```
MultiStageAnalysisEngine
├── Show progress every 30 seconds
├── Allow user cancellation anytime
└── DocumentGenerator → Create final output files
```
---

## Core Components

### MultiStageAnalysisEngine
**What it does**: Manages the entire 5-stage analysis workflow

**Key Features**:
- Coordinates all other components
- Shows progress updates every 30 seconds
- Handles user cancellation gracefully
- Manages stage transitions and data flow

**Main Methods**:
- `runMultiStageAnalysis()` - Starts the analysis workflow
- `completeStage()` - Marks current stage as complete
- `cancelAnalysis()` - Stops analysis and cleans up resources

### JiraClient
**What it does**: Handles all communication with Jira

**Key Features**:
- Secure authentication using API tokens
- Fetches epic and story data
- Handles API rate limiting and retries
- Works with both Jira Cloud and Server

**Main Methods**:
- `fetchEpicData()` - Gets epic information and stories
- `testConnection()` - Verifies Jira connectivity
- `validateCredentials()` - Checks API token validity

### CodebaseAnalyzer
**What it does**: Analyzes your project's codebase structure

**Supported Languages**: JavaScript, TypeScript, Python, Java, C#, Go, Rust, PHP, Ruby

**Analysis Capabilities**:
- Detects main programming languages
- Identifies frameworks and libraries
- Finds architecture patterns
- Analyzes project structure and dependencies

**Main Methods**:
- `analyzeCodebase()` - Scans workspace and returns analysis
- `detectLanguages()` - Identifies programming languages
- `getProjectStructure()` - Maps directory structure

### DocumentGenerator
**What it does**: Creates and manages output documentation files

**Generated Files**:
- `README.md` - Project overview and setup instructions
- `PROMPTS.md` - All generated prompts for each stage
- `ANALYSIS.md` - AI responses and analysis results
- `CONTEXT.md` - Codebase context and technical details

**Main Methods**:
- `createOutputFiles()` - Sets up initial documentation structure
- `updateStageContent()` - Adds content for completed stages
- `generateFinalDocuments()` - Creates final output files

### ConfigurationManager
**What it does**: Manages all extension settings and credentials

**Security Features**:
- Stores Jira credentials in VS Code's secure storage
- Validates all configuration settings
- Provides default values for missing settings

**Configuration Options**:
- Jira connection settings (URL, email, API token)
- Output directory preferences
- Analysis timeout settings
- Stage customization options
---

## Security & Error Handling

### Security Features
- **Local Processing** - All code analysis stays on your machine
- **Secure Storage** - Jira credentials stored in VS Code's secure storage
- **HTTPS Only** - All external API calls use secure connections
- **User Control** - Manual workflow gives you complete control over data

### Error Handling
The extension handles common issues gracefully:

**Connection Problems**
- Automatic retry with backoff for network issues
- Clear error messages with resolution steps
- Graceful degradation when services are unavailable

**Configuration Issues**
- Validation of all settings with helpful error messages
- Default values for missing configurations
- Step-by-step setup guidance

**Analysis Problems**
- Continues with partial results when possible
- Detailed logging for troubleshooting
- User-friendly error messages

---

## Performance & Scalability

### Optimizations
- **Lazy Loading** - Components load only when needed
- **Caching** - Analysis results cached to avoid redundant work
- **Background Processing** - Long operations don't block the UI
- **Resource Management** - Proper cleanup of all resources

### Scalability
- Handles codebases with thousands of files
- Respects API rate limits for external services
- Provides real-time progress feedback
- Supports user cancellation of long operations

---

## Testing & Quality

The extension includes comprehensive testing:

- **Unit Tests** - Each component tested independently
- **Integration Tests** - End-to-end workflows validated
- **Error Scenarios** - All failure modes tested
- **Manual Workflow** - Clipboard and command integration verified

---

*For usage instructions, see [USER_GUIDE.md](USER_GUIDE.md). For development setup, see [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md).*