/**
 * Unit tests for Logger utility class
 */

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { Logger } from '../../src/utils/Logger';

describe('Logger', () => {
  let logger: Logger;
  let mockOutputChannel: any;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create mock output channel
    mockOutputChannel = {
      appendLine: jest.fn(),
      show: jest.fn(),
      hide: jest.fn(),
      dispose: jest.fn(),
    };

    // Mock the VS Code window.createOutputChannel
    const vscode = require('vscode');
    vscode.window.createOutputChannel.mockReturnValue(mockOutputChannel);

    // Get logger instance using static method
    logger = Logger.getLogger('test');
  });

  afterEach(() => {
    logger.dispose();
    // Clear singleton instances for clean state
    (Logger as any).instances?.clear();
  });

  describe('Logging Methods', () => {
    test('should log info messages', () => {
      const message = 'Test info message';
      logger.info(message);

      expect(mockOutputChannel.appendLine).toHaveBeenCalledWith(expect.stringContaining('[INFO]'));
      expect(mockOutputChannel.appendLine).toHaveBeenCalledWith(expect.stringContaining(message));
    });

    test('should log warning messages', () => {
      const message = 'Test warning message';
      logger.warn(message);

      expect(mockOutputChannel.appendLine).toHaveBeenCalledWith(expect.stringContaining('[WARN]'));
      expect(mockOutputChannel.appendLine).toHaveBeenCalledWith(expect.stringContaining(message));
    });

    test('should log error messages', () => {
      const message = 'Test error message';
      logger.error(message);

      expect(mockOutputChannel.appendLine).toHaveBeenCalledWith(expect.stringContaining('[ERROR]'));
      expect(mockOutputChannel.appendLine).toHaveBeenCalledWith(expect.stringContaining(message));
    });

    test('should log debug messages', () => {
      const message = 'Test debug message';
      logger.debug(message);

      expect(mockOutputChannel.appendLine).toHaveBeenCalledWith(expect.stringContaining('[DEBUG]'));
      expect(mockOutputChannel.appendLine).toHaveBeenCalledWith(expect.stringContaining(message));
    });
  });

  describe('Error Object Handling', () => {
    test('should handle Error objects', () => {
      const error = new Error('Test error');
      logger.error('Error occurred', error);

      expect(mockOutputChannel.appendLine).toHaveBeenCalledWith(
        expect.stringContaining('Error occurred')
      );
      expect(mockOutputChannel.appendLine).toHaveBeenCalledWith(
        expect.stringContaining('Test error')
      );
    });

    test('should handle Error objects with stack traces', () => {
      const error = new Error('Test error with stack');
      error.stack = 'Error: Test error\nat someFunction (file.js:10:5)';

      logger.error('Stack trace error', error);

      expect(mockOutputChannel.appendLine).toHaveBeenCalledWith(
        expect.stringContaining('Stack trace error')
      );
      expect(mockOutputChannel.appendLine).toHaveBeenCalledWith(
        expect.stringContaining('at someFunction')
      );
    });
  });

  describe('Timestamp Formatting', () => {
    test('should include timestamp in log messages', () => {
      logger.info('Timestamp test');

      const logCall = mockOutputChannel.appendLine.mock.calls[0][0];
      expect(logCall).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });

  describe('Output Channel Management', () => {
    test('should show output channel', () => {
      logger.show();
      expect(mockOutputChannel.show).toHaveBeenCalled();
    });

    test('should dispose output channel', () => {
      logger.dispose();
      expect(mockOutputChannel.dispose).toHaveBeenCalled();
    });
  });

  describe('Multiple Data Arguments', () => {
    test('should handle data argument', () => {
      const obj = { key: 'value', arr: [1, 2, 3] };

      logger.info('Multiple args:', obj);

      expect(mockOutputChannel.appendLine).toHaveBeenCalledWith(
        expect.stringContaining('Multiple args:')
      );
      expect(mockOutputChannel.appendLine).toHaveBeenCalledWith(
        expect.stringContaining('"key": "value"')
      );
      expect(mockOutputChannel.appendLine).toHaveBeenCalledWith(expect.stringContaining('1,'));
    });
  });
});
