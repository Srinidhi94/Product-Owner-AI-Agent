/**
 * Core TypeScript interfaces for AI Product Owner Agent VS Code Extension
 * Streamlined to include only actively used types
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
}

export interface JiraConfiguration {
  baseUrl: string;
  email: string;
  token: string; // stored in VS Code secrets
  timeout: number;
}

export interface OutputConfiguration {
  directory: string;
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
