import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
    {
      ignores: [
        '**/node_modules/**',
        '**/dist/**',
        '**/.expo/**',
        'apps/mobile/babel.config.js',
        'apps/mobile/metro.config.js',
        'apps/mobile/postcss.config.mjs'
      ],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    prettierRecommended,
    {
      rules: {
        'no-console': 'warn',
        '@typescript-eslint/no-unused-vars': 'error',
      },
    }
);