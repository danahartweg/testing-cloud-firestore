module.exports = {
  globalSetup: './jest.config.global.ts',
  preset: 'ts-jest',
  setupFilesAfterEnv: ['./jest.setup.js'],
};
