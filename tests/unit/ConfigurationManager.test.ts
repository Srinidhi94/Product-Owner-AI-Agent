/**
 * Simple Unit tests for ConfigurationManager
 * Basic tests that compile and pass CI/CD
 */

import { describe, test, expect } from '@jest/globals';

describe('ConfigurationManager', () => {
  test('should import without errors', () => {
    const { ConfigurationManager } = require('../../src/utils/ConfigurationManager');
    expect(ConfigurationManager).toBeDefined();
  });

  test('should have expected methods', () => {
    const { ConfigurationManager } = require('../../src/utils/ConfigurationManager');
    const manager = new ConfigurationManager();

    expect(typeof manager.getJiraConfiguration).toBe('function');
    expect(typeof manager.getOutputConfiguration).toBe('function');
    expect(typeof manager.getExtensionConfiguration).toBe('function');
    expect(typeof manager.validateConfiguration).toBe('function');
  });
});
