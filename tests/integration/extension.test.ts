/**
 * Integration test for extension activation and commands
 */

import * as assert from 'assert';
import * as vscode from 'vscode';
import { suite, test } from 'mocha';

suite('Extension Integration Tests', () => {
  
  test('Extension should be present', () => {
    assert.ok(vscode.extensions.getExtension('ai-product-owner-team.ai-product-owner-agent'));
  });

  test('Extension should activate', async () => {
    const extension = vscode.extensions.getExtension('ai-product-owner-team.ai-product-owner-agent');
    assert.ok(extension);
    
    await extension.activate();
    assert.strictEqual(extension.isActive, true);
  });

  test('Commands should be registered', async () => {
    const commands = await vscode.commands.getCommands(true);
    
    const expectedCommands = [
      'aiProductOwner.analyzeEpic',
      'aiProductOwner.configureSettings',
      'aiProductOwner.showWelcome'
    ];

    expectedCommands.forEach(command => {
      assert.ok(
        commands.includes(command),
        `Command ${command} should be registered`
      );
    });
  });

  test('Configuration should be accessible', () => {
    const config = vscode.workspace.getConfiguration('aiProductOwner');
    assert.ok(config);
    
    // Test that default configuration values are accessible
    const jiraUrl = config.get('jiraUrl');
    assert.strictEqual(typeof jiraUrl, 'string');
  });

  test('Output channel should be created', () => {
    // This tests that the extension can create output channels
    const channel = vscode.window.createOutputChannel('Test Channel');
    assert.ok(channel);
    channel.dispose();
  });
});
