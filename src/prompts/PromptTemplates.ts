/**
 * Advanced Prompt Templates - Multi-Stage Visual Analysis System
 * Each template focuses on specific domain expertise with required Mermaid diagrams
 */

export const BUSINESS_ANALYSIS_TEMPLATE = `
# Business Analysis - {{epicKey}}

## Your Role
Senior product manager with UX design expertise. Focus on user impact and business value.

## Context  
{{jiraContext}}
{{codebaseContext}}

## Required Analysis

### 1. Problem Definition
- Core business problem and user pain points
- Target personas and their current workflows  
- Market opportunity and competitive landscape

### 2. User Impact Analysis  
- Primary users and their success metrics
- Secondary stakeholders affected
- Quantifiable business benefits expected

### 3. Success Criteria
- Measurable KPIs and acceptance criteria
- User satisfaction improvements
- Business process optimizations

## REQUIRED MERMAID DIAGRAMS

### User Journey Map (Current State):
~~~mermaid
journey
    title Current User Authentication Process
    section Login Attempt
      Enter Credentials    : 2: User
      Wait for Validation  : 1: User  
      Handle Errors        : 1: User
    section Success Path
      Access Granted       : 4: User
      Navigate to App      : 5: User
~~~

### Stakeholder Impact Map:
~~~mermaid
graph TB
    A[Primary Users] --> B[Authentication System]
    C[Support Team] --> B  
    D[Security Team] --> B
    B --> E[Business Value]
    
    style A fill:#e1f5fe
    style E fill:#e8f5e8
~~~

Provide comprehensive business analysis with clear user-centered justification.
`;

export const TECHNICAL_ARCHITECTURE_TEMPLATE = `
# Technical Architecture Analysis - {{epicKey}}

## Your Role
Senior software architect with 10+ years Go microservice experience.

## Context
{{businessAnalysis}}
{{codebaseContext}}  
{{context7Docs}}

## Required Analysis

### 1. Current State Assessment
- Existing system capabilities and constraints
- Technical debt and architectural limitations
- Performance and scalability characteristics

### 2. Proposed Architecture
- System components affected and modified
- New components required with clear interfaces
- Integration points and data flow patterns

### 3. Technical Decisions
- Architecture patterns chosen and rationale
- Technology selections with justification
- Performance and scalability considerations

## REQUIRED MERMAID DIAGRAMS

### Current System Architecture:
~~~mermaid
graph TB
    A[Current Frontend] --> B[Existing API]
    B --> C[Current Auth]
    B --> D[User Service]
    C --> E[Simple Token Store]
    
    style C fill:#ffebee
    style E fill:#ffebee
~~~

### Proposed System Architecture:
~~~mermaid
graph TB
    A[Frontend App] --> B[API Gateway]  
    B --> C[Enhanced Auth Service]
    B --> D[User Service]
    C --> E[JWT Token Store]
    D --> F[User Database]
    
    style C fill:#e8f5e8
    style E fill:#e8f5e8
~~~

### Data Flow Diagram:
~~~mermaid
flowchart LR
    A[User Request] --> B[Validation]
    B --> C[Token Generation]
    C --> D[Response]
    D --> E[Client Storage]
~~~

Use Context7 documentation for all Go/GORM/Gin best practices.
`;

export const IMPLEMENTATION_DESIGN_TEMPLATE = `
# Implementation Design - {{epicKey}}

## Your Role
Technical lead responsible for detailed implementation planning and code design.

## Context
{{businessAnalysis}}
{{technicalArchitecture}}
{{codebaseContext}}

## Required Analysis

### 1. Implementation Approach
Provide ONLY 1-2 implementation approaches (maximum 2):

**Approach 1** (Recommended):
- Implementation strategy and key technical decisions
- Go code structure and package organization  
- Database schema and migration approach
- API design with request/response examples
- Effort estimation and development timeline
- Risk assessment and mitigation strategies

**Approach 2** (If significantly different):
- Alternative implementation strategy
- Different technical approach and rationale
- Comparative effort and timeline analysis
- Trade-off analysis vs Approach 1

### 2. Detailed Technical Specifications
For the recommended approach:
- Go code examples for key components
- API endpoint specifications with curl examples
- Database schema with migration SQL
- Configuration and environment setup
- Testing strategy and test cases

## REQUIRED MERMAID DIAGRAMS

### Sequence Diagram - Login Flow:
~~~mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as Auth API
    participant D as Database
    
    U->>F: Enter credentials
    F->>A: POST /auth/login
    A->>D: Validate user
    D-->>A: User data
    A->>A: Generate JWT
    A-->>F: Return token
    F-->>U: Login success
~~~

### Component Interaction:
~~~mermaid
graph TB
    A[Auth Handler] --> B[Validation Service]
    B --> C[User Repository]  
    A --> D[JWT Service]
    D --> E[Token Store]
    
    style A fill:#fff3e0
    style D fill:#e8f5e8
~~~

### Database Schema:
~~~
erDiagram
    USER {
        int id PK
        string email
        string password_hash
        timestamp created_at
        timestamp updated_at
    }
    
    TOKEN {
        string token_id PK
        int user_id FK
        timestamp expires_at
        boolean revoked
    }
    
    USER ||--o{ TOKEN : has
~~~

Focus on implementable, specific technical details with working code examples.
`;

export const DEVELOPMENT_PLAN_TEMPLATE = `
# Development Plan - {{epicKey}}

## Your Role
Engineering manager with expertise in Go development workflows and sprint planning.

## Context
{{businessAnalysis}}
{{technicalArchitecture}}
{{implementationDesign}}
{{codebaseContext}}

## Required Analysis

### 1. Implementation Strategy
Choose ONLY 1-2 development approaches (maximum 2):

**Approach 1** (Recommended):
- Development phases with clear deliverables
- Sprint breakdown with story point estimation
- Team roles and skill requirements
- Development environment and tooling setup
- Testing strategy and quality gates
- Deployment pipeline and rollout plan

**Approach 2** (If applicable):
- Alternative phasing strategy
- Different team structure or timeline
- Comparative risk and resource analysis
- Trade-off justification vs Approach 1

### 2. Detailed Sprint Planning
For the recommended approach:
- Sprint-by-sprint breakdown with specific tasks
- Story point estimates and velocity assumptions
- Critical path dependencies and blockers
- Quality assurance and testing milestones
- Risk mitigation and contingency plans

### 3. Resource Requirements
- Team composition and skill matrix
- External dependencies and integrations
- Infrastructure and tooling requirements
- Timeline with buffer for unknowns

## REQUIRED MERMAID DIAGRAMS

### Development Timeline (Gantt):
~~~mermaid
gantt
    title Development Timeline
    dateFormat  YYYY-MM-DD
    section Phase 1
    Auth Service Setup    :active, p1, 2024-01-01, 2w
    Database Schema       :p2, after p1, 1w
    section Phase 2
    API Development       :p3, after p2, 3w
    Frontend Integration  :p4, after p3, 2w
    section Phase 3
    Testing & QA          :p5, after p4, 2w
    Production Deploy     :p6, after p5, 1w
~~~

### Task Dependencies:
~~~mermaid
graph TB
    A[Database Setup] --> B[Auth Service]
    B --> C[API Endpoints]
    C --> D[Frontend Integration]
    A --> E[Migration Scripts]
    E --> F[Data Validation]
    D --> G[Integration Testing]
    F --> G
    G --> H[Production Deployment]
    
    style A fill:#e3f2fd
    style H fill:#e8f5e8
~~~

### Team Workflow:
~~~mermaid
flowchart TD
    A[Sprint Planning] --> B[Development]
    B --> C[Code Review]
    C --> D[Testing]
    D --> E{Quality Gate}
    E -->|Pass| F[Deploy to Staging]
    E -->|Fail| B
    F --> G[User Acceptance]
    G --> H[Production Release]
    
    style E fill:#fff3e0
    style H fill:#e8f5e8
~~~

Provide actionable development plan with realistic timelines and clear deliverables.
`;

export const RISK_ASSESSMENT_TEMPLATE = `
# Risk Assessment & Mitigation - {{epicKey}}

## Your Role
Senior technical program manager with experience in large-scale Go system deployments.

## Context
{{businessAnalysis}}
{{technicalArchitecture}}
{{implementationDesign}}
{{developmentPlan}}
{{codebaseContext}}

## Required Analysis

### 1. Risk Identification & Assessment
Provide ONLY 1-2 risk mitigation strategies (maximum 2):

**Strategy 1** (Primary):
- Critical risks (High impact, High probability)
- Major risks (High impact, Medium probability)
- Moderate risks (Medium impact, Medium probability)
- Risk interdependencies and cascade effects
- Mitigation actions with clear ownership
- Contingency plans for high-risk scenarios

**Strategy 2** (Alternative - if significantly different):
- Alternative risk prioritization approach
- Different mitigation tactics
- Resource allocation comparison
- Effectiveness analysis vs Strategy 1

### 2. Detailed Risk Analysis
For each identified risk:
- Probability assessment (Low/Medium/High)
- Business impact evaluation (Low/Medium/High/Critical)
- Technical complexity factors
- External dependency risks
- Timeline and resource risks
- Quality and performance risks

### 3. Mitigation Plans
- Specific actions to reduce probability
- Impact reduction strategies
- Early warning indicators
- Escalation procedures
- Success metrics for risk reduction

## REQUIRED MERMAID DIAGRAMS

### Risk Impact Matrix:
~~~mermaid
quadrantChart
    title Risk Assessment Matrix
    x-axis Low Impact --> High Impact
    y-axis Low Probability --> High Probability
    quadrant-1 Monitor
    quadrant-2 Mitigate
    quadrant-3 Accept
    quadrant-4 Avoid
    
    Database Migration: [0.8, 0.7]
    Auth Integration: [0.6, 0.4]
    Performance Issues: [0.7, 0.5]
    Security Vulnerabilities: [0.9, 0.3]
~~~

### Mitigation Flow:
~~~
flowchart TD
    A[Risk Identified] --> B{Risk Level}
    B -->|High| C[Immediate Action]
    B -->|Medium| D[Planned Mitigation]
    B -->|Low| E[Monitor]
    
    C --> F[Execute Mitigation]
    D --> G[Schedule Mitigation]
    F --> H[Validate Results]
    G --> H
    H --> I{Risk Reduced?}
    I -->|Yes| J[Continue Monitoring]
    I -->|No| K[Escalate]
    
    style C fill:#ffebee
    style J fill:#e8f5e8
    style K fill:#fff3e0
~~~

### Contingency Plan:
~~~mermaid
graph TB
    A[Risk Triggers] --> B[Assessment]
    B --> C{Severity}
    C -->|Critical| D[Emergency Response]
    C -->|High| E[Rapid Response]
    C -->|Medium| F[Standard Response]
    
    D --> G[Immediate Rollback]
    E --> H[Hotfix Deployment]
    F --> I[Scheduled Fix]
    
    G --> J[Post-Incident Review]
    H --> J
    I --> J
    
    style D fill:#ffebee
    style G fill:#ffcdd2
    style J fill:#f3e5f5
~~~

Focus on actionable risk management with clear ownership and measurable outcomes.
`;

export interface PromptTemplate {
  id: string;
  name: string;
  template: string;
  estimatedDuration: number; // minutes
  requiredDiagrams: string[];
  maxApproaches: number;
}

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'business-analysis',
    name: 'Business Analysis',
    template: BUSINESS_ANALYSIS_TEMPLATE,
    estimatedDuration: 5,
    requiredDiagrams: ['User Journey Map', 'Stakeholder Impact Map'],
    maxApproaches: 1
  },
  {
    id: 'technical-architecture',
    name: 'Technical Architecture',
    template: TECHNICAL_ARCHITECTURE_TEMPLATE,
    estimatedDuration: 8,
    requiredDiagrams: ['Current System Architecture', 'Proposed System Architecture', 'Data Flow Diagram'],
    maxApproaches: 1
  },
  {
    id: 'implementation-design',
    name: 'Implementation Design',
    template: IMPLEMENTATION_DESIGN_TEMPLATE,
    estimatedDuration: 12,
    requiredDiagrams: ['Sequence Diagram', 'Component Interaction', 'Database Schema'],
    maxApproaches: 2
  },
  {
    id: 'development-plan',
    name: 'Development Plan',
    template: DEVELOPMENT_PLAN_TEMPLATE,
    estimatedDuration: 10,
    requiredDiagrams: ['Development Timeline', 'Task Dependencies', 'Team Workflow'],
    maxApproaches: 2
  },
  {
    id: 'risk-assessment',
    name: 'Risk Assessment',
    template: RISK_ASSESSMENT_TEMPLATE,
    estimatedDuration: 8,
    requiredDiagrams: ['Risk Impact Matrix', 'Mitigation Flow', 'Contingency Plan'],
    maxApproaches: 2
  }
]; 