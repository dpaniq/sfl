const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig');

console.log([
  pathsToModuleNameMapper(compilerOptions.paths),

  pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: compilerOptions.baseUrl,
  }),

  pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
]);

module.exports = {
  globals: {
    // See reference: https://kulshekhar.github.io/ts-jest/docs/getting-started/options/tsconfig
    'ts-jest': {
      tsconfig: 'tsconfig.jest.json',
    },
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/test/fixtures/'],

  roots: ['<rootDir>'],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),

  // -----------------------------------------
  // The following is an example if you use the projects configuration for jest
  // projects: [
  //     // Projects configs can be tricky, some properties seem to be inherited from the
  //     //     global config and others are overrided. When in doubt, drop it from the top level
  //     //     and define it specifically for the project. This is more likely if a preset or
  //     //     a special runner is defined since it will have its own configs it sets.
  //     // Remember it is JS so you can use variable declarations and spread operators to minimize
  //     //     duplicate expressions
  //     {
  //         displayName: "UNIT",
  //         preset: "ts-jest",
  //         runner: "@codejedi365/jest-serial-runner",
  //         // setupFilesAfterEnv, Must be specified internal to the project, will be ignored if made higher
  //         setupFilesAfterEnv: ["jest-extended/all"],
  //         testMatch: ["<rootDir>/tests/**/*.spec.ts"]
  //     },
  //     {
  //         // 2nd project definition
  //     }
  // ]
};
