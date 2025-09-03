/**
 * Unit tests for DocumentGenerator
 */

import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import * as fs from 'fs/promises';
import * as vscode from 'vscode';

// Mock all dependencies at module level
jest.mock('fs/promises');
jest.mock('vscode');

// Import the createLogger function to debug it
jest.mock('../../src/utils/Logger');

// Import after mocking
import { DocumentGenerator } from '../../src/output/DocumentGenerator';
import { createLogger } from '../../src/utils/Logger';

describe('DocumentGenerator', () => {
  let generator: DocumentGenerator;
  let mockFs: jest.Mocked<typeof fs>;
  let mockVSCode: any;
  const mockCreateLogger = createLogger as jest.MockedFunction<typeof createLogger>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Get the mocked vscode
    mockVSCode = require('../__mocks__/vscode');

    // Setup VS Code workspace configuration mock
    mockVSCode.workspace.getConfiguration.mockReturnValue({
      get: jest.fn().mockReturnValue('./docs/analysis'),
      update: jest.fn().mockImplementation(() => Promise.resolve()),
    });

    mockFs = fs as jest.Mocked<typeof fs>;

    // Mock fs operations
    mockFs.mkdir.mockResolvedValue(undefined);
    mockFs.writeFile.mockResolvedValue(undefined);
    mockFs.access.mockResolvedValue(undefined);

    // Setup the createLogger mock
    mockCreateLogger.mockReturnValue({
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    } as any);

    generator = new DocumentGenerator();
  });

  describe('initializeOutputStructure', () => {
    test('should create output directory structure', async () => {
      const epicKey = 'TEST-123';

      const result = await generator.initializeOutputStructure(epicKey);

      expect(mockFs.mkdir).toHaveBeenCalled();
      expect(result).toContain(epicKey);
    });

    test('should handle directory creation errors', async () => {
      const epicKey = 'TEST-456';
      mockFs.mkdir.mockRejectedValue(new Error('Permission denied'));

      await expect(generator.initializeOutputStructure(epicKey)).rejects.toThrow(
        'Permission denied'
      );
    });

    test('should create README, PROMPTS, and ANALYSIS files', async () => {
      const epicKey = 'TEST-789';

      await generator.initializeOutputStructure(epicKey);

      // Should create 4 files: README.md, PROMPTS.md, ANALYSIS.md, CONTEXT.md
      expect(mockFs.writeFile).toHaveBeenCalledTimes(4);
      expect(mockFs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('README.md'),
        expect.any(String),
        'utf-8'
      );
      expect(mockFs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('PROMPTS.md'),
        expect.any(String),
        'utf-8'
      );
      expect(mockFs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('ANALYSIS.md'),
        expect.any(String),
        'utf-8'
      );
      expect(mockFs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('CONTEXT.md'),
        expect.any(String),
        'utf-8'
      );
    });
  });

  describe('addPromptToDocument', () => {
    test('should add prompt section to prompts document', async () => {
      const epicKey = 'TEST-PROMPT';
      const stageId = 'stage-1';
      const stageName = 'Test Stage';
      const prompt = 'Test prompt content';

      // Mock reading existing file
      mockFs.readFile.mockResolvedValue('Existing content\n');

      await generator.addPromptToDocument(epicKey, stageId, stageName, prompt);

      expect(mockFs.readFile).toHaveBeenCalledWith(expect.stringContaining('PROMPTS.md'), 'utf-8');
      expect(mockFs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('PROMPTS.md'),
        expect.stringContaining('Test Stage'),
        'utf-8'
      );
    });

    test('should handle file read errors gracefully', async () => {
      const epicKey = 'TEST-ERROR';
      const stageId = 'stage-error';
      const stageName = 'Error Stage';
      const prompt = 'Error prompt';

      mockFs.readFile.mockRejectedValue(new Error('File not found'));

      await expect(
        generator.addPromptToDocument(epicKey, stageId, stageName, prompt)
      ).rejects.toThrow('File not found');
    });
  });

  describe('constructor', () => {
    test('should initialize with workspace folder', () => {
      const newGenerator = new DocumentGenerator();
      expect(newGenerator).toBeDefined();
    });

    test('should handle missing workspace folder', () => {
      // Mock no workspace folders
      jest.doMock('vscode', () => ({
        workspace: {
          workspaceFolders: undefined,
        },
      }));

      const newGenerator = new DocumentGenerator();
      expect(newGenerator).toBeDefined();
    });
  });

  describe('template generation', () => {
    test('should create files with expected content structure', async () => {
      const epicKey = 'TEST-TEMPLATE';

      await generator.initializeOutputStructure(epicKey);

      // Check that README contains epic key
      const readmeCall = mockFs.writeFile.mock.calls.find(call =>
        String(call[0]).includes('README.md')
      );
      expect(readmeCall?.[1]).toContain(epicKey);

      // Check that ANALYSIS contains stage tracking
      const analysisCall = mockFs.writeFile.mock.calls.find(call =>
        String(call[0]).includes('ANALYSIS.md')
      );
      expect(analysisCall?.[1]).toContain('Stage');
      expect(analysisCall?.[1]).toContain('Status');
    });
  });
});
