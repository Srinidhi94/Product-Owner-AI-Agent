/**
 * Configuration Manager - Handles VS Code settings and secure storage
 * Manages Jira credentials, output settings, and analysis configuration
 */

import * as vscode from 'vscode';
import { 
  ExtensionConfiguration, 
  JiraConfiguration, 
  OutputConfiguration, 
  AnalysisConfiguration,
  CodebaseConfiguration 
} from '../types';

export class ConfigurationManager {
  private static readonly JIRA_TOKEN_KEY = 'aiProductOwner.jira.token';

  /**
   * Get complete extension configuration
   */
  getExtensionConfiguration(): ExtensionConfiguration {
    return {
      jira: this.getJiraConfiguration(),
      output: this.getOutputConfiguration(),
      analysis: this.getAnalysisConfiguration(),
      codebase: this.getCodebaseConfiguration()
    };
  }

  /**
   * Get Jira configuration with secure token handling
   */
  getJiraConfiguration(): JiraConfiguration {
    const config = vscode.workspace.getConfiguration('aiProductOwner.jira');
    
    return {
      baseUrl: config.get('baseUrl', ''),
      email: config.get('email', ''),
      token: config.get('token', ''), // Will be moved to secure storage
      timeout: config.get('timeout', 10000)
    };
  }

  /**
   * Get output configuration
   */
  getOutputConfiguration(): OutputConfiguration {
    const config = vscode.workspace.getConfiguration('aiProductOwner.output');
    
    return {
      directory: config.get('directory', './docs/analysis'),
      generateDiagrams: config.get('generateDiagrams', true),
      format: config.get('format', 'markdown'),
      includeRawData: config.get('includeRawData', false)
    };
  }

  /**
   * Get analysis configuration
   */
  getAnalysisConfiguration(): AnalysisConfiguration {
    const config = vscode.workspace.getConfiguration('aiProductOwner.analysis');
    
    return {
      maxSolutions: config.get('maxSolutions', 2),
      includeContext7: config.get('includeContext7', true),
      stageTimeout: config.get('stageTimeout', 15),
      autoOpenResults: config.get('autoOpenResults', true)
    };
  }

  /**
   * Get codebase configuration
   */
  getCodebaseConfiguration(): CodebaseConfiguration {
    const config = vscode.workspace.getConfiguration('aiProductOwner.codebase');
    
    return {
      includeTests: config.get('includeTests', false),
      excludePatterns: config.get('excludePatterns', [
        'vendor/',
        'node_modules/',
        '.git/',
        'bin/',
        'build/',
        'dist/'
      ]),
      maxFileSize: config.get('maxFileSize', 5),
      analysisDepth: config.get('analysisDepth', 'detailed')
    };
  }

  /**
   * Get network configuration
   */
  getNetworkConfiguration(): { retryAttempts: number; timeoutSeconds: number } {
    const config = vscode.workspace.getConfiguration('aiProductOwner.network');
    
    return {
      retryAttempts: config.get('retryAttempts', 3),
      timeoutSeconds: config.get('timeoutSeconds', 30)
    };
  }

  /**
   * Get UI configuration
   */
  getUIConfiguration(): { showDetailedProgress: boolean; enableVerboseLogging: boolean } {
    const config = vscode.workspace.getConfiguration('aiProductOwner.ui');
    const debugConfig = vscode.workspace.getConfiguration('aiProductOwner.debug');
    
    return {
      showDetailedProgress: config.get('showDetailedProgress', true),
      enableVerboseLogging: debugConfig.get('enableVerboseLogging', false)
    };
  }

  /**
   * Update Jira configuration
   */
  async updateJiraConfiguration(updates: Partial<JiraConfiguration>): Promise<void> {
    const config = vscode.workspace.getConfiguration('aiProductOwner.jira');
    
    if (updates.baseUrl !== undefined) {
      await config.update('baseUrl', updates.baseUrl, vscode.ConfigurationTarget.Global);
    }
    
    if (updates.email !== undefined) {
      await config.update('email', updates.email, vscode.ConfigurationTarget.Global);
    }
    
    if (updates.token !== undefined) {
      // Store token securely in VS Code secrets
      await this.storeJiraTokenSecurely(updates.token);
      // Also update configuration for backward compatibility
      await config.update('token', updates.token, vscode.ConfigurationTarget.Global);
    }
    
    if (updates.timeout !== undefined) {
      await config.update('timeout', updates.timeout, vscode.ConfigurationTarget.Global);
    }
    
    console.log('✅ Jira configuration updated');
  }

  /**
   * Update output configuration
   */
  async updateOutputConfiguration(updates: Partial<OutputConfiguration>): Promise<void> {
    const config = vscode.workspace.getConfiguration('aiProductOwner.output');
    
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        await config.update(key, value, vscode.ConfigurationTarget.Workspace);
      }
    }
    
    console.log('✅ Output configuration updated');
  }

  /**
   * Update analysis configuration
   */
  async updateAnalysisConfiguration(updates: Partial<AnalysisConfiguration>): Promise<void> {
    const config = vscode.workspace.getConfiguration('aiProductOwner.analysis');
    
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        await config.update(key, value, vscode.ConfigurationTarget.Workspace);
      }
    }
    
    console.log('✅ Analysis configuration updated');
  }

  /**
   * Update codebase configuration
   */
  async updateCodebaseConfiguration(updates: Partial<CodebaseConfiguration>): Promise<void> {
    const config = vscode.workspace.getConfiguration('aiProductOwner.codebase');
    
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        await config.update(key, value, vscode.ConfigurationTarget.Workspace);
      }
    }
    
    console.log('✅ Codebase configuration updated');
  }

  /**
   * Validate Jira configuration
   */
  validateJiraConfiguration(): { valid: boolean; errors: string[] } {
    const config = this.getJiraConfiguration();
    const errors: string[] = [];
    
    if (!config.baseUrl) {
      errors.push('Jira base URL is required');
    } else if (!this.isValidUrl(config.baseUrl)) {
      errors.push('Jira base URL format is invalid');
    }
    
    if (!config.email) {
      errors.push('Jira email is required');
    } else if (!this.isValidEmail(config.email)) {
      errors.push('Jira email format is invalid');
    }
    
    if (!config.token) {
      errors.push('Jira API token is required');
    } else if (config.token.length < 10) {
      errors.push('Jira API token appears to be too short');
    }
    
    return {
      valid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Validate output configuration
   */
  validateOutputConfiguration(): { valid: boolean; errors: string[] } {
    const config = this.getOutputConfiguration();
    const errors: string[] = [];
    
    if (!config.directory) {
      errors.push('Output directory is required');
    }
    
    if (!['markdown', 'html', 'pdf'].includes(config.format)) {
      errors.push('Output format must be markdown, html, or pdf');
    }
    
    return {
      valid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Get workspace folder path
   */
  getWorkspacePath(): string | undefined {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    return workspaceFolder?.uri.fsPath;
  }

  /**
   * Check if workspace contains supported source files
   */
  isGoProject(): boolean {
    const workspacePath = this.getWorkspacePath();
    if (!workspacePath) {return false;}
    
    try {
      const fs = require('fs');
      const path = require('path');
      
      // Check for supported file extensions
      const supportedExtensions = ['.js', '.ts', '.py', '.java', '.go', '.cs', '.php', '.rb', '.rs'];
      
      // Check for any supported source files
      const files = fs.readdirSync(workspacePath);
      return files.some((file: string) => {
        const ext = path.extname(file);
        return supportedExtensions.includes(ext);
      });
    } catch (error) {
      console.warn('⚠️ Could not check if workspace contains source files:', error);
      return false;
    }
  }

  /**
   * Get effective output directory path (resolved)
   */
  getResolvedOutputDirectory(): string {
    const config = this.getOutputConfiguration();
    const workspacePath = this.getWorkspacePath();
    
    if (!workspacePath) {
      return config.directory;
    }
    
    const path = require('path');
    
    // If directory is relative, resolve it against workspace
    if (!path.isAbsolute(config.directory)) {
      return path.resolve(workspacePath, config.directory);
    }
    
    return config.directory;
  }

  /**
   * Store Jira token securely using VS Code secrets API
   * Note: This would be implemented in a real extension
   */
  private async storeJiraTokenSecurely(token: string): Promise<void> {
    try {
      // In a real VS Code extension, you would use:
      // await vscode.context.secrets.store(ConfigurationManager.JIRA_TOKEN_KEY, token);
      
      console.log('🔐 Jira token stored securely (simulated)');
    } catch (error) {
      console.warn('⚠️ Could not store token securely, falling back to configuration:', error);
    }
  }

  /**
   * Retrieve Jira token securely
   * Note: This would be implemented in a real extension
   */
  private async retrieveJiraTokenSecurely(): Promise<string | undefined> {
    try {
      // In a real VS Code extension, you would use:
      // return await vscode.context.secrets.get(ConfigurationManager.JIRA_TOKEN_KEY);
      
      // For now, fall back to configuration
      return this.getJiraConfiguration().token;
    } catch (error) {
      console.warn('⚠️ Could not retrieve token securely, falling back to configuration:', error);
      return this.getJiraConfiguration().token;
    }
  }

  /**
   * Clear stored configuration (for testing/reset)
   */
  async clearConfiguration(): Promise<void> {
    const jiraConfig = vscode.workspace.getConfiguration('aiProductOwner.jira');
    const outputConfig = vscode.workspace.getConfiguration('aiProductOwner.output');
    const analysisConfig = vscode.workspace.getConfiguration('aiProductOwner.analysis');
    const codebaseConfig = vscode.workspace.getConfiguration('aiProductOwner.codebase');
    
    // Clear Jira config
    await jiraConfig.update('baseUrl', undefined, vscode.ConfigurationTarget.Global);
    await jiraConfig.update('email', undefined, vscode.ConfigurationTarget.Global);
    await jiraConfig.update('token', undefined, vscode.ConfigurationTarget.Global);
    
    // Clear workspace configs
    await outputConfig.update('directory', undefined, vscode.ConfigurationTarget.Workspace);
    await analysisConfig.update('maxSolutions', undefined, vscode.ConfigurationTarget.Workspace);
    await codebaseConfig.update('includeTests', undefined, vscode.ConfigurationTarget.Workspace);
    
    console.log('🗑️ Configuration cleared');
  }

  /**
   * Export configuration for backup/sharing
   */
  exportConfiguration(): any {
    const config = this.getExtensionConfiguration();
    
    // Remove sensitive information
    const exportConfig = {
      ...config,
      jira: {
        ...config.jira,
        token: config.jira.token ? '***REDACTED***' : ''
      }
    };
    
    return exportConfig;
  }

  /**
   * Get configuration summary for display
   */
  getConfigurationSummary(): string {
    const jiraConfig = this.getJiraConfiguration();
    const outputConfig = this.getOutputConfiguration();
    const analysisConfig = this.getAnalysisConfiguration();
    
    const jiraValid = this.validateJiraConfiguration().valid;
    const outputValid = this.validateOutputConfiguration().valid;
    
    return `
📋 **AI Product Owner Agent Configuration**

**Jira Settings** ${jiraValid ? '✅' : '❌'}
- URL: ${jiraConfig.baseUrl || 'Not configured'}
- Email: ${jiraConfig.email || 'Not configured'}
- Token: ${jiraConfig.token ? '***configured***' : 'Not configured'}

**Output Settings** ${outputValid ? '✅' : '❌'}
- Directory: ${outputConfig.directory}
- Generate Diagrams: ${outputConfig.generateDiagrams ? 'Yes' : 'No'}
- Format: ${outputConfig.format}

**Analysis Settings**
- Max Solutions: ${analysisConfig.maxSolutions}
- Auto Open Results: ${analysisConfig.autoOpenResults ? 'Yes' : 'No'}
- Stage Timeout: ${analysisConfig.stageTimeout} minutes

**Workspace**
- Path: ${this.getWorkspacePath() || 'No workspace open'}
- Source Files: ${this.isGoProject() ? 'Yes' : 'No'}
`;
  }

  // Private utility methods
  private isValidUrl(url: string): boolean {
    try {
      // Basic domain validation (not a full URL since it shouldn't include protocol)
      const domainPattern = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
      return domainPattern.test(url) || url.includes('.atlassian.net');
    } catch {
      return false;
    }
  }

  private isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
} 