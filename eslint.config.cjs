// Flat config using FlatCompat to reuse legacy .eslintrc style rules
const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
  recommendConfigFile: false,
});

module.exports = [
  // bring in the standard recommended configs via compatibility layer
  ...compat.extends(
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier'
  ),
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      ecmaFeatures: { jsx: true },
    },
    settings: { react: { version: 'detect' } },
    rules: {
      'prettier/prettier': 'warn',
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
];
