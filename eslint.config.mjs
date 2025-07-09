// eslint.config.js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import unusedImports from 'eslint-plugin-unused-imports';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'unused-imports': unusedImports,
    },
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
    //   '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'unused-imports/no-unused-vars': 'warn',
      "@typescript-eslint/no-namespace": "off",
      '@typescript-eslint/no-unused-vars': ['warn', { 
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: true,
        varsIgnorePattern: '^_',
        caughtErrors: 'none'
        }],
    },
  },
];
