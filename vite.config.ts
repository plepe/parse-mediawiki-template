/// <reference types="vitest" />
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/config';
import dts from 'vite-plugin-dts';

const testDef = {
  test: {
    exclude: [...configDefaults.exclude, './build/**', './dist/**'],
    coverage: {
      reporter: ['text', 'html'],
      extension: ['.ts'],
      include: ['src'],
    },
  },
};

export default defineConfig({
  base: './',
  plugins: [
    dts({
      exclude: ['**/**.spec.**', '*.config.*'],
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: fileURLToPath(new URL('src/parse-mediawiki-template.ts', import.meta.url)),
      name: 'parseMediawikiTemplate',
      formats: ['es', 'umd'],
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  ...testDef,
});
