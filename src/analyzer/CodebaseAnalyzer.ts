/**
 * CodebaseAnalyzer - Automated Project Analysis for Technical Context
 *
 * Provides comprehensive project structure analysis and technical stack detection
 * for AI-driven technical analysis workflows. Supports multi-language codebases
 * with optimized performance for VS Code extension integration.
 */

import * as vscode from 'vscode';
import * as path from 'path';
import { CodebaseAnalysis, TechStackComponent, CodebaseMetrics } from '../types';
import { Logger, createLogger } from '../utils/Logger';

interface ProjectContext {
  type: 'web-app' | 'api' | 'library' | 'mobile' | 'desktop' | 'full-stack' | 'other';
  mainLanguage: string;
  framework: string | null;
  keyDirectories: string[];
  entryPoints: string[];
  description: string;
}

export class CodebaseAnalyzer {
  private logger: Logger;
  private projectPath: string;

  // Simplified mappings for essential detection
  private readonly languageExtensions = new Map([
    ['.ts', 'TypeScript'],
    ['.tsx', 'TypeScript'],
    ['.js', 'JavaScript'],
    ['.jsx', 'JavaScript'],
    ['.py', 'Python'],
    ['.pyw', 'Python'],
    ['.java', 'Java'],
    ['.kt', 'Kotlin'],
    ['.cs', 'C#'],
    ['.go', 'Go'],
    ['.rb', 'Ruby'],
    ['.php', 'PHP'],
    ['.swift', 'Swift'],
    ['.rs', 'Rust'],
  ]);

  private readonly frameworkIndicators = new Map([
    ['react', 'React'],
    ['next', 'Next.js'],
    ['vue', 'Vue.js'],
    ['angular', 'Angular'],
    ['express', 'Express.js'],
    ['fastapi', 'FastAPI'],
    ['django', 'Django'],
    ['flask', 'Flask'],
    ['spring', 'Spring Boot'],
    ['laravel', 'Laravel'],
    ['rails', 'Ruby on Rails'],
  ]);

  constructor(projectPath: string = '') {
    this.logger = createLogger('CodebaseAnalyzer');
    this.projectPath = projectPath || vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '';
  }

  /**
   * Simple, focused project analysis for AI context
   */
  async analyzeCodebase(): Promise<CodebaseAnalysis> {
    this.logger.info('Starting simplified codebase analysis');

    try {
      const context = await this.getProjectContext();

      return {
        projectPath: this.projectPath,
        totalFiles: await this.getFileCount(),
        packages: [context.type],
        structs: context.keyDirectories,
        functions: context.entryPoints,
        imports: context.framework ? [context.framework] : [],
        patterns: [
          {
            name: context.type,
            description: context.description,
            confidence: 8,
            files: context.entryPoints,
            examples: [],
          },
        ],
        techStack: this.createTechStack(context),
        metrics: this.createSimpleMetrics(context),
      };
    } catch (error: any) {
      this.logger.error('Analysis failed', error);
      return this.createFallbackAnalysis();
    }
  }

  /**
   * Get essential project context for AI
   */
  private async getProjectContext(): Promise<ProjectContext> {
    const [language, framework, directories, entryPoints] = await Promise.all([
      this.detectMainLanguage(),
      this.detectFramework(),
      this.getKeyDirectories(),
      this.findEntryPoints(),
    ]);

    const type = this.determineProjectType(framework, directories);
    const description = this.generateDescription(type, language, framework);

    return {
      type,
      mainLanguage: language,
      framework,
      keyDirectories: directories,
      entryPoints: entryPoints,
      description,
    };
  }

  /**
   * Detect primary language (not all languages)
   */
  private async detectMainLanguage(): Promise<string> {
    try {
      const files = await vscode.workspace.findFiles(
        '**/*.{ts,tsx,js,jsx,py,java,cs,go,rb,php,swift,rs}',
        '**/node_modules/**',
        50
      );

      const langCounts = new Map<string, number>();

      for (const file of files) {
        const ext = path.extname(file.fsPath).toLowerCase();
        const lang = this.languageExtensions.get(ext);
        if (lang) {
          langCounts.set(lang, (langCounts.get(lang) || 0) + 1);
        }
      }

      // Return most common language
      let maxCount = 0;
      let mainLang = 'JavaScript';

      for (const [lang, count] of langCounts) {
        if (count > maxCount) {
          maxCount = count;
          mainLang = lang;
        }
      }

      return mainLang;
    } catch (error) {
      this.logger.debug('Language detection failed, defaulting to JavaScript');
      return 'JavaScript';
    }
  }

  /**
   * Detect main framework (if any)
   */
  private async detectFramework(): Promise<string | null> {
    try {
      // Check package.json for JS/TS projects
      const packageFiles = await vscode.workspace.findFiles(
        '**/package.json',
        '**/node_modules/**',
        1
      );
      if (packageFiles.length > 0) {
        const doc = await vscode.workspace.openTextDocument(packageFiles[0]);
        const content = doc.getText().toLowerCase();

        for (const [indicator, framework] of this.frameworkIndicators) {
          if (content.includes(`"${indicator}"`)) {
            return framework;
          }
        }
      }

      // Check requirements.txt for Python projects
      const reqFiles = await vscode.workspace.findFiles('**/requirements*.txt', undefined, 1);
      if (reqFiles.length > 0) {
        const doc = await vscode.workspace.openTextDocument(reqFiles[0]);
        const content = doc.getText().toLowerCase();

        for (const [indicator, framework] of this.frameworkIndicators) {
          if (content.includes(indicator)) {
            return framework;
          }
        }
      }

      return null;
    } catch (error) {
      this.logger.debug('Framework detection failed');
      return null;
    }
  }

  /**
   * Get key directories (top-level only)
   */
  private async getKeyDirectories(): Promise<string[]> {
    try {
      const workspaceUri = vscode.workspace.workspaceFolders?.[0]?.uri;
      if (!workspaceUri) return [];

      const entries = await vscode.workspace.fs.readDirectory(workspaceUri);
      const directories = entries
        .filter(([name, type]) => type === vscode.FileType.Directory)
        .map(([name]) => name)
        .filter(name => !name.startsWith('.') && name !== 'node_modules')
        .slice(0, 6); // Top 6 directories

      return directories;
    } catch (error) {
      this.logger.debug('Directory scan failed');
      return [];
    }
  }

  /**
   * Find main entry points
   */
  private async findEntryPoints(): Promise<string[]> {
    const entryPatterns = [
      'index.*',
      'main.*',
      'app.*',
      'server.*',
      'src/index.*',
      'src/main.*',
      'src/app.*',
    ];

    const entryPoints: string[] = [];

    for (const pattern of entryPatterns) {
      try {
        const files = await vscode.workspace.findFiles(pattern, '**/node_modules/**', 2);
        for (const file of files) {
          const relativePath = vscode.workspace.asRelativePath(file);
          if (!entryPoints.includes(relativePath)) {
            entryPoints.push(relativePath);
          }
        }
      } catch (error) {
        // Continue with other patterns
      }
    }

    return entryPoints.slice(0, 4); // Top 4 entry points
  }

  /**
   * Determine project type based on context
   */
  private determineProjectType(
    framework: string | null,
    directories: string[]
  ): ProjectContext['type'] {
    const dirStr = directories.join(' ').toLowerCase();

    if (framework) {
      if (['React', 'Vue.js', 'Angular'].includes(framework)) return 'web-app';
      if (['Express.js', 'FastAPI', 'Django', 'Flask'].includes(framework)) return 'api';
    }

    if (dirStr.includes('src') && dirStr.includes('api')) return 'full-stack';
    if (dirStr.includes('public') || dirStr.includes('static')) return 'web-app';
    if (dirStr.includes('api') || dirStr.includes('server')) return 'api';
    if (dirStr.includes('lib') || dirStr.includes('dist')) return 'library';

    return 'other';
  }

  /**
   * Generate concise project description
   */
  private generateDescription(type: string, language: string, framework: string | null): string {
    const base = `${language} ${type.replace('-', ' ')}`;
    return framework ? `${base} using ${framework}` : base;
  }

  /**
   * Create simple tech stack
   */
  private createTechStack(context: ProjectContext): TechStackComponent[] {
    const stack: TechStackComponent[] = [
      {
        name: context.mainLanguage,
        type: 'framework' as const, // Using 'framework' as it's the closest valid type
        usage: 'primary',
      },
    ];

    if (context.framework) {
      stack.push({
        name: context.framework,
        type: 'framework',
        usage: 'primary',
      });
    }

    return stack;
  }

  /**
   * Create simple metrics
   */
  private createSimpleMetrics(context: ProjectContext): CodebaseMetrics {
    return {
      linesOfCode: 0, // Not needed for AI context
      complexity: 'medium',
      technicalDebt: 'low',
      maintainability: 8,
    };
  }

  /**
   * Get approximate file count
   */
  private async getFileCount(): Promise<number> {
    try {
      const files = await vscode.workspace.findFiles(
        '**/*',
        '{**/node_modules/**,**/.git/**,**/dist/**,**/build/**}',
        100
      );
      return files.length;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Fallback analysis if main analysis fails
   */
  private createFallbackAnalysis(): CodebaseAnalysis {
    return {
      projectPath: this.projectPath,
      totalFiles: 0,
      packages: ['unknown'],
      structs: [],
      functions: [],
      imports: [],
      patterns: [
        {
          name: 'Standard Project',
          description: 'Standard software project',
          confidence: 5,
          files: [],
          examples: [],
        },
      ],
      techStack: [],
      metrics: {
        linesOfCode: 0,
        complexity: 'low',
        technicalDebt: 'low',
        maintainability: 7,
      },
    };
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    this.logger.info('CodebaseAnalyzer disposed');
  }
}
