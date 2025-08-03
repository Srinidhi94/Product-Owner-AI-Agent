import { beforeEach, jest } from '@jest/globals';

// Global test setup for Jest
// This file is run before all Jest tests

// Set up global mocks that are used across all tests
beforeEach(() => {
  // Clear all mocks between tests for clean state
  jest.clearAllMocks();
});

// Global timeout for all tests
jest.setTimeout(10000);
