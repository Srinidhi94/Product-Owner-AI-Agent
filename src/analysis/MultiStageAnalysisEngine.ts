/**
 * Multi-Stage Analysis Engine - Interactive 5-Prompt Workflow
 * Orchestrates sequential prompt generation with VS Code integration
 */

import * as vscode from 'vscode';
import * as path from 'path';
import { JiraPortfolio, CodebaseAnalysis } from '../types';
import { PromptGenerator, GeneratedPrompt } from '../prompts/PromptGenerator';
import { DocumentGenerator } from '../output/DocumentGenerator';

export interface AnalysisStage {
  id: string;
  name: string;
  duration: string;
  icon: string;
  description: string;
  requiredDiagrams: string[];
}

export interface StageProgress {
  currentStage: number;
  totalStages: number;
  stageName: string;
  completed: boolean[];
  startTime: Date;
}

export class MultiStageAnalysisEngine {
  private promptGenerator: PromptGenerator;
  private documentGenerator: DocumentGenerator;
  private outputChannel: vscode.OutputChannel;
  
  private stages: AnalysisStage[] = [
    {
      id: 'requirements-analysis',
      name: 'Requirements Analysis',
      duration: '5 minutes',
      icon: '📋',
      description: 'Principal Engineer: Analyze Jira requirements, dependencies, and use cases',
      requiredDiagrams: ['Requirements Overview', 'Dependencies Map']
    },
    {
      id: 'design-overview',
      name: 'Design Overview',
      duration: '6 minutes', 
      icon: '🎯',
      description: 'Principal Engineer: High-level design concept with core architecture',
      requiredDiagrams: ['Design Overview Diagram', 'Component Interaction']
    },
    {
      id: 'technical-design',
      name: 'Detailed Technical Design',
      duration: '15 minutes',
      icon: '🔧',
      description: 'Principal Engineer: DB, API, business logic specific to current codebase',
      requiredDiagrams: ['Database Schema Changes', 'API Design', 'Business Logic Flow', 'Component Architecture']
    },
    {
      id: 'infrastructure-nfr',
      name: 'Infrastructure & Non-Functional Requirements',
      duration: '8 minutes',
      icon: '🏗️',
      description: 'Principal Engineer: Infrastructure, testing, performance, backward compatibility',
      requiredDiagrams: ['Infrastructure Changes', 'Performance Architecture']
    },
    {
      id: 'task-breakdown',
      name: 'Task Breakdown',
      duration: '6 minutes',
      icon: '📝',
      description: 'Product Owner: Break into Jira tasks with acceptance criteria and DoD',
      requiredDiagrams: ['Task Breakdown Structure', 'Implementation Timeline']
    }
  ];

  constructor() {
    this.promptGenerator = new PromptGenerator();
    this.documentGenerator = new DocumentGenerator();
    this.outputChannel = vscode.window.createOutputChannel('AI Product Owner - Multi-Stage Analysis');
  }

  /**
   * Run the fully automated technical analysis workflow
   */
  async runFullAnalysis(
    epicKey: string,
    jiraData: JiraPortfolio,
    codebaseData: CodebaseAnalysis,
    progress: vscode.Progress<{ increment?: number; message?: string }>
  ): Promise<void> {
    this.log(`🚀 Starting automated technical analysis for ${epicKey}`);
    
    try {
      // Initialize clean output structure (5%)
      progress.report({ increment: 5, message: '📁 Setting up analysis workspace...' });
      await this.documentGenerator.initializeCleanOutputStructure(epicKey);
      
      // Create master analysis document (10%)
      progress.report({ increment: 5, message: '📝 Creating master analysis document...' });
      const masterDocPath = await this.documentGenerator.createMasterAnalysisDocument(epicKey, jiraData, codebaseData);
      
      // Show workflow overview and start sequential execution
      progress.report({ increment: 10, message: '🎯 Starting sequential automated workflow...' });
      await this.showSequentialWorkflowOverview(epicKey, this.stages);
      
      // Run sequential analysis stages with user confirmation (10% to 85%)
      const stageIncrement = 75 / this.stages.length; // 75% total across all stages
      
      for (let i = 0; i < this.stages.length; i++) {
        const stage = this.stages[i];
        this.log(`🔄 Starting Stage ${i + 1}/${this.stages.length}: ${stage.name}`);
        
        progress.report({ 
          increment: stageIncrement / 2, 
          message: `${stage.icon} ${stage.name} - Generating prompt...` 
        });
        
        // Generate stage-specific prompt with codebase context
        const stagePrompt = await this.generateTechnicalStagePrompt(stage, jiraData, codebaseData, i);
        
        // Save prompt to documentation
        await this.documentGenerator.saveStagePrompt(epicKey, stage, stagePrompt, i + 1);
        
        progress.report({ 
          increment: stageIncrement / 2, 
          message: `${stage.icon} ${stage.name} - Executing in Copilot...` 
        });
        
        // Execute stage and wait for completion
        await this.executeSequentialStage(epicKey, stage, stagePrompt, i + 1);
        
        this.log(`✅ Completed Stage ${i + 1}: ${stage.name}`);
      }
      
      // Finalize and open results (85% to 100%)
      progress.report({ increment: 15, message: '🎉 Opening analysis results...' });
      await this.finalizeAndOpenResults(epicKey, masterDocPath);
      
      this.log(`✅ Automated technical analysis completed for ${epicKey}`);

    } catch (error: any) {
      this.log(`❌ Analysis workflow failed: ${error.message}`);
      vscode.window.showErrorMessage(`Technical analysis failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Show analysis overview and get user confirmation
   */
  private async showAnalysisOverview(epicKey: string, progress: StageProgress): Promise<void> {
    const totalTime = this.stages.reduce((sum, stage) => {
      const minutes = parseInt(stage.duration.split(' ')[0]);
      return sum + minutes;
    }, 0);

    const overview = `# 🤖 AI Product Owner - Interactive Analysis

**Epic**: ${epicKey}
**Total Stages**: ${this.stages.length}
**Estimated Time**: ${totalTime} minutes
**Started**: ${progress.startTime.toLocaleString()}

## 📋 Analysis Stages

${this.stages.map((stage, index) => `
${index + 1}. **${stage.icon} ${stage.name}** (${stage.duration})
   - ${stage.description}
   - Required diagrams: ${stage.requiredDiagrams.join(', ')}
`).join('')}

## 🔄 Interactive Workflow

1. **Generate Prompt** - Each stage prompt is automatically copied to clipboard
2. **Open Copilot Chat** - We'll open GitHub Copilot Chat for you
3. **Paste & Analyze** - Paste the prompt and wait for Copilot's response
4. **Save Response** - Copy Copilot's response to provided markdown files
5. **Continue** - Move to next stage

Ready to begin?`;

    const action = await vscode.window.showInformationMessage(
      `🚀 Ready to start 5-stage analysis for ${epicKey}?\n\nThis will guide you through ${this.stages.length} focused prompts with GitHub Copilot.`,
      { modal: true },
      'Start Analysis',
      'Show Overview',
      'Cancel'
    );

    if (action === 'Show Overview') {
      // Show overview in new document
      const doc = await vscode.workspace.openTextDocument({
        content: overview,
        language: 'markdown'
      });
      await vscode.window.showTextDocument(doc);
      
      // Ask again after showing overview
      const startAction = await vscode.window.showInformationMessage(
        'Ready to start the analysis?',
        { modal: true },
        'Start Analysis',
        'Cancel'
      );
      
      if (startAction !== 'Start Analysis') {
        throw new Error('Analysis cancelled by user');
      }
    } else if (action !== 'Start Analysis') {
      throw new Error('Analysis cancelled by user');
    }

    this.log('📋 Analysis overview confirmed, starting workflow...');
  }

  /**
   * Generate prompt for specific stage
   */
  private async generateStagePrompt(
    stageId: string,
    jiraData: JiraPortfolio,
    codebaseData: CodebaseAnalysis
  ): Promise<GeneratedPrompt> {
    const prompt = await this.promptGenerator.generatePrompt(stageId, jiraData, codebaseData, {
      includeContext7: false,
      maxSolutionCount: 2,
      saveToFiles: false
    });

    if (!prompt) {
      throw new Error(`Failed to generate prompt for stage: ${stageId}`);
    }

    return prompt;
  }

  /**
   * Execute the workflow for a single stage
   */
  private async executeStageWorkflow(
    stage: AnalysisStage,
    prompt: GeneratedPrompt,
    stageNumber: number
  ): Promise<boolean> {
    this.log(`🎯 Executing workflow for ${stage.name}`);

    // Step 1: Copy prompt to clipboard
    await vscode.env.clipboard.writeText(prompt.content);
    this.log(`📋 Copied ${stage.name} prompt to clipboard (${prompt.content.length} characters)`);

    // Step 2: Create output file template
    const outputFilePath = await this.documentGenerator.createStageOutputTemplate(
      stage.id,
      stage.name,
      stage.requiredDiagrams
    );

    // Step 3: Show stage instructions with actions
    const instructions = `**Stage ${stageNumber}/${this.stages.length}: ${stage.icon} ${stage.name}**

✅ Prompt copied to clipboard
📁 Output file created: ${path.basename(outputFilePath)}

**Next Steps:**
1. Click "Open Copilot Chat" to launch GitHub Copilot
2. Paste the prompt (Cmd+V / Ctrl+V) into Copilot Chat
3. Wait for Copilot's complete response (~${stage.duration})
4. Copy Copilot's response to the output file
5. Return here and click "Stage Complete"

**Required Diagrams:** ${stage.requiredDiagrams.join(', ')}`;

    const action = await vscode.window.showInformationMessage(
      instructions,
      { modal: true },
      'Open Copilot Chat',
      'Open Output File',
      'Stage Complete',
      'Skip Stage'
    );

    // Handle user actions
    switch (action) {
      case 'Open Copilot Chat':
        await this.openCopilotChat();
        return await this.waitForStageCompletion(stage, outputFilePath);
        
      case 'Open Output File':
        await vscode.commands.executeCommand('vscode.open', vscode.Uri.file(outputFilePath));
        return await this.waitForStageCompletion(stage, outputFilePath);
        
      case 'Stage Complete':
        return true;
        
      case 'Skip Stage': {
        const confirmSkip = await vscode.window.showWarningMessage(
          `Skip ${stage.name}? This will reduce analysis quality.`,
          { modal: true },
          'Skip Stage',
          'Go Back'
        );
        return confirmSkip !== 'Skip Stage';
      }
        
      default:
        return false;
    }
  }

  /**
   * Open GitHub Copilot Chat with multiple fallback methods
   */
  private async openCopilotChat(): Promise<void> {
    const copilotCommands = [
      'github.copilot.chat.open',
      'github.copilot.openChatView', 
      'workbench.panel.chat.view.copilot.focus',
      'workbench.view.extension.github-copilot-chat'
    ];

    let success = false;
    
    for (const command of copilotCommands) {
      try {
        await vscode.commands.executeCommand(command);
        this.log(`🤖 Opened GitHub Copilot Chat using: ${command}`);
        success = true;
        
        // Show helpful message about the prompt
        vscode.window.showInformationMessage(
          '🤖 Copilot Chat opened! The prompt is already copied to your clipboard - just paste it (Cmd+V / Ctrl+V)',
          'Got it!'
        );
        
        break;
      } catch (error) {
        this.log(`⚠️ Command '${command}' failed, trying next...`);
        continue;
      }
    }

    if (!success) {
      this.log('⚠️ Could not auto-open Copilot Chat with any known command');
      
      const action = await vscode.window.showWarningMessage(
        '🤖 Could not auto-open Copilot Chat. Please open it manually and paste the prompt.',
        'Show Instructions',
        'I\'ll open it manually'
      );
      
      if (action === 'Show Instructions') {
        const instructions = `# How to Open GitHub Copilot Chat

## Method 1: Command Palette
1. Press **Ctrl+Shift+P** (Windows/Linux) or **Cmd+Shift+P** (Mac)
2. Type: **"GitHub Copilot: Open Chat"**
3. Press Enter

## Method 2: Activity Bar
1. Look for the **GitHub Copilot** icon in the left Activity Bar
2. Click it to open the Copilot panel
3. Click **"Chat"** tab

## Method 3: Quick Access
1. Press **Ctrl+Alt+I** (Windows/Linux) or **Cmd+Alt+I** (Mac)
2. This should open Copilot Chat directly

## After Opening:
✅ The prompt is already copied to your clipboard
✅ Just paste it (Cmd+V / Ctrl+V) into Copilot Chat
✅ Wait for the complete response`;

        const doc = await vscode.workspace.openTextDocument({
          content: instructions,
          language: 'markdown'
        });
        await vscode.window.showTextDocument(doc);
      }
    }
  }

  /**
   * Wait for user to complete the current stage with persistent UX
   */
  private async waitForStageCompletion(stage: AnalysisStage, outputFilePath: string): Promise<boolean> {
    // Create a persistent status bar item for stage progression
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    statusBarItem.text = `$(play) ${stage.icon} ${stage.name} - Ready`;
    statusBarItem.tooltip = 'Click to proceed to next stage when Copilot analysis is complete';
    statusBarItem.command = 'aiProductOwner.proceedToNextStage';
    statusBarItem.show();

    // Store current stage info for the proceed command
    this.currentStageInfo = {
      stage: stage,
      outputFilePath: outputFilePath,
      statusBarItem: statusBarItem
    };

    // Show initial setup actions
    const setupAction = await vscode.window.showInformationMessage(
      `🎯 ${stage.icon} ${stage.name} - Ready!\n\n✅ Prompt copied to clipboard\n📁 Output file created\n\nChoose your next action:`,
      'Open Copilot Chat',
      'Open Output File', 
      'Show Instructions',
      'Proceed to Next Stage'
    );

    switch (setupAction) {
      case 'Open Copilot Chat':
        await this.openCopilotChat();
        vscode.window.showInformationMessage(
          `💡 Working on ${stage.name}...\n\n📌 Click the status bar button "${stage.icon} ${stage.name} - Ready" when you're done with Copilot.`,
          'Got it!'
        );
        break;
        
      case 'Open Output File':
        await vscode.commands.executeCommand('vscode.open', vscode.Uri.file(outputFilePath));
        vscode.window.showInformationMessage(
          `💡 Output file opened. When ready, click the status bar button to proceed.`,
          'Got it!'
        );
        break;
        
      case 'Show Instructions':
        await this.showStageHelp(stage);
        break;
        
      case 'Proceed to Next Stage':
        // User wants to skip directly
        statusBarItem.dispose();
        return true;
    }

    // Return a promise that resolves when user clicks the status bar item
    return new Promise((resolve) => {
      this.stageCompletionResolver = resolve;
    });
  }

  /**
   * Handle status bar click to proceed to next stage
   */
  private currentStageInfo: any = null;
  private stageCompletionResolver: ((value: boolean) => void) | null = null;

  public async proceedToNextStage(): Promise<void> {
    if (!this.currentStageInfo || !this.stageCompletionResolver) {
      vscode.window.showWarningMessage('No active stage to proceed from.');
      return;
    }

    const { stage, statusBarItem } = this.currentStageInfo;
    
    const action = await vscode.window.showInformationMessage(
      `Complete ${stage.icon} ${stage.name}?\n\nMake sure you've:\n• Pasted the prompt in Copilot Chat\n• Received and reviewed the response\n• Copied any important information`,
      { modal: true },
      'Stage Complete ✅',
      'Not Yet - Continue Working',
      'Skip This Stage'
    );

    switch (action) {
      case 'Stage Complete ✅':
        statusBarItem.dispose();
        this.stageCompletionResolver(true);
        this.currentStageInfo = null;
        this.stageCompletionResolver = null;
        vscode.window.showInformationMessage(`✅ ${stage.name} completed! Moving to next stage...`);
        break;
        
             case 'Skip This Stage': {
         const confirmSkip = await vscode.window.showWarningMessage(
           `Skip ${stage.name}? This will reduce analysis quality.`,
           { modal: true },
           'Yes, Skip Stage',
           'No, Continue Working'
         );
         if (confirmSkip === 'Yes, Skip Stage') {
           statusBarItem.dispose();
           this.stageCompletionResolver(false);
           this.currentStageInfo = null;
           this.stageCompletionResolver = null;
         }
         break;
       }
        
      case 'Not Yet - Continue Working':
      default:
        // Keep working - status bar stays active
        vscode.window.showInformationMessage(
          `💼 Keep working on ${stage.name}. Click the status bar button when ready to proceed.`
        );
        break;
    }
  }

  /**
   * Show help for current stage
   */
  private async showStageHelp(stage: AnalysisStage): Promise<void> {
    const help = `# Help - ${stage.icon} ${stage.name}

## What to do:
1. **Paste the prompt** into GitHub Copilot Chat
2. **Wait for response** (~${stage.duration})
3. **Verify diagrams** - Copilot should generate ${stage.requiredDiagrams.length} Mermaid diagrams
4. **Copy response** to the output markdown file
5. **Click "Stage Complete"** to continue

## Expected Diagrams:
${stage.requiredDiagrams.map(diagram => `• ${diagram}`).join('\n')}

## Troubleshooting:
- **No diagrams?** Ask Copilot: "Please include the required Mermaid diagrams"
- **Incomplete response?** Ask Copilot: "Please continue the analysis"
- **Need more detail?** Ask Copilot: "Please provide more specific implementation details"

## Quality Check:
- [ ] All required Mermaid diagrams present
- [ ] Maximum 2 solution approaches provided
- [ ] Implementation details are specific
- [ ] Technical decisions are justified`;

    const doc = await vscode.workspace.openTextDocument({
      content: help,
      language: 'markdown'
    });
    await vscode.window.showTextDocument(doc);
  }

  /**
   * Show progress update between stages
   */
  private async showProgressUpdate(progress: StageProgress): Promise<void> {
    const completedCount = progress.completed.filter(Boolean).length;
    const remaining = progress.totalStages - completedCount;
    
    const progressMessage = `📊 Analysis Progress: ${completedCount}/${progress.totalStages} stages complete

✅ Completed: ${this.stages.slice(0, completedCount).map(s => s.icon + ' ' + s.name).join(', ')}
🔄 Remaining: ${remaining} stages

Ready for next stage?`;

    const action = await vscode.window.showInformationMessage(
      progressMessage,
      'Continue',
      'Show Progress',
      'Pause Analysis'
    );

    if (action === 'Show Progress') {
      await this.documentGenerator.showProgressDocument(progress, this.stages);
    } else if (action === 'Pause Analysis') {
      const resume = await vscode.window.showInformationMessage(
        'Analysis paused. Resume when ready.',
        'Resume',
        'Cancel Analysis'
      );
      if (resume !== 'Resume') {
        throw new Error('Analysis cancelled by user');
      }
    }
  }

  /**
   * Generate final summary document
   */
  private async generateFinalSummary(
    epicKey: string,
    jiraData: JiraPortfolio,
    codebaseData: CodebaseAnalysis,
    progress: StageProgress
  ): Promise<void> {
    this.log('📋 Generating final analysis summary...');
    
    await this.documentGenerator.generateFinalSummary(
      epicKey,
      jiraData,
      codebaseData,
      progress,
      this.stages
    );
  }

  /**
   * Show completion summary
   */
  private async showCompletionSummary(epicKey: string, progress: StageProgress): Promise<void> {
    const completedCount = progress.completed.filter(Boolean).length;
    const totalTime = Math.round((new Date().getTime() - progress.startTime.getTime()) / 1000 / 60);
    
    const summary = `🎉 Analysis Complete!

**Epic**: ${epicKey}
**Completed**: ${completedCount}/${progress.totalStages} stages
**Duration**: ${totalTime} minutes
**Quality**: ${completedCount === progress.totalStages ? 'Complete' : 'Partial'}

Your comprehensive analysis is ready for implementation!`;

    const action = await vscode.window.showInformationMessage(
      summary,
      'Open Summary',
      'Open Output Folder',
      'Share Results'
    );

    switch (action) {
      case 'Open Summary': {
        const summaryPath = this.documentGenerator.getSummaryPath(epicKey);
        await vscode.commands.executeCommand('vscode.open', vscode.Uri.file(summaryPath));
        break;
      }
        
      case 'Open Output Folder': {
        const outputDir = this.documentGenerator.getOutputDirectory(epicKey);
        await vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(outputDir), true);
        break;
      }
        
      case 'Share Results':
        await this.shareResults(epicKey);
        break;
    }

    this.log(`🎉 Analysis completed: ${completedCount}/${progress.totalStages} stages in ${totalTime} minutes`);
  }

  /**
   * Share analysis results
   */
  private async shareResults(epicKey: string): Promise<void> {
    const summaryPath = this.documentGenerator.getSummaryPath(epicKey);
    const summaryContent = await vscode.workspace.fs.readFile(vscode.Uri.file(summaryPath));
    const content = Buffer.from(summaryContent).toString('utf8');
    
    // Copy summary to clipboard
    await vscode.env.clipboard.writeText(content);
    
    vscode.window.showInformationMessage(
      '📋 Analysis summary copied to clipboard! Ready to share with your team.',
      'Open in Browser',
      'Create Issue'
    );
  }

  /**
   * Generate technical stage-specific prompt with codebase context
   */
  private async generateTechnicalStagePrompt(
    stage: AnalysisStage,
    jiraData: JiraPortfolio,
    codebaseData: CodebaseAnalysis,
    stageIndex: number
  ): Promise<GeneratedPrompt> {
    this.log(`🧠 Generating technical prompt for ${stage.name}...`);
    return await this.promptGenerator.generateTechnicalStagePrompt(stage, jiraData, codebaseData, stageIndex);
  }

  /**
   * Show sequential workflow overview
   */
  private async showSequentialWorkflowOverview(epicKey: string, stages: AnalysisStage[]): Promise<void> {
    const totalTime = stages.reduce((sum, stage) => sum + parseInt(stage.duration.split(' ')[0]), 0);
    
    const overview = `🚀 **Sequential Automated Workflow Started for ${epicKey}**

## 📋 Analysis Stages (${stages.length} total)

${stages.map((stage, index) => `
**${index + 1}. ${stage.icon} ${stage.name}** (${stage.duration})
   - ${stage.description}
   - Diagrams: ${stage.requiredDiagrams.join(', ')}
`).join('')}

## 🔄 Sequential Execution Process

1. **Prompt Generation** - Create codebase-specific technical prompt
2. **Copilot Execution** - Open Copilot Chat and copy prompt automatically
3. **User Confirmation** - Wait for you to confirm stage completion
4. **Automatic Progression** - Move to next stage automatically

**Total Estimated Time**: ${totalTime} minutes
**Interaction Required**: Confirmation after each Copilot analysis

The workflow will now proceed stage by stage. Each stage will:
- Open Copilot Chat automatically
- Copy the prompt to clipboard
- Wait for your confirmation before proceeding to next stage

Ready to begin sequential execution!`;

    await vscode.window.showInformationMessage(
      `🚀 Sequential Workflow Ready!\n\n${stages.length} stages will execute one by one.\nEach stage waits for Copilot completion before proceeding.\n\nTotal time: ~${totalTime} minutes`,
      { modal: true },
      'Start Sequential Execution'
    );

    this.log('🎯 Sequential workflow overview confirmed');
  }

  /**
   * Execute sequential stage with user confirmation
   */
  private async executeSequentialStage(
    epicKey: string,
    stage: AnalysisStage,
    prompt: GeneratedPrompt,
    stageNumber: number
  ): Promise<void> {
    this.log(`🔄 Executing sequential stage ${stageNumber}: ${stage.name}`);
    
    // Copy prompt to clipboard
    await vscode.env.clipboard.writeText(prompt.content);
    
    // Open Copilot Chat automatically
    await this.openCopilotChat();
    
    // Show stage start notification with flat timing
    vscode.window.showInformationMessage(
      `🤖 Stage ${stageNumber}/5: ${stage.name}\n\n✅ Prompt copied to clipboard\n🤖 Copilot Chat opened\n⏱️ Estimated duration: ~${stage.duration}\n\n📋 Paste the prompt in Copilot Chat and wait for response.\n🔔 Completion check will appear in 1 minute.`,
      { modal: false }
    );
    
         // Wait for user confirmation that stage is complete
     await this.waitForSequentialStageCompletion(stage, stageNumber);
    
    this.log(`✅ Sequential stage ${stageNumber} completed: ${stage.name}`);
  }

  /**
   * Wait for user confirmation that a sequential stage is complete
   */
  private async waitForSequentialStageCompletion(stage: AnalysisStage, stageNumber: number): Promise<void> {
    return new Promise<void>((resolve) => {
      // Show completion confirmation dialog
      const checkCompletion = async () => {
        const action = await vscode.window.showInformationMessage(
          `🔍 Stage ${stageNumber}: ${stage.name}\n\nHas Copilot completed the analysis?\n\n📋 Expected output:\n${stage.requiredDiagrams.map(d => `• ${d}`).join('\n')}\n\nConfirm completion to proceed to next stage.`,
          { modal: true },
          'Copilot Analysis Complete',
          'Still Working...',
          'Show Stage Help'
        );

        switch (action) {
          case 'Copilot Analysis Complete':
            this.log(`✅ User confirmed completion of stage ${stageNumber}: ${stage.name}`);
            resolve();
            break;
            
                     case 'Still Working...': {
             // Wait 1 minute before checking again
             const recheckMs = 60 * 1000; // 1 minute
             this.log(`⏱️ User still working, rechecking in 1 minute...`);
             setTimeout(checkCompletion, recheckMs);
             break;
           }
            
          case 'Show Stage Help':
            await this.showStageHelp(stage);
            // Check again after showing help
            setTimeout(checkCompletion, 2000);
            break;
            
          default:
            // User closed dialog - check again in 30 seconds
            setTimeout(checkCompletion, 30000);
            break;
        }
      };

             // Wait 1 minute before first completion check
       const checkIntervalMs = 60 * 1000; // 1 minute
       
       this.log(`⏱️ Waiting 1 minute before checking stage completion...`);
       setTimeout(checkCompletion, checkIntervalMs);
    });
  }

  /**
   * Finalize analysis and open results
   */
  private async finalizeAndOpenResults(epicKey: string, masterDocPath: string): Promise<void> {
    this.log(`🎉 Finalizing analysis for ${epicKey}`);
    
    // Generate completion summary
    await this.documentGenerator.generateCompletionSummary(epicKey, this.stages);
    
    // Open master analysis document
    await vscode.commands.executeCommand('vscode.open', vscode.Uri.file(masterDocPath));
    
    // Show completion message
    vscode.window.showInformationMessage(
      `🎉 Technical Analysis Complete!\n\n✅ 5 automated stages executed\n📁 Analysis document opened\n📋 All prompts documented\n\nReview the analysis and copy Copilot responses to complete the documentation.`,
      'Open Output Folder',
      'Show Documentation Guide'
    ).then(action => {
      if (action === 'Open Output Folder') {
        const outputDir = this.documentGenerator.getOutputDirectory(epicKey);
        vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(outputDir), true);
      } else if (action === 'Show Documentation Guide') {
        this.showDocumentationGuide(epicKey);
      }
    });
    
    this.log(`✅ Analysis finalized and results opened for ${epicKey}`);
  }

  /**
   * Show documentation guide for completing the analysis
   */
  private async showDocumentationGuide(epicKey: string): Promise<void> {
    const guide = `# 📋 Documentation Guide - ${epicKey}

## ✅ Automated Steps Completed

1. **✅ Analysis workspace created**
2. **✅ Master analysis document generated**
3. **✅ 5 technical prompts generated and documented**
4. **✅ Copilot Chat opened for each stage**
5. **✅ Prompts copied to clipboard automatically**

## 📝 Manual Steps to Complete

### For Each Stage:
1. **Review the prompt** in the analysis document
2. **Copy Copilot's response** from Copilot Chat  
3. **Paste the response** in the designated section
4. **Verify diagrams** are present and properly formatted
5. **Move to next stage**

### Completion Checklist:
- [ ] Requirements Analysis response added
- [ ] Design Overview response added  
- [ ] Technical Design response added
- [ ] Infrastructure & NFR response added
- [ ] Task Breakdown response added

## 🎯 Quality Standards

Each stage should include:
- **Specific to your codebase** - References actual files, patterns, architecture
- **Required Mermaid diagrams** - As specified in each prompt
- **Technical depth** - Principal Engineer level analysis
- **Implementation ready** - Actionable technical guidance

## 📊 Expected Results

- **Requirements**: Clear understanding with dependencies
- **Design**: High-level concept with core architecture  
- **Technical**: DB changes, APIs, business logic specific to your codebase
- **Infrastructure**: CI/CD, testing, performance, backward compatibility
- **Tasks**: Jira-ready tasks with acceptance criteria

Your technical analysis is ready for completion!`;

    const doc = await vscode.workspace.openTextDocument({
      content: guide,
      language: 'markdown'
    });
    await vscode.window.showTextDocument(doc);
  }

  /**
   * Create analysis template file with comprehensive structure
   */
  private async createAnalysisTemplate(epicKey: string, prompt: GeneratedPrompt): Promise<string> {
    this.log('📝 Creating comprehensive analysis template...');
    return await this.documentGenerator.createComprehensiveTemplate(epicKey, prompt);
  }

  /**
   * Execute streamlined workflow - auto-open Copilot and files
   */
  private async executeStreamlinedWorkflow(
    epicKey: string,
    prompt: GeneratedPrompt,
    templatePath: string,
    progress: vscode.Progress<{ increment?: number; message?: string }>
  ): Promise<void> {
    // Copy prompt to clipboard
    await vscode.env.clipboard.writeText(prompt.content);
    
    // Open template file
    await vscode.commands.executeCommand('vscode.open', vscode.Uri.file(templatePath));
    
    // Open Copilot Chat
    await this.openCopilotChat();
    
    // Show streamlined guidance
    vscode.window.showInformationMessage(
      `🚀 Streamlined Workflow Ready!\n\n✅ Prompt copied to clipboard\n📁 Template file opened\n🤖 Copilot Chat opened\n\n➡️ Next: Paste prompt in Copilot Chat and wait for comprehensive response!`,
      'Got it!'
    );
    
    progress.report({ increment: 60, message: '🚀 Ready for Copilot analysis!' });
  }

  /**
   * Show guidance when prompt is copied
   */
  private async showPromptCopiedGuidance(epicKey: string, templatePath: string): Promise<void> {
    const action = await vscode.window.showInformationMessage(
      `📋 Comprehensive prompt copied to clipboard!\n\nNext steps:\n1. Open GitHub Copilot Chat\n2. Paste the prompt\n3. Copy response to template file\n\nWould you like me to open the files for you?`,
      'Open Template File',
      'Open Copilot Chat',
      'Open Both',
      'I\'ll handle it'
    );

    switch (action) {
      case 'Open Template File':
        await vscode.commands.executeCommand('vscode.open', vscode.Uri.file(templatePath));
        break;
      case 'Open Copilot Chat':
        await this.openCopilotChat();
        break;
      case 'Open Both':
        await vscode.commands.executeCommand('vscode.open', vscode.Uri.file(templatePath));
        await this.openCopilotChat();
        break;
    }
  }

  /**
   * Show comprehensive analysis plan
   */
  private async showAnalysisPlan(epicKey: string, prompt: GeneratedPrompt): Promise<void> {
    const planContent = `# Comprehensive Analysis Plan - ${epicKey}

## 📋 Analysis Overview
This single comprehensive prompt covers all 5 analysis areas in one structured request:

### 🔍 Analysis Sections Covered:
1. **📊 Business Analysis** - User impact, business value & stakeholder analysis
2. **🏗️ Technical Architecture** - System design, components & data flow  
3. **💡 Implementation Design** - Code structure, APIs & database schema
4. **🗺️ Development Plan** - Sprint planning, timeline & team workflow
5. **⚠️ Risk Assessment** - Risk identification & mitigation strategies

### 🎯 Expected Output:
- **Comprehensive analysis** covering all business and technical aspects
- **Mermaid diagrams** for visualization (12+ diagrams expected)
- **Implementation roadmap** with timelines and milestones
- **Risk assessment** with mitigation strategies
- **Structured sections** ready for team consumption

### 💡 Benefits of Single-Prompt Approach:
- ✅ **Seamless workflow** - One interaction instead of 5
- ✅ **Consistent analysis** - No context loss between stages  
- ✅ **Comprehensive view** - All aspects considered together
- ✅ **Faster execution** - Complete in ~8-10 minutes vs 40+ minutes

### 📏 Prompt Size: 
- **Length**: ~${prompt.content.length} characters
- **Estimated Copilot time**: 8-10 minutes for comprehensive response

Ready to proceed with this comprehensive approach?`;

    const doc = await vscode.workspace.openTextDocument({
      content: planContent,
      language: 'markdown'
    });
    await vscode.window.showTextDocument(doc);
  }

  /**
   * Show guidance for manual workflow
   */
  private async showManualWorkflowGuidance(epicKey: string, templatePath: string): Promise<void> {
    vscode.window.showInformationMessage(
      `📁 Analysis files created for ${epicKey}\n\nYou can work at your own pace:\n• Template file is ready for responses\n• Use "Open Analysis Result" to access files\n• Use "Copy Prompt to Clipboard" if needed`,
      'Open Template File',
      'Open Output Folder'
    ).then(action => {
      if (action === 'Open Template File') {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.file(templatePath));
      } else if (action === 'Open Output Folder') {
        const outputDir = this.documentGenerator.getOutputDirectory(epicKey);
        vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(outputDir), true);
      }
    });
  }

  /**
   * Get analysis progress for external monitoring
   */
  getStages(): AnalysisStage[] {
    return [...this.stages];
  }

  /**
   * VS Code specific: Log to output channel
   */
  private log(message: string): void {
    this.outputChannel.appendLine(message);
    console.log(message);
  }

  /**
   * Show output channel
   */
  showOutput(): void {
    this.outputChannel.show();
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    this.outputChannel.dispose();
    this.promptGenerator.dispose();
    this.documentGenerator.dispose();
  }
} 