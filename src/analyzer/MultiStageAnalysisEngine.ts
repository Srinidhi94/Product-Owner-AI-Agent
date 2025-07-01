/**
 * Multi-Stage Analysis Engine - Enhanced Visual Documentation Generator
 * Based on final requirements for multi-stage AI pipeline with Mermaid diagrams
 */

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { 
  JiraPortfolio, 
  CodebaseAnalysis, 
  AnalysisOutput, 
  AnalysisProgress,
  ExtensionConfiguration,
  GeneratedVisualization 
} from '../types';
import { ConfigurationManager } from '../utils/ConfigurationManager';
import { PromptGenerator, GeneratedPrompt, PromptGenerationOptions } from '../prompts/PromptGenerator';

export class MultiStageAnalysisEngine {
  private configManager: ConfigurationManager;
  private outputDirectory: string = '';
  private promptGenerator: PromptGenerator;
  private outputChannel: vscode.OutputChannel;

  constructor(configManager: ConfigurationManager) {
    this.configManager = configManager;
    this.outputDirectory = this.configManager.getOutputConfiguration().directory;
    this.promptGenerator = new PromptGenerator();
    this.outputChannel = vscode.window.createOutputChannel('AI Product Owner - Analysis Engine');
  }

  /**
   * Generate comprehensive analysis using 5 focused prompts (new approach)
   */
  async generateAnalysis(
    jiraData: JiraPortfolio,
    codebaseData: CodebaseAnalysis
  ): Promise<{outputPath: string, promptsGenerated: number}> {
    this.log('🚀 Starting 5-prompt analysis generation...');
    
    try {
      // Ensure output directory exists
      await this.ensureOutputDirectory();
      
      // Generate all 5 focused prompts with Mermaid diagrams
      const prompts = await this.promptGenerator.generateAllPrompts(
        jiraData,
        codebaseData,
        {
          includeContext7: this.configManager.getAnalysisConfiguration().includeContext7,
          maxSolutionCount: 2, // Enforce max 2 approaches
          outputDirectory: this.outputDirectory,
          saveToFiles: true
        }
      );

      // Create master documentation file
      const masterDocPath = await this.createMasterDocument(jiraData, codebaseData, prompts);
      
      this.log(`✅ Generated ${prompts.length} focused prompts with visual requirements`);
      this.log(`📋 Master document created: ${masterDocPath}`);
      
      return {
        outputPath: masterDocPath,
        promptsGenerated: prompts.length
      };
      
    } catch (error: any) {
      this.log(`❌ Analysis generation failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Legacy method for backward compatibility (redirects to new approach)
   */
  async runCompleteAnalysis(
    jiraData: JiraPortfolio,
    codebaseData: CodebaseAnalysis,
    progressCallback: (progress: AnalysisProgress) => void
  ): Promise<void> {
    this.log('🔄 Using new 5-prompt generation system...');
    
    const startTime = new Date().toISOString();
    
    try {
      // Report progress for each stage
      const stages = [
        { name: 'Business Analysis', progress: 20 },
        { name: 'Technical Architecture', progress: 35 },
        { name: 'Implementation Design', progress: 50 },
        { name: 'Development Plan', progress: 70 },
        { name: 'Risk Assessment', progress: 85 }
      ];

      for (const stage of stages) {
        progressCallback({
          stage: stage.name,
          progress: stage.progress,
          message: `Generating ${stage.name} prompt with Mermaid diagrams...`,
          startTime: startTime,
          errors: []
        });

        // Add realistic delay for each stage
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Generate all prompts
      const result = await this.generateAnalysis(jiraData, codebaseData);
      
      progressCallback({
        stage: 'Complete',
        progress: 100,
        message: `🎉 Generated ${result.promptsGenerated} focused prompts successfully!`,
        startTime: startTime,
        errors: []
      });
      
    } catch (error: any) {
      const errorMessage = error.message || 'Unknown error';
      progressCallback({
        stage: 'Error',
        progress: 0,
        message: `Analysis failed: ${errorMessage}`,
        startTime: startTime,
        errors: [errorMessage]
      });
      throw error;
    }
  }

  /**
   * Stage 1: Business Analysis (final requirements implementation)
   */
  private async generateBusinessAnalysis(
    jiraData: JiraPortfolio,
    codebaseData: CodebaseAnalysis
  ): Promise<AnalysisOutput> {
    const timestamp = new Date().toISOString();
    
    const businessPrompt = this.buildBusinessAnalysisPrompt(jiraData, codebaseData);
    
    // Generate Mermaid diagrams for business analysis
    const userJourneyDiagram = this.generateUserJourneyDiagram(jiraData);
    const stakeholderDiagram = this.generateStakeholderDiagram(jiraData);
    
    const visualizations: GeneratedVisualization[] = [
      {
        id: 'user-journey',
        type: 'mermaid-journey',
        title: 'User Journey Map',
        mermaidCode: userJourneyDiagram,
        description: 'Current vs. proposed user workflows'
      },
      {
        id: 'stakeholder-map',
        type: 'mermaid-flowchart',
        title: 'Stakeholder Impact Map',
        mermaidCode: stakeholderDiagram,
        description: 'All affected users and systems'
      }
    ];
    
    const content = this.formatAnalysisContent('Business Analysis', businessPrompt, visualizations);
    
    const output: AnalysisOutput = {
      stageId: 'business-analysis',
      stageName: 'Business Analysis',
      timestamp: timestamp,
      content: content,
      visualizations: visualizations,
      copilotPrompt: businessPrompt,
      metadata: {
        epicKey: jiraData.key,
        generatedAt: timestamp,
        duration: 5,
        stage: 'business-analysis',
        version: '1.0.0',
        confidence: 8
      }
    };
    
    // Save to file
    await this.saveAnalysisOutput(output, `business_analysis_${jiraData.key}.md`);
    
    return output;
  }

  /**
   * Stage 2: Technical Architecture Analysis
   */
  private async generateTechnicalArchitecture(
    jiraData: JiraPortfolio,
    codebaseData: CodebaseAnalysis
  ): Promise<AnalysisOutput> {
    const timestamp = new Date().toISOString();
    
    const techPrompt = this.buildTechnicalArchitecturePrompt(jiraData, codebaseData);
    
    // Generate architecture diagrams
    const currentArchDiagram = this.generateCurrentArchitectureDiagram(codebaseData);
    const proposedArchDiagram = this.generateProposedArchitectureDiagram(jiraData, codebaseData);
    const dataFlowDiagram = this.generateDataFlowDiagram(jiraData);
    
    const visualizations: GeneratedVisualization[] = [
      {
        id: 'current-architecture',
        type: 'mermaid-architecture',
        title: 'Current System Architecture',
        mermaidCode: currentArchDiagram,
        description: 'Existing components and flows'
      },
      {
        id: 'proposed-architecture',
        type: 'mermaid-architecture',
        title: 'Proposed System Architecture',
        mermaidCode: proposedArchDiagram,
        description: 'New components and integrations'
      },
      {
        id: 'data-flow',
        type: 'mermaid-flowchart',
        title: 'Data Flow Diagram',
        mermaidCode: dataFlowDiagram,
        description: 'Information flow between systems'
      }
    ];
    
    const content = this.formatAnalysisContent('Technical Architecture', techPrompt, visualizations);
    
    const output: AnalysisOutput = {
      stageId: 'technical-architecture',
      stageName: 'Technical Architecture',
      timestamp: timestamp,
      content: content,
      visualizations: visualizations,
      copilotPrompt: techPrompt,
      metadata: {
        epicKey: jiraData.key,
        generatedAt: timestamp,
        duration: 8,
        stage: 'technical-architecture',
        version: '1.0.0',
        confidence: 7
      }
    };
    
    await this.saveAnalysisOutput(output, `technical_architecture_${jiraData.key}.md`);
    
    return output;
  }

  /**
   * Stage 3: Implementation Design 
   */
  private async generateImplementationDesign(
    jiraData: JiraPortfolio,
    codebaseData: CodebaseAnalysis
  ): Promise<AnalysisOutput> {
    const timestamp = new Date().toISOString();
    
    const implPrompt = this.buildImplementationDesignPrompt(jiraData, codebaseData);
    
    // Generate implementation diagrams
    const sequenceDiagrams = this.generateSequenceDiagrams(jiraData);
    const componentDiagram = this.generateComponentDiagram(codebaseData);
    
    const visualizations: GeneratedVisualization[] = [
      ...sequenceDiagrams,
      {
        id: 'component-diagram',
        type: 'mermaid-architecture',
        title: 'Component Interaction Diagram',
        mermaidCode: componentDiagram,
        description: 'New and modified components with interfaces'
      }
    ];
    
    const content = this.formatAnalysisContent('Implementation Design', implPrompt, visualizations);
    
    const output: AnalysisOutput = {
      stageId: 'implementation-design',
      stageName: 'Implementation Design',
      timestamp: timestamp,
      content: content,
      visualizations: visualizations,
      copilotPrompt: implPrompt,
      metadata: {
        epicKey: jiraData.key,
        generatedAt: timestamp,
        duration: 12,
        stage: 'implementation-design',
        version: '1.0.0',
        confidence: 9
      }
    };
    
    await this.saveAnalysisOutput(output, `implementation_design_${jiraData.key}.md`);
    
    return output;
  }

  /**
   * Stage 4: Development Plan
   */
  private async generateDevelopmentPlan(
    jiraData: JiraPortfolio,
    codebaseData: CodebaseAnalysis
  ): Promise<AnalysisOutput> {
    const timestamp = new Date().toISOString();
    
    const devPrompt = this.buildDevelopmentPlanPrompt(jiraData, codebaseData);
    
    // Generate planning diagrams
    const ganttDiagram = this.generateGanttDiagram(jiraData);
    const dependencyDiagram = this.generateDependencyDiagram(jiraData);
    
    const visualizations: GeneratedVisualization[] = [
      {
        id: 'project-timeline',
        type: 'mermaid-flowchart',
        title: 'Project Timeline & Milestones',
        mermaidCode: ganttDiagram,
        description: 'Sprint breakdown and dependencies'
      },
      {
        id: 'task-dependencies',
        type: 'mermaid-flowchart',
        title: 'Task Dependency Graph',
        mermaidCode: dependencyDiagram,
        description: 'Critical path and task relationships'
      }
    ];
    
    const content = this.formatAnalysisContent('Development Plan', devPrompt, visualizations);
    
    const output: AnalysisOutput = {
      stageId: 'development-plan',
      stageName: 'Development Plan',
      timestamp: timestamp,
      content: content,
      visualizations: visualizations,
      copilotPrompt: devPrompt,
      metadata: {
        epicKey: jiraData.key,
        generatedAt: timestamp,
        duration: 10,
        stage: 'development-plan',
        version: '1.0.0',
        confidence: 8
      }
    };
    
    await this.saveAnalysisOutput(output, `development_plan_${jiraData.key}.md`);
    
    return output;
  }

  /**
   * Stage 5: Risk Assessment
   */
  private async generateRiskAssessment(
    jiraData: JiraPortfolio,
    codebaseData: CodebaseAnalysis
  ): Promise<AnalysisOutput> {
    const timestamp = new Date().toISOString();
    
    const riskPrompt = this.buildRiskAssessmentPrompt(jiraData, codebaseData);
    
    // Generate risk diagrams
    const riskMatrix = this.generateRiskMatrixDiagram();
    const mitigationFlow = this.generateMitigationFlowDiagram();
    
    const visualizations: GeneratedVisualization[] = [
      {
        id: 'risk-matrix',
        type: 'mermaid-flowchart',
        title: 'Risk Assessment Matrix',
        mermaidCode: riskMatrix,
        description: 'Risk impact vs probability analysis'
      },
      {
        id: 'mitigation-strategies',
        type: 'mermaid-flowchart',
        title: 'Risk Mitigation Strategies',
        mermaidCode: mitigationFlow,
        description: 'Mitigation approaches and contingency plans'
      }
    ];
    
    const content = this.formatAnalysisContent('Risk Assessment', riskPrompt, visualizations);
    
    const output: AnalysisOutput = {
      stageId: 'risk-assessment',
      stageName: 'Risk Assessment',
      timestamp: timestamp,
      content: content,
      visualizations: visualizations,
      copilotPrompt: riskPrompt,
      metadata: {
        epicKey: jiraData.key,
        generatedAt: timestamp,
        duration: 8,
        stage: 'risk-assessment',
        version: '1.0.0',
        confidence: 7
      }
    };
    
    await this.saveAnalysisOutput(output, `risk_assessment_${jiraData.key}.md`);
    
    return output;
  }

  /**
   * Build Business Analysis Prompt (from final requirements)
   */
  private buildBusinessAnalysisPrompt(jiraData: JiraPortfolio, codebaseData: CodebaseAnalysis): string {
    const jiraContext = this.formatJiraContext(jiraData);
    const codebaseContext = this.formatCodebaseContext(codebaseData);
    
    return `# Business Analysis - ${jiraData.key}

## Your Role
You are a senior product manager with expertise in user experience design and business analysis.

## Context
${jiraContext}

${codebaseContext}

## Required Analysis

### 1. Problem Definition
- Core business problem being solved
- Target user personas and their pain points
- Market opportunity and competitive landscape

### 2. User Impact Analysis
- Primary users and their workflows
- Secondary users and stakeholders
- Success metrics and KPIs

### 3. User Journey Mapping
Create detailed user journey maps showing:
- Current state user flows (with pain points)
- Proposed future state flows
- Emotional journey and satisfaction levels

### 4. Business Value Proposition
- Quantifiable business benefits
- Revenue/cost impact analysis
- Strategic alignment assessment

## Required Visualizations

Generate Mermaid diagrams for:
1. **User Journey Map**: Current vs. proposed user flows
2. **Stakeholder Map**: All affected users and systems
3. **Value Stream Map**: Business process improvements

Format all diagrams as valid Mermaid syntax with proper styling.

Provide comprehensive analysis with clear business justification for the technical investment.`;
  }

  /**
   * Build Technical Architecture Prompt (from final requirements)
   */
  private buildTechnicalArchitecturePrompt(jiraData: JiraPortfolio, codebaseData: CodebaseAnalysis): string {
    const jiraContext = this.formatJiraContext(jiraData);
    const codebaseContext = this.formatCodebaseContext(codebaseData);
    
    return `# Technical Architecture Analysis - ${jiraData.key}

## Your Role
You are a senior software architect with 10+ years of Go microservice experience.

## Context
${jiraContext}

${codebaseContext}

## Required Analysis

### 1. Current State Assessment
- Existing system capabilities and limitations
- Technical debt and architectural constraints
- Performance and scalability characteristics

### 2. Gap Analysis
- What needs to be built vs. modified vs. integrated
- Breaking vs. non-breaking changes required
- Data migration and compatibility requirements

### 3. Integration Architecture
- External system dependencies
- API contract changes required
- Data synchronization patterns

### 4. Scalability & Performance
- Expected load characteristics
- Caching strategies required
- Database optimization needs

## Required Visualizations

Generate Mermaid diagrams for:
1. **Current System Architecture**: Existing components and flows
2. **Proposed System Architecture**: New components and integrations
3. **Data Flow Diagram**: Information flow between systems
4. **Deployment Diagram**: Infrastructure and container layout

Use best practices for Go microservice architecture patterns.

Provide detailed technical assessment with specific recommendations and architectural decisions.`;
  }

  /**
   * Build Implementation Design Prompt (from final requirements)
   */
  private buildImplementationDesignPrompt(jiraData: JiraPortfolio, codebaseData: CodebaseAnalysis): string {
    return `# Implementation Design - ${jiraData.key}

## Your Role
You are a technical lead responsible for detailed implementation planning.

## Context
${this.formatJiraContext(jiraData)}

${this.formatCodebaseContext(codebaseData)}

## Required Analysis

### 1. Solution Approaches
Provide 1-2 implementation approaches (maximum 2, not 4-5):

**Approach 1**: [Recommended approach]
- Implementation strategy and key decisions
- Technology choices and rationale
- Effort estimation and timeline
- Pros, cons, and risk assessment

**Approach 2**: [Alternative if significantly different]
- Different implementation strategy
- Alternative technology choices
- Comparative effort and timeline
- Trade-off analysis vs. Approach 1

### 2. Detailed Design Specifications
For the recommended approach:
- API endpoint specifications with examples
- Database schema changes with migration plan
- Security implementation details
- Error handling and validation logic

### 3. Implementation Workflow
- Sequence diagrams for key user interactions
- Component interaction patterns
- Data transformation processes

## Required Visualizations

Generate Mermaid diagrams for:
1. **Sequence Diagrams**: 3-5 key user workflows end-to-end
2. **Component Diagram**: New and modified components with interfaces
3. **Database Schema**: Entity relationships and key changes
4. **API Flow Diagram**: Request/response patterns and validations

Focus on clarity and implementability. Provide enough detail for developers to begin implementation immediately.`;
  }

  /**
   * Build Development Plan Prompt
   */
  private buildDevelopmentPlanPrompt(jiraData: JiraPortfolio, codebaseData: CodebaseAnalysis): string {
    return `# Development Plan - ${jiraData.key}

## Your Role
You are a senior engineering manager with expertise in sprint planning and resource allocation.

## Context
${this.formatJiraContext(jiraData)}

${this.formatCodebaseContext(codebaseData)}

## Required Analysis

### 1. Sprint Breakdown
- Phase-by-phase development approach
- Sprint goals and deliverables
- Resource allocation and team assignments
- Dependencies and critical path

### 2. Task Prioritization
- High-priority foundational tasks
- Feature development sequence
- Testing and validation checkpoints
- Deployment and rollout strategy

### 3. Timeline and Milestones
- Realistic timeline with buffer periods
- Key milestones and success criteria
- Risk factors and contingency plans
- Resource requirements and constraints

## Required Visualizations

Generate Mermaid diagrams for:
1. **Project Timeline**: Sprint breakdown and milestones
2. **Task Dependencies**: Critical path and task relationships
3. **Resource Allocation**: Team assignments and capacity planning

Provide actionable development roadmap with realistic timelines and clear accountability.`;
  }

  /**
   * Build Risk Assessment Prompt
   */
  private buildRiskAssessmentPrompt(jiraData: JiraPortfolio, codebaseData: CodebaseAnalysis): string {
    return `# Risk Assessment - ${jiraData.key}

## Your Role
You are a senior engineering director with expertise in risk management and technical planning.

## Context
${this.formatJiraContext(jiraData)}

${this.formatCodebaseContext(codebaseData)}

## Required Analysis

### 1. Risk Identification
- Technical risks and complexity factors
- Operational risks and dependencies
- Business risks and market factors
- Security risks and compliance concerns

### 2. Risk Assessment
- Impact analysis (low/medium/high/critical)
- Probability assessment (low/medium/high)
- Risk priority matrix and scoring
- Critical risks requiring immediate attention

### 3. Mitigation Strategies
- Specific mitigation actions for each risk
- Contingency plans and fallback options
- Monitoring and early warning indicators
- Resource allocation for risk management

## Required Visualizations

Generate Mermaid diagrams for:
1. **Risk Matrix**: Impact vs probability analysis
2. **Mitigation Strategies**: Risk response approaches
3. **Decision Trees**: Risk scenario planning

Provide comprehensive risk management framework with actionable mitigation strategies.`;
  }

  // Helper methods for Mermaid diagram generation
  private generateUserJourneyDiagram(jiraData: JiraPortfolio): string {
    return `journey
    title User Journey - ${jiraData.name}
    section Current State
      Identify Need       : 3: User
      Manual Analysis     : 1: User
      Create Documentation: 2: User
      Review & Approve    : 3: User
    section Proposed State
      Identify Need       : 3: User
      AI-Assisted Analysis: 5: User
      Auto Documentation : 5: User
      Quick Review        : 4: User`;
  }

  private generateStakeholderDiagram(jiraData: JiraPortfolio): string {
    return `graph TB
    A[Product Owner] --> B[Development Team]
    A --> C[Business Stakeholders]
    B --> D[Senior Engineers]
    B --> E[QA Team]
    C --> F[End Users]
    C --> G[Management]
    
    style A fill:#e1f5fe
    style D fill:#fff3e0
    style F fill:#f3e5f5`;
  }

  private generateCurrentArchitectureDiagram(codebaseData: CodebaseAnalysis): string {
    const hasGin = codebaseData.techStack.some(t => t.name === 'Gin');
    const hasGorm = codebaseData.techStack.some(t => t.name === 'GORM');
    
    return `graph TB
    A[Client] --> B[${hasGin ? 'Gin Web Server' : 'HTTP Server'}]
    B --> C[Business Logic]
    C --> D[${hasGorm ? 'GORM ORM' : 'Database Layer'}]
    D --> E[Database]
    
    style A fill:#e1f5fe
    style B fill:#fff3e0
    style E fill:#f3e5f5`;
  }

  private generateProposedArchitectureDiagram(jiraData: JiraPortfolio, codebaseData: CodebaseAnalysis): string {
    return `graph TB
    A[Client] --> B[API Gateway]
    B --> C[Enhanced Web Server]
    C --> D[AI Analysis Service]
    C --> E[Business Logic]
    E --> F[Database Layer]
    F --> G[Database]
    D --> H[External APIs]
    
    style A fill:#e1f5fe
    style C fill:#fff3e0
    style D fill:#f3e5f5
    style G fill:#e8f5e8`;
  }

  private generateDataFlowDiagram(jiraData: JiraPortfolio): string {
    return `graph LR
    A[User Input] --> B[Validation]
    B --> C[Processing Engine]
    C --> D[AI Analysis]
    D --> E[Result Generation]
    E --> F[Response]
    
    style A fill:#e1f5fe
    style D fill:#fff3e0
    style F fill:#f3e5f5`;
  }

  private generateSequenceDiagrams(jiraData: JiraPortfolio): GeneratedVisualization[] {
    const authSequence = `sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as Auth API
    participant D as Database
    
    U->>F: Enter credentials
    F->>A: POST /auth/login
    A->>D: Validate user
    D-->>A: User data
    A-->>F: JWT token
    F-->>U: Login success`;

    const analysisSequence = `sequenceDiagram
    participant U as User
    participant A as Analysis API
    participant J as Jira Client
    participant AI as AI Service
    participant D as Database
    
    U->>A: Request analysis
    A->>J: Fetch epic data
    J-->>A: Epic details
    A->>AI: Process analysis
    AI-->>A: Analysis results
    A->>D: Store results
    A-->>U: Return analysis`;

    return [
      {
        id: 'auth-sequence',
        type: 'mermaid-sequence',
        title: 'Authentication Flow',
        mermaidCode: authSequence,
        description: 'User authentication sequence'
      },
      {
        id: 'analysis-sequence',
        type: 'mermaid-sequence',
        title: 'Analysis Process Flow',
        mermaidCode: analysisSequence,
        description: 'End-to-end analysis workflow'
      }
    ];
  }

  private generateComponentDiagram(codebaseData: CodebaseAnalysis): string {
    return `graph TB
    A[API Layer] --> B[Service Layer]
    B --> C[Repository Layer]
    C --> D[Database]
    
    E[New AI Module] --> B
    F[Jira Integration] --> B
    
    style E fill:#fff3e0
    style F fill:#f3e5f5`;
  }

  private generateGanttDiagram(jiraData: JiraPortfolio): string {
    return `graph LR
    A[Sprint 1<br/>Foundation] --> B[Sprint 2<br/>Core Features]
    B --> C[Sprint 3<br/>Integration]
    C --> D[Sprint 4<br/>Testing]
    D --> E[Sprint 5<br/>Deployment]
    
    style A fill:#e1f5fe
    style C fill:#fff3e0
    style E fill:#f3e5f5`;
  }

  private generateDependencyDiagram(jiraData: JiraPortfolio): string {
    return `graph TD
    A[Database Setup] --> B[API Development]
    A --> C[Auth System]
    B --> D[Frontend Integration]
    C --> D
    D --> E[Testing]
    E --> F[Deployment]
    
    style A fill:#f3e5f5
    style F fill:#e8f5e8`;
  }

  private generateRiskMatrixDiagram(): string {
    return `graph TB
    A[High Impact<br/>Low Probability] --> B[High Impact<br/>High Probability]
    C[Low Impact<br/>Low Probability] --> D[Low Impact<br/>High Probability]
    
    style B fill:#ffebee
    style A fill:#fff3e0
    style D fill:#e8f5e8
    style C fill:#f3e5f5`;
  }

  private generateMitigationFlowDiagram(): string {
    return `graph TD
    A[Identify Risk] --> B[Assess Impact]
    B --> C[Develop Strategy]
    C --> D[Implement Controls]
    D --> E[Monitor Progress]
    E --> F[Adjust as Needed]
    
    style A fill:#e1f5fe
    style C fill:#fff3e0
    style E fill:#f3e5f5`;
  }

  // Helper methods for formatting and file operations
  private formatJiraContext(jiraData: JiraPortfolio): string {
    return `### Jira Context
**Epic**: ${jiraData.key} - ${jiraData.name}
**Type**: ${jiraData.type}
**Total Story Points**: ${jiraData.totalStoryPoints}
**Number of Epics**: ${jiraData.epics.length}
**Description**: ${jiraData.description || 'No description provided'}

**Stories Summary**:
${jiraData.epics.flatMap(epic => epic.stories).slice(0, 5).map(story => 
  `- ${story.key}: ${story.summary} (${story.storyPoints || 0} pts)`
).join('\n')}`;
  }

  private formatCodebaseContext(codebaseData: CodebaseAnalysis): string {
    return `### Codebase Context
**Project Path**: ${codebaseData.projectPath}
**Total Files**: ${codebaseData.totalFiles}
**Packages**: ${codebaseData.packages.join(', ')}
**Key Structures**: ${codebaseData.structs.slice(0, 10).join(', ')}
**Tech Stack**: ${codebaseData.techStack.map(t => t.name).join(', ')}
**Complexity**: ${codebaseData.metrics.complexity}
**Lines of Code**: ${codebaseData.metrics.linesOfCode}

**Architectural Patterns**:
${codebaseData.patterns.map(p => `- ${p.name}: ${p.description}`).join('\n')}`;
  }

  private formatAnalysisContent(
    stageName: string, 
    prompt: string, 
    visualizations: GeneratedVisualization[]
  ): string {
    return `# ${stageName}

Generated: ${new Date().toLocaleString()}

## GitHub Copilot Prompt

Copy the following prompt to GitHub Copilot Chat:

\`\`\`
${prompt}
\`\`\`

## Expected Visualizations

${visualizations.map(viz => `
### ${viz.title}
${viz.description}

\`\`\`mermaid
${viz.mermaidCode}
\`\`\`
`).join('\n')}

## Instructions

1. Copy the prompt above to GitHub Copilot Chat
2. Review the generated analysis
3. Use the Mermaid diagrams to visualize the concepts
4. Iterate and refine as needed

---
*Generated by AI Product Owner Agent*`;
  }

  private async ensureOutputDirectory(): Promise<void> {
    if (!fs.existsSync(this.outputDirectory)) {
      fs.mkdirSync(this.outputDirectory, { recursive: true });
    }
  }

  private async saveAnalysisOutput(output: AnalysisOutput, filename: string): Promise<void> {
    const filePath = path.join(this.outputDirectory, filename);
    fs.writeFileSync(filePath, output.content, 'utf-8');
    console.log(`💾 Saved: ${filename}`);
  }

  /**
   * Create master documentation file with all prompts (new approach)
   */
  private async createMasterDocument(
    jiraData: JiraPortfolio,
    codebaseData: CodebaseAnalysis,
    prompts: GeneratedPrompt[]
  ): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${timestamp}_${jiraData.key}_MASTER_ANALYSIS.md`;
    const filepath = path.join(this.outputDirectory, filename);

    const content = this.generateMasterDocumentContent(jiraData, codebaseData, prompts);
    
    try {
      fs.writeFileSync(filepath, content, 'utf-8');
      this.log(`📋 Master document created: ${filename}`);
      return filepath;
    } catch (error: any) {
      this.log(`❌ Failed to create master document: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate content for master document
   */
  private generateMasterDocumentContent(
    jiraData: JiraPortfolio,
    codebaseData: CodebaseAnalysis,
    prompts: GeneratedPrompt[]
  ): string {
    const sections: string[] = [];
    
    // Header
    sections.push(`# 🤖 AI Product Owner - 5-Prompt Analysis System`);
    sections.push(`**Epic/Portfolio**: ${jiraData.key} - ${jiraData.name}`);
    sections.push(`**Generated**: ${new Date().toLocaleString()}`);
    sections.push(`**Total Prompts**: ${prompts.length}`);
    sections.push(`**Total Estimated Time**: ${prompts.reduce((sum, p) => sum + p.estimatedDuration, 0)} minutes`);
    sections.push('');
    
    // Executive Summary
    sections.push('## 📊 Analysis Overview');
    sections.push(`- **Business Scope**: ${jiraData.epics.length} epics, ${jiraData.totalStoryPoints} story points`);
    sections.push(`- **Technical Scope**: ${codebaseData.totalFiles} Go files, ${codebaseData.packages.length} packages`);
    sections.push(`- **Architecture**: ${codebaseData.patterns.map(p => p.name).join(', ')}`);
    sections.push(`- **Analysis Type**: 5 focused prompts with Mermaid diagrams`);
    sections.push('');
    
    // Benefits of new approach
    sections.push('## 🚀 Benefits of 5-Prompt System');
    sections.push('✅ **Focused Expertise**: Each prompt targets specific domain knowledge');
    sections.push('✅ **Visual Clarity**: Every prompt requires Mermaid diagrams');
    sections.push('✅ **Limited Solutions**: Maximum 2 approaches per prompt');
    sections.push('✅ **Implementation Ready**: Actionable technical details');
    sections.push('✅ **Quality Control**: Structured requirements and validation');
    sections.push('');
    
    // Workflow instructions
    sections.push('## 📋 5-Prompt Workflow');
    sections.push('Use these prompts sequentially in GitHub Copilot Chat:');
    sections.push('');
    
    prompts.forEach((prompt, index) => {
      sections.push(`### ${index + 1}. ${prompt.name} (${prompt.estimatedDuration} min)`);
      sections.push(`- **Focus**: ${this.getPromptFocus(prompt.id)}`);
      sections.push(`- **Max Approaches**: ${prompt.maxApproaches}`);
      sections.push(`- **Required Diagrams**: ${prompt.requiredDiagrams.join(', ')}`);
      sections.push(`- **File**: \`${prompt.id}.md\``);
      sections.push('');
    });
    
    // Quality checklist
    sections.push('## ✅ Quality Validation Checklist');
    sections.push('For each Copilot response, verify:');
    sections.push('- [ ] All required Mermaid diagrams are present and valid');
    sections.push('- [ ] Maximum 2 solution approaches provided');
    sections.push('- [ ] Implementation details are specific and actionable');
    sections.push('- [ ] Visual diagrams clearly show system interactions');
    sections.push('- [ ] Technical decisions include clear justification');
    sections.push('- [ ] Response addresses all prompt requirements');
    sections.push('');
    
    // Context reference
    sections.push('## 📎 Context Reference');
    sections.push('');
    sections.push('### Jira Portfolio/Epic Data:');
    sections.push(`- **Key**: ${jiraData.key}`);
    sections.push(`- **Type**: ${jiraData.type}`);
    sections.push(`- **Total Points**: ${jiraData.totalStoryPoints}`);
    sections.push(`- **Epics**: ${jiraData.epics.length}`);
    sections.push('');
    sections.push('### Codebase Analysis:');
    sections.push(`- **Files**: ${codebaseData.totalFiles} Go files`);
    sections.push(`- **Packages**: ${codebaseData.packages.join(', ')}`);
    sections.push(`- **Complexity**: ${codebaseData.metrics.complexity}`);
    sections.push(`- **Patterns**: ${codebaseData.patterns.map(p => p.name).join(', ')}`);
    
    return sections.join('\n');
  }

  /**
   * Get focus description for each prompt type
   */
  private getPromptFocus(promptId: string): string {
    const focuses: Record<string, string> = {
      'business-analysis': 'User impact, business value, stakeholder analysis',
      'technical-architecture': 'System design, components, data flow',
      'implementation-design': 'Code structure, APIs, database schema',
      'development-plan': 'Sprint planning, timeline, team workflow',
      'risk-assessment': 'Risk identification, mitigation strategies'
    };
    return focuses[promptId] || 'Specialized analysis';
  }

  /**
   * VS Code specific: Log to output channel
   */
  private log(message: string): void {
    this.outputChannel.appendLine(message);
    console.log(message);
  }

  private async generateMasterDocument(
    jiraData: JiraPortfolio, 
    analysisResults: AnalysisOutput[]
  ): Promise<void> {
    const masterContent = `# Complete Analysis Report - ${jiraData.key}

Generated: ${new Date().toLocaleString()}
Epic: ${jiraData.key} - ${jiraData.name}

## Executive Summary

This comprehensive analysis covers all aspects of implementing the requirements for epic ${jiraData.key}.

## Analysis Stages

${analysisResults.map((result, index) => `
### ${index + 1}. ${result.stageName}

**Duration**: ${result.metadata.duration} minutes
**Confidence**: ${result.metadata.confidence}/10
**Generated**: ${new Date(result.timestamp).toLocaleString()}

[View detailed ${result.stageName.toLowerCase().replace(' ', '_')}_${jiraData.key}.md](${result.stageName.toLowerCase().replace(' ', '_')}_${jiraData.key}.md)

**Key Visualizations**:
${result.visualizations.map(viz => `- ${viz.title}: ${viz.description}`).join('\n')}
`).join('\n')}

## How to Use This Analysis

1. **Start with Business Analysis** - Understand the problem and user impact
2. **Review Technical Architecture** - Understand system changes needed
3. **Study Implementation Design** - Review detailed implementation approaches
4. **Follow Development Plan** - Execute using the provided roadmap
5. **Monitor Risk Assessment** - Track and mitigate identified risks

## Next Steps

1. Review each analysis stage in detail
2. Use the GitHub Copilot prompts to refine the analysis
3. Create implementation tickets based on the development plan
4. Set up monitoring for the identified risks

---
*Generated by AI Product Owner Agent v1.0.0*`;

    const masterPath = path.join(this.outputDirectory, `complete_analysis_${jiraData.key}.md`);
    fs.writeFileSync(masterPath, masterContent, 'utf-8');
    console.log(`📋 Master document saved: complete_analysis_${jiraData.key}.md`);
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    this.outputChannel.dispose();
    this.promptGenerator.dispose();
  }
} 