module.exports = {
  extends: [
    'airbnb',
    // 'plugin:jest/recommended',
  ],
  // plugins: [
  //   'jest',
  // ],
  rules: {
    'no-underscore-dangle': 0,
    'react/jsx-filename-extension': [1, { 'extensions': ['.js', '.jsx'] }],
  },
  parser: 'babel-eslint',
  env: {
    // browser: true,
    node: true,
    // 'jest/globals': true,
  },
};
