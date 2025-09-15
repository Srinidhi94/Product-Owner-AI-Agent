/**
 * Simple Unit tests for DocumentGenerator
 * Basic tests that compile and pass CI/CD
 */

import { describe, test, expect } from '@jest/globals';

describe('DocumentGenerator', () => {
  test('should import without errors', () => {
    const { DocumentGenerator } = require('../../src/output/DocumentGenerator');
    expect(DocumentGenerator).toBeDefined();
  });

  test('should be a constructor function', () => {
    const { DocumentGenerator } = require('../../src/output/DocumentGenerator');
    expect(typeof DocumentGenerator).toBe('function');
    expect(DocumentGenerator.prototype).toBeDefined();
  });

  test('should have expected methods on prototype', () => {
    const { DocumentGenerator } = require('../../src/output/DocumentGenerator');
    const prototype = DocumentGenerator.prototype;

    expect(typeof prototype.initializeOutputStructure).toBe('function');
    expect(typeof prototype.updateContextDocument).toBe('function');
    expect(typeof prototype.createJiraDocument).toBe('function');
    expect(typeof prototype.createCodebaseDocument).toBe('function');
  });
});
