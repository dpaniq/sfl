import { pathsToModuleNameMapper } from 'ts-jest/utils';
import { compilerOptions } from 'tsconfig';

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: 'test/.*.test.ts$',

  // this enables us to use tsconfig-paths with jest
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
};
