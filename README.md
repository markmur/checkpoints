# 👮🏻 Checkpoints 👮🏻

Add linting, code formatting and precommit checks to an existing project.

```
yarn add -g checkpoints
```

## Why?

Adding linting, prettier and precommit checks multiple times a day to new/existing repos is no fun and often it can be difficult to recall the correct dependencies to install. This project aims to mitigate those problems.

> Note: There are plans to add a `checkpoints config` action, which would allow users to specify their own `xo` and `prettier` configurations. For now though the project is limited to the configs specified below.

## Things to Note

This project uses `yarn` to install dependencies. There are plans in place to add the option to use NPM but for now it's limited to Yarn.

## Installation

```sh
yarn add -g checkpoints
```

<p align="center">
  <img src="https://github.com/markmur/checkpoints/raw/master/img/checkpoints.png?raw=true" alt="Checkpoints" />
</p>

## Usage

```sh
checkpoints
```

## Options

- [xo](#xo)
- [xo-react](#xo-react)
- [prettier](#prettier)
- [precommit](#precommit)

### xo

[XO](https://github.com/xojs/xo) is a linter which sits on top of ESLint and abstracts much of the configuration.

##### Config

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

##### Dependencies

```
xo
babel-eslint
eslint-config-xo
```

---

### xo-react

The `xo-react` action adds everything from the `xo` action but configures it for React.

##### Config

The following is added to the above `xo` configuration:

```
"extends": ["react"],
"plugins": ["react"]
```

##### Dependencies

```
eslint-config-xo-react 
eslint-plugin-react
```

---

### Prettier

##### Config

```json
{
  "prettier": {
    "semi": true,
    "singleQuote": true,
    "trailingComma": "none",
    "bracketSpacing": true
  }
}
```

##### Dependencies

```
prettier
prettier-eslint
eslint-config-prettier
```

---

### Precommit

The `precommit` action uses `pre-commit` and `lint-staged` to lint your repo prior to git commits.

##### Config

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

##### Dependencies

```
lint-staged
pre-commit
```
