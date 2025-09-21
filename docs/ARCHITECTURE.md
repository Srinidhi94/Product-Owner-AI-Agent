# Architecture Documentation
## Epic Bridge

**Version**: 1.0 | **Status**: Active

---

## Overview

The Epic Bridge is a VS Code extension built with a modular architecture. It connects different components to analyze Jira epics and codebases, then generates technical documentation using AI.

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

### PromptGenerator
**What it does**: Creates stage-specific prompts using context file architecture

**Context File Integration**:
- References context files (CONTEXT.md, JIRA.md, CODEBASE.md) instead of embedding large contexts
- Generates streamlined prompts focused on instructions
- Eliminates variable substitution patterns for better token efficiency
- Uses epic-specific folder structure for organized context management

**Main Methods**:
- `generateStagePrompt()` - Creates prompt for specific analysis stage using context files
- `buildContextFrame()` - Constructs context engineering frame
- Template system now references context files rather than embedding content for validity

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
- `CONTEXT.md` - Project context and technical details  
- `JIRA.md` - Epic and story details
- `CODEBASE.md` - Technical patterns and architecture
- `PROMPTS.md` - Generated prompts for each stage
- `ANALYSIS.md` - Analysis outputs from all stages

**Main Methods**:
- `createOutputFiles()` - Sets up initial documentation structure
- `updateStageContent()` - Adds content for completed stages
- `generateFinalDocuments()` - Creates final output files

### Document Generation System

The extension creates structured documentation in an **epic-specific folder structure**:

```
ai-analysis/
└── [EPIC-KEY]/
    ├── README.md         # Project overview and setup
    ├── CONTEXT.md        # Project context and constraints  
    ├── JIRA.md           # Epic and story details
    ├── CODEBASE.md       # Technical patterns and architecture
    ├── PROMPTS.md        # Generated prompts for each stage
    └── ANALYSIS.md       # Analysis outputs from all stages
```

### Context File Architecture

The system uses a **context file architecture** approach that eliminates variable substitution patterns:

- **CONTEXT.md**: Core project context, constraints, anti-hallucination protocol
- **JIRA.md**: Epic and story details from Jira integration
- **CODEBASE.md**: Technical patterns, architecture, and existing code structure
- **PROMPTS.md**: Generated prompts for each analysis stage
- **ANALYSIS.md**: Complete analysis outputs from all 5 stages

**Key Benefits**:
- **60-70% reduction** in prompt token usage
- Prompts focus on 20-30 lines of instructions vs. 100+ lines with embedded context
- Context written once, referenced by all stages
- Better maintainability and modularity
- Enhanced AI grounding through explicit context file references
- Eliminated obsolete variable substitution patterns ({jiraContext}, {codebaseContext}, {previousStageContext})

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