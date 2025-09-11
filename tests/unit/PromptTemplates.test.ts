/**
 * Unit Tests for PromptTemplates Module
 * Tests prompt template functionality and stage management
 */

import { describe, test, expect } from '@jest/globals';
import {
  getRoleBasedTemplate,
  getStageTemplateById,
  getStagesInOrder,
  getStageCount,
  validateStageIntegrity,
  getSequentialStageTemplates,
  StageTemplate,
  MULTI_STAGE_TEMPLATES,
  STAGE_1_PRODUCT_REQUIREMENTS_ANALYSIS,
  STAGE_2_SYSTEM_ARCHITECTURE_DESIGN,
  STAGE_3_TECHNICAL_DESIGN_SPECIFICATION,
  STAGE_4_IMPLEMENTATION_DEPLOYMENT_STRATEGY,
  STAGE_5_SPRINT_PLANNING_JIRA_BREAKDOWN,
} from '../../src/prompts/PromptTemplates';

// Test data
const mockJiraContext = {
  key: 'TEST-123',
  summary: 'Test Epic',
  description: 'Test description',
  status: 'In Progress',
  stories: [],
};

const mockCodebaseContext = {
  files: ['src/test.ts'],
  structure: 'Sample structure',
  technologies: ['TypeScript', 'Node.js'],
};

describe('PromptTemplates', () => {
  describe('Stage Templates', () => {
    test('should have all required stage templates', () => {
      expect(STAGE_1_PRODUCT_REQUIREMENTS_ANALYSIS).toBeDefined();
      expect(STAGE_2_SYSTEM_ARCHITECTURE_DESIGN).toBeDefined();
      expect(STAGE_3_TECHNICAL_DESIGN_SPECIFICATION).toBeDefined();
      expect(STAGE_4_IMPLEMENTATION_DEPLOYMENT_STRATEGY).toBeDefined();
      expect(STAGE_5_SPRINT_PLANNING_JIRA_BREAKDOWN).toBeDefined();
    });

    test('should contain role information in templates', () => {
      expect(STAGE_1_PRODUCT_REQUIREMENTS_ANALYSIS).toContain('Senior Product Manager');
      expect(STAGE_2_SYSTEM_ARCHITECTURE_DESIGN).toContain('Principal Engineer');
      expect(STAGE_3_TECHNICAL_DESIGN_SPECIFICATION).toContain('Principal Engineer');
    });

    test('should not contain obsolete variable substitution patterns', () => {
      expect(STAGE_1_PRODUCT_REQUIREMENTS_ANALYSIS).not.toContain('{jiraContext}');
      expect(STAGE_1_PRODUCT_REQUIREMENTS_ANALYSIS).not.toContain('{codebaseContext}');
      expect(STAGE_2_SYSTEM_ARCHITECTURE_DESIGN).not.toContain('{jiraContext}');
      expect(STAGE_2_SYSTEM_ARCHITECTURE_DESIGN).not.toContain('{codebaseContext}');
      expect(STAGE_3_TECHNICAL_DESIGN_SPECIFICATION).not.toContain('{jiraContext}');
      expect(STAGE_3_TECHNICAL_DESIGN_SPECIFICATION).not.toContain('{codebaseContext}');
    });
  });

  describe('getRoleBasedTemplate', () => {
    test('should return correct template for stage 1', () => {
      const result = getRoleBasedTemplate('product-requirements-analysis');
      expect(result).toBe(STAGE_1_PRODUCT_REQUIREMENTS_ANALYSIS);
    });

    test('should return correct template for stage 2', () => {
      const result = getRoleBasedTemplate('system-architecture-design');
      expect(result).toBe(STAGE_2_SYSTEM_ARCHITECTURE_DESIGN);
    });

    test('should throw error for unknown stage', () => {
      expect(() => getRoleBasedTemplate('unknown-stage')).toThrow('Unknown stage: unknown-stage');
    });
  });

  describe('MULTI_STAGE_TEMPLATES', () => {
    test('should have correct number of templates', () => {
      expect(MULTI_STAGE_TEMPLATES).toHaveLength(5);
    });

    test('should have all required properties', () => {
      MULTI_STAGE_TEMPLATES.forEach((template: StageTemplate) => {
        expect(template).toHaveProperty('id');
        expect(template).toHaveProperty('name');
        expect(template).toHaveProperty('role');
        expect(template).toHaveProperty('description');
        expect(template).toHaveProperty('template');
        expect(template).toHaveProperty('order');
      });
    });

    test('should be ordered correctly', () => {
      for (let i = 0; i < MULTI_STAGE_TEMPLATES.length - 1; i++) {
        expect(MULTI_STAGE_TEMPLATES[i].order).toBeLessThan(MULTI_STAGE_TEMPLATES[i + 1].order);
      }
    });
  });

  describe('getStageTemplateById', () => {
    test('should return correct template for valid id', () => {
      const result = getStageTemplateById('product-requirements-analysis');
      expect(result).toBeDefined();
      expect(result?.id).toBe('product-requirements-analysis');
    });

    test('should return undefined for invalid id', () => {
      const result = getStageTemplateById('invalid-id');
      expect(result).toBeUndefined();
    });
  });

  describe('getStagesInOrder', () => {
    test('should return templates in correct order', () => {
      const stages = getStagesInOrder();
      expect(stages).toHaveLength(5);

      for (let i = 0; i < stages.length - 1; i++) {
        expect(stages[i].order).toBeLessThan(stages[i + 1].order);
      }
    });
  });

  describe('getStageCount', () => {
    test('should return correct number of stages', () => {
      const count = getStageCount();
      expect(count).toBe(5);
    });
  });

  describe('validateStageIntegrity', () => {
    test('should validate stage integrity successfully', () => {
      const result = validateStageIntegrity();
      expect(result).toHaveProperty('isValid');
      expect(result).toHaveProperty('issues');
      expect(Array.isArray(result.issues)).toBe(true);
    });
  });

  describe('getSequentialStageTemplates', () => {
    test('should return templates in sequential order', () => {
      const templates = getSequentialStageTemplates();
      expect(templates).toHaveLength(4); // Only templates that build on previous stage

      for (let i = 0; i < templates.length - 1; i++) {
        expect(templates[i].order).toBeLessThan(templates[i + 1].order);
      }
    });
  });

  describe('Context File Architecture', () => {
    test('should not contain obsolete variable substitution patterns', () => {
      MULTI_STAGE_TEMPLATES.forEach(template => {
        expect(template.template).not.toContain('{jiraContext}');
        expect(template.template).not.toContain('{codebaseContext}');
        expect(template.template).not.toContain('{previousStageContext}');
      });
    });

    test('should reference context files in templates', () => {
      MULTI_STAGE_TEMPLATES.forEach(template => {
        // Templates should focus on instructions and reference context files
        expect(template.template).toContain('🎯 YOUR TASK:');
        expect(template.template).toContain('OUTPUT INSTRUCTIONS');
      });
    });
  });
});
