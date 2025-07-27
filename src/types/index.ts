/**
 * TypeScript interfaces for AI Product Owner Agent VS Code Extension
 * Based on the proven Python PoC implementation and enhanced requirements
 */

// ================================
// Core Jira Data Types
// ================================

export interface JiraEpic {
  key: string;
  summary: string;
  description: string;
  status: string;
  stories: JiraStory[];
  totalPoints: number;
  assignee?: JiraUser;
  reporter?: JiraUser;
  created: string;
  updated: string;
}

export interface JiraStory {
  key: string;
  summary: string;
  description?: string;
  status: string;
  storyPoints?: number;
  assignee?: JiraUser;
  labels: string[];
  components: string[];
  priority: string;
  issueType: string;
}

export interface JiraUser {
  accountId: string;
  displayName: string;
  emailAddress?: string;
  avatarUrls?: Record<string, string>;
}

export interface JiraPortfolio {
  type: 'epic' | 'project';
  key: string;
  name: string;
  description?: string;
  epics: JiraEpic[];
  totalStoryPoints: number;
}

// ================================
// Cross-Team Dependencies
// ================================

export interface CrossTeamDependency {
  id: string;
  type: 'frontend' | 'backend' | 'infrastructure' | 'external-api' | 'database';
  description: string;
  team: string;
  estimatedEffort: string;
  risk: 'low' | 'medium' | 'high';
  blocking: boolean;
  mitigationStrategy?: string;
}

export interface ExternalIntegration {
  name: string;
  type: 'api' | 'database' | 'service' | 'webhook';
  endpoint?: string;
  authentication: string;
  dependencies: string[];
  documentation?: string;
  owner: string;
}

// ================================
// Codebase Analysis Types
// ================================

export interface CodebaseAnalysis {
  projectPath: string;
  totalFiles: number;
  packages: string[];
  structs: string[];
  functions: string[];
  imports: string[];
  patterns: ArchitecturalPattern[];
  techStack: TechStackComponent[];
  metrics: CodebaseMetrics;
}

export interface ArchitecturalPattern {
  name: string;
  description: string;
  confidence: number;
  files: string[];
  examples: string[];
}

export interface TechStackComponent {
  name: string;
  version?: string;
  type: 'framework' | 'library' | 'database' | 'middleware' | 'tool';
  usage: 'primary' | 'secondary' | 'testing';
}

export interface CodebaseMetrics {
  linesOfCode: number;
  complexity: 'low' | 'medium' | 'high';
  testCoverage?: number;
  technicalDebt: 'low' | 'medium' | 'high';
  maintainability: number; // 1-10 scale
}

// ================================
// Technical Solution Types
// ================================

export interface TechnicalSolution {
  id: string;
  name: string;
  description: string;
  approach: ImplementationApproach;
  architecture: SystemArchitecture;
  implementation: ImplementationDetails;
  risks: RiskAssessment[];
  effort: EffortEstimate;
  pros: string[];
  cons: string[];
  recommended: boolean;
}

export interface ImplementationApproach {
  strategy: 'incremental' | 'big-bang' | 'parallel' | 'phased';
  technologies: TechStackComponent[];
  patterns: string[];
  integrations: ExternalIntegration[];
}

export interface SystemArchitecture {
  components: SystemComponent[];
  relationships: ComponentRelationship[];
  dataFlow: DataFlowStep[];
  deploymentModel: 'monolith' | 'microservices' | 'hybrid';
}

export interface SystemComponent {
  id: string;
  name: string;
  type: 'service' | 'database' | 'gateway' | 'frontend' | 'middleware';
  description: string;
  responsibilities: string[];
  interfaces: ComponentInterface[];
  dependencies: string[];
}

export interface ComponentInterface {
  name: string;
  type: 'rest-api' | 'graphql' | 'grpc' | 'message-queue' | 'database';
  endpoint?: string;
  methods: string[];
  dataContract: Record<string, any>;
}

export interface ComponentRelationship {
  from: string;
  to: string;
  type: 'uses' | 'depends-on' | 'publishes-to' | 'subscribes-to';
  protocol: string;
  description: string;
}

export interface DataFlowStep {
  step: number;
  description: string;
  from: string;
  to: string;
  data: string;
  transformation?: string;
}

// ================================
// Analysis Stages and Prompts
// ================================

export interface AnalysisStage {
  id: string;
  name: string;
  description: string;
  prompt: PromptTemplate;
  dependencies: string[];
  expectedOutput: AnalysisOutput;
  estimatedDuration: number; // minutes
}

export interface PromptTemplate {
  id: string;
  stage: string;
  role: string;
  context: PromptContext;
  instructions: string[];
  outputFormat: string;
  visualizations: VisualizationRequirement[];
}

export interface PromptContext {
  jiraData?: JiraPortfolio;
  codebaseData?: CodebaseAnalysis;
  previousAnalysis?: AnalysisOutput[];
  context7Docs?: Context7Documentation[];
}

export interface VisualizationRequirement {
  type: 'mermaid-architecture' | 'mermaid-sequence' | 'mermaid-journey' | 'mermaid-flowchart';
  title: string;
  description: string;
  required: boolean;
}

// ================================
// Analysis Output Types
// ================================

export interface AnalysisOutput {
  stageId: string;
  stageName: string;
  timestamp: string;
  content: string;
  visualizations: GeneratedVisualization[];
  metadata: AnalysisMetadata;
  copilotPrompt: string;
}

export interface GeneratedVisualization {
  id: string;
  type: string;
  title: string;
  mermaidCode: string;
  description: string;
  rendered?: string; // base64 encoded image or SVG
}

export interface AnalysisMetadata {
  epicKey: string;
  generatedAt: string;
  duration: number;
  stage: string;
  version: string;
  confidence: number; // 1-10 scale
}

// ================================
// Risk Assessment Types
// ================================

export interface RiskAssessment {
  id: string;
  category: 'technical' | 'operational' | 'business' | 'security';
  description: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  probability: 'low' | 'medium' | 'high';
  severity: number; // calculated: impact × probability
  mitigation: MitigationStrategy;
  contingency?: string;
}

export interface MitigationStrategy {
  description: string;
  actions: string[];
  owner: string;
  timeline: string;
  cost: 'low' | 'medium' | 'high';
  effectiveness: number; // 1-10 scale
}

// ================================
// Implementation Planning Types
// ================================

export interface ImplementationDetails {
  phases: DevelopmentPhase[];
  timeline: ProjectTimeline;
  resources: ResourceRequirement[];
  milestones: ProjectMilestone[];
  dependencies: TaskDependency[];
}

export interface DevelopmentPhase {
  id: string;
  name: string;
  description: string;
  duration: number; // weeks
  deliverables: string[];
  tasks: DevelopmentTask[];
  dependencies: string[];
  risk: 'low' | 'medium' | 'high';
}

export interface DevelopmentTask {
  id: string;
  title: string;
  description: string;
  type: 'development' | 'testing' | 'documentation' | 'review' | 'deployment';
  effort: number; // story points
  skills: string[];
  dependencies: string[];
  acceptanceCriteria: string[];
}

export interface ProjectTimeline {
  totalDuration: number; // weeks
  startDate?: string;
  endDate?: string;
  criticalPath: string[];
  bufferTime: number; // percentage
}

export interface ResourceRequirement {
  role: string;
  skills: string[];
  allocation: number; // percentage
  duration: number; // weeks
  critical: boolean;
}

export interface ProjectMilestone {
  id: string;
  name: string;
  description: string;
  targetDate: string;
  deliverables: string[];
  criteria: string[];
  dependencies: string[];
}

export interface TaskDependency {
  id: string;
  fromTask: string;
  toTask: string;
  type: 'finish-to-start' | 'start-to-start' | 'finish-to-finish';
  lag?: number; // days
  critical: boolean;
}

// ================================
// User Journey and Business Types
// ================================

export interface UserJourney {
  id: string;
  name: string;
  description: string;
  persona: UserPersona;
  steps: JourneyStep[];
  touchpoints: Touchpoint[];
  painPoints: string[];
  opportunities: string[];
}

export interface UserPersona {
  name: string;
  role: string;
  goals: string[];
  frustrations: string[];
  techSavvy: 'low' | 'medium' | 'high';
}

export interface JourneyStep {
  step: number;
  action: string;
  thought: string;
  emotion: 'frustrated' | 'neutral' | 'satisfied' | 'delighted';
  touchpoint: string;
  issues: string[];
}

export interface Touchpoint {
  name: string;
  type: 'web' | 'mobile' | 'api' | 'email' | 'system';
  description: string;
  currentExperience: 'poor' | 'fair' | 'good' | 'excellent';
  targetExperience: 'poor' | 'fair' | 'good' | 'excellent';
}

// ================================
// Context7 Integration Types
// ================================

export interface Context7Documentation {
  library: string;
  version?: string;
  sections: DocumentationSection[];
  patterns: CodePattern[];
  examples: CodeExample[];
  lastUpdated: string;
}

export interface DocumentationSection {
  title: string;
  content: string;
  type: 'overview' | 'api' | 'pattern' | 'example' | 'migration';
  relevance: number; // 1-10 scale
}

export interface CodePattern {
  name: string;
  description: string;
  category: string;
  code: string;
  language: string;
  bestPractices: string[];
}

export interface CodeExample {
  title: string;
  description: string;
  code: string;
  language: string;
  tags: string[];
  complexity: 'basic' | 'intermediate' | 'advanced';
}

// ================================
// Extension State and Configuration
// ================================

export interface ExtensionState {
  configured: boolean;
  analyzing: boolean;
  hasResults: boolean;
  currentEpic?: string;
  lastAnalysis?: string;
  analysisResults: AnalysisOutput[];
}

export interface ExtensionConfiguration {
  jira: JiraConfiguration;
  output: OutputConfiguration;
  analysis: AnalysisConfiguration;
  codebase: CodebaseConfiguration;
}

export interface JiraConfiguration {
  baseUrl: string;
  email: string;
  token: string; // stored in VS Code secrets
  timeout: number;
}

export interface OutputConfiguration {
  directory: string;
  generateDiagrams: boolean;
  format: 'markdown' | 'html' | 'pdf';
  includeRawData: boolean;
}

export interface AnalysisConfiguration {
  maxSolutions: number;
  includeContext7: boolean;
  stageTimeout: number; // minutes
  autoOpenResults: boolean;
}

export interface CodebaseConfiguration {
  includeTests: boolean;
  excludePatterns: string[];
  maxFileSize: number; // MB
  analysisDepth: 'basic' | 'detailed' | 'comprehensive';
}

// ================================
// Effort Estimation Types
// ================================

export interface EffortEstimate {
  totalStoryPoints: number;
  totalWeeks: number;
  confidence: 'low' | 'medium' | 'high';
  breakdown: EffortBreakdown[];
  assumptions: string[];
  risks: string[];
}

export interface EffortBreakdown {
  category: string;
  storyPoints: number;
  weeks: number;
  description: string;
  complexity: 'low' | 'medium' | 'high';
}

// ================================
// Error and Validation Types
// ================================

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}

// ================================
// Progress and Status Types
// ================================

export interface AnalysisProgress {
  stage: string;
  progress: number; // 0-100
  message: string;
  startTime: string;
  estimatedCompletion?: string;
  errors: string[];
}

export interface ProcessingStatus {
  status: 'idle' | 'connecting' | 'analyzing' | 'generating' | 'completed' | 'error';
  currentStage?: string;
  progress: number;
  message: string;
  startTime?: string;
  endTime?: string;
  error?: string;
}
