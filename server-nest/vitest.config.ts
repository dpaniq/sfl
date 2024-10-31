import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // Use global `describe`, `it`, etc.
    include: ['src/**/*.test.ts'], // Specify test file pattern
    environment: 'node',

    exclude: [...configDefaults.exclude, 'e2e/**/*'], // Exclude e2e tests from this config
    coverage: {
      reporter: ['text', 'html'], // Coverage reports in console and HTML format
      // provider: 'c8',                   // Use c8 for coverage
      // reporter: ['text', 'html'],       // Coverage report formats
      include: ['**/*.(t|j)s'], // Collect coverage from TypeScript and JavaScript files
      reportsDirectory: '../coverage', // Specify directory for coverage reports
    },
    alias: {
      '@': '/src', // Set up @ as a shortcut for src folder
    },
  },
});
