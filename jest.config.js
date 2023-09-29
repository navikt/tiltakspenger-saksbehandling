const nextJest = require('next/jest');

const createJestConfig = nextJest({
    dir: './',
});

/** @type {import('jest').Config} */
const customJestConfig = {
    moduleDirectories: ['node_modules', '<rootDir>/'],
    moduleNameMapper: {
        jose: 'identity-obj-proxy',
    },
    testEnvironment: 'jest-environment-jsdom',
};

module.exports = createJestConfig(customJestConfig);
