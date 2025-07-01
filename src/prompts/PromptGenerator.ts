/**
 * Advanced Prompt Generator - Multi-Stage Visual Analysis System
 * Generates 5 separate focused prompts with Mermaid diagram requirements
 */

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { JiraPortfolio, CodebaseAnalysis } from '../types';
import { PROMPT_TEMPLATES, PromptTemplate } from './PromptTemplates';

export interface GeneratedPrompt {
  id: string;
  name: string;
  content: string;
  estimatedDuration: number;
  requiredDiagrams: string[];
  maxApproaches: number;
  timestamp: string;
}

export interface PromptGenerationOptions {
  includeContext7?: boolean;
  maxSolutionCount?: number;
  outputDirectory?: string;
  saveToFiles?: boolean;
}

export class PromptGenerator {
  private outputChannel: vscode.OutputChannel;
  private previousResults: Map<string, string> = new Map();

  constructor() {
    this.outputChannel = vscode.window.createOutputChannel('AI Product Owner - Prompt Generator');
  }

  /**
   * Generate all 5 focused prompts with visual requirements
   */
  async generateAllPrompts(
    jiraData: JiraPortfolio,
    codebaseData: CodebaseAnalysis,
    options: PromptGenerationOptions = {}
  ): Promise<GeneratedPrompt[]> {
    this.log('🎯 Generating 5 focused prompts with Mermaid diagrams...');
    
    const timestamp = new Date().toISOString();
    const prompts: GeneratedPrompt[] = [];

    // Prepare context data for substitution
    const contextData = this.prepareContextData(jiraData, codebaseData, options);

    // Generate each prompt sequentially to maintain context flow
    for (const template of PROMPT_TEMPLATES) {
      this.log(`📝 Generating: ${template.name} (${template.estimatedDuration} min)`);
      
      const promptContent = this.substituteTemplateVariables(
        template.template,
        contextData,
        template.id
      );

      const generatedPrompt: GeneratedPrompt = {
        id: template.id,
        name: template.name,
        content: promptContent,
        estimatedDuration: template.estimatedDuration,
        requiredDiagrams: template.requiredDiagrams,
        maxApproaches: template.maxApproaches,
        timestamp: timestamp
      };

      prompts.push(generatedPrompt);

      // Store result for next prompts to reference
      this.previousResults.set(template.id, promptContent);

      this.log(`✅ Generated ${template.name}: ${promptContent.length} characters`);
    }

    // Save to files if requested
    if (options.saveToFiles) {
      await this.savePromptsToFiles(prompts, jiraData.key, options.outputDirectory);
    }

    this.log(`🎉 All 5 prompts generated successfully! Total estimated time: ${this.getTotalDuration(prompts)} minutes`);
    
    return prompts;
  }

  /**
   * Generate individual prompt by ID
   */
  async generatePrompt(
    templateId: string,
    jiraData: JiraPortfolio,
    codebaseData: CodebaseAnalysis,
    options: PromptGenerationOptions = {}
  ): Promise<GeneratedPrompt | null> {
    const template = PROMPT_TEMPLATES.find(t => t.id === templateId);
    if (!template) {
      this.log(`❌ Template not found: ${templateId}`);
      return null;
    }

    this.log(`📝 Generating single prompt: ${template.name}`);

    const contextData = this.prepareContextData(jiraData, codebaseData, options);
    const promptContent = this.substituteTemplateVariables(
      template.template,
      contextData,
      template.id
    );

    return {
      id: template.id,
      name: template.name,
      content: promptContent,
      estimatedDuration: template.estimatedDuration,
      requiredDiagrams: template.requiredDiagrams,
      maxApproaches: template.maxApproaches,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Prepare context data for template substitution
   */
  private prepareContextData(
    jiraData: JiraPortfolio,
    codebaseData: CodebaseAnalysis,
    options: PromptGenerationOptions
  ): Record<string, string> {
    return {
      epicKey: jiraData.key,
      epicName: jiraData.name,
      jiraContext: this.formatJiraContext(jiraData),
      codebaseContext: this.formatCodebaseContext(codebaseData),
      businessAnalysis: this.previousResults.get('business-analysis') || '[To be generated in previous step]',
      technicalArchitecture: this.previousResults.get('technical-architecture') || '[To be generated in previous step]',
      implementationDesign: this.previousResults.get('implementation-design') || '[To be generated in previous step]',
      developmentPlan: this.previousResults.get('development-plan') || '[To be generated in previous step]',
      context7Docs: options.includeContext7 ? '[Context7 documentation would be included here]' : '',
      maxSolutions: Math.min(options.maxSolutionCount || 2, 2).toString(), // Enforce max 2 approaches
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Format Jira context for prompt substitution
   */
  private formatJiraContext(jiraData: JiraPortfolio): string {
    const sections: string[] = [];

    // Epic/Portfolio Overview
    sections.push(`### Epic/Portfolio Overview`);
    sections.push(`**Key**: ${jiraData.key}`);
    sections.push(`**Name**: ${jiraData.name}`);
    sections.push(`**Type**: ${jiraData.type}`);
    sections.push(`**Description**: ${jiraData.description || 'No description provided'}`);
    sections.push(`**Total Story Points**: ${jiraData.totalStoryPoints}`);
    sections.push('');

    // Epics breakdown
    sections.push(`### Epics (${jiraData.epics.length})`);
    jiraData.epics.forEach((epic, index) => {
      sections.push(`**${index + 1}. ${epic.key}**: ${epic.summary}`);
      sections.push(`   - Status: ${epic.status}`);
      sections.push(`   - Stories: ${epic.stories.length} (${epic.totalPoints} points)`);
      // Handle cases where description might be null, undefined, or not a string
      const descriptionText = (epic.description && typeof epic.description === 'string') 
        ? epic.description 
        : 'No description provided';
      sections.push(`   - Description: ${descriptionText.substring(0, 150)}${descriptionText.length > 150 ? '...' : ''}`);
      sections.push('');
    });

    // Key Stories
    sections.push(`### Key Stories`);
    const allStories = jiraData.epics.flatMap(epic => epic.stories);
    const keyStories = allStories
      .filter(story => story.storyPoints && story.storyPoints > 0)
      .sort((a, b) => (b.storyPoints || 0) - (a.storyPoints || 0))
      .slice(0, 8); // Top 8 stories by points

    keyStories.forEach(story => {
      sections.push(`- **${story.key}** (${story.storyPoints} pts): ${story.summary}`);
      sections.push(`  Priority: ${story.priority} | Status: ${story.status}`);
    });

    return sections.join('\n');
  }

  /**
   * Format codebase context for prompt substitution
   */
  private formatCodebaseContext(codebaseData: CodebaseAnalysis): string {
    const sections: string[] = [];

    // Project Overview
    sections.push(`### Go Codebase Overview`);
    sections.push(`**Project Path**: ${codebaseData.projectPath}`);
    sections.push(`**Total Files**: ${codebaseData.totalFiles} Go files`);
    sections.push(`**Packages**: ${codebaseData.packages.length} (${codebaseData.packages.join(', ')})`);
    sections.push(`**Complexity**: ${codebaseData.metrics.complexity} (${codebaseData.metrics.linesOfCode} estimated LOC)`);
    sections.push('');

    // Architecture Patterns
    sections.push(`### Architecture Patterns`);
    codebaseData.patterns.forEach(pattern => {
      sections.push(`- **${pattern.name}**: ${pattern.description} (${pattern.confidence}/10 confidence)`);
    });
    sections.push('');

    // Tech Stack
    sections.push(`### Technology Stack`);
    codebaseData.techStack.forEach(tech => {
      sections.push(`- **${tech.name}** (${tech.type}): ${tech.usage} usage`);
    });
    sections.push('');

    // Code Structure
    sections.push(`### Code Structure`);
    sections.push(`**Key Structs**: ${codebaseData.structs.slice(0, 10).join(', ')}`);
    sections.push(`**Main Functions**: ${codebaseData.functions.slice(0, 10).join(', ')}`);
    sections.push(`**Key Imports**: ${codebaseData.imports.slice(0, 8).join(', ')}`);
    sections.push('');

    // Quality Metrics
    sections.push(`### Quality Assessment`);
    sections.push(`- **Technical Debt**: ${codebaseData.metrics.technicalDebt}`);
    sections.push(`- **Maintainability**: ${codebaseData.metrics.maintainability}/10`);
    if (codebaseData.metrics.testCoverage) {
      sections.push(`- **Test Coverage**: ${codebaseData.metrics.testCoverage}%`);
    }

    return sections.join('\n');
  }

  /**
   * Substitute template variables with actual data
   */
  private substituteTemplateVariables(
    template: string,
    contextData: Record<string, string>,
    templateId: string
  ): string {
    let result = template;

    // Replace all template variables
    Object.entries(contextData).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      result = result.replace(new RegExp(placeholder, 'g'), value);
    });

    // Add template-specific enhancements
    result = this.addTemplateSpecificContent(result, templateId, contextData);

    // Validate Mermaid diagrams are present
    this.validateMermaidDiagrams(result, templateId);

    return result;
  }

  /**
   * Add template-specific content and customizations
   */
  private addTemplateSpecificContent(
    content: string,
    templateId: string,
    contextData: Record<string, string>
  ): string {
    const epicKey = contextData.epicKey;
    const timestamp = new Date().toLocaleString();

    // Add header with metadata
    const header = `---
**Generated**: ${timestamp}
**Epic**: ${epicKey}
**Template**: ${templateId}
**Max Approaches**: ${PROMPT_TEMPLATES.find(t => t.id === templateId)?.maxApproaches || 1}
---

`;

    // Add footer with copy instructions
    const footer = `

---
## 📋 Copy Instructions
1. **Copy this entire prompt** (from the # title to this line)
2. **Paste into GitHub Copilot Chat** (VS Code, GitHub.com, or Copilot app)
3. **Wait for complete response** with all required Mermaid diagrams
4. **Save the response** for the next analysis stage

⏱️ **Estimated completion time**: ${PROMPT_TEMPLATES.find(t => t.id === templateId)?.estimatedDuration || 5} minutes
`;

    return header + content + footer;
  }

  /**
   * Validate that required Mermaid diagrams are present in the prompt
   */
  private validateMermaidDiagrams(content: string, templateId: string): void {
    const template = PROMPT_TEMPLATES.find(t => t.id === templateId);
    if (!template) return;

    const mermaidBlocks = content.match(/```mermaid/g) || [];
    const requiredCount = template.requiredDiagrams.length;

    if (mermaidBlocks.length < requiredCount) {
      this.log(`⚠️ Warning: ${templateId} has ${mermaidBlocks.length} Mermaid diagrams, but ${requiredCount} are required`);
    } else {
      this.log(`✅ ${templateId} has all ${requiredCount} required Mermaid diagrams`);
    }
  }

  /**
   * Save all prompts to individual markdown files
   */
  private async savePromptsToFiles(
    prompts: GeneratedPrompt[],
    epicKey: string,
    outputDirectory?: string
  ): Promise<void> {
    const outputDir = outputDirectory || path.join(vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '', 'output', 'prompts');
    
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    for (const prompt of prompts) {
      const filename = `${timestamp}_${epicKey}_${prompt.id}.md`;
      const filepath = path.join(outputDir, filename);
      
      try {
        fs.writeFileSync(filepath, prompt.content, 'utf-8');
        this.log(`💾 Saved: ${filename}`);
      } catch (error: any) {
        this.log(`❌ Failed to save ${filename}: ${error.message}`);
      }
    }

    // Create a master index file
    const indexContent = this.createMasterIndex(prompts, epicKey);
    const indexFilename = `${timestamp}_${epicKey}_INDEX.md`;
    const indexFilepath = path.join(outputDir, indexFilename);
    
    try {
      fs.writeFileSync(indexFilepath, indexContent, 'utf-8');
      this.log(`📋 Created master index: ${indexFilename}`);
    } catch (error: any) {
      this.log(`❌ Failed to create index: ${error.message}`);
    }
  }

  /**
   * Create master index file with all prompts
   */
  private createMasterIndex(prompts: GeneratedPrompt[], epicKey: string): string {
    const sections: string[] = [];
    
    sections.push(`# AI Product Owner - Analysis Prompts for ${epicKey}`);
    sections.push(`Generated: ${new Date().toLocaleString()}`);
    sections.push('');
    
    sections.push('## 🎯 Analysis Workflow');
    sections.push('Use these prompts sequentially for comprehensive analysis:');
    sections.push('');
    
    let totalTime = 0;
    prompts.forEach((prompt, index) => {
      totalTime += prompt.estimatedDuration;
      sections.push(`### ${index + 1}. ${prompt.name} (${prompt.estimatedDuration} min)`);
      sections.push(`- **Max Approaches**: ${prompt.maxApproaches}`);
      sections.push(`- **Required Diagrams**: ${prompt.requiredDiagrams.join(', ')}`);
      sections.push(`- **File**: \`${prompt.id}.md\``);
      sections.push('');
    });
    
    sections.push(`## ⏱️ Total Estimated Time: ${totalTime} minutes`);
    sections.push('');
    
    sections.push('## 📋 Usage Instructions');
    sections.push('1. Start with **Business Analysis** - copy and paste into GitHub Copilot');
    sections.push('2. Save the response, then move to **Technical Architecture**');
    sections.push('3. Continue sequentially through all 5 prompts');
    sections.push('4. Each prompt builds on previous analysis results');
    sections.push('5. All prompts require specific Mermaid diagrams in responses');
    sections.push('');
    
    sections.push('## ✅ Quality Checklist');
    sections.push('For each prompt response, ensure:');
    sections.push('- [ ] All required Mermaid diagrams are generated');
    sections.push('- [ ] Maximum 2 solution approaches provided');
    sections.push('- [ ] Implementation details are specific and actionable');
    sections.push('- [ ] Visual diagrams clearly show system interactions');
    sections.push('- [ ] Technical decisions are well-justified');
    
    return sections.join('\n');
  }

  /**
   * Get total duration for all prompts
   */
  private getTotalDuration(prompts: GeneratedPrompt[]): number {
    return prompts.reduce((total, prompt) => total + prompt.estimatedDuration, 0);
  }

  /**
   * Generate technical stage-specific prompt with codebase context
   */
  async generateTechnicalStagePrompt(
    stage: any,
    jiraData: JiraPortfolio,
    codebaseData: CodebaseAnalysis,
    stageIndex: number,
    options: PromptGenerationOptions = {}
  ): Promise<GeneratedPrompt> {
    this.log(`🧠 Generating technical prompt for stage ${stageIndex + 1}: ${stage.name}`);

    const contextData = this.prepareContextData(jiraData, codebaseData, options);
    
    // Generate stage-specific prompts based on the technical analysis process
    const stagePrompts = {
      'requirements-analysis': this.generateRequirementsAnalysisPrompt(contextData, stage),
      'design-overview': this.generateDesignOverviewPrompt(contextData, stage),
      'technical-design': this.generateTechnicalDesignPrompt(contextData, stage),
      'infrastructure-nfr': this.generateInfrastructureNFRPrompt(contextData, stage),
      'task-breakdown': this.generateTaskBreakdownPrompt(contextData, stage)
    };

    const promptContent = stagePrompts[stage.id as keyof typeof stagePrompts] || this.generateGenericStagePrompt(contextData, stage);

    return {
      id: stage.id,
      name: stage.name,
      content: promptContent,
      estimatedDuration: parseInt(stage.duration.split(' ')[0]),
      requiredDiagrams: stage.requiredDiagrams,
      maxApproaches: 2,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Generate Requirements Analysis prompt
   */
  private generateRequirementsAnalysisPrompt(contextData: Record<string, string>, stage: any): string {
    return `# Requirements Analysis - Principal Engineer Review

You are a **Principal Engineer** analyzing requirements for epic ${contextData.epicKey}.

## Jira Requirements Context

${contextData.jiraContext}

## Current Codebase Context

${contextData.codebaseContext}

## Analysis Task

As a Principal Engineer, provide a **Requirements Analysis** following this structure:

### 1. Requirements Summary (2-3 paragraphs)
- Your understanding of the requirements at a high level
- Key functional and non-functional requirements
- Scope and boundaries of the feature

### 2. Dependencies & Interactions  
- Dependencies on other features (Done or in Discovery)
- How other features might interact with these requirements
- External system dependencies
- Database/API dependencies

### 3. Use Cases & Scenarios
- Clear use cases to keep in mind while designing
- Edge cases and error scenarios
- User workflows that will be affected

### 4. Assumptions
- Technical assumptions made based on the requirements
- Clarifications needed from PMs
- Constraints or limitations identified

## Required Mermaid Diagrams

1. **Requirements Overview** (flowchart) - High-level requirements flow
2. **Dependencies Map** (graph) - Dependencies between features and systems

## Quality Standards

- **Codebase-specific**: Reference actual project structure and patterns
- **Technical depth**: Principal Engineer level analysis
- **Implementation ready**: Clear technical understanding
- **Assumption-driven**: Explicit about what needs clarification

Focus on how these requirements fit into the existing codebase architecture and what technical considerations are most important.

**Estimated Duration: ${stage.duration}**
`;
  }

  /**
   * Generate Design Overview prompt
   */
  private generateDesignOverviewPrompt(contextData: Record<string, string>, stage: any): string {
    return `# Design Overview - Principal Engineer Architecture

You are a **Principal Engineer** creating a high-level design for epic ${contextData.epicKey}.

## Requirements Context (from previous analysis)
*Reference the requirements analysis to maintain consistency*

## Current Codebase Context

${contextData.codebaseContext}

## Design Task

As a Principal Engineer, provide a **Design Overview** following this structure:

### 1. Design Concept (keep short and simple)
- Core architectural concept for implementing the requirements
- Main components and their responsibilities  
- Key design decisions and rationale
- How it fits into existing architecture

### 2. High-Level Architecture
- Overall system design approach
- Major components and their interactions
- Data flow at a high level
- Integration points

### 3. Design Principles
- Architectural patterns being followed
- Design principles guiding the solution
- Trade-offs and alternatives considered
- Scalability and maintainability considerations

## Required Mermaid Diagrams

1. **Design Overview Diagram** (graph) - High-level architecture overview
2. **Component Interaction** (flowchart) - How major components interact

## Quality Standards

- **Concise but comprehensive**: Overview, not detailed specification
- **Architecture-focused**: Principal Engineer level design thinking
- **Codebase-aligned**: Fits existing patterns and architecture
- **Decision-driven**: Clear rationale for design choices

Keep this section focused on the big picture - detailed specifications come in the next stage.

**Estimated Duration: ${stage.duration}**
`;
  }

  /**
   * Generate Technical Design prompt
   */
  private generateTechnicalDesignPrompt(contextData: Record<string, string>, stage: any): string {
    return `# Detailed Technical Design - Principal Engineer Implementation

You are a **Principal Engineer** creating detailed technical specifications for epic ${contextData.epicKey}.

## Design Context (from previous analysis)
*Reference the design overview to maintain consistency*

## Current Codebase Context

${contextData.codebaseContext}

## Technical Design Task

As a Principal Engineer, provide **Detailed Technical Design** following this structure:

### 1. Database Changes
- Schema modifications (new tables, columns, indices)
- Data migration strategy
- Performance considerations
- Backward compatibility

### 2. API Changes
- New endpoints or modifications to existing ones
- Request/response formats
- Authentication/authorization changes
- Versioning strategy

### 3. Core Business Logic
- New business logic components
- Modifications to existing logic
- Domain objects and their relationships
- Validation rules and constraints

### 4. Codebase-Specific Components
- New packages/modules following project structure
- Integration with existing components (emails, cronjobs, etc.)
- Configuration changes
- Third-party integrations

### 5. Implementation Approach
- Maximum 2 alternative approaches
- Detailed implementation strategy
- Code organization and structure
- Testing approach

## Required Mermaid Diagrams

1. **Database Schema Changes** (erDiagram) - New/modified tables and relationships
2. **API Design** (sequenceDiagram) - API request/response flows
3. **Business Logic Flow** (flowchart) - Core business logic processing
4. **Component Architecture** (graph) - Code components and dependencies

## Quality Standards

- **Implementation-ready**: Detailed enough for development
- **Codebase-specific**: Uses actual project patterns and structure
- **Performance-aware**: Considers scalability and optimization
- **Maintainable**: Follows existing architectural patterns

Focus on technical details that developers need to implement the feature within the existing codebase.

**Estimated Duration: ${stage.duration}**
`;
  }

  /**
   * Generate Infrastructure & NFR prompt
   */
  private generateInfrastructureNFRPrompt(contextData: Record<string, string>, stage: any): string {
    return `# Infrastructure & Non-Functional Requirements - Principal Engineer Operations

You are a **Principal Engineer** analyzing infrastructure and non-functional requirements for epic ${contextData.epicKey}.

## Technical Context (from previous analysis)
*Reference the technical design to maintain consistency*

## Current Codebase & Infrastructure Context

${contextData.codebaseContext}

## Infrastructure & NFR Task

As a Principal Engineer, provide analysis following this structure:

### 1. Infrastructure Changes
- CI/CD pipeline modifications
- Deployment strategy and changes
- AWS/Cloud resource requirements
- Terraform or infrastructure-as-code changes
- Monitoring and alerting setup

### 2. Testing Strategy
- Unit testing approach
- Integration testing requirements
- End-to-end testing considerations
- Performance testing plan
- Testing infrastructure needs

### 3. Performance & Scalability
- Performance requirements and benchmarks
- Scalability considerations
- Caching strategy
- Database optimization
- Load testing approach

### 4. Concurrency & Reliability
- Concurrency handling
- Error handling and recovery
- Graceful degradation
- Circuit breakers and timeouts
- Data consistency guarantees

### 5. Backward Compatibility
- API backward compatibility
- Database migration safety
- Feature flag strategy
- Rollback procedures
- Deprecation timeline

### 6. Security Considerations
- Authentication/authorization changes
- Data privacy and compliance
- Security testing requirements
- Vulnerability assessments

## Required Mermaid Diagrams

1. **Infrastructure Changes** (graph) - Infrastructure components and changes
2. **Performance Architecture** (flowchart) - Performance and scalability design

## Quality Standards

- **Operations-ready**: Covers deployment and maintenance
- **Risk-aware**: Identifies potential operational risks
- **Measurable**: Clear performance and reliability metrics
- **Comprehensive**: All non-functional aspects covered

Focus on operational excellence and ensuring the feature works reliably in production.

**Estimated Duration: ${stage.duration}**
`;
  }

  /**
   * Generate Task Breakdown prompt
   */
  private generateTaskBreakdownPrompt(contextData: Record<string, string>, stage: any): string {
    return `# Task Breakdown - Product Owner Planning

You are now a **Product Owner** breaking down the technical analysis into actionable Jira tasks for epic ${contextData.epicKey}.

## Complete Technical Analysis Context
*Reference all previous analysis stages to create comprehensive task breakdown*

## Task Breakdown Task

As a Product Owner, provide **Task Breakdown** following this structure:

### 1. Epic Breakdown Strategy
- How to break the epic into logical development tasks
- Task prioritization and dependencies
- Sprint organization recommendations
- Parallel vs sequential development paths

### 2. Jira Tasks with Details

For each task, provide:

#### Task Title
- Clear, action-oriented title
- Follows team naming conventions

#### Description
- Context and purpose
- Links to requirements and design
- Technical approach summary

#### Acceptance Criteria
- Specific, testable criteria
- Clear success conditions
- Edge cases covered

#### Definition of Done
- Code quality standards
- Testing requirements
- Documentation needs
- Review and approval process

#### Estimated Story Points
- Based on complexity and effort
- Includes development, testing, and documentation

### 3. Implementation Timeline
- Recommended sprint allocation
- Critical path identification
- Risk mitigation in timeline
- Milestone definitions

### 4. Team Coordination
- Cross-team dependencies
- Handoff requirements
- Communication plan
- Review checkpoints

## Required Mermaid Diagrams

1. **Task Breakdown Structure** (graph) - Tasks and their relationships
2. **Implementation Timeline** (gantt) - Sprint timeline with dependencies

## Quality Standards

- **Actionable**: Each task is ready for development
- **Comprehensive**: Covers all aspects of the technical design
- **Realistic**: Proper estimation and timeline
- **Traceable**: Clear connection to requirements and design

Create Jira-ready tasks that development teams can pick up and execute immediately.

**Estimated Duration: ${stage.duration}**
`;
  }

  /**
   * Generate generic stage prompt (fallback)
   */
  private generateGenericStagePrompt(contextData: Record<string, string>, stage: any): string {
    return `# ${stage.name} - Technical Analysis

You are a **Principal Engineer** working on epic ${contextData.epicKey}.

## Context

${contextData.jiraContext}

${contextData.codebaseContext}

## Analysis Task

Provide technical analysis for: ${stage.description}

## Required Mermaid Diagrams

${stage.requiredDiagrams.map((diagram: string, index: number) => `${index + 1}. **${diagram}**`).join('\n')}

**Estimated Duration: ${stage.duration}**
`;
  }

  /**
   * Get available template information
   */
  getAvailableTemplates(): PromptTemplate[] {
    return [...PROMPT_TEMPLATES];
  }

  /**
   * Clear previous results (for fresh generation)
   */
  clearPreviousResults(): void {
    this.previousResults.clear();
    this.log('🔄 Cleared previous analysis results');
  }

  /**
   * VS Code specific: Log to output channel
   */
  private log(message: string): void {
    this.outputChannel.appendLine(message);
    console.log(message);
  }

  /**
   * VS Code specific: Show output channel
   */
  showOutput(): void {
    this.outputChannel.show();
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    this.outputChannel.dispose();
  }
} 