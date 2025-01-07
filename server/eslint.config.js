import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.json'
      }
    },
    plugins: {
      '@typescript-eslint': typescript,
      'prettier': prettier
    },
    rules: {
      ...typescript.configs.recommended.rules,
      'prettier/prettier': 'error',
      'no-console': ['error', { allow: ['warn', 'error'] }]
    }
  }
]; 