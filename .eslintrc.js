module.exports = {
  env: {
    jest: true,
    es6: true,
    node: true,
  },
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  rules: {
    camelcase: 0,
    'no-console': 0,
    'prefer-destructuring': 0,
    'prettier/prettier': ['error'],
  },
}
