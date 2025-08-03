/**
 * AI Product Owner Agent - VS Code Extension Entry Point
 *
 * Professional VS Code extension providing automated technical analysis for Jira epics
 * and universal codebase analysis across multiple programming languages with GitHub Copilot integration.
 *
 * Supported Languages: JavaScript, TypeScript, Python, Java, Go, C#, PHP, Ruby, Rust
 *
 * @version 1.0.3
 * @author AI Product Owner Team
 */

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { JiraClient } from './jira/JiraClient';
import { CodebaseAnalyzer } from './analyzer/CodebaseAnalyzer';
import { MultiStageAnalysisEngine } from './analysis/MultiStageAnalysisEngine';
import { ConfigurationManager } from './utils/ConfigurationManager';
import { ErrorHandler, ErrorContext } from './utils/ErrorHandler';
import { WelcomeManager } from './utils/WelcomeManager';
import { ExtensionState } from './types';
import { QuickActionsProvider } from './utils/QuickActionsProvider';

/**
 * Extension state management for VS Code context and UI updates
 */
class ExtensionStateManager {
  private static instance: ExtensionStateManager;
  private state: ExtensionState;
  private context: vscode.ExtensionContext;
  public activeAnalysisEngine: any = null; // Reference to active analysis engine for cancellation

  private constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.state = {
      configured: false,
      analyzing: false,
      hasResults: false,
      analysisResults: [],
    };
    this.updateContextKeys();
  }

  /**
   * Singleton pattern implementation for state management
   */
  static getInstance(context?: vscode.ExtensionContext): ExtensionStateManager {
    if (!ExtensionStateManager.instance && context) {
      ExtensionStateManager.instance = new ExtensionStateManager(context);
    }
    return ExtensionStateManager.instance;
  }

  /**
   * Update extension state and VS Code context keys
   */
  updateState(updates: Partial<ExtensionState>): void {
    this.state = { ...this.state, ...updates };
    this.updateContextKeys();
  }

  getState(): ExtensionState {
    return this.state;
  }

  private updateContextKeys(): void {
    vscode.commands.executeCommand(
      'setContext',
      'aiProductOwner.configured',
      this.state.configured
    );
    vscode.commands.executeCommand('setContext', 'aiProductOwner.analyzing', this.state.analyzing);
    vscode.commands.executeCommand(
      'setContext',
      'aiProductOwner.hasResults',
      this.state.hasResults
    );
  }
}

/**
 * Main extension activation function
 */
export async function activate(context: vscode.ExtensionContext) {
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

  // Register Quick Actions Tree Data Provider
  const quickActionsProvider = new QuickActionsProvider();
  context.subscriptions.push(
    vscode.window.registerTreeDataProvider('quickActions', quickActionsProvider)
  );

  // Register configuration change listener
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration('aiProductOwner')) {
        checkInitialConfiguration(stateManager, configManager);
      }
    })
  );

  // Initialize welcome manager and show walkthrough for first-time users
  const welcomeManager = WelcomeManager.getInstance(context);
  await welcomeManager.handleActivation();

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
        timestamp: new Date(),
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
            if (error.message.includes('source files') || error.message.includes('codebase')) {
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

  // Complete current stage and continue command
  const completeStageCommand = vscode.commands.registerCommand(
    'aiProductOwner.completeStage',
    async () => {
      try {
        if (
          stateManager.activeAnalysisEngine &&
          typeof stateManager.activeAnalysisEngine.proceedToNextStage === 'function'
        ) {
          await stateManager.activeAnalysisEngine.proceedToNextStage();
        } else {
          vscode.window
            .showInformationMessage(
              'No active analysis workflow. Start an analysis first.',
              'Start Analysis'
            )
            .then(action => {
              if (action === 'Start Analysis') {
                vscode.commands.executeCommand('aiProductOwner.analyzeEpic');
              }
            });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        vscode.window.showErrorMessage(`Failed to progress stage: ${errorMessage}`);
      }
    }
  );

  // Open result command - now works without parameters
  // Remove the openResultCommand registration and handler
  // Remove any references to 'aiProductOwner.openResult' in the manual stage progression and elsewhere
  // In the manual stage progression, remove the 'View Current Results' option and its case
  // In the context.subscriptions, remove openResultCommand

  // Additional UX commands
  const openWalkthroughCommand = vscode.commands.registerCommand(
    'aiProductOwner.openWalkthrough',
    async () => {
      const welcomeManager = WelcomeManager.getInstance(context);
      await welcomeManager.forceShowWalkthrough();
    }
  );

  const testConnectionCommand = vscode.commands.registerCommand(
    'aiProductOwner.testConnection',
    async () => {
      const errorContext: ErrorContext = {
        operation: 'Test Connection',
        timestamp: new Date(),
      };

      try {
        await ErrorHandler.showProgressWithCancellation(
          'Testing Jira Connection',
          async (
            progress: vscode.Progress<{ message?: string; increment?: number }>,
            token: vscode.CancellationToken
          ) => {
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







  // Register cancel analysis command
  const cancelAnalysisCommand = vscode.commands.registerCommand(
    'aiProductOwner.cancelAnalysis',
    async () => {
      // Route to the active analysis engine instance
      if (
        stateManager.activeAnalysisEngine &&
        typeof stateManager.activeAnalysisEngine.cancelAnalysis === 'function'
      ) {
        const confirmCancel = await vscode.window.showWarningMessage(
          '⚠️ Cancel the current analysis workflow?\n\nThis will stop all remaining stages.',
          'Yes, Cancel Analysis',
          'No, Continue Analysis'
        );

        if (confirmCancel === 'Yes, Cancel Analysis') {
          stateManager.activeAnalysisEngine.cancelAnalysis();
          vscode.window.showInformationMessage('🛑 Analysis workflow cancelled');
        }
      } else {
        vscode.window.showInformationMessage('No active analysis workflow to cancel.');
      }
    }
  );





  // Add all commands to subscriptions
  context.subscriptions.push(
    analyzeEpicCommand,
    configureSettingsCommand,
    openWalkthroughCommand,
    testConnectionCommand,
    cancelAnalysisCommand,
    completeStageCommand
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
    vscode.window
      .showWarningMessage(
        'AI Product Owner Agent needs configuration. Click to set up Jira credentials.',
        'Configure Now'
      )
      .then(selection => {
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
    currentEpic: epicKey,
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
      lastAnalysis: new Date().toISOString(),
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

    // Check if this was a user cancellation - don't show error for cancellations
    if (errorMessage.includes('cancelled by user') || errorMessage.includes('Analysis cancelled')) {
      console.log(`ℹ️ Analysis cancelled for ${epicKey}`);
      return; // Exit gracefully without error message
    }

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
    ignoreFocusOut: true,
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
  // Initialize state manager to check for cancellation
  const stateManager = ExtensionStateManager.getInstance();

  // Check if there's an active analysis engine that's already cancelled
  if (stateManager.activeAnalysisEngine && stateManager.activeAnalysisEngine.isCancelled()) {
    throw new Error('Analysis cancelled by user');
  }

  // EXACT PORT from Python PoC workflow

  // Stage 1: Initialize Jira client (0-10%)
  progress.report({ increment: 10, message: 'Initializing Jira client...' });

  const jiraClient = new JiraClient(jiraConfig);
  jiraClient.showOutput(); // Show output channel for detailed logging

  try {
    // Stage 2: Fetch data directly (10-50%) - Skip connection test to avoid notifications
    progress.report({ increment: 40, message: `Fetching ${epicKey} data...` });

    // Check for cancellation before data fetch
    if (stateManager.activeAnalysisEngine && stateManager.activeAnalysisEngine.isCancelled()) {
      throw new Error('Analysis cancelled by user');
    }

    const jiraData = await jiraClient.fetchPortfolioOrEpic(epicKey);
    if (!jiraData) {
      jiraClient.showOutput(); // Show output for troubleshooting
      throw new Error(`❌ ${epicKey} not found or not accessible. Check output panel for details.`);
    }

    // Stage 3: Analyze codebase (50-70%)
    progress.report({ increment: 20, message: 'Analyzing universal codebase...' });

    // Check for cancellation before codebase analysis
    if (stateManager.activeAnalysisEngine && stateManager.activeAnalysisEngine.isCancelled()) {
      throw new Error('Analysis cancelled by user');
    }

    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
      throw new Error('❌ No workspace folder found. Please open a project.');
    }

    const codebaseAnalyzer = new CodebaseAnalyzer();
    const codebaseData = await codebaseAnalyzer.analyzeCodebase();

    // Stage 4: Run interactive analysis workflow (70-100%)
    progress.report({ increment: 5, message: 'Starting interactive analysis workflow...' });

    const analysisEngine = new MultiStageAnalysisEngine();

    // Register as active analysis engine for command routing
    stateManager.activeAnalysisEngine = analysisEngine;

    try {
      // Run the interactive analysis workflow
      await analysisEngine.executeAnalysis(epicKey, jiraData, codebaseData);

      // Show success message only after successful completion
      const totalStories = jiraData.epics.reduce((sum, epic) => sum + epic.stories.length, 0);
      const totalPoints = jiraData.totalStoryPoints;
      const totalFiles = codebaseData.totalFiles;

      // Display completion message only on success
      vscode.window
        .showInformationMessage(
          `🎉 Interactive analysis workflow completed! Epic: ${epicKey} | Analysis: ${totalStories} stories (${totalPoints} points) + ${totalFiles} files`,
          'Show Output',
          'Open Output Folder'
        )
        .then(selection => {
          if (selection === 'Show Output') {
            // Show the output channel instead
            vscode.commands.executeCommand('workbench.action.output.toggleOutput');
          } else if (selection === 'Open Output Folder') {
            const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
            const outputDir = workspaceFolder
              ? path.join(workspaceFolder.uri.fsPath, 'ai-analysis-output', epicKey)
              : configManager.getOutputConfiguration().directory;
            vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(outputDir), true);
          }
        });
    } catch (error) {
      // Check if this was a user cancellation - handle gracefully
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      if (errorMessage.includes('cancelled by user') || errorMessage.includes('Analysis cancelled')) {
        console.log(`ℹ️ Analysis cancelled for ${epicKey}`);
        // Don't throw error for cancellations - let parent handle gracefully
        throw error;
      }
      // Re-throw other errors
      throw error;
    } finally {
      // Clear active analysis engine when done
      stateManager.activeAnalysisEngine = null;
    }

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
    'Open Settings JSON',
  ];

  const selection = await vscode.window.showQuickPick(options, {
    placeHolder: 'Select configuration to modify',
    ignoreFocusOut: true,
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
    validateInput: value => {
      if (!value) {
        return 'Jira URL is required';
      }
      if (value.includes('http://') || value.includes('https://')) {
        return 'Enter domain only (without http:// or https://)';
      }
      return null;
    },
  });

  if (!baseUrl) {
    return;
  }

  // Get email
  const email = await vscode.window.showInputBox({
    prompt: 'Enter your Jira email address',
    value: config.get('email', ''),
    placeHolder: 'your.email@company.com',
    ignoreFocusOut: true,
    validateInput: value => {
      if (!value) {
        return 'Email is required';
      }
      if (!value.includes('@')) {
        return 'Please enter a valid email address';
      }
      return null;
    },
  });

  if (!email) {
    return;
  }

  // Get API token with security notice
  const tokenInfo = await vscode.window.showInformationMessage(
    'You need a Jira API token. Generate one at: https://id.atlassian.com/manage-profile/security/api-tokens',
    'I have a token',
    'Open token page'
  );

  if (tokenInfo === 'Open token page') {
    await vscode.env.openExternal(
      vscode.Uri.parse('https://id.atlassian.com/manage-profile/security/api-tokens')
    );
    return;
  }

  if (tokenInfo !== 'I have a token') {
    return;
  }

  const token = await vscode.window.showInputBox({
    prompt: 'Enter your Jira API token',
    password: true,
    ignoreFocusOut: true,
    validateInput: value => {
      if (!value) {
        return 'API token is required';
      }
      if (value.length < 10) {
        return 'API token seems too short';
      }
      return null;
    },
  });

  if (!token) {
    return;
  }

  // Save configuration
  await config.update('baseUrl', baseUrl, vscode.ConfigurationTarget.Global);
  await config.update('email', email, vscode.ConfigurationTarget.Global);
  await config.update('token', token, vscode.ConfigurationTarget.Global);

  // Test the connection
  const testResult = await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Testing Jira connection...',
      cancellable: false,
    },
    async () => {
      const jiraClient = new JiraClient({ baseUrl, email, token, timeout: 10000 });
      return await jiraClient.testConnection();
    }
  );

  if (testResult) {
    vscode.window.showInformationMessage('✅ Jira configuration saved and tested successfully!');

    // Update extension state
    const stateManager = ExtensionStateManager.getInstance();
    stateManager.updateState({ configured: true });
  } else {
    vscode.window.showErrorMessage(
      '❌ Jira connection test failed. Please check your credentials.'
    );
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
    vscode.window
      .showInformationMessage(
        'No analysis results to refresh. Run an epic analysis first.',
        'Run Analysis'
      )
      .then(action => {
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
    { name: 'stages', label: 'Stage Files' },
  ];

  // Check which files exist
  const availableFiles = possibleFiles.filter(file => {
    const filePath = path.join(outputDir, file.name);
    return fs.existsSync(filePath);
  });

  if (availableFiles.length === 0) {
    vscode.window
      .showInformationMessage(
        `No analysis files found for ${state.currentEpic}. The analysis may not have completed successfully.`,
        'Open Output Folder',
        'Restart Analysis'
      )
      .then(action => {
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
    filePath: path.join(outputDir, file.name),
  }));

  quickPickItems.push({
    label: '📁 Open Output Folder',
    description: 'Open entire analysis folder',
    filePath: outputDir,
  });

  const selection = await vscode.window.showQuickPick(quickPickItems, {
    placeHolder: `Select analysis document to open (${state.currentEpic})`,
    ignoreFocusOut: true,
  });

  if (!selection) {
    return;
  }

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