/**
 * Quick Actions Tree Data Provider for VS Code Sidebar
 *
 * Provides a user-friendly tree view with quick access to main extension features:
 * - Analyze Epic: Trigger full codebase analysis
 * - Configure Settings: Open extension settings
 * - Test Connection: Verify Jira connectivity
 * - Complete Stage: Manually complete current analysis stage
 * - Show Welcome: Display getting started guide
 *
 * @version 1.0.0
 * @author AI Product Owner Team
 */

import * as vscode from 'vscode';

/**
 * Quick action item for the tree view
 */
export class QuickActionItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly description: string,
    public readonly command: vscode.Command,
    public readonly iconPath: vscode.ThemeIcon,
    public readonly tooltip?: string
  ) {
    super(label, vscode.TreeItemCollapsibleState.None);

    this.command = command;
    this.iconPath = iconPath;
    this.tooltip = tooltip || description;
    this.description = description;
    this.contextValue = 'quickAction';
  }
}

/**
 * Tree Data Provider for Quick Actions view
 */
export class QuickActionsProvider implements vscode.TreeDataProvider<QuickActionItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<QuickActionItem | undefined | null | void> =
    new vscode.EventEmitter<QuickActionItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<QuickActionItem | undefined | null | void> =
    this._onDidChangeTreeData.event;

  constructor() {}

  /**
   * Refresh the tree view
   */
  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  /**
   * Get tree item representation
   */
  getTreeItem(element: QuickActionItem): vscode.TreeItem {
    return element;
  }

  /**
   * Get children (root level items in this case)
   */
  getChildren(element?: QuickActionItem): Promise<QuickActionItem[]> {
    if (!element) {
      // Return root level items
      return Promise.resolve(this.getQuickActions());
    }
    return Promise.resolve([]);
  }

  /**
   * Get the list of quick actions available to the user
   */
  private getQuickActions(): QuickActionItem[] {
    const actions: QuickActionItem[] = [
      new QuickActionItem(
        'Analyze Epic',
        'Analyze Jira epic and codebase',
        {
          command: 'epicBridge.analyzeEpic',
          title: 'Analyze Epic',
        },
        new vscode.ThemeIcon('graph'),
        'Analyze a Jira epic and universal codebase across 9 programming languages to generate technical documentation'
      ),

      new QuickActionItem(
        'Configure Settings',
        'Setup Jira and extension settings',
        {
          command: 'epicBridge.configureSettings',
          title: 'Configure Settings',
        },
        new vscode.ThemeIcon('settings-gear'),
        'Configure Jira connection settings and extension preferences'
      ),

      new QuickActionItem(
        'Test Connection',
        'Verify Jira connectivity',
        {
          command: 'epicBridge.testConnection',
          title: 'Test Jira Connection',
        },
        new vscode.ThemeIcon('plug'),
        'Test your Jira connection to ensure proper authentication and accessibility'
      ),

      new QuickActionItem(
        'Complete Stage',
        'Manually complete current analysis stage',
        {
          command: 'epicBridge.completeStage',
          title: 'Complete Current Stage',
        },
        new vscode.ThemeIcon('check'),
        'Manually mark the current analysis stage as complete and proceed to the next stage'
      ),

      new QuickActionItem(
        'Show Welcome',
        'Display getting started guide',
        {
          command: 'epicBridge.openWalkthrough',
          title: 'Show Welcome Walkthrough',
        },
        new vscode.ThemeIcon('lightbulb'),
        'Show the welcome walkthrough with setup instructions and usage guide'
      ),
    ];

    return actions;
  }
}
