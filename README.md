# AI Product Owner Agent

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/your-org/ai-product-owner-agent/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Overview
The **AI Product Owner Agent** is a VS Code extension and CLI tool that automates the technical analysis of Jira epics and Go codebases. It generates comprehensive, implementation-ready technical documentation and prompt workflows for GitHub Copilot (or any LLM), saving engineering teams days of manual effort and ensuring consistent, high-quality output.

## Key Features
- Automated Jira & Go codebase analysis
- Multi-stage, context-rich prompt generation (Context7/Anthropic style)
- Copilot/LLM integration (manual now, automated in future)
- Structured output: technical docs, diagrams, Jira-ready tasks
- Risk assessment, decision log, and implementation plan

## Quick Start
1. **Install the extension** in VS Code
2. **Configure Jira credentials** and output directory
3. **Run "Analyze Epic"** from the command palette
4. **Copy prompts to Copilot/LLM, paste responses into output files**
5. **Review and use the generated documentation**

## Architecture
See [ARCHITECTURE.md](docs/ARCHITECTURE.md) for full diagrams and component details.

## Documentation
- [Product Requirements (PRD)](docs/PRODUCT_REQUIREMENTS.md)
- [Architecture Overview](docs/ARCHITECTURE.md)
- [User Guide](docs/USER_GUIDE.md)
- [Developer Guide](docs/DEVELOPER_GUIDE.md)
- [PoC Guide](docs/POC_GUIDE.md)

## Contributing
See [docs/DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md) for setup, coding standards, and contribution process.

## License
MIT
