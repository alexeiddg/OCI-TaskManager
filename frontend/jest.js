/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from 'jest'
const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

const customJestConfig = {
  setupFiles: ['<rootDir>/jest.polyfill.js'], 
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], 
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^.+\\.(css|scss|sass)$': 'identity-obj-proxy',
  },
  testEnvironment: 'node',
};

module.exports = createJestConfig(customJestConfig);
