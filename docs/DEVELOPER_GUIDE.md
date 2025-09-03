# Developer Guide
## AI Product Owner Agent

**Version**: 1.0 | **Status**: Active

---

## Quick Start for Developers

### Prerequisites
- Node.js 18+ and npm 9+
- VS Code 1.74.0+
- TypeScript 4.9.0+
- Git

### Setup in 5 Minutes

```bash
# 1. Clone and install
git clone https://github.com/Srinidhi94/Product-Owner-AI-Agent.git
cd Product-Owner-AI-Agent
npm install

# 2. Build and test
npm run compile
npm test

# 3. Start developing
code .
# Press F5 to launch Extension Development Host
```

---

## Architecture Overview

### System Design
The extension uses a simple, modular architecture:

```
VS Code Extension
├── Extension Entry Point (extension.ts)
│   ├── Command registration
│   ├── User interface
│   └── State management
│
├── MultiStageAnalysisEngine
│   ├── 5-stage workflow orchestration
│   ├── 30-second progress intervals
│   └── User cancellation handling
│
├── Core Components
│   ├── JiraClient (API integration)
│   ├── CodebaseAnalyzer (language detection)
│   ├── DocumentGenerator (file creation)
│   └── ConfigurationManager (settings)
│
└── Support Components
    ├── PromptGenerator (AI prompts)
    ├── Logger (debugging)
    └── ErrorHandler (user-friendly errors)
```

### Key Design Principles
- **Simple & Modular** - Each component has one clear responsibility
- **User-Friendly** - Clear progress updates and error messages
- **Secure** - Credentials stored safely in VS Code
- **Extensible** - Easy to add new languages and features

---

## Development Environment

### System Requirements

```bash
# Required versions
node --version    # v18.0.0 or higher
npm --version     # v9.0.0 or higher

# VS Code development
code --version    # 1.74.0 or higher

# TypeScript tooling
tsc --version     # 4.9.0 or higher
```

### Development Commands

```bash
# Development workflow
npm run watch          # Auto-compile TypeScript changes
npm test              # Run all tests
npm run lint          # Check code quality
npm run package       # Create VSIX package

# Debugging
# Press F5 in VS Code to launch Extension Development Host
```

---

## Project Structure

```
src/
├── analysis/
│   └── MultiStageAnalysisEngine.ts    # Main workflow orchestrator
├── analyzer/
│   └── CodebaseAnalyzer.ts            # Language detection & analysis
├── jira/
│   └── JiraClient.ts                  # Jira API integration
├── output/
│   └── DocumentGenerator.ts           # Creates output files
├── types/
│   └── index.ts                       # TypeScript type definitions
├── utils/
│   ├── ConfigurationManager.ts        # Settings management
│   ├── ErrorHandler.ts                # Error handling
│   └── Logger.ts                      # Logging system
└── extension.ts                       # Extension entry point

tests/
├── unit/                              # Unit tests
├── integration/                       # Integration tests
└── fixtures/                          # Test data
```

---

## Core Components

### MultiStageAnalysisEngine
**What it does**: Manages the 5-stage analysis workflow

**Key responsibilities**:
- Shows progress dialogs every 30 seconds
- Handles user cancellation
- Coordinates all other components
- Manages stage transitions

### JiraClient
**What it does**: Connects to Jira and fetches epic data

**Key features**:
- Secure API token authentication
- Handles rate limiting and retries
- Fetches epic and story information
- Works with Jira Cloud and Server

### CodebaseAnalyzer
**What it does**: Analyzes your project's code structure

**Supported languages**: JavaScript, TypeScript, Python, Java, C#, Go, Rust, PHP, Ruby

**Analysis capabilities**:
- Detects programming languages and frameworks
- Identifies architecture patterns
- Maps project dependencies
- Analyzes code complexity

### DocumentGenerator
**What it does**: Creates the output documentation files

**Generated files**:
- `README.md` - Project overview
- `PROMPTS.md` - AI prompts used
- `ANALYSIS.md` - AI responses
- `CONTEXT.md` - Technical context

### ConfigurationManager
**What it does**: Manages all extension settings

**Configuration areas**:
- Jira connection settings
- Output directory preferences
- Analysis options
- Security settings

---

## Development Guidelines

### 5-Stage Analysis Process
The extension follows a structured 5-stage workflow:

```
Stage 1: Product Requirements
├── Business context analysis
├── User story breakdown
└── Requirements documentation

Stage 2: System Architecture
├── High-level system design
├── Component relationships
└── Technology decisions

Stage 3: Technical Design
├── API specifications
├── Data models
└── Integration details

Stage 4: Implementation Strategy
├── Development approach
├── Best practices
└── Quality assurance

Stage 5: Sprint Planning
├── Task breakdown
├── Timeline estimation
└── Jira epic structuring
```

### Coding Standards

**TypeScript Best Practices**:
```typescript
// Use explicit types
async function analyzeCodebase(path: string): Promise<CodebaseAnalysis> {
  // Implementation
}

// Define interfaces for data structures
interface AnalysisStage {
  id: string;
  name: string;
  description: string;
}

// Proper error handling
try {
  const result = await operation();
  return result;
} catch (error: unknown) {
  this.errorHandler.handleError(error as Error);
  throw error;
}
```

**Resource Management**:
```typescript
export class Component {
  private outputChannel: vscode.OutputChannel;
  
  constructor() {
    this.outputChannel = vscode.window.createOutputChannel('Component');
  }
  
  // Always implement dispose
  dispose(): void {
    this.outputChannel.dispose();
  }
}
```

### Development Workflow

**Before Making Changes**:
1. Run `npm run compile` to check for errors
2. Run `npm test` to verify existing functionality
3. Check if new dependencies are needed
4. Test configuration changes

**Development Process**:
1. Make small, focused changes
2. Write tests for new features
3. Implement comprehensive error handling
4. Update documentation
5. Ensure proper resource cleanup

### Security Guidelines
- Never log sensitive data (API tokens, credentials)
- Validate all user inputs
- Use VS Code's secure storage for sensitive settings
---

## Testing

### Running Tests
```bash
# Run all tests
npm test

# Run specific test file
npm test -- CodebaseAnalyzer.test.ts

# Run tests in watch mode
npm run test:watch
```

### Test Structure
```typescript
describe('CodebaseAnalyzer', () => {
  let analyzer: CodebaseAnalyzer;
  
  beforeEach(() => {
    analyzer = new CodebaseAnalyzer();
  });
  
  it('should detect TypeScript projects', async () => {
    const analysis = await analyzer.analyzeProject('/path/to/ts-project');
    expect(analysis.language).toBe('typescript');
  });
});
```

---

## Debugging

### VS Code Debug Configuration
The project includes a debug configuration. Press `F5` to start debugging:

```json
{
  "name": "Extension Development",
  "type": "extensionHost",
  "request": "launch",
  "args": ["--extensionDevelopmentPath=${workspaceFolder}"]
}
```

### Logging
```typescript
import { Logger } from './utils/Logger';

const logger = Logger.getInstance();
logger.debug('Debug information');
logger.info('General information');
logger.error('Error occurred', error);
```

### Common Issues

**Jira Connection Problems**:
- Check API token in VS Code settings
- Verify network connectivity
- Confirm API token permissions

**Performance Issues**:
- Use caching for expensive operations
- Implement async/await properly
- Monitor large codebase analysis

---

## Contributing

### Development Process
1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes with tests
3. Run quality checks: `npm run lint && npm test`
4. Submit pull request with clear description

### Code Quality Standards
- Use TypeScript strict mode
- Write comprehensive error handling
- Include unit tests for new features
- Follow existing architectural patterns

### Release Process
```bash
# Update version
npm version patch|minor|major

# Build and test
npm run compile && npm test

# Package extension
npm run package

# Publish to marketplace
vsce publish
```

---

*For usage instructions, see [USER_GUIDE.md](USER_GUIDE.md). For architecture details, see [ARCHITECTURE.md](ARCHITECTURE.md).* 