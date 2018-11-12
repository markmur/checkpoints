const prettierConfig = {
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: true,
  proseWrap: 'always'
};

const xoConfig = {
  parser: 'babel-eslint',
  envs: ['browser', 'node'],
  prettier: true,
  space: true,
  rules: {
    camelcase: 0,
    "unicorn/filename-case": 0,
    "unicorn/no-process-exit": 0
  }
};

const xoReactConfig = {
  extends: 'xo-react',
  plugins: ['react']
};

const precommitConfig = {
  'lint-staged': {
    '**/*.js': ['prettier --write', 'git add', 'xo']
  },
  precommit: {
    run: ['lint-staged']
  }
};

module.exports = {
  prettierConfig,
  xoConfig,
  xoReactConfig,
  precommitConfig
};
