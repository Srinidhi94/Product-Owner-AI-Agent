import * as vscode from 'vscode';
import * as path from 'path';
import { CodebaseAnalysis, ArchitecturalPattern, TechStackComponent, CodebaseMetrics } from '../types';

/**
 * CodebaseAnalyzer - Essential codebase type detection
 * Provides technical context for prompt templates with minimal overhead
 * Optimized for lean, focused analysis across all programming languages
 */
export class CodebaseAnalyzer {
  private readonly outputChannel: vscode.OutputChannel;
  private readonly projectPath: string;

  constructor() {
    this.outputChannel = vscode.window.createOutputChannel('Codebase Analyzer');
    this.projectPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '';
  }

  /**
   * Core language detection mappings - Essential file extensions only
   */
  private readonly languageMap = new Map([
    ['.js', 'javascript'], ['.jsx', 'javascript'], ['.mjs', 'javascript'],
    ['.ts', 'typescript'], ['.tsx', 'typescript'],
    ['.py', 'python'], ['.pyw', 'python'],
    ['.java', 'java'],
    ['.go', 'go'],
    ['.cs', 'csharp'],
    ['.php', 'php'],
    ['.rb', 'ruby'],
    ['.rs', 'rust'],
    ['.cpp', 'cpp'], ['.cc', 'cpp'], ['.cxx', 'cpp'],
    ['.c', 'c'], ['.h', 'c'],
    ['.swift', 'swift'],
    ['.kt', 'kotlin'], ['.kts', 'kotlin']
  ]);

  /**
   * Essential architecture patterns detection
   */
  private readonly patternKeywords = new Map([
    ['mvc', 'MVC Architecture'],
    ['api', 'REST API'],
    ['microservice', 'Microservices'],
    ['handler', 'Handler Pattern'],
    ['service', 'Service Layer'],
    ['repository', 'Repository Pattern'],
    ['controller', 'Controller Pattern'],
    ['middleware', 'Middleware Pattern'],
    ['auth', 'Authentication'],
    ['jwt', 'JWT Authentication'],
    ['docker', 'Containerized'],
    ['kubernetes', 'Kubernetes Ready'],
    ['test', 'Testing Framework'],
    ['clean architecture', 'Clean Architecture'],
    ['ddd', 'Domain-Driven Design'],
    ['cqrs', 'CQRS Pattern']
  ]);

  /**
   * Essential tech stack detection
   */
  private readonly techStackMap = new Map([
    // JavaScript/TypeScript
    ['react', { name: 'React', type: 'framework' }],
    ['angular', { name: 'Angular', type: 'framework' }],
    ['vue', { name: 'Vue.js', type: 'framework' }],
    ['express', { name: 'Express.js', type: 'framework' }],
    ['nestjs', { name: 'NestJS', type: 'framework' }],
    ['next', { name: 'Next.js', type: 'framework' }],
    
    // Python
    ['django', { name: 'Django', type: 'framework' }],
    ['flask', { name: 'Flask', type: 'framework' }],
    ['fastapi', { name: 'FastAPI', type: 'framework' }],
    
    // Java
    ['spring', { name: 'Spring', type: 'framework' }],
    ['hibernate', { name: 'Hibernate', type: 'library' }],
    
    // Go
    ['gin', { name: 'Gin', type: 'framework' }],
    ['gorm', { name: 'GORM', type: 'library' }],
    
    // C#
    ['aspnetcore', { name: 'ASP.NET Core', type: 'framework' }],
    
    // Databases
    ['mongodb', { name: 'MongoDB', type: 'database' }],
    ['postgresql', { name: 'PostgreSQL', type: 'database' }],
    ['mysql', { name: 'MySQL', type: 'database' }],
    ['redis', { name: 'Redis', type: 'database' }]
  ]);

  /**
   * Project type classification based on detected patterns
   */
  private readonly projectTypes = new Map([
    ['web_api', ['api', 'rest', 'endpoint', 'controller']],
    ['web_app', ['react', 'angular', 'vue', 'next', 'django', 'laravel']],
    ['microservices', ['microservice', 'service', 'docker', 'kubernetes']],
    ['mobile_app', ['react-native', 'flutter', 'swift', 'kotlin']],
    ['desktop_app', ['electron', 'wpf', 'javafx', 'qt']],
    ['library', ['lib', 'package', 'module', 'component']],
    ['data_processing', ['pandas', 'numpy', 'spark', 'kafka']],
    ['game', ['unity', 'unreal', 'godot', 'pygame']]
  ]);

  /**
   * Main analysis entry point - Streamlined codebase analysis
   */
  async analyzeCodebase(): Promise<CodebaseAnalysis> {
    this.log('🚀 Starting streamlined codebase analysis...');

    if (!this.projectPath) {
      this.log('⚠️ Project path not found, using minimal analysis');
      return this.createMinimalAnalysis();
    }

    try {
      // Step 1: Quick language detection (limit to 50 files for performance)
      const { primaryLanguage, allLanguages, totalFiles } = await this.detectLanguages();
      
      // Step 2: Essential pattern detection
      const patterns = await this.detectEssentialPatterns();
      
      // Step 3: Basic tech stack identification
      const techStack = await this.identifyTechStack();
      
      // Step 4: Project type classification
      const projectType = this.classifyProjectType(patterns, techStack);
      
      // Step 5: Calculate basic metrics
      const metrics = this.calculateBasicMetrics(totalFiles, allLanguages.length);

      const analysis: CodebaseAnalysis = {
        projectPath: this.projectPath,
        totalFiles,
        packages: [`${primaryLanguage}_project`, projectType],
        structs: this.generateBasicStructures(primaryLanguage),
        functions: this.generateBasicFunctions(primaryLanguage),
        imports: techStack.map(t => t.name.toLowerCase()),
        patterns: this.createArchitecturalPatterns(patterns),
        techStack,
        metrics
      };

      this.log(`✅ Analysis complete - Primary: ${primaryLanguage}, Type: ${projectType}`);
      this.log(`🏗️ Patterns: ${patterns.join(', ')}`);
      return analysis;

    } catch (error: any) {
      this.log(`❌ Analysis failed: ${error.message}`);
      return this.createMinimalAnalysis();
    }
  }

  /**
   * Quick language detection - Essential only
   */
  private async detectLanguages(): Promise<{
    primaryLanguage: string;
    allLanguages: string[];
    totalFiles: number;
  }> {
    const languageCounts = new Map<string, number>();
    
    // Find code files (limited search for performance)
    const codeFiles = await vscode.workspace.findFiles(
      '**/*.{js,jsx,ts,tsx,py,java,go,cs,php,rb,rs,cpp,c,swift,kt}',
      '{**/node_modules/**,**/vendor/**,**/target/**,**/build/**,**/dist/**,**/.git/**}',
      50 // Limit for performance
    );

    for (const fileUri of codeFiles) {
      const ext = path.extname(fileUri.fsPath).toLowerCase();
      const language = this.languageMap.get(ext);
      if (language) {
        languageCounts.set(language, (languageCounts.get(language) || 0) + 1);
      }
    }

    const sortedLanguages = Array.from(languageCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .map(([lang]) => lang);

    return {
      primaryLanguage: sortedLanguages[0] || 'unknown',
      allLanguages: sortedLanguages,
      totalFiles: codeFiles.length
    };
  }

  /**
   * Essential pattern detection - Focused on key architectural patterns
   */
  private async detectEssentialPatterns(): Promise<string[]> {
    const patterns: string[] = [];
    
    try {
      // Quick file content scan (first 10 files)
      const files = await vscode.workspace.findFiles('**/*.{js,ts,py,java,go,cs,php}', undefined, 10);
      let allContent = '';
      let allPaths = '';

      for (const file of files) {
        try {
          const document = await vscode.workspace.openTextDocument(file);
          allContent += document.getText().toLowerCase() + ' ';
          allPaths += file.fsPath.toLowerCase() + ' ';
        } catch {
          continue;
        }
      }

      // Check for essential patterns
      for (const [keyword, pattern] of this.patternKeywords) {
        if (allContent.includes(keyword) || allPaths.includes(keyword)) {
          patterns.push(pattern);
        }
      }

      // Check package/config files for additional context
      await this.checkConfigFiles(patterns);

    } catch (error: any) {
      this.log(`⚠️ Pattern detection warning: ${error.message}`);
    }

    return [...new Set(patterns)]; // Remove duplicates
  }

  /**
   * Check configuration files for framework/pattern detection
   */
  private async checkConfigFiles(patterns: string[]): Promise<void> {
    try {
      // Check package.json for JS/TS projects
      const packageFiles = await vscode.workspace.findFiles('**/package.json', undefined, 1);
      if (packageFiles.length > 0) {
        const packageDoc = await vscode.workspace.openTextDocument(packageFiles[0]);
        const packageContent = packageDoc.getText().toLowerCase();
        
        if (packageContent.includes('react')) patterns.push('React Framework');
        if (packageContent.includes('angular')) patterns.push('Angular Framework');
        if (packageContent.includes('express')) patterns.push('Express.js Framework');
        if (packageContent.includes('next')) patterns.push('Next.js Framework');
      }

      // Check requirements.txt for Python projects
      const requirementsFiles = await vscode.workspace.findFiles('**/requirements.txt', undefined, 1);
      if (requirementsFiles.length > 0) {
        const reqDoc = await vscode.workspace.openTextDocument(requirementsFiles[0]);
        const reqContent = reqDoc.getText().toLowerCase();
        
        if (reqContent.includes('django')) patterns.push('Django Framework');
        if (reqContent.includes('flask')) patterns.push('Flask Framework');
        if (reqContent.includes('fastapi')) patterns.push('FastAPI Framework');
      }

      // Check for Docker
      const dockerFiles = await vscode.workspace.findFiles('**/Dockerfile', undefined, 1);
      if (dockerFiles.length > 0) {
        patterns.push('Containerized');
      }

    } catch (error: any) {
      this.log(`⚠️ Config file check warning: ${error.message}`);
    }
  }

  /**
   * Identify basic tech stack from detected patterns
   */
  private async identifyTechStack(): Promise<TechStackComponent[]> {
    const techStack: TechStackComponent[] = [];
    
    try {
      // Quick scan for tech stack keywords
      const files = await vscode.workspace.findFiles('**/*.{json,txt,yml,yaml}', undefined, 5);
      let allContent = '';

      for (const file of files) {
        try {
          const document = await vscode.workspace.openTextDocument(file);
          allContent += document.getText().toLowerCase() + ' ';
        } catch {
          continue;
        }
      }

      // Map tech stack from content
      for (const [keyword, tech] of this.techStackMap) {
        if (allContent.includes(keyword)) {
          techStack.push({
            name: tech.name,
            version: undefined,
            type: tech.type as any,
            usage: 'primary'
          });
        }
      }

    } catch (error: any) {
      this.log(`⚠️ Tech stack detection warning: ${error.message}`);
    }

    return techStack;
  }

  /**
   * Classify project type based on detected patterns and tech stack
   */
  private classifyProjectType(patterns: string[], techStack: TechStackComponent[]): string {
    const allIndicators = [
      ...patterns.map(p => p.toLowerCase()),
      ...techStack.map(t => t.name.toLowerCase())
    ].join(' ');

    for (const [type, keywords] of this.projectTypes) {
      if (keywords.some(keyword => allIndicators.includes(keyword))) {
        return type;
      }
    }

    return 'general_application';
  }

  /**
   * Calculate basic metrics with minimal computation
   */
  private calculateBasicMetrics(totalFiles: number, languageCount: number): CodebaseMetrics {
    return {
      linesOfCode: totalFiles * 50, // Rough estimate
      complexity: totalFiles > 100 ? 'high' : totalFiles > 25 ? 'medium' : 'low',
      technicalDebt: languageCount > 3 ? 'high' : languageCount > 1 ? 'medium' : 'low',
      maintainability: Math.max(1, Math.min(10, 8 - (languageCount - 1)))
    };
  }

  /**
   * Generate basic structures based on primary language
   */
  private generateBasicStructures(language: string): string[] {
    const structures: Record<string, string[]> = {
      javascript: ['Component', 'Service', 'Model', 'Controller', 'Utils'],
      typescript: ['Interface', 'Service', 'Model', 'Controller', 'Types'],
      python: ['Class', 'Service', 'Model', 'View', 'Utils'],
      java: ['Class', 'Service', 'Entity', 'Controller', 'Repository'],
      go: ['Struct', 'Handler', 'Service', 'Model', 'Repository'],
      csharp: ['Class', 'Service', 'Model', 'Controller', 'Repository']
    };
    
    return structures[language] || ['Module', 'Service', 'Model', 'Handler', 'Utils'];
  }

  /**
   * Generate basic functions based on primary language
   */
  private generateBasicFunctions(language: string): string[] {
    const functions: Record<string, string[]> = {
      javascript: ['handleRequest', 'processData', 'validateInput', 'formatResponse'],
      typescript: ['handleRequest', 'processData', 'validateInput', 'formatResponse'],
      python: ['handle_request', 'process_data', 'validate_input', 'format_response'],
      java: ['handleRequest', 'processData', 'validateInput', 'formatResponse'],
      go: ['HandleRequest', 'ProcessData', 'ValidateInput', 'FormatResponse'],
      csharp: ['HandleRequest', 'ProcessData', 'ValidateInput', 'FormatResponse']
    };
    
    return functions[language] || ['handleRequest', 'processData', 'validateInput', 'formatResponse'];
  }

  /**
   * Create architectural pattern objects from detected patterns
   */
  private createArchitecturalPatterns(patterns: string[]): ArchitecturalPattern[] {
    return patterns.map(pattern => ({
      name: pattern,
      description: this.getPatternDescription(pattern),
      confidence: 8,
      files: [],
      examples: []
    }));
  }

  /**
   * Get pattern descriptions for architectural patterns
   */
  private getPatternDescription(pattern: string): string {
    const descriptions: Record<string, string> = {
      'MVC Architecture': 'Model-View-Controller architectural pattern for separation of concerns',
      'REST API': 'RESTful API design pattern for web services',
      'Microservices': 'Microservices architecture for distributed systems',
      'Clean Architecture': 'Clean Architecture pattern for maintainable, testable code',
      'Domain-Driven Design': 'DDD approach for complex domain modeling',
      'CQRS Pattern': 'Command Query Responsibility Segregation pattern',
      'Handler Pattern': 'Request handler pattern for processing requests',
      'Service Layer': 'Service layer pattern for business logic encapsulation',
      'Repository Pattern': 'Data access abstraction pattern',
      'Controller Pattern': 'Controller pattern for request handling',
      'Middleware Pattern': 'Middleware pattern for request/response processing',
      'Authentication': 'Authentication and authorization system',
      'JWT Authentication': 'JSON Web Token authentication system',
      'Containerized': 'Docker-based containerization',
      'Kubernetes Ready': 'Kubernetes orchestration support',
      'Testing Framework': 'Automated testing infrastructure'
    };
    
    return descriptions[pattern] || `${pattern} implementation`;
  }

  /**
   * Create minimal analysis for fallback scenarios
   */
  private createMinimalAnalysis(): CodebaseAnalysis {
    return {
      projectPath: this.projectPath,
      totalFiles: 0,
      packages: ['unknown_project'],
      structs: ['Component', 'Service', 'Model'],
      functions: ['handleRequest', 'processData', 'validateInput'],
      imports: [],
      patterns: [{
        name: 'Standard Architecture',
        description: 'Standard application architecture pattern',
        confidence: 5,
        files: [],
        examples: []
      }],
      techStack: [],
      metrics: {
        linesOfCode: 0,
        complexity: 'low',
        technicalDebt: 'low',
        maintainability: 5
      }
    };
  }

  /**
   * Log helper
   */
  private log(message: string): void {
    this.outputChannel.appendLine(message);
    console.log(message);
  }

  /**
   * Show output channel
   */
  showOutput(): void {
    this.outputChannel.show();
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    this.outputChannel.dispose();
  }
}
