import { pathsToModuleNameMapper } from 'ts-jest';

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper(
    {
      '@app/*': ['src/*'],
    },
    {
      prefix: '<rootDir>/../',
    },
  ),
  coveragePathIgnorePatterns: [
    'application-settings.ts',
    'main.ts',
    '.entity.ts',
    '.dto.ts',
    '.module.ts',
    '.guard.ts',
    '.strategy.ts',
    '.interceptor.ts',
    '/src/config/',
  ],
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
};
