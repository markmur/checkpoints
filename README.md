# Checkpoints

Add linting, code formatting and precommit checks to an existing project.

<p align="center">
  <img src="https://github.com/markmur/checkpoints/raw/master/img/checkpoints.png?raw=true" alt="Checkpoints" />
</p>

## Installation

With `Yarn`:

```sh
yarn add global checkpoints
```

With `NPM`:

```sh
npm install -g checkpoints
```

## Usage

```sh
checkpoints
```

## Actions

### xo

[XO](https://github.com/xojs/xo) is a linter which sits on top of ESLint and abstracts much of the configuration.

#### Config

The following is the default config that will be added to your `package.json` file:

```json
"xo": {
  "parser": "babel-eslint",
  "envs": ["browser", "node"],
  "prettier": true,
  "space": true,
  "rules": {
    "camelcase": [
      2,
      {
        "properties": "never"
      }
    ]
  }
}
```

#### Dependencies

```
xo
babel-eslint
eslint-config-xo
```

---

### xo-react

The `xo-react` action adds everything from the `xo` action but configures it for React.

### Config

The following is added to the above `xo` configuration:

```
"extends": ["react"],
"plugins": ["react"]
```

#### Dependencies

```
eslint-config-xo-react 
eslint-plugin-react
```

---

### Prettier

#### Config

TODO

#### Dependencies

```
prettier
prettier-eslint
eslint-config-prettier
```

---

### Precommit

The `precommit` action uses `pre-commit` and `lint-staged` to lint your repo prior to git commits.

#### Config

```json
{
  "scripts": {
    "lint-staged": "lint-staged"
  },
  "lint-staged": {
    "**/*.js": [
      "prettier --write",
      "git add",
      "xo"
    ]
  },
  "precommit": {
    "run": [
      "lint-staged"
    ]
  }
}
```

#### Dependencies

```
lint-staged
pre-commit
```
