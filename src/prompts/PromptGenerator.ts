/**
 * Production-Ready Prompt Generator - Five-Stage Analysis System
 * Generates sequential prompts using role-based templates with codebase context
 */

import * as vscode from 'vscode';
import { JiraPortfolio, CodebaseAnalysis } from '../types';
import { StageTemplate, MULTI_STAGE_TEMPLATES } from './PromptTemplates';
import { buildContextFrame } from './ContextEngineering';

export interface GeneratedPrompt {
  id: string;
  name: string;
  content: string;
  role: string;
  timestamp: string;
}

export interface PromptGenerationOptions {
  outputDirectory?: string;
}

export class PromptGenerator {
  private outputChannel: vscode.OutputChannel;

  constructor(outputChannel?: vscode.OutputChannel) {
    this.outputChannel = outputChannel || vscode.window.createOutputChannel('AI Product Owner - Prompt Generator');
  }

  /**
   * Generate stage-specific prompt with codebase context and previous stage context
   */
  async generateStagePrompt(
    stageId: string,
    jiraData: JiraPortfolio,
    codebaseData: CodebaseAnalysis,
    previousContext?: string,
    options: PromptGenerationOptions = {}
  ): Promise<GeneratedPrompt> {
    this.log(`🧠 Generating prompt for stage: ${stageId}`);

    // Find the stage template
    const stageTemplate = MULTI_STAGE_TEMPLATES.find(t => t.id === stageId);
    if (!stageTemplate) {
      throw new Error(`Stage template not found: ${stageId}`);
    }

    // Build structured context frame
    const contextFrame = buildContextFrame(jiraData, codebaseData);

    // Get the template content (context-file focused)
    const templateContent = stageTemplate.template;

    // Prepend context frame and reasoning guardrail
    const deliberateHeader = [
      'You must strictly ground all analysis in the Context Engineering Frame below.',
      'If evidence is missing, ask for clarification instead of guessing. Cite actual file paths you used.',
      '',
      contextFrame,
      '',
    ].join('\n');

    const promptContent = deliberateHeader + templateContent;

    return {
      id: stageTemplate.id,
      name: stageTemplate.name,
      content: promptContent,
      role: stageTemplate.role,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get available stage templates
   */
  getAvailableStageTemplates(): StageTemplate[] {
    return [...MULTI_STAGE_TEMPLATES];
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
