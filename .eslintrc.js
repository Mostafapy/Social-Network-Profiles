module.exports = {
  extends: [
    'airbnb-base',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
  ],
  plugins: ['prettier', 'mocha', 'react'],
  parser: 'babel-eslint',
  env: { mocha: true, browser: true },
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'all',
      },
    ],
    'prefer-destructuring': [
      'error',
      {
        array: false,
        object: true,
      },
    ],
    'consistent-return': 0,
    'no-shadow': 0,
    'no-underscore-dangle': 0,
    'function-paren-newline': 0,
    'import/no-dynamic-require': 0,
    // TODO: Remove the line below when going live (of course after removing all the console.log statements from the code
    'no-console': 'off',
    'no-unused-vars': ['error'],
    'no-plusplus': [2, { allowForLoopAfterthoughts: true }],
    'no-param-reassign': 0,
    'linebreak-style': [0],
    'prefer-destructuring': ['error', { object: true, array: false }],
    // a rule for mocha test runner
    'mocha/no-exclusive-tests': 'error',
  },
};
