/**
 * Multi-Stage Analysis Engine
 *
 * Manages sequential analysis workflow for product development requirements.
 * Orchestrates stage execution and prompt generation for external AI processing.
 */

import * as vscode from 'vscode';
import { JiraPortfolio, CodebaseAnalysis } from '../types';
import { PromptGenerator, GeneratedPrompt } from '../prompts/PromptGenerator';
import { DocumentGenerator } from '../output/DocumentGenerator';
import { Logger, createLogger } from '../utils/Logger';
import { ConfigurationManager } from '../utils/ConfigurationManager';
import { getStagesInOrder } from '../prompts/PromptTemplates';

/**
 * Custom error class for analysis cancellation
 */
export class AnalysisCancelledError extends Error {
  constructor(message: string = 'Analysis was cancelled by user') {
    super(message);
    this.name = 'AnalysisCancelledError';
  }
}

export interface AnalysisStage {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export class MultiStageAnalysisEngine {
  private promptGenerator: PromptGenerator;
  private documentGenerator: DocumentGenerator;
  private configManager: ConfigurationManager;
  private outputChannel: vscode.OutputChannel;
  private logger: Logger;
  private cancelled: boolean = false;
  private currentStageInterval: ReturnType<typeof setInterval> | null = null;
  private currentStageResolver: ((value?: void | PromiseLike<void>) => void) | null = null;
  private currentStageName: string = '';

  constructor() {
    this.logger = createLogger('MultiStageAnalysisEngine');
    this.promptGenerator = new PromptGenerator();
    this.documentGenerator = new DocumentGenerator();
    this.configManager = new ConfigurationManager();
    this.outputChannel = vscode.window.createOutputChannel('AI Product Owner - Analysis');

    this.logger.info('MultiStageAnalysisEngine initialized');
  }

  /**
   * Get stages dynamically from stage registry (private)
   */
  private getDynamicStages(): AnalysisStage[] {
    return getStagesInOrder().map(stage => ({
      id: stage.id,
      name: stage.name,
      icon: stage.icon,
      description: stage.description,
    }));
  }

  /**
   * Execute complete analysis workflow with proper UX
   */
  async executeAnalysis(
    epicKey: string,
    jiraData: JiraPortfolio,
    codebaseData: CodebaseAnalysis
  ): Promise<void> {
    this.logger.info(`Starting analysis for epic: ${epicKey}`);
    this.cancelled = false;

    // 1. Show start/cancel dialog with clear options
    const startChoice = await vscode.window.showInformationMessage(
      `🚀 Ready to start multi-stage analysis for ${epicKey}?`,
      { modal: true },
      { title: 'Start Analysis', isCloseAffordance: false },
      { title: 'Cancel', isCloseAffordance: true }
    );

    if (startChoice?.title !== 'Start Analysis') {
      this.logger.info('Analysis cancelled by user at start');
      console.log(`ℹ️ Analysis cancelled by user for ${epicKey}`);
      throw new AnalysisCancelledError(`Analysis cancelled by user for ${epicKey}`);
    }

    // 2. Initialize output structure based on user configuration
    const outputConfig = this.configManager.getOutputConfiguration();
    this.logger.info(`Using output directory: ${outputConfig.directory}`);
    
    try {
      // Initialize files and folders immediately
      const outputDir = await this.documentGenerator.initializeOutputStructure(epicKey);
      vscode.window.showInformationMessage(`📁 Analysis files created in: ${outputDir}`);
      
      const stages = this.getDynamicStages();

      for (let i = 0; i < stages.length; i++) {
        if (this.cancelled) {
          this.logger.info('Analysis cancelled by user');
          throw new AnalysisCancelledError('Analysis cancelled by user during stage execution');
        }

        const stage = stages[i];
        this.logger.info(`${stage.icon} Stage ${i + 1}/${stages.length}: ${stage.name}`);

        // Generate prompt for current stage
        const prompt = await this.generateStagePrompt(stage, jiraData, codebaseData, i);

        // Add prompt to documentation
        await this.documentGenerator.addPromptToDocument(epicKey, stage.id, stage.name, prompt.content);

        // Execute the stage with 30-second interval popups
        await this.executeStageWithProgressTracking(epicKey, stage, prompt, i + 1);

        // Brief pause between stages
        await this.delay(1000);
      }

      // Only show success message if analysis wasn't cancelled
      if (!this.cancelled) {
        this.logger.info('✅ Analysis completed successfully');
        vscode.window.showInformationMessage(
          '✅ Multi-stage analysis completed successfully! Check your output directory for results.',
          'Open Results Folder'
        ).then(choice => {
          if (choice === 'Open Results Folder') {
            vscode.commands.executeCommand('revealFileInOS', vscode.Uri.file(outputDir));
          }
        });
      } else {
        this.logger.info('Analysis cancelled by user');
        throw new AnalysisCancelledError('Analysis was cancelled by user');
      }
    } catch (error: any) {
      // Re-throw AnalysisCancelledError without modification
      if (error instanceof AnalysisCancelledError) {
        throw error;
      }
      
      // Check if the error is due to cancellation
      if (error.message === 'Analysis cancelled by user') {
        this.logger.info('Analysis cancelled by user');
        throw new AnalysisCancelledError('Analysis cancelled by user');
      }
      
      this.logger.error(`Analysis failed: ${error.message}`, error);
      vscode.window.showErrorMessage(`Analysis failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate prompt for specific stage
   */
  private async generateStagePrompt(
    stage: AnalysisStage,
    jiraData: JiraPortfolio,
    codebaseData: CodebaseAnalysis,
    stageIndex: number
  ): Promise<GeneratedPrompt> {
    this.logger.info(`Generating prompt for stage: ${stage.name}`);

    try {
      return await this.promptGenerator.generateStagePrompt(stage.id, jiraData, codebaseData);
    } catch (error: any) {
      this.logger.error(`Prompt generation failed for ${stage.name}`, error);
      throw new Error(`Failed to generate prompt for ${stage.name}: ${error.message}`);
    }
  }

  /**
   * Execute individual stage with 30-second progress tracking
   */
  private async executeStageWithProgressTracking(
    epicKey: string,
    stage: AnalysisStage,
    prompt: GeneratedPrompt,
    stageNumber: number
  ): Promise<void> {
    const stageTitle = `${stage.icon} Stage ${stageNumber}: ${stage.name}`;

    // Update output channel
    this.outputChannel.appendLine(`\n${'='.repeat(60)}`);
    this.outputChannel.appendLine(stageTitle);
    this.outputChannel.appendLine(`${'='.repeat(60)}`);
    this.outputChannel.appendLine(`Epic: ${epicKey}`);
    this.outputChannel.appendLine(`Description: ${stage.description}`);
    this.outputChannel.appendLine('');

    // Show the prompt to user
    this.outputChannel.appendLine('Generated Prompt:');
    this.outputChannel.appendLine('-'.repeat(40));
    this.outputChannel.appendLine(prompt.content);
    this.outputChannel.appendLine('-'.repeat(40));
    this.outputChannel.appendLine('');
    this.outputChannel.show();

    // Copy prompt to clipboard for easy access
    await vscode.env.clipboard.writeText(prompt.content);

    // Show initial notification
    vscode.window.showInformationMessage(
      `${stage.icon} ${stage.name} prompt generated and copied to clipboard! Use with GitHub Copilot to update the analysis files.`
    );

    // Start 30-second interval to ask if stage is complete
    return new Promise<void>((resolve, reject) => {
      let intervalCount = 0;
      
      // Store the resolver for manual completion
      this.currentStageResolver = resolve;
      this.currentStageName = stage.name;
      
      const checkProgress = async () => {
        intervalCount++;
        
        if (this.cancelled) {
          if (this.currentStageInterval) {
            clearInterval(this.currentStageInterval);
            this.currentStageInterval = null;
          }
          reject(new Error('Analysis cancelled by user'));
          return;
        }

        const choice = await vscode.window.showInformationMessage(
          `⏰ ${stage.name} in progress... Ready to continue to next stage?`,
          { modal: false },
          'Complete & Continue',
          'Still Working',
          'Cancel Analysis'
        );

        if (choice === 'Complete & Continue') {
          if (this.currentStageInterval) {
            clearInterval(this.currentStageInterval);
            this.currentStageInterval = null;
          }
          this.currentStageResolver = null;
          this.currentStageName = '';
          this.logger.info(`Stage ${stageNumber} (${stage.name}) completed by user`);
          resolve();
        } else if (choice === 'Cancel Analysis') {
          // User explicitly chose to cancel
          if (this.currentStageInterval) {
            clearInterval(this.currentStageInterval);
            this.currentStageInterval = null;
          }
          this.currentStageResolver = null;
          this.currentStageName = '';
          this.cancelled = true;
          console.log(`ℹ️ Analysis cancelled by user during ${stage.name}`);
          reject(new Error('Analysis cancelled by user'));
        }
        // If "Still Working" selected or dialog dismissed, continue the interval
      };

      // Start the interval - check every 30 seconds
      this.currentStageInterval = setInterval(checkProgress, 30000);
      
      // Also trigger the first check immediately after 5 seconds
      setTimeout(checkProgress, 5000);
    });
  }

  /**
   * Get available analysis stages (public method)
   */
  getStages(): AnalysisStage[] {
    return this.getDynamicStages();
  }

  /**
   * Manually proceed to next stage (for Complete Stage command)
   */
  async proceedToNextStage(): Promise<void> {
    if (this.currentStageResolver) {
      const stageName = this.currentStageName;
      this.logger.info(`Manually completing current stage: ${stageName}`);
      
      // Clear the interval
      if (this.currentStageInterval) {
        clearInterval(this.currentStageInterval);
        this.currentStageInterval = null;
      }
      
      // Store resolver before clearing state
      const resolver = this.currentStageResolver;
      this.currentStageResolver = null;
      this.currentStageName = '';
      
      // Show confirmation message
      vscode.window.showInformationMessage(`✅ ${stageName || 'Current stage'} marked as complete. Proceeding to next stage...`);
      
      resolver();
    } else {
      throw new Error('No active stage to complete. Make sure analysis is running.');
    }
  }

  /**
   * Cancel ongoing analysis (wrapper for cancel method to match extension.ts expectations)
   */
  cancelAnalysis(): void {
    this.cancel();
  }

  /**
   * Cancel ongoing analysis
   */
  cancel(): void {
    this.cancelled = true;
    if (this.currentStageInterval) {
      clearInterval(this.currentStageInterval);
      this.currentStageInterval = null;
    }
    this.currentStageResolver = null;
    this.currentStageName = '';
    this.logger.info('Analysis cancellation requested');
  }

  /**
   * Check if analysis is cancelled
   */
  isCancelled(): boolean {
    return this.cancelled;
  }

  /**
   * Simple delay utility
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    this.cancelled = true;
    if (this.currentStageInterval) {
      clearInterval(this.currentStageInterval);
      this.currentStageInterval = null;
    }
    this.currentStageResolver = null;
    this.currentStageName = '';
    this.outputChannel.dispose();
    this.promptGenerator.dispose();
    this.documentGenerator.dispose();
    this.logger.info('MultiStageAnalysisEngine disposed');
  }
}
