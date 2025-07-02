/**
 * AI Product Owner Agent - VS Code Extension Entry Point
 * Integrates Jira epic analysis with Go codebase analysis to generate comprehensive technical documentation
 */

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { JiraClient } from './jira/JiraClient';
import { GoCodebaseAnalyzer } from './analyzer/GoCodebaseAnalyzer';
import { MultiStageAnalysisEngine } from './analysis/MultiStageAnalysisEngine';
import { ConfigurationManager } from './utils/ConfigurationManager';
import { ErrorHandler, ErrorContext } from './utils/ErrorHandler';
import { 
  ExtensionState, 
  JiraPortfolio, 
  CodebaseAnalysis, 
  AnalysisProgress,
  ProcessingStatus 
} from './types';

/**
 * Extension state management
 */
class ExtensionStateManager {
  private static instance: ExtensionStateManager;
  private state: ExtensionState;
  private context: vscode.ExtensionContext;
  public activeAnalysisEngine: any = null; // Store reference to active analysis engine

  private constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.state = {
      configured: false,
      analyzing: false,
      hasResults: false,
      analysisResults: []
    };
    this.updateContextKeys();
  }

  static getInstance(context?: vscode.ExtensionContext): ExtensionStateManager {
    if (!ExtensionStateManager.instance && context) {
      ExtensionStateManager.instance = new ExtensionStateManager(context);
    }
    return ExtensionStateManager.instance;
  }

  updateState(updates: Partial<ExtensionState>): void {
    this.state = { ...this.state, ...updates };
    this.updateContextKeys();
  }

  getState(): ExtensionState {
    return this.state;
  }

  private updateContextKeys(): void {
    vscode.commands.executeCommand('setContext', 'aiProductOwner.configured', this.state.configured);
    vscode.commands.executeCommand('setContext', 'aiProductOwner.analyzing', this.state.analyzing);
    vscode.commands.executeCommand('setContext', 'aiProductOwner.hasResults', this.state.hasResults);
  }
}

/**
 * Main extension activation function
 */
export function activate(context: vscode.ExtensionContext) {
  console.log('🚀 AI Product Owner Agent extension is now active!');

  // Initialize error handler and status management
  ErrorHandler.initialize(context);

  // Initialize extension state
  const stateManager = ExtensionStateManager.getInstance(context);
  const configManager = new ConfigurationManager();
  
  // Check initial configuration
  checkInitialConfiguration(stateManager, configManager);

  // Register commands
  registerCommands(context, stateManager, configManager);

  // Register configuration change listener
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration('aiProductOwner')) {
        checkInitialConfiguration(stateManager, configManager);
      }
    })
  );

  // Show welcome walkthrough for first-time users
  ErrorHandler.showWelcomeWalkthrough(context);

  console.log('✅ AI Product Owner Agent extension activated successfully');
}

/**
 * Extension deactivation function
 */
export function deactivate() {
  console.log('👋 AI Product Owner Agent extension deactivated');
  
  // Cleanup resources
  ErrorHandler.dispose();
}

/**
 * Register all extension commands
 */
function registerCommands(
  context: vscode.ExtensionContext, 
  stateManager: ExtensionStateManager,
  configManager: ConfigurationManager
) {
  // Main analysis command with comprehensive error handling
  const analyzeEpicCommand = vscode.commands.registerCommand(
    'aiProductOwner.analyzeEpic',
    async () => {
      const context: ErrorContext = {
        operation: 'Epic Analysis',
        timestamp: new Date()
      };

      try {
        await runEpicAnalysisWorkflow(stateManager, configManager, context);
      } catch (error) {
        console.error('Epic analysis error:', error);
        
        // Use comprehensive error handling
        if (error && typeof error === 'object') {
          if ('status' in error || 'code' in error) {
            await ErrorHandler.handleJiraError(error, context);
          } else if ('message' in error && typeof error.message === 'string') {
            if (error.message.includes('Go files') || error.message.includes('codebase')) {
              await ErrorHandler.handleCodebaseError(error, context);
            } else if (error.message.includes('Copilot')) {
              await ErrorHandler.handleCopilotError(error, context);
            } else {
              const shouldRetry = await ErrorHandler.handleJiraError(error, context);
              if (shouldRetry) {
                vscode.commands.executeCommand('aiProductOwner.analyzeEpic');
              }
            }
          }
        } else {
          vscode.window.showErrorMessage(`❌ Epic Analysis Failed: ${String(error)}`);
        }
      }
    }
  );

  // Configuration command
  const configureSettingsCommand = vscode.commands.registerCommand(
    'aiProductOwner.configureSettings',
    async () => {
      try {
        await openConfigurationSettings(configManager);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        vscode.window.showErrorMessage(`Configuration Error: ${errorMessage}`);
      }
    }
  );

  // Refresh documentation command
  const refreshDocumentationCommand = vscode.commands.registerCommand(
    'aiProductOwner.refreshDocumentation',
    async () => {
      try {
        await refreshAnalysisDocumentation(stateManager);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        vscode.window.showErrorMessage(`Refresh Failed: ${errorMessage}`);
      }
    }
  );

  // Copy prompt command
  const copyPromptCommand = vscode.commands.registerCommand(
    'aiProductOwner.copyPrompt',
    async (prompt: string) => {
      try {
        await vscode.env.clipboard.writeText(prompt);
        vscode.window.showInformationMessage('✅ Prompt copied to clipboard');
      } catch (error) {
        vscode.window.showErrorMessage('❌ Failed to copy prompt to clipboard');
      }
    }
  );

  // Open result command - now works without parameters
  const openResultCommand = vscode.commands.registerCommand(
    'aiProductOwner.openResult',
    async (filePath?: string) => {
      try {
        const state = stateManager.getState();
        
        // If no file path provided, try to find the latest analysis results
        if (!filePath) {
          if (!state.currentEpic) {
            vscode.window.showInformationMessage('No analysis results found. Run an epic analysis first.');
            return;
          }
          
          // Try to find the output directory for the current epic
          const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
          if (workspaceFolder) {
            const outputDir = path.join(workspaceFolder.uri.fsPath, 'ai-analysis-output', state.currentEpic);
            const readmePath = path.join(outputDir, 'README.md');
            
            if (fs.existsSync(readmePath)) {
              filePath = readmePath;
            } else {
              // Show directory picker
              const action = await vscode.window.showInformationMessage(
                `No analysis results found for ${state.currentEpic}. What would you like to do?`,
                'Open Output Folder',
                'Run New Analysis'
              );
              
              if (action === 'Open Output Folder') {
                const uri = vscode.Uri.file(outputDir);
                await vscode.commands.executeCommand('vscode.openFolder', uri, { forceNewWindow: true });
              } else if (action === 'Run New Analysis') {
                await vscode.commands.executeCommand('aiProductOwner.analyzeEpic');
              }
              return;
            }
          }
        }
        
        if (filePath && fs.existsSync(filePath)) {
          const uri = vscode.Uri.file(filePath);
          await vscode.window.showTextDocument(uri);
        } else {
          vscode.window.showErrorMessage(`❌ File not found: ${filePath || 'undefined'}`);
        }
      } catch (error) {
        vscode.window.showErrorMessage(`❌ Failed to open analysis results: ${error}`);
      }
    }
  );

  // Additional UX commands
  const openWalkthroughCommand = vscode.commands.registerCommand(
    'aiProductOwner.openWalkthrough',
    async () => {
      await ErrorHandler.showWelcomeWalkthrough(context);
    }
  );

  const testConnectionCommand = vscode.commands.registerCommand(
    'aiProductOwner.testConnection',
    async () => {
      const errorContext: ErrorContext = {
        operation: 'Test Connection',
        timestamp: new Date()
      };

      try {
        await ErrorHandler.showProgressWithCancellation(
          'Testing Jira Connection',
          async (progress: vscode.Progress<{ message?: string; increment?: number }>, token: vscode.CancellationToken) => {
            progress.report({ increment: 0, message: 'Validating configuration...' });
            
            const config = configManager.getJiraConfiguration();
            if (!config.baseUrl || !config.email || !config.token) {
              throw new Error('Jira configuration is incomplete. Please configure settings first.');
            }

            progress.report({ increment: 30, message: 'Connecting to Jira...' });
            
            const jiraClient = new JiraClient(config);
            const isValid = await jiraClient.testConnection();
            
            progress.report({ increment: 100, message: 'Connection test complete' });
            
            if (isValid) {
              vscode.window.showInformationMessage('✅ Jira connection successful!');
            } else {
              throw new Error('Connection failed - check credentials and network');
            }
          }
        );
      } catch (error) {
        await ErrorHandler.handleJiraError(error, errorContext);
      }
    }
  );

  // Test Jira data fetch command
  const testJiraDataCommand = vscode.commands.registerCommand(
    'aiProductOwner.testJiraData',
    async () => {
      try {
        const epicKey = await getEpicKeyFromUser();
        if (!epicKey) return;

        const config = configManager.getJiraConfiguration();
        const jiraClient = new JiraClient(config);
        
        await vscode.window.withProgress({
          location: vscode.ProgressLocation.Notification,
          title: 'Fetching Jira Data',
          cancellable: false
        }, async (progress) => {
          progress.report({ increment: 50, message: `Fetching ${epicKey}...` });
          
          const jiraData = await jiraClient.fetchPortfolioOrEpic(epicKey);
          if (!jiraData) {
            throw new Error(`Epic ${epicKey} not found`);
          }

          progress.report({ increment: 100, message: 'Data fetched successfully' });

          // Show the data in a new document
          const dataDisplay = `# Jira Data for ${epicKey}

## Epic Overview
- **Key**: ${jiraData.key}
- **Name**: ${jiraData.name}
- **Type**: ${jiraData.type}
- **Description**: ${jiraData.description || 'No description'}
- **Total Story Points**: ${jiraData.totalStoryPoints}

## Epics (${jiraData.epics.length})
${jiraData.epics.map((epic, i) => `
${i + 1}. **${epic.key}**: ${epic.summary}
   - Status: ${epic.status}
   - Stories: ${epic.stories.length} (${epic.totalPoints} points)
   - Description: ${epic.description ? epic.description.substring(0, 100) + '...' : 'No description'}
`).join('')}

## Key Stories
${jiraData.epics.flatMap(epic => epic.stories)
  .filter(story => story.storyPoints && story.storyPoints > 0)
  .sort((a, b) => (b.storyPoints || 0) - (a.storyPoints || 0))
  .slice(0, 5)
  .map(story => `- **${story.key}** (${story.storyPoints} pts): ${story.summary}`)
  .join('\n')}

---
✅ **This data SHOULD be included in your analysis prompts!**
If you don't see this information in the generated prompts, there's a bug.`;

          const doc = await vscode.workspace.openTextDocument({
            content: dataDisplay,
            language: 'markdown'
          });
          await vscode.window.showTextDocument(doc);
          
          vscode.window.showInformationMessage(
            '✅ Jira data fetched successfully! This data should appear in your analysis prompts.',
            'Continue with Analysis'
          ).then(action => {
            if (action === 'Continue with Analysis') {
              vscode.commands.executeCommand('aiProductOwner.analyzeEpic');
            }
          });
        });
      } catch (error) {
        vscode.window.showErrorMessage(`❌ Failed to fetch Jira data: ${error}`);
      }
    }
  );

  // Manual stage progression command - now provides actual progression options
  const nextStageCommand = vscode.commands.registerCommand(
    'aiProductOwner.nextStage',
    async () => {
      const state = stateManager.getState();
      
      if (!state.currentEpic) {
        vscode.window.showInformationMessage(
          'No active analysis. Start an epic analysis first.',
          'Start Analysis'
        ).then(action => {
          if (action === 'Start Analysis') {
            vscode.commands.executeCommand('aiProductOwner.analyzeEpic');
          }
        });
        return;
      }

      const action = await vscode.window.showInformationMessage(
        `🔄 Manual Stage Progression for ${state.currentEpic}\n\nChoose your next action:`,
        'View Current Results',
        'Open Output Folder',  
        'Restart Analysis',
        'Skip to Summary'
      );

      switch (action) {
        case 'View Current Results':
          await vscode.commands.executeCommand('aiProductOwner.openResult');
          break;
        case 'Open Output Folder': {
          const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
          if (workspaceFolder) {
            const outputDir = path.join(workspaceFolder.uri.fsPath, 'ai-analysis-output', state.currentEpic);
            if (fs.existsSync(outputDir)) {
              const uri = vscode.Uri.file(outputDir);
              await vscode.commands.executeCommand('vscode.openFolder', uri, { forceNewWindow: true });
            } else {
              vscode.window.showWarningMessage(`Output directory not found: ${outputDir}`);
            }
          }
          break;
        }
        case 'Restart Analysis':
          await vscode.commands.executeCommand('aiProductOwner.analyzeEpic');
          break;
        case 'Skip to Summary':
          vscode.window.showInformationMessage(
            '📋 To manually create a summary:\n1. Navigate to your output folder\n2. Create SUMMARY.md\n3. Consolidate findings from all stage files',
            'Open Output Folder'
          ).then(response => {
            if (response === 'Open Output Folder') {
              vscode.commands.executeCommand('aiProductOwner.nextStage');
            }
          });
          break;
      }
    }
  );

  // Register proceedToNextStage command for MultiStageAnalysisEngine
  const proceedToNextStageCommand = vscode.commands.registerCommand(
    'aiProductOwner.proceedToNextStage',
    async () => {
      // Route to the active analysis engine instance
      if (stateManager.activeAnalysisEngine && 
          typeof stateManager.activeAnalysisEngine.proceedToNextStage === 'function') {
        await stateManager.activeAnalysisEngine.proceedToNextStage();
      } else {
        vscode.window.showInformationMessage(
          'No active analysis workflow. Start an analysis first.',
          'Start Analysis'
        ).then(action => {
          if (action === 'Start Analysis') {
            vscode.commands.executeCommand('aiProductOwner.analyzeEpic');
          }
        });
      }
    }
  );

		// Register the new paste Copilot response command
	context.subscriptions.push(
		vscode.commands.registerCommand('aiProductOwner.pasteCopilotResponse', async () => {
			await pasteCopilotResponse();
		})
	);

  // Add all commands to subscriptions
  context.subscriptions.push(
    analyzeEpicCommand,
    configureSettingsCommand,
    refreshDocumentationCommand,
    copyPromptCommand,
    openResultCommand,
    openWalkthroughCommand,
    testConnectionCommand,
    testJiraDataCommand,
    nextStageCommand,
    proceedToNextStageCommand
  );
}

/**
 * Check if extension is properly configured
 */
function checkInitialConfiguration(
  stateManager: ExtensionStateManager,
  configManager: ConfigurationManager
): void {
  const config = configManager.getJiraConfiguration();
  const isConfigured = !!(config.baseUrl && config.email && config.token);
  
  stateManager.updateState({ configured: isConfigured });

  if (!isConfigured) {
    vscode.window.showWarningMessage(
      'AI Product Owner Agent needs configuration. Click to set up Jira credentials.',
      'Configure Now'
    ).then(selection => {
      if (selection === 'Configure Now') {
        vscode.commands.executeCommand('aiProductOwner.configureSettings');
      }
    });
  }
}

/**
 * Main epic analysis workflow
 */
async function runEpicAnalysisWorkflow(
  stateManager: ExtensionStateManager,
  configManager: ConfigurationManager,
  errorContext: ErrorContext
): Promise<void> {
  // Validate configuration
  const config = configManager.getJiraConfiguration();
  if (!config.baseUrl || !config.email || !config.token) {
    vscode.window.showErrorMessage('Please configure Jira settings first');
    await vscode.commands.executeCommand('aiProductOwner.configureSettings');
    return;
  }

  // Get epic key from user
  const epicKey = await getEpicKeyFromUser();
  if (!epicKey) {
    return; // User cancelled
  }

  // Update state to analyzing
  stateManager.updateState({ 
    analyzing: true, 
    currentEpic: epicKey 
  });

  try {
    // Update error context with epic key
    errorContext.epicKey = epicKey;

    // Run the multi-stage analysis with enhanced progress tracking
    await ErrorHandler.showProgressWithSteps(
      'Running Full Analysis...',
      async (progress: vscode.Progress<{ message?: string; increment?: number }>) => {
        progress.report({ increment: 0, message: 'Starting analysis...' });
        await runMultiStageAnalysis(epicKey, config, configManager, progress, errorContext);
      }
    );

    // Update state with success
    stateManager.updateState({ 
      analyzing: false, 
      hasResults: true,
      lastAnalysis: new Date().toISOString()
    });

    // Show completion message with more options
    const action = await vscode.window.showInformationMessage(
      `🎉 Epic ${epicKey} analysis completed successfully!\n\nWhat would you like to do next?`,
      { modal: false },
      'View Results',
      'Open Output Folder',
      'Analyze Another Epic'
    );

    if (action === 'View Results') {
      await vscode.commands.executeCommand('aiProductOwner.refreshDocumentation');
    } else if (action === 'Open Output Folder') {
      const outputDir = configManager.getOutputConfiguration().directory;
      const uri = vscode.Uri.file(outputDir);
      await vscode.commands.executeCommand('vscode.openFolder', uri, { forceNewWindow: false });
    } else if (action === 'Analyze Another Epic') {
      await vscode.commands.executeCommand('aiProductOwner.analyzeEpic');
    }

  } catch (error) {
    // Update state with error
    stateManager.updateState({ analyzing: false });
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Analysis failed: ${errorMessage}`);
  }
}

/**
 * Get epic key from user input with validation
 */
async function getEpicKeyFromUser(): Promise<string | undefined> {
  const epicKey = await vscode.window.showInputBox({
    prompt: 'Enter Jira Epic Key (e.g., PROJ-123, BACKEND-456)',
    placeHolder: 'PROJ-123',
    validateInput: (value: string) => {
      if (!value) {
        return 'Epic key is required';
      }
      
      // Validate Jira key format (PROJECT-NUMBER)
      const jiraKeyPattern = /^[A-Z]([A-Z0-9])*-\d+$/;
      if (!jiraKeyPattern.test(value.trim().toUpperCase())) {
        return 'Please enter a valid Jira key format (e.g., PROJ-123)';
      }
      
      return null;
    },
    ignoreFocusOut: true
  });

  return epicKey?.trim().toUpperCase();
}

/**
 * Run the complete multi-stage analysis
 */
async function runMultiStageAnalysis(
  epicKey: string,
  jiraConfig: any,
  configManager: ConfigurationManager,
  progress: vscode.Progress<{ increment?: number; message?: string }>,
  errorContext: ErrorContext
): Promise<void> {
  // EXACT PORT from Python PoC workflow
  
  // Stage 1: Initialize Jira client (0-10%)
  progress.report({ increment: 10, message: 'Initializing Jira client...' });
  
  const jiraClient = new JiraClient(jiraConfig);
  jiraClient.showOutput(); // Show output channel for detailed logging
  
  try {
    // Stage 2: Test connection (10-25%)
    progress.report({ increment: 15, message: 'Testing Jira connection...' });
    
    const connectionValid = await jiraClient.testConnection();
    if (!connectionValid) {
      jiraClient.showOutput(); // Show output for troubleshooting
      throw new Error('❌ Jira connection failed. Check output panel for detailed error information.');
    }

    // Stage 3: Fetch data (25-50%)
    progress.report({ increment: 25, message: `Fetching ${epicKey} data...` });
    
    const jiraData = await jiraClient.fetchPortfolioOrEpic(epicKey);
    if (!jiraData) {
      jiraClient.showOutput(); // Show output for troubleshooting
      throw new Error(`❌ ${epicKey} not found or not accessible. Check output panel for details.`);
    }

    // Stage 4: Analyze codebase (50-70%)
    progress.report({ increment: 20, message: 'Analyzing Go codebase...' });
    
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
      throw new Error('❌ No workspace folder found. Please open a Go project.');
    }

         const codebaseAnalyzer = new GoCodebaseAnalyzer(workspaceFolder.uri.fsPath);
     const codebaseData = await codebaseAnalyzer.analyzeCodebase();

     // Stage 5: Run interactive analysis workflow (70-100%)
     progress.report({ increment: 5, message: 'Starting interactive analysis workflow...' });
     
     const analysisEngine = new MultiStageAnalysisEngine();
     
     // Register as active analysis engine for command routing
     const stateManager = ExtensionStateManager.getInstance();
     stateManager.activeAnalysisEngine = analysisEngine;
     
     try {
       // Run the interactive analysis workflow
       await analysisEngine.runFullAnalysis(epicKey, jiraData, codebaseData);
     } finally {
       // Clear active analysis engine when done
       stateManager.activeAnalysisEngine = null;
     }

    // Show success message with interactive workflow completion
    const totalStories = jiraData.epics.reduce((sum, epic) => sum + epic.stories.length, 0);
    const totalPoints = jiraData.totalStoryPoints;
    const totalFiles = codebaseData.totalFiles;

         // Display completion message
     vscode.window.showInformationMessage(
       `🎉 Interactive analysis workflow completed! Epic: ${epicKey} | Analysis: ${totalStories} stories (${totalPoints} points) + ${totalFiles} Go files`,
       'Show Output', 'Open Output Folder'
     ).then(selection => {
       if (selection === 'Show Output') {
         analysisEngine.showOutput();
               } else if (selection === 'Open Output Folder') {
          const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
          const outputDir = workspaceFolder ? 
            path.join(workspaceFolder.uri.fsPath, 'ai-analysis-output', epicKey) : 
            configManager.getOutputConfiguration().directory;
          vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(outputDir), true);
        }
     });

     // Clean up analysis engine
     analysisEngine.dispose();

  } finally {
    // Clean up resources
    jiraClient.dispose();
  }
}

/**
 * Open configuration settings UI
 */
async function openConfigurationSettings(configManager: ConfigurationManager): Promise<void> {
  const options = [
    'Configure Jira Settings',
    'Configure Output Settings', 
    'Configure Analysis Settings',
    'Open Settings JSON'
  ];

  const selection = await vscode.window.showQuickPick(options, {
    placeHolder: 'Select configuration to modify',
    ignoreFocusOut: true
  });

  switch (selection) {
    case 'Configure Jira Settings':
      await configureJiraSettings(configManager);
      break;
    case 'Configure Output Settings':
      await configureOutputSettings();
      break;
    case 'Configure Analysis Settings':
      await configureAnalysisSettings();
      break;
    case 'Open Settings JSON':
      await vscode.commands.executeCommand('workbench.action.openSettings2');
      break;
  }
}

/**
 * Configure Jira settings with guided setup
 */
async function configureJiraSettings(configManager: ConfigurationManager): Promise<void> {
  const config = vscode.workspace.getConfiguration('aiProductOwner.jira');

  // Get Jira URL
  const baseUrl = await vscode.window.showInputBox({
    prompt: 'Enter Jira Base URL (e.g., company.atlassian.net)',
    value: config.get('baseUrl', ''),
    placeHolder: 'company.atlassian.net',
    ignoreFocusOut: true,
    validateInput: (value) => {
      if (!value) return 'Jira URL is required';
      if (value.includes('http://') || value.includes('https://')) {
        return 'Enter domain only (without http:// or https://)';
      }
      return null;
    }
  });

  if (!baseUrl) return;

  // Get email
  const email = await vscode.window.showInputBox({
    prompt: 'Enter your Jira email address',
    value: config.get('email', ''),
    placeHolder: 'your.email@company.com',
    ignoreFocusOut: true,
    validateInput: (value) => {
      if (!value) return 'Email is required';
      if (!value.includes('@')) return 'Please enter a valid email address';
      return null;
    }
  });

  if (!email) return;

  // Get API token with security notice
  const tokenInfo = await vscode.window.showInformationMessage(
    'You need a Jira API token. Generate one at: https://id.atlassian.com/manage-profile/security/api-tokens',
    'I have a token',
    'Open token page'
  );

  if (tokenInfo === 'Open token page') {
    await vscode.env.openExternal(vscode.Uri.parse('https://id.atlassian.com/manage-profile/security/api-tokens'));
    return;
  }

  if (tokenInfo !== 'I have a token') return;

  const token = await vscode.window.showInputBox({
    prompt: 'Enter your Jira API token',
    password: true,
    ignoreFocusOut: true,
    validateInput: (value) => {
      if (!value) return 'API token is required';
      if (value.length < 10) return 'API token seems too short';
      return null;
    }
  });

  if (!token) return;

  // Save configuration
  await config.update('baseUrl', baseUrl, vscode.ConfigurationTarget.Global);
  await config.update('email', email, vscode.ConfigurationTarget.Global);
  await config.update('token', token, vscode.ConfigurationTarget.Global);

  // Test the connection
  const testResult = await vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    title: 'Testing Jira connection...',
    cancellable: false
  }, async () => {
    const jiraClient = new JiraClient({ baseUrl, email, token, timeout: 10000 });
    return await jiraClient.testConnection();
  });

  if (testResult) {
    vscode.window.showInformationMessage('✅ Jira configuration saved and tested successfully!');
    
    // Update extension state
    const stateManager = ExtensionStateManager.getInstance();
    stateManager.updateState({ configured: true });
  } else {
    vscode.window.showErrorMessage('❌ Jira connection test failed. Please check your credentials.');
  }
}

/**
 * Configure output settings
 */
async function configureOutputSettings(): Promise<void> {
  await vscode.commands.executeCommand('workbench.action.openSettings', 'aiProductOwner.output');
}

/**
 * Configure analysis settings
 */
async function configureAnalysisSettings(): Promise<void> {
  await vscode.commands.executeCommand('workbench.action.openSettings', 'aiProductOwner.analysis');
}

/**
 * Refresh and display analysis documentation
 */
async function refreshAnalysisDocumentation(stateManager: ExtensionStateManager): Promise<void> {
  const state = stateManager.getState();
  
  if (!state.currentEpic) {
    vscode.window.showInformationMessage(
      'No analysis results to refresh. Run an epic analysis first.',
      'Run Analysis'
    ).then(action => {
      if (action === 'Run Analysis') {
        vscode.commands.executeCommand('aiProductOwner.analyzeEpic');
      }
    });
    return;
  }

  // Try to find and open analysis documentation
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    vscode.window.showErrorMessage('No workspace folder found');
    return;
  }

  const outputDir = path.join(workspaceFolder.uri.fsPath, 'ai-analysis-output', state.currentEpic);
  const possibleFiles = [
    { name: 'README.md', label: 'Analysis Overview' },
    { name: 'SUMMARY.md', label: 'Analysis Summary' },
    { name: 'stages', label: 'Stage Files' }
  ];

  // Check which files exist
  const availableFiles = possibleFiles.filter(file => {
    const filePath = path.join(outputDir, file.name);
    return fs.existsSync(filePath);
  });

  if (availableFiles.length === 0) {
    vscode.window.showInformationMessage(
      `No analysis files found for ${state.currentEpic}. The analysis may not have completed successfully.`,
      'Open Output Folder',
      'Restart Analysis'
    ).then(action => {
      if (action === 'Open Output Folder') {
        const uri = vscode.Uri.file(outputDir);
        vscode.commands.executeCommand('vscode.openFolder', uri, { forceNewWindow: true });
      } else if (action === 'Restart Analysis') {
        vscode.commands.executeCommand('aiProductOwner.analyzeEpic');
      }
    });
    return;
  }

  // Show quick pick for available files
  const quickPickItems = availableFiles.map(file => ({
    label: file.label,
    description: file.name === 'stages' ? 'Open stages folder' : `Open ${file.name}`,
    filePath: path.join(outputDir, file.name)
  }));

  quickPickItems.push({
    label: '📁 Open Output Folder',
    description: 'Open entire analysis folder',
    filePath: outputDir
  });

  const selection = await vscode.window.showQuickPick(quickPickItems, {
    placeHolder: `Select analysis document to open (${state.currentEpic})`,
    ignoreFocusOut: true
  });

  if (!selection) return;

  try {
    if (selection.label === '📁 Open Output Folder' || selection.filePath.endsWith('stages')) {
      const uri = vscode.Uri.file(selection.filePath);
      await vscode.commands.executeCommand('vscode.openFolder', uri, { forceNewWindow: true });
    } else {
      const uri = vscode.Uri.file(selection.filePath);
      await vscode.window.showTextDocument(uri);
    }
    
    vscode.window.showInformationMessage(`📊 Opened ${selection.label} for ${state.currentEpic}`);
  } catch (error) {
    vscode.window.showErrorMessage(`❌ Failed to open ${selection.label}: ${error}`);
  }
}

/**
 * Error handling utility
 */
function handleError(error: unknown, context: string): never {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
  console.error(`${context}:`, error);
  throw new Error(`${context}: ${errorMessage}`);
}

/**
 * Help users paste Copilot responses into the correct section of TECHNICAL_ANALYSIS.md
 */
async function pasteCopilotResponse(): Promise<void> {
  try {
    // Find the TECHNICAL_ANALYSIS.md file in the current workspace
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
      vscode.window.showErrorMessage('No workspace folder found');
      return;
    }

    // Look for TECHNICAL_ANALYSIS.md files in ai-analysis-output folders
    const files = await vscode.workspace.findFiles('**/ai-analysis-output/*/TECHNICAL_ANALYSIS.md');
    
    if (files.length === 0) {
      vscode.window.showWarningMessage('No TECHNICAL_ANALYSIS.md files found. Please run the analysis first.');
      return;
    }

    let targetFile: vscode.Uri;
    if (files.length === 1) {
      targetFile = files[0];
    } else {
      // Let user choose which analysis file
      const fileItems = files.map(file => ({
        label: path.basename(path.dirname(file.fsPath)),
        description: file.fsPath,
        uri: file
      }));

      const selected = await vscode.window.showQuickPick(fileItems, {
        placeHolder: 'Select which analysis to update'
      });

      if (!selected) {
        return;
      }

      targetFile = selected.uri;
    }

    // Ask which stage they want to update
    const stages = [
      { label: 'Stage 1: Requirements Analysis', section: '## 📋 1. Requirements Analysis' },
      { label: 'Stage 2: Design Overview', section: '## 🎯 2. Design Overview' },
      { label: 'Stage 3: Detailed Technical Design', section: '## 🔧 3. Detailed Technical Design' },
      { label: 'Stage 4: Infrastructure & NFR', section: '## 🏗️ 4. Infrastructure & Non-Functional Requirements' },
      { label: 'Stage 5: Task Breakdown', section: '## 📝 5. Task Breakdown' }
    ];

    const selectedStage = await vscode.window.showQuickPick(stages, {
      placeHolder: 'Which stage response do you want to paste?'
    });

    if (!selectedStage) {
      return;
    }

    // Get Copilot response from clipboard
    const clipboardText = await vscode.env.clipboard.readText();
    if (!clipboardText.trim()) {
      vscode.window.showWarningMessage('Clipboard is empty. Please copy your Copilot response first.');
      return;
    }

    // Read the current file content
    const document = await vscode.workspace.openTextDocument(targetFile);
    const content = document.getText();

    // Find the section and replace the placeholder
    const sectionStart = content.indexOf(selectedStage.section);
    if (sectionStart === -1) {
      vscode.window.showErrorMessage(`Section "${selectedStage.section}" not found in the document`);
      return;
    }

		// Find the next section start or end of document
		const nextSectionPattern = /^## [\u{1f527}\u{1f3af}\u{1f4cb}\u{1f3d7}\u{1f4dd}] \d+\./gmu;
    nextSectionPattern.lastIndex = sectionStart + selectedStage.section.length;
    const nextSectionMatch = nextSectionPattern.exec(content);
    const sectionEnd = nextSectionMatch ? nextSectionMatch.index : content.length;

    // Extract the section content
    const sectionContent = content.substring(sectionStart, sectionEnd);

    // Find the Copilot Response section within this stage
    const responseStart = sectionContent.indexOf('### 🤖 Copilot Response');
    if (responseStart === -1) {
      vscode.window.showErrorMessage('Copilot Response section not found in the selected stage');
      return;
    }

    // Replace everything from "**Status**:" onwards in the Copilot Response section
    const statusPattern = /\*\*Status\*\*:.*$/ms;
    const updatedSectionContent = sectionContent.replace(statusPattern, `**Status**: ✅ Response completed

---

${clipboardText.trim()}

---`);

    // Replace the section in the full document
    const updatedContent = content.substring(0, sectionStart) + updatedSectionContent + content.substring(sectionEnd);

    // Apply the edit
    const edit = new vscode.WorkspaceEdit();
    edit.replace(targetFile, new vscode.Range(0, 0, document.lineCount, 0), updatedContent);
    
    const success = await vscode.workspace.applyEdit(edit);
    if (success) {
      vscode.window.showInformationMessage(`✅ ${selectedStage.label} response pasted successfully!`);
      
      // Open the file to show the update
      await vscode.window.showTextDocument(document);
    } else {
      vscode.window.showErrorMessage('Failed to update the document');
    }

  } catch (error: any) {
    vscode.window.showErrorMessage(`Failed to paste Copilot response: ${error.message}`);
  }
} 