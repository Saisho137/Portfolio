import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['.next/**', 'out/**', 'coverage/**', 'public/**', 'next-env.d.ts']),
  ...nextVitals,
  ...nextTs,
  {
    files: ['**/*.{ts,tsx,mts}'],
    extends: [tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    }
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'error',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          pathGroups: [
            { pattern: '@/**', group: 'internal', position: 'after' },
            { pattern: './*.module.{css,scss}', group: 'sibling', position: 'after' }
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true }
        }
      ]
    }
  },
  // Must stay last: turns off every rule that conflicts with Prettier.
  prettier
]);
