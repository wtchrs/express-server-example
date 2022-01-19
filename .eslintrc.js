module.exports = {
  parser: '@typescript-eslint/parser',
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
    },
  ],
  env: {
    browser: false,
    es6: true,
    node: true,
  },
  plugins: ['import', 'html', 'prettier', '@typescript-eslint', 'jest'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  rules: {
    'prettier/prettier': [
      'warn',
      {
        endOfLine: 'auto',
      },
    ],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-underscore-dangle': 'warn',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'warn',
    '@typescript-eslint/no-namespace': 'off',
  },
}
