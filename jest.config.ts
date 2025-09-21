import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'vue'],
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.(js|cjs|mjs)$': 'babel-jest',
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: '<rootDir>/tsconfig.test.json',
      },
    ],
  },
  transformIgnorePatterns: ['/node_modules/(?!(vue-i18n)/)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '@vue/test-utils': '<rootDir>/node_modules/@vue/test-utils/dist/vue-test-utils.cjs.js',
    '^.+\\.(svg|png|jpe?g|gif|webp|avif)$': '<rootDir>/tests/unit/mocks/fileMock.ts',
    '\\.(css|sass|scss)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/unit/setupTests.ts'],
  testMatch: ['<rootDir>/tests/unit/**/*.spec.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  extensionsToTreatAsEsm: ['.ts', '.tsx', '.vue'],
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'text-summary', 'lcov', 'html'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/',
    '<rootDir>/src/main.ts',
    '<rootDir>/src/router/',
    '<rootDir>/src/plugins/',
    '<rootDir>/src/styles/',
    '<rootDir>/src/assets/',
    '<rootDir>/src/locales/',
    '<rootDir>/src/views/',
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 70,
      functions: 80,
      lines: 80,
    },
  },
}

export default config
