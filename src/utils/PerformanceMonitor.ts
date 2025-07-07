/**
 * Performance Monitor for AI Product Owner Agent
 * Tracks operation timing, memory usage, and performance metrics
 */

import * as vscode from 'vscode';
import { createLogger } from './Logger';

export interface MemoryUsage {
  rss: number;
  heapTotal: number;
  heapUsed: number;
  external: number;
  arrayBuffers: number;
}

export interface PerformanceMetric {
  operation: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  memoryUsage?: MemoryUsage;
  epicKey?: string;
  stage?: string;
  success: boolean;
  error?: string;
  metadata?: Record<string, any>;
}

export interface PerformanceSummary {
  totalOperations: number;
  successfulOperations: number;
  failedOperations: number;
  averageDuration: number;
  slowestOperation: PerformanceMetric;
  fastestOperation: PerformanceMetric;
  memoryTrend: {
    peak: number;
    average: number;
    current: number;
  };
  operationBreakdown: Record<string, {
    count: number;
    averageDuration: number;
    successRate: number;
  }>;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetric[] = [];
  private activeOperations: Map<string, PerformanceMetric> = new Map();
  private logger = createLogger('PerformanceMonitor');
  private maxMetrics = 500; // Limit stored metrics to prevent memory issues

  private constructor() {
    // Initialize performance monitoring
    this.logger.debug('Performance monitor initialized');
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  /**
   * Start tracking an operation
   */
  startOperation(operationId: string, operation: string, epicKey?: string, stage?: string): void {
    const metric: PerformanceMetric = {
      operation,
      startTime: performance.now(),
      epicKey,
      stage,
      success: false,
      memoryUsage: process.memoryUsage()
    };

    this.activeOperations.set(operationId, metric);
    this.logger.debug(`Started tracking operation: ${operation}`, { operationId, epicKey, stage });
  }

  /**
   * End tracking an operation
   */
  endOperation(operationId: string, success: boolean = true, error?: string, metadata?: Record<string, any>): void {
    const metric = this.activeOperations.get(operationId);
    if (!metric) {
      this.logger.warn(`Attempted to end unknown operation: ${operationId}`);
      return;
    }

    const endTime = performance.now();
    metric.endTime = endTime;
    metric.duration = endTime - metric.startTime;
    metric.success = success;
    metric.error = error;
    metric.metadata = metadata;

    // Add to metrics history
    this.metrics.push(metric);
    this.pruneMetrics();

    // Remove from active operations
    this.activeOperations.delete(operationId);

    // Log performance information
    this.logOperationComplete(metric);
  }

  /**
   * Track a simple operation with automatic timing
   */
  async trackOperation<T>(
    operationId: string,
    operation: string,
    fn: () => Promise<T>,
    epicKey?: string,
    stage?: string
  ): Promise<T> {
    this.startOperation(operationId, operation, epicKey, stage);
    
    try {
      const result = await fn();
      this.endOperation(operationId, true);
      return result;
    } catch (error) {
      this.endOperation(operationId, false, error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  /**
   * Track memory usage at a point in time
   */
  trackMemoryUsage(label: string): MemoryUsage {
    const memUsage = process.memoryUsage();
    this.logger.debug(`Memory usage - ${label}`, {
      heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
      external: `${Math.round(memUsage.external / 1024 / 1024)}MB`,
      rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`
    });
    return memUsage;
  }

  /**
   * Get performance summary
   */
  getSummary(): PerformanceSummary {
    const completedMetrics = this.metrics.filter(m => m.endTime !== undefined);
    
    if (completedMetrics.length === 0) {
      return {
        totalOperations: 0,
        successfulOperations: 0,
        failedOperations: 0,
        averageDuration: 0,
        slowestOperation: {} as PerformanceMetric,
        fastestOperation: {} as PerformanceMetric,
        memoryTrend: { peak: 0, average: 0, current: 0 },
        operationBreakdown: {}
      };
    }

    const successful = completedMetrics.filter(m => m.success);
    const failed = completedMetrics.filter(m => !m.success);
    const durations = completedMetrics.map(m => m.duration!);
    
    // Calculate operation breakdown
    const operationBreakdown: Record<string, { count: number; averageDuration: number; successRate: number }> = {};
    
    for (const metric of completedMetrics) {
      if (!operationBreakdown[metric.operation]) {
        operationBreakdown[metric.operation] = { count: 0, averageDuration: 0, successRate: 0 };
      }
      operationBreakdown[metric.operation].count++;
    }

    for (const [operation, data] of Object.entries(operationBreakdown)) {
      const operationMetrics = completedMetrics.filter(m => m.operation === operation);
      data.averageDuration = operationMetrics.reduce((sum, m) => sum + m.duration!, 0) / operationMetrics.length;
      data.successRate = operationMetrics.filter(m => m.success).length / operationMetrics.length;
    }

    // Calculate memory trend
    const memoryUsages = completedMetrics
      .filter(m => m.memoryUsage)
      .map(m => m.memoryUsage!.heapUsed);
    
    const currentMemory = process.memoryUsage().heapUsed;
    
    return {
      totalOperations: completedMetrics.length,
      successfulOperations: successful.length,
      failedOperations: failed.length,
      averageDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
      slowestOperation: completedMetrics.reduce((prev, curr) => 
        (curr.duration! > prev.duration!) ? curr : prev
      ),
      fastestOperation: completedMetrics.reduce((prev, curr) => 
        (curr.duration! < prev.duration!) ? curr : prev
      ),
      memoryTrend: {
        peak: Math.max(...memoryUsages),
        average: memoryUsages.reduce((a, b) => a + b, 0) / memoryUsages.length,
        current: currentMemory
      },
      operationBreakdown
    };
  }

  /**
   * Get metrics for a specific operation type
   */
  getOperationMetrics(operation: string): PerformanceMetric[] {
    return this.metrics.filter(m => m.operation === operation);
  }

  /**
   * Get slow operations (above threshold)
   */
  getSlowOperations(thresholdMs: number = 5000): PerformanceMetric[] {
    return this.metrics.filter(m => m.duration && m.duration > thresholdMs);
  }

  /**
   * Get failed operations
   */
  getFailedOperations(): PerformanceMetric[] {
    return this.metrics.filter(m => !m.success);
  }

  /**
   * Generate performance report
   */
  generateReport(): string {
    const summary = this.getSummary();
    const slowOps = this.getSlowOperations();
    const failedOps = this.getFailedOperations();

    return `# AI Product Owner Agent - Performance Report

Generated: ${new Date().toISOString()}

## Summary
- **Total Operations**: ${summary.totalOperations}
- **Success Rate**: ${((summary.successfulOperations / summary.totalOperations) * 100).toFixed(1)}%
- **Average Duration**: ${summary.averageDuration.toFixed(2)}ms
- **Memory Usage**: ${Math.round(summary.memoryTrend.current / 1024 / 1024)}MB

## Operation Breakdown
${Object.entries(summary.operationBreakdown)
  .map(([op, data]) => 
    `- **${op}**: ${data.count} operations, ${data.averageDuration.toFixed(2)}ms avg, ${(data.successRate * 100).toFixed(1)}% success rate`
  ).join('\n')}

## Performance Issues
${slowOps.length > 0 ? `
### Slow Operations (>5s)
${slowOps.map(op => `- ${op.operation}: ${op.duration!.toFixed(2)}ms (Epic: ${op.epicKey || 'N/A'})`).join('\n')}
` : '✅ No slow operations detected'}

${failedOps.length > 0 ? `
### Failed Operations
${failedOps.map(op => `- ${op.operation}: ${op.error} (Epic: ${op.epicKey || 'N/A'})`).join('\n')}
` : '✅ No failed operations'}

## Memory Trend
- **Peak Usage**: ${Math.round(summary.memoryTrend.peak / 1024 / 1024)}MB
- **Average Usage**: ${Math.round(summary.memoryTrend.average / 1024 / 1024)}MB
- **Current Usage**: ${Math.round(summary.memoryTrend.current / 1024 / 1024)}MB

## Recommendations
${this.generateRecommendations(summary, slowOps, failedOps)}
`;
  }

  /**
   * Generate performance recommendations
   */
  private generateRecommendations(
    summary: PerformanceSummary, 
    slowOps: PerformanceMetric[], 
    failedOps: PerformanceMetric[]
  ): string {
    const recommendations: string[] = [];

    // Success rate recommendations
    if (summary.successfulOperations / summary.totalOperations < 0.9) {
      recommendations.push('- **Low Success Rate**: Consider improving error handling and retry logic');
    }

    // Performance recommendations
    if (summary.averageDuration > 10000) {
      recommendations.push('- **Slow Performance**: Average operation time is high, consider optimization');
    }

    // Memory recommendations
    if (summary.memoryTrend.current > 100 * 1024 * 1024) { // 100MB
      recommendations.push('- **High Memory Usage**: Consider implementing memory optimizations');
    }

    // Specific operation recommendations
    for (const [operation, data] of Object.entries(summary.operationBreakdown)) {
      if (data.averageDuration > 15000) {
        recommendations.push(`- **${operation}**: Consider optimizing this operation (${data.averageDuration.toFixed(0)}ms avg)`);
      }
      if (data.successRate < 0.8) {
        recommendations.push(`- **${operation}**: Improve reliability (${(data.successRate * 100).toFixed(1)}% success rate)`);
      }
    }

    return recommendations.length > 0 ? recommendations.join('\n') : '✅ No specific recommendations at this time';
  }

  /**
   * Export performance data
   */
  exportData(): string {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      summary: this.getSummary(),
      metrics: this.metrics,
      activeOperations: Array.from(this.activeOperations.entries())
    }, null, 2);
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics = [];
    this.activeOperations.clear();
    this.logger.info('Performance metrics cleared');
  }

  /**
   * Log operation completion
   */
  private logOperationComplete(metric: PerformanceMetric): void {
    const duration = metric.duration!;
    const status = metric.success ? '✅' : '❌';
    const message = `${status} ${metric.operation} completed in ${duration.toFixed(2)}ms`;
    
    if (metric.success) {
      if (duration > 10000) {
        this.logger.warn(`Slow operation: ${message}`, { metric });
      } else {
        this.logger.debug(message, { duration, epicKey: metric.epicKey });
      }
    } else {
      this.logger.error(`Failed operation: ${message}`, undefined, { metric });
    }
  }

  /**
   * Prune old metrics to prevent memory issues
   */
  private pruneMetrics(): void {
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }
}

/**
 * Convenience functions for performance tracking
 */
export const perf = PerformanceMonitor.getInstance();

export const trackOperation = async <T>(
  operationId: string,
  operation: string,
  fn: () => Promise<T>,
  epicKey?: string,
  stage?: string
): Promise<T> => {
  return perf.trackOperation(operationId, operation, fn, epicKey, stage);
};

export const startOperation = (operationId: string, operation: string, epicKey?: string, stage?: string): void => {
  perf.startOperation(operationId, operation, epicKey, stage);
};

export const endOperation = (operationId: string, success: boolean = true, error?: string): void => {
  perf.endOperation(operationId, success, error);
}; 