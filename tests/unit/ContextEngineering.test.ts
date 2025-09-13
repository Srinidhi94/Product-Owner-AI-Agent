/**
 * Unit Tests for ContextEngineering
 * Tests context frame building and optimization
 */

import { describe, test, expect } from '@jest/globals';
import { buildContextFrame } from '../../src/prompts/ContextEngineering';
import { JiraPortfolio, CodebaseAnalysis } from '../../src/types';

const mockJiraPortfolio: JiraPortfolio = {
  epic: {
    key: 'TEST-123',
    summary: 'Test Epic Summary',
    description: 'Detailed test epic description',
    status: 'In Progress',
    assignee: 'test-user',
    reporter: 'test-reporter',
    created: '2023-01-01',
    updated: '2023-01-02',
    priority: 'High',
    labels: ['backend', 'api'],
    components: ['core-service'],
    fixVersions: ['v1.0.0'],
    customFields: {
      storyPoints: 13,
      businessValue: 'High',
    },
  },
  stories: [
    {
      key: 'TEST-124',
      summary: 'User Authentication',
      description: 'Implement user login',
      status: 'To Do',
      assignee: 'dev1',
      reporter: 'product-owner',
      created: '2023-01-01',
      updated: '2023-01-01',
      priority: 'High',
      labels: ['auth'],
      components: ['auth-service'],
      fixVersions: ['v1.0.0'],
      customFields: { storyPoints: 5 },
    },
  ],
  subtasks: [],
  bugs: [],
  metadata: {
    totalIssues: 2,
    lastUpdated: '2023-01-02',
    projectKey: 'TEST',
    projectName: 'Test Project',
  },
};

const mockCodebaseAnalysis: CodebaseAnalysis = {
  files: [
    {
      path: 'src/auth/AuthService.ts',
      type: 'typescript',
      size: 2500,
      lastModified: '2023-01-01',
    },
    {
      path: 'src/api/UserController.ts',
      type: 'typescript',
      size: 1800,
      lastModified: '2023-01-01',
    },
  ],
  structure: {
    directories: ['src', 'tests', 'docs'],
    totalFiles: 25,
    totalSize: 45000,
  },
  technologies: ['TypeScript', 'Node.js', 'Express', 'MongoDB'],
  dependencies: {
    production: ['express', 'mongoose', 'jsonwebtoken'],
    development: ['jest', 'typescript', '@types/node'],
  },
  patterns: {
    architecturalPatterns: ['MVC', 'Repository'],
    designPatterns: ['Factory', 'Singleton'],
  },
  complexity: {
    cyclomaticComplexity: 12,
    maintainabilityIndex: 75,
  },
  quality: {
    testCoverage: 85,
    codeSmells: 3,
    duplicatedLines: 2,
  },
};

describe('ContextEngineering', () => {
  describe('buildContextFrame', () => {
    test('should build context frame with all required sections', () => {
      const contextFrame = buildContextFrame(mockJiraPortfolio, mockCodebaseAnalysis);

      expect(contextFrame).toContain('# Context Frame');
      expect(contextFrame).toContain('## Epic Information');
      expect(contextFrame).toContain('## Codebase Overview');
      expect(contextFrame).toContain('## Technical Stack');
    });

    test('should include epic key and summary', () => {
      const contextFrame = buildContextFrame(mockJiraPortfolio, mockCodebaseAnalysis);

      expect(contextFrame).toContain('TEST-123');
      expect(contextFrame).toContain('Test Epic Summary');
    });

    test('should include technology stack information', () => {
      const contextFrame = buildContextFrame(mockJiraPortfolio, mockCodebaseAnalysis);

      expect(contextFrame).toContain('TypeScript');
      expect(contextFrame).toContain('Node.js');
      expect(contextFrame).toContain('Express');
      expect(contextFrame).toContain('MongoDB');
    });

    test('should include project metadata', () => {
      const contextFrame = buildContextFrame(mockJiraPortfolio, mockCodebaseAnalysis);

      expect(contextFrame).toContain('Test Project');
      expect(contextFrame).toContain('Total Issues: 2');
    });

    test('should include codebase structure information', () => {
      const contextFrame = buildContextFrame(mockJiraPortfolio, mockCodebaseAnalysis);

      expect(contextFrame).toContain('Total Files: 25');
      expect(contextFrame).toContain('Total Size: 45000');
    });

    test('should include quality metrics', () => {
      const contextFrame = buildContextFrame(mockJiraPortfolio, mockCodebaseAnalysis);

      expect(contextFrame).toContain('Test Coverage: 85%');
      expect(contextFrame).toContain('Maintainability Index: 75');
    });

    test('should handle empty stories gracefully', () => {
      const emptyPortfolio = {
        ...mockJiraPortfolio,
        stories: [],
      };

      const contextFrame = buildContextFrame(emptyPortfolio, mockCodebaseAnalysis);
      expect(contextFrame).toBeDefined();
      expect(contextFrame).toContain('TEST-123');
    });

    test('should handle minimal codebase analysis', () => {
      const minimalCodebase: CodebaseAnalysis = {
        files: [],
        structure: {
          directories: [],
          totalFiles: 0,
          totalSize: 0,
        },
        technologies: [],
        dependencies: {
          production: [],
          development: [],
        },
        patterns: {
          architecturalPatterns: [],
          designPatterns: [],
        },
        complexity: {
          cyclomaticComplexity: 0,
          maintainabilityIndex: 0,
        },
        quality: {
          testCoverage: 0,
          codeSmells: 0,
          duplicatedLines: 0,
        },
      };

      const contextFrame = buildContextFrame(mockJiraPortfolio, minimalCodebase);
      expect(contextFrame).toBeDefined();
      expect(contextFrame).toContain('TEST-123');
    });

    test('should include architectural patterns when available', () => {
      const contextFrame = buildContextFrame(mockJiraPortfolio, mockCodebaseAnalysis);

      expect(contextFrame).toContain('MVC');
      expect(contextFrame).toContain('Repository');
      expect(contextFrame).toContain('Factory');
      expect(contextFrame).toContain('Singleton');
    });

    test('should include dependencies information', () => {
      const contextFrame = buildContextFrame(mockJiraPortfolio, mockCodebaseAnalysis);

      expect(contextFrame).toContain('express');
      expect(contextFrame).toContain('mongoose');
      expect(contextFrame).toContain('jest');
      expect(contextFrame).toContain('typescript');
    });

    test('should format context frame as markdown', () => {
      const contextFrame = buildContextFrame(mockJiraPortfolio, mockCodebaseAnalysis);

      // Check for markdown formatting
      expect(contextFrame).toMatch(/^#\s/m); // Headers
      expect(contextFrame).toMatch(/^\*\s/m); // Lists
      expect(contextFrame).toMatch(/\*\*.*\*\*/); // Bold text
    });

    test('should be concise and focused', () => {
      const contextFrame = buildContextFrame(mockJiraPortfolio, mockCodebaseAnalysis);

      // Context frame should be reasonably sized (not too verbose)
      const lines = contextFrame.split('\n').length;
      expect(lines).toBeLessThan(100); // Reasonable upper bound
      expect(lines).toBeGreaterThan(10); // Minimum useful content
    });
  });
});
