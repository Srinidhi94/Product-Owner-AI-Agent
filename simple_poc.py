#!/usr/bin/env python3
"""
AI Product Owner - Single Comprehensive Prompt System
Analyzes Jira Portfolio + Go Codebase and generates ONE comprehensive prompt for GitHub Copilot analysis.
"""

import os
import json
import requests
import base64
from pathlib import Path
from datetime import datetime
import argparse
import re
from typing import Dict, List, Optional, NamedTuple
from dataclasses import dataclass

@dataclass
class PromptStage:
    name: str
    prompt: str
    expected_output: str

class AdvancedPromptGenerator:
    """Generates a single comprehensive prompt for complete Copilot analysis"""
    
    def generate_comprehensive_prompt(self, jira_data: Dict, codebase_data: Dict) -> str:
        """Generate one comprehensive prompt for complete analysis"""
        
        jira_context = self._format_jira_context(jira_data)
        codebase_context = self._format_codebase_context(codebase_data)
        
        return f"""# 🤖 AI Product Owner - Comprehensive Technical Analysis

## Your Role & Expertise
You are a senior technical product owner with 10+ years of experience in:
- Go microservices architecture and enterprise software design
- Risk assessment, mitigation, and agile development methodologies
- System integration patterns and technical decision-making

## Analysis Framework
Use this structured approach for comprehensive analysis:
1. **Business Context First**: Understand business value and user impact
2. **Technical Depth**: Analyze architecture, performance, security, scalability
3. **Risk-Driven Decisions**: Identify and assess technical/operational risks
4. **Alternative Thinking**: Consider multiple implementation approaches
5. **Practical Implementation**: Focus on actionable, implementable solutions

## Context Data

### 📋 Jira Epic/Portfolio Information:
{jira_context}

### 🏗️ Current Codebase Architecture:
{codebase_context}

## Required Analysis

Please perform a comprehensive analysis covering ALL of the following sections in your response:

### 1. 📊 Executive Summary
Provide a clear 3-4 sentence summary covering:
- Business objective and user value
- Recommended technical approach
- Key risks and mitigation strategies
- Estimated timeline and resource requirements

### 2. 🎯 Business Requirements Analysis
- **Problem Statement**: Core business problem being solved
- **User Impact**: Target users and their specific benefits
- **Success Metrics**: Measurable business outcomes and acceptance criteria
- **Strategic Value**: Business importance and competitive advantage
- **Stakeholder Analysis**: Key stakeholders and their concerns/requirements

### 3. 🏗️ Technical Architecture Assessment
- **Current State Evaluation**: Existing system capabilities and constraints
- **Architecture Patterns**: Assessment of current patterns (effectiveness, debt, scalability)
- **Integration Analysis**: APIs, service boundaries, data flow, external dependencies
- **Development Readiness**: Code quality, testing, deployment procedures
- **Technical Constraints**: Limitations, bottlenecks, security gaps, operational overhead

### 4. 💡 Solution Design & Alternatives
Generate **3-5 different implementation approaches**, for each provide:
- **Architecture Overview**: High-level design with key components
- **Technology Stack**: Specific technologies and frameworks to use
- **Implementation Complexity**: Development effort and realistic timeline
- **Pros & Cons**: Detailed trade-off analysis
- **Risk Assessment**: Technical and operational risks
- **Scalability**: Performance and growth considerations

Then provide your **recommended solution** with:
- **Chosen Approach**: Which solution you recommend and detailed rationale
- **Decision Logic**: Why this approach beats the alternatives
- **Success Metrics**: How to measure implementation success
- **Risk Mitigation**: Specific strategies for identified risks

### 5. ⚠️ Risk Assessment Matrix
Create a comprehensive risk analysis:
- **Technical Risks**: Implementation challenges, performance issues, integration problems
- **Operational Risks**: Deployment concerns, monitoring, maintenance overhead
- **Business Risks**: Timeline delays, scope creep, market competition
- **Mitigation Strategies**: Specific actionable plans for each identified risk
- **Contingency Plans**: Backup approaches if primary solutions fail

### 6. 🗺️ Implementation Roadmap
- **Phase Breakdown**: 3-4 logical development phases with clear deliverables
- **Milestone Planning**: Key checkpoints and deliverables for each phase
- **Timeline Estimation**: Realistic schedule with dependencies
- **Team Requirements**: Skills, roles, and resources needed
- **Critical Path**: Dependencies that could block progress
- **Parallel Work Opportunities**: Tasks that can be developed simultaneously

### 7. 📋 Jira Epic & Story Structure
Create detailed breakdown ready for import:
- **Epic Categories**: Group functionality (API, Database, Security, etc.)
- **Epic Prioritization**: Sequence based on dependencies and business value
- **User Stories**: For each epic, create stories with:
  - Clear, user-focused titles
  - Specific acceptance criteria
  - Story point estimates (Fibonacci scale)
  - Definition of done
  - Dependencies and blocking relationships
- **Sprint Planning**: Logical grouping for 2-week sprints
- **Subtasks**: Technical tasks, testing, documentation, reviews

### 8. 📝 Technical Specifications
- **API Design**: Endpoint specifications and data contracts
- **Database Design**: Schema changes and migration strategy
- **Security Implementation**: Authentication, authorization, encryption
- **Integration Points**: External service connections and protocols
- **Testing Strategy**: Unit, integration, acceptance testing approaches
- **Deployment Plan**: CI/CD pipeline and infrastructure requirements

### 9. 🔍 Decision Log & Rationale
Document key decisions with reasoning:
- **Technology Choices**: Framework and library selections with justification
- **Architecture Decisions**: Design pattern choices and trade-offs
- **Implementation Approach**: Why chosen over alternatives
- **Risk Trade-offs**: Acceptable risks vs. mitigation costs

### 10. ❓ Open Questions & Next Steps
- **Technical Unknowns**: Areas requiring further investigation
- **Business Clarifications**: Requirements needing stakeholder input
- **External Dependencies**: Third-party integrations and their timelines
- **Validation Steps**: How to validate assumptions before implementation

## Output Guidelines
- Use specific examples from the provided codebase context
- Provide quantitative estimates where possible (effort, timeline, story points)
- Include concrete code examples or API specifications when relevant
- Ensure all recommendations are actionable and implementable
- Maintain focus on business outcomes while ensuring technical excellence

Please provide a comprehensive analysis following this complete framework."""

    def _format_jira_context(self, jira_data: Dict) -> str:
        """Format Jira data for prompt context"""
        context = []
        context.append(f"**Epic/Portfolio**: {jira_data['key']} - {jira_data['name']}")
        context.append(f"**Type**: {jira_data['type']}")
        context.append(f"**Total Story Points**: {jira_data['total_story_points']}")
        context.append(f"**Description**: {jira_data.get('description', 'N/A')}")
        context.append("")
        
        context.append("**Epic Details:**")
        for epic in jira_data['epics']:
            context.append(f"- **{epic['key']}**: {epic['summary']}")
            context.append(f"  - Status: {epic['status']}")
            context.append(f"  - Story Points: {epic['total_points']}")
            context.append(f"  - Stories: {len(epic['stories'])}")
            if epic.get('description'):
                context.append(f"  - Description: {epic['description']}")
            
            if epic['stories']:
                context.append("  - User Stories:")
                for story in epic['stories'][:5]:  # Limit to first 5 stories
                    context.append(f"    - {story['key']}: {story['summary']} ({story.get('story_points', 0)} pts)")
            context.append("")
        
        return "\n".join(context)
    
    def _format_codebase_context(self, codebase_data: Dict) -> str:
        """Format codebase data for prompt context"""
        context = []
        context.append(f"**Project Path**: {codebase_data['project_path']}")
        context.append(f"**Total Go Files**: {codebase_data['total_files']}")
        context.append(f"**Packages**: {', '.join(codebase_data['packages'])}")
        context.append(f"**Architecture Patterns**: {', '.join(codebase_data['patterns'])}")
        context.append("")
        
        context.append("**Key Data Structures:**")
        context.append(f"- Structs: {', '.join(codebase_data['structs'][:10])}")
        context.append("")
        
        context.append("**Core Functions:**")
        context.append(f"- Functions: {', '.join(codebase_data['functions'][:10])}")
        context.append("")
        
        context.append("**External Dependencies:**")
        context.append(f"- Imports: {', '.join(codebase_data['imports'][:10])}")
        context.append("")
        
        return "\n".join(context)



class JiraClient:
    def __init__(self, jira_url: str, token: str, email: str):
        """
        Initialize Jira client with API token authentication.
        
        Args:
            jira_url: Your Jira domain (e.g., company.atlassian.net)
            token: API token from Atlassian account
            email: Your email address
        """
        self.base_url = jira_url.rstrip('/')
        if not self.base_url.startswith('https://'):
            self.base_url = f"https://{self.base_url}"
        
        # Use Basic Auth with email and API token
        credentials = base64.b64encode(f"{email}:{token}".encode()).decode()
        self.headers = {
            'Authorization': f'Basic {credentials}',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
        print(f"🔑 Using API token authentication for: {email}")
        print(f"🌐 Jira URL: {self.base_url}")
        print(f"🔐 Auth header (first 20 chars): Basic {credentials[:20]}...")
    
    def test_connection(self) -> bool:
        """Test Jira connection"""
        try:
            # Test with the same type of endpoint that works in curl
            test_url = f"{self.base_url}/rest/api/3/myself"
            print(f"🔗 Testing connection to: {test_url}")
            
            # Use minimal headers like curl - remove Content-Type for GET requests
            test_headers = {
                'Authorization': self.headers['Authorization'],
                'Accept': 'application/json'
            }
            
            response = requests.get(test_url, headers=test_headers, timeout=10)
            print(f"📡 Response status: {response.status_code}")
            
            if response.status_code == 200:
                user_data = response.json()
                print(f"✅ Connected to Jira as: {user_data.get('displayName', 'Unknown')}")
                print(f"📧 Account ID: {user_data.get('accountId', 'Unknown')}")
                return True
            else:
                print(f"❌ Jira connection failed: {response.status_code}")
                print(f"📄 Response: {response.text}")
                
                # Try alternative test - use issue endpoint like the working curl
                print("🔄 Trying alternative test with issue endpoint...")
                return self._test_with_issue_endpoint()
                
        except Exception as e:
            print(f"❌ Jira connection error: {e}")
            return False
    
    def _test_with_issue_endpoint(self) -> bool:
        """Test connection using issue endpoint (matches curl command)"""
        try:
            # Use a generic issue search that should work with basic permissions
            test_url = f"{self.base_url}/rest/api/3/search"
            test_headers = {
                'Authorization': self.headers['Authorization'],
                'Accept': 'application/json'
            }
            
            # Simple JQL query to test access
            params = {'jql': 'project is not EMPTY', 'maxResults': 1}
            
            response = requests.get(test_url, headers=test_headers, params=params, timeout=10)
            print(f"📡 Alternative test status: {response.status_code}")
            
            if response.status_code == 200:
                print("✅ Connection successful with issue search endpoint")
                return True
            else:
                print(f"❌ Alternative test failed: {response.status_code}")
                print(f"📄 Response: {response.text}")
                
                # Provide helpful error messages
                if response.status_code == 401:
                    print("💡 Authentication failed. Check your token and credentials.")
                    print("💡 Verify your API token is valid and hasn't expired.")
                elif response.status_code == 403:
                    print("💡 Access forbidden. Check your token permissions and scopes.")
                elif response.status_code == 404:
                    print("💡 Endpoint not found. Check your cloud ID or base URL.")
                
                return False
                
        except Exception as e:
            print(f"❌ Alternative test error: {e}")
            return False
    
    def debug_exact_curl_command(self, issue_key: str) -> bool:
        """Test the exact same API call as the working curl command"""
        try:
            print(f"🧪 Testing exact curl equivalent for issue: {issue_key}")
            
            # Replicate exact curl command
            test_url = f"{self.base_url}/rest/api/3/issue/{issue_key}"
            test_headers = {
                'Authorization': self.headers['Authorization'],
                'Accept': 'application/json'
            }
            
            print(f"🔗 URL: {test_url}")
            print(f"📋 Headers: {test_headers}")
            
            response = requests.get(test_url, headers=test_headers, timeout=10)
            print(f"📡 Response status: {response.status_code}")
            
            if response.status_code == 200:
                issue_data = response.json()
                print(f"✅ SUCCESS! Issue found: {issue_data['fields']['summary']}")
                return True
            else:
                print(f"❌ Failed: {response.status_code}")
                print(f"📄 Response: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Debug test error: {e}")
            return False
    
    def fetch_portfolio_or_epic(self, key: str) -> Optional[Dict]:
        """Fetch portfolio/epic with stories"""
        try:
            print(f"🔍 Attempting to fetch: {key}")
            
            # Try as Epic first
            print("📋 Trying as Epic...")
            epic_data = self._fetch_epic_with_stories(key)
            if epic_data:
                print(f"✅ Successfully fetched as Epic: {epic_data['summary']}")
                return {
                    'type': 'epic',
                    'key': key,
                    'name': epic_data['summary'],
                    'description': epic_data['description'],
                    'epics': [epic_data],
                    'total_story_points': epic_data['total_points']
                }
            
            # Try as Project (Portfolio-like)
            print("📂 Trying as Project...")
            project_data = self._fetch_project_epics(key)
            if project_data:
                print(f"✅ Successfully fetched as Project with {len(project_data['epics'])} epics")
                return project_data
                
            print(f"❌ Could not find portfolio/epic: {key}")
            print("💡 Make sure the key exists and you have permission to access it")
            return None
            
        except Exception as e:
            print(f"❌ Error fetching Jira data: {e}")
            print(f"🔍 Check your Jira URL and token")
            return None
    
    def _fetch_epic_with_stories(self, epic_key: str) -> Optional[Dict]:
        """Fetch single epic with its stories"""
        try:
            # Fetch epic details
            epic_url = f"{self.base_url}/rest/api/3/issue/{epic_key}"
            
            # Use minimal headers for GET requests (like curl)
            issue_headers = {
                'Authorization': self.headers['Authorization'],
                'Accept': 'application/json'
            }
            
            response = requests.get(epic_url, headers=issue_headers, timeout=10)
            
            if response.status_code != 200:
                print(f"⚠️  Epic not found or no access: {epic_key}")
                return None
                
            epic_data = response.json()
            
            # Get stories in this epic
            stories_jql = f'"Epic Link" = {epic_key}'
            stories = self._search_issues(stories_jql)
            
            total_points = sum(story.get('story_points', 0) for story in stories)
            
            return {
                'key': epic_key,
                'summary': epic_data['fields']['summary'],
                'description': epic_data['fields'].get('description', ''),
                'status': epic_data['fields']['status']['name'],
                'stories': stories,
                'total_points': total_points
            }
            
        except Exception as e:
            print(f"❌ Error fetching epic {epic_key}: {e}")
            return None
    
    def _fetch_project_epics(self, project_key: str) -> Optional[Dict]:
        """Fetch project with its epics"""
        try:
            # Search for epics in this project
            epics_jql = f'project = {project_key} AND issuetype = Epic'
            epic_issues = self._search_issues(epics_jql, expand=['description'])
            
            if not epic_issues:
                return None
            
            epics = []
            total_story_points = 0
            
            for epic_issue in epic_issues:
                epic_key = epic_issue['key']
                epic_data = self._fetch_epic_with_stories(epic_key)
                if epic_data:
                    epics.append(epic_data)
                    total_story_points += epic_data['total_points']
            
            return {
                'type': 'project',
                'key': project_key,
                'name': f"Project {project_key}",
                'description': f"Portfolio containing {len(epics)} epics",
                'epics': epics,
                'total_story_points': total_story_points
            }
            
        except Exception as e:
            print(f"❌ Error fetching project {project_key}: {e}")
            return None
    
    def _search_issues(self, jql: str, expand: List[str] = None) -> List[Dict]:
        """Search for issues using JQL"""
        try:
            search_url = f"{self.base_url}/rest/api/3/search"
            params = {
                'jql': jql,
                'maxResults': 100,
                'fields': 'summary,description,status,customfield_10016'  # story points field
            }
            
            if expand:
                params['expand'] = ','.join(expand)
            
            # Use minimal headers for GET requests (like curl)
            search_headers = {
                'Authorization': self.headers['Authorization'],
                'Accept': 'application/json'
            }
            
            response = requests.get(search_url, headers=search_headers, params=params, timeout=10)
            
            if response.status_code != 200:
                print(f"⚠️  Search failed: {response.status_code} - {response.text}")
                return []
            
            data = response.json()
            issues = []
            
            for issue in data.get('issues', []):
                issues.append({
                    'key': issue['key'],
                    'summary': issue['fields']['summary'],
                    'description': issue['fields'].get('description', ''),
                    'status': issue['fields']['status']['name'],
                    'story_points': issue['fields'].get('customfield_10016', 0) or 0  # Handle None
                })
            
            return issues
            
        except Exception as e:
            print(f"❌ Error searching issues: {e}")
            return []

class GoCodeAnalyzer:
    def __init__(self, project_path: str):
        self.project_path = Path(project_path)
        print(f"🔍 Analyzing Go project at: {self.project_path.absolute()}")
    
    def analyze_codebase(self) -> Dict:
        """Analyze Go codebase structure and extract key information"""
        print(f"🔍 Analyzing Go project at: {self.project_path.absolute()}")
        
        # Check if project path exists
        if not self.project_path.exists():
            print("📂 Scanning Go files...")
            return self._demo_codebase_analysis()
        
        
            go_files = list(self.project_path.rglob("*.go"))
            
            if not go_files:
            print("⚠️  No Go files found, using demo analysis")
                return self._demo_codebase_analysis()
            
        print(f"📄 Found {len(go_files)} Go files")
        
        # Extract basic info
            packages = set()
        structs = []
            functions = []
        imports = set()
        
        for go_file in go_files[:20]:  # Limit to first 20 files for performance
            try:
                content = go_file.read_text(encoding='utf-8')
                
                # Extract package names
                package_match = re.search(r'^package\s+(\w+)', content, re.MULTILINE)
                if package_match:
                    packages.add(package_match.group(1))
                
                # Extract struct definitions
                struct_matches = re.findall(r'type\s+(\w+)\s+struct', content)
                structs.extend(struct_matches)
                
                # Extract function definitions
                func_matches = re.findall(r'func\s+(?:\(\w+\s+\*?\w+\)\s+)?(\w+)\s*\(', content)
                    functions.extend(func_matches)
                    
                # Extract imports
                import_matches = re.findall(r'import\s+(?:\(\s*)?(?:"([^"]+)"|`([^`]+)`)', content)
                for match in import_matches:
                    imports.add(match[0] or match[1])
                    
                except Exception as e:
                print(f"⚠️  Error reading {go_file}: {e}")
                    continue
            
        # Identify patterns
        patterns = self._identify_patterns(go_files)
        
        analysis = {
                'total_files': len(go_files),
                'packages': list(packages),
            'structs': structs[:10],  # Limit output
            'functions': functions[:15],  # Limit output
            'imports': list(imports)[:10],  # Limit output
            'patterns': patterns,
            'project_path': str(self.project_path)
        }
        
        print(f"✅ Analysis complete: {len(packages)} packages, {len(structs)} structs, {len(functions)} functions")
        return analysis
    
    def _demo_codebase_analysis(self):
        """Return demo analysis when no Go files found"""
        print("🎭 Using demo codebase analysis")
        return {
            'total_files': 15,
            'packages': ['main', 'handlers', 'models', 'services', 'utils'],
            'structs': ['User', 'Product', 'Order', 'APIResponse', 'Config'],
            'functions': ['GetUser', 'CreateProduct', 'ProcessOrder', 'ValidateToken', 'HandleError'],
            'imports': ['gin-gonic/gin', 'gorm.io/gorm', 'github.com/golang-jwt/jwt'],
            'patterns': ['REST API', 'Gin Framework', 'GORM ORM', 'JWT Authentication'],
            'project_path': str(self.project_path)
        }
    
    def _identify_patterns(self, go_files: List[Path]) -> List[str]:
        """Identify common Go patterns in the codebase"""
        patterns = []
        all_content = ""
        
        # Read some files to identify patterns
        for go_file in go_files[:10]:
            try:
                content = go_file.read_text(encoding='utf-8')
                all_content += content.lower()
            except:
                continue
        
        # Check for common patterns
        if 'gin' in all_content:
            patterns.append('Gin Framework')
        if 'gorm' in all_content:
            patterns.append('GORM ORM')
        if 'jwt' in all_content:
            patterns.append('JWT Authentication')
        if 'handler' in all_content:
            patterns.append('Handler Pattern')
        if 'middleware' in all_content:
            patterns.append('Middleware')
        if 'router' in all_content:
            patterns.append('REST API')
        if 'docker' in str(go_files):
            patterns.append('Containerized')
        if 'kubernetes' in str(go_files) or 'k8s' in str(go_files):
            patterns.append('Kubernetes Ready')
        
        return patterns or ['Standard Go Project']

class ComprehensiveAnalysisEngine:
    """Advanced analysis engine for generating comprehensive Copilot prompts"""
    
    def __init__(self):
        self.timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.prompt_generator = AdvancedPromptGenerator()
    
    def generate_comprehensive_analysis(self, portfolio_data: Dict, codebase_analysis: Dict) -> str:
        """Generate single comprehensive prompt for Copilot analysis"""
        
        # Generate the single comprehensive prompt
        comprehensive_prompt = self.prompt_generator.generate_comprehensive_prompt(portfolio_data, codebase_analysis)
        
        report_sections = []
        
        # Header
        report_sections.append(f"# 🤖 AI Product Owner - Single Comprehensive Prompt")
        report_sections.append(f"**Epic/Portfolio**: {portfolio_data['key']} - {portfolio_data['name']}")
        report_sections.append(f"**Generated**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report_sections.append("")
        
        # Executive Summary
        report_sections.append("## 📊 Analysis Overview")
        report_sections.append(f"- **Business Scope**: {len(portfolio_data['epics'])} epics, {portfolio_data['total_story_points']} story points")
        report_sections.append(f"- **Technical Scope**: {codebase_analysis['total_files']} Go files, {len(codebase_analysis['packages'])} packages")
        report_sections.append(f"- **Architecture**: {', '.join(codebase_analysis['patterns'])}")
        report_sections.append(f"- **Analysis Type**: Single comprehensive prompt covering all aspects")
        report_sections.append("")
        
        # Benefits of single prompt approach
        report_sections.append("## 🚀 Benefits of Single Prompt Approach")
        report_sections.append("✅ **Streamlined Workflow**: One copy/paste instead of 6 separate prompts")
        report_sections.append("✅ **Contextual Continuity**: AI maintains full context throughout analysis")
        report_sections.append("✅ **Comprehensive Output**: Complete analysis in one response")
        report_sections.append("✅ **Time Efficient**: 5-10 minutes instead of 30+ minutes")
        report_sections.append("✅ **Consistent Quality**: No context loss between stages")
        report_sections.append("")
        
        # Instructions
        report_sections.append("## 📋 How to Use This Prompt")
        report_sections.append("### Steps:")
        report_sections.append("1. **Copy the entire prompt** below (from '# 🤖 AI Product Owner...' to the end)")
        report_sections.append("2. **Paste into GitHub Copilot Chat** (VS Code, GitHub.com, or Copilot app)")
        report_sections.append("3. **Wait for complete response** - this will be comprehensive!")
        report_sections.append("4. **Save the response** as your technical analysis document")
        report_sections.append("5. **Use the analysis** for sprint planning and implementation")
        report_sections.append("")
        
        # Expected output preview
        report_sections.append("## 📖 Expected Analysis Output")
        report_sections.append("The AI will provide a complete analysis covering:")
        report_sections.append("- 📊 **Executive Summary** - Business objectives and technical approach")
        report_sections.append("- 🎯 **Business Requirements** - Problem statement and user impact")
        report_sections.append("- 🏗️ **Technical Assessment** - Architecture evaluation and constraints")
        report_sections.append("- 💡 **Solution Alternatives** - 3-5 approaches with detailed comparison")
        report_sections.append("- ⚠️ **Risk Matrix** - Comprehensive risk assessment with mitigations")
        report_sections.append("- 🗺️ **Implementation Roadmap** - Phased approach with timelines")
        report_sections.append("- 📋 **Jira Structure** - Ready-to-import epics and stories")
        report_sections.append("- 📝 **Technical Specs** - API design, database, security details")
        report_sections.append("- 🔍 **Decision Log** - Rationale for all technical choices")
        report_sections.append("- ❓ **Open Questions** - Areas needing further investigation")
        report_sections.append("")
        
        # The comprehensive prompt
        report_sections.append("## 🎯 Copy This Complete Prompt into GitHub Copilot:")
        report_sections.append("")
        report_sections.append("```")
        report_sections.append(comprehensive_prompt)
        report_sections.append("```")
        report_sections.append("")
        
        # Footer
        report_sections.append("---")
        report_sections.append("")
        report_sections.append("## 📎 Raw Context Data (For Reference)")
        report_sections.append("")
        report_sections.append("### Jira Portfolio/Epic Data:")
        report_sections.append("```json")
        report_sections.append(json.dumps(portfolio_data, indent=2))
        report_sections.append("```")
        report_sections.append("")
        report_sections.append("### Codebase Analysis Data:")
        report_sections.append("```json")
        report_sections.append(json.dumps(codebase_analysis, indent=2))
        report_sections.append("```")
        
        return "\n".join(report_sections)
    
    def save_output(self, content: str, portfolio_key: str) -> str:
        """Save generated comprehensive prompt to file"""
        filename = f"copilot_single_prompt_{portfolio_key}_{self.timestamp}.md"
        filepath = Path(filename)
        
        try:
            filepath.write_text(content, encoding='utf-8')
            print(f"💾 Saved single comprehensive prompt to: {filepath.absolute()}")
            return str(filepath.absolute())
        except Exception as e:
            print(f"❌ Error saving file: {e}")
            return ""
    

    


def parse_arguments():
    """Parse command line arguments"""
    parser = argparse.ArgumentParser(
        description="AI Product Owner PoC - Generate single comprehensive prompt for Copilot analysis",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Analyze a Jira epic with current directory as Go project
  python simple_poc.py --key PROJ-123 --email user@company.com --token YOUR_TOKEN --url company.atlassian.net
  
  # Analyze with custom Go project path
  python simple_poc.py --key PROJ-123 --email user@company.com --token YOUR_TOKEN --url company.atlassian.net --project /path/to/go/project
  
  # Demo mode with single comprehensive prompt
  python simple_poc.py --demo
        """
    )
    
    parser.add_argument(
        '--key', '-k',
        help="Jira Epic/Portfolio key (e.g., PROJ-123)",
        required=False
    )
    
    parser.add_argument(
        '--email', '-e',
        help="Your Jira email address",
        required=False
    )
    
    parser.add_argument(
        '--token', '-t',
        help="Jira API token (generate at: https://id.atlassian.com/manage-profile/security/api-tokens)",
        required=False
    )
    
    parser.add_argument(
        '--url', '-u',
        help="Jira URL (e.g., company.atlassian.net)",
        required=False
    )
    
    parser.add_argument(
        '--project', '-p',
        default=".",
        help="Path to Go project directory (default: current directory)"
    )
    
    parser.add_argument(
        '--demo', '-d',
        action='store_true',
        help="Run in demo mode with mock data"
    )
    
    return parser.parse_args()

def main():
    print("🚀 AI Product Owner PoC - Single Comprehensive Prompt Generator")
    print("=" * 70)
    
    args = parse_arguments()
    
    # Validate arguments
    if not args.demo and not all([args.key, args.email, args.token, args.url]):
        print("❌ Missing required arguments. Either use --demo or provide all Jira credentials.")
        print("Run with --help for usage examples.")
        return
    
    if args.demo:
        print("🎭 Demo mode: Using mock data")
        
        # Mock portfolio data
        portfolio_data = {
            'type': 'epic',
            'key': 'DEMO-123',
            'name': 'User Authentication System',
            'description': 'Implement comprehensive user authentication',
            'epics': [{
                'key': 'DEMO-123',
                'summary': 'User Authentication System',
                'description': 'OAuth2, JWT tokens, role-based access',
                'status': 'In Progress',
                'stories': [
                    {'key': 'DEMO-124', 'summary': 'Login endpoint', 'story_points': 5},
                    {'key': 'DEMO-125', 'summary': 'JWT middleware', 'story_points': 8},
                    {'key': 'DEMO-126', 'summary': 'User roles', 'story_points': 13}
                ],
                'total_points': 26
            }],
            'total_story_points': 26
        }
        
        # Analyze codebase
        codebase_analyzer = GoCodeAnalyzer(args.project)
        codebase_analysis = codebase_analyzer.analyze_codebase()
        
    else:
        # Step 1: Test Jira connection and fetch portfolio/epic
        print("\n🔗 Testing Jira connection...")
        jira_client = JiraClient(args.url, args.token, args.email)
        
        # Debug: Test exact same API call as working curl
        print("\n🧪 Debug: Testing exact curl equivalent...")
        if jira_client.debug_exact_curl_command(args.key):
            print("✅ Curl equivalent works! Proceeding with standard connection test...")
        
        if not jira_client.test_connection():
            print("❌ Failed to connect to Jira. Please check your credentials.")
            return
        
        print(f"🔍 Fetching Epic/Portfolio: {args.key}")
        portfolio_data = jira_client.fetch_portfolio_or_epic(args.key)
        
        if not portfolio_data:
            print("❌ Could not fetch Epic/Portfolio data")
            return
        
        # Step 2: Analyze codebase
        print("🔍 Analyzing Go codebase...")
        codebase_analyzer = GoCodeAnalyzer(args.project)
        codebase_analysis = codebase_analyzer.analyze_codebase()
    
    # Step 3: Generate comprehensive analysis prompts
    print("⚡ Generating single comprehensive prompt for Copilot...")
    analysis_engine = ComprehensiveAnalysisEngine()
    prompts = analysis_engine.generate_comprehensive_analysis(portfolio_data, codebase_analysis)
    
    # Step 4: Save and display
    output_file = analysis_engine.save_output(prompts, portfolio_data['key'])
    
    print("\n" + "="*80)
    print("🤖 SINGLE COMPREHENSIVE COPILOT PROMPT GENERATED")
    print("="*80)
    print(prompts[:2000] + "..." if len(prompts) > 2000 else prompts)  # Show first 2000 chars
    print("="*80)
    
    if output_file:
        print(f"\n✅ Complete! Single comprehensive prompt saved to: {output_file}")
    
    print("\n🚀 Next steps:")
    print("1. 📋 Open the generated file")
    print("2. 📋 Copy the ENTIRE prompt (inside the code block)")
    print("3. 🤖 Paste into GitHub Copilot Chat")
    print("4. ⏳ Wait for complete comprehensive analysis")
    print("5. 💾 Save Copilot's response as your technical analysis document")

if __name__ == "__main__":
    main()
