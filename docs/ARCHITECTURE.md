# AI Product Owner Agent - Architecture Overview

---

## High-Level Workflow (Current)
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
    O --> P[User Pastes Response]
    P --> Q[Documentation Updated]
```

---

## High-Level Workflow (Future Vision)
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
    H --> I[Copilot/LLM Integration]
    I --> J[DocumentGenerator]
    J --> K[TECHNICAL_ANALYSIS.md]
    J --> L[PROMPTS.md]
    J --> M[AUTOMATION_SUMMARY.md]
    K --> N[Documentation Ready]
```

---

## Component Overview
- **extension.ts**: Entry point, command registration, and user interaction
- **MultiStageAnalysisEngine**: Orchestrates the workflow, manages progress, coordinates all components
- **JiraClient**: Fetches and parses Jira epic/portfolio data
- **GoCodebaseAnalyzer**: Analyzes Go project structure, patterns, and complexity
- **PromptGenerator**: Creates context-rich, multi-stage prompts using best practices
- **DocumentGenerator**: Manages output files and documentation
- **Copilot/LLM Integration**: Executes prompts and generates technical analysis (manual now, automated in future)

---

## Sequence Diagram: End-to-End Analysis (Current)
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

---

## Roles & Responsibilities
- **User**: Triggers analysis, pastes prompts into Copilot/LLM, pastes responses into documentation (current), reviews and validates output
- **Extension**: Automates data collection, prompt generation, and documentation management
- **Copilot/LLM**: Provides technical analysis and recommendations

---

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
    H --> I[Copilot/LLM]
    I --> J[User]
    J --> F
```

---

## Prompt Engineering Best Practices
- Context-rich, multi-step prompts
- Explicit role and task instructions
- Use of XML/structured tags and thinking steps
- Sequential, progressive analysis (each stage builds on previous)
- Visual requirements (Mermaid diagrams)
- Principal Engineer-level technical depth

---

## Output Artifacts
- `TECHNICAL_ANALYSIS.md`: Main analysis doc
- `PROMPTS.md`: All generated prompts
- `AUTOMATION_SUMMARY.md`: Workflow summary
- **Jira-Ready Task Breakdown**
- **Mermaid Diagrams** for architecture, flows, and dependencies
- **Decision Log & Risk Assessment**

---

*For user and developer instructions, see [USER_GUIDE.md](USER_GUIDE.md) and [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md).* 