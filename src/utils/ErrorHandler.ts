/**
 * Comprehensive Error Handler - Graceful Error Management for AI Product Owner
 * Provides user-friendly error messages with actionable guidance
 */

import * as vscode from 'vscode';

export interface ErrorContext {
  operation: string;
  epicKey?: string;
  stage?: string;
  timestamp: Date;
  retryCount?: number;
}

export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  exponentialBase: number;
}

export class ErrorHandler {
  private static outputChannel: vscode.OutputChannel;

  /**
   * Initialize error handler with output channel
   */
  static initialize(context: vscode.ExtensionContext): void {
    this.outputChannel = vscode.window.createOutputChannel('AI Product Owner - Error Handler');
  }

  /**
   * Handle Jira connection and API errors
   */
  static async handleJiraError(error: any, context: ErrorContext): Promise<boolean> {
    const errorCode = error.status || error.code;
    const errorMessage = error.message || 'Unknown Jira error';

    this.logError('Jira Error', error, context);

    switch (errorCode) {
      case 401:
      case 403:
        return await this.handleAuthenticationError(error, context);

      case 404:
        return await this.handleNotFoundError(error, context);

      case 429:
        return await this.handleRateLimitError(error, context);

      case 'ENOTFOUND':
      case 'ECONNREFUSED':
      case 'ETIMEDOUT':
        return await this.handleNetworkError(error, context);

      default:
        return await this.handleGenericJiraError(error, context);
    }
  }

  /**
   * Handle authentication errors (401/403)
   */
  private static async handleAuthenticationError(
    error: any,
    context: ErrorContext
  ): Promise<boolean> {
    const action = await vscode.window.showInformationMessage(
      `🔐 Jira configuration is incomplete or invalid.\n\nPlease configure your Jira settings in the extension settings.`,
      'Open Settings'
    );

    if (action === 'Open Settings') {
      await vscode.commands.executeCommand('epicBridge.configureSettings');
    }

    return false;
  }

  /**
   * Handle not found errors (404)
   */
  private static async handleNotFoundError(error: any, context: ErrorContext): Promise<boolean> {
    const epicKey = context.epicKey || 'the requested epic';

    const action = await vscode.window.showErrorMessage(
      `🔍 Epic "${epicKey}" not found during ${context.operation}.\n\nPossible causes:\n• Epic key is incorrect\n• You don't have permission to view this epic\n• Epic is in a different Jira project`,
      { modal: true },
      'Check Epic Key',
      'Check Permissions',
      'Try Another Epic',
      'Cancel'
    );

    switch (action) {
      case 'Check Epic Key': {
        const newEpicKey = await vscode.window.showInputBox({
          prompt: 'Enter the correct epic key',
          value: epicKey === 'the requested epic' ? '' : epicKey,
          placeHolder: 'e.g., PROJ-123',
          validateInput: value => {
            if (!value) {
              return 'Epic key is required';
            }
            if (!/^[A-Z]+-\d+$/i.test(value)) {
              return 'Epic key format: PROJECT-NUMBER';
            }
            return null;
          },
        });
        return !!newEpicKey;
      }

      case 'Check Permissions':
        await vscode.window
          .showInformationMessage(
            '🔒 Permission Troubleshooting:\n\n• Ensure you have "Browse Projects" permission\n• Check if the epic is in a restricted project\n• Verify you can access the epic in Jira web interface',
            'Open Jira'
          )
          .then(result => {
            if (result === 'Open Jira') {
              this.openJiraInBrowser();
            }
          });
        return false;

      case 'Try Another Epic':
        await vscode.commands.executeCommand('epicBridge.analyzeEpic');
        return true;

      default:
        return false;
    }
  }

  /**
   * Handle rate limit errors (429)
   */
  private static async handleRateLimitError(error: any, context: ErrorContext): Promise<boolean> {
    const retryAfter = this.extractRetryAfter(error);
    const waitTime = retryAfter || 60; // Default to 60 seconds

    const action = await vscode.window.showWarningMessage(
      `⏳ Jira API rate limit exceeded during ${context.operation}.\n\nPlease wait ${waitTime} seconds before retrying.`,
      { modal: true },
      'Wait and Retry',
      'Cancel'
    );

    if (action === 'Wait and Retry') {
      return await this.waitAndRetry(waitTime, context.operation);
    }

    return false;
  }

  /**
   * Handle network errors
   */
  private static async handleNetworkError(error: any, context: ErrorContext): Promise<boolean> {
    await vscode.window.showInformationMessage(
      `🌐 Network error during ${context.operation}.\n\nPlease check your internet connection and ensure you can access your Jira instance.`,
      'OK'
    );

    return false;
  }

  /**
   * Handle generic Jira errors
   */
  private static async handleGenericJiraError(error: any, context: ErrorContext): Promise<boolean> {
    await vscode.window.showInformationMessage(
      `❌ Jira error during ${context.operation}.\n\nPlease check your Jira configuration and ensure the service is accessible.`,
      'OK'
    );

    return false;
  }

  /**
   * Handle codebase analysis errors
   */
  static async handleCodebaseError(error: any, context: ErrorContext): Promise<boolean> {
    this.logError('Codebase Analysis Error', error, context);

    if (error.message?.includes('No Go files found')) {
      return await this.handleNoGoFilesError(context);
    }

    if (error.message?.includes('timeout') || error.message?.includes('too many files')) {
      return await this.handleLargeCodebaseError(context);
    }

    if (error.code === 'EACCES' || error.code === 'EPERM') {
      return await this.handleFilePermissionError(error, context);
    }

    return await this.handleGenericCodebaseError(error, context);
  }

  /**
   * Handle no Go files found error
   */
  private static async handleNoGoFilesError(context: ErrorContext): Promise<boolean> {
    const action = await vscode.window.showWarningMessage(
      `📁 No source files found in the current workspace.\n\n• Ensure you have a project open\n• Check that source files exist in the workspace\n• Verify the correct folder is opened in VS Code\n• Supported languages: JavaScript, TypeScript, Python, Java, Go, C#, PHP, Ruby, Rust`,
      { modal: true },
      'Open Folder',
      'Check Workspace',
      'Continue Anyway',
      'Cancel'
    );

    switch (action) {
      case 'Open Folder':
        await vscode.commands.executeCommand('vscode.openFolder');
        return false;

      case 'Check Workspace':
        await this.showWorkspaceInfo();
        return false;

      case 'Continue Anyway':
        vscode.window.showInformationMessage(
          '⚠️ Continuing without codebase analysis. Analysis will be limited to Jira data only.'
        );
        return true;

      default:
        return false;
    }
  }

  /**
   * Handle large codebase timeout
   */
  private static async handleLargeCodebaseError(context: ErrorContext): Promise<boolean> {
    const action = await vscode.window.showWarningMessage(
      `⏱️ Codebase analysis timed out or found too many files.\n\nOptions:\n• Limit analysis scope to specific folders\n• Exclude large dependencies\n• Continue with partial analysis`,
      { modal: true },
      'Limit Scope',
      'Exclude Dependencies',
      'Partial Analysis',
      'Cancel'
    );

    switch (action) {
      case 'Limit Scope':
        await this.configureScopeLimit();
        return true;

      case 'Exclude Dependencies':
        await this.configureExclusions();
        return true;

      case 'Partial Analysis':
        vscode.window.showInformationMessage('⚠️ Continuing with partial codebase analysis.');
        return true;

      default:
        return false;
    }
  }

  /**
   * Handle file permission errors
   */
  private static async handleFilePermissionError(
    error: any,
    context: ErrorContext
  ): Promise<boolean> {
    const action = await vscode.window.showErrorMessage(
      `🔒 File permission error during codebase analysis.\n\nError: ${error.message}\n\n• Check file/folder permissions\n• Run VS Code with appropriate privileges\n• Exclude problematic directories`,
      { modal: true },
      'Check Permissions',
      'Exclude Directory',
      'Continue',
      'Cancel'
    );

    switch (action) {
      case 'Check Permissions':
        await this.showPermissionHelp();
        return false;

      case 'Exclude Directory':
        await this.configureExclusions();
        return true;

      case 'Continue':
        return true;

      default:
        return false;
    }
  }

  /**
   * Handle generic codebase errors
   */
  private static async handleGenericCodebaseError(
    error: any,
    context: ErrorContext
  ): Promise<boolean> {
    const action = await vscode.window.showErrorMessage(
      `❌ Codebase analysis failed during ${context.operation}.\n\nError: ${error.message}`,
      { modal: true },
      'Retry',
      'Skip Codebase',
      'Show Details',
      'Cancel'
    );

    switch (action) {
      case 'Retry':
        return true;

      case 'Skip Codebase':
        vscode.window.showInformationMessage(
          '⚠️ Skipping codebase analysis. Analysis will use Jira data only.'
        );
        return true;

      case 'Show Details':
        this.showErrorDetails(error, context);
        return false;

      default:
        return false;
    }
  }

  /**
   * Handle Copilot integration issues
   */
  static async handleCopilotError(error: any, context: ErrorContext): Promise<boolean> {
    this.logError('Copilot Integration Error', error, context);

    const action = await vscode.window.showWarningMessage(
      `🤖 GitHub Copilot integration issue during ${context.operation}.\n\n• Copilot extension might not be installed\n• Copilot might not be activated\n• Chat window might not be available`,
      { modal: true },
      'Manual Copy/Paste',
      'Install Copilot',
      'Check Status',
      'Cancel'
    );

    switch (action) {
      case 'Manual Copy/Paste':
        await vscode.window.showInformationMessage(
          '📋 Manual Workflow:\n\n1. Prompts are already copied to clipboard\n2. Open Copilot Chat manually (Ctrl+Shift+P → "GitHub Copilot: Open Chat")\n3. Paste the prompt and proceed\n4. Return to the extension when ready',
          'Continue'
        );
        return true;

      case 'Install Copilot':
        await vscode.commands.executeCommand('workbench.extensions.search', 'GitHub.copilot');
        return false;

      case 'Check Status':
        await this.checkCopilotStatus();
        return false;

      default:
        return false;
    }
  }

  /**
   * Log detailed error information
   */
  private static logError(category: string, error: any, context: ErrorContext): void {
    const timestamp = new Date().toISOString();
    const logEntry = `
[${timestamp}] ${category}
Operation: ${context.operation}
Epic: ${context.epicKey || 'N/A'}
Stage: ${context.stage || 'N/A'}
Error: ${error.message || 'Unknown error'}
Stack: ${error.stack || 'No stack trace'}
Context: ${JSON.stringify(context, null, 2)}
---`;

    this.outputChannel.appendLine(logEntry);
    console.error(`${category}:`, error, context);
  }

  /**
   * Retry with exponential backoff
   */
  private static async retryWithExponentialBackoff(
    context: ErrorContext,
    config: RetryConfig
  ): Promise<boolean> {
    const retryCount = context.retryCount || 0;

    if (retryCount >= config.maxRetries) {
      vscode.window.showErrorMessage(
        `❌ Maximum retry attempts (${config.maxRetries}) exceeded for ${context.operation}.`
      );
      return false;
    }

    const delay = Math.min(
      config.baseDelay * Math.pow(config.exponentialBase, retryCount),
      config.maxDelay
    );

    const shouldRetry = await vscode.window.showInformationMessage(
      `⏳ Retrying ${context.operation} in ${delay / 1000} seconds... (Attempt ${retryCount + 1}/${
        config.maxRetries
      })`,
      'Cancel Retry'
    );

    if (shouldRetry === 'Cancel Retry') {
      return false;
    }

    await this.delay(delay);
    return true;
  }

  /**
   * Wait and retry after rate limit
   */
  private static async waitAndRetry(waitTimeSeconds: number, operation: string): Promise<boolean> {
    return new Promise(resolve => {
      let remainingTime = waitTimeSeconds;

      const countdownInterval = setInterval(() => {
        if (remainingTime <= 0) {
          clearInterval(countdownInterval);
          resolve(true);
          return;
        }

        remainingTime--;
      }, 1000);
    });
  }

  /**
   * Test Jira connection
   */
  private static async testJiraConnection(): Promise<boolean> {
    try {
      vscode.window.showInformationMessage('🔄 Testing Jira connection...');
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Helper utility methods
   */
  private static extractRetryAfter(error: any): number | null {
    const retryAfter = error.headers?.['retry-after'] || error.retryAfter;
    return retryAfter ? parseInt(retryAfter, 10) : null;
  }

  private static async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private static openJiraInBrowser(): void {
    vscode.window.showInformationMessage('Please open Jira in your browser to verify access.');
  }

  private static showErrorDetails(error: any, context: ErrorContext): void {
    const details = `Error Details:
- Operation: ${context.operation}
- Epic: ${context.epicKey || 'N/A'}
- Stage: ${context.stage || 'N/A'}
- Error: ${error.message}
- Code: ${error.status || error.code || 'Unknown'}
- Timestamp: ${context.timestamp.toISOString()}`;

    vscode.workspace
      .openTextDocument({
        content: details,
        language: 'plaintext',
      })
      .then(doc => {
        vscode.window.showTextDocument(doc);
      });
  }

  private static async reportIssue(error: any, context: ErrorContext): Promise<void> {
    const issueUrl = 'https://github.com/your-repo/ai-product-owner/issues/new';
    await vscode.env.openExternal(vscode.Uri.parse(issueUrl));
  }

  private static async showWorkspaceInfo(): Promise<void> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    const info =
      workspaceFolders?.map(folder => `- ${folder.name}: ${folder.uri.fsPath}`).join('\n') ||
      'No workspace folders';

    const content = `Workspace Information:
${info}

Troubleshooting:
1. Ensure you have opened a folder containing Go files
2. Check that .go files exist in the workspace
3. Verify VS Code has read permissions`;

    const doc = await vscode.workspace.openTextDocument({
      content,
      language: 'plaintext',
    });
    await vscode.window.showTextDocument(doc);
  }

  private static async configureScopeLimit(): Promise<void> {
    vscode.window.showInformationMessage('🔧 Scope limiting configuration coming soon...');
  }

  private static async configureExclusions(): Promise<void> {
    vscode.window.showInformationMessage('🔧 Exclusion configuration coming soon...');
  }

  private static async showPermissionHelp(): Promise<void> {
    const helpContent = `File Permission Troubleshooting:

1. Check folder permissions:
   - Ensure VS Code can read the workspace folder
   - Run 'ls -la' in terminal to check permissions

2. For macOS/Linux:
   - chmod -R 755 /path/to/workspace

3. For Windows:
   - Right-click folder → Properties → Security
   - Ensure your user has Full Control

4. Restart VS Code if permissions were changed`;

    const doc = await vscode.workspace.openTextDocument({
      content: helpContent,
      language: 'plaintext',
    });
    await vscode.window.showTextDocument(doc);
  }

  private static async checkNetworkConnectivity(): Promise<void> {
    vscode.window.showInformationMessage(
      '🌐 Network connectivity check:\n• Verify internet connection\n• Check corporate firewall settings\n• Try accessing Jira in browser'
    );
  }

  private static async checkCopilotStatus(): Promise<void> {
    try {
      const extensions = vscode.extensions.all;
      const copilotExt = extensions.find(ext => ext.id === 'GitHub.copilot');

      if (!copilotExt) {
        vscode.window.showWarningMessage('GitHub Copilot extension is not installed.');
      } else if (!copilotExt.isActive) {
        vscode.window.showWarningMessage('GitHub Copilot extension is installed but not active.');
      } else {
        vscode.window.showInformationMessage('✅ GitHub Copilot extension is active.');
      }
    } catch (error) {
      vscode.window.showErrorMessage('Could not check Copilot status.');
    }
  }

  /**
   * Show welcome walkthrough for first-time users
   */
  static async showWelcomeWalkthrough(context: vscode.ExtensionContext): Promise<void> {
    const hasShownWelcome = context.globalState.get('hasShownWelcome', false);

    if (!hasShownWelcome) {
      const action = await vscode.window.showInformationMessage(
        '🚀 Welcome to Epic Bridge!\n\nWould you like a quick walkthrough to get started?',
        'Start Walkthrough',
        'Configure Now',
        'Skip'
      );

      if (action === 'Start Walkthrough') {
        await this.runWalkthrough();
      } else if (action === 'Configure Now') {
        await vscode.commands.executeCommand('epicBridge.configureSettings');
      }

      await context.globalState.update('hasShownWelcome', true);
    }
  }

  private static async runWalkthrough(): Promise<void> {
    const steps = [
      'Configure Jira credentials',
      'Open a Go workspace',
      'Run epic analysis',
      'Use interactive prompts',
      'Review generated documentation',
    ];

    vscode.window
      .showInformationMessage(
        `📋 Epic Bridge Walkthrough:\n\n${steps
          .map((step, i) => `${i + 1}. ${step}`)
          .join('\n')}\n\nReady to start?`,
        'Configure Jira'
      )
      .then(action => {
        if (action === 'Configure Jira') {
          vscode.commands.executeCommand('epicBridge.configureSettings');
        }
      });
  }

  /**
   * Cleanup resources
   */
  static dispose(): void {
    this.outputChannel?.dispose();
  }

  /**
   * Show progress with cancellation support
   */
  static async showProgressWithCancellation<T>(
    title: string,
    task: (
      progress: vscode.Progress<{ message?: string; increment?: number }>,
      token: vscode.CancellationToken
    ) => Promise<T>
  ): Promise<T> {
    return await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title,
        cancellable: true,
      },
      (progress, token) => Promise.resolve(task(progress, token))
    );
  }

  /**
   * Show progress with steps (no cancellation)
   */
  static async showProgressWithSteps<T>(
    title: string,
    task: (progress: vscode.Progress<{ message?: string; increment?: number }>) => Promise<T>
  ): Promise<T> {
    return await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title,
        cancellable: false,
      },
      progress => Promise.resolve(task(progress))
    );
  }
}
