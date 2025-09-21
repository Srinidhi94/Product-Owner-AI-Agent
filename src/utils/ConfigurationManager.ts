/**
 * Configuration Manager - Handles VS Code settings and secure storage
 * Manages Jira credentials and output directory settings
 */

import * as vscode from 'vscode';
import { ExtensionConfiguration, JiraConfiguration, OutputConfiguration } from '../types';

export class ConfigurationManager {
  private static readonly JIRA_TOKEN_KEY = 'epicBridge.jira.token';

  /**
   * Get complete extension configuration
   */
  getExtensionConfiguration(): ExtensionConfiguration {
    return {
      jira: this.getJiraConfiguration(),
      output: this.getOutputConfiguration(),
    };
  }

  /**
   * Get Jira configuration with secure token handling
   */
  getJiraConfiguration(): JiraConfiguration {
    const config = vscode.workspace.getConfiguration('epicBridge.jira');

    return {
      baseUrl: config.get('baseUrl', ''),
      email: config.get('email', ''),
      token: config.get('token', ''), // Will be moved to secure storage
      timeout: config.get('timeout', 10000),
    };
  }

  /**
   * Get output configuration
   */
  getOutputConfiguration(): OutputConfiguration {
    const config = vscode.workspace.getConfiguration('epicBridge.output');

    return {
      directory: config.get('directory', './docs/analysis'),
    };
  }

  /**
   * Update Jira configuration
   */
  async updateJiraConfiguration(updates: Partial<JiraConfiguration>): Promise<void> {
    const config = vscode.workspace.getConfiguration('epicBridge.jira');

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        await config.update(key, value, vscode.ConfigurationTarget.Global);
      }
    }
  }

  /**
   * Update output configuration
   */
  async updateOutputConfiguration(updates: Partial<OutputConfiguration>): Promise<void> {
    const config = vscode.workspace.getConfiguration('epicBridge.output');

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        await config.update(key, value, vscode.ConfigurationTarget.Workspace);
      }
    }
  }

  /**
   * Store Jira token securely
   */
  async storeJiraTokenSecurely(token: string): Promise<void> {
    const secrets = vscode.extensions.getExtension('your.extension')?.exports?.secrets;
    if (secrets) {
      await secrets.store(ConfigurationManager.JIRA_TOKEN_KEY, token);
    }
  }

  /**
   * Retrieve Jira token securely
   */
  async getJiraTokenSecurely(): Promise<string | undefined> {
    const secrets = vscode.extensions.getExtension('your.extension')?.exports?.secrets;
    if (secrets) {
      return await secrets.get(ConfigurationManager.JIRA_TOKEN_KEY);
    }
    return undefined;
  }

  /**
   * Validate configuration completeness
   */
  validateConfiguration(): { isValid: boolean; errors: string[] } {
    const config = this.getExtensionConfiguration();
    const errors: string[] = [];

    // Validate Jira configuration
    if (!config.jira.baseUrl) {
      errors.push('Jira base URL is required');
    }
    if (!config.jira.email) {
      errors.push('Jira email is required');
    }
    if (!config.jira.token) {
      errors.push('Jira API token is required');
    }

    // Validate output configuration
    if (!config.output.directory) {
      errors.push('Output directory is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get configuration summary for logging/debugging
   */
  getConfigurationSummary(): string {
    const jiraConfig = this.getJiraConfiguration();
    const outputConfig = this.getOutputConfiguration();

    return `
AI Product Owner Configuration:
- Jira URL: ${jiraConfig.baseUrl || 'Not configured'}
- Jira Email: ${jiraConfig.email || 'Not configured'}
- Jira Token: ${jiraConfig.token ? 'Configured' : 'Not configured'}
- Output Directory: ${outputConfig.directory}
`.trim();
  }

  /**
   * Reset all configuration to defaults
   */
  async resetConfiguration(): Promise<void> {
    const jiraConfig = vscode.workspace.getConfiguration('epicBridge.jira');
    const outputConfig = vscode.workspace.getConfiguration('epicBridge.output');

    // Reset Jira configuration
    await jiraConfig.update('baseUrl', undefined, vscode.ConfigurationTarget.Global);
    await jiraConfig.update('email', undefined, vscode.ConfigurationTarget.Global);
    await jiraConfig.update('token', undefined, vscode.ConfigurationTarget.Global);
    await jiraConfig.update('timeout', undefined, vscode.ConfigurationTarget.Global);

    // Reset output configuration
    await outputConfig.update('directory', undefined, vscode.ConfigurationTarget.Workspace);
  }
}
