import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/**/*.ts'],
  target: 'es2022',
  format: ['esm'],
  // Other options...
});
