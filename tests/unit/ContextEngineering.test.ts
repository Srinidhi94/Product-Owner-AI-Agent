/**
 * Unit Tests for ContextEngineering
 * Tests context frame building and optimization
 */

import { describe, test, expect } from '@jest/globals';
import { buildContextFrame } from '../../src/prompts/ContextEngineering';
import { JiraPortfolio, CodebaseAnalysis } from '../../src/types';

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
      stories: [
        {
          key: 'TEST-124',
          summary: 'User Authentication',
          description: 'Implement user login',
          status: 'To Do',
          storyPoints: 5,
          labels: ['auth'],
          components: ['auth-service'],
          priority: 'High',
          issueType: 'Story',
        },
      ],
      totalPoints: 13,
      created: '2023-01-01',
      updated: '2023-01-02',
    },
  ],
  totalStoryPoints: 13,
};

const mockCodebaseAnalysis: CodebaseAnalysis = {
  projectPath: '/test/project',
  totalFiles: 25,
  packages: ['express', 'mongoose', 'jsonwebtoken'],
  structs: ['AuthService', 'UserController'],
  functions: ['authenticate', 'login', 'createUser'],
  imports: ['express', 'mongoose', 'jsonwebtoken', 'jest', 'typescript'],
  patterns: [
    {
      name: 'MVC',
      description: 'Model-View-Controller pattern',
      confidence: 0.9,
      files: ['src/controllers/', 'src/models/'],
      examples: ['UserController.ts', 'User.model.ts'],
    },
    {
      name: 'Repository',
      description: 'Repository pattern for data access',
      confidence: 0.8,
      files: ['src/repositories/'],
      examples: ['UserRepository.ts'],
    },
  ],
  techStack: [
    {
      name: 'TypeScript',
      version: '4.9.0',
      type: 'framework',
      usage: 'primary',
    },
    {
      name: 'Express',
      version: '4.18.0',
      type: 'framework',
      usage: 'primary',
    },
    {
      name: 'MongoDB',
      version: '6.0.0',
      type: 'database',
      usage: 'primary',
    },
  ],
  metrics: {
    linesOfCode: 5000,
    complexity: 'medium',
    maintainability: 75,
    testCoverage: 85,
    technicalDebt: 'low',
  },
};

describe('ContextEngineering', () => {
  describe('buildContextFrame', () => {
    test('should build context frame with all required sections', () => {
      const contextFrame = buildContextFrame(mockJiraPortfolio, mockCodebaseAnalysis);

      expect(contextFrame).toContain('=== Context Engineering Frame ===');
      expect(contextFrame).toContain('Scope');
      expect(contextFrame).toContain('Grounding Facts');
      expect(contextFrame).toContain('Constraints');
      expect(contextFrame).toContain('=== End Context Frame ===');
    });

    test('should include epic key and project information', () => {
      const contextFrame = buildContextFrame(mockJiraPortfolio, mockCodebaseAnalysis);

      expect(contextFrame).toContain('TEST-123');
      expect(contextFrame).toContain('Test Project');
      expect(contextFrame).toContain('Total Story Points: 13');
    });

    test('should include technology stack information', () => {
      const contextFrame = buildContextFrame(mockJiraPortfolio, mockCodebaseAnalysis);

      expect(contextFrame).toContain('TypeScript@4.9.0');
      expect(contextFrame).toContain('Express@4.18.0');
      expect(contextFrame).toContain('MongoDB@6.0.0');
    });

    test('should include project path and file count', () => {
      const contextFrame = buildContextFrame(mockJiraPortfolio, mockCodebaseAnalysis);

      expect(contextFrame).toContain('Project Path: /test/project');
      expect(contextFrame).toContain('Total Source Files: 25');
    });

    test('should include quality metrics', () => {
      const contextFrame = buildContextFrame(mockJiraPortfolio, mockCodebaseAnalysis);

      expect(contextFrame).toContain('debt=low');
      expect(contextFrame).toContain('maintainability=75/10');
      expect(contextFrame).toContain('complexity=medium');
    });

    test('should handle empty stories gracefully', () => {
      const emptyPortfolio = {
        ...mockJiraPortfolio,
        epics: [
          {
            ...mockJiraPortfolio.epics[0],
            stories: [],
          },
        ],
      };

      const contextFrame = buildContextFrame(emptyPortfolio, mockCodebaseAnalysis);
      expect(contextFrame).toBeDefined();
      expect(contextFrame).toContain('TEST-123');
    });

    test('should handle minimal codebase analysis', () => {
      const minimalCodebase: CodebaseAnalysis = {
        projectPath: '/empty/project',
        totalFiles: 0,
        packages: [],
        structs: [],
        functions: [],
        imports: [],
        patterns: [],
        techStack: [],
        metrics: {
          linesOfCode: 0,
          complexity: 'low',
          maintainability: 0,
          testCoverage: 0,
          technicalDebt: 'low',
        },
      };

      const contextFrame = buildContextFrame(mockJiraPortfolio, minimalCodebase);
      expect(contextFrame).toBeDefined();
      expect(contextFrame).toContain('TEST-123');
      expect(contextFrame).toContain('Project Path: /empty/project');
    });

    test('should include architectural patterns when available', () => {
      const contextFrame = buildContextFrame(mockJiraPortfolio, mockCodebaseAnalysis);

      expect(contextFrame).toContain('Architecture Patterns:');
      expect(contextFrame).toContain('MVC: Model-View-Controller pattern');
      expect(contextFrame).toContain('Repository: Repository pattern for data access');
      expect(contextFrame).toContain('confidence 0.9/10');
      expect(contextFrame).toContain('confidence 0.8/10');
    });

    test('should include dependencies information', () => {
      const contextFrame = buildContextFrame(mockJiraPortfolio, mockCodebaseAnalysis);

      expect(contextFrame).toContain('Dependencies (top): express, mongoose, jsonwebtoken');
      expect(contextFrame).toContain('Notable Imports/Frameworks: express, mongoose, jsonwebtoken');
    });

    test('should include key structural information', () => {
      const contextFrame = buildContextFrame(mockJiraPortfolio, mockCodebaseAnalysis);

      expect(contextFrame).toContain('Key Directories: AuthService, UserController');
      expect(contextFrame).toContain('Representative Functions/Classes: authenticate, login, createUser');
    });

    test('should include constraints and guidelines', () => {
      const contextFrame = buildContextFrame(mockJiraPortfolio, mockCodebaseAnalysis);

      expect(contextFrame).toContain('Adhere to existing code patterns');
      expect(contextFrame).toContain('Do not introduce new tech/libraries unless necessary');
      expect(contextFrame).toContain('Maintain backward compatibility');
    });

    test('should be properly structured and reasonably sized', () => {
      const contextFrame = buildContextFrame(mockJiraPortfolio, mockCodebaseAnalysis);

      // Context frame should be reasonably sized (not too verbose)
      const lines = contextFrame.split('\n').length;
      expect(lines).toBeLessThan(50); // Reasonable upper bound for concise context
      expect(lines).toBeGreaterThan(15); // Minimum useful content

      // Should start and end with proper markers
      expect(contextFrame.startsWith('=== Context Engineering Frame ===')).toBe(true);
      expect(contextFrame.endsWith('=== End Context Frame ===')).toBe(true);
    });
  });
});
