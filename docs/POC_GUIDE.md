# AI Product Owner PoC - Usage & Guide

## What is the PoC?
The PoC (`simple_poc.py`) is a standalone Python tool that demonstrates the core analysis and prompt generation logic of the AI Product Owner Agent, independent of the VS Code extension. It can analyze a Go codebase and Jira epic (real or mock) and generate a single comprehensive prompt for Copilot or any LLM.

## Quick Start
### Demo Mode (No Jira Required)
```bash
python simple_poc.py --demo
```
- Uses mock Jira data
- Analyzes Go codebase in current directory
- Generates a comprehensive prompt in ~30 seconds

### Real Jira Analysis
```bash
python simple_poc.py --key PROJ-123 --email user@company.com --token YOUR_TOKEN --url company.atlassian.net
```
- Fetches real Jira epic/portfolio data
- Analyzes Go codebase in current directory
- Generates a comprehensive prompt with real context

### Custom Project Path
```bash
python simple_poc.py --demo --project /path/to/your/go/project
```
- Uses demo Jira data
- Analyzes specified Go project

## Command-Line Options
- `--key, -k`: Jira Epic/Portfolio key
- `--email, -e`: Jira email address
- `--token, -t`: Jira API token
- `--url, -u`: Jira URL (no https://)
- `--project, -p`: Path to Go project directory (default: current directory)
- `--demo, -d`: Use demo mode with mock data
- `--help, -h`: Show all options

## Output Structure
- Generates a markdown file with a single comprehensive prompt
- Example: `copilot_single_prompt_DEMO-123_20250628_192831.md`
- Prompt covers: executive summary, requirements, technical analysis, solution alternatives, risk matrix, implementation plan, Jira structure, technical specs, decision log, open questions

## How to Use the Output
1. Open the generated markdown file
2. Copy the prompt section
3. Paste into GitHub Copilot Chat (or any LLM)
4. Wait for the full response
5. Save the Copilot response for documentation and planning

## Troubleshooting
- **Missing required arguments:** Use `--demo` or provide all Jira credentials
- **Failed to connect to Jira:** Check API token, email, and URL
- **No Go files found:** Check project path or use `--project` option
- **Output not generated:** Check for errors in the terminal

---
*For more details, see the [USAGE_GUIDE.md](../USAGE_GUIDE.md) and the source code in `simple_poc.py`.* 