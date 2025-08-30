import { JiraPortfolio, CodebaseAnalysis } from '../types';

/**
 * Build a structured, compact context frame to ground LLM analysis.
 * The frame is optimized to be pasted before task instructions.
 */
export function buildContextFrame(jira: JiraPortfolio, codebase: CodebaseAnalysis): string {
  const epicSummary = [
    `Epic Key: ${jira.key}`,
    `Name: ${jira.name}`,
    `Type: ${jira.type}`,
    `Total Story Points: ${jira.totalStoryPoints}`,
  ].join(' | ');

  const techStack = codebase.techStack
    .map(t => `${t.name}${t.version ? '@' + t.version : ''} (${t.type}, ${t.usage})`)
    .slice(0, 12);

  const keyDirs = codebase.structs.slice(0, 10);
  const keyImports = codebase.imports.slice(0, 12);
  const keyFns = codebase.functions.slice(0, 12);

  const patterns = codebase.patterns
    .map(p => `- ${p.name}: ${p.description} (confidence ${p.confidence}/10)`)
    .slice(0, 8)
    .join('\n');

  const deps = codebase.packages.slice(0, 20);

  return [
    '=== Context Engineering Frame ===',
    '',
    'Scope',
    `- Analyze and plan within the bounds of epic ${jira.key}. Respect the existing repository’s patterns and decisions.`,
    '',
    'Grounding Facts',
    `- Epic: ${epicSummary}`,
    `- Project Path: ${codebase.projectPath}`,
    `- Detected Tech Stack: ${techStack.join(', ') || 'Unknown'}`,
    `- Total Source Files: ${codebase.totalFiles}`,
    `- Quality: debt=${codebase.metrics.technicalDebt}, maintainability=${codebase.metrics.maintainability}/10, complexity=${codebase.metrics.complexity}`,
    `- Key Directories: ${keyDirs.join(', ') || 'N/A'}`,
    `- Notable Imports/Frameworks: ${keyImports.join(', ') || 'N/A'}`,
    `- Representative Functions/Classes: ${keyFns.join(', ') || 'N/A'}`,
    (patterns ? 'Architecture Patterns:\n' + patterns : 'Architecture Patterns: N/A'),
    deps.length ? `- Dependencies (top): ${deps.join(', ')}` : '- Dependencies: N/A',
    '',
    'Constraints',
    '- Adhere to existing code patterns, module boundaries, naming, and layering.',
    '- Do not introduce new tech/libraries unless necessary; justify with ROI, risk, and migration impact.',
    '- Maintain backward compatibility and non-breaking changes unless explicitly allowed.',
    '- Ensure security, compliance, and privacy considerations of enterprise environments.',
    '- Provide citations to actual repository paths/files you referenced; avoid fabricating names.',
    '',
    'Non-Goals',
    '- Do not redesign the entire system.',
    '- Do not propose technologies not used in the repo without strong justification.',
    '',
    'Uncertainties & Questions',
    '- List any missing information and ask specific, actionable clarification questions.',
    '',
    'Output Guardrails',
    '- Provide concise, decision-ready outputs. Prefer bullet points over prose.',
    '- Include a short “What I used” section with file path citations for traceability.',
    '- Call out assumptions explicitly. If evidence is weak, mark confidence.',
    '=== End Context Frame ===',
  ].join('\n');
} 