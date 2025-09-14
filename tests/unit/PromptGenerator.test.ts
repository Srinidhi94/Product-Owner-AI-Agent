/**
 * Unit Tests for PromptGenerator
 * Tests prompt generation, context integration, and action-oriented instructions
 */

// Mock VS Code first - must be at the top level
const mockOutputChannel = {
  appendLine: jest.fn(),
  show: jest.fn(),
  dispose: jest.fn(),
};

jest.mock('vscode', () => ({
  window: {
    createOutputChannel: jest.fn(() => mockOutputChannel),
  },
}));

import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { PromptGenerator } from '../../src/prompts/PromptGenerator';
import { JiraPortfolio, CodebaseAnalysis, JiraEpic } from '../../src/types';

const mockJiraEpic: JiraEpic = {
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
};

const mockJiraPortfolio: JiraPortfolio = {
  type: 'epic',
  key: 'TEST-123',
  name: 'Test Project',
  description: 'Test project description',
  epics: [mockJiraEpic],
  totalStoryPoints: 13,
};

const mockCodebaseAnalysis: CodebaseAnalysis = {
  projectPath: '/test/project',
  totalFiles: 25,
  packages: ['express', 'mongoose'],
  structs: ['User', 'AuthService'],
  functions: ['authenticate', 'login'],
  imports: ['express', 'mongoose', 'jsonwebtoken'],
  patterns: [
    {
      name: 'MVC',
      description: 'Model-View-Controller pattern',
      confidence: 0.9,
      files: ['src/controllers/', 'src/models/'],
      examples: ['UserController.ts', 'User.model.ts'],
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
  ],
  metrics: {
    linesOfCode: 5000,
    complexity: 'medium',
    maintainability: 75,
    testCoverage: 85,
    technicalDebt: 'low',
  },
};

describe('PromptGenerator', () => {
  let generator: PromptGenerator;

  beforeEach(() => {
    jest.clearAllMocks();
    mockOutputChannel.appendLine.mockClear();
    mockOutputChannel.show.mockClear();
    mockOutputChannel.dispose.mockClear();
    generator = new PromptGenerator(mockOutputChannel as any);
  });

  describe('Constructor', () => {
    test('should initialize successfully', () => {
      expect(generator).toBeInstanceOf(PromptGenerator);
    });
  });

  describe('generateStagePrompt', () => {
    test('should generate prompt for stage 1', async () => {
      const result = await generator.generateStagePrompt(
        'product-requirements-analysis',
        mockJiraPortfolio,
        mockCodebaseAnalysis
      );

      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('role');
      expect(result).toHaveProperty('timestamp');
      expect(result.content).toBeDefined();
      expect(result.id).toBe('product-requirements-analysis');
      expect(result.content).toContain('Senior Product Manager');
    });

    test('should generate prompt for stage 2', async () => {
      const result = await generator.generateStagePrompt(
        'system-architecture-design',
        mockJiraPortfolio,
        mockCodebaseAnalysis
      );

      expect(result.id).toBe('system-architecture-design');
      expect(result.content).toContain('Principal Engineer');
    });

    test('should generate prompt for stage 3', async () => {
      const result = await generator.generateStagePrompt(
        'technical-design-specification',
        mockJiraPortfolio,
        mockCodebaseAnalysis
      );

      expect(result.id).toBe('technical-design-specification');
      expect(result.content).toContain('Principal Engineer');
    });

    test('should generate prompt for stage 4', async () => {
      const result = await generator.generateStagePrompt(
        'implementation-deployment-strategy',
        mockJiraPortfolio,
        mockCodebaseAnalysis
      );

      expect(result.id).toBe('implementation-deployment-strategy');
      expect(result.content).toContain('Principal Engineer');
    });

    test('should generate prompt for stage 5', async () => {
      const result = await generator.generateStagePrompt(
        'sprint-planning-jira-breakdown',
        mockJiraPortfolio,
        mockCodebaseAnalysis
      );

      expect(result.id).toBe('sprint-planning-jira-breakdown');
      expect(result.content).toContain('Product Owner');
    });

    test('should include context file references', async () => {
      const result = await generator.generateStagePrompt(
        'product-requirements-analysis',
        mockJiraPortfolio,
        mockCodebaseAnalysis
      );

      expect(result.content).toContain('CONTEXT.md');
      expect(result.content).toContain('JIRA.md');
      expect(result.content).toContain('CODEBASE.md');
      expect(result.content).toContain('ANALYSIS.md');
    });

    test('should include action-oriented instructions', async () => {
      const result = await generator.generateStagePrompt(
        'product-requirements-analysis',
        mockJiraPortfolio,
        mockCodebaseAnalysis
      );

      expect(result.content).toContain('UPDATE ANALYSIS.md');
      expect(result.content).toContain('ACTION-ORIENTED OUTPUT');
    });

    test('should not include obsolete MCP sections', async () => {
      const result = await generator.generateStagePrompt(
        'product-requirements-analysis',
        mockJiraPortfolio,
        mockCodebaseAnalysis
      );

      // Check that it includes modern MCP guidance instead of obsolete sections
      expect(result.content).toContain('MCP TOOLS & ANALYSIS');
      expect(result.content).not.toContain('Context File References');
    });

    test('should handle empty Jira portfolio', async () => {
      const emptyPortfolio: JiraPortfolio = {
        type: 'epic',
        key: 'EMPTY-123',
        name: 'Empty Project',
        description: '',
        epics: [],
        totalStoryPoints: 0,
      };

      const result = await generator.generateStagePrompt(
        'product-requirements-analysis',
        emptyPortfolio,
        mockCodebaseAnalysis
      );

      expect(result.content).toBeDefined();
      expect(result.id).toBe('product-requirements-analysis');
    });

    test('should handle minimal codebase analysis', async () => {
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

      const result = await generator.generateStagePrompt(
        'system-architecture-design',
        mockJiraPortfolio,
        minimalCodebase
      );

      expect(result.content).toBeDefined();
      expect(result.id).toBe('system-architecture-design');
    });
  });

  describe('prompt quality and structure', () => {
    test('should generate prompts with consistent structure', async () => {
      const stages = [
        'product-requirements-analysis',
        'system-architecture-design',
        'technical-design-specification',
        'implementation-deployment-strategy',
        'sprint-planning-jira-breakdown',
      ];

      for (const stage of stages) {
        const result = await generator.generateStagePrompt(stage, mockJiraPortfolio, mockCodebaseAnalysis);
        expect(result.content).toContain('🎯 YOUR TASK:');
        expect(result.content).toContain('📊 ANALYSIS FRAMEWORK:');
        expect(result.content).toContain('🔧 MCP TOOLS & ANALYSIS:');
        expect(result.content).toContain('✅ ACTION-ORIENTED OUTPUT:');
      }
    });

    test('should build on previous stages sequentially', async () => {
      const result1 = await generator.generateStagePrompt('product-requirements-analysis', mockJiraPortfolio, mockCodebaseAnalysis);
      expect(result1.content).toContain('Stage 1: Product Requirements Analysis');

      const result2 = await generator.generateStagePrompt('system-architecture-design', mockJiraPortfolio, mockCodebaseAnalysis);
      expect(result2.content).toContain('Stage 2: System Architecture');

      // Stage 2 should reference building on Stage 1
      expect(result2.content).toContain('Stage 1');

      // Stage 5 should reference previous stages
      const result5 = await generator.generateStagePrompt('sprint-planning-jira-breakdown', mockJiraPortfolio, mockCodebaseAnalysis);
      expect(result5.content).toContain('previous stages');
    });
  });
});
