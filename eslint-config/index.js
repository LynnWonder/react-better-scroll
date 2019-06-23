module.exports = {
  parser: 'babel-eslint',
  extends: [
    'eslint-config-airbnb',
    './rules/index',
  ].map(require.resolve),
  rules: {},
};
