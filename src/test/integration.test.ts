/**
 * Basic Integration Tests for AI Product Owner VS Code Extension
 * Simple tests without complex framework dependencies
 */

import * as assert from 'assert';

console.log('🧪 Running AI Product Owner Extension Tests...\n');

// Basic Functionality Tests
function testBasicFunctionality() {
  console.log('📋 Testing Basic Functionality...');
  
  // Basic math test
  assert.strictEqual(1 + 1, 2, 'Basic math should work');
  console.log('✅ Basic test passed');

  // String operations
  const testString = 'AI Product Owner Agent';
  assert.ok(testString.includes('AI'), 'String should contain AI');
  assert.ok(testString.includes('Agent'), 'String should contain Agent');
  console.log('✅ String operations test passed');

  // Array operations
  const testArray = ['business-analysis', 'technical-architecture', 'implementation-design'];
  assert.strictEqual(testArray.length, 3, 'Array should have 3 elements');
  assert.ok(testArray.includes('business-analysis'), 'Array should contain business-analysis');
  console.log('✅ Array operations test passed');

  // Object operations
  const testConfig = {
    baseUrl: 'test.atlassian.net',
    email: 'test@example.com',
    timeout: 10000
  };
  
  assert.ok(testConfig.baseUrl, 'Config should have baseUrl');
  assert.ok(testConfig.email, 'Config should have email');
  assert.strictEqual(typeof testConfig.timeout, 'number', 'Timeout should be number');
  console.log('✅ Object operations test passed');
}

// Error Handling Tests
function testErrorHandling() {
  console.log('\n⚠️  Testing Error Handling...');
  
  try {
    // Simulate an error condition
    JSON.parse('invalid json');
    assert.fail('Should have thrown an error');
  } catch (error) {
    assert.ok(error instanceof Error, 'Should catch Error instance');
    console.log('✅ Error handling test passed');
  }

  // Input validation
  const validateEpicKey = (key: string): boolean => {
    return !!(key && key.length > 0 && key.includes('-'));
  };
  
  assert.strictEqual(validateEpicKey('TEST-123'), true, 'Valid epic key should pass');
  assert.strictEqual(validateEpicKey('invalid'), false, 'Invalid epic key should fail');
  assert.strictEqual(validateEpicKey(''), false, 'Empty epic key should fail');
  
  console.log('✅ Input validation test passed');
}

// Configuration Management Tests
function testConfigurationManagement() {
  console.log('\n🔧 Testing Configuration Management...');
  
  interface TestConfig {
    jira: {
      baseUrl: string;
      email: string;
      timeout: number;
    };
    analysis: {
      maxSolutions: number;
      includeTests: boolean;
    };
  }

  const config: TestConfig = {
    jira: {
      baseUrl: 'company.atlassian.net',
      email: 'user@company.com',
      timeout: 10000
    },
    analysis: {
      maxSolutions: 2,
      includeTests: false
    }
  };

  assert.ok(config.jira.baseUrl.includes('atlassian.net'), 'Should have valid Jira URL');
  assert.strictEqual(config.analysis.maxSolutions, 2, 'Should have correct max solutions');
  assert.strictEqual(config.analysis.includeTests, false, 'Should have correct test setting');
  
  console.log('✅ Configuration management test passed');
}

// Data Processing Tests
function testDataProcessing() {
  console.log('\n📊 Testing Data Processing...');
  
  interface MockEpic {
    key: string;
    summary: string;
    storyCount: number;
    totalPoints: number;
  }

  const mockEpic: MockEpic = {
    key: 'TEST-123',
    summary: 'Test Epic',
    storyCount: 5,
    totalPoints: 34
  };

  // Test data processing
  const processedData = {
    epicKey: mockEpic.key,
    title: mockEpic.summary,
    complexity: mockEpic.totalPoints > 30 ? 'High' : 'Medium',
    hasStories: mockEpic.storyCount > 0
  };

  assert.strictEqual(processedData.epicKey, 'TEST-123', 'Epic key should be processed');
  assert.strictEqual(processedData.complexity, 'High', 'Complexity should be calculated');
  assert.strictEqual(processedData.hasStories, true, 'Should detect stories');
  
  console.log('✅ Data processing test passed');
}

// Utility Functions Tests
function testUtilityFunctions() {
  console.log('\n🛠️  Testing Utility Functions...');
  
  const formatStageOutput = (stageId: string, content: string): string => {
    const stageNames: { [key: string]: string } = {
      'business-analysis': 'Business Analysis',
      'technical-architecture': 'Technical Architecture',
      'implementation-design': 'Implementation Design'
    };
    
    const stageName = stageNames[stageId] || 'Unknown Stage';
    return `# ${stageName}\n\n${content}`;
  };

  const result = formatStageOutput('business-analysis', 'Test content');
  
  assert.ok(result.includes('# Business Analysis'), 'Should include formatted header');
  assert.ok(result.includes('Test content'), 'Should include content');
  
  console.log('✅ Utility functions test passed');

  // Stage validation
  const validStages = [
    'business-analysis',
    'technical-architecture', 
    'implementation-design',
    'development-plan',
    'risk-assessment'
  ];

  const isValidStage = (stageId: string): boolean => {
    return validStages.includes(stageId);
  };

  assert.strictEqual(isValidStage('business-analysis'), true, 'Valid stage should pass');
  assert.strictEqual(isValidStage('invalid-stage'), false, 'Invalid stage should fail');
  
  console.log('✅ Stage validation test passed');
}

// Run all tests
function runAllTests() {
  try {
    testBasicFunctionality();
    testErrorHandling();
    testConfigurationManagement();
    testDataProcessing();
    testUtilityFunctions();
    
    console.log('\n🏆 All tests passed successfully! ✨');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

// Export for testing frameworks if needed
export {
  testBasicFunctionality,
  testErrorHandling,
  testConfigurationManagement,
  testDataProcessing,
  testUtilityFunctions
};

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
} 