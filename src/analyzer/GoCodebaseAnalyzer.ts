/**
 * Go Codebase Analyzer - Static analysis of Go codebases
 * Extracts packages, structs, functions, imports, and identifies architectural patterns
 */

import * as vscode from 'vscode';
import * as path from 'path';
import { CodebaseAnalysis, ArchitecturalPattern, TechStackComponent, CodebaseMetrics } from '../types';

export class GoCodebaseAnalyzer {
  private projectPath: string;
  private outputChannel: vscode.OutputChannel;

  constructor(projectPath?: string) {
    this.projectPath = projectPath || vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '';
    this.outputChannel = vscode.window.createOutputChannel('AI Product Owner - Go Analysis');
    this.log(`🔍 Analyzing Go project at: ${this.projectPath}`);
  }

  /**
   * Main analysis entry point - performs comprehensive Go codebase analysis
   */
  async analyzeCodebase(): Promise<CodebaseAnalysis> {
    this.log('📂 Scanning Go files...');
    
    if (!this.projectPath) {
      this.log('⚠️ Project path not found, using demo analysis');
      return this.demoCodebaseAnalysis();
    }

    try {
      // Use VS Code's file search API to find all Go files
      const goFiles = await vscode.workspace.findFiles(
        '**/*.go',                    // Include pattern
        '**/node_modules/**',         // Exclude pattern
        undefined                     // No limit
      );

      if (!goFiles || goFiles.length === 0) {
        this.log('⚠️ No Go files found, using demo analysis');
        return this.demoCodebaseAnalysis();
      }

      this.log(`📄 Found ${goFiles.length} Go files`);

      // Initialize data structures for analysis results
      const packages = new Set<string>();
      const structs: string[] = [];
      const functions: string[] = [];
      const imports = new Set<string>();

      // Limit to first 20 files for performance with large codebases
      const filesToAnalyze = goFiles.slice(0, 20);

      for (const fileUri of filesToAnalyze) {
        try {
          // Read file content with proper encoding
          const document = await vscode.workspace.openTextDocument(fileUri);
          const content = document.getText();

          // Extract package names using regex
          const packageMatch = content.match(/^package\s+(\w+)/m);
          if (packageMatch) {
            packages.add(packageMatch[1]);
          }

          // Extract struct definitions using regex
          const structMatches = content.match(/type\s+(\w+)\s+struct/g);
          if (structMatches) {
            for (const match of structMatches) {
              const structName = match.match(/type\s+(\w+)\s+struct/)?.[1];
              if (structName) {
                structs.push(structName);
              }
            }
          }

          // Extract function definitions using regex
          const funcMatches = content.match(/func\s+(?:\(\w+\s+\*?\w+\)\s+)?(\w+)\s*\(/g);
          if (funcMatches) {
            for (const match of funcMatches) {
              const funcName = match.match(/func\s+(?:\(\w+\s+\*?\w+\)\s+)?(\w+)\s*\(/)?.[1];
              if (funcName) {
                functions.push(funcName);
              }
            }
          }

          // Extract import statements using regex
          const importMatches = content.match(/import\s+(?:\(\s*)?(?:"([^"]+)"|`([^`]+)`)/g);
          if (importMatches) {
            for (const match of importMatches) {
              const importPath = match.match(/"([^"]+)"|`([^`]+)`/);
              if (importPath) {
                imports.add(importPath[1] || importPath[2]);
              }
            }
          }

        } catch (error: any) {
          this.log(`⚠️ Error reading ${fileUri.fsPath}: ${error.message}`);
          continue;
        }
      }

      // Identify architectural patterns in the codebase
      const patterns = await this.identifyPatterns(goFiles);

      // Convert pattern strings to ArchitecturalPattern objects
      const architecturalPatterns: ArchitecturalPattern[] = patterns.map(pattern => ({
        name: pattern,
        description: this.getPatternDescription(pattern),
        confidence: 8, // High confidence for detected patterns
        files: [], // Would need deeper analysis to populate
        examples: []
      }));

      // Convert imports to tech stack components
      const techStack: TechStackComponent[] = this.analyzeTechStack(Array.from(imports));

      // Calculate basic metrics
      const metrics: CodebaseMetrics = {
        linesOfCode: goFiles.length * 50, // Rough estimate
        complexity: goFiles.length > 100 ? 'high' : goFiles.length > 20 ? 'medium' : 'low',
        technicalDebt: 'medium', // Default assumption
        maintainability: 7 // Good maintainability for Go projects
      };

      // Build comprehensive analysis results
      const analysis: CodebaseAnalysis = {
        projectPath: this.projectPath,
        totalFiles: goFiles.length,
        packages: Array.from(packages),
        structs: structs.slice(0, 10),      // Limit output for readability
        functions: functions.slice(0, 15),   // Limit output for readability
        imports: Array.from(imports).slice(0, 10), // Limit output for readability
        patterns: architecturalPatterns,
        techStack: techStack,
        metrics: metrics
      };

      this.log(`✅ Analysis complete: ${packages.size} packages, ${structs.length} structs, ${functions.length} functions`);
      return analysis;

    } catch (error: any) {
      this.log(`❌ Analysis failed: ${error.message}`);
      this.log('🎭 Falling back to demo analysis');
      return this.demoCodebaseAnalysis();
    }
  }

  /**
   * Generate demo analysis data when no Go files are found
   */
  private demoCodebaseAnalysis(): CodebaseAnalysis {
    this.log('🎭 Using demo codebase analysis');
    
    const patterns = ['REST API', 'Gin Framework', 'GORM ORM', 'JWT Authentication'];
    const architecturalPatterns: ArchitecturalPattern[] = patterns.map(pattern => ({
      name: pattern,
      description: this.getPatternDescription(pattern),
      confidence: 8,
      files: [],
      examples: []
    }));

    const imports = ['gin-gonic/gin', 'gorm.io/gorm', 'github.com/golang-jwt/jwt'];
    const techStack = this.analyzeTechStack(imports);

    const metrics: CodebaseMetrics = {
      linesOfCode: 750, // Demo estimate
      complexity: 'medium',
      technicalDebt: 'low',
      maintainability: 8
    };

    return {
      projectPath: this.projectPath,
      totalFiles: 15,
      packages: ['main', 'handlers', 'models', 'services', 'utils'],
      structs: ['User', 'Product', 'Order', 'APIResponse', 'Config'],
      functions: ['GetUser', 'CreateProduct', 'ProcessOrder', 'ValidateToken', 'HandleError'],
      imports: imports,
      patterns: architecturalPatterns,
      techStack: techStack,
      metrics: metrics
    };
  }

  /**
   * Identify common architectural patterns in Go codebase
   */
  private async identifyPatterns(goFiles: vscode.Uri[]): Promise<string[]> {
    const patterns: string[] = [];
    let allContent = '';

    // Read a subset of files to identify patterns (first 10 files for performance)
    const filesToCheck = goFiles.slice(0, 10);
    
    for (const fileUri of filesToCheck) {
      try {
        const document = await vscode.workspace.openTextDocument(fileUri);
        const content = document.getText();
        allContent += content.toLowerCase();
      } catch {
        // Continue on error, same as Python PoC
        continue;
      }
    }

    // EXACT PORT: Same pattern checks as Python PoC
    if (allContent.includes('gin')) {
      patterns.push('Gin Framework');
    }
    if (allContent.includes('gorm')) {
      patterns.push('GORM ORM');
    }
    if (allContent.includes('jwt')) {
      patterns.push('JWT Authentication');
    }
    if (allContent.includes('handler')) {
      patterns.push('Handler Pattern');
    }
    if (allContent.includes('middleware')) {
      patterns.push('Middleware');
    }
    if (allContent.includes('router')) {
      patterns.push('REST API');
    }

    // EXACT PORT: Check file paths for container/k8s patterns (same as Python)
    const allPaths = goFiles.map(uri => uri.fsPath).join(' ').toLowerCase();
    if (allPaths.includes('docker')) {
      patterns.push('Containerized');
    }
    if (allPaths.includes('kubernetes') || allPaths.includes('k8s')) {
      patterns.push('Kubernetes Ready');
    }

    // EXACT PORT: Return default if no patterns found (same as Python)
    return patterns.length > 0 ? patterns : ['Standard Go Project'];
  }

  /**
   * Get pattern description for architectural patterns
   */
  private getPatternDescription(pattern: string): string {
    const descriptions: Record<string, string> = {
      'Gin Framework': 'HTTP web framework for Go with martini-like API',
      'GORM ORM': 'Object-relational mapping library for Go',
      'JWT Authentication': 'JSON Web Token based authentication system',
      'Handler Pattern': 'HTTP request handler pattern for web services',
      'Middleware': 'HTTP middleware for request/response processing',
      'REST API': 'RESTful API architecture pattern',
      'Containerized': 'Docker-based containerization setup',
      'Kubernetes Ready': 'Kubernetes orchestration configuration',
      'Standard Go Project': 'Standard Go project structure and patterns'
    };
    return descriptions[pattern] || `${pattern} architectural pattern`;
  }

  /**
   * Analyze tech stack from imports
   */
  private analyzeTechStack(imports: string[]): TechStackComponent[] {
    const techStack: TechStackComponent[] = [];
    
    for (const imp of imports) {
      if (imp.includes('gin')) {
        techStack.push({
          name: 'Gin',
          version: undefined,
          type: 'framework',
          usage: 'primary'
        });
      } else if (imp.includes('gorm')) {
        techStack.push({
          name: 'GORM',
          version: undefined,
          type: 'library',
          usage: 'primary'
        });
      } else if (imp.includes('jwt')) {
        techStack.push({
          name: 'JWT',
          version: undefined,
          type: 'library',
          usage: 'secondary'
        });
      } else if (imp.includes('testify') || imp.includes('testing')) {
        techStack.push({
          name: 'Testing Framework',
          version: undefined,
          type: 'tool',
          usage: 'testing'
        });
      } else if (imp.includes('database') || imp.includes('sql')) {
        techStack.push({
          name: 'Database',
          version: undefined,
          type: 'database',
          usage: 'primary'
        });
      }
    }
    
    return techStack;
  }

  /**
   * VS Code enhanced: Get file statistics for large projects
   */
  async getProjectStats(): Promise<{goFiles: number, totalFiles: number, largestPackage: string}> {
    try {
      const goFiles = await vscode.workspace.findFiles('**/*.go', '**/node_modules/**');
      const allFiles = await vscode.workspace.findFiles('**/*', '**/node_modules/**');
      
      // Find largest package by analyzing first 50 files
      const packageCounts = new Map<string, number>();
      const filesToCheck = goFiles.slice(0, 50);
      
      for (const fileUri of filesToCheck) {
        try {
          const document = await vscode.workspace.openTextDocument(fileUri);
          const content = document.getText();
          const packageMatch = content.match(/^package\s+(\w+)/m);
          if (packageMatch) {
            const pkg = packageMatch[1];
            packageCounts.set(pkg, (packageCounts.get(pkg) || 0) + 1);
          }
        } catch {
          continue;
        }
      }

      let largestPackage = 'main';
      let maxCount = 0;
      for (const [pkg, count] of packageCounts.entries()) {
        if (count > maxCount) {
          maxCount = count;
          largestPackage = pkg;
        }
      }

      return {
        goFiles: goFiles.length,
        totalFiles: allFiles.length,
        largestPackage
      };
    } catch (error: any) {
      this.log(`⚠️ Error getting project stats: ${error.message}`);
      return { goFiles: 0, totalFiles: 0, largestPackage: 'unknown' };
    }
  }

  /**
   * VS Code enhanced: Validate Go project structure
   */
  async validateGoProject(): Promise<{isValid: boolean, issues: string[]}> {
    const issues: string[] = [];
    
    try {
      // Check for go.mod file
      const goModFiles = await vscode.workspace.findFiles('**/go.mod', '**/node_modules/**');
      if (goModFiles.length === 0) {
        issues.push('No go.mod file found - not a Go module');
      }

      // Check for main package
      const goFiles = await vscode.workspace.findFiles('**/*.go', '**/node_modules/**');
      let hasMainPackage = false;
      
      for (const fileUri of goFiles.slice(0, 10)) {
        try {
          const document = await vscode.workspace.openTextDocument(fileUri);
          const content = document.getText();
          if (content.match(/^package\s+main/m)) {
            hasMainPackage = true;
            break;
          }
        } catch {
          continue;
        }
      }
      
      if (!hasMainPackage && goFiles.length > 0) {
        issues.push('No main package found - might be a library project');
      }

      if (goFiles.length === 0) {
        issues.push('No Go files found in project');
      }

      return {
        isValid: issues.length === 0,
        issues
      };
    } catch (error: any) {
      issues.push(`Validation error: ${error.message}`);
      return { isValid: false, issues };
    }
  }

  /**
   * VS Code specific: Log to output channel
   */
  private log(message: string): void {
    this.outputChannel.appendLine(message);
    console.log(message); // Also log to console for development
  }

  /**
   * VS Code specific: Show output channel
   */
  showOutput(): void {
    this.outputChannel.show();
  }

  /**
   * VS Code specific: Clear output channel
   */
  clearOutput(): void {
    this.outputChannel.clear();
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    this.outputChannel.dispose();
  }
} 