# AI Product Owner Agent - Architecture Overview

## High-Level Workflow
```mermaid
graph TD
    A[User Triggers Analysis] --> B[MultiStageAnalysisEngine]
    B --> C[JiraClient]
    B --> D[GoCodebaseAnalyzer]
    C --> E[Jira Data]
    D --> F[Codebase Data]
    E --> G[PromptGenerator]
    F --> G
    G --> H[5-Stage Prompts]
    H --> I[DocumentGenerator]
    I --> J[TECHNICAL_ANALYSIS.md]
    I --> K[PROMPTS.md]
    I --> L[AUTOMATION_SUMMARY.md]
    H --> M[Copilot Integration]
    M --> N[User Pastes Prompt]
    N --> O[Copilot Response]
    O --> P[Documentation Updated]
```

## Component Overview
- **extension.ts**: Entry point, command registration
- **MultiStageAnalysisEngine**: Orchestrates the workflow, manages progress, coordinates all components
- **JiraClient**: Fetches and parses Jira epic/portfolio data
- **GoCodebaseAnalyzer**: Analyzes Go project structure, patterns, and complexity
- **PromptGenerator**: Creates context-rich, multi-stage prompts using best practices
- **DocumentGenerator**: Manages output files and documentation

## Sequence Diagram: End-to-End Analysis
```mermaid
sequenceDiagram
    participant User
    participant VSCode
    participant AnalysisEngine
    participant JiraClient
    participant GoAnalyzer
    participant PromptGen
    participant Copilot
    participant DocGen

    User->>VSCode: Run "Analyze Epic"
    VSCode->>AnalysisEngine: Start analysis
    AnalysisEngine->>JiraClient: Fetch epic data
    AnalysisEngine->>GoAnalyzer: Analyze codebase
    JiraClient-->>AnalysisEngine: Jira data
    GoAnalyzer-->>AnalysisEngine: Codebase data
    AnalysisEngine->>PromptGen: Generate prompts
    PromptGen-->>AnalysisEngine: Prompts
    AnalysisEngine->>DocGen: Save prompts
    AnalysisEngine->>User: Prompt ready (copy to Copilot)
    User->>Copilot: Paste prompt
    Copilot-->>User: Response
    User->>DocGen: Paste response
    DocGen-->>User: Updated documentation
```

## Roles & Responsibilities
- **User**: Triggers analysis, pastes prompts into Copilot, saves responses
- **Extension**: Automates data collection, prompt generation, and documentation
- **Copilot/LLM**: Provides technical analysis and recommendations

## Visual: Component Interactions
```mermaid
graph LR
    subgraph VS Code Extension
      A[extension.ts] --> B[MultiStageAnalysisEngine]
      B --> C[JiraClient]
      B --> D[GoCodebaseAnalyzer]
      B --> E[PromptGenerator]
      B --> F[DocumentGenerator]
    end
    F --> G[Output Files]
    E --> H[Prompts]
    H --> I[Copilot]
    I --> J[User]
    J --> F
```

## Prompt Engineering Best Practices
- Context-rich, multi-step prompts
- Explicit role and task instructions
- Use of XML/structured tags and thinking steps
- Sequential, progressive analysis (each stage builds on previous)
- Visual requirements (Mermaid diagrams)

## Output Artifacts
- `TECHNICAL_ANALYSIS.md`: Main analysis doc
- `PROMPTS.md`: All generated prompts
- `AUTOMATION_SUMMARY.md`: Workflow summary

---
*For user and developer instructions, see [USER_GUIDE.md](USER_GUIDE.md) and [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md).* 