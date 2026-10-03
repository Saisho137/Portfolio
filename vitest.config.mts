import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': new URL('./src', import.meta.url).pathname }
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    clearMocks: true,
    restoreMocks: true,
    // Keep CSS Module class names readable in test output
    css: { modules: { classNameStrategy: 'non-scoped' } },
    coverage: {
      enabled: true,
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.{spec,test}.{ts,tsx}', 'src/**/index.ts'],
      reporter: ['text', 'html', 'lcov'],
      thresholds: { lines: 85 }
    }
  }
});
