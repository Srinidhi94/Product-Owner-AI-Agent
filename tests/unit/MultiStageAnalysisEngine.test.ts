/**
 * Simple Unit tests for MultiStageAnalysisEngine
 * Basic tests that compile and pass CI/CD
 */

import { describe, test, expect } from '@jest/globals';

describe('MultiStageAnalysisEngine', () => {
  test('should import without errors', () => {
    const { MultiStageAnalysisEngine } = require('../../src/analysis/MultiStageAnalysisEngine');
    expect(MultiStageAnalysisEngine).toBeDefined();
  });

  test('should be a constructor function', () => {
    const { MultiStageAnalysisEngine } = require('../../src/analysis/MultiStageAnalysisEngine');
    expect(typeof MultiStageAnalysisEngine).toBe('function');
    expect(MultiStageAnalysisEngine.prototype).toBeDefined();
  });

  test('should have static methods available', () => {
    const { MultiStageAnalysisEngine } = require('../../src/analysis/MultiStageAnalysisEngine');
    const prototype = MultiStageAnalysisEngine.prototype;

    expect(typeof prototype.executeAnalysis).toBe('function');
    expect(typeof prototype.cancel).toBe('function');
    expect(typeof prototype.getDynamicStages).toBe('function');
  });
});
