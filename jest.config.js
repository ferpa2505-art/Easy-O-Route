/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        // Silences the TS151002 hybrid-module warning; tests run fine without isolatedModules.
        diagnostics: { ignoreCodes: [151002] },
      },
    ],
  },
};
