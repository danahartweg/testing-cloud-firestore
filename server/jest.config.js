module.exports = {
  globalSetup: './jest.config.global.ts',
  moduleNameMapper: {
    '^@helpers/(.*)$': '<rootDir>/helpers/$1',
    '^@test-helpers/(.*)$': '<rootDir>/test-helpers/$1',
  },
  preset: 'ts-jest',
  setupFilesAfterEnv: ['./jest.setup.js'],
  testEnvironment: 'node',
};
