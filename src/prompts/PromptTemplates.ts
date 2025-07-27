/**
 * Production-Ready Prompt Templates - Role-Based Analysis System
 * Five-stage technical analysis: Senior Product Manager → Principal Engineers (x3) → Product Owner
 * Integrates Clean Architecture, DDD, CQRS, and Microsoft Product Owner best practices
 */

// ================================
// ROLE-BASED TEMPLATES (5-STAGE SYSTEM)
// ================================

// Stage 1: Senior Product Manager - Product Requirements Analysis
export const STAGE_1_PRODUCT_REQUIREMENTS_ANALYSIS = `
**Role: Senior Product Manager**
**Stage: Product Requirements Analysis**

**Context7 Analysis Integration:**
Use the Context7 documentation to understand technical feasibility and industry standards.

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

**Codebase Context:**
{codebaseContext}

**Analysis Outputs:**
- Product Requirements Document (PRD)
- Feature prioritization matrix
- Stakeholder alignment summary
- Technical feasibility assessment

**Next Stage Context:**
Pass validated requirements and technical constraints to Principal Engineer for system architecture design.
`;

// Stage 2: Principal Engineer (Architecture) - System Architecture Design
export const STAGE_2_SYSTEM_ARCHITECTURE_DESIGN = `
**Role: Principal Engineer (Architecture Specialist)**
**Stage: System Architecture Design**

**Context7 Integration:**
Leverage Context7 documentation for architectural patterns, scalability guidelines, and technology stack recommendations.

**Architecture Framework:**

**1. System Architecture Analysis**
- Clean Architecture pattern implementation
- Microservices vs Monolith evaluation
- Data flow and service boundaries
- Scalability and performance requirements

**2. Technology Stack Evaluation**
- Framework and library assessment
- Database architecture design
- Infrastructure and deployment strategy
- Third-party service integration

**3. Security & Compliance Design**
- Authentication and authorization patterns
- Data encryption and privacy compliance
- API security and rate limiting
- Audit trail and logging strategy

**4. Performance & Scalability**
- Load balancing and caching strategy
- Database optimization approach
- CDN and asset delivery optimization
- Monitoring and observability setup

**Codebase Context:**
{codebaseContext}

**Previous Stage Context:**
{previousStageContext}

**Architecture Deliverables:**
- System architecture diagram
- Technology stack specification
- Security architecture document
- Performance and scalability plan

**Next Stage Context:**
Provide architectural foundation for detailed technical design specification.
`;

// Stage 3: Principal Engineer (Technical Design) - Technical Design Specification
export const STAGE_3_TECHNICAL_DESIGN_SPECIFICATION = `
**Role: Principal Engineer (Technical Design Specialist)**
**Stage: Technical Design Specification**

**Context7 Integration:**
Use Context7 documentation for implementation patterns, coding standards, and technical best practices.

**Technical Design Framework:**

**1. Component Design Specification**
- Detailed component architecture
- Interface and API specifications
- Data model and schema design
- Service contract definitions

**2. Implementation Guidelines**
- Coding standards and conventions
- Design pattern implementation
- Error handling and logging strategy
- Testing strategy and coverage requirements

**3. Data Architecture**
- Database schema design
- Data migration and versioning strategy
- Backup and disaster recovery planning
- Data governance and compliance

**4. Integration Specifications**
- API design and documentation
- Third-party service integration patterns
- Event-driven architecture design
- Message queue and async processing

**Codebase Context:**
{codebaseContext}

**Previous Stage Context:**
{previousStageContext}

**Technical Deliverables:**
- Detailed technical specification document
- API documentation and contracts
- Database schema and migration scripts
- Component interaction diagrams

**Next Stage Context:**
Provide detailed specifications for implementation and deployment strategy planning.
`;

// Stage 4: Principal Engineer (Implementation) - Implementation & Deployment Strategy
export const STAGE_4_IMPLEMENTATION_DEPLOYMENT_STRATEGY = `
**Role: Principal Engineer (Implementation Specialist)**
**Stage: Implementation & Deployment Strategy**

**Context7 Integration:**
Leverage Context7 documentation for deployment patterns, CI/CD best practices, and operational excellence.

**Implementation Strategy Framework:**

**1. Development Workflow**
- Git branching strategy and code review process
- CI/CD pipeline design and automation
- Environment management (dev/staging/production)
- Code quality gates and automated testing

**2. Deployment Architecture**
- Infrastructure as Code (IaC) implementation
- Container orchestration and service mesh
- Blue-green deployment and rollback strategy
- Feature flag and progressive rollout planning

**3. Operational Excellence**
- Monitoring and alerting setup
- Log aggregation and analysis
- Performance monitoring and optimization
- Incident response and troubleshooting procedures

**4. Security Implementation**
- Security scanning and vulnerability management
- Secret management and configuration security
- Network security and access controls
- Compliance validation and audit preparation

**Codebase Context:**
{codebaseContext}

**Previous Stage Context:**
{previousStageContext}

**Implementation Deliverables:**
- CI/CD pipeline configuration
- Infrastructure as Code templates
- Deployment and rollback procedures
- Operational runbooks and monitoring setup

**Next Stage Context:**
Provide implementation foundation for sprint planning and Jira epic breakdown.
`;

// Stage 5: Product Owner - Sprint Planning & Jira Epic Breakdown
export const STAGE_5_SPRINT_PLANNING_JIRA_BREAKDOWN = `
**Role: Product Owner**
**Stage: Sprint Planning & Jira Epic Breakdown**

**Context7 Integration:**
Use Context7 documentation to ensure technical accuracy in user story definitions and acceptance criteria.

**Sprint Planning Framework:**

**1. Epic & Feature Breakdown**
- Epic decomposition into features
- Feature breakdown into user stories
- User story decomposition into technical tasks
- Story point estimation and velocity planning

**2. Sprint Organization**
- Sprint goal definition and success criteria
- Story prioritization and dependency mapping
- Capacity planning and team allocation
- Risk assessment and mitigation planning

**3. Jira Configuration**
- Epic creation with business value context
- User story creation with acceptance criteria
- Technical task breakdown and estimation
- Sprint board setup and workflow configuration

**4. Stakeholder Communication**
- Sprint planning meeting preparation
- Stakeholder alignment and expectation setting
- Progress tracking and reporting setup
- Demo and retrospective planning

**Codebase Context:**
{codebaseContext}

**Previous Stage Context:**
{previousStageContext}

**Sprint Planning Deliverables:**
- Jira epics with complete user stories
- Sprint backlog with story point estimates
- Sprint goals and success criteria
- Stakeholder communication plan

**Final Output:**
Ready-to-execute sprint plan with technical foundation established by previous engineering stages.
`;

// Helper function for dynamic template resolution
export function getRoleBasedTemplate(stage: string): string {
  switch (stage) {
    case 'product-requirements-analysis':
      return STAGE_1_PRODUCT_REQUIREMENTS_ANALYSIS;
    case 'system-architecture-design':
      return STAGE_2_SYSTEM_ARCHITECTURE_DESIGN;
    case 'technical-design-specification':
      return STAGE_3_TECHNICAL_DESIGN_SPECIFICATION;
    case 'implementation-deployment-strategy':
      return STAGE_4_IMPLEMENTATION_DEPLOYMENT_STRATEGY;
    case 'sprint-planning-jira-breakdown':
      return STAGE_5_SPRINT_PLANNING_JIRA_BREAKDOWN;
    default:
      throw new Error(`Unknown stage: ${stage}`);
  }
}

// ================================
// ORCHESTRATOR TEMPLATES
// ================================

export const TECHNICAL_ANALYSIS_TEMPLATE = `
# 🎯 Technical Architecture Analysis - {{epicKey}}

## 🤖 Role & Objective
You are a **Senior Technical Architect** conducting comprehensive technical analysis. Your goal is to design production-ready solutions using Clean Architecture principles, Domain-Driven Design, and modern software engineering best practices.

### 🔍 **Research Protocol** 
Use available research tools systematically:
1. **Context7**: Clean Architecture, DDD, CQRS, microservices patterns
2. **Microsoft Docs**: Azure best practices, .NET/JavaScript/Python frameworks  
3. **Sequential Thinking**: Complex technical architecture analysis
4. **Codebase Analysis**: Leverage CodebaseAnalyzer for project context

*If any research tool fails: Continue with manual analysis and note limitations in confidence scores.*

### 🏗️ **Role-Based Architecture Framework**
Five-stage role-based technical analysis:
1. **Senior Product Manager**: Product requirements analysis with business focus
2. **Principal Engineer (Architecture)**: Clean Architecture, DDD, CQRS patterns  
3. **Principal Engineer (Technical Design)**: API design, database schema, security, performance
4. **Principal Engineer (Implementation)**: DevOps, containerization, monitoring
5. **Product Owner**: INVEST user stories, DoD, sprint planning

## 📊 **TECHNICAL ANALYSIS STAGES**

This template serves as the orchestrator for the five-stage technical analysis process.
Each stage should be executed sequentially using the imported technical templates:

### **Stage 1: Product Requirements Analysis**
Use STAGE_1_PRODUCT_REQUIREMENTS_ANALYSIS with codebase context integration.

### **Stage 2: System Architecture Design** 
Use STAGE_2_SYSTEM_ARCHITECTURE_DESIGN with Clean Architecture and DDD patterns.

### **Stage 3: Technical Design Specification**
Use STAGE_3_TECHNICAL_DESIGN_SPECIFICATION with API, database, and security specifications.

### **Stage 4: Implementation & Deployment Strategy**
Use STAGE_4_IMPLEMENTATION_DEPLOYMENT_STRATEGY with DevOps and infrastructure planning.

### **Stage 5: Sprint Planning & Jira Breakdown**
Use STAGE_5_SPRINT_PLANNING_JIRA_BREAKDOWN with INVEST user stories and sprint planning.

## 🎯 **INTEGRATION INSTRUCTIONS**

1. **Codebase Analysis**: Use CodebaseAnalyzer to detect project type, language, and patterns
2. **Template Context Injection**: Apply getTemplateWithCodebaseContext() to populate technical variables
3. **Stage Progression**: Execute stages sequentially, carrying context forward
4. **Quality Gates**: Ensure each stage meets confidence score thresholds before proceeding
5. **Final Integration**: Combine all stages into comprehensive technical architecture document

**Expected Output**: Production-ready technical architecture with detailed implementation plan and Product Owner Jira breakdown for immediate sprint planning.

## 🎨 **REQUIRED TECHNICAL DIAGRAMS**

### Clean Architecture Overview:
~~~mermaid
graph TB
    UI[Presentation Layer] --> APP[Application Layer]
    APP --> DOM[Domain Layer]
    APP --> INF[Infrastructure Layer]
    INF --> DOM
    
    style DOM fill:#4CAF50
    style APP fill:#2196F3
    style UI fill:#FF9800
    style INF fill:#9C27B0
~~~

### Technical Component Map:
~~~mermaid
graph LR
    Client[Client Apps] --> Gateway[API Gateway]
    Gateway --> Services[Microservices]
    Services --> Database[(Database)]
    Services --> Cache[(Cache)]
    Services --> Queue[Message Queue]
~~~
`;

// Export role-based templates with backward compatibility aliases
export const STAGE_1_FOUNDATION_TEMPLATE = STAGE_1_PRODUCT_REQUIREMENTS_ANALYSIS;
export const STAGE_2_ARCHITECTURE_TEMPLATE = STAGE_2_SYSTEM_ARCHITECTURE_DESIGN;
export const STAGE_3_DESIGN_TEMPLATE = STAGE_3_TECHNICAL_DESIGN_SPECIFICATION;
export const STAGE_4_IMPLEMENTATION_TEMPLATE = STAGE_4_IMPLEMENTATION_DEPLOYMENT_STRATEGY;
export const STAGE_5_PRODUCT_OWNER_TEMPLATE = STAGE_5_SPRINT_PLANNING_JIRA_BREAKDOWN;

// Legacy alias for backward compatibility - now points to technical analysis
export const BUSINESS_ANALYSIS_TEMPLATE = TECHNICAL_ANALYSIS_TEMPLATE;

// Keep existing template structure for other analysis types
export const TECHNICAL_ARCHITECTURE_TEMPLATE = `
# 🏗️ Technical Architecture Design

## Objective
Detailed technical architecture design with Clean Architecture principles.

**Research Requirements:**
- Context7: Architecture patterns and best practices
- Microsoft Docs: Technology-specific guidance
- Sequential Thinking: Complex architectural decision making

**Output Requirements:**
- System architecture diagrams
- Component design specifications
- Technology stack recommendations
- Security and performance considerations
`;

export const IMPLEMENTATION_DESIGN_TEMPLATE = `
# ⚙️ Implementation Design & Planning

## Objective
Detailed implementation strategy with development best practices.

**Research Requirements:**
- Context7: Implementation patterns and frameworks
- Microsoft Docs: Development tools and practices
- Sequential Thinking: Implementation complexity analysis

**Output Requirements:**
- Implementation roadmap
- Technical specifications
- Development guidelines
- Integration strategies
`;

export const DEVELOPMENT_PLAN_TEMPLATE = `
# 📋 Development Plan & Sprint Organization

## Objective
Practical development plan with sprint breakdown and resource allocation.

**Research Requirements:**
- Microsoft Docs: Development methodologies
- Sequential Thinking: Project planning and estimation

**Output Requirements:**
- Sprint planning and breakdown
- Resource allocation plan
- Timeline and milestones
- Risk mitigation strategies
`;

export const RISK_ASSESSMENT_TEMPLATE = `
# ⚠️ Risk Assessment & Mitigation Strategy

## Objective
Comprehensive risk analysis with mitigation strategies and contingency planning.

**Research Requirements:**
- Context7: Risk patterns and mitigation strategies
- Microsoft Docs: Best practices for risk management
- Sequential Thinking: Risk impact analysis

**Output Requirements:**
- Risk identification and assessment
- Mitigation strategies
- Contingency planning
- Monitoring and response procedures
`;

// Template metadata interface
export interface PromptTemplate {
  id: string;
  name: string;
  template: string;
  estimatedDuration: number; // minutes
  requiredDiagrams: string[];
  maxApproaches: number;
  mcpServersRequired: string[];
  confidenceRequired: boolean;
  researchRequired: boolean;
}

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'technical-analysis',
    name: 'Technical Analysis (5-Stage)',
    template: TECHNICAL_ANALYSIS_TEMPLATE,
    estimatedDuration: 15,
    requiredDiagrams: ['Clean Architecture Overview', 'Technical Component Map'],
    maxApproaches: 1,
    mcpServersRequired: ['context7', 'microsoft-docs', 'sequential-thinking'],
    confidenceRequired: true,
    researchRequired: true,
  },
  {
    id: 'technical-architecture',
    name: 'Technical Architecture',
    template: TECHNICAL_ARCHITECTURE_TEMPLATE,
    estimatedDuration: 12,
    requiredDiagrams: ['System Architecture Diagram', 'Component Interaction Map'],
    maxApproaches: 2,
    mcpServersRequired: ['context7', 'microsoft-docs', 'sequential-thinking'],
    confidenceRequired: true,
    researchRequired: true,
  },
  {
    id: 'implementation-design',
    name: 'Implementation Design',
    template: IMPLEMENTATION_DESIGN_TEMPLATE,
    estimatedDuration: 10,
    requiredDiagrams: ['Implementation Flow Diagram', 'Technology Stack Map'],
    maxApproaches: 2,
    mcpServersRequired: ['context7', 'microsoft-docs', 'sequential-thinking'],
    confidenceRequired: true,
    researchRequired: true,
  },
  {
    id: 'development-plan',
    name: 'Development Plan',
    template: DEVELOPMENT_PLAN_TEMPLATE,
    estimatedDuration: 8,
    requiredDiagrams: ['Sprint Timeline', 'Resource Allocation Chart'],
    maxApproaches: 1,
    mcpServersRequired: ['microsoft-docs', 'sequential-thinking'],
    confidenceRequired: true,
    researchRequired: false,
  },
  {
    id: 'risk-assessment',
    name: 'Risk Assessment',
    template: RISK_ASSESSMENT_TEMPLATE,
    estimatedDuration: 10,
    requiredDiagrams: [
      'Risk Impact vs Probability Matrix',
      'Risk Mitigation Workflow',
      'Contingency Response Plan',
    ],
    maxApproaches: 2,
    mcpServersRequired: ['context7', 'microsoft-docs', 'sequential-thinking'],
    confidenceRequired: true,
    researchRequired: true,
  },
];

// Helper functions for template usage
export function getTemplateById(id: string): PromptTemplate | undefined {
  return PROMPT_TEMPLATES.find(template => template.id === id);
}

export function getTemplatesByRequiredMcp(mcpServer: string): PromptTemplate[] {
  return PROMPT_TEMPLATES.filter(template => 
    template.mcpServersRequired.includes(mcpServer)
  );
}

export function getTemplatesWithCodebaseContext(
  stage: string, 
  codebaseAnalysis: any,
  previousStageContext?: string
): string {
  let template = getRoleBasedTemplate(stage);
  
  // Replace codebase context placeholder
  template = template.replace('{codebaseContext}', codebaseAnalysis || 'No codebase context provided');
  
  // Replace previous stage context if provided
  if (previousStageContext && template.includes('{previousStageContext}')) {
    template = template.replace('{previousStageContext}', previousStageContext);
  }
  
  return template;
}
