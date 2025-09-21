/**
 * Simplified Document Generator
 *
 * Creates lean markdown documentation for AI workflow.
 * Focuses on essential file generation following best practices.
 */

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs/promises';
import { Logger, createLogger } from '../utils/Logger';
import { ConfigurationManager } from '../utils/ConfigurationManager';
import { getStagesInOrder } from '../prompts/PromptTemplates';
import { buildContextFrame } from '../prompts/ContextEngineering';
import { JiraPortfolio, CodebaseAnalysis } from '../types';

export class DocumentGenerator {
  private logger: Logger;
  private configManager: ConfigurationManager;
  private baseOutputDir: string;

  constructor() {
    this.logger = createLogger('DocumentGenerator');
    this.configManager = new ConfigurationManager();

    // Use configuration-based output directory
    const outputConfig = this.configManager.getOutputConfiguration();
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

    if (path.isAbsolute(outputConfig.directory)) {
      this.baseOutputDir = outputConfig.directory;
    } else if (workspaceFolder) {
      this.baseOutputDir = path.join(workspaceFolder.uri.fsPath, outputConfig.directory);
    } else {
      this.baseOutputDir = path.join(process.cwd(), outputConfig.directory);
    }

    this.logger.info(`Document output directory: ${this.baseOutputDir}`);
  }

  /**
   * Initialize clean output structure for an epic
   */
  async initializeOutputStructure(epicKey: string): Promise<string> {
    const epicDir = path.join(this.baseOutputDir, epicKey);

    try {
      // Ensure directory exists
      await this.ensureDirectory(epicDir);

      // Create the essential markdown files
      await this.createReadme(epicKey);
      await this.createPromptsDocument(epicKey);
      await this.createAnalysisDocument(epicKey);
      // Context placeholder (filled after analysis available)
      await this.createContextDocument(epicKey, '');

      this.logger.info(`✅ Initialized output structure for ${epicKey}`);
      return epicDir;
    } catch (error: any) {
      this.logger.error(`Failed to initialize output structure: ${error.message}`, error);
      throw error;
    }
  }

  /**
   * Create README.md with project overview
   */
  private async createReadme(epicKey: string): Promise<void> {
    const readmePath = path.join(this.baseOutputDir, epicKey, 'README.md');
    const content = this.generateReadmeTemplate(epicKey);
    await this.writeFile(readmePath, content);
  }

  /**
   * Create PROMPTS.md for storing generated prompts
   */
  private async createPromptsDocument(epicKey: string): Promise<void> {
    const promptsPath = path.join(this.baseOutputDir, epicKey, 'PROMPTS.md');
    const content = this.generatePromptsTemplate(epicKey);
    await this.writeFile(promptsPath, content);
  }

  /**
   * Create ANALYSIS.md for AI responses
   */
  private async createAnalysisDocument(epicKey: string): Promise<void> {
    const analysisPath = path.join(this.baseOutputDir, epicKey, 'ANALYSIS.md');
    const content = this.generateAnalysisTemplate(epicKey);
    await this.writeFile(analysisPath, content);
  }

  /**
   * Create CONTEXT.md for storing structured grounding context
   */
  private async createContextDocument(epicKey: string, content: string): Promise<void> {
    const contextPath = path.join(this.baseOutputDir, epicKey, 'CONTEXT.md');
    const header = `# Context Engineering Frame\n\n`;
    await this.writeFile(
      contextPath,
      header + (content || '*Context will be generated during analysis.*\n')
    );
  }

  /**
   * Update CONTEXT.md after Jira and codebase context are available
   */
  async updateContextDocument(
    epicKey: string,
    jira: JiraPortfolio,
    codebase: CodebaseAnalysis
  ): Promise<void> {
    const contextPath = path.join(this.baseOutputDir, epicKey, 'CONTEXT.md');
    const enhancedContent = this.generateEnhancedContextTemplate(epicKey, jira, codebase);
    await this.writeFile(contextPath, enhancedContent);
    this.logger.info('✅ Updated CONTEXT.md with enhanced context and guidelines');
  }

  /**
   * Create JIRA.md with comprehensive Jira data
   */
  async createJiraDocument(epicKey: string, jiraData: JiraPortfolio): Promise<void> {
    const jiraPath = path.join(this.baseOutputDir, epicKey, 'JIRA.md');
    const content = this.generateJiraTemplate(epicKey, jiraData);
    await this.writeFile(jiraPath, content);
    this.logger.info('✅ Created JIRA.md with comprehensive Jira data');
  }

  /**
   * Create CODEBASE.md with comprehensive codebase analysis
   */
  async createCodebaseDocument(epicKey: string, codebaseData: CodebaseAnalysis): Promise<void> {
    const codebasePath = path.join(this.baseOutputDir, epicKey, 'CODEBASE.md');
    const content = this.generateCodebaseTemplate(epicKey, codebaseData);
    await this.writeFile(codebasePath, content);
    this.logger.info('✅ Created CODEBASE.md with comprehensive codebase analysis');
  }

  /**
   * Generate enhanced CONTEXT.md template with comprehensive guidelines and MCP server instructions
   */
  private generateEnhancedContextTemplate(
    epicKey: string,
    jira: JiraPortfolio,
    codebase: CodebaseAnalysis
  ): string {
    const timestamp = new Date().toISOString();
    const frame = buildContextFrame(jira, codebase);

    return `---
title: Context Engineering Frame for ${epicKey}
epic: ${epicKey}
created: ${timestamp}
type: context-frame
---

# Context Engineering Frame: ${epicKey}

## Core Project Context

### Project Identity
- **Epic Key:** ${epicKey}
- **Project Path:** ${codebase.projectPath}
- **Technology Stack:** ${codebase.techStack.map(tech => tech.name).join(', ') || 'Not identified'}
- **Total Story Points:** ${jira.totalStoryPoints}
- **Analysis Timestamp:** ${timestamp}

### Architectural Constraints
- **Existing Patterns:** ${
      codebase.patterns.length > 0
        ? codebase.patterns.map(p => p.name).join(', ')
        : 'None identified'
    }
- **Technical Debt Score:** ${codebase.metrics.technicalDebt}/10
- **Complexity Score:** ${codebase.metrics.complexity}/10
- **Maintainability Score:** ${codebase.metrics.maintainability}/10

### Non-Negotiable Boundaries
- **Security Requirements:** Maintain existing security practices and compliance standards
- **Performance Constraints:** Consider impact on current system performance characteristics
- **Backward Compatibility:** Ensure changes don't break existing functionality
- **Resource Limitations:** Work within current team capacity and skill constraints

---

## Anti-Hallucination Protocol

### Evidence-Based Analysis Requirements
1. **File Citations Required:** All technical recommendations must cite specific file paths and line numbers
2. **Confidence Scoring:** Rate confidence (1-10) for all major technical claims
3. **Assumption Tracking:** Explicitly state "I assume..." for any assumptions made
4. **Boundary Enforcement:** Cannot suggest patterns or technologies not present in the codebase
5. **Self-Verification:** Include verification steps for all recommendations

### Grounding Mechanisms
- **Existing Code Patterns:** Acknowledge and respect current architectural decisions
- **Technical Debt Preservation:** Maintain known workarounds with clear context
- **Risk Assessment:** Evaluate impact of changes on existing system stability
- **Incremental Improvements:** Suggest only small, low-risk enhancements

---

## MCP Server Integration Guidelines

### Available MCP Servers and Tools
1. **File System Server (mcp4_)**
   - Use for reading codebase files and analyzing directory structures
   - Tools: \`read_text_file\`, \`list_directory\`, \`search_files\`, \`get_file_info\`
   - **Critical:** Always use absolute paths when referencing files

2. **Git Server (mcp5_)**
   - Use for understanding code history and recent changes
   - Tools: \`git_log\`, \`git_diff\`, \`git_status\`, \`git_show\`
   - **Best Practice:** Check recent commits to understand development context

3. **Memory Server (mcp6_)**
   - Use for storing and retrieving analysis insights across stages
   - Tools: \`create_entities\`, \`search_nodes\`, \`create_relations\`
   - **Usage:** Store architectural decisions and patterns for cross-stage reference

4. **Sequential Thinking Server (mcp8_)**
   - Use for complex problem-solving and multi-step analysis
   - **When to Use:** For architectural decisions requiring deep reasoning
   - **Best Practice:** Break down complex problems into sequential thoughts

### MCP Tool Usage Protocol
1. **Always Use MCP Tools for File Analysis**
   - Never assume file contents - always read them using \`mcp4_read_text_file\`
   - Use \`mcp4_search_files\` to find relevant code patterns
   - Verify directory structures with \`mcp4_list_directory\`

2. **Cross-Reference with Git History**
   - Use \`mcp5_git_log\` to understand recent changes
   - Check \`mcp5_git_diff\` for understanding current development direction
   - Analyze commit messages for business context

3. **Store Insights for Future Stages**
   - Use \`mcp6_create_entities\` to store architectural findings
   - Create relationships between code patterns and business requirements
   - Search previous insights with \`mcp6_search_nodes\`

---

## Analysis Framework by Stage

### Stage 1: Senior Product Manager
**Focus:** Business requirements and user value
**MCP Tools to Use:**
- \`mcp4_read_text_file\` for README and documentation files
- \`mcp6_search_nodes\` for previous business insights
- \`mcp5_git_log\` for understanding feature development history

**Key Questions:**
- What business value does each story provide?
- How do technical constraints impact user experience?
- What are the risks to delivery timelines?

### Stage 2: Principal Engineer (Architecture)
**Focus:** System design and architectural patterns
**MCP Tools to Use:**
- \`mcp4_search_files\` for architectural patterns
- \`mcp4_list_directory\` for understanding code organization
- \`mcp8_sequentialthinking\` for complex architectural decisions

**Key Questions:**
- How do proposed changes fit existing architecture?
- What are the technical debt implications?
- How can we maintain system scalability?

### Stage 3: Principal Engineer (Technical Design)
**Focus:** Detailed implementation planning
**MCP Tools to Use:**
- \`mcp4_read_text_file\` for specific implementation files
- \`mcp5_git_diff\` for understanding current changes
- \`mcp6_create_entities\` for storing technical decisions

**Key Questions:**
- What specific code changes are required?
- How do we minimize risk during implementation?
- What testing strategies are needed?

### Stage 4: Principal Engineer (Implementation)
**Focus:** Deployment and operational considerations
**MCP Tools to Use:**
- \`mcp4_search_files\` for deployment configurations
- \`mcp5_git_status\` for current repository state
- \`mcp6_create_relations\` for linking implementation to requirements

**Key Questions:**
- What are the deployment dependencies?
- How do we ensure zero-downtime deployment?
- What monitoring and observability is needed?

### Stage 5: Product Owner
**Focus:** Sprint planning and delivery coordination
**MCP Tools to Use:**
- \`mcp6_search_nodes\` for all previous stage insights
- \`mcp6_create_entities\` for sprint planning decisions
- \`mcp8_sequentialthinking\` for complex prioritization decisions

**Key Questions:**
- How should stories be prioritized and sequenced?
- What are the cross-team dependencies?
- How do we mitigate delivery risks?

---

## Visualization Guidelines

### Mermaid Diagram Requirements
Include appropriate Mermaid diagrams in your analysis:

1. **Architecture Diagrams**
   \`\`\`mermaid
   graph TD
       A[Component A] --> B[Component B]
       B --> C[Component C]
   \`\`\`

2. **Sequence Diagrams** for user flows
3. **Gantt Charts** for implementation timelines
4. **Flowcharts** for decision processes

### Diagram Best Practices
- Always include diagrams for complex architectural changes
- Use consistent naming conventions
- Include error handling paths in sequence diagrams
- Show dependencies clearly in Gantt charts

---

## Quality Assurance Checklist

### Before Completing Each Stage
- [ ] All file references include absolute paths
- [ ] Confidence scores provided for major recommendations
- [ ] MCP tools used for all file and code analysis
- [ ] Assumptions explicitly stated and justified
- [ ] Risk assessment included for all changes
- [ ] Backward compatibility verified
- [ ] Performance impact considered
- [ ] Security implications evaluated

### Cross-Stage Consistency
- [ ] Recommendations align with previous stages
- [ ] Technical constraints acknowledged throughout
- [ ] Business value maintained in technical decisions
- [ ] Implementation feasibility verified

---

## Context Frame (Structured Data)

\`\`\`
${frame}
\`\`\`

---

## Instructions for AI Assistants

**CRITICAL REQUIREMENTS:**
1. **Always reference context files:** [JIRA.md](./JIRA.md), [CODEBASE.md](./CODEBASE.md)
2. **Use MCP tools extensively:** Never assume file contents or directory structures
3. **Provide evidence-based analysis:** Cite specific files, lines, and code patterns
4. **Follow anti-hallucination protocol:** Include confidence scores and assumptions
5. **Maintain architectural consistency:** Respect existing patterns and constraints
6. **Include visualizations:** Use Mermaid diagrams for complex concepts
7. **Store insights:** Use memory server to share findings across stages

**WORKFLOW:**
1. Read relevant context files using MCP tools
2. Analyze codebase using file system and git tools
3. Apply stage-specific analysis framework
4. Store insights using memory server
5. Generate evidence-based recommendations
6. Include appropriate visualizations
7. Complete quality assurance checklist

---

*This context frame provides comprehensive grounding for all analysis stages. Always reference this document and use MCP tools for accurate, evidence-based analysis.*
`;
  }

  /**
   * Add prompt to PROMPTS.md file
   */
  async addPromptToDocument(
    epicKey: string,
    stageId: string,
    stageName: string,
    prompt: string
  ): Promise<void> {
    const promptsPath = path.join(this.baseOutputDir, epicKey, 'PROMPTS.md');

    try {
      let content = await fs.readFile(promptsPath, 'utf-8');

      // Simply append the prompt in a clean format
      const promptSection = this.generateSimplePromptSection(stageName, prompt);
      content += '\n' + promptSection;

      await this.writeFile(promptsPath, content);
      this.logger.info(`✅ Added ${stageName} prompt to PROMPTS.md`);
    } catch (error: any) {
      this.logger.error(`Failed to add prompt to document: ${error.message}`, error);
      throw error;
    }
  }

  /**
   * Generate simple prompt section for PROMPTS.md
   */
  private generateSimplePromptSection(stageName: string, prompt: string): string {
    const timestamp = new Date().toLocaleString();

    return `
## ${stageName}

**Generated:** ${timestamp}

\`\`\`
${prompt}
\`\`\`

---
`;
  }

  /**
   * Generate README.md template
   */
  private generateReadmeTemplate(epicKey: string): string {
    const timestamp = new Date().toISOString();

    return `---
title: AI Analysis for ${epicKey}
epic: ${epicKey}
created: ${timestamp}
status: in-progress
---

# AI Product Owner Analysis: ${epicKey}

## Overview

This directory contains the AI-assisted analysis for epic **${epicKey}**.

## Files Structure

- **[README.md](./README.md)** - This overview document
- **[PROMPTS.md](./PROMPTS.md)** - All generated prompts for each analysis stage
- **[ANALYSIS.md](./ANALYSIS.md)** - Your AI responses and analysis results
- **[CONTEXT.md](./CONTEXT.md)** - Structured context frame grounding all prompts

## Workflow

1. **Review Prompts** - Check [PROMPTS.md](./PROMPTS.md) for stage-specific prompts
2. **Use with AI** - Prompts contain instructions for AI to directly edit ANALYSIS.md
3. **Automated Integration** - AI will automatically update ANALYSIS.md with responses and progress indicators
4. **Iterate** - Refine and improve analysis as needed

## Getting Started

1. Open [PROMPTS.md](./PROMPTS.md) to see the first prompt
2. Copy the prompt and paste into your AI assistant (ChatGPT, Claude, Copilot, etc.)
3. The AI will automatically edit ANALYSIS.md with its response and update progress indicators
4. Proceed to the next prompt

## Commands Available

- **Epic Bridge: Complete Current Stage & Continue** - Mark current stage complete and continue
- **Epic Bridge: Open Output Folder** - Open the analysis output folder

---

*Generated by Epic Bridge v1.0*
`;
  }

  /**
   * Generate PROMPTS.md template
   */
  private generatePromptsTemplate(epicKey: string): string {
    const timestamp = new Date().toISOString();

    return `---
title: Analysis Prompts for ${epicKey}
epic: ${epicKey}
created: ${timestamp}
type: prompts
---

# Analysis Prompts: ${epicKey}

This document contains all generated prompts for the AI analysis workflow.

## How to Use

1. **Copy** the prompt text below
2. **Paste** into your AI assistant (ChatGPT, Claude, Copilot, etc.)
3. **AI will automatically** edit [ANALYSIS.md](./ANALYSIS.md) with its response and update progress indicators

---

`;
  }

  /**
   * Generate ANALYSIS.md template dynamically from stage registry
   */
  private generateAnalysisTemplate(epicKey: string): string {
    const timestamp = new Date().toISOString();
    const stages = getStagesInOrder();

    // Generate progress table dynamically
    const progressTableRows = stages.map(stage => `| ${stage.name} | ⏳ Pending | ❌ |`).join('\n');

    // Generate analysis sections dynamically
    const analysisSections = stages
      .map(
        (stage, index) =>
          `## Stage ${index + 1}: ${
            stage.name
          }\n\n*AI will automatically update this section when processing the corresponding prompt*\n\n---`
      )
      .join('\n\n');

    return `---
title: AI Analysis Results for ${epicKey}
epic: ${epicKey}
created: ${timestamp}
type: analysis
---

# AI Analysis Results: ${epicKey}

## Overview

This document contains AI-generated analysis results for each stage of the workflow.

## Instructions

- Copy prompts from [PROMPTS.md](./PROMPTS.md)
- Use with your preferred AI assistant
- AI will automatically update sections below with responses and progress indicators
- Each prompt contains instructions for the AI to edit this file directly

---

## Analysis Progress

| Stage | Status | Completed |
|-------|--------|-----------|
${progressTableRows}

---

${analysisSections}

## Summary & Next Steps

*Add your summary and next steps after completing all stages*

---

*AI responses will be added here as you complete each analysis stage.*
`;
  }

  /**
   * Get output directory for an epic
   */
  getOutputDirectory(epicKey: string): string {
    return path.join(this.baseOutputDir, epicKey);
  }

  /**
   * Ensure directory exists
   */
  private async ensureDirectory(dirPath: string): Promise<void> {
    try {
      await fs.mkdir(dirPath, { recursive: true });
      this.logger.debug(`📁 Created directory: ${path.basename(dirPath)}`);
    } catch (error: any) {
      this.logger.error(`Failed to create directory ${dirPath}`, error);
      throw new Error(`Directory creation failed: ${error.message}`);
    }
  }

  /**
   * Write file with error handling
   */
  private async writeFile(filePath: string, content: string): Promise<void> {
    try {
      await fs.writeFile(filePath, content, 'utf-8');
      this.logger.debug(`📝 Created file: ${path.basename(filePath)}`);
    } catch (error: any) {
      this.logger.error(`Failed to write file ${filePath}`, error);
      throw new Error(`File write failed: ${error.message}`);
    }
  }

  /**
   * Generate comprehensive CODEBASE.md template with detailed codebase analysis
   */
  private generateCodebaseTemplate(epicKey: string, codebase: CodebaseAnalysis): string {
    const timestamp = new Date().toISOString();

    // Generate technology stack details
    const techStackDetails = codebase.techStack
      .map(
        tech => `
### ${tech.name} ${tech.version ? `(${tech.version})` : ''}

**Type:** ${tech.type}
**Confidence:** ${(tech as any).confidence || 'Unknown'}/10
**Usage Context:** ${(tech as any).usage || 'Not specified'}

${(tech as any).description ? `**Description:** ${(tech as any).description}` : ''}
${
  (tech as any).configFiles && (tech as any).configFiles.length > 0
    ? `**Config Files:** ${(tech as any).configFiles.join(', ')}`
    : ''
}
${
  (tech as any).dependencies && (tech as any).dependencies.length > 0
    ? `**Dependencies:** ${(tech as any).dependencies.join(', ')}`
    : ''
}

---`
      )
      .join('\n');

    // Generate architectural patterns
    const patternsDetails = codebase.patterns
      .map(
        pattern => `
### ${pattern.name}

**Type:** ${(pattern as any).type || 'Unknown'}
**Confidence:** ${pattern.confidence}/10
**Files:** ${pattern.files.length} files implementing this pattern

**Key Files:**
${pattern.files
  .slice(0, 5)
  .map(file => `- \`${file}\``)
  .join('\n')}
${pattern.files.length > 5 ? `- ... and ${pattern.files.length - 5} more files` : ''}

**Description:** ${pattern.description || 'Pattern description not available'}

---`
      )
      .join('\n');

    // Generate entry points analysis
    const entryPointsDetails =
      (codebase as any).entryPoints
        ?.map(
          (entry: any) => `
### ${entry.file}

**Type:** ${entry.type}
**Purpose:** ${entry.purpose || 'Entry point purpose not specified'}
**Dependencies:** ${entry.dependencies?.length || 0} direct dependencies

${
  entry.dependencies && entry.dependencies.length > 0
    ? `
**Key Dependencies:**
${entry.dependencies
  .slice(0, 10)
  .map((dep: any) => `- ${dep}`)
  .join('\n')}
${
  entry.dependencies.length > 10
    ? `- ... and ${entry.dependencies.length - 10} more dependencies`
    : ''
}
`
    : ''
}

---`
        )
        .join('\n') || 'No entry points identified';

    // Generate file structure analysis
    const generateFileStructure = (structure: any, depth = 0): string => {
      const indent = '  '.repeat(depth);
      let result = '';

      if (structure.files) {
        structure.files.forEach((file: string) => {
          result += `${indent}- 📄 ${file}\n`;
        });
      }

      if (structure.directories) {
        Object.entries(structure.directories).forEach(([dirName, dirContent]) => {
          result += `${indent}- 📁 ${dirName}/\n`;
          result += generateFileStructure(dirContent, depth + 1);
        });
      }

      return result;
    };

    return `---
title: Codebase Analysis for ${epicKey}
epic: ${epicKey}
created: ${timestamp}
type: codebase-analysis
---

# Codebase Analysis: ${epicKey}

## Project Overview

**Project Path:** \`${codebase.projectPath}\`
**Analysis Timestamp:** ${timestamp}
**Total Files Analyzed:** ${(codebase as any).fileCount || 'Not specified'}
**Primary Language:** ${(codebase as any).primaryLanguage || 'Not detected'}

## Technology Stack Analysis

${techStackDetails || 'No technology stack information available'}

## Architectural Patterns

${patternsDetails || 'No architectural patterns identified'}

## Entry Points Analysis

${entryPointsDetails || 'No entry points identified'}

## Code Quality Metrics

### Technical Debt Assessment
- **Technical Debt Score:** ${codebase.metrics.technicalDebt}/10
- **Complexity Score:** ${codebase.metrics.complexity}/10
- **Maintainability Score:** ${codebase.metrics.maintainability}/10
- **Test Coverage:** ${
      codebase.metrics.testCoverage ? `${codebase.metrics.testCoverage}%` : 'Not available'
    }

### Code Organization
- **Cyclomatic Complexity:** ${(codebase.metrics as any).cyclomaticComplexity || 'Not calculated'}
- **Lines of Code:** ${(codebase.metrics as any).linesOfCode || 'Not counted'}
- **Code Duplication:** ${
      (codebase.metrics as any).duplication
        ? `${(codebase.metrics as any).duplication}%`
        : 'Not analyzed'
    }

## File Structure Overview

\`\`\`
${codebase.projectPath}/
${generateFileStructure((codebase as any).structure || {})}
\`\`\`

## Dependencies Analysis

### Production Dependencies
${
  (codebase as any).dependencies?.production?.length > 0
    ? (codebase as any).dependencies.production
        .map(
          (dep: any) =>
            `- **${dep.name}** (${dep.version}) - ${dep.description || 'No description'}`
        )
        .join('\n')
    : 'No production dependencies identified'
}

### Development Dependencies
${
  (codebase as any).dependencies?.development?.length > 0
    ? (codebase as any).dependencies.development
        .map(
          (dep: any) =>
            `- **${dep.name}** (${dep.version}) - ${dep.description || 'No description'}`
        )
        .join('\n')
    : 'No development dependencies identified'
}

### Security Vulnerabilities
${
  (codebase as any).dependencies?.vulnerabilities?.length > 0
    ? (codebase as any).dependencies.vulnerabilities
        .map(
          (vuln: any) =>
            `- **${vuln.severity}**: ${vuln.title} in ${vuln.package} (${vuln.version})`
        )
        .join('\n')
    : 'No known security vulnerabilities detected'
}

## Testing Infrastructure

### Test Framework
${(codebase as any).testing?.framework || 'Test framework not identified'}

### Test Coverage Analysis
- **Unit Tests:** ${(codebase as any).testing?.unitTests || 'Not analyzed'}
- **Integration Tests:** ${(codebase as any).testing?.integrationTests || 'Not analyzed'}
- **E2E Tests:** ${(codebase as any).testing?.e2eTests || 'Not analyzed'}

### Test Files Location
${
  (codebase as any).testing?.testFiles?.length > 0
    ? (codebase as any).testing.testFiles.map((file: any) => `- \`${file}\``).join('\n')
    : 'No test files identified'
}

## Build and Deployment

### Build Configuration
${
  (codebase as any).build?.configFiles?.length > 0
    ? (codebase as any).build.configFiles.map((file: any) => `- \`${file}\``).join('\n')
    : 'No build configuration files identified'
}

### Deployment Scripts
${
  (codebase as any).deployment?.scripts?.length > 0
    ? (codebase as any).deployment.scripts.map((script: any) => `- \`${script}\``).join('\n')
    : 'No deployment scripts identified'
}

### Environment Configuration
${
  (codebase as any).deployment?.environments?.length > 0
    ? (codebase as any).deployment.environments
        .map((env: any) => `- **${env.name}**: ${env.description || 'No description'}`)
        .join('\n')
    : 'No environment configurations identified'
}

## Security Analysis

### Security Practices
- **Authentication:** ${(codebase as any).security?.authentication || 'Not analyzed'}
- **Authorization:** ${(codebase as any).security?.authorization || 'Not analyzed'}
- **Data Encryption:** ${(codebase as any).security?.encryption || 'Not analyzed'}
- **Input Validation:** ${(codebase as any).security?.inputValidation || 'Not analyzed'}

### Security Configuration Files
${
  (codebase as any).security?.configFiles?.length > 0
    ? (codebase as any).security.configFiles.map((file: any) => `- \`${file}\``).join('\n')
    : 'No security configuration files identified'
}

## Performance Considerations

### Performance Metrics
- **Bundle Size:** ${(codebase as any).performance?.bundleSize || 'Not analyzed'}
- **Load Time:** ${(codebase as any).performance?.loadTime || 'Not measured'}
- **Memory Usage:** ${(codebase as any).performance?.memoryUsage || 'Not profiled'}

### Performance Optimization
${
  (codebase as any).performance?.optimizations?.length > 0
    ? (codebase as any).performance.optimizations.map((opt: any) => `- ${opt}`).join('\n')
    : 'No performance optimizations identified'
}

## Documentation Analysis

### Available Documentation
${
  (codebase as any).documentation?.files?.length > 0
    ? (codebase as any).documentation.files
        .map(
          (file: any) =>
            `- [\`${file.name}\`](${file.path}) - ${file.description || 'No description'}`
        )
        .join('\n')
    : 'No documentation files found'
}

### API Documentation
${
  (codebase as any).documentation?.apiDocs
    ? `Available at: ${(codebase as any).documentation.apiDocs}`
    : 'No API documentation identified'
}

## MCP Tool Integration Guidelines

### Recommended MCP Tools for This Codebase

1. **File System Analysis**
   - Use \`mcp4_read_text_file\` to examine key configuration files
   - Use \`mcp4_search_files\` to find specific patterns or implementations
   - Use \`mcp4_list_directory\` to understand project structure

2. **Git History Analysis**
   - Use \`mcp5_git_log\` to understand recent development patterns
   - Use \`mcp5_git_diff\` to see current changes in progress
   - Use \`mcp5_git_status\` to understand current repository state

3. **Code Pattern Analysis**
   - Search for architectural patterns using \`mcp4_search_files\`
   - Analyze entry points with \`mcp4_read_text_file\`
   - Map dependencies using directory structure analysis

### Key Files to Examine

#### Configuration Files
${
  codebase.techStack
    .flatMap(tech => (tech as any).configFiles || [])
    .map(file => `- \`${file}\``)
    .join('\n') || 'No configuration files identified'
}

#### Entry Points
${
  (codebase as any).entryPoints
    ?.map((entry: any) => `- \`${entry.file}\` (${entry.type})`)
    .join('\n') || 'No entry points identified'
}

#### Critical Implementation Files
${
  codebase.patterns
    .flatMap(pattern => pattern.files.slice(0, 3))
    .map(file => `- \`${file}\``)
    .join('\n') || 'No critical files identified'
}

## Analysis Guidelines for AI

### Technical Feasibility Assessment
1. **Compatibility Check:** Verify new requirements align with existing technology stack
2. **Performance Impact:** Assess how changes affect current performance metrics
3. **Security Implications:** Evaluate security impact of proposed changes
4. **Testing Strategy:** Plan testing approach based on existing test infrastructure

### Implementation Planning
1. **Code Organization:** Follow existing architectural patterns
2. **Dependency Management:** Consider impact on current dependency tree
3. **Build Process:** Ensure changes integrate with existing build configuration
4. **Deployment Strategy:** Plan deployment considering current deployment setup

### Risk Assessment
1. **Technical Debt:** Evaluate if changes increase or decrease technical debt
2. **Breaking Changes:** Identify potential breaking changes to existing functionality
3. **Rollback Strategy:** Plan rollback approach for risky changes
4. **Monitoring:** Define monitoring strategy for new implementations

## Constraints and Limitations

### Technical Constraints
- **Legacy Code:** ${(codebase as any).constraints?.legacy || 'No legacy constraints identified'}
- **Performance Requirements:** ${
      (codebase as any).constraints?.performance || 'No performance constraints identified'
    }
- **Security Requirements:** ${
      (codebase as any).constraints?.security || 'No security constraints identified'
    }

### Resource Constraints
- **Team Skills:** ${
      (codebase as any).constraints?.teamSkills || 'Team skill constraints not identified'
    }
- **Timeline:** ${(codebase as any).constraints?.timeline || 'Timeline constraints not identified'}
- **Budget:** ${(codebase as any).constraints?.budget || 'Budget constraints not identified'}

---

## Instructions for AI Analysis

**CRITICAL REQUIREMENTS:**
1. **Always use MCP tools** to verify file contents and directory structures
2. **Reference specific files** when making technical recommendations
3. **Consider existing patterns** and maintain architectural consistency
4. **Assess technical debt impact** for all proposed changes
5. **Validate against current tech stack** before suggesting new technologies
6. **Include performance considerations** for all implementation recommendations
7. **Plan testing strategy** based on existing test infrastructure

**WORKFLOW FOR CODEBASE ANALYSIS:**
1. Use \`mcp4_list_directory\` to understand project structure
2. Use \`mcp4_read_text_file\` to examine key configuration and entry point files
3. Use \`mcp4_search_files\` to find relevant implementation patterns
4. Use \`mcp5_git_log\` to understand recent development history
5. Cross-reference findings with Jira requirements
6. Store architectural insights using \`mcp6_create_entities\`
7. Generate evidence-based recommendations with file citations

---

*This codebase analysis provides comprehensive technical context for informed decision-making. Always verify information using MCP tools and reference specific files in recommendations.*
`;
  }

  /**
   * Generate comprehensive JIRA.md template with all Jira data
   */
  private generateJiraTemplate(epicKey: string, jiraData: JiraPortfolio): string {
    const timestamp = new Date().toISOString();

    // Generate detailed epic sections
    const epicSections = jiraData.epics
      .map(epic => {
        const storySections = epic.stories
          .map(
            story => `
### Story: ${story.key} - ${story.summary}

**Status:** ${story.status}
**Priority:** ${story.priority}
**Issue Type:** ${story.issueType}
**Story Points:** ${story.storyPoints || 'Not estimated'}
**Assignee:** ${story.assignee?.displayName || 'Unassigned'}

**Description:**
${story.description || 'No description provided'}

**Acceptance Criteria:**
${(story as any).acceptanceCriteria || 'No acceptance criteria provided'}

**Business Value:**
${(story as any).businessValue || 'Business value not specified'}

**Technical Notes:**
${(story as any).technicalNotes || 'No technical notes provided'}

**Dependencies:**
${
  (story as any).dependencies && (story as any).dependencies.length > 0
    ? (story as any).dependencies.map((dep: any) => `- ${dep.key}: ${dep.summary}`).join('\n')
    : 'No dependencies identified'
}

**Labels:** ${story.labels.length > 0 ? story.labels.join(', ') : 'None'}
**Components:** ${story.components.length > 0 ? story.components.join(', ') : 'None'}

**Definition of Done:**
${(story as any).definitionOfDone || 'Standard definition of done applies'}

---`
          )
          .join('\n');

        return `
## Epic: ${epic.key} - ${epic.summary}

**Status:** ${epic.status}
**Total Story Points:** ${epic.totalPoints}
**Assignee:** ${epic.assignee?.displayName || 'Unassigned'}
**Reporter:** ${epic.reporter?.displayName || 'Not specified'}
**Created:** ${epic.created}
**Last Updated:** ${epic.updated}

**Description:**
${epic.description}

**Epic Goal:**
${(epic as any).epicGoal || 'Epic goal not specified'}

**Business Objective:**
${(epic as any).businessObjective || 'Business objective not specified'}

**Success Criteria:**
${(epic as any).successCriteria || 'Success criteria not defined'}

**Stakeholders:**
${
  (epic as any).stakeholders && (epic as any).stakeholders.length > 0
    ? (epic as any).stakeholders
        .map(
          (stakeholder: any) =>
            `- ${stakeholder.displayName} (${stakeholder.role || 'Role not specified'})`
        )
        .join('\n')
    : 'No stakeholders identified'
}

**Risk Assessment:**
${
  (epic as any).risks && (epic as any).risks.length > 0
    ? (epic as any).risks
        .map(
          (risk: any) =>
            `- **${risk.level}**: ${risk.description} (Mitigation: ${
              risk.mitigation || 'Not specified'
            })`
        )
        .join('\n')
    : 'No risks identified'
}

### Stories in this Epic (${epic.stories.length} stories)

${storySections}

---`;
      })
      .join('\n');

    // Calculate additional metrics
    const totalStories = jiraData.epics.reduce((sum, epic) => sum + epic.stories.length, 0);
    const completedStories = jiraData.epics.reduce(
      (sum, epic) =>
        sum +
        epic.stories.filter(story => story.status === 'Done' || story.status === 'Closed').length,
      0
    );
    const inProgressStories = jiraData.epics.reduce(
      (sum, epic) =>
        sum +
        epic.stories.filter(
          story => story.status === 'In Progress' || story.status === 'In Development'
        ).length,
      0
    );
    const blockedStories = jiraData.epics.reduce(
      (sum, epic) =>
        sum +
        epic.stories.filter(story => story.status === 'Blocked' || story.status === 'Impediment')
          .length,
      0
    );

    const storiesByPriority = {
      highest: jiraData.epics.reduce(
        (sum, epic) => sum + epic.stories.filter(story => story.priority === 'Highest').length,
        0
      ),
      high: jiraData.epics.reduce(
        (sum, epic) => sum + epic.stories.filter(story => story.priority === 'High').length,
        0
      ),
      medium: jiraData.epics.reduce(
        (sum, epic) => sum + epic.stories.filter(story => story.priority === 'Medium').length,
        0
      ),
      low: jiraData.epics.reduce(
        (sum, epic) => sum + epic.stories.filter(story => story.priority === 'Low').length,
        0
      ),
      lowest: jiraData.epics.reduce(
        (sum, epic) => sum + epic.stories.filter(story => story.priority === 'Lowest').length,
        0
      ),
    };

    return `---
title: Jira Context for ${epicKey}
epic: ${epicKey}
created: ${timestamp}
type: jira-context
---

# Jira Context: ${epicKey}

## Portfolio/Epic Overview

**Key:** ${jiraData.key}
**Name:** ${jiraData.name}
**Type:** ${jiraData.type}
**Total Story Points:** ${jiraData.totalStoryPoints}

**Description:**
${jiraData.description || 'No description provided'}

**Business Context:**
- **Strategic Alignment:** Review how this epic aligns with business objectives
- **User Impact:** Consider the end-user value and experience improvements
- **Market Opportunity:** Evaluate competitive advantages and market positioning
- **Risk Assessment:** Identify potential risks and mitigation strategies
- **Success Metrics:** Define measurable outcomes and KPIs
- **Timeline Constraints:** Consider delivery deadlines and dependencies

---

${epicSections}

## Comprehensive Analysis Guidelines for AI

When analyzing this Jira data, follow these detailed guidelines:

### 1. Business Value Assessment
- **Priority Analysis:** Evaluate story priorities and their business justification
- **ROI Estimation:** Consider development effort vs. business impact
- **User Journey Mapping:** Understand how stories contribute to user experience
- **Competitive Analysis:** Assess features against market standards

### 2. Technical Requirements Analysis
- **Acceptance Criteria Review:** Ensure all criteria are testable and complete
- **Technical Feasibility:** Evaluate implementation complexity and risks
- **Architecture Impact:** Consider how stories affect system architecture
- **Performance Requirements:** Identify non-functional requirements

### 3. Scope and Risk Management
- **Scope Creep Detection:** Identify stories that may expand beyond original intent
- **Dependency Analysis:** Map critical path and blocking dependencies
- **Risk Mitigation:** Assess technical and business risks with mitigation strategies
- **MVP Definition:** Identify minimum viable features for early delivery

### 4. Estimation and Planning
- **Story Point Validation:** Review estimates for consistency and accuracy
- **Velocity Planning:** Consider team capacity and historical velocity
- **Sprint Planning:** Suggest optimal story groupings for sprints
- **Resource Allocation:** Identify skill requirements and team assignments

### 5. Quality Assurance
- **Definition of Done:** Ensure all stories have clear completion criteria
- **Testing Strategy:** Identify test scenarios and automation opportunities
- **Documentation Requirements:** Specify necessary documentation deliverables
- **Compliance Considerations:** Address security, accessibility, and regulatory requirements

## Detailed Metrics and Insights

### Story Distribution
- **Total Epics:** ${jiraData.epics.length}
- **Total Stories:** ${totalStories}
- **Completed Stories:** ${completedStories} (${
      totalStories > 0 ? Math.round((completedStories / totalStories) * 100) : 0
    }%)
- **In Progress Stories:** ${inProgressStories} (${
      totalStories > 0 ? Math.round((inProgressStories / totalStories) * 100) : 0
    }%)
- **Blocked Stories:** ${blockedStories} (${
      totalStories > 0 ? Math.round((blockedStories / totalStories) * 100) : 0
    }%)

### Priority Breakdown
- **Highest Priority:** ${storiesByPriority.highest} stories
- **High Priority:** ${storiesByPriority.high} stories
- **Medium Priority:** ${storiesByPriority.medium} stories
- **Low Priority:** ${storiesByPriority.low} stories
- **Lowest Priority:** ${storiesByPriority.lowest} stories

### Velocity Metrics
- **Average Points per Epic:** ${
      jiraData.epics.length > 0 ? Math.round(jiraData.totalStoryPoints / jiraData.epics.length) : 0
    }
- **Average Points per Story:** ${
      totalStories > 0 ? Math.round(jiraData.totalStoryPoints / totalStories) : 0
    }
- **Completion Rate:** ${
      jiraData.epics.length > 0
        ? Math.round(
            (jiraData.epics.filter(epic => epic.status === 'Done').length / jiraData.epics.length) *
              100
          )
        : 0
    }%

### Key Stakeholders
${jiraData.epics
  .map(
    epic =>
      `**${epic.key}:** ${epic.assignee?.displayName || 'Unassigned'} (Assignee), ${
        epic.reporter?.displayName || 'Unknown'
      } (Reporter)`
  )
  .join('\n')}

## Analysis Instructions for AI

**CRITICAL: Always reference specific Jira keys (e.g., ${epicKey}-123) when making recommendations.**

1. **Ground all analysis in actual Jira data** - cite specific stories and epics
2. **Use MCP tools** to cross-reference with codebase for technical feasibility
3. **Provide confidence scores** (1-10) for all major recommendations
4. **Identify gaps** in requirements, acceptance criteria, or business value statements
5. **Suggest improvements** for unclear or incomplete story definitions
6. **Flag dependencies** that may impact delivery timelines
7. **Recommend story splitting** for large or complex stories (>8 story points)
8. **Validate estimates** against similar completed stories

---

*This document contains comprehensive Jira context with detailed business and technical information. Always reference specific story keys and provide evidence-based analysis.*
`;
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    this.logger.info('DocumentGenerator disposed');
  }
}
