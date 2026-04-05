/** @type {import("eslint").Linter.Config} */
const config = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended-type-checked',
  ],
  plugins: ['@typescript-eslint'],
  rules: {
    // Enforce consistent import ordering
    'import/order': 'off',
    // Disallow any — keep codebase fully typed
    '@typescript-eslint/no-explicit-any': 'error',
    // Require explicit return types on exported functions
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    // Unused vars are errors, but allow underscore-prefixed params
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    // Prefer type imports to avoid side-effect issues
    '@typescript-eslint/consistent-type-imports': [
      'error',
      { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
    ],
  },
}

module.exports = config
