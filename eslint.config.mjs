import path from 'path';
import { fileURLToPath } from 'url';

import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

const config = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ignores: [
      '**/node_modules',
      '**/package.json',
      '**/package-lock.json',
      '**/tsconfig.json',
      '**/.next',
      '**/public'
    ]
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        2,
        {
          argsIgnorePattern: '^_'
        }
      ],

      '@typescript-eslint/no-explicit-any': 'error',

      'no-multiple-empty-lines': [
        'error',
        {
          max: 1
        }
      ],

      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],

          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
              position: 'after'
            },
            {
              pattern: './**.module.scss',
              group: 'sibling',
              position: 'after'
            }
          ],

          'newlines-between': 'always',

          alphabetize: {
            order: 'asc',
            caseInsensitive: true
          }
        }
      ]
    }
  }
];

export default config;
