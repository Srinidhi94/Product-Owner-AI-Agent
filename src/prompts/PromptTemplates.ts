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

**Safety & Grounding Rules:**
- Cite real repository files/paths you used under a "What I used" section.
- If context is insufficient, ask clarifying questions instead of speculating.
- Align all suggestions with existing architecture, patterns, and constraints.
- Provide business value, risk, cost, and expected ROI for key recommendations.

**Analysis Instructions:**
<thinking>
I need to analyze this Jira ticket from a Senior Product Manager perspective, considering multiple strategic approaches to understand:
1. Existing codebase, features and need for the changes requested in Jira
2. Business value and market opportunity
3. User needs and stakeholder requirements
4. Technical feasibility and constraints
5. Strategic alignment and prioritization

Let me think step by step about the most effective approaches to this analysis...
</thinking>

**MCP Integration:**
Use the Context7 mcp to understand technical feasibility and industry standards.
Use the Sequential Thinking mcp to think through in detail
Use these mcps if available or use other tools to ensure high accuracy and best practices

**📊 INPUT DATA:**
<jira_data>
{jiraContext}
</jira_data>

<codebase_context>
**This is just a high level analysis. Go through the codebase in detail and build your own context on the project/codebase and design patterns and existing architecture and structure and features,**

{codebaseContext}
</codebase_context>

**🎯 YOUR TASK:**
As a Senior Product Manager, analyze the provided Jira data and codebase context to create comprehensive product requirements. Focus on current features, business value, user needs, technical feasibility, and strategic alignment.

**📝 OUTPUT INSTRUCTIONS:**
After completing your analysis, use the VS Code command "AI Product Owner: Paste Copilot Response" to automatically integrate your response. The command will:

1. **Auto-detect Stage**: Detect this is Stage 1: Product Requirements Analysis
2. **Update ANALYSIS.md**: 
   - Change status from "⏳ Pending" to "✅ Complete" in the progress table
   - Mark completed column as "✅"
   - Insert your complete analysis under "## Stage 1: Product Requirements Analysis" section
3. **File Structure**: Your response will be saved in the correct section of ANALYSIS.md
4. **Manual Alternative**: If command fails, manually update ANALYSIS.md:
   - Update progress table: \`| Product Requirements Analysis | ✅ Complete | ✅ |\`
   - Paste your response under "## Stage 1: Product Requirements Analysis"

**Required Content Structure:**
- Use the Business Analysis Framework below
- Generate mermaid diagrams with ~~~ formatting 
- Include "What I used" section with file citations

**📊 VISUALIZATION REQUIREMENTS:**
Create these diagrams using mermaid
1. **User Journey Flow**: End-to-end user experience mapping
2. **Stakeholder Mapping**: Key stakeholders and their relationships
3. **Business Process Flow**: Current and proposed business workflows
4. **Feature Prioritization Matrix**: Visual MoSCoW prioritization with effort/impact scoring

**Business Analysis Framework:**

**1. Product Vision & Strategy**
- Market opportunity assessment
- Competitive landscape analysis
- Value proposition definition
- Success metrics and KPIs

**2. Stakeholder Requirements**
- User persona identification
- Business stakeholder needs
- Technical constraint analysis
- Compliance and regulatory requirements

**3. Feature Prioritization**
- MoSCoW method implementation
- Business value scoring
- Technical complexity assessment
- Risk-adjusted roadmap planning

**4. Market Validation**
- User research insights
- Competitive feature analysis
- Technical feasibility validation
- Revenue impact projection

**🔍 EXAMPLE OUTPUT FORMAT:**
<example>
## Executive Summary
[High-level business overview and key recommendations]

## Business Analysis & Market Opportunity
[Market assessment and competitive landscape]

## Stakeholder Requirements
[User personas, business needs, compliance requirements]

## Feature Prioritization Matrix
[MoSCoW analysis with business value scoring]

## Technical Feasibility Assessment
[Constraints and architectural considerations]

## Success Metrics & KPIs
[Measurable outcomes and validation criteria]

## What I used
- [paths and files referenced]

~~~ mermaid
graph TD
    A[User Need] --> B[Feature Assessment]
    B --> C[Business Value]
    C --> D[Implementation Priority]
~~~

~~~ mermaid
.... other such mermaid diagrams
~~~

</example>

**Context for Next Stage:**
Pass validated requirements and technical constraints to Principal Engineer for system architecture design. Include key business drivers, user needs, and technical constraints that will inform architectural decisions.
`;

// Stage 2: Principal Engineer (Architecture) - System Architecture Design
export const STAGE_2_SYSTEM_ARCHITECTURE_DESIGN = `
**Role: Principal Engineer (Architecture Specialist)**
**Stage: System Architecture Design**

**Safety & Grounding Rules:**
- Cite real repository files/paths you used under a "What I used" section.
- If a proposed component is not supported by existing patterns, propose the smallest viable extension and justify ROI and risk.
- Prefer incremental, backward-compatible changes.

**Analysis Instructions:**
<thinking>
Building on the Product Manager's analysis, I need to translate business requirements into technical architecture, considering multiple architectural approaches but most importantly existing codebase patterns and features:

As a Principal Engineer, I should focus on:
1. Reviewing business requirements and constraints from Stage 1
2. Evaluating multiple architectural patterns that could satisfy these requirements based on the existing codebase and patterns
3. Selecting the optimal approach based on existing patterns, scalability, maintainability, and business needs
4. Creating a foundation for implementation planning

Let me think step by step about the best architectural approaches...
</thinking>

**MCP Integration:**
Use the Context7 mcp to understand technical feasibility and industry standards.
Use the Sequential Thinking mcp to think through in detail
Use these mcps if available or use other tools to ensure high accuracy and best practices

**📊 INPUT DATA:**
<jira_data>
{jiraContext}
</jira_data>

<codebase_context>
**This is just a high level analysis. Go through the codebase in detail and build your own context on the project/codebase and design patterns and existing architecture and structure and features,**

{codebaseContext}
</codebase_context>

<previous_analysis>
{previousStageContext}
</previous_analysis>

**🎯 YOUR TASK:**
As a Principal Engineer specializing in Architecture, translate the business requirements from Stage 1 into a comprehensive system architecture. Focus on scalability, maintainability, and alignment with existing codebase patterns. Ensure to incorporate existing modules and components into any diagrams or code references. Do not hallucinate or go off the rails with assumptions and suggestions which do not have a strong foundation to things you can find in the codebase.

**📝 OUTPUT INSTRUCTIONS:**
After completing your analysis, use the VS Code command "AI Product Owner: Paste Copilot Response" to automatically integrate your response. The command will:

1. **Auto-detect Stage**: Detect this is Stage 2: System Architecture Design
2. **Update ANALYSIS.md**: 
   - Change status from "⏳ Pending" to "✅ Complete" in the progress table
   - Mark completed column as "✅"
   - Insert your complete analysis under "## Stage 2: System Architecture Design" section
3. **File Structure**: Your response will be saved in the correct section of ANALYSIS.md
4. **Manual Alternative**: If command fails, manually update ANALYSIS.md:
   - Update progress table: \`| System Architecture Design | ✅ Complete | ✅ |\`
   - Paste your response under "## Stage 2: System Architecture Design"

**Required Content Structure:**
- Use the Architecture Framework below
- Generate mermaid diagrams with ~~~ formatting 
- Include "What I used" section with file citations

**📊 VISUALIZATION REQUIREMENTS:**
Create these diagrams using mermaid
1. **System Architecture Diagram**: High-level system overview with major components
2. **Component Interaction Diagram**: Detailed component relationships and data flow
3. **Deployment Architecture**: Infrastructure layout and deployment strategy
4. **Integration Points Diagram**: External system connections and API integrations

**Architecture Framework:**

**1. Existing System Architecture Analysis**
- Current codebase patterns and architectural decisions evaluation
- Compatibility assessment with existing project structure and conventions
- Integration analysis with current services, APIs, and dependencies and database models
- Workflow mapping: how new requirements fit into existing user journeys and business processes

**2. Use Case Integration & Dependencies**
- Map Jira requirements to existing features and workflows in the codebase
- Identify dependencies on other services, features, or components already implemented
- Analyze integration points with current authentication, authorization, and data flow patterns
- Evaluate impact on existing user experience and functionality

**3. Technology & Pattern Consistency**
- Assess current technology stack utilization and optimization opportunities
- Database architecture evaluation within existing schema and data patterns  
- API design consistency with current endpoints and conventions
- Security and performance alignment with established patterns (while considering improvements)

**4. Architecture Enhancement Recommendations**
- Refactoring suggestions when existing patterns are suboptimal (while maintaining backward compatibility)
- Performance and scalability improvements building on current infrastructure
- Technical debt identification and resolution strategies
- Integration testing and validation approach for new components

**🔍 EXAMPLE OUTPUT FORMAT:**
<example>
## Architecture Overview
[High-level system design and key architectural decisions]

## Existing System Analysis
[Current codebase patterns and compatibility assessment]

## Technology Stack & Integration
[Technology decisions and integration strategies]

## System Components & Dependencies
[Component relationships and data flow]

## Performance & Scalability Plan
[Load handling and optimization strategies]

## Security Architecture
[Authentication, authorization, and data protection]

## What I used
- [paths and files referenced]

~~~ mermaid
graph TB
    subgraph "System Architecture"
        A[API Gateway] --> B[Business Logic Layer]
        B --> C[Data Access Layer]
        C --> D[Database]
    end
~~~

~~~ mermaid
.... other such mermaid diagrams
~~~

</example>

**Context for Next Stage:**
Provide architectural foundation and design constraints for detailed technical design specification. Include chosen patterns, technology decisions, and implementation guidelines.
`;

// Stage 3: Principal Engineer (Technical Design) - Technical Design Specification
export const STAGE_3_TECHNICAL_DESIGN_SPECIFICATION = `
**Role: Principal Engineer (Technical Design Specialist)**
**Stage: Technical Design Specification**

**Safety & Grounding Rules:**
- Follow existing patterns strictly; cite code references for each guideline.
- Provide testability requirements and link to current test frameworks in repo.
- Call out assumptions and confidence.

**Analysis Instructions:**
<thinking>
Building on both the Product Manager's requirements and the Architecture analysis, I need to create detailed technical specifications, considering multiple implementation approaches but most importantly existing codebase patterns and features:

As a Technical Design specialist, I should:
1. Review business requirements and architectural decisions from previous stages
2. Consider multiple implementation approaches that align with the chosen architecture
3. Design detailed components, APIs, and data models
4. Create comprehensive implementation guidelines for development teams

Let me think step by step about the most effective technical design approaches...
</thinking>

**MCP Integration:**
Use the Context7 mcp to understand technical feasibility and industry standards.
Use the Sequential Thinking mcp to think through in detail
Use these mcps if available or use other tools to ensure high accuracy and best practices

**📊 INPUT DATA:**
<jira_data>
{jiraContext}
</jira_data>

<codebase_context>
**This is just a high level analysis. Go through the codebase in detail and build your own context on the project/codebase and design patterns and existing architecture and structure and features,**

{codebaseContext}
</codebase_context>

<previous_analysis>
{previousStageContext}
</previous_analysis>

**🎯 YOUR TASK:**
As a Principal Engineer specializing in Technical Design, create detailed technical specifications based on the architectural foundation from Stage 2. Focus on APIs, data models, component design, and implementation guidelines. Ensure to incorporate existing modules and components into any diagrams or code references. Do not hallucinate or go off the rails with assumptions and suggestions which do not have a strong foundation to things you can find in the codebase.

**📝 OUTPUT INSTRUCTIONS:**
After completing your analysis, use the VS Code command "AI Product Owner: Paste Copilot Response" to automatically integrate your response. The command will:

1. **Auto-detect Stage**: Detect this is Stage 3: Technical Design Specification
2. **Update ANALYSIS.md**: 
   - Change status from "⏳ Pending" to "✅ Complete" in the progress table
   - Mark completed column as "✅"
   - Insert your complete analysis under "## Stage 3: Technical Design Specification" section
3. **File Structure**: Your response will be saved in the correct section of ANALYSIS.md
4. **Manual Alternative**: If command fails, manually update ANALYSIS.md:
   - Update progress table: \`| Technical Design Specification | ✅ Complete | ✅ |\`
   - Paste your response under "## Stage 3: Technical Design Specification"

**Required Content Structure:**
- Use the Technical Design Framework below
- Generate mermaid diagrams with ~~~ formatting 
- Include "What I used" section with file citations

**📊 VISUALIZATION REQUIREMENTS:**
Create these diagrams using mermaid
1. **API Sequence Diagrams**: Request/response flows for key user scenarios
2. **Database Schema Diagram**: Entity relationships and data structure
3. **Class/Component Diagrams**: Object-oriented design and component structure
4. **Data Flow Diagrams**: Information flow through system components

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

**🔍 EXAMPLE OUTPUT FORMAT:**
<example>
## Technical Overview
[Detailed technical approach and design principles]

## API Design & Specifications
[REST/GraphQL endpoints, request/response schemas]

## Data Models & Database Design
[Entity relationships, schema definitions, migrations]

## Component Architecture
[Detailed component design and interface definitions]

## Integration Patterns
[Service communication and event-driven architecture]

## Implementation Guidelines
[Coding standards, patterns, and best practices]

## What I used
- [paths and files referenced]

~~~ mermaid
sequenceDiagram
    participant Client
    participant API
    participant Service
    participant DB
    
    Client->>API: POST /resource
    API->>Service: validateAndProcess()
    Service->>DB: save()
    DB-->>Service: result
    Service-->>API: response
    API-->>Client: 201 Created
~~~

~~~ mermaid
.... other such mermaid diagrams
~~~

</example>

**Context for Next Stage:**
Provide detailed technical specifications and implementation guidelines for implementation and deployment strategy. Include testability requirements, integration points, and quality benchmarks.
`;

// Stage 4: Principal Engineer (Implementation) - Implementation & Deployment Strategy
export const STAGE_4_IMPLEMENTATION_DEPLOYMENT_STRATEGY = `
**Role: Principal Engineer (Implementation Specialist)**
**Stage: Implementation & Deployment Strategy**

**Safety & Grounding Rules:**
- Align with current CI/CD, IaC, and environments. Propose minimal, incremental changes.
- Provide rollout, rollback, and observability plans with SLOs/SLIs.
- Cite repository files and pipelines you are building on.

**Analysis Instructions:**
<thinking>
Building on the complete analysis from Product Manager, Architecture, and Technical Design stages, I need to create a comprehensive implementation and deployment strategy, considering multiple operational approaches  but most importantly existing codebase patterns and features:

As an Implementation specialist, I should:
1. Review all previous technical decisions and design specifications
2. Consider multiple deployment and operational approaches
3. Design robust CI/CD pipelines and operational procedures
4. Create quality gates and monitoring strategies
5. Ensure scalability and reliability of the implementation

Let me think step by step about the best implementation approaches...
</thinking>

**MCP Integration:**
Use the Context7 mcp to understand technical feasibility and industry standards.
Use the Sequential Thinking mcp to think through in detail
Use these mcps if available or use other tools to ensure high accuracy and best practices

**📊 INPUT DATA:**
<jira_data>
{jiraContext}
</jira_data>

<codebase_context>
**This is just a high level analysis. Go through the codebase in detail and build your own context on the project/codebase and design patterns and existing architecture and structure and features,**

{codebaseContext}
</codebase_context>

<previous_analysis>
{previousStageContext}
</previous_analysis>

**🎯 YOUR TASK:**
As a Principal Engineer specializing in Implementation, create a comprehensive implementation and deployment strategy based on all previous technical analysis. Focus on CI/CD, infrastructure, monitoring, and operational excellence. Ensure to incorporate existing modules and components into any diagrams or code references. Do not hallucinate or go off the rails with assumptions and suggestions which do not have a strong foundation to things you can find in the codebase.

**📝 OUTPUT INSTRUCTIONS:**
After completing your analysis, use the VS Code command "AI Product Owner: Paste Copilot Response" to automatically integrate your response. The command will:

1. **Auto-detect Stage**: Detect this is Stage 4: Implementation & Deployment Strategy
2. **Update ANALYSIS.md**: 
   - Change status from "⏳ Pending" to "✅ Complete" in the progress table
   - Mark completed column as "✅"
   - Insert your complete analysis under "## Stage 4: Implementation & Deployment Strategy" section
3. **File Structure**: Your response will be saved in the correct section of ANALYSIS.md
4. **Manual Alternative**: If command fails, manually update ANALYSIS.md:
   - Update progress table: \`| Implementation & Deployment Strategy | ✅ Complete | ✅ |\`
   - Paste your response under "## Stage 4: Implementation & Deployment Strategy"

**Required Content Structure:**
- Use the Implementation Strategy Framework below
- Generate mermaid diagrams with ~~~ formatting 
- Include "What I used" section with file citations

**📊 VISUALIZATION REQUIREMENTS:**
Create these diagrams using mermaid
1. **CI/CD Pipeline Flow**: Automated build, test, and deployment workflow
2. **Infrastructure Architecture**: Environment setup and resource allocation
3. **Monitoring Dashboard Layout**: Key metrics, alerts, and observability
4. **Security & Compliance Flow**: Security controls and audit processes

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

**🔍 EXAMPLE OUTPUT FORMAT:**
<example>
## Implementation Strategy
[Development workflow and coding approach]

## CI/CD Pipeline Design
[Automated build, test, and deployment processes]

## Infrastructure & Environment Management
[Dev/staging/production setup]

## Monitoring & Observability
[Logging, metrics, alerting, and performance tracking]

## Security Implementation
[Security scanning, secret management, compliance]

## Operational Procedures
[Deployment, rollback, incident response, maintenance]

## What I used
- [paths and files referenced]

~~~ mermaid
graph LR
    A[Code Commit] --> B[CI Pipeline]
    B --> C[Tests & Security Scan]
    C --> D[Build & Package]
    D --> E[Deploy to Staging]
    E --> F[Integration Tests]
    F --> G[Deploy to Production]
    G --> H[Monitor & Alert]
~~~

~~~ mermaid
.... other such mermaid diagrams
~~~

</example>

**Context for Next Stage:**
Provide complete technical foundation for Product Owner to create comprehensive documentation and sprint planning. Include implementation roadmap, operational requirements, and quality benchmarks.
`;

// Stage 5: Product Owner - Sprint Planning & Jira Epic Breakdown
export const STAGE_5_SPRINT_PLANNING_JIRA_BREAKDOWN = `
**Role: Product Owner (Integration & Documentation)**
**Stage: Sprint Planning & Jira Breakdown**

**Safety & Grounding Rules:**
- All tickets must reference actual components/files; avoid fictional names.
- Each story includes acceptance criteria, dependencies, and links to architecture/design sections above.
- Provide business value and effort; call out risks and mitigations.

**Analysis Instructions:**
<thinking>
As the Product Owner integrating all previous analysis from PM, Architecture, Technical Design, and Implementation stages, I need to create actionable sprint plans and comprehensive documentation.

All previous analysis should inform:
1. How to structure development sprints effectively
2. What Jira tickets to create for implementation
3. How to prioritize features and technical work
4. What documentation is needed for stakeholders
5. How to track progress and deliverables

I should synthesize all technical and business analysis into executable plans...
</thinking>

**MCP Integration:**
Use the Context7 mcp to understand project management best practices.
Use the Sequential Thinking mcp to think through in detail
Use these mcps if available or use other tools to ensure high accuracy and best practices

**📊 INPUT DATA:**
<jira_data>
{jiraContext}
</jira_data>

<codebase_context>
**This is just a high level analysis. Go through the codebase in detail and build your own context on the project/codebase and design patterns and existing architecture and structure and features,**

{codebaseContext}
</codebase_context>

<previous_analysis>
{previousStageContext}
</previous_analysis>

**🎯 YOUR TASK:**
As the Product Owner, synthesize all previous analysis into actionable sprint plans, Jira ticket breakdowns, and comprehensive project documentation. Create complete roadmap for implementation based on all technical and business analysis.

**📝 OUTPUT INSTRUCTIONS:**
After completing your analysis, use the VS Code command "AI Product Owner: Paste Copilot Response" to automatically integrate your response. The command will:

1. **Auto-detect Stage**: Detect this is Stage 5: Sprint Planning & Jira Breakdown
2. **Update ANALYSIS.md**: 
   - Change status from "⏳ Pending" to "✅ Complete" in the progress table
   - Mark completed column as "✅"
   - Insert your complete analysis under "## Stage 5: Sprint Planning & Jira Breakdown" section
3. **File Structure**: Your response will be saved in the correct section of ANALYSIS.md
4. **Manual Alternative**: If command fails, manually update ANALYSIS.md:
   - Update progress table: \`| Sprint Planning & Jira Breakdown | ✅ Complete | ✅ |\`
   - Paste your response under "## Stage 5: Sprint Planning & Jira Breakdown"

**Required Content Structure:**
- Use the Sprint Planning Framework below
- Generate mermaid diagrams with ~~~ formatting 
- Include "What I used" section with component and path citations

**📊 VISUALIZATION REQUIREMENTS:**
Create these diagrams using mermaid
1. **Sprint Timeline**: Multi-sprint roadmap with dependencies and milestones
2. **Feature Priority Matrix**: Business value vs. implementation complexity
3. **Team Capacity Planning**: Resource allocation across sprints
4. **Risk & Dependency Map**: Critical path and potential blockers

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

**🔍 EXAMPLE OUTPUT FORMAT:**
<example>
## Executive Summary
[Complete project overview with business value and timeline]

## Sprint Planning
### Sprint 1: Foundation (Weeks 1-2)
[Core infrastructure and basic functionality]

### Sprint 2: Core Features (Weeks 3-4)
[Primary business logic and user interfaces]

### Sprint 3: Integration (Weeks 5-6)
[Third-party integrations and advanced features]

## Jira Ticket Breakdown
### Epic 1: Core Infrastructure
- Story 1.1: [Authentication System]
- Story 1.2: [Database Setup]
- Task 1.1.1: [JWT Implementation]

## Resource & Timeline
[Team capacity and milestone planning]

## What I used
- [paths and files referenced]

~~~ mermaid
gantt
    title Sprint Timeline
    dateFormat YYYY-MM-DD
    section Sprint 1
    Foundation Setup :s1, 2024-01-01, 2w
    section Sprint 2
    Core Development :s2, after s1, 2w
    section Sprint 3
    Integration & Testing :s3, after s2, 2w
~~~

~~~ mermaid
.... other such mermaid diagrams
~~~

</example>

**Final Deliverables:**
- Complete project roadmap with sprint timelines
- Detailed Jira ticket breakdown ready for import
- Resource allocation and team planning
- Risk management and contingency plans
- Stakeholder communication framework
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

/**
 * Generate template with codebase context and previous stage context
 */
export function getTemplateWithCodebaseContext(
  stage: string,
  codebaseAnalysis: any,
  previousStageContext?: string
): string {
  let template = getRoleBasedTemplate(stage);

  // Replace codebase context placeholder
  template = template.replace(
    '{codebaseContext}',
    codebaseAnalysis || 'No codebase context provided'
  );

  // Replace previous stage context if provided
  if (previousStageContext && template.includes('{previousStageContext}')) {
    template = template.replace('{previousStageContext}', previousStageContext);
  }

  return template;
}
