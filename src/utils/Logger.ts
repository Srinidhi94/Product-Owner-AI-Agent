/**
 * Simplified Logger for AI Product Owner Agent
 * Provides basic logging with VS Code integration
 */

import * as vscode from 'vscode';

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

export class Logger {
  private static instances: Map<string, Logger> = new Map();
  private outputChannel: vscode.OutputChannel;
  private component: string;

  private constructor(component: string) {
    this.component = component;
    this.outputChannel = vscode.window.createOutputChannel(`AI Product Owner - ${component}`);
  }

  /**
   * Get logger instance for a specific component
   */
  static getLogger(component: string): Logger {
    if (!Logger.instances.has(component)) {
      Logger.instances.set(component, new Logger(component));
    }
    return Logger.instances.get(component)!;
  }

  /**
   * Log error message
   */
  error(message: string, error?: Error): void {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} [ERROR] ${message}`;
    this.outputChannel.appendLine(logMessage);

    if (error) {
      this.outputChannel.appendLine(`  Error details: ${error.message}`);
      if (error.stack) {
        this.outputChannel.appendLine(`  Stack: ${error.stack}`);
      }
    }

    console.error(`${this.component}:`, message, error);
  }

  /**
   * Log warning message
   */
  warn(message: string): void {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} [WARN] ${message}`;
    this.outputChannel.appendLine(logMessage);
    console.warn(`${this.component}:`, message);
  }

  /**
   * Log info message
   */
  info(message: string, data?: any): void {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} [INFO] ${message}`;
    this.outputChannel.appendLine(logMessage);

    if (data) {
      this.outputChannel.appendLine(`  Data: ${JSON.stringify(data, null, 2)}`);
    }

    console.log(`${this.component}:`, message, data);
  }

  /**
   * Log debug message
   */
  debug(message: string, data?: any): void {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} [DEBUG] ${message}`;
    this.outputChannel.appendLine(logMessage);

    if (data) {
      this.outputChannel.appendLine(`  Data: ${JSON.stringify(data, null, 2)}`);
    }

    console.debug(`${this.component}:`, message, data);
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
    this.info(`✅ Completed operation: ${operation}${durationText}`, {
      operation,
      duration,
      epicKey,
    });
  }

  /**
   * Log operation failure
   */
  failOperation(operation: string, error: Error, epicKey?: string): void {
    this.error(`❌ Failed operation: ${operation}`, error);
  }

  /**
   * Show the output channel
   */
  show(): void {
    this.outputChannel.show();
  }

  /**
   * Clear the output channel
   */
  clear(): void {
    this.outputChannel.clear();
  }

  /**
   * Dispose of the logger
   */
  dispose(): void {
    this.outputChannel.dispose();
  }
}

/**
 * Create a logger for a component
 */
export function createLogger(component: string): Logger {
  return Logger.getLogger(component);
}
