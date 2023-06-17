const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig');

// https://github.com/kulshekhar/ts-jest/issues/2709

module.exports = {
  globals: {
    // See reference: https://kulshekhar.github.io/ts-jest/docs/getting-started/options/tsconfig
    'ts-jest': {
      tsconfig: 'tsconfig.jest.json',
    },
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/tests/fixtures/'],

  roots: ['<rootDir>'],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
};
