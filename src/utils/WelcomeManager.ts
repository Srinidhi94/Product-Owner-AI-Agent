/**
 * Welcome Manager for Epic Bridge
 * Handles first-time user experience and onboarding walkthrough
 */

import * as vscode from 'vscode';
import { createLogger } from './Logger';

export interface WelcomeState {
  hasSeenWalkthrough: boolean;
  version: string;
  firstActivation: string;
  lastActivation: string;
  activationCount: number;
}

export class WelcomeManager {
  private static instance: WelcomeManager;
  private context: vscode.ExtensionContext;
  private logger = createLogger('WelcomeManager');
  private readonly CURRENT_VERSION = '1.0.0';
  private readonly STATE_KEY = 'epicBridge.welcomeState';

  private constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  static getInstance(context: vscode.ExtensionContext): WelcomeManager {
    if (!WelcomeManager.instance) {
      WelcomeManager.instance = new WelcomeManager(context);
    }
    return WelcomeManager.instance;
  }

  /**
   * Handle extension activation and show welcome if needed
   */
  async handleActivation(): Promise<void> {
    const state = this.getWelcomeState();
    const isFirstTime = !state.hasSeenWalkthrough;
    const isNewVersion = state.version !== this.CURRENT_VERSION;

    // Update activation tracking
    state.lastActivation = new Date().toISOString();
    state.activationCount += 1;
    state.version = this.CURRENT_VERSION;

    // Save updated state
    this.saveWelcomeState(state);

    this.logger.info(`Extension activated (${state.activationCount} times)`, {
      isFirstTime,
      isNewVersion,
      version: this.CURRENT_VERSION,
    });

    // Show welcome for first-time users or new version
    if (isFirstTime) {
      await this.showFirstTimeWelcome();
    } else if (isNewVersion) {
      await this.showVersionUpdateWelcome();
    }
  }

  /**
   * Show first-time user welcome
   */
  async showFirstTimeWelcome(): Promise<void> {
    this.logger.info('Showing first-time welcome');

    const action = await vscode.window.showInformationMessage(
      '🎉 Welcome to Epic Bridge!\n\nThis extension helps you analyze Jira epics and universal codebases across 9 programming languages to generate comprehensive technical documentation.',
      { modal: false },
      'Get Started',
      'Show Walkthrough',
      'Configure Now',
      'Later'
    );

    switch (action) {
      case 'Get Started':
        await this.showQuickStart();
        break;
      case 'Show Walkthrough':
        await this.showWalkthrough();
        break;
      case 'Configure Now':
        await vscode.commands.executeCommand('epicBridge.configureSettings');
        break;
      case 'Later':
      default:
        // User can always access these later via command palette
        vscode.window.showInformationMessage(
          'You can always access the walkthrough via "AI Product Owner: Show Welcome Walkthrough" command.',
          'Got it!'
        );
        break;
    }

    // Mark as seen
    const state = this.getWelcomeState();
    state.hasSeenWalkthrough = true;
    this.saveWelcomeState(state);
  }

  /**
   * Show version update welcome
   */
  async showVersionUpdateWelcome(): Promise<void> {
    this.logger.info('Showing version update welcome');

    const action = await vscode.window.showInformationMessage(
      `🆕 Epic Bridge updated to v${this.CURRENT_VERSION}!\n\nCheck out the latest improvements and features.`,
      "What's New",
      'Documentation',
      'Dismiss'
    );

    switch (action) {
      case "What's New":
        await this.showChangeLog();
        break;
      case 'Documentation':
        await this.openDocumentation();
        break;
    }
  }

  /**
   * Show interactive walkthrough
   */
  async showWalkthrough(): Promise<void> {
    this.logger.info('Starting interactive walkthrough');

    // Create walkthrough document
    const walkthroughContent = this.createWalkthroughContent();

    const doc = await vscode.workspace.openTextDocument({
      content: walkthroughContent,
      language: 'markdown',
    });

    await vscode.window.showTextDocument(doc, {
      viewColumn: vscode.ViewColumn.One,
      preview: false,
    });

    // Show interactive steps
    await this.showWalkthroughSteps();
  }

  /**
   * Show quick start guide
   */
  async showQuickStart(): Promise<void> {
    const steps = [
      {
        title: 'Step 1: Configure Jira Settings',
        description: 'Set up your Jira URL, email, and API token',
        action: 'Configure',
        command: 'epicBridge.configureSettings',
      },
      {
        title: 'Step 2: Test Connection',
        description: 'Verify your Jira connection is working',
        action: 'Test',
        command: 'epicBridge.testConnection',
      },
      {
        title: 'Step 3: Analyze an Epic',
        description: 'Run your first analysis on a Jira epic',
        action: 'Analyze',
        command: 'epicBridge.analyzeEpic',
      },
    ];

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const isLast = i === steps.length - 1;

      const action = await vscode.window.showInformationMessage(
        `${step.title}\n\n${step.description}`,
        { modal: true },
        step.action,
        isLast ? 'Finish' : 'Next',
        'Skip'
      );

      if (action === step.action) {
        await vscode.commands.executeCommand(step.command);
      } else if (action === 'Skip') {
        break;
      }
      // Continue to next step if 'Next' or 'Finish'
    }

    vscode.window.showInformationMessage(
      "✅ Quick start completed! You're ready to use Epic Bridge.",
      'Great!'
    );
  }

  /**
   * Force show walkthrough (for command)
   */
  async forceShowWalkthrough(): Promise<void> {
    this.logger.info('Force showing walkthrough via command');
    await this.showWalkthrough();
  }

  /**
   * Reset welcome state (for testing/debugging)
   */
  async resetWelcomeState(): Promise<void> {
    await this.context.globalState.update(this.STATE_KEY, undefined);
    this.logger.info('Welcome state reset');

    vscode.window
      .showInformationMessage(
        'Welcome state has been reset. The walkthrough will show on next activation.',
        'Restart Extension'
      )
      .then(action => {
        if (action === 'Restart Extension') {
          vscode.commands.executeCommand('workbench.action.reloadWindow');
        }
      });
  }

  /**
   * Check if user needs configuration
   */
  needsConfiguration(): boolean {
    const config = vscode.workspace.getConfiguration('epicBridge.jira');
    return !config.get('baseUrl') || !config.get('email') || !config.get('token');
  }

  /**
   * Get welcome state from storage
   */
  private getWelcomeState(): WelcomeState {
    const saved = this.context.globalState.get<WelcomeState>(this.STATE_KEY);

    return {
      hasSeenWalkthrough: saved?.hasSeenWalkthrough || false,
      version: saved?.version || '0.0.0',
      firstActivation: saved?.firstActivation || new Date().toISOString(),
      lastActivation: saved?.lastActivation || new Date().toISOString(),
      activationCount: saved?.activationCount || 0,
    };
  }

  /**
   * Save welcome state to storage
   */
  private saveWelcomeState(state: WelcomeState): void {
    this.context.globalState.update(this.STATE_KEY, state);
  }

  /**
   * Create walkthrough content
   */
  private createWalkthroughContent(): string {
    return `# 🎯 Epic Bridge - Interactive Walkthrough

Welcome to Epic Bridge! This walkthrough will help you get started with analyzing Jira epics and generating technical documentation.

## 🚀 What This Extension Does

The Epic Bridge is a powerful VS Code extension that:

- **Analyzes Jira Epics**: Fetches comprehensive data from your Jira epics and stories
- **Scans Universal Codebases**: Identifies architectural patterns, tech stack, and code structure across 9 programming languages
- **Generates Context-Rich Prompts**: Creates detailed prompts with context engineering frames for AI analysis
- **Produces Technical Documentation**: Creates comprehensive analysis documents with structured context

## 📋 5-Stage Analysis Process

The extension guides you through a structured role-based analysis workflow:

1. **Product Requirements Analysis** - Senior Product Manager perspective with business value assessment
2. **System Architecture Design** - Principal Engineer (Architecture) with scalability focus
3. **Technical Design Specification** - Principal Engineer (Technical) with detailed API/DB design
4. **Implementation & Deployment Strategy** - Principal Engineer (Implementation) with CI/CD planning
5. **Sprint Planning & Jira Breakdown** - Product Owner with actionable sprint tasks

## 📁 Generated Files

Each analysis creates these files in your configured output directory:

- **README.md** - Overview and navigation guide for the analysis
- **PROMPTS.md** - All generated prompts for each analysis stage  
- **ANALYSIS.md** - Your AI responses and analysis results
- **CONTEXT.md** - Structured context engineering frame for LLM grounding

## 🔧 Getting Started

### Step 1: Configure Jira Settings
\`\`\`
Command: "AI Product Owner: Configure Settings"
Required: Jira URL, Email, API Token
\`\`\`

### Step 2: Test Your Connection
\`\`\`
Command: "AI Product Owner: Test Jira Connection"
Verifies: Authentication and access permissions
\`\`\`

### Step 3: Run Your First Analysis
\`\`\`
Command: "AI Product Owner: Analyze Epic"
Input: Epic key (e.g., PROJ-123)
Output: 5 detailed analysis prompts
\`\`\`

## 🎯 Key Features

- **Context Engineering**: Structured grounding frames to reduce AI hallucinations
- **Anti-Hallucination Guardrails**: Explicit citation requirements and ROI justification
- **Visual Diagrams**: Mermaid diagrams for architecture and workflows  
- **Progressive Context**: Each stage builds on previous analysis results
- **Enterprise-Ready**: Professional documentation for stakeholder presentations

## 🛠️ Troubleshooting

### Common Issues
- **401/403 Errors**: Check API token validity and permissions
- **No Workspace Found**: Please open a project folder before running analysis
- **Epic Not Found**: Verify epic key and access permissions
- **Slow Performance**: Large codebases are automatically optimized

### Need Help?
- Use \`AI Product Owner: Test Connection\` to diagnose issues
- Check the Output panel for detailed logs
- Enable verbose logging in settings for debugging

## 🎉 You're Ready!

Click the buttons below to start using the extension:

---

*This walkthrough will remain open for reference. You can always access it via the Command Palette.*`;
  }

  /**
   * Show interactive walkthrough steps
   */
  private async showWalkthroughSteps(): Promise<void> {
    const steps = [
      'Open Command Palette (Ctrl+Shift+P)',
      'Type "AI Product Owner" to see available commands',
      'Start with "Configure Settings" to set up Jira credentials',
      'Use "Test Connection" to verify your Jira setup',
      'Ensure you have a project folder open in VS Code',
      'Run "Analyze Epic" with your epic key (e.g., PROJ-123)',
      'Review generated prompts in PROMPTS.md and copy to your AI',
      'Use "Open Output Folder" to access all generated files',
    ];

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const isLast = i === steps.length - 1;

      await vscode.window.showInformationMessage(
        `Walkthrough Step ${i + 1}/${steps.length}\n\n${step}`,
        { modal: false },
        isLast ? 'Finish Walkthrough' : 'Next Step'
      );
    }
  }

  /**
   * Show changelog
   */
  private async showChangeLog(): Promise<void> {
    // This would typically read from CHANGELOG.md
    const changelogContent = `# What's New in v${this.CURRENT_VERSION}

## ✨ New Features
- Enhanced error handling with user-friendly messages
- Improved performance monitoring and logging
- Better credential management and configuration
- More comprehensive test coverage

## 🔧 Improvements  
- Faster codebase analysis for large projects
- Better memory management
- Enhanced progress tracking
- Improved documentation generation

## 🐛 Bug Fixes
- Fixed command palette descriptions
- Resolved credential persistence issues
- Improved VS Code integration
- Better error recovery

## 🚀 Performance
- Reduced memory usage by 30%
- Faster Jira API calls
- Optimized file scanning
- Better caching mechanisms`;

    const doc = await vscode.workspace.openTextDocument({
      content: changelogContent,
      language: 'markdown',
    });

    await vscode.window.showTextDocument(doc);
  }

  /**
   * Open documentation
   */
  private async openDocumentation(): Promise<void> {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

    if (workspaceFolder) {
      const docsPath = vscode.Uri.joinPath(workspaceFolder.uri, 'docs', 'USER_GUIDE.md');

      try {
        await vscode.window.showTextDocument(docsPath);
      } catch {
        // Fallback to README if USER_GUIDE not found
        const readmePath = vscode.Uri.joinPath(workspaceFolder.uri, 'README.md');
        try {
          await vscode.window.showTextDocument(readmePath);
        } catch {
          vscode.window.showInformationMessage(
            'Documentation not found in current workspace. Please open the extension workspace.',
            'Got it'
          );
        }
      }
    } else {
      vscode.window.showInformationMessage(
        'No workspace open. Please open the Epic Bridge workspace to view documentation.',
        'Got it'
      );
    }
  }
}

/**
 * Convenience function to get welcome manager instance
 */
export const getWelcomeManager = (context: vscode.ExtensionContext): WelcomeManager => {
  return WelcomeManager.getInstance(context);
};
