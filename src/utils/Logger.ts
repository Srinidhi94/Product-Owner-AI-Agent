/**
 * Production-ready Logger for AI Product Owner Agent
 * Provides structured logging with different levels and VS Code integration
 */

import * as vscode from 'vscode';

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
  TRACE = 4,
}

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  component: string;
  message: string;
  data?: any;
  operation?: string;
  epicKey?: string;
  stage?: string;
  error?: Error;
}

export class Logger {
  private static instance: Logger;
  private outputChannel: vscode.OutputChannel;
  private logLevel: LogLevel;
  private component: string;
  private entries: LogEntry[] = [];
  private maxEntries: number = 1000;

  private constructor(component: string) {
    this.component = component;
    this.outputChannel = vscode.window.createOutputChannel('AI Product Owner - Logger');
    this.logLevel = this.getConfiguredLogLevel();
  }

  /**
   * Get logger instance for a specific component
   */
  static getLogger(component: string): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(component);
    }
    return Logger.instance;
  }

  /**
   * Log error message
   */
  error(message: string, error?: Error, data?: any): void {
    this.log(LogLevel.ERROR, message, data, error);
    
    // Show VS Code error notification for critical errors
    if (this.shouldShowNotification(LogLevel.ERROR)) {
      vscode.window.showErrorMessage(`❌ ${this.component}: ${message}`);
    }
  }

  /**
   * Log warning message
   */
  warn(message: string, data?: any): void {
    this.log(LogLevel.WARN, message, data);
    
    // Show VS Code warning notification for important warnings
    if (this.shouldShowNotification(LogLevel.WARN)) {
      vscode.window.showWarningMessage(`⚠️ ${this.component}: ${message}`);
    }
  }

  /**
   * Log info message
   */
  info(message: string, data?: any): void {
    this.log(LogLevel.INFO, message, data);
    
    // Show VS Code info notification for important info
    if (this.shouldShowNotification(LogLevel.INFO) && this.isImportantMessage(message)) {
      vscode.window.showInformationMessage(`ℹ️ ${this.component}: ${message}`);
    }
  }

  /**
   * Log debug message
   */
  debug(message: string, data?: any): void {
    this.log(LogLevel.DEBUG, message, data);
  }

  /**
   * Log trace message
   */
  trace(message: string, data?: any): void {
    this.log(LogLevel.TRACE, message, data);
  }

  /**
   * Log operation start
   */
  startOperation(operation: string, epicKey?: string, stage?: string): void {
    this.info(`🚀 Starting operation: ${operation}`, { operation, epicKey, stage });
  }

  /**
   * Log operation completion
   */
  completeOperation(operation: string, duration?: number, epicKey?: string): void {
    const durationText = duration ? ` (${duration}ms)` : '';
    this.info(`✅ Completed operation: ${operation}${durationText}`, { operation, duration, epicKey });
  }

  /**
   * Log operation failure
   */
  failOperation(operation: string, error: Error, epicKey?: string): void {
    this.error(`❌ Failed operation: ${operation}`, error, { operation, epicKey });
  }

  /**
   * Core logging method
   */
  private log(level: LogLevel, message: string, data?: any, error?: Error): void {
    if (level > this.logLevel) {
      return; // Skip if level is not enabled
    }

    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      component: this.component,
      message,
      data,
      error,
    };

    // Add to entries buffer
    this.entries.push(entry);
    this.pruneEntries();

    // Format and output to channel
    const formattedMessage = this.formatLogEntry(entry);
    this.outputChannel.appendLine(formattedMessage);

    // Also log to console for development
    if (this.isDebugMode()) {
      console.log(formattedMessage);
    }
  }

  /**
   * Format log entry for output
   */
  private formatLogEntry(entry: LogEntry): string {
    const timestamp = entry.timestamp.toISOString();
    const levelName = LogLevel[entry.level];
    const component = `[${entry.component}]`;
    
    let formatted = `${timestamp} ${levelName.padEnd(5)} ${component} ${entry.message}`;

    // Add data if present
    if (entry.data) {
      formatted += `\n  Data: ${JSON.stringify(entry.data, null, 2)}`;
    }

    // Add error if present
    if (entry.error) {
      formatted += `\n  Error: ${entry.error.message}`;
      if (entry.error.stack) {
        formatted += `\n  Stack: ${entry.error.stack}`;
      }
    }

    return formatted;
  }

  /**
   * Get configured log level from VS Code settings
   */
  private getConfiguredLogLevel(): LogLevel {
    const config = vscode.workspace.getConfiguration('aiProductOwner.debug');
    const enableVerbose = config.get<boolean>('enableVerboseLogging', false);
    
    return enableVerbose ? LogLevel.TRACE : LogLevel.INFO;
  }

  /**
   * Check if debug mode is enabled
   */
  private isDebugMode(): boolean {
    const config = vscode.workspace.getConfiguration('aiProductOwner.debug');
    return config.get<boolean>('enableVerboseLogging', false);
  }

  /**
   * Check if should show VS Code notification
   */
  private shouldShowNotification(level: LogLevel): boolean {
    const config = vscode.workspace.getConfiguration('aiProductOwner.ui');
    const showDetailedProgress = config.get<boolean>('showDetailedProgress', true);
    
    // Always show errors and warnings
    if (level <= LogLevel.WARN) {
      return true;
    }
    
    // Show info only if detailed progress is enabled
    return level === LogLevel.INFO && showDetailedProgress;
  }

  /**
   * Check if message is important enough for notification
   */
  private isImportantMessage(message: string): boolean {
    const importantKeywords = [
      'completed',
      'success',
      'failed',
      'error',
      'connection',
      'authentication',
      'analysis'
    ];
    
    return importantKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );
  }

  /**
   * Prune old log entries to prevent memory issues
   */
  private pruneEntries(): void {
    if (this.entries.length > this.maxEntries) {
      this.entries = this.entries.slice(-this.maxEntries);
    }
  }

  /**
   * Get recent log entries
   */
  getRecentEntries(count: number = 50): LogEntry[] {
    return this.entries.slice(-count);
  }

  /**
   * Get log entries for specific operation
   */
  getOperationEntries(operation: string): LogEntry[] {
    return this.entries.filter(entry => 
      entry.data?.operation === operation ||
      entry.message.includes(operation)
    );
  }

  /**
   * Get error entries
   */
  getErrorEntries(): LogEntry[] {
    return this.entries.filter(entry => entry.level === LogLevel.ERROR);
  }

  /**
   * Export logs for debugging
   */
  exportLogs(): string {
    const exportData = {
      timestamp: new Date().toISOString(),
      component: this.component,
      logLevel: LogLevel[this.logLevel],
      totalEntries: this.entries.length,
      entries: this.entries.map(entry => ({
        timestamp: entry.timestamp.toISOString(),
        level: LogLevel[entry.level],
        component: entry.component,
        message: entry.message,
        data: entry.data,
        error: entry.error ? {
          message: entry.error.message,
          stack: entry.error.stack
        } : undefined
      }))
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Clear all log entries
   */
  clear(): void {
    this.entries = [];
    this.outputChannel.clear();
  }

  /**
   * Show the output channel
   */
  show(): void {
    this.outputChannel.show();
  }

  /**
   * Dispose of resources
   */
  dispose(): void {
    this.outputChannel.dispose();
  }
}

/**
 * Convenience functions for global logging
 */
export const createLogger = (component: string): Logger => Logger.getLogger(component);

export const log = {
  error: (message: string, error?: Error, data?: any) => Logger.getLogger('Global').error(message, error, data),
  warn: (message: string, data?: any) => Logger.getLogger('Global').warn(message, data),
  info: (message: string, data?: any) => Logger.getLogger('Global').info(message, data),
  debug: (message: string, data?: any) => Logger.getLogger('Global').debug(message, data),
  trace: (message: string, data?: any) => Logger.getLogger('Global').trace(message, data),
}; 