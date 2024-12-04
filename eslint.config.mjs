import babelParser from '@babel/eslint-parser'

export default [
  {
    files: ['src/**/*.{js,jsx}'], // Match JS/JSX files in the src folder
    languageOptions: {
      parser: babelParser, // Use Babel parser for ESLint
      parserOptions: {
        requireConfigFile: false, // Avoid Babel requiring a config file
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      // Add any specific linting rules you need
      'no-unused-vars': 'warn',
      'no-console': 'off',
    },
  },
]
