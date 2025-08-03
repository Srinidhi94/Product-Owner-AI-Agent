/**
 * Unit tests for ConfigurationManager
 */

import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { ConfigurationManager } from '../../src/utils/ConfigurationManager';
import * as vscode from 'vscode';

describe('ConfigurationManager', () => {
  let configManager: ConfigurationManager;
  let mockVSCode: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockVSCode = require('vscode');
    configManager = new ConfigurationManager();
  });

  describe('Jira Configuration', () => {
    test('should get Jira configuration with all fields', () => {
      const mockConfig = {
        get: jest.fn()
          .mockReturnValueOnce('https://test.atlassian.net')
          .mockReturnValueOnce('user@example.com')
          .mockReturnValueOnce('test-token-123')
          .mockReturnValueOnce(15000)
      };
      mockVSCode.workspace.getConfiguration.mockReturnValue(mockConfig);

      const jiraConfig = configManager.getJiraConfiguration();

      expect(mockVSCode.workspace.getConfiguration).toHaveBeenCalledWith('aiProductOwner.jira');
      expect(jiraConfig).toEqual({
        baseUrl: 'https://test.atlassian.net',
        email: 'user@example.com',
        token: 'test-token-123',
        timeout: 15000
      });
    });

    test('should return default values when configuration is missing', () => {
      const mockConfig = {
        get: jest.fn()
          .mockReturnValueOnce('') // baseUrl
          .mockReturnValueOnce('') // email  
          .mockReturnValueOnce('') // token
          .mockReturnValueOnce(10000) // timeout - default value
      };
      mockVSCode.workspace.getConfiguration.mockReturnValue(mockConfig);

      const jiraConfig = configManager.getJiraConfiguration();

      expect(jiraConfig).toEqual({
        baseUrl: '',
        email: '',
        token: '',
        timeout: 10000,
      });
    });
  });

  describe('Output Configuration', () => {
    test('should get output configuration', () => {
      const mockConfig = {
        get: jest.fn().mockReturnValue('./custom/output/dir')
      };
      mockVSCode.workspace.getConfiguration.mockReturnValue(mockConfig);

      const outputConfig = configManager.getOutputConfiguration();

      expect(mockVSCode.workspace.getConfiguration).toHaveBeenCalledWith('aiProductOwner.output');
      expect(outputConfig).toEqual({
        directory: './custom/output/dir'
      });
    });

    test('should return default directory when not configured', () => {
      const mockConfig = {
        get: jest.fn().mockReturnValue('./docs/analysis') // Return default value
      };
      mockVSCode.workspace.getConfiguration.mockReturnValue(mockConfig);

      const outputConfig = configManager.getOutputConfiguration();

      expect(outputConfig).toEqual({
        directory: './docs/analysis'  // Default directory
      });
    });
  });

  describe('Extension Configuration', () => {
    test('should get complete extension configuration', () => {
      const mockJiraConfig = {
        get: jest.fn()
          .mockReturnValueOnce('https://test.atlassian.net')
          .mockReturnValueOnce('user@example.com')
          .mockReturnValueOnce('token-123')
          .mockReturnValueOnce(12000)
      };
      const mockOutputConfig = {
        get: jest.fn().mockReturnValue('./test/output')
      };

      mockVSCode.workspace.getConfiguration
        .mockReturnValueOnce(mockJiraConfig)   // First call for jira config
        .mockReturnValueOnce(mockOutputConfig); // Second call for output config

      const extensionConfig = configManager.getExtensionConfiguration();

      expect(extensionConfig).toEqual({
        jira: {
          baseUrl: 'https://test.atlassian.net',
          email: 'user@example.com',
          token: 'token-123',
          timeout: 12000
        },
        output: {
          directory: './test/output'
        }
      });
    });
  });

  describe('Configuration Validation', () => {
    test('should validate complete Jira configuration', () => {
      const mockConfig = {
        get: jest.fn()
          .mockReturnValueOnce('https://test.atlassian.net')
          .mockReturnValueOnce('user@example.com')
          .mockReturnValueOnce('valid-token')
          .mockReturnValueOnce(10000)
      };
      mockVSCode.workspace.getConfiguration.mockReturnValue(mockConfig);

      const jiraConfig = configManager.getJiraConfiguration();
      const isValid = !!(jiraConfig.baseUrl && jiraConfig.email && jiraConfig.token);

      expect(isValid).toBe(true);
    });

    test('should detect incomplete Jira configuration', () => {
      const mockConfig = {
        get: jest.fn()
          .mockReturnValueOnce('https://test.atlassian.net')
          .mockReturnValueOnce('')  // Missing email
          .mockReturnValueOnce('valid-token')
          .mockReturnValueOnce(10000)
      };
      mockVSCode.workspace.getConfiguration.mockReturnValue(mockConfig);

      const jiraConfig = configManager.getJiraConfiguration();
      const isValid = !!(jiraConfig.baseUrl && jiraConfig.email && jiraConfig.token);

      expect(isValid).toBe(false);
    });
  });
});
