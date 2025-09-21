/**
 * Jira Client - Handles authentication and API communication with Jira instances
 * Supports Basic Auth with API tokens, comprehensive error handling, and VS Code integration
 */

import * as vscode from 'vscode';
import axios from 'axios';
import { JiraPortfolio, JiraEpic, JiraStory, JiraConfiguration } from '../types';

export class JiraClient {
  private config: JiraConfiguration;
  private baseUrl: string;
  private authHeader: string;
  private outputChannel: vscode.OutputChannel;

  constructor(config: JiraConfiguration) {
    this.config = config;

    // Normalize Jira URL format
    this.baseUrl = config.baseUrl.replace(/\/$/, ''); // Remove trailing slash
    if (!this.baseUrl.startsWith('https://')) {
      this.baseUrl = `https://${this.baseUrl}`;
    }

    // Basic Auth with API token
    const credentials = Buffer.from(`${config.email}:${config.token}`).toString('base64');
    this.authHeader = `Basic ${credentials}`;

    // VS Code output channel for logging
    this.outputChannel = vscode.window.createOutputChannel('AI Product Owner - Jira');

    this.log(`🔑 Using API token authentication for: ${config.email}`);
    this.log(`🌐 Jira URL: ${this.baseUrl}`);
    this.log(`🔐 Auth header (first 20 chars): Basic ${credentials.substring(0, 20)}...`);
  }

  /**
   * Test Jira connection using the /myself endpoint
   */
  async testConnection(): Promise<boolean> {
    try {
      // Test with the same type of endpoint that works in curl
      const testUrl = `${this.baseUrl}/rest/api/3/myself`;
      this.log(`🔗 Testing connection to: ${testUrl}`);

      // Use minimal headers like curl - remove Content-Type for GET requests
      const testHeaders = {
        Authorization: this.authHeader,
        Accept: 'application/json',
      };

      const response = await axios.get(testUrl, {
        headers: testHeaders,
        timeout: 10000,
      });

      this.log(`📡 Response status: ${response.status}`);

      if (response.status === 200) {
        const userData = response.data;
        this.log(`✅ Connected to Jira as: ${userData.displayName || 'Unknown'}`);
        this.log(`📧 Account ID: ${userData.accountId || 'Unknown'}`);
        return true;
      } else {
        this.log(`❌ Jira connection failed: ${response.status}`);
        this.log(`📄 Response: ${JSON.stringify(response.data)}`);

        // Try alternative test - use issue endpoint like the working curl
        this.log('🔄 Trying alternative test with issue endpoint...');
        return await this.testWithIssueEndpoint();
      }
    } catch (error: any) {
      this.log(`❌ Jira connection error: ${error.message}`);
      return false;
    }
  }

  /**
   * Alternative connection test using issue search endpoint
   */
  private async testWithIssueEndpoint(): Promise<boolean> {
    try {
      this.log('🔄 Testing with issue search endpoint...');

      const testUrl = `${this.baseUrl}/rest/api/3/search`;
      const testHeaders = {
        Authorization: this.authHeader,
        Accept: 'application/json',
      };

      // Simple JQL query to test access
      const params = { jql: 'project is not EMPTY', maxResults: 1 };

      const response = await axios.get(testUrl, {
        headers: testHeaders,
        params: params,
        timeout: 10000,
      });

      this.log(`📡 Alternative test status: ${response.status}`);

      if (response.status === 200) {
        this.log('✅ Connection successful with issue search endpoint');
        return true;
      } else {
        this.log(`❌ Alternative test failed: ${response.status}`);
        this.log(`📄 Response: ${JSON.stringify(response.data)}`);

        // Provide helpful error messages
        this.logConnectionHints(response.status);
        return false;
      }
    } catch (error: any) {
      this.log(`❌ Alternative test error: ${error.message}`);
      this.logConnectionError(error);
      return false;
    }
  }

  /**
   * Debug connection by testing a specific issue endpoint
   */
  async debugCurlEquivalent(issueKey: string): Promise<boolean> {
    try {
      this.log(`🧪 Testing exact curl equivalent for issue: ${issueKey}`);

      // Replicate exact curl command
      const testUrl = `${this.baseUrl}/rest/api/3/issue/${issueKey}`;
      const testHeaders = {
        Authorization: this.authHeader,
        Accept: 'application/json',
      };

      this.log(`🔗 URL: ${testUrl}`);
      this.log(`📋 Headers: ${JSON.stringify(testHeaders)}`);

      const response = await axios.get(testUrl, {
        headers: testHeaders,
        timeout: 10000,
      });

      this.log(`📡 Response status: ${response.status}`);

      if (response.status === 200) {
        const issueData = response.data;
        this.log(`✅ SUCCESS! Issue found: ${issueData.fields.summary}`);
        return true;
      } else {
        this.log(`❌ Failed: ${response.status}`);
        this.log(`📄 Response: ${JSON.stringify(response.data)}`);
        return false;
      }
    } catch (error: any) {
      this.log(`❌ Debug test error: ${error.message}`);
      return false;
    }
  }

  /**
   * Fetch portfolio or epic data with associated stories
   */
  async fetchPortfolioOrEpic(key: string): Promise<JiraPortfolio | null> {
    try {
      this.log(`🔍 Attempting to fetch: ${key}`);

      // Try as Epic first
      const epicData = await this.fetchEpicWithStories(key);
      if (epicData) {
        this.log(`✅ Successfully fetched as Epic with ${epicData.stories.length} stories`);
        return {
          type: 'epic',
          key: key,
          name: epicData.summary,
          totalStoryPoints: epicData.totalPoints,
          epics: [epicData],
        };
      }

      // Try as Project (Portfolio-like)
      this.log('📂 Trying as Project...');
      const projectData = await this.fetchProjectEpics(key);
      if (projectData) {
        this.log(`✅ Successfully fetched as Project with ${projectData.epics.length} epics`);
        return projectData;
      }

      this.log(`❌ Could not find portfolio/epic: ${key}`);
      this.log('💡 Make sure the key exists and you have permission to access it');
      return null;
    } catch (error: any) {
      this.log(`❌ Error fetching Jira data: ${error.message}`);
      this.log('🔍 Check your Jira URL and token');
      return null;
    }
  }

  /**
   * EXACT PORT: Fetch single epic with its stories (Python PoC implementation)
   */
  private async fetchEpicWithStories(epicKey: string): Promise<JiraEpic | null> {
    try {
      // Fetch epic details
      const epicUrl = `${this.baseUrl}/rest/api/3/issue/${epicKey}`;

      // Use minimal headers for GET requests (like curl)
      const issueHeaders = {
        Authorization: this.authHeader,
        Accept: 'application/json',
      };

      const response = await axios.get(epicUrl, {
        headers: issueHeaders,
        timeout: 10000,
      });

      if (response.status !== 200) {
        this.log(`⚠️ Epic not found or no access: ${epicKey}`);
        return null;
      }

      const epicData = response.data;

      // Get stories in this epic - use optimized queries based on Jira instance analysis
      let stories: JiraStory[] = [];

      // Optimized queries based on actual Jira field structure
      const epicLinkQueries = [
        // Direct parent relationship (most common in modern Jira)
        `parent = "${epicKey}"`,
        // Key-based search for child issues
        `key in childIssuesOf("${epicKey}")`,
        // Project-specific search with issue type filtering
        `project = "${
          epicKey.split('-')[0]
        }" AND issueType in (Story, Task, Bug) AND parent = "${epicKey}"`,
        // Fallback: search by epic key in various fields
        `"Epic Link" = "${epicKey}"`,
        `cf[10014] = "${epicKey}"`, // Common Epic Link custom field ID
      ];

      for (const jql of epicLinkQueries) {
        try {
          this.log(`🔍 Trying optimized query: ${jql}`);
          stories = await this.searchIssues(jql);
          if (stories.length > 0) {
            this.log(`✅ Found ${stories.length} stories using query: ${jql}`);
            break;
          }
        } catch (error: any) {
          this.log(`⚠️ Query failed (${error.response?.status || 'unknown'}): ${jql}`);
          // Continue to next query instead of failing completely
          continue;
        }
      }

      if (stories.length === 0) {
        this.log(`⚠️ No stories found for epic ${epicKey} with any Epic Link variation`);
      }

      // Calculate total story points
      const totalPoints = stories.reduce((sum, story) => sum + (story.storyPoints || 0), 0);

      return {
        key: epicKey,
        summary: epicData.fields.summary,
        description: this.extractDescription(epicData.fields.description),
        status: epicData.fields.status.name,
        stories: stories,
        totalPoints: totalPoints,
        created: epicData.fields.created,
        updated: epicData.fields.updated,
        assignee: epicData.fields.assignee
          ? {
              accountId: epicData.fields.assignee.accountId,
              displayName: epicData.fields.assignee.displayName,
              emailAddress: epicData.fields.assignee.emailAddress,
            }
          : undefined,
        reporter: epicData.fields.reporter
          ? {
              accountId: epicData.fields.reporter.accountId,
              displayName: epicData.fields.reporter.displayName,
              emailAddress: epicData.fields.reporter.emailAddress,
            }
          : undefined,
      };
    } catch (error: any) {
      this.log(`❌ Error fetching epic ${epicKey}: ${error.message}`);
      return null;
    }
  }

  /**
   * EXACT PORT: Fetch project with its epics (Python PoC implementation)
   */
  private async fetchProjectEpics(projectKey: string): Promise<JiraPortfolio | null> {
    try {
      // Search for epics in this project
      const epicsJql = `project = ${projectKey} AND issuetype = Epic`;
      const epicIssues = await this.searchIssues(epicsJql);

      if (!epicIssues || epicIssues.length === 0) {
        return null;
      }

      // Convert issues to epics and fetch their stories
      const epics: JiraEpic[] = [];
      let totalStoryPoints = 0;

      for (const epicIssue of epicIssues) {
        const epicData = await this.fetchEpicWithStories(epicIssue.key);
        if (epicData) {
          epics.push(epicData);
          totalStoryPoints += epicData.totalPoints;
        }
      }

      return {
        type: 'project',
        key: projectKey,
        name: `Project ${projectKey}`,
        description: `Portfolio containing ${epics.length} epics`,
        epics: epics,
        totalStoryPoints: totalStoryPoints,
      };
    } catch (error: any) {
      this.log(`❌ Error fetching project ${projectKey}: ${error.message}`);
      return null;
    }
  }

  /**
   * EXACT PORT: Search for issues using JQL (Python PoC implementation)
   */
  private async searchIssues(jql: string): Promise<JiraStory[]> {
    try {
      this.log(`🔍 Searching issues: ${jql}`);

      const searchUrl = `${this.baseUrl}/rest/api/3/search`;
      const params = {
        jql: jql,
        maxResults: 100,
        fields:
          'summary,description,status,customfield_10016,assignee,priority,issuetype,labels,components',
      };

      // Use minimal headers for GET requests (like curl)
      const searchHeaders = {
        Authorization: this.authHeader,
        Accept: 'application/json',
      };

      const response = await axios.get(searchUrl, {
        headers: searchHeaders,
        params: params,
        timeout: 10000,
      });

      if (response.status !== 200) {
        this.log(`⚠️ Search failed: ${response.status} - ${JSON.stringify(response.data)}`);
        return [];
      }

      const data = response.data;
      const issues = data.issues || [];
      this.log(`📊 Found ${issues.length} issues`);

      return issues.map((issue: any) => ({
        key: issue.key,
        summary: issue.fields.summary,
        description: this.extractDescription(issue.fields.description),
        status: issue.fields.status.name,
        storyPoints: issue.fields.customfield_10016 || 0, // Same field as Python PoC
        labels: issue.fields.labels || [],
        components: (issue.fields.components || []).map((c: any) => c.name),
        priority: issue.fields.priority?.name || 'Unknown',
        issueType: issue.fields.issuetype.name,
        assignee: issue.fields.assignee
          ? {
              accountId: issue.fields.assignee.accountId,
              displayName: issue.fields.assignee.displayName,
              emailAddress: issue.fields.assignee.emailAddress,
            }
          : undefined,
      }));
    } catch (error: any) {
      this.log(`❌ Error searching issues: ${error.message}`);
      return [];
    }
  }

  /**
   * EXACT PORT: Log connection hints based on error status (Python PoC logic)
   */
  private logConnectionHints(status: number): void {
    switch (status) {
      case 401:
        this.log('💡 Authentication failed. Check your token and credentials.');
        this.log("💡 Verify your API token is valid and hasn't expired.");
        break;
      case 403:
        this.log('💡 Access forbidden. Check your token permissions and scopes.');
        break;
      case 404:
        this.log('💡 Endpoint not found. Check your Jira URL or cloud ID.');
        break;
      default:
        this.log(`💡 Unexpected status: ${status}. Check your Jira configuration.`);
    }
  }

  /**
   * EXACT PORT: Log connection error details (Python PoC logic)
   */
  private logConnectionError(error: any): void {
    if (error.response) {
      this.log(`❌ HTTP Error: ${error.response.status}`);
      this.log(`📄 Response: ${JSON.stringify(error.response.data, null, 2)}`);
      this.logConnectionHints(error.response.status);
    } else if (error.request) {
      this.log('❌ Network Error: No response received');
      this.log('💡 Check your internet connection and Jira URL');
    } else {
      this.log(`❌ Request Setup Error: ${error.message}`);
    }
  }

  /**
   * Get configuration (for debugging) - excludes sensitive token
   */
  getConfig(): Partial<JiraConfiguration> {
    return {
      baseUrl: this.config.baseUrl,
      email: this.config.email,
      timeout: this.config.timeout,
      // Note: token is not included for security
    };
  }

  /**
   * VS Code specific: Log to output channel and show in notifications
   */
  private log(message: string): void {
    this.outputChannel.appendLine(message);

    // Also log to console for development
    console.log(message);

    // Show important messages as notifications
    if (message.includes('✅ Connected') || message.includes('❌ Error')) {
      if (message.includes('✅')) {
        vscode.window.showInformationMessage(message.replace(/[📧🔑🌐🔐✅]/gu, '').trim());
      } else {
        vscode.window.showErrorMessage(message.replace(/[❌💡🔍]/gu, '').trim());
      }
    }
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
   * Extract plain text from Jira description field (handles Atlassian Document Format)
   */
  private extractDescription(description: any): string {
    if (!description) {
      return '';
    }

    // If it's already a string, return it
    if (typeof description === 'string') {
      return description;
    }

    // If it's an Atlassian Document Format object, extract text
    if (description && typeof description === 'object') {
      try {
        // Try to extract text from ADF structure
        if (description.content && Array.isArray(description.content)) {
          return this.extractTextFromADF(description.content);
        }

        // Log the structure for debugging
        this.log(`📄 Description structure: ${JSON.stringify(description, null, 2)}`);

        // Fallback: stringify the object
        return JSON.stringify(description);
      } catch (error) {
        this.log(`⚠️ Error extracting description: ${error}`);
        return '[Description parsing error]';
      }
    }

    return String(description);
  }

  /**
   * Extract text content from Atlassian Document Format structure
   */
  private extractTextFromADF(content: any[]): string {
    let text = '';

    for (const node of content) {
      if (node.type === 'paragraph' && node.content) {
        for (const textNode of node.content) {
          if (textNode.type === 'text' && textNode.text) {
            text += textNode.text + ' ';
          }
        }
        text += '\n';
      } else if (node.type === 'heading' && node.content) {
        for (const textNode of node.content) {
          if (textNode.type === 'text' && textNode.text) {
            text += '# ' + textNode.text + '\n';
          }
        }
      } else if (node.type === 'bulletList' && node.content) {
        for (const listItem of node.content) {
          if (listItem.content) {
            text += '• ' + this.extractTextFromADF(listItem.content) + '\n';
          }
        }
      } else if (node.content) {
        // Recursively extract from nested content
        text += this.extractTextFromADF(node.content);
      }
    }

    return text.trim();
  }

  /**
   * Fetch Portfolio Feature and its child issues (based on Jira instance analysis)
   */
  private async fetchPortfolioFeature(key: string): Promise<JiraPortfolio | null> {
    try {
      // First, try to fetch the Portfolio Feature itself
      const issueUrl = `${this.baseUrl}/rest/api/3/issue/${key}`;
      const response = await axios.get(issueUrl, {
        headers: {
          Authorization: this.authHeader,
          Accept: 'application/json',
        },
        timeout: 10000,
      });

      if (response.status !== 200) {
        return null;
      }

      const issueData = response.data;

      // Check if it's a Portfolio Feature
      if (issueData.fields.issuetype.name !== 'Portfolio Feature') {
        return null;
      }

      // Get child issues (Epics, Stories, etc.)
      const childQueries = [
        `parent = "${key}"`,
        `"Portfolio Feature" = "${key}"`,
        `project = "${key.split('-')[0]}" AND "Portfolio Feature" = "${key}"`,
      ];

      let childIssues: JiraStory[] = [];
      for (const jql of childQueries) {
        try {
          this.log(`🔍 Trying Portfolio Feature child query: ${jql}`);
          childIssues = await this.searchIssues(jql);
          if (childIssues.length > 0) {
            this.log(`✅ Found ${childIssues.length} child issues using query: ${jql}`);
            break;
          }
        } catch (error: any) {
          this.log(`⚠️ Portfolio query failed (${error.response?.status || 'unknown'}): ${jql}`);
          continue;
        }
      }

      // Convert to Epic format for compatibility
      const epic: JiraEpic = {
        key: issueData.key,
        summary: issueData.fields.summary,
        description: this.extractDescription(issueData.fields.description),
        status: issueData.fields.status.name,
        assignee: issueData.fields.assignee
          ? {
              accountId: issueData.fields.assignee.accountId,
              displayName: issueData.fields.assignee.displayName,
              emailAddress: issueData.fields.assignee.emailAddress,
            }
          : undefined,
        reporter: issueData.fields.reporter
          ? {
              accountId: issueData.fields.reporter.accountId,
              displayName: issueData.fields.reporter.displayName,
              emailAddress: issueData.fields.reporter.emailAddress,
            }
          : undefined,
        created: issueData.fields.created,
        updated: issueData.fields.updated,
        stories: childIssues,
        totalPoints: childIssues.reduce((sum, story) => sum + (story.storyPoints || 0), 0),
      };

      return {
        type: 'portfolio',
        key: key,
        name: issueData.fields.summary,
        totalStoryPoints: epic.totalPoints,
        epics: [epic],
      };
    } catch (error: any) {
      this.log(`⚠️ Failed to fetch Portfolio Feature ${key}: ${error.message}`);
      return null;
    }
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    this.outputChannel.dispose();
  }
}
