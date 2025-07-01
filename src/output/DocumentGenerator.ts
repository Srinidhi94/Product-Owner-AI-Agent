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

---

## 📋 1. Requirements Analysis

### Jira Requirements
- **Epic**: ${jiraData.key} - ${jiraData.name}
- **Type**: ${jiraData.type}
- **Story Points**: ${jiraData.totalStoryPoints}
- **Description**: ${jiraData.description || 'See Jira for details'}

### Generated Prompt
*[Automated prompt for Requirements Analysis will be documented here]*

### Copilot Response
*[Paste Copilot's response here after running the Requirements Analysis prompt]*

---

## 🎯 2. Design Overview

### Generated Prompt
*[Automated prompt for Design Overview will be documented here]*

### Copilot Response
*[Paste Copilot's response here after running the Design Overview prompt]*

---

## 🔧 3. Detailed Technical Design

### Generated Prompt
*[Automated prompt for Technical Design will be documented here]*

### Copilot Response
*[Paste Copilot's response here after running the Technical Design prompt]*

---

## 🏗️ 4. Infrastructure & Non-Functional Requirements

### Generated Prompt
*[Automated prompt for Infrastructure & NFR will be documented here]*

### Copilot Response
*[Paste Copilot's response here after running the Infrastructure & NFR prompt]*

---

## 📝 5. Task Breakdown

### Generated Prompt
*[Automated prompt for Task Breakdown will be documented here]*

### Copilot Response
*[Paste Copilot's response here after running the Task Breakdown prompt]*

---

## ✅ Completion Checklist

- [ ] Requirements Analysis completed
- [ ] Design Overview completed
- [ ] Technical Design completed
- [ ] Infrastructure & NFR completed
- [ ] Task Breakdown completed
- [ ] All Mermaid diagrams verified
- [ ] Implementation ready for development

---

## 📊 Analysis Summary

**Total Estimated Duration**: 40 minutes across 5 automated stages
**Quality Standard**: Principal Engineer level technical analysis
**Output**: Implementation-ready technical specification with Jira tasks

*This analysis was generated by AI Product Owner Agent - Automated Technical Analysis*
`;

    fs.writeFileSync(analysisPath, masterContent, 'utf-8');
    this.log(`📝 Created master analysis document: TECHNICAL_ANALYSIS.md`);

    return analysisPath;
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

**Estimated Duration**: ${stage.duration}
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
- ✅ Technical prompt generated (${stage.duration})
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

- **Total Stages**: ${stages.length}
- **Estimated Duration**: ${stages.reduce((sum, stage) => sum + parseInt(stage.duration.split(' ')[0]), 0)} minutes
- **Required Diagrams**: ${stages.reduce((sum, stage) => sum + stage.requiredDiagrams.length, 0)} total
- **Focus**: Principal Engineer technical analysis
- **Quality**: Implementation-ready specifications

## 🎯 Success Criteria

- [ ] All 5 stage responses completed
- [ ] ${stages.reduce((sum, stage) => sum + stage.requiredDiagrams.length, 0)} Mermaid diagrams present
- [ ] Codebase-specific technical details included
- [ ] Implementation approach clearly defined
- [ ] Jira tasks ready for development

Your automated technical analysis is ready for completion!

---

*Generated by AI Product Owner Agent - Automated Technical Analysis*
`;

    fs.writeFileSync(summaryPath, summaryContent, 'utf-8');
    this.log(`📋 Generated automation summary: AUTOMATION_SUMMARY.md`);
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
   * Show progress document in VS Code
   */
  async showProgressDocument(progress: StageProgress, stages: AnalysisStage[]): Promise<void> {
    const completedCount = progress.completed.filter(Boolean).length;
    const progressContent = this.generateProgressContent(progress, stages, completedCount);
    
    // Open progress document in VS Code
    const doc = await vscode.workspace.openTextDocument({
      content: progressContent,
      language: 'markdown'
    });
    await vscode.window.showTextDocument(doc);
    this.log('📊 Displayed progress document');
  }

  /**
   * Generate progress document content
   */
  private generateProgressContent(
    progress: StageProgress,
    stages: AnalysisStage[],
    completedCount: number
  ): string {
    const elapsed = Math.round((new Date().getTime() - progress.startTime.getTime()) / 1000 / 60);
    const estimatedTotal = stages.reduce((sum, stage) => sum + parseInt(stage.duration), 0);
    const estimatedRemaining = stages
      .slice(completedCount)
      .reduce((sum, stage) => sum + parseInt(stage.duration), 0);

    return `# 📊 Analysis Progress Report

**Started**: ${progress.startTime.toLocaleString()}
**Elapsed**: ${elapsed} minutes
**Progress**: ${completedCount}/${progress.totalStages} stages complete (${Math.round(completedCount / progress.totalStages * 100)}%)

## 🎯 Stage Status

${stages.map((stage, index) => {
  const isComplete = progress.completed[index];
  const isCurrent = index === progress.currentStage;
  const statusIcon = isComplete ? '✅' : isCurrent ? '🔄' : '⏳';
  
  return `${statusIcon} **${stage.icon} ${stage.name}** (${stage.duration})
   ${stage.description}${isComplete ? ' - **COMPLETE**' : isCurrent ? ' - **IN PROGRESS**' : ''}`;
}).join('\n\n')}

## ⏱️ Time Tracking

- **Estimated Total**: ${estimatedTotal} minutes
- **Time Elapsed**: ${elapsed} minutes  
- **Estimated Remaining**: ${estimatedRemaining} minutes
- **Projected Completion**: ${new Date(Date.now() + estimatedRemaining * 60000).toLocaleString()}

## 📈 Quality Metrics

- **Completion Rate**: ${Math.round(completedCount / progress.totalStages * 100)}%
- **Average Stage Time**: ${completedCount > 0 ? Math.round(elapsed / completedCount) : 0} minutes
- **Remaining Stages**: ${progress.totalStages - completedCount}

## 🎉 Next Steps

${completedCount === progress.totalStages 
  ? '**All stages complete!** 🎉 Generating final summary document...' 
  : `**Continue with**: ${stages[progress.currentStage]?.icon} ${stages[progress.currentStage]?.name}`}

---

*Generated by AI Product Owner Agent - ${new Date().toLocaleString()}*
`;
  }

  /**
   * Generate final summary document
   */
  async generateFinalSummary(
    epicKey: string,
    jiraData: JiraPortfolio,
    codebaseData: CodebaseAnalysis,
    progress: StageProgress,
    stages: AnalysisStage[]
  ): Promise<void> {
    const summaryContent = this.generateSummaryContent(
      epicKey,
      jiraData,
      codebaseData,
      progress,
      stages
    );
    
    const summaryPath = this.getSummaryPath(epicKey);
    fs.writeFileSync(summaryPath, summaryContent, 'utf-8');
    
    this.log(`📋 Generated final summary: ${path.basename(summaryPath)}`);
  }

  /**
   * Generate comprehensive summary content
   */
  private generateSummaryContent(
    epicKey: string,
    jiraData: JiraPortfolio,
    codebaseData: CodebaseAnalysis,
    progress: StageProgress,
    stages: AnalysisStage[]
  ): string {
    const completedCount = progress.completed.filter(Boolean).length;
    const totalTime = Math.round((new Date().getTime() - progress.startTime.getTime()) / 1000 / 60);
    const completionRate = Math.round(completedCount / progress.totalStages * 100);

    return `# 🤖 AI Product Owner - Analysis Summary

## 📊 Executive Summary

**Epic**: ${jiraData.key} - ${jiraData.name}
**Analysis Date**: ${progress.startTime.toLocaleDateString()}
**Completion**: ${completedCount}/${progress.totalStages} stages (${completionRate}%)
**Duration**: ${totalTime} minutes
**Quality**: ${completionRate === 100 ? 'Complete Analysis' : 'Partial Analysis'}

## 🎯 Business Context

### Epic Overview
- **Type**: ${jiraData.type}
- **Total Story Points**: ${jiraData.totalStoryPoints}
- **Epics Count**: ${jiraData.epics.length}
- **Stories Count**: ${jiraData.epics.reduce((sum, epic) => sum + epic.stories.length, 0)}

### Technical Context  
- **Codebase**: ${codebaseData.totalFiles} Go files
- **Packages**: ${codebaseData.packages.length} (${codebaseData.packages.join(', ')})
- **Architecture**: ${codebaseData.patterns.map(p => p.name).join(', ')}
- **Complexity**: ${codebaseData.metrics.complexity}

## 📋 Analysis Stages

 ${stages.map((stage, index) => {
   const isComplete = progress.completed[index];
   const statusIcon = isComplete ? '✅' : '❌';
   const stageFile = `${String(index + 1).padStart(2, '0')}-${stage.id}.md`;
   
   return `### ${statusIcon} ${stage.icon} ${stage.name}
  
**Duration**: ${stage.duration}
**Status**: ${isComplete ? 'Complete' : 'Incomplete'}
**Focus**: ${stage.description}

${isComplete 
  ? `📄 **[View Analysis](./stages/${stageFile})**

**Required Diagrams**: ${stage.requiredDiagrams.join(', ')}`
  : `⚠️ **Stage not completed** - Analysis may be incomplete without this stage`}
`;
 }).join('\n\n')}

## 🏗️ Implementation Roadmap

Based on the completed analysis stages:

### Immediate Actions (Week 1-2)
${completedCount >= 1 ? '- Review business analysis findings and validate with stakeholders' : '- ⚠️ Complete business analysis first'}
${completedCount >= 2 ? '- Set up technical architecture based on system design recommendations' : '- ⚠️ Complete technical architecture analysis'}

### Development Phase (Week 3-6)  
${completedCount >= 3 ? '- Begin implementation following the detailed design specifications' : '- ⚠️ Complete implementation design analysis'}
${completedCount >= 4 ? '- Execute development plan with sprint breakdown and timeline' : '- ⚠️ Complete development planning'}

### Risk Management (Ongoing)
${completedCount >= 5 ? '- Implement risk mitigation strategies and monitoring' : '- ⚠️ Complete risk assessment for comprehensive coverage'}

## 📊 Quality Assessment

### Analysis Completeness
- **Business Impact**: ${progress.completed[0] ? '✅ Analyzed' : '❌ Missing'}
- **Technical Design**: ${progress.completed[1] ? '✅ Designed' : '❌ Missing'}  
- **Implementation Plan**: ${progress.completed[2] ? '✅ Planned' : '❌ Missing'}
- **Development Roadmap**: ${progress.completed[3] ? '✅ Created' : '❌ Missing'}
- **Risk Strategy**: ${progress.completed[4] ? '✅ Assessed' : '❌ Missing'}

### Recommendations
${completionRate === 100 
  ? '🎉 **Complete Analysis** - All stages completed successfully. Ready for implementation.'
  : completionRate >= 80
    ? '⚠️ **Nearly Complete** - Consider completing remaining stages for comprehensive coverage.'  
    : '❌ **Partial Analysis** - Multiple stages incomplete. Recommend completing full analysis.'}

## 📁 File Structure

\`\`\`
${epicKey}/
├── README.md                          # Project overview
├── SUMMARY.md                         # This summary document  
├── stages/                            # Detailed analysis by stage
${stages.map((stage, index) => {
  const stageFile = `${String(index + 1).padStart(2, '0')}-${stage.id}.md`;
  const status = progress.completed[index] ? '✅' : '❌';
  return `│   ├── ${stageFile.padEnd(30)} # ${status} ${stage.name}`;
}).join('\n')}
└── templates/                         # Stage templates
    └── *.md                           # Response templates
\`\`\`

## 🚀 Next Steps

1. **Review Analysis** - Go through each completed stage document
2. **Validate Findings** - Share with team and stakeholders  
3. **Plan Implementation** - Use development roadmap and risk strategies
4. **Monitor Progress** - Track implementation against analysis recommendations

${completionRate < 100 ? `
## ⚠️ Incomplete Analysis Notice

This analysis is ${completionRate}% complete. For comprehensive coverage, consider completing:

${stages.map((stage, index) => 
  !progress.completed[index] ? `- ${stage.icon} ${stage.name} (${stage.duration})` : null
).filter(Boolean).join('\n')}
` : ''}

---

**Generated**: ${new Date().toLocaleString()}
**Tool**: AI Product Owner Agent v1.0.0
**Total Analysis Time**: ${totalTime} minutes
`;
  }

  /**
   * Create comprehensive analysis template file
   */
  async createComprehensiveTemplate(epicKey: string, prompt: any): Promise<string> {
    const templatePath = path.join(this.getOutputDirectory(epicKey), 'COMPREHENSIVE_ANALYSIS.md');
    
    const templateContent = `# Comprehensive Analysis - ${epicKey}

**Generated**: ${new Date().toLocaleString()}
**Epic**: ${epicKey}
**Analysis Type**: Comprehensive Single-Prompt Analysis

## 🎯 Analysis Overview

This comprehensive analysis covers all 5 analysis areas in a single structured response:

1. **📊 Business Analysis & User Impact** (3 Mermaid diagrams)
2. **🏗️ Technical Architecture & System Design** (3 Mermaid diagrams)  
3. **💡 Implementation Design & Technical Approach** (3 Mermaid diagrams)
4. **🗺️ Development Plan & Sprint Organization** (2 Mermaid diagrams)
5. **⚠️ Risk Assessment & Mitigation Strategy** (1 Mermaid diagram)

**Total Expected**: 12 Mermaid diagrams + comprehensive analysis

---

## 📋 Instructions

### Step 1: Copy the Comprehensive Prompt
The comprehensive prompt has been copied to your clipboard. If you need it again, use the extension command "Copy Prompt to Clipboard".

### Step 2: Paste into GitHub Copilot Chat
Open GitHub Copilot Chat and paste the comprehensive prompt. 

### Step 3: Wait for Complete Response
Copilot will generate a comprehensive response covering all 5 analysis areas. This typically takes 35-40 minutes.

### Step 4: Copy Response Below
Once Copilot completes the analysis, copy the entire response and paste it in the section below.

---

## 🤖 Copilot Comprehensive Response

*Paste Copilot's complete comprehensive response here...*

<!-- 
This template was created by AI Product Owner Agent
Copy Copilot's comprehensive response above this comment
The response should include all 5 analysis sections with 12 Mermaid diagrams
-->

---

## ✅ Quality Verification Checklist

### Business Analysis Section
- [ ] User Journey Map (journey diagram)
- [ ] Business Value Flow (flowchart)
- [ ] Stakeholder Matrix (graph)
- [ ] User impact analysis completed
- [ ] Business value assessment included

### Technical Architecture Section  
- [ ] System Architecture (graph)
- [ ] Data Flow Diagram (flowchart)
- [ ] Integration Map (graph)
- [ ] System design detailed
- [ ] Integration points defined

### Implementation Design Section
- [ ] Code Architecture (graph)
- [ ] Database Schema (erDiagram)
- [ ] API Flow (sequenceDiagram)
- [ ] Implementation approach detailed
- [ ] Technical decisions justified

### Development Plan Section
- [ ] Sprint Timeline (gantt)
- [ ] Team Workflow (flowchart)
- [ ] Sprint breakdown provided
- [ ] Timeline with milestones
- [ ] Resource allocation defined

### Risk Assessment Section
- [ ] Risk Matrix (graph)
- [ ] Risk identification completed
- [ ] Mitigation strategies provided
- [ ] Contingency planning included

### Overall Quality
- [ ] All 12 Mermaid diagrams present and valid
- [ ] Maximum 2 solution approaches where applicable
- [ ] Implementation details are specific and actionable
- [ ] Technical decisions are well-justified
- [ ] Analysis covers all required areas comprehensively

---

## 📊 Analysis Metrics

- **Estimated Copilot Time**: 35-40 minutes
- **Expected Response Length**: 8,000-12,000 words
- **Diagrams Required**: 12 Mermaid diagrams
- **Analysis Areas**: 5 comprehensive sections
- **Quality Standard**: Enterprise-ready implementation guidance

---

## 📝 Additional Notes

*Add any observations, refinements, or follow-up questions here...*

---

**Analysis Status**: ⏳ In Progress
**Completion Date**: _To be updated when complete_

*Generated by AI Product Owner Agent - Comprehensive Analysis Mode*
`;

    // Ensure directory exists
    const outputDir = path.dirname(templatePath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write template file
    fs.writeFileSync(templatePath, templateContent, 'utf-8');
    this.log(`📝 Created comprehensive analysis template: COMPREHENSIVE_ANALYSIS.md`);

    return templatePath;
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

\`\`\`mermaid
${diagram.code}
\`\`\`

---
`).join('')}

## 💡 Viewing Instructions

1. **VS Code**: Install Mermaid Preview extension for live diagram rendering
2. **GitHub**: Diagrams render automatically in markdown preview
3. **Export**: Use Mermaid Live Editor to export as PNG/SVG

---

*Generated by AI Product Owner Agent*
`;

    const previewPath = path.join(this.getOutputDirectory(epicKey), 'DIAGRAMS.md');
    fs.writeFileSync(previewPath, previewContent, 'utf-8');
    this.log(`📊 Created diagram preview: ${path.basename(previewPath)}`);
  }

  /**
   * VS Code specific: Log to output channel
   */
  private log(message: string): void {
    this.outputChannel.appendLine(message);
    console.log(message);
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    this.outputChannel.dispose();
  }
} 