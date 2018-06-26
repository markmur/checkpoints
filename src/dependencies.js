module.exports = {
  precommit: ['pre-commit', 'lint-staged'],
  common: ['eslint'],
  prettier: ['prettier', 'prettier-eslint', 'eslint-config-prettier'],
  xo: ['xo', 'babel-eslint', 'eslint-config-xo'],
  xoReact: ['eslint-config-xo-react', 'eslint-plugin-react']
};
