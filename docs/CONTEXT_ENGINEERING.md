# AI Product Owner Agent - Context Engineering Guide

## Overview

This guide helps AI assistants (GitHub Copilot, Cursor AI, etc.) work effectively with the AI Product Owner Agent codebase. It provides context, patterns, and best practices for generating high-quality code.

## Project Context

**Type**: VS Code Extension for Technical Analysis  
**Language**: TypeScript (98%), JavaScript (2%)  
**Architecture**: Event-driven extension with 5-stage analysis workflow  
**Key Features**: Multi-language codebase analysis, Jira integration, automated documentation

## System Architecture

```
Extension Entry Point
    ↓
MultiStageAnalysisEngine (Core orchestrator)
    ↓
5-Stage Analysis Workflow:
    1. Product Requirements
    2. System Architecture  
    3. Technical Design
    4. Implementation Strategy
    5. Sprint Planning
    ↓
Supporting Components:
    - JiraClient (API integration)
    - CodebaseAnalyzer (Multi-language analysis)
    - ConfigurationManager (Settings)
    - DocumentGenerator (Output files)
```

## AI Assistant Guidelines

### Key Project Information
- **Target Audience**: Principal Engineers, Product Owners, Engineering Managers
- **Dependencies**: VS Code API, Jira REST API, Node.js
- **Testing**: Jest with focus on unit tests
- **Architecture**: Multi-stage automated analysis with real-time progress tracking

### Coding Standards

When generating code for this project:

```typescript
// ✅ Use explicit TypeScript types
interface AnalysisConfig {
  readonly epicKey: string;
  readonly outputPath: string;
}

// ✅ Proper error handling
try {
  const response = await this.jiraClient.fetchEpic(epicKey);
  return response;
} catch (error: unknown) {
  this.logger.error('Failed to fetch epic', { epicKey, error });
  throw new JiraConnectionError(`Epic ${epicKey} not found`);
}

// ✅ VS Code configuration access
const config = vscode.workspace.getConfiguration('aiProductOwner');
const jiraUrl = config.get<string>('jira.baseUrl');
```

### Prompt Engineering Best Practices

**Good Prompts**:
```text
Context: VS Code extension for technical analysis
Task: Create TypeScript method to validate Jira epic keys
Requirements: Format PROJECT-123, return boolean, include JSDoc
```

**Avoid**:
- Vague requests like "fix this code"
- Overly verbose explanations
- Missing context about the project

### VS Code Extension Patterns

```typescript
// ✅ Command registration
export function activate(context: vscode.ExtensionContext) {
  const disposables = [
    vscode.commands.registerCommand('aiProductOwner.analyzeEpic', async () => {
      // Implementation
    })
  ];
  context.subscriptions.push(...disposables);
}

// ✅ Resource management
export class Component implements vscode.Disposable {
  private outputChannel: vscode.OutputChannel;
  
  constructor() {
    this.outputChannel = vscode.window.createOutputChannel('Component');
  }
  
  dispose(): void {
    this.outputChannel.dispose();
  }
}
```

### Error Handling Pattern

```typescript
class ErrorHandler {
  handleError(error: Error, operation: string): void {
    this.logger.error(`${operation} failed`, { error: error.message });
    
    const message = error.message.includes('JIRA') 
      ? 'JIRA connection failed. Check your credentials.'
      : `Operation failed: ${operation}. Please try again.`;
      
    vscode.window.showErrorMessage(message);
  }
}
```

## Current Architecture

### Core Workflow
```
User Starts Analysis
    ↓
ConfigurationManager (Settings)
    ↓
Start/Cancel Dialog
    ↓
Auto-Create Files & Folders
    ↓
5-Stage Sequential Analysis
    ↓
30-Second Progress Intervals
    ↓
Analysis Complete
```

### Key Features
- **ConfigurationManager Integration**: Centralized settings management
- **Automated UX Flow**: Start/cancel dialogs, automatic file creation
- **Progress Tracking**: 30-second interval checking with proper cleanup

## Testing Guidelines

### Test Structure
```typescript
describe('MultiStageAnalysisEngine', () => {
  let engine: MultiStageAnalysisEngine;
  let mockConfigManager: jest.Mocked<ConfigurationManager>;
  
  beforeEach(() => {
    mockConfigManager = createMockConfigurationManager();
    engine = new MultiStageAnalysisEngine();
  });
  
  afterEach(() => {
    engine.dispose();
    jest.clearAllMocks();
  });
  
  it('should show start/cancel dialog', async () => {
    const mockDialog = jest.spyOn(vscode.window, 'showInformationMessage');
    mockDialog.mockResolvedValue('Start Analysis');
    
    await engine.executeAnalysis('TEST-123', mockJiraData, mockCodebaseData);
    
    expect(mockDialog).toHaveBeenCalledWith(
      expect.stringContaining('Ready to start'),
      { modal: true },
      'Start Analysis',
      'Cancel'
    );
  });
});
```

### Mock Patterns
```typescript
// VS Code API mocking
const mockVSCode = {
  window: {
    showInformationMessage: jest.fn(),
    showErrorMessage: jest.fn(),
    createOutputChannel: jest.fn(() => ({
      appendLine: jest.fn(),
      dispose: jest.fn()
    }))
  },
  workspace: {
    getConfiguration: jest.fn(() => ({
      get: jest.fn(),
      update: jest.fn()
    }))
  }
};
```

## Extension Commands

### Available Commands
```typescript
const COMMANDS = [
  'aiProductOwner.analyzeEpic',           // Main analysis workflow
  'aiProductOwner.cancelAnalysis',        // Cancel ongoing analysis  
  'aiProductOwner.showAnalysisProgress',  // Show progress information
  'aiProductOwner.openConfiguration'      // Open configuration UI
] as const;
```

### Configuration Schema
```typescript
interface ExtensionConfiguration {
  'aiProductOwner.jira.baseUrl': string;
  'aiProductOwner.jira.email': string;
  'aiProductOwner.jira.apiToken': string;
  'aiProductOwner.output.directory': string;
  'aiProductOwner.output.createTimestampFolder': boolean;
  'aiProductOwner.analysis.stageTimeout': number;
  'aiProductOwner.analysis.enableProgressTracking': boolean;
}
```

## File Structure
```
src/
├── extension.ts                    # Entry point
├── analysis/
│   └── MultiStageAnalysisEngine.ts # Core workflow
├── utils/
│   ├── ConfigurationManager.ts    # Settings
│   ├── Logger.ts                  # Logging
│   └── ErrorHandler.ts           # Error handling
├── output/
│   └── DocumentGenerator.ts       # File creation
├── prompts/
│   ├── PromptGenerator.ts         # Prompt generation
│   └── PromptTemplates.ts         # Templates
└── types/
    └── index.ts                   # TypeScript interfaces
```

## Resource Management

```typescript
class Component implements vscode.Disposable {
  private timers: Set<ReturnType<typeof setTimeout>> = new Set();
  private intervals: Set<ReturnType<typeof setInterval>> = new Set();
  
  createTimer(callback: () => void, delay: number): void {
    const timer = setTimeout(() => {
      this.timers.delete(timer);
      callback();
    }, delay);
    this.timers.add(timer);
  }
  
  dispose(): void {
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals.clear();
  }
}
```

---

*This guide provides AI assistants with project context for high-quality code generation. Last updated: August 2025.*
