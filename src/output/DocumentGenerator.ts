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

      // Add the new prompt section
      const promptSection = this.generatePromptSection(stageId, stageName, prompt);
      content += '\n\n' + promptSection;

      await this.writeFile(promptsPath, content);
      this.logger.info(`✅ Added ${stageName} prompt to PROMPTS.md`);
    } catch (error: any) {
      this.logger.error(`Failed to add prompt to document: ${error.message}`, error);
      throw error;
    }
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

## Workflow

1. **Review Prompts** - Check [PROMPTS.md](./PROMPTS.md) for stage-specific prompts
2. **Use with AI** - Prompts are automatically copied to clipboard for use with AI assistants
3. **Auto-Integration** - Use the "Paste Copilot Response" command to automatically integrate responses
4. **Iterate** - Refine and improve analysis as needed

## Getting Started

1. Open [PROMPTS.md](./PROMPTS.md) to see the first prompt
2. The prompt is automatically copied to your clipboard
3. Paste into your AI assistant (ChatGPT, Claude, Copilot, etc.)
4. Use **Cmd+Shift+P** → "AI Product Owner: Paste Copilot Response" to automatically integrate the response
5. Proceed to the next prompt

---

*Generated by AI Product Owner Agent v1.0*
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
3. **Review** the AI response
4. **Use** the "Paste Copilot Response" command to automatically integrate the response into [ANALYSIS.md](./ANALYSIS.md)

---

## Prompt Navigation

| Stage | Status | Description |
|-------|--------|-------------|
| 🔄 | Pending | *Prompts will be added as you progress through the analysis* |

---

*Prompts will be automatically added here as you progress through each analysis stage.*
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
          `## Stage ${index + 1}: ${stage.name}\n\n*AI responses will be automatically integrated here using the "Paste Copilot Response" command*\n\n---`
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
- Use the "Paste Copilot Response" command to automatically integrate responses into the appropriate sections below
- Update the status indicators as you complete each stage

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
   * Generate prompt section for PROMPTS.md
   */
  private generatePromptSection(stageId: string, stageName: string, prompt: string): string {
    const timestamp = new Date().toLocaleString();

    return `---

## ${stageName}

**Stage ID:** \`${stageId}\`  
**Generated:** ${timestamp}  
**Status:** ✅ Ready

### Prompt

\`\`\`
${prompt}
\`\`\`

### Instructions

1. **Copy** the prompt text above
2. **Paste** into your AI assistant
3. **Review** the response carefully
4. **Save** the response in [ANALYSIS.md](./ANALYSIS.md) under the "${stageName}" section

---`;
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
   * Clean up resources
   */
  dispose(): void {
    this.logger.info('DocumentGenerator disposed');
  }
}
