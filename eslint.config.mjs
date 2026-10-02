import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const config = [
  ...nextVitals,
  ...nextTs,
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
