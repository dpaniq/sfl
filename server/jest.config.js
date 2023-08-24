const {pathsToModuleNameMapper} = require('ts-jest');
const {compilerOptions} = require('./tsconfig');

// https://github.com/kulshekhar/ts-jest/issues/2709

// Gist;
// roots: ['<rootDir>/src'],
//   verbose: true,
//   globalSetup: './globalSetup.ts',
//   testEnvironmentOptions: {
//     url: 'http://localhost/',
//   },
//   setupFilesAfterEnv: [],
//   moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
//   preset: 'ts-jest',
//   transform: {
//     '^.+\\.tsx?$': ['ts-jest', {//the content you'd placed at "global"
//       babel: true,
//       tsConfig: 'tsconfig.json',
//     }]
//   },
//   moduleNameMapper: {
//     '^@/(.*)$': '<rootDir>/src/$1',
//   },
//   testMatch: [
//     '<rootDir>/**/(*.)test.(js|jsx|ts|tsx)',
//     '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
//     '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}',
//   ]

module.exports = {
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        //the content you'd placed at "global"
        babel: true,
        tsConfig: 'tsconfig.json',
      },
    ],
  },

  // transform: {
  //   // See reference: https://kulshekhar.github.io/ts-jest/docs/getting-started/options/tsconfig
  //   'ts-jest': {
  //     tsconfig: 'tsconfig.jest.json',
  //   },
  // },
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/tests/fixtures/'],

  roots: ['<rootDir>'],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
};
