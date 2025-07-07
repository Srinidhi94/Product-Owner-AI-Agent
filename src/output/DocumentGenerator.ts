/**
 * Document Generator - Output Management for Multi-Stage Analysis
 * Creates organized file structure and templates for analysis workflow
 */

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { JiraPortfolio, CodebaseAnalysis } from '../types';

// Local interface definitions to avoid circular dependency
interface AnalysisStage {
  id: string;
  name: string;
  duration: string;
  icon: string;
  description: string;
  requiredDiagrams: string[];
}

interface StageProgress {
  currentStage: number;
  totalStages: number;
  stageName: string;
  completed: boolean[];
  startTime: Date;
}

export class DocumentGenerator {
  private outputChannel: vscode.OutputChannel;
  private baseOutputDir: string;

  constructor() {
    this.outputChannel = vscode.window.createOutputChannel('AI Product Owner - Document Generator');
    
    // Get workspace folder for output
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    this.baseOutputDir = workspaceFolder 
      ? path.join(workspaceFolder.uri.fsPath, 'ai-analysis-output')
      : path.join(process.cwd(), 'ai-analysis-output');

    this.log(`📁 Output directory: ${this.baseOutputDir}`);
  }

  private log(message: string): void {
    if (this.outputChannel) {
      this.outputChannel.appendLine(message);
    }
    console.log(message);
  }

  /**
   * Initialize output folder structure for an epic
   */
  async initializeOutputStructure(epicKey: string): Promise<string> {
    const epicDir = this.getOutputDirectory(epicKey);
    
    // Create directory structure
    const directories = [
      epicDir,
      path.join(epicDir, 'stages'),
      path.join(epicDir, 'templates'),
      path.join(epicDir, 'assets')
    ];

    for (const dir of directories) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        this.log(`📁 Created directory: ${path.basename(dir)}`);
      }
    }

    // Create README for the epic
    await this.createEpicReadme(epicKey);

    this.log(`✅ Initialized output structure for ${epicKey}`);
    return epicDir;
  }

  /**
   * Initialize clean output folder structure for automated technical analysis
   */
  async initializeCleanOutputStructure(epicKey: string): Promise<string> {
    const epicDir = this.getOutputDirectory(epicKey);
    
    // Create simple directory structure (no templates/assets folders)
    if (!fs.existsSync(epicDir)) {
      fs.mkdirSync(epicDir, { recursive: true });
      this.log(`📁 Created analysis directory: ${epicKey}`);
    }

    this.log(`✅ Initialized clean output structure for ${epicKey}`);
    return epicDir;
  }

  /**
   * Create master analysis document for automated workflow
   */
  async createMasterAnalysisDocument(
    epicKey: string,
    jiraData: any,
    codebaseData: any
  ): Promise<string> {
    const analysisPath = path.join(this.getOutputDirectory(epicKey), 'TECHNICAL_ANALYSIS.md');
    const promptsPath = path.join(this.getOutputDirectory(epicKey), 'PROMPTS.md');
    
    const masterContent = `# Technical Analysis - ${epicKey}

**Generated**: ${new Date().toLocaleString()}
**Epic**: ${jiraData.key} - ${jiraData.name}
**Analysis Type**: Automated Technical Analysis
**Codebase**: ${codebaseData.totalFiles} Go files, ${codebaseData.packages.length} packages

---

## 🎯 Analysis Overview

This document contains the comprehensive technical analysis following the Principal Engineer workflow:

1. **📋 Requirements Analysis** - Understanding and dependencies
2. **🎯 Design Overview** - High-level architecture concept
3. **🔧 Detailed Technical Design** - Implementation specifications
4. **🏗️ Infrastructure & NFR** - Operations and performance
5. **📝 Task Breakdown** - Jira-ready implementation tasks

**Note**: All generated prompts are stored in [PROMPTS.md](./PROMPTS.md) for reference and reuse.

---

## 📋 1. Requirements Analysis

### Jira Requirements
- **Epic**: ${jiraData.key} - ${jiraData.name}
- **Type**: ${jiraData.type}
- **Story Points**: ${jiraData.totalStoryPoints}
- **Description**: ${jiraData.description || 'See Jira for details'}

### 🤖 Copilot Response

> **📋 Instructions**: 
> 1. Copy the Requirements Analysis prompt from [PROMPTS.md](./PROMPTS.md) (Stage 1)
> 2. Paste it in GitHub Copilot Chat
> 3. Wait ⏱️ Wait - Let Copilot analyze and generate response
> 4. Replace this entire section below with Copilot's response

### 🤖 Copilot Response Section:

---

## 🎯 2. Design Overview

### 🤖 Copilot Response

> **📋 Instructions**: 
> 1. Copy the Design Overview prompt from [PROMPTS.md](./PROMPTS.md) (Stage 2)
> 2. Paste it in GitHub Copilot Chat
> 3. Wait ⏱️ Wait - Let Copilot analyze and generate response
> 4. Replace this entire section below with Copilot's response

### 🤖 Copilot Response Section:

---

## 🔧 3. Detailed Technical Design

### 🤖 Copilot Response

> **📋 Instructions**: 
> 1. Copy the Technical Design prompt from [PROMPTS.md](./PROMPTS.md) (Stage 3)
> 2. Paste it in GitHub Copilot Chat
> 3. Wait ⏱️ Wait - Let Copilot analyze and generate response
> 4. Replace this entire section below with Copilot's response

### 🤖 Copilot Response Section:

---

## 🏗️4. Infrastructure & Non-Functional Requirements

### 🤖 Copilot Response

> **📋 Instructions**: 
> 1. Copy the Infrastructure & NFR prompt from [PROMPTS.md](./PROMPTS.md) (Stage 4)
> 2. Paste it in GitHub Copilot Chat
> 3. Wait ⏱️ Wait - Let Copilot analyze and generate response
> 4. Replace this entire section below with Copilot's response

### 🤖 Copilot Response Section:

---

## 📝 5. Task Breakdown

### 🤖 Copilot Response

> **📋 Instructions**: 
> 1. Copy the Task Breakdown prompt from [PROMPTS.md](./PROMPTS.md) (Stage 5)
> 2. Paste it in GitHub Copilot Chat
> 3. Wait ⏱️ Wait - Let Copilot analyze and generate response
> 4. Replace this entire section below with Copilot's response

### 🤖 Copilot Response Section:

---

## ✅ Completion Checklist:
- [x] **Stage 1**: Requirements Analysis response pasted ✅
- [x] **Stage 2**: Design Overview response pasted ✅  
- [x] **Stage 3**: Technical Design response pasted ✅
- [x] **Stage 4**: Infrastructure & NFR response pasted ✅
- [x] **Stage 5**: Task Breakdown response pasted ✅

**Progress**: 5/5 stages complete ✅

### 📊 Quality Verification
- [ ] All required Mermaid diagrams present
- [ ] Codebase-specific technical details included
- [ ] Principal Engineer level analysis depth
- [ ] Implementation-ready specifications

### 🎯 Final Validation
- [ ] All prompt responses completed
- [ ] Technical approach clearly defined
- [ ] Ready for development implementation

---

## 📊 Analysis Summary

**Analysis Stages**: 5 comprehensive technical analysis stages
**Quality Standard**: Principal Engineer level technical analysis
**Output**: Implementation-ready technical specification with Jira tasks

*This analysis was generated by AI Product Owner Agent - Automated Technical Analysis*
`;

    // Create the main analysis document
    fs.writeFileSync(analysisPath, masterContent, 'utf-8');
    this.log(`📝 Created master analysis document: TECHNICAL_ANALYSIS.md`);

    // Create the separate prompts document
    await this.createPromptsDocument(epicKey, jiraData, codebaseData);

    return analysisPath;
  }

  /**
   * Create separate prompts document for reference and reuse
   */
  async createPromptsDocument(
    epicKey: string,
    jiraData: any,
    codebaseData: any
  ): Promise<string> {
    const promptsPath = path.join(this.getOutputDirectory(epicKey), 'PROMPTS.md');
    
    const promptsContent = `# 📋 Generated Prompts - ${epicKey}

**Generated**: ${new Date().toLocaleString()}  
**Epic**: ${jiraData.key} - ${jiraData.name}  
**Purpose**: Optimized AI prompts for technical analysis

---

## 🎯 Quick Navigation

| Stage | Role | Status |
|-------|------|--------|
| [📋 Stage 1](#stage-1-requirements-analysis) | Principal Engineer | ⏳ Pending |
| [🎯 Stage 2](#stage-2-design-overview) | Principal Engineer | ⏳ Pending |
| [⚡ Stage 3](#stage-3-detailed-technical-design) | Principal Engineer | ⏳ Pending |
| [🏗️ Stage 4](#stage-4-infrastructure--nfr) | Principal Engineer | ⏳ Pending |
| [📝 Stage 5](#stage-5-task-breakdown) | Product Owner | ⏳ Pending |

---

## 🛠️ How to Use These Prompts

1. **📋 Copy** - Click to copy any prompt from the sections below
2. **🤖 Paste** - Open GitHub Copilot Chat and paste the prompt
3. **⏱️ Wait** - Let Copilot analyze and generate response
4. **💾 Save** - Copy Copilot's response back to [TECHNICAL_ANALYSIS.md](./TECHNICAL_ANALYSIS.md)
5. **➡️ Next** - Move to the next stage

---

# Stage 1: Requirements Analysis

**Role**: Principal Engineer | **Status**: ⏳ Pending

**Required Diagrams**: Requirements Overview, Dependencies Map

## 📝 Prompt for Copilot

[Prompt will be automatically populated when stage executes]

## 📋 Instructions After Copilot Response

1. Copy Copilot's complete response 
2. Open [TECHNICAL_ANALYSIS.md](./TECHNICAL_ANALYSIS.md)
3. Find **"## 📋 1. Requirements Analysis"** section
4. Replace the placeholder text with Copilot's response
5. Verify all required Mermaid diagrams are included

---

# Stage 2: Design Overview

**Role**: Principal Engineer | **Status**: ⏳ Pending

**Required Diagrams**: Design Overview Diagram, Component Interaction

## 📝 Prompt for Copilot

[Prompt will be automatically populated when stage executes]

## 📋 Instructions After Copilot Response

1. Copy Copilot's complete response
2. Open [TECHNICAL_ANALYSIS.md](./TECHNICAL_ANALYSIS.md)
3. Find **"## 🎯 2. Design Overview"** section
4. Replace the placeholder text with Copilot's response
5. Verify all required Mermaid diagrams are included

---

# Stage 3: Detailed Technical Design

**Role**: Principal Engineer | **Status**: ⏳ Pending

**Required Diagrams**: Database Schema Changes, API Design, Business Logic Flow, Component Architecture

## 📝 Prompt for Copilot

[Prompt will be automatically populated when stage executes]

## 📋 Instructions After Copilot Response

1. Copy Copilot's complete response
2. Open [TECHNICAL_ANALYSIS.md](./TECHNICAL_ANALYSIS.md)
3. Find **"## 🔧 3. Detailed Technical Design"** section
4. Replace the placeholder text with Copilot's response
5. Verify all required Mermaid diagrams are included

---

# Stage 4: Infrastructure & NFR

**Role**: Principal Engineer | **Status**: ⏳ Pending

**Required Diagrams**: Infrastructure Changes, Performance Architecture

## 📝 Prompt for Copilot

[Prompt will be automatically populated when stage executes]

## 📋 Instructions After Copilot Response

1. Copy Copilot's complete response
2. Open [TECHNICAL_ANALYSIS.md](./TECHNICAL_ANALYSIS.md)
3. Find **"## 🏗️ 4. Infrastructure & Non-Functional Requirements"** section
4. Replace the placeholder text with Copilot's response
5. Verify all required Mermaid diagrams are included

---

# Stage 5: Task Breakdown

**Role**: Product Owner | **Status**: ⏳ Pending

**Required Diagrams**: Task Breakdown Structure, Implementation Timeline

## 📝 Prompt for Copilot

[Prompt will be automatically populated when stage executes]

## 📋 Instructions After Copilot Response

1. Copy Copilot's complete response
2. Open [TECHNICAL_ANALYSIS.md](./TECHNICAL_ANALYSIS.md)
3. Find **"## 📝 5. Task Breakdown"** section
4. Replace the placeholder text with Copilot's response
5. Verify all required Mermaid diagrams are included

---

## 📊 Prompt Engineering Best Practices

### ✨ Techniques Applied:
- **🏷️ XML Tags**: Structured input/output with \`<jira_context>\`, \`<thinking>\` tags
- **🧠 Explicit Reasoning**: Step-by-step thinking sections for better analysis
- **🎯 Specific Instructions**: Clear requirements instead of vague directions  
- **📋 Context Integration**: Combines Jira requirements with codebase analysis
- **🔄 Sequential Flow**: Each stage builds on previous analysis

### 📈 Quality Improvements:
- **Principal Engineer perspective** for technical depth
- **Codebase-specific analysis** using actual project patterns
- **Required Mermaid diagrams** for visual communication
- **Implementation-ready outputs** for immediate development use

---

*Generated by AI Product Owner Agent - Enhanced with Anthropic prompt engineering best practices*
`;

    fs.writeFileSync(promptsPath, promptsContent, 'utf-8');
    this.log(`📝 Created prompts document: PROMPTS.md`);

    return promptsPath;
  }

  /**
   * Save stage prompt to both the master document and the prompts document
   */
  async saveStagePromptToDocuments(
    epicKey: string,
    stage: any,
    prompt: any,
    stageNumber: number
  ): Promise<void> {
    // Save to master document (existing functionality)
    await this.saveStagePrompt(epicKey, stage, prompt, stageNumber);
    
    // Also save to prompts document
    await this.updatePromptsDocument(epicKey, stage, prompt, stageNumber);
  }

  /**
   * Update prompts document with the actual generated prompt
   */
  async updatePromptsDocument(
    epicKey: string,
    stage: any,
    prompt: any,
    stageNumber: number
  ): Promise<void> {
    const promptsPath = path.join(this.getOutputDirectory(epicKey), 'PROMPTS.md');
    
    if (!fs.existsSync(promptsPath)) {
      this.log(`⚠️ Prompts document not found for ${epicKey}`);
      return;
    }

    let content = fs.readFileSync(promptsPath, 'utf-8');
    
    // Update the navigation table status from Pending to Executed
    const stageNames = [
      'Stage 1',
      'Stage 2', 
      'Stage 3',
      'Stage 4',
      'Stage 5'
    ];
    
    const stageName = stageNames[stageNumber - 1];
    
    // Update navigation table status
    content = content.replace(
      new RegExp(`(\\| \\[.*?${stageName}.*?\\].*?\\| .*? \\|) ⏳ Pending (\\|)`, 'g'),
      `$1 📝 Executed $2`
    );
    
    // Find the specific stage section and replace its placeholder  
    const placeholderText = String.raw`\[Prompt will be automatically populated when stage executes\]`;
    const stageHeaderPattern = new RegExp(`(# Stage ${stageNumber}:.*?## 📝 Prompt for Copilot.*?)${placeholderText}`, 'gs');
    
    content = content.replace(stageHeaderPattern, (match, prefix) => {
      return `${prefix}\`\`\`\n${prompt.content}\n\`\`\``;
    });
    
    // Update the status in the stage section header
    const stageTitle = `# Stage ${stageNumber}:`;
    content = content.replace(
      new RegExp(`(${stageTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*?\\*\\*Status\\*\\*:) ⏳ Pending`, 's'),
      `$1 📝 Executed`
    );
    
    fs.writeFileSync(promptsPath, content, 'utf-8');
    this.log(`✅ Updated PROMPTS.md with ${stage.name} prompt (Executed)`);
  }

  /**
   * Mark a stage response as completed in both documents
   */
  async markResponseCompleted(
    epicKey: string,
    stageNumber: number,
    stageName: string
  ): Promise<void> {
    // Update PROMPTS.md navigation table
    const promptsPath = path.join(this.getOutputDirectory(epicKey), 'PROMPTS.md');
    if (fs.existsSync(promptsPath)) {
      let promptsContent = fs.readFileSync(promptsPath, 'utf-8');
      
      // Update navigation table to show completed
      const stageRef = `Stage ${stageNumber}`;
      promptsContent = promptsContent.replace(
        new RegExp(`(\\| \\[.*?${stageRef}.*?\\].*?\\| .*? \\| .*? \\|) 📝 Executed (\\|)`, 'g'),
        `$1 ✅ Completed $2`
      );
      
      // Update section status
      const stageTitle = `# Stage ${stageNumber}:`;
      promptsContent = promptsContent.replace(
        new RegExp(`(${stageTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*?\\*\\*Status\\*\\*:) 📝 Executed`, 's'),
        `$1 ✅ Completed`
      );
      
      fs.writeFileSync(promptsPath, promptsContent, 'utf-8');
    }
    
    // Update TECHNICAL_ANALYSIS.md response status
    const analysisPath = path.join(this.getOutputDirectory(epicKey), 'TECHNICAL_ANALYSIS.md');
    if (fs.existsSync(analysisPath)) {
      let analysisContent = fs.readFileSync(analysisPath, 'utf-8');
      
      // Update the response status for the specific stage
      const stageHeaders = [
        '## 📋 1. Requirements Analysis',
        '## 🎯 2. Design Overview',
        '## 🔧 3. Detailed Technical Design',
        '## 🏗️ 4. Infrastructure & Non-Functional Requirements',
        '## 📝 5. Task Breakdown'
      ];
      
      if (stageNumber <= stageHeaders.length) {
        const stageHeader = stageHeaders[stageNumber - 1];
        
        // Find the section and update its status
        const statusPattern = new RegExp(
          `(${stageHeader.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*?\\*\\*Status\\*\\*:) ⏳ Waiting for Copilot response`, 
          's'
        );
        
        analysisContent = analysisContent.replace(statusPattern, `$1 ✅ Response completed`);
      }
      
      // Update completion checklist
      const checklistItems = [
        'Requirements Analysis response pasted',
        'Design Overview response pasted',
        'Technical Design response pasted', 
        'Infrastructure & NFR response pasted',
        'Task Breakdown response pasted'
      ];
      
      if (stageNumber <= checklistItems.length) {
        const itemText = checklistItems[stageNumber - 1];
        analysisContent = analysisContent.replace(
          new RegExp(`- \\[ \\] \\*\\*Stage ${stageNumber}\\*\\*: ${itemText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g'),
          `- [x] **Stage ${stageNumber}**: ${itemText}`
        );
      }
      
      fs.writeFileSync(analysisPath, analysisContent, 'utf-8');
    }
    
    this.log(`✅ Marked ${stageName} (Stage ${stageNumber}) as completed`);
  }

  /**
   * Save stage prompt to the master document
   */
  async saveStagePrompt(
    epicKey: string,
    stage: any,
    prompt: any,
    stageNumber: number
  ): Promise<void> {
    const masterDocPath = path.join(this.getOutputDirectory(epicKey), 'TECHNICAL_ANALYSIS.md');
    
    if (!fs.existsSync(masterDocPath)) {
      this.log(`⚠️ Master document not found for ${epicKey}`);
      return;
    }

    let content = fs.readFileSync(masterDocPath, 'utf-8');
    
    // Find the section for this stage and update the prompt
    const stageMap = {
      1: 'Requirements Analysis',
      2: 'Design Overview', 
      3: 'Detailed Technical Design',
      4: 'Infrastructure & Non-Functional Requirements',
      5: 'Task Breakdown'
    };

    const stageName = stageMap[stageNumber as keyof typeof stageMap];
    const promptPlaceholder = `*[Automated prompt for ${stageName} will be documented here]*`;
    
    // Create a collapsed section for the prompt to keep document clean
    const promptSection = `
<details>
<summary>📋 Generated Prompt - ${stage.name} (Click to expand)</summary>

\`\`\`
${prompt.content}
\`\`\`

**Required Diagrams**: ${stage.requiredDiagrams.join(', ')}
**Generated**: ${new Date().toLocaleString()}

</details>`;

    content = content.replace(promptPlaceholder, promptSection);
    
    fs.writeFileSync(masterDocPath, content, 'utf-8');
    this.log(`📝 Saved ${stage.name} prompt to master document`);
  }

  /**
   * Generate completion summary
   */
  async generateCompletionSummary(epicKey: string, stages: any[]): Promise<void> {
    const summaryPath = path.join(this.getOutputDirectory(epicKey), 'AUTOMATION_SUMMARY.md');
    
    const summaryContent = `# Automation Summary - ${epicKey}

**Generated**: ${new Date().toLocaleString()}
**Epic**: ${epicKey}
**Analysis Type**: Automated Technical Analysis

## ✅ Completed Automation Steps

### 1. Workspace Setup
- ✅ Clean output directory created
- ✅ Master analysis document generated
- ✅ File structure optimized for technical analysis

### 2. Stage Execution
${stages.map((stage, index) => `
#### Stage ${index + 1}: ${stage.name}
- ✅ Technical prompt generated
- ✅ Prompt copied to clipboard
- ✅ Copilot Chat opened automatically
- ✅ Non-modal guidance provided
- ✅ Prompt documented in master document
- 📋 **Required Diagrams**: ${stage.requiredDiagrams.join(', ')}
`).join('')}

### 3. Documentation
- ✅ All prompts saved to master document
- ✅ Structured sections for responses
- ✅ Completion checklist provided
- ✅ Quality standards documented

## 📝 Next Steps

1. **Complete the responses** - Paste each Copilot response in the master document
2. **Verify diagrams** - Ensure all required Mermaid diagrams are present
3. **Review quality** - Check technical depth and codebase specificity
4. **Finalize analysis** - Mark completion checklist items as done

## 📊 Analysis Metrics

- **Total Stages**: 5
- **Required Diagrams**: 12 total
- **Focus**: Principal Engineer technical analysis
- **Quality**: Implementation-ready specifications

## 🎯 Success Criteria

- [ ] All 5 stage responses completed
- [ ] 12 Mermaid diagrams present
- [ ] Codebase-specific technical details included
- [ ] Implementation approach clearly defined
- [ ] Jira tasks ready for development

Your automated technical analysis is ready for completion!

---

*Generated by AI Product Owner Agent - Automated Technical Analysis*
`;

    fs.writeFileSync(summaryPath, summaryContent, 'utf-8');
    this.log(`📊 Generated completion summary: AUTOMATION_SUMMARY.md`);
  }

  /**
   * Create output template for a specific stage
   */
  async createStageOutputTemplate(
    stageId: string,
    stageName: string,
    requiredDiagrams: string[]
  ): Promise<string> {
    const templateContent = this.generateStageTemplate(stageName, requiredDiagrams);
    const templatePath = this.getStageTemplatePath(stageId);
    
    // Ensure directory exists
    const templateDir = path.dirname(templatePath);
    if (!fs.existsSync(templateDir)) {
      fs.mkdirSync(templateDir, { recursive: true });
    }

    // Write template file
    fs.writeFileSync(templatePath, templateContent, 'utf-8');
    this.log(`📝 Created stage template: ${path.basename(templatePath)}`);

    return templatePath;
  }

  /**
   * Generate template content for a stage
   */
  private generateStageTemplate(stageName: string, requiredDiagrams: string[]): string {
    const timestamp = new Date().toLocaleString();
    
    return `# ${stageName} - Analysis Output

**Generated**: ${timestamp}
**Status**: ⏳ Waiting for Copilot response

## Instructions

1. **Copy the prompt** from clipboard and paste into GitHub Copilot Chat
2. **Wait for Copilot's response** with all required diagrams
3. **Copy Copilot's complete response** and paste it below
4. **Verify all diagrams** are present and valid
5. **Mark as complete** and continue to next stage

---

## Required Diagrams Checklist

${requiredDiagrams.map(diagram => `- [ ] ${diagram}`).join('\n')}

---

## Copilot Response

*Paste Copilot's complete response here...*

<!-- 
Template created by AI Product Owner Agent
Copy Copilot's response above this comment
-->

---

## Quality Verification

- [ ] All required Mermaid diagrams are present
- [ ] Maximum 2 solution approaches provided  
- [ ] Implementation details are specific and actionable
- [ ] Technical decisions are well-justified
- [ ] Diagrams render correctly in VS Code markdown preview

## Notes

*Add any additional notes or observations here...*

---

**Stage Complete**: ${timestamp}
`;
  }

  /**
   * Create epic README file
   */
  private async createEpicReadme(epicKey: string): Promise<void> {
    const readmePath = path.join(this.getOutputDirectory(epicKey), 'README.md');
    
    const readmeContent = `# AI Product Owner Analysis - ${epicKey}

**Generated**: ${new Date().toLocaleString()}
**Epic**: ${epicKey}

## 🎯 Analysis Overview

This directory contains comprehensive analysis for epic ${epicKey} using the AI Product Owner 5-stage workflow.

## 📁 Directory Structure

\`\`\`
${epicKey}/
├── README.md              # This overview document
├── SUMMARY.md              # Final analysis summary (generated at completion)
├── stages/                 # Individual stage outputs
│   ├── 01-business-analysis.md
│   ├── 02-technical-architecture.md
│   ├── 03-implementation-design.md
│   ├── 04-development-plan.md
│   └── 05-risk-assessment.md
├── templates/              # Stage templates for copying responses
│   └── stage-*.md
└── assets/                 # Supporting files and exports
\`\`\`

## 🔄 Workflow Status

- [ ] Stage 1: Business Analysis (5 min)
- [ ] Stage 2: Technical Architecture (8 min)  
- [ ] Stage 3: Implementation Design (12 min)
- [ ] Stage 4: Development Plan (10 min)
- [ ] Stage 5: Risk Assessment (8 min)

## 📋 Usage Instructions

1. **Follow VS Code prompts** - Each stage guides you through the process
2. **Use GitHub Copilot Chat** - Paste prompts and collect responses
3. **Fill stage templates** - Copy responses to provided markdown files
4. **Verify quality** - Ensure all Mermaid diagrams are present
5. **Complete workflow** - Generate final summary document

## 🎉 Completion

When all stages are complete, a comprehensive \`SUMMARY.md\` will be generated with:
- Executive summary of findings
- Links to all stage analyses  
- Implementation roadmap
- Risk mitigation strategies
- Visual diagram gallery

---

*Generated by AI Product Owner Agent*
`;

    fs.writeFileSync(readmePath, readmeContent, 'utf-8');
    this.log(`📋 Created epic README: ${epicKey}/README.md`);
  }

  /**
   * Get output directory for an epic
   */
  getOutputDirectory(epicKey: string): string {
    return path.join(this.baseOutputDir, epicKey);
  }

  /**
   * Get stage template path
   */
  private getStageTemplatePath(stageId: string): string {
    // Extract epic key from current context (we'll need to pass this)
    // For now, use a placeholder - this will be improved
    const epicDir = this.baseOutputDir; // This needs epic context
    return path.join(epicDir, 'templates', `${stageId}-template.md`);
  }

  /**
   * Get summary document path
   */
  getSummaryPath(epicKey: string): string {
    return path.join(this.getOutputDirectory(epicKey), 'SUMMARY.md');
  }

  /**
   * Create Mermaid diagram preview file
   */
  async createDiagramPreview(epicKey: string, diagrams: Array<{title: string, code: string}>): Promise<void> {
    const previewContent = `# 📊 Diagram Gallery - ${epicKey}

This document contains all Mermaid diagrams generated during analysis.

${diagrams.map((diagram, index) => `
## ${index + 1}. ${diagram.title}

~~~mermaid
${diagram.code}
~~~
`).join('')}
`;

    const previewPath = path.join(this.getOutputDirectory(epicKey), 'DIAGRAMS.md');
    fs.writeFileSync(previewPath, previewContent, 'utf-8');
    this.log(`📊 Created diagram preview: ${path.basename(previewPath)}`);
  }

  /**
   * Show progress document (stub for compatibility)
   */
  async showProgressDocument(progress: any, stages: any[]): Promise<void> {
    this.log('showProgressDocument called (stub)');
    // No-op for now
  }

  /**
   * Generate final summary (stub for compatibility)
   */
  async generateFinalSummary(...args: any[]): Promise<void> {
    this.log('generateFinalSummary called (stub)');
    // No-op for now
  }

  /**
   * Create comprehensive template (stub for compatibility)
   */
  async createComprehensiveTemplate(epicKey: string, prompt: any): Promise<string> {
    this.log('createComprehensiveTemplate called (stub)');
    // No-op for now, return empty string or a placeholder path
    return '';
  }

  /**
   * Dispose resources
   */
  dispose(): void {
    this.outputChannel?.dispose();
  }
}