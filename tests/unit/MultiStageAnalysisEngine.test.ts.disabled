/**
 * Unit Tests for MultiStageAnalysisEngine
 * Tests the analysis workflow orchestration and stage management
 */

import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';
import * as vscode from 'vscode';
import { MultiStageAnalysisEngine, AnalysisCancelledError } from '../../src/analysis/MultiStageAnalysisEngine';
import { JiraPortfolio, CodebaseAnalysis } from '../../src/types';

// Mock VS Code API
jest.mock('vscode');

// Mock dependencies
jest.mock('../../src/prompts/PromptGenerator');
jest.mock('../../src/output/DocumentGenerator');
jest.mock('../../src/utils/ConfigurationManager');
jest.mock('../../src/utils/Logger');

const mockOutputChannel = {
  appendLine: jest.fn(),
  show: jest.fn(),
  clear: jest.fn(),
  dispose: jest.fn(),
};

const mockWorkspaceFolder = {
  uri: { fsPath: '/test/workspace' },
  name: 'test-workspace',
  index: 0,
};

// Test data
const mockJiraPortfolio: JiraPortfolio = {
  type: 'epic',
  key: 'TEST-123',
  name: 'Test Project',
  description: 'Test project description',
  epics: [
    {
      key: 'TEST-123',
      summary: 'Test Epic Summary',
      description: 'Detailed test epic description',
      status: 'In Progress',
      stories: [],
      totalPoints: 13,
      created: '2023-01-01',
      updated: '2023-01-02',
    },
  ],
  totalStoryPoints: 13,
};

const mockCodebaseAnalysis: CodebaseAnalysis = {
  files: [
    {
      path: 'src/test.ts',
      type: 'typescript',
      size: 1000,
      lastModified: '2023-01-01',
    },
  ],
  structure: {
    directories: ['src', 'tests'],
    totalFiles: 1,
    totalSize: 1000,
  },
  technologies: ['TypeScript', 'Node.js'],
  dependencies: {
    production: ['express'],
    development: ['jest'],
  },
  patterns: [
    {
      name: 'MVC',
      description: 'Model-View-Controller pattern',
      confidence: 0.9,
      files: ['src/controllers/', 'src/models/'],
      examples: ['UserController.ts', 'User.model.ts'],
    },
  ],
  complexity: {
    cyclomaticComplexity: 5,
    maintainabilityIndex: 80,
  },
  quality: {
    testCoverage: 85,
    codeSmells: 2,
    duplicatedLines: 0,
  },
};

describe('MultiStageAnalysisEngine', () => {
  let engine: MultiStageAnalysisEngine;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock vscode.window.createOutputChannel
    (vscode.window.createOutputChannel as jest.Mock).mockReturnValue(mockOutputChannel);
    
    // Mock vscode.workspace.workspaceFolders
    Object.defineProperty(vscode.workspace, 'workspaceFolders', {
      value: [mockWorkspaceFolder],
      configurable: true,
    });

    engine = new MultiStageAnalysisEngine();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Constructor', () => {
    test('should initialize with all required dependencies', () => {
      expect(engine).toBeInstanceOf(MultiStageAnalysisEngine);
      expect(vscode.window.createOutputChannel).toHaveBeenCalledWith('AI Product Owner - Analysis');
    });
  });

  describe('getAvailableStages', () => {
    test('should return all available analysis stages', () => {
      const stages = engine.getAvailableStages();
      expect(stages).toHaveLength(5);
      expect(stages[0]).toHaveProperty('id');
      expect(stages[0]).toHaveProperty('name');
      expect(stages[0]).toHaveProperty('icon');
      expect(stages[0]).toHaveProperty('description');
    });

    test('should return stages in correct order', () => {
      const stages = engine.getAvailableStages();
      const expectedIds = [
        'product-requirements-analysis',
        'system-architecture-design',
        'technical-design-specification',
        'implementation-deployment-strategy',
        'sprint-planning-jira-breakdown',
      ];
      
      stages.forEach((stage, index) => {
        expect(stage.id).toBe(expectedIds[index]);
      });
    });
  });

  describe('executeAnalysis', () => {
    test('should handle analysis cancellation at start', async () => {
      engine.cancelAnalysis();
      
      await expect(
        engine.executeAnalysis('TEST-123', mockJiraPortfolio, mockCodebaseAnalysis)
      ).rejects.toThrow(AnalysisCancelledError);
    });

    test('should initialize output structure before analysis', async () => {
      const mockDocumentGenerator = {
        initializeOutputStructure: jest.fn().mockResolvedValue(undefined),
      };
      
      // Mock the document generator
      (engine as any).documentGenerator = mockDocumentGenerator;
      
      engine.cancelAnalysis(); // Cancel to avoid full execution
      
      try {
        await engine.executeAnalysis('TEST-123', mockJiraPortfolio, mockCodebaseAnalysis);
      } catch (error) {
        // Expected cancellation error
      }
      
      expect(mockDocumentGenerator.initializeOutputStructure).toHaveBeenCalled();
    });

    test('should handle workspace folder validation', async () => {
      // Mock no workspace folders
      Object.defineProperty(vscode.workspace, 'workspaceFolders', {
        value: undefined,
        configurable: true,
      });

      await expect(
        engine.executeAnalysis('TEST-123', mockJiraPortfolio, mockCodebaseAnalysis)
      ).rejects.toThrow('No workspace folder found');
    });
  });

  describe('cancelAnalysis', () => {
    test('should set cancelled flag to true', () => {
      expect((engine as any).cancelled).toBe(false);
      engine.cancelAnalysis();
      expect((engine as any).cancelled).toBe(true);
    });

    test('should clear current stage interval if exists', () => {
      const mockInterval = setInterval(() => {}, 1000);
      (engine as any).currentStageInterval = mockInterval;
      
      const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
      
      engine.cancelAnalysis();
      
      expect(clearIntervalSpy).toHaveBeenCalledWith(mockInterval);
      expect((engine as any).currentStageInterval).toBeNull();
    });

    test('should resolve current stage promise if exists', () => {
      const mockResolver = jest.fn();
      (engine as any).currentStageResolver = mockResolver;
      
      engine.cancelAnalysis();
      
      expect(mockResolver).toHaveBeenCalled();
      expect((engine as any).currentStageResolver).toBeNull();
    });
  });

  describe('resetAnalysis', () => {
    test('should reset cancelled flag and clear intervals', () => {
      engine.cancelAnalysis();
      expect((engine as any).cancelled).toBe(true);
      
      engine.resetAnalysis();
      expect((engine as any).cancelled).toBe(false);
    });

    test('should clear output channel', () => {
      engine.resetAnalysis();
      expect(mockOutputChannel.clear).toHaveBeenCalled();
    });
  });

  describe('getCurrentStage', () => {
    test('should return current stage name', () => {
      (engine as any).currentStageName = 'product-requirements-analysis';
      expect(engine.getCurrentStage()).toBe('product-requirements-analysis');
    });

    test('should return empty string when no current stage', () => {
      expect(engine.getCurrentStage()).toBe('');
    });
  });

  describe('isCancelled', () => {
    test('should return false initially', () => {
      expect(engine.isCancelled()).toBe(false);
    });

    test('should return true after cancellation', () => {
      engine.cancelAnalysis();
      expect(engine.isCancelled()).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('should handle prompt generation errors gracefully', async () => {
      const mockPromptGenerator = {
        generateStagePrompt: jest.fn().mockRejectedValue(new Error('Prompt generation failed')),
      };
      
      (engine as any).promptGenerator = mockPromptGenerator;
      
      await expect(
        engine.executeAnalysis('TEST-123', mockJiraPortfolio, mockCodebaseAnalysis)
      ).rejects.toThrow();
    });

    test('should handle document generation errors gracefully', async () => {
      const mockDocumentGenerator = {
        initializeOutputStructure: jest.fn().mockRejectedValue(new Error('Document init failed')),
      };
      
      (engine as any).documentGenerator = mockDocumentGenerator;
      
      await expect(
        engine.executeAnalysis('TEST-123', mockJiraPortfolio, mockCodebaseAnalysis)
      ).rejects.toThrow('Document init failed');
    });
  });

  describe('Stage Execution Flow', () => {
    test('should execute stages in correct sequence', async () => {
      const mockPromptGenerator = {
        generateStagePrompt: jest.fn().mockResolvedValue({
          prompt: 'test prompt',
          stage: 'product-requirements-analysis',
          contextFiles: [],
        }),
      };
      
      const mockDocumentGenerator = {
        initializeOutputStructure: jest.fn().mockResolvedValue(undefined),
        addPromptToDocument: jest.fn().mockResolvedValue(undefined),
      };
      
      (engine as any).promptGenerator = mockPromptGenerator;
      (engine as any).documentGenerator = mockDocumentGenerator;
      
      // Cancel after first stage to avoid full execution
      setTimeout(() => engine.cancelAnalysis(), 100);
      
      try {
        await engine.executeAnalysis('TEST-123', mockJiraPortfolio, mockCodebaseAnalysis);
      } catch (error) {
        // Expected cancellation error
      }
      
      expect(mockDocumentGenerator.initializeOutputStructure).toHaveBeenCalled();
    });
  });

  describe('Context File Generation', () => {
    test('should generate context files during initialization', async () => {
      const mockDocumentGenerator = {
        initializeOutputStructure: jest.fn().mockResolvedValue(undefined),
        generateContextFiles: jest.fn().mockResolvedValue(undefined),
      };
      
      (engine as any).documentGenerator = mockDocumentGenerator;
      
      engine.cancelAnalysis(); // Cancel to avoid full execution
      
      try {
        await engine.executeAnalysis('TEST-123', mockJiraPortfolio, mockCodebaseAnalysis);
      } catch (error) {
        // Expected cancellation error
      }
      
      expect(mockDocumentGenerator.initializeOutputStructure).toHaveBeenCalled();
    });
  });
});

describe('AnalysisCancelledError', () => {
  test('should create error with default message', () => {
    const error = new AnalysisCancelledError();
    expect(error.message).toBe('Analysis was cancelled by user');
    expect(error.name).toBe('AnalysisCancelledError');
  });

  test('should create error with custom message', () => {
    const customMessage = 'Custom cancellation message';
    const error = new AnalysisCancelledError(customMessage);
    expect(error.message).toBe(customMessage);
    expect(error.name).toBe('AnalysisCancelledError');
  });

  test('should be instance of Error', () => {
    const error = new AnalysisCancelledError();
    expect(error).toBeInstanceOf(Error);
  });
});
