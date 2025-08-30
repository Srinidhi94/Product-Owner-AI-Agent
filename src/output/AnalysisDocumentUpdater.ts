/**
 * Analysis Document Updater
 * 
 * Handles automatic integration of AI responses into ANALYSIS.md
 * Updates status indicators and progress tracking
 */

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs/promises';
import { Logger, createLogger } from '../utils/Logger';
import { ConfigurationManager } from '../utils/ConfigurationManager';
import { getStagesInOrder } from '../prompts/PromptTemplates';

export class AnalysisDocumentUpdater {
  private logger: Logger;
  private configManager: ConfigurationManager;

  constructor() {
    this.logger = createLogger('AnalysisDocumentUpdater');
    this.configManager = new ConfigurationManager();
  }

  /**
   * Paste AI response from clipboard into the appropriate section of ANALYSIS.md
   */
  async pasteCopilotResponse(epicKey: string): Promise<void> {
    try {
      // Get clipboard content
      const clipboardContent = await vscode.env.clipboard.readText();
      if (!clipboardContent.trim()) {
        vscode.window.showWarningMessage('Clipboard is empty. Copy your AI response first.');
        return;
      }

      // Get ANALYSIS.md path
      const analysisPath = this.getAnalysisPath(epicKey);
      
      // Check if file exists
      try {
        await fs.access(analysisPath);
      } catch {
        vscode.window.showErrorMessage(`ANALYSIS.md not found for epic ${epicKey}. Start an analysis first.`);
        return;
      }

      // Detect current stage from clipboard content or ask user
      const stageInfo = await this.detectOrSelectStage(clipboardContent);
      if (!stageInfo) {
        return; // User cancelled
      }

      // Read current ANALYSIS.md content
      let content = await fs.readFile(analysisPath, 'utf-8');

      // Update the document
      content = await this.updateAnalysisContent(content, stageInfo, clipboardContent);

      // Write back to file
      await fs.writeFile(analysisPath, content, 'utf-8');

      vscode.window.showInformationMessage(
        `✅ Successfully integrated AI response into ${stageInfo.name} section`
      );

      // Open the updated file
      const document = await vscode.workspace.openTextDocument(analysisPath);
      await vscode.window.showTextDocument(document);

      this.logger.info(`Updated ANALYSIS.md for ${epicKey} - ${stageInfo.name}`);
    } catch (error: any) {
      this.logger.error(`Failed to paste Copilot response: ${error.message}`, error);
      vscode.window.showErrorMessage(`Failed to integrate AI response: ${error.message}`);
    }
  }

  /**
   * Detect stage from clipboard content or ask user to select
   */
  private async detectOrSelectStage(clipboardContent: string): Promise<StageInfo | undefined> {
    const stages = getStagesInOrder();
    
    // Try to detect stage from content
    let detectedStage: StageInfo | undefined;
    
    for (const stage of stages) {
      if (clipboardContent.includes(stage.name) || 
          clipboardContent.includes(`Stage ${stage.order}`) ||
          clipboardContent.includes(stage.role)) {
        detectedStage = {
          id: stage.id,
          name: stage.name,
          order: stage.order
        };
        break;
      }
    }

    // If detected, confirm with user
    if (detectedStage) {
      const confirm = await vscode.window.showInformationMessage(
        `Detected response for: ${detectedStage.name}. Continue?`,
        'Yes, Continue',
        'No, Choose Different Stage'
      );
      
      if (confirm === 'Yes, Continue') {
        return detectedStage;
      }
    }

    // Ask user to select stage
    const quickPickItems = stages.map(stage => ({
      label: `${stage.icon} ${stage.name}`,
      description: stage.role,
      detail: `Stage ${stage.order}`,
      stageInfo: {
        id: stage.id,
        name: stage.name,
        order: stage.order
      }
    }));

    const selection = await vscode.window.showQuickPick(quickPickItems, {
      placeHolder: 'Select which analysis stage this response is for',
      ignoreFocusOut: true
    });

    return selection?.stageInfo;
  }

  /**
   * Update ANALYSIS.md content with AI response
   */
  private async updateAnalysisContent(
    content: string, 
    stageInfo: StageInfo, 
    aiResponse: string
  ): Promise<string> {
    const sectionHeader = `## Stage ${stageInfo.order}: ${stageInfo.name}`;
    const progressTablePattern = /\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|/g;
    
    // Update progress table - change status to "✅ Complete" and completed to "✅"
    content = content.replace(progressTablePattern, (match, stage, status, completed) => {
      if (stage.trim() === stageInfo.name) {
        return `| ${stage} | ✅ Complete | ✅ |`;
      }
      return match;
    });

    // Find the section for this stage
    const sectionIndex = content.indexOf(sectionHeader);
    if (sectionIndex === -1) {
      throw new Error(`Section "${sectionHeader}" not found in ANALYSIS.md`);
    }

    // Find the end of this section (next ## header or end of file)
    const nextSectionIndex = content.indexOf('\n## ', sectionIndex + sectionHeader.length);
    const sectionEnd = nextSectionIndex === -1 ? content.length : nextSectionIndex;

    // Replace the content between section header and next section
    const beforeSection = content.substring(0, sectionIndex + sectionHeader.length);
    const afterSection = content.substring(sectionEnd);
    
    // Clean up AI response (remove any unwanted prefixes/suffixes)
    const cleanedResponse = this.cleanAiResponse(aiResponse);
    
    const newSectionContent = `

${cleanedResponse}

---`;

    return beforeSection + newSectionContent + afterSection;
  }

  /**
   * Clean AI response content
   */
  private cleanAiResponse(response: string): string {
    // Remove common AI response prefixes
    let cleaned = response.trim();
    
    // Remove "Here's my analysis:" type prefixes
    cleaned = cleaned.replace(/^(Here's?\s+(my\s+)?|I'll\s+provide\s+|This\s+is\s+)(analysis|response|assessment|evaluation)[:\s]*/i, '');
    
    // Remove "Based on the prompt:" type prefixes
    cleaned = cleaned.replace(/^Based\s+on\s+the\s+prompt[:\s]*/i, '');
    
    return cleaned.trim();
  }

  /**
   * Get ANALYSIS.md file path for epic
   */
  private getAnalysisPath(epicKey: string): string {
    const outputConfig = this.configManager.getOutputConfiguration();
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    
    let baseDir: string;
    if (path.isAbsolute(outputConfig.directory)) {
      baseDir = outputConfig.directory;
    } else if (workspaceFolder) {
      baseDir = path.join(workspaceFolder.uri.fsPath, outputConfig.directory);
    } else {
      baseDir = path.join(process.cwd(), outputConfig.directory);
    }

    return path.join(baseDir, epicKey, 'ANALYSIS.md');
  }
}

interface StageInfo {
  id: string;
  name: string;
  order: number;
}
