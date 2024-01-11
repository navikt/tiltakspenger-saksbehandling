/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

/** @type {import('jest').Config} */
const config = {
  moduleDirectories: ['node_modules', '<rootDir>/'],
  moduleNameMapper: {
    jose: 'identity-obj-proxy',
  },
  testEnvironment: 'jest-environment-jsdom',
};

module.exports = createJestConfig(config);
