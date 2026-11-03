import { describe, it, expect } from 'vitest';
import { executeJavaScript, executeStudentCode } from '@/features/coding/executionEngine';

describe('Coding Lab Execution Engine & Test Verification', () => {
  const twoSumTestCases = [
    { input: '[2, 7, 11, 15], 9', expected_output: '[0, 1]', is_hidden: false },
    { input: '[3, 2, 4], 6', expected_output: '[1, 2]', is_hidden: false },
    { input: '[3, 3], 6', expected_output: '[0, 1]', is_hidden: true }
  ];

  it('correctly executes and accepts a valid JavaScript Two Sum program across all test cases', () => {
    const validCode = `
      function twoSum(nums, target) {
        const map = new Map();
        for (let i = 0; i < nums.length; i++) {
          const complement = target - nums[i];
          if (map.has(complement)) {
            return [map.get(complement), i];
          }
          map.set(nums[i], i);
        }
        return [];
      }
    `;

    const result = executeJavaScript(validCode, 'two-sum', twoSumTestCases);

    expect(result.status).toBe('accepted');
    expect(result.passedCount).toBe(3);
    expect(result.totalCount).toBe(3);
    expect(result.outputDetails.every(d => d.passed)).toBe(true);
  });

  it('identifies and reports syntax/compilation errors accurately', () => {
    const brokenCode = `
      function twoSum(nums, target) {
        return [nums.map(x => x * 2; // unclosed parenthesis
      }
    `;

    const result = executeJavaScript(brokenCode, 'two-sum', twoSumTestCases);

    expect(result.status).toBe('compile_error');
    expect(result.errorDiagnostic).toContain('Syntax Error');
    expect(result.passedCount).toBe(0);
  });

  it('identifies and isolates runtime exceptions without crashing the harness', () => {
    const runtimeErrorCode = `
      function twoSum(nums, target) {
        const obj = null;
        return obj.nonExistentProperty(); // TypeError
      }
    `;

    const result = executeJavaScript(runtimeErrorCode, 'two-sum', twoSumTestCases);

    expect(result.status).toBe('runtime_error');
    expect(result.passedCount).toBe(0);
    expect(result.outputDetails[0].errorMessage).toBeTruthy();
  });

  it('correctly identifies wrong answers and provides expected vs actual comparison', () => {
    const wrongAnswerCode = `
      function twoSum(nums, target) {
        return [0, 0]; // Wrong indices
      }
    `;

    const result = executeJavaScript(wrongAnswerCode, 'two-sum', twoSumTestCases);

    expect(result.status).toBe('wrong_answer');
    expect(result.passedCount).toBe(0);
    expect(result.outputDetails[0].passed).toBe(false);
    expect(result.outputDetails[0].actual).toBe('[0,0]');
  });

  it('evaluates Valid Parentheses problem with boolean matching', () => {
    const validParenthesesCases = [
      { input: '"()"', expected_output: 'true', is_hidden: false },
      { input: '"()[]{}"', expected_output: 'true', is_hidden: false },
      { input: '"(]"', expected_output: 'false', is_hidden: false }
    ];

    const validParenthesesSolution = `
      function isValid(s) {
        const stack = [];
        const map = { ')': '(', '}': '{', ']': '[' };
        for (const char of s) {
          if (char in map) {
            if (stack.length === 0 || stack.pop() !== map[char]) {
              return false;
            }
          } else {
            stack.push(char);
          }
        }
        return stack.length === 0;
      }
    `;

    const result = executeJavaScript(validParenthesesSolution, 'valid-parentheses', validParenthesesCases);
    expect(result.status).toBe('accepted');
    expect(result.passedCount).toBe(3);
  });
});

