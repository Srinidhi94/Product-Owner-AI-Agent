import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import {
  MultiStageAnalysisEngine,
  AnalysisCancelledError,
} from '../../src/analysis/MultiStageAnalysisEngine';
import { ConfigurationManager } from '../../src/utils/ConfigurationManager';
import { JiraPortfolio, CodebaseAnalysis, JiraUser } from '../../src/types';

// Mock vscode module
const mockVSCode = require('vscode');
jest.mock('vscode');
jest.mock('fs/promises');

/**
 * SIMPLIFIED MAIN WORKFLOW TESTS
 * Tests core functionality without complex timing or VS Code integrations
 */

describe('Main Workflow Tests', () => {
  let engine: MultiStageAnalysisEngine;
  let configManager: ConfigurationManager;

  const mockJiraData: JiraPortfolio = {
    type: 'epic',
    key: 'TEST-123',
    name: 'Test Epic',
    description: 'Test Description',
    totalStoryPoints: 25,
    epics: [
      {
        key: 'TEST-123',
        summary: 'Test Epic',
        description: 'Test Description',
        status: 'In Progress',
        assignee: {
          accountId: 'acc-123',
          displayName: 'Test User',
          emailAddress: 'test@example.com',
        },
        reporter: {
          accountId: 'acc-123',
          displayName: 'Test User',
          emailAddress: 'test@example.com',
        },
        created: '2025-01-01T00:00:00.000Z',
        updated: '2025-01-15T00:00:00.000Z',
        totalPoints: 25,
        stories: [],
      },
    ],
  };

  const mockCodebaseData: CodebaseAnalysis = {
    projectPath: '/test',
    totalFiles: 10,
    packages: ['test-package'],
    structs: ['TestStruct'],
    functions: ['testFunction'],
    imports: ['fs', 'path'],
    patterns: [],
    techStack: [],
    metrics: {
      complexity: 'medium',
      maintainability: 8,
      testCoverage: 75,
      linesOfCode: 1000,
      technicalDebt: 'low',
    },
  };

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Setup basic VS Code mocks
    mockVSCode.window.createOutputChannel.mockReturnValue({
      appendLine: jest.fn(),
      show: jest.fn(),
      dispose: jest.fn(),
    });

    mockVSCode.workspace.getConfiguration.mockReturnValue({
      get: jest.fn().mockImplementation((key: any) => {
        if (key === 'directory') return '/test-output';
        return 'test-value';
      }),
    });

    mockVSCode.env.clipboard.writeText = jest.fn();

    engine = new MultiStageAnalysisEngine();
    configManager = new ConfigurationManager();
  });

  describe('Engine Initialization', () => {
    test('should create engine instance successfully', () => {
      expect(engine).toBeDefined();
      expect(engine).toBeInstanceOf(MultiStageAnalysisEngine);
    });

    test('should have ConfigurationManager integration', () => {
      expect(configManager).toBeDefined();
      expect(configManager).toBeInstanceOf(ConfigurationManager);
    });
  });

  describe('Business Logic Validation', () => {
    test('should have available analysis stages', () => {
      const stages = engine.getStages();
      expect(stages).toBeDefined();
      expect(Array.isArray(stages)).toBe(true);
      expect(stages.length).toBeGreaterThan(0);

      // Validate stage structure
      stages.forEach(stage => {
        expect(stage).toHaveProperty('id');
        expect(stage).toHaveProperty('name');
        expect(stage).toHaveProperty('icon');
        expect(stage).toHaveProperty('description');
      });
    });

    test('should handle cancellation properly', () => {
      expect(engine.isCancelled()).toBe(false);

      engine.cancel();
      expect(engine.isCancelled()).toBe(true);
    });
  });

  describe('ConfigurationManager', () => {
    test('should retrieve Jira configuration', () => {
      const config = configManager.getJiraConfiguration();
      expect(config).toBeDefined();
      expect(config).toHaveProperty('baseUrl');
      expect(config).toHaveProperty('email');
      expect(config).toHaveProperty('token');
    });

    test('should retrieve output configuration', () => {
      const config = configManager.getOutputConfiguration();
      expect(config).toBeDefined();
      expect(config).toHaveProperty('directory');
    });

    test('should validate configuration structure', () => {
      const validation = configManager.validateConfiguration();
      expect(validation).toBeDefined();
      expect(typeof validation.isValid).toBe('boolean');
      expect(Array.isArray(validation.errors)).toBe(true);
    });
  });

  describe('User Cancellation Scenarios', () => {
    test('should handle user cancellation gracefully', async () => {
      mockVSCode.window.showInformationMessage.mockResolvedValueOnce('Cancel');

      // Cancellation should now throw AnalysisCancelledError
      try {
        await engine.executeAnalysis('TEST-123', mockJiraData, mockCodebaseData);
        // Should not reach here if cancellation works properly
        expect(false).toBe(true); // Force failure if no error thrown
      } catch (error) {
        // Should throw AnalysisCancelledError with cancellation message
        const message = error instanceof Error ? error.message : String(error);
        expect(message.includes('cancelled')).toBe(true);
        expect(error instanceof AnalysisCancelledError).toBe(true);
      }
    });
  });
});
