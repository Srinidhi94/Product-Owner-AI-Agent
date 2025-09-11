/**
 * Production-Ready Prompt Generator - Five-Stage Analysis System
 * Generates sequential prompts using role-based templates with codebase context
 */

import * as vscode from 'vscode';
import { JiraPortfolio, CodebaseAnalysis } from '../types';
import {
  getRoleBasedTemplate,
  getStageTemplateById,
  getStagesInOrder,
  getStageCount,
  validateStageIntegrity,
  getSequentialStageTemplates,
  StageTemplate,
  MULTI_STAGE_TEMPLATES,
  STAGE_1_PRODUCT_REQUIREMENTS_ANALYSIS,
  STAGE_2_SYSTEM_ARCHITECTURE_DESIGN,
  STAGE_3_TECHNICAL_DESIGN_SPECIFICATION,
  STAGE_4_IMPLEMENTATION_DEPLOYMENT_STRATEGY,
  STAGE_5_SPRINT_PLANNING_JIRA_BREAKDOWN,
} from './PromptTemplates';
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

  constructor() {
    this.outputChannel = vscode.window.createOutputChannel('AI Product Owner - Prompt Generator');
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

    // Prepare context data for substitution
    const contextData = this.prepareContextData(jiraData, codebaseData, previousContext, options);

    // Get the template content (now context-file focused)
    const templateContent = stageTemplate.template;

    // Prepend context frame and a short reasoning guardrail
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
   * Prepare context data for template substitution
   */
  private prepareContextData(
    jiraData: JiraPortfolio,
    codebaseData: CodebaseAnalysis,
    previousContext?: string,
    options: PromptGenerationOptions = {}
  ): Record<string, string> {
    return {
      epicKey: jiraData.key,
      epicName: jiraData.name,
      jiraContext: this.formatJiraContext(jiraData),
      codebaseContext: this.formatCodebaseContext(codebaseData),
      previousStageContext: previousContext || '',
      timestamp: new Date().toISOString(),
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
      const descriptionText =
        epic.description && typeof epic.description === 'string'
          ? epic.description
          : 'No description provided';
      sections.push(
        `   - Description: ${descriptionText.substring(0, 150)}${
          descriptionText.length > 150 ? '...' : ''
        }`
      );
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
    sections.push(`### Codebase Overview`);
    sections.push(`**Project Path**: ${codebaseData.projectPath}`);
    sections.push(`**Total Files**: ${codebaseData.totalFiles} source files`);
    sections.push(
      `**Packages**: ${codebaseData.packages.length} (${codebaseData.packages.join(', ')})`
    );
    sections.push(
      `**Complexity**: ${codebaseData.metrics.complexity} (${codebaseData.metrics.linesOfCode} estimated LOC)`
    );
    sections.push('');

    // Architecture Patterns
    sections.push(`### Architecture Patterns`);
    codebaseData.patterns.forEach(pattern => {
      sections.push(
        `- **${pattern.name}**: ${pattern.description} (${pattern.confidence}/10 confidence)`
      );
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
    contextData: Record<string, string>
  ): string {
    let result = template;

    // Replace all template variables
    Object.entries(contextData).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      result = result.replace(new RegExp(placeholder, 'g'), value);
    });

    return result;
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
