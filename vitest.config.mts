import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vitest/config';

// Next turns image imports into StaticImageData; Vite would give a plain URL string
const staticImages = (): Plugin => ({
  name: 'next-static-images',
  enforce: 'pre',
  load(id) {
    if (!/\.(png|jpe?g|webp|avif|gif)$/.test(id)) return;

    return `export default ${JSON.stringify({
      src: id,
      width: 1600,
      height: 1000,
      blurDataURL: 'data:image/png;base64,'
    })};`;
  }
});

export default defineConfig({
  plugins: [react(), staticImages()],
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
      exclude: ['src/**/*.{spec,test}.{ts,tsx}', 'src/**/index.ts', 'src/test/**'],
      reporter: ['text', 'html', 'lcov'],
      thresholds: { lines: 85 }
    }
  }
});
