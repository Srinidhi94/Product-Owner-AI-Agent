// Mock VS Code API for Jest tests
import { jest } from '@jest/globals';

export const window = {
  showInformationMessage: jest.fn(() => Promise.resolve()),
  showErrorMessage: jest.fn(() => Promise.resolve()),
  showWarningMessage: jest.fn(() => Promise.resolve()),
  showQuickPick: jest.fn(() => Promise.resolve()),
  showInputBox: jest.fn(() => Promise.resolve()),
  createOutputChannel: jest.fn(() => ({
    appendLine: jest.fn(),
    show: jest.fn(),
    hide: jest.fn(),
    dispose: jest.fn(),
  })),
  createStatusBarItem: jest.fn(() => ({
    text: '',
    show: jest.fn(),
    hide: jest.fn(),
    dispose: jest.fn(),
  })),
  withProgress: jest.fn(() => Promise.resolve()),
};

export const workspace = {
  getConfiguration: jest.fn(() => ({
    get: jest.fn(() => undefined),
    update: jest.fn(() => Promise.resolve()),
    has: jest.fn(() => false),
  })),
  workspaceFolders: [
    {
      uri: { fsPath: '/mock/workspace' },
      name: 'mock-workspace',
      index: 0,
    },
  ],
  onDidChangeConfiguration: jest.fn(() => ({ dispose: jest.fn() })),
  findFiles: jest.fn(() => Promise.resolve([])),
};

export const env = {
  clipboard: {
    writeText: jest.fn(() => Promise.resolve()),
    readText: jest.fn(() => Promise.resolve('')),
  },
};

export const commands = {
  registerCommand: jest.fn(() => ({ dispose: jest.fn() })),
  executeCommand: jest.fn(() => Promise.resolve()),
};

export const Uri = {
  file: jest.fn((path: string) => ({ fsPath: path, scheme: 'file' })),
  parse: jest.fn((uri: string) => ({ fsPath: uri, scheme: 'file' })),
};

export const ConfigurationTarget = {
  Global: 1,
  Workspace: 2,
  WorkspaceFolder: 3,
};

export const StatusBarAlignment = {
  Left: 1,
  Right: 2,
};

export const ProgressLocation = {
  Notification: 15,
};
