/**
 * Prompt Templates - Role-Based Analysis System
 * Multi-stage technical analysis
 * Integrates Clean Architecture, Best Practices, Prompt Engineering and Context Engineering
 */

// ================================
// ROLE-BASED TEMPLATES
// ================================

// Stage 1: Senior Product Manager - Product Requirements Analysis
export const STAGE_1_PRODUCT_REQUIREMENTS_ANALYSIS = `
**Role: Senior Product Manager**
**Stage: Product Requirements Analysis**

**📋 CONTEXT FILES TO REVIEW:**
- **[CONTEXT.md](./CONTEXT.md)** - Project constraints and guidelines
- **[JIRA.md](./JIRA.md)** - Complete Jira epic and story details with business context
- **[CODEBASE.md](./CODEBASE.md)** - Technical architecture, patterns, and constraints

**🎯 YOUR TASK:**
As a Senior Product Manager, analyze the Jira requirements and codebase context to create comprehensive product requirements. Ground all analysis in the context files and ensure technical feasibility.

**📊 ANALYSIS FRAMEWORK:**
1. **Business Value Assessment** - Market opportunity, ROI estimation, strategic alignment
2. **Stakeholder Requirements Analysis** - User personas, business needs, technical constraints
3. **Feature Prioritization & Planning** - MoSCoW method, effort vs. impact scoring, risk assessment

**📊 REQUIRED VISUALIZATIONS:**
Create mermaid diagrams for:
1. **User Journey Flow** - End-to-end experience mapping
2. **Feature Priority Matrix** - MoSCoW with effort/impact scoring

**✅ ACTION-ORIENTED OUTPUT:**

**STEP 1: UPDATE ANALYSIS.md**
Add your findings under "## Stage 1: Product Requirements Analysis" section, including:
- Evidence-based analysis with specific Jira keys and file paths
- Confidence scoring (1-10) for major business recommendations
- Context file references linking to specific sections
- **Business Metrics:** Include measurable success criteria and KPIs

**🔧 MCP TOOLS & ANALYSIS:**
Ensure to use your MCP servers and tools to think through this in detail, plan comprehensively while keeping it focused on the requirements and guidelines and do the necessary analysis accurately without any hallucinations. Available tools may include filesystem, sequential-thinking, memory, and others depending on your setup.

**🎯 YOUR ACTION:**
UPDATE the ANALYSIS.md file by adding your complete analysis under the "## Stage 1: Product Requirements Analysis" section. Build your analysis using the following structure:

## Executive Summary
[Business overview with confidence scores and Jira key references]

## Business Analysis & Market Opportunity
[Market assessment grounded in Jira business context]

## Stakeholder Requirements
[Requirements mapped to specific Jira stories with file citations]

## Feature Prioritization Matrix
[MoSCoW analysis with technical feasibility from CODEBASE.md]

## Technical Feasibility Assessment
[Constraints from CODEBASE.md with specific file references]

## Success Metrics & KPIs
[Measurable outcomes linked to Jira acceptance criteria]

[Include required mermaid diagrams]

**Next Stage Context:**
Your analysis will provide validated requirements and technical constraints for the Principal Engineer architecture design stage.
`;

// Stage 2: Principal Engineer (Architecture) - System Architecture Design
export const STAGE_2_SYSTEM_ARCHITECTURE_DESIGN = `
**Role: Principal Engineer (Architecture Specialist)**
**Stage: System Architecture Design**

**📋 CONTEXT FILES TO REVIEW:**
- **[CONTEXT.md](./CONTEXT.md)** - Anti-hallucination protocol and architectural constraints
- **[JIRA.md](./JIRA.md)** - Business requirements and technical acceptance criteria
- **[CODEBASE.md](./CODEBASE.md)** - Current architecture patterns and technical debt
- **[ANALYSIS.md](./ANALYSIS.md)** - Stage 1 business requirements and constraints

**🎯 YOUR TASK:**
Design system architecture that aligns with business requirements from Stage 1 while respecting existing patterns and constraints. Analyze current architecture and propose evidence-based improvements.

**📊 ANALYSIS FRAMEWORK:**
1. **Context Review & Architectural Grounding** - Review constraints, current patterns, business requirements
2. **Existing System Architecture Analysis** - Analyze patterns, assess compatibility, map integration points
3. **Requirements-to-Architecture Mapping** - Translate business requirements to technical components
4. **Architecture Design & Enhancement** - Propose incremental improvements, design scalable solutions

**🔧 MCP TOOLS & ANALYSIS:**
Ensure to use your MCP servers and tools to think through this in detail, plan comprehensively while keeping it focused on the requirements and guidelines and do the necessary analysis accurately without any hallucinations. Available tools may include filesystem, sequential-thinking, memory, and others depending on your setup.

**📊 REQUIRED VISUALIZATIONS:**
Create mermaid diagrams for:
1. **System Architecture Overview** - High-level component relationships
2. **Data Flow Architecture** - Information flow through system components

**✅ ACTION-ORIENTED OUTPUT:**

**STEP 1: UPDATE ANALYSIS.md**
Add your findings under "## Stage 2: System Architecture Analysis" section, including:
- Evidence-based design citing specific files and existing patterns
- Confidence scoring (1-10) for architectural decisions
- Backward compatibility analysis ensuring changes respect existing patterns
- **Technical Debt Assessment:** Identify and plan resolution strategies

**🎯 YOUR ACTION:**
UPDATE the ANALYSIS.md file by adding your complete analysis under the "## Stage 2: System Architecture Design" section, building on the Stage 1 analysis. Use the following structure:

## Architecture Overview
[System design with confidence scores and file references]

## Existing System Analysis
[Current patterns analysis with specific file citations]

## Technology Stack & Integration
[Technology decisions grounded in CODEBASE.md analysis]

## System Components & Dependencies
[Component relationships with existing pattern references]

## Performance & Scalability Plan
[Optimization strategies respecting current constraints]

## Security Architecture
[Security design aligned with existing practices]

[Include required mermaid diagrams]

**Next Stage Context:**
Your architectural analysis will provide the foundation for the technical design specification stage.
`;

// Stage 3: Principal Engineer (Technical Design) - Technical Design Specification
export const STAGE_3_TECHNICAL_DESIGN_SPECIFICATION = `
**Role: Principal Engineer (Technical Design Specialist)**
**Stage: Technical Design Specification**

**📋 CONTEXT FILES TO REVIEW:**
- **[CONTEXT.md](./CONTEXT.md)** - Technical constraints and implementation guidelines
- **[JIRA.md](./JIRA.md)** - Detailed acceptance criteria and technical requirements
- **[CODEBASE.md](./CODEBASE.md)** - Existing patterns, APIs, and data models
- **[ANALYSIS.md](./ANALYSIS.md)** - Stage 1 & 2 requirements and architectural decisions

**🎯 YOUR TASK:**
Create detailed technical specifications based on Stage 2 architecture, focusing on APIs, data models, and implementation guidelines. Ground all designs in existing codebase patterns.

**📊 ANALYSIS FRAMEWORK:**
1. **Context Review & Technical Grounding** - Review context files, find existing patterns, examine implementations
2. **API Design & Integration** - Design consistent APIs, specify formats, define security patterns
3. **Data Model & Storage Design** - Design compatible data structures, specify database interactions
4. **Component Design & Implementation** - Design components following existing patterns

**🔧 MCP TOOLS & ANALYSIS:**
Ensure to use your MCP servers and tools to think through this in detail, plan comprehensively while keeping it focused on the requirements and guidelines and do the necessary analysis accurately without any hallucinations. Available tools may include filesystem, sequential-thinking, memory, and others depending on your setup.

**📊 REQUIRED VISUALIZATIONS:**
Create mermaid diagrams for:
1. **API Sequence Flows** - Request/response patterns for key scenarios
2. **Data Model Relationships** - Entity relationships and schema design

**✅ ACTION-ORIENTED OUTPUT:**

**STEP 1: UPDATE ANALYSIS.md**
Add your findings under "## Stage 3: Technical Design & Implementation" section, including:
- Pattern consistency following existing code patterns and conventions
- Evidence-based design citing specific files and implementation examples
- Confidence scoring (1-10) for technical design decisions
- **Testing Strategy:** Plan testing based on existing test infrastructure
- **Implementation Guidance:** Provide clear, actionable implementation steps

**Technical Design Framework:**

**1. Implementation Guidelines Based on Existing Patterns**
- Detailed component design following current codebase conventions and structure
- Code references to existing similar implementations and patterns in the project
- Interface and API specifications consistent with current service contracts
- Data model extensions building on existing schema and entity relationships

**2. Pattern-Based Development Standards**
- Coding standards alignment with current project conventions (reference existing code examples)
- Design pattern implementation following established project patterns
- Error handling and logging integration with existing infrastructure and standards
- Testing strategy extensions building on current test framework and coverage approach

**3. Data Architecture Integration**
- Database schema changes and extensions to existing structure
- Data migration strategy considering current data and versioning patterns
- Integration with existing backup, disaster recovery, and data governance procedures
- Performance optimization building on current database optimization strategies

**4. Codebase Integration Specifications**
- API design and documentation following current API patterns and standards
- Integration patterns with existing services and third-party systems (reference current implementations)
- Event-driven architecture alignment with current messaging and async processing patterns
- Refactoring recommendations for existing code that needs improvement to support new features

**🎯 YOUR ACTION:**
UPDATE the ANALYSIS.md file by adding your complete analysis under the "## Stage 3: Technical Design Specification" section, building on Stages 1-2 analysis. Use the following structure:

## Technical Overview
[Design approach with confidence scores and pattern references]

## API Design & Specifications
[Endpoints based on existing API patterns with file citations]

## Data Models & Database Design
[Schema design aligned with current data structures]

## Component Architecture
[Component design following existing architectural patterns]

## Integration Patterns
[Integration approach consistent with current service patterns]

## Implementation Guidelines
[Coding standards based on existing project conventions]

[Include required mermaid diagrams]

**Next Stage Context:**
Your technical specifications will guide the implementation and deployment strategy stage.
`;

// Stage 4: Principal Engineer (Implementation) - Implementation & Deployment Strategy
export const STAGE_4_IMPLEMENTATION_DEPLOYMENT_STRATEGY = `
**Role: Principal Engineer (Implementation Specialist)**
**Stage: Implementation & Deployment Strategy**

**📋 CONTEXT FILES TO REVIEW:**
- **[CONTEXT.md](./CONTEXT.md)** - Deployment constraints and operational guidelines
- **[JIRA.md](./JIRA.md)** - Implementation requirements and acceptance criteria
- **[CODEBASE.md](./CODEBASE.md)** - Current CI/CD, build, and deployment infrastructure
- **[ANALYSIS.md](./ANALYSIS.md)** - Stages 1-3 requirements, architecture, and technical design

**🎯 YOUR TASK:**
Create comprehensive implementation and deployment strategy based on Stages 1-3 analysis. Focus on CI/CD integration, quality gates, monitoring, and operational procedures. Ground all strategies in existing infrastructure and deployment patterns.

**🔧 MCP TOOLS & ANALYSIS:**
Ensure to use your MCP servers and tools to think through this in detail, plan comprehensively while keeping it focused on the requirements and guidelines and do the necessary analysis accurately without any hallucinations. Available tools may include filesystem, sequential-thinking, memory, and others depending on your setup.

**📊 ANALYSIS FRAMEWORK:**

**1. Infrastructure & Deployment Assessment**
- Examine existing CI/CD pipelines and deployment configurations
- Review current build processes, testing infrastructure, and quality gates
- Analyze monitoring, logging, and observability systems
- Assess current deployment environments and infrastructure patterns

**2. Implementation Strategy Design**
- Plan phased implementation approach based on technical design
- Design quality gates and testing strategies aligned with existing frameworks
- Specify deployment procedures following current operational patterns
- Plan rollback and disaster recovery procedures

**3. Operational Excellence Planning**
- Design monitoring and alerting strategies based on existing observability
- Plan performance benchmarks and SLA/SLO definitions
- Specify maintenance and support procedures
- Design capacity planning and scaling strategies

**📊 ANALYSIS FRAMEWORK:**
1. **Infrastructure & Deployment Assessment** - Examine CI/CD pipelines, build processes, monitoring systems
2. **Implementation Strategy Design** - Plan phased approach, quality gates, deployment procedures
3. **Operational Excellence Planning** - Design monitoring, performance benchmarks, maintenance procedures

**📊 REQUIRED VISUALIZATIONS:**
Create mermaid diagrams for:
1. **CI/CD Pipeline Flow** - Build, test, and deployment automation
2. **Infrastructure Architecture** - Environment setup and resource allocation

**✅ ACTION-ORIENTED OUTPUT:**

**STEP 1: UPDATE ANALYSIS.md**
Add your findings under "## Stage 4: Implementation Strategy & Technical Design" section, including:
- Infrastructure consistency following existing CI/CD and deployment patterns
- Evidence-based strategy citing specific configuration files and pipeline examples
- Confidence scoring (1-10) for implementation decisions
- **Operational Excellence:** Plan monitoring based on existing observability infrastructure
- **Risk Management:** Provide rollback and disaster recovery procedures

**Implementation Strategy Framework:**

**1. Current Development Workflow Analysis & Enhancement**
- Existing Git branching strategy evaluation and optimization recommendations
- Current CI/CD pipeline assessment and improvement opportunities
- Environment management analysis (dev/staging/production) and enhancement proposals
- Code quality gates and automated testing integration with existing infrastructure

**2. Existing Deployment Architecture Assessment**
- Current deployment infrastructure analysis and optimization opportunities (terraform, deployment scripts, GitHub Actions)
- Enhancement of existing deployment strategy (blue-green, rollback procedures)
- Feature flag and progressive rollout integration with current deployment process

**3. Operational Excellence Building on Current Setup**
- Current monitoring and alerting assessment and enhancement recommendations
- Existing log aggregation and analysis system improvements
- Performance monitoring optimization building on current infrastructure
- Incident response and troubleshooting procedure enhancements

**4. Security Implementation Analysis**
- Current security scanning and vulnerability management evaluation
- Existing secret management and configuration security assessment
- Network security and access controls analysis and improvements

**🎯 YOUR ACTION:**
UPDATE the ANALYSIS.md file by adding your complete analysis under the "## Stage 4: Implementation & Deployment Strategy" section, building on Stages 1-3 analysis. Use the following structure:

## Implementation Strategy
[Development workflow with confidence scores and infrastructure references]

## CI/CD Pipeline Design
[Automated processes based on existing pipeline patterns]

## Infrastructure & Environment Management
[Environment setup aligned with current infrastructure]

## Monitoring & Observability
[Observability strategy based on existing monitoring systems]

## Security Implementation
[Security approach consistent with current security practices]

## Operational Procedures
[Procedures aligned with existing operational patterns]

**CRITICAL: UPDATE ANALYSIS.md FILE**
After completing your analysis, you MUST update the ANALYSIS.md file by adding your findings under the "## Stage 4: Implementation Strategy & Technical Design" section. Build upon the previous stages' content sequentially.

[Include required mermaid diagrams]

**Next Stage Context:**
Your implementation strategy will inform the final sprint planning and Jira breakdown stage.
`;

// Stage 5: Product Owner - Sprint Planning & Jira Epic Breakdown
export const STAGE_5_SPRINT_PLANNING_JIRA_BREAKDOWN = `
**Role: Product Owner (Integration & Documentation)**
**Stage: Sprint Planning & Jira Breakdown**

**📋 CONTEXT FILES TO REVIEW:**
- **[CONTEXT.md](./CONTEXT.md)** - Project constraints and business requirements
- **[JIRA.md](./JIRA.md)** - Epic details and acceptance criteria for sprint planning
- **[CODEBASE.md](./CODEBASE.md)** - Technical complexity assessment for story sizing
- **[ANALYSIS.md](./ANALYSIS.md)** - Complete analysis from all previous stages

**🎯 YOUR TASK:**
Synthesize all previous analysis into actionable sprint plans, Jira ticket breakdowns, and comprehensive project documentation. Create complete implementation roadmap based on business requirements, architecture, technical design, and deployment strategy.

**📊 ANALYSIS FRAMEWORK:**
1. **Comprehensive Analysis Integration** - Review and synthesize all previous analyses, identify deliverables and dependencies
2. **Sprint Planning & Roadmap Development** - Create multi-sprint roadmap, plan capacity and velocity
3. **Jira Epic & Story Breakdown** - Create epic breakdown, design user stories with acceptance criteria
4. **Risk Management & Quality Assurance** - Identify risks, plan quality gates and testing requirements

**🔧 MCP TOOLS & ANALYSIS:**
Ensure to use your MCP servers and tools to think through this in detail, plan comprehensively while keeping it focused on the requirements and guidelines and do the necessary analysis accurately without any hallucinations. Available tools may include filesystem, sequential-thinking, memory, and others depending on your setup.

**📊 REQUIRED VISUALIZATIONS:**
Create mermaid diagrams for:
1. **Sprint Timeline & Roadmap** - Multi-sprint plan with dependencies and milestones
2. **Feature Priority Matrix** - Business value vs. technical complexity analysis

**✅ ACTION-ORIENTED OUTPUT:**

**STEP 1: UPDATE ANALYSIS.md**
Add your findings under "## Stage 5: Sprint Planning & Jira Breakdown" section, including:
- Actionable planning with specific, implementable sprint plans and tickets
- Evidence-based prioritization grounded in business value and technical analysis
- Realistic estimation sizing stories based on technical complexity assessment
- **Risk Mitigation:** Identify and plan for technical and business risks
- **Stakeholder Alignment:** Ensure plans align with business requirements and constraints

**Sprint Planning Framework:**

**1. Executive Summary & Project Overview**
- Complete project synopsis integrating all analysis stages
- Key stakeholder summary with business value proposition
- Overall timeline and resource requirements
- Success metrics and acceptance criteria

**2. Sprint Breakdown & Timeline Planning**
- Comprehensive sprint planning based on all technical analysis
- Feature prioritization using business value and technical complexity
- Sprint capacity planning with realistic velocity estimates
- Dependency management and critical path identification

**3. Comprehensive Jira Ticket Structure**
- Epic-level breakdown aligned with architecture and technical design
- Story-level tickets with detailed acceptance criteria
- Technical task breakdown including infrastructure and CI/CD
- Bug prevention and quality assurance ticket planning

**4. Resource Allocation & Team Planning**
- Development team capacity and skill requirement analysis
- Technical leadership and architectural review scheduling
- Quality assurance and testing resource planning
- DevOps and infrastructure team coordination

**5. Risk Management & Contingency Planning**
- Technical risk assessment based on implementation analysis
- Business risk evaluation and mitigation strategies
- Timeline contingency planning with buffer allocation
- Quality gates and milestone checkpoints

**6. Stakeholder Communication Plan**
- Progress reporting and status update schedules
- Technical review and approval process
- Business stakeholder engagement and feedback loops
- Documentation and knowledge transfer planning

**🔍 ACTION-ORIENTED OUTPUT:**

**STEP 1: UPDATE ANALYSIS.md**
Add the following sections under "## Stage 5: Sprint Planning & Jira Breakdown":
- Executive Summary with project overview and business value
- Sprint Planning & Roadmap with multi-sprint timeline
- Jira Epic & Story Breakdown with detailed tickets
- Resource Allocation & Timeline with capacity planning
- Risk Management & Quality Gates with mitigation strategies
- Stakeholder Communication Plan with reporting processes

**STEP 2: CREATE IMPLEMENTATION ARTIFACTS**
Generate actionable deliverables that can be immediately used by development teams

**CRITICAL: UPDATE ANALYSIS.md FILE**
After completing your analysis, you MUST update the ANALYSIS.md file by adding your findings under the "## Stage 5: Sprint Planning & Jira Breakdown" section. This is the final stage - ensure your content builds upon and synthesizes all previous stages' analysis.

[Include required mermaid diagrams]

**Final Deliverables:**
Complete implementation roadmap with actionable sprint plans, detailed Jira tickets, resource allocation, and risk management framework.
`;

// Helper function for dynamic template resolution
export function getRoleBasedTemplate(stage: string): string {
  const stageTemplate = MULTI_STAGE_TEMPLATES.find(t => t.id === stage);
  if (!stageTemplate) {
    throw new Error(`Unknown stage: ${stage}`);
  }
  return stageTemplate.template;
}

// ================================
// TEMPLATE METADATA
// ================================

export interface StageTemplate {
  id: string;
  name: string;
  role: string;
  icon: string;
  description: string;
  order: number;
  template: string;
  mcpServersRecommended: string[];
  buildsOnPreviousStage: boolean;
}

export const MULTI_STAGE_TEMPLATES: StageTemplate[] = [
  {
    id: 'product-requirements-analysis',
    name: 'Product Requirements Analysis',
    role: 'Senior Product Manager',
    icon: '📋',
    description: 'Analyze business requirements and user needs',
    order: 1,
    template: STAGE_1_PRODUCT_REQUIREMENTS_ANALYSIS,
    mcpServersRecommended: ['context7', 'microsoft-docs', 'sequential-thinking'],
    buildsOnPreviousStage: false,
  },
  {
    id: 'system-architecture-design',
    name: 'System Architecture Design',
    role: 'Principal Engineer (Architecture)',
    icon: '🏗️',
    description: 'Design system architecture and technical approach',
    order: 2,
    template: STAGE_2_SYSTEM_ARCHITECTURE_DESIGN,
    mcpServersRecommended: ['context7', 'microsoft-docs', 'sequential-thinking'],
    buildsOnPreviousStage: true,
  },
  {
    id: 'technical-design-specification',
    name: 'Technical Design Specification',
    role: 'Principal Engineer (Technical Design)',
    icon: '🔧',
    description: 'Create detailed technical specifications',
    order: 3,
    template: STAGE_3_TECHNICAL_DESIGN_SPECIFICATION,
    mcpServersRecommended: ['context7', 'microsoft-docs', 'sequential-thinking'],
    buildsOnPreviousStage: true,
  },
  {
    id: 'implementation-deployment-strategy',
    name: 'Implementation & Deployment Strategy',
    role: 'Principal Engineer (Implementation)',
    icon: '🚀',
    description: 'Plan implementation and deployment approach',
    order: 4,
    template: STAGE_4_IMPLEMENTATION_DEPLOYMENT_STRATEGY,
    mcpServersRecommended: ['context7', 'microsoft-docs', 'sequential-thinking'],
    buildsOnPreviousStage: true,
  },
  {
    id: 'sprint-planning-jira-breakdown',
    name: 'Sprint Planning & Jira Breakdown',
    role: 'Product Owner',
    icon: '📚',
    description: 'Break down work into actionable sprint tasks',
    order: 5,
    template: STAGE_5_SPRINT_PLANNING_JIRA_BREAKDOWN,
    mcpServersRecommended: ['microsoft-docs', 'sequential-thinking'],
    buildsOnPreviousStage: true,
  },
];

// ==========================
// UTILITY FUNCTIONS
// ==========================

/**
 * Get stage template by ID
 */
export function getStageTemplateById(id: string): StageTemplate | undefined {
  return MULTI_STAGE_TEMPLATES.find(template => template.id === id);
}

/**
 * Get all stages in order
 */
export function getStagesInOrder(): StageTemplate[] {
  return [...MULTI_STAGE_TEMPLATES].sort((a, b) => a.order - b.order);
}

/**
 * Get stage count for dynamic sizing
 */
export function getStageCount(): number {
  return MULTI_STAGE_TEMPLATES.length;
}

/**
 * Add new stage dynamically (for future extensibility)
 */
export function validateStageIntegrity(): { isValid: boolean; issues: string[] } {
  const issues: string[] = [];
  const stages = getStagesInOrder();

  // Check for duplicate IDs
  const ids = stages.map(s => s.id);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicateIds.length > 0) {
    issues.push(`Duplicate stage IDs found: ${duplicateIds.join(', ')}`);
  }

  // Check for duplicate orders
  const orders = stages.map(s => s.order);
  const duplicateOrders = orders.filter((order, index) => orders.indexOf(order) !== index);
  if (duplicateOrders.length > 0) {
    issues.push(`Duplicate stage orders found: ${duplicateOrders.join(', ')}`);
  }

  // Check for missing templates
  stages.forEach(stage => {
    if (!stage.template || typeof stage.template !== 'string') {
      issues.push(`Stage ${stage.id} is missing a valid template`);
    }
  });

  return {
    isValid: issues.length === 0,
    issues,
  };
}

/**
 * Get templates that build on previous stages
 */
export function getSequentialStageTemplates(): StageTemplate[] {
  return MULTI_STAGE_TEMPLATES.filter(template => template.buildsOnPreviousStage);
}

