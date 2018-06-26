const prettierConfig = {
  semi: true,
  singleQuote: true,
  trailingComma: 'none',
  bracketSpacing: true
};

const xoConfig = {
  parser: 'babel-eslint',
  envs: ['browser', 'node'],
  prettier: true,
  space: true,
  rules: {
    camelcase: [
      2,
      {
        properties: 'never'
      }
    ]
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
