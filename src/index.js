const path = require('path');
const fs = require('fs-extra');
const ora = require('ora');
const readPkg = require('read-pkg');
const inquirer = require('inquirer');
const yarn = require('yarn-api');
const chalk = require('chalk');

const { common, prettier, xo, xoReact, precommit } = require('./dependencies');
const {
  prettierConfig,
  xoConfig,
  xoReactConfig,
  precommitConfig
} = require('./config');

const PRETTIER = 'prettier';
const XO = 'xo';
const XO_REACT = 'xo-react';
const PRECOMMIT = 'precommit';

const choices = [
  { name: XO, value: XO },
  { name: XO_REACT, value: XO_REACT },
  { name: PRETTIER, value: PRETTIER },
  { name: `${PRECOMMIT} (Adds pre-commit and lint-staged)`, value: PRECOMMIT }
];

const logAction = action =>
  console.log(chalk`\n{magenta.bold.underline ${action}}`);

const checkPackageExists = () =>
  fs.pathExists(path.resolve(process.cwd(), 'package.json'));

/**
 * Install dependencies with Yarn
 * @param  {Array} dependencies - an array of deps to install
 * @param  {Boolean} [dev=false] - set to true to add to devDependencies
 * @return {Promise} returns promise
 */
const installDependencies = (dependencies, dev = true) => {
  return new Promise(resolve => {
    yarn(
      [
        'add',
        '--silent',
        '--no-progress',
        dev ? '--dev' : null,
        ...dependencies
      ].filter(x => x),
      err => {
        if (err) {
          throw err;
        }

        return resolve();
      }
    );
  });
};

/**
 * Run an array of tasks in sequence
 * @param  {Array}  [funcs=[]] [description]
 * @return {Array<Promises>} returns array of promise resolve
 */
const runSequence = (funcs = []) =>
  funcs.reduce(
    (promise, func) =>
      promise.then(result => func().then(Array.prototype.concat.bind(result))),
    Promise.resolve([])
  );

/**
 * Write to package.json
 * @param  {String}  key - key in the package JSON object
 * @param  {Object}  config - the configuration to add
 * @return {Promise} returns promise
 */
const writeToPackage = (key, config) => async () => {
  const pkg = await readPkg({ normalize: false });

  let updatedPackage = pkg;

  // Merge existing keys
  if (key && key in pkg) {
    updatedPackage[key] = Object.assign({}, updatedPackage[key], config);
  }

  if (key && !(key in pkg)) {
    updatedPackage = { ...pkg, [key]: config };
  }

  if (!key) {
    updatedPackage = { ...pkg, ...config };
  }

  const pathToPackage = path.resolve(process.cwd(), 'package.json');

  return fs.writeFile(pathToPackage, JSON.stringify(updatedPackage, null, 2));
};

const action = async ({ name, dependencies, tasks = [], successMessage }) => {
  logAction(name);
  const spinner = ora(name).start();
  spinner.text = 'Installing dependencies';
  await installDependencies(dependencies);
  spinner.succeed(chalk`{white Installed all dependencies}`);

  if (tasks.length > 0) {
    spinner.text = 'Updating package.json';

    await runSequence(tasks);
  }

  spinner.succeed(chalk`{white ${successMessage}}`);
};

const main = async () => {
  if (!(await checkPackageExists())) {
    throw new Error(
      chalk`{red.bold package.json file not found.

Please ensure you're running checkpoints in a node project with a valid package.json file.
      }`
    );
  }

  console.log(chalk`{magenta.bold CHECKPOINTS}`, '\n');

  const answers = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selected',
      message: 'What would you like to add?',
      choices: [
        // 'All',
        // new inquirer.Separator(),
        ...choices
      ]
    }
  ]);

  const { selected } = answers;

  if (selected.some(x => x === PRETTIER || x === XO || x === XO_REACT)) {
    await action({
      name: 'Common Dependencies',
      dependencies: common,
      tasks: [],
      successMessage: 'Installed common dependencies'
    });
  }

  // Prettier selected
  if (selected.includes(PRETTIER)) {
    await action({
      name: 'Prettier',
      dependencies: prettier,
      tasks: [writeToPackage('prettier', prettierConfig)],
      successMessage: 'Added prettier config'
    });
  }

  // XO selected
  if (selected.includes(XO) || selected.includes(XO_REACT)) {
    await action({
      name: 'xo',
      dependencies: xo,
      tasks: [writeToPackage('xo', xoConfig)],
      successMessage: 'Added xo config to package.json'
    });
  }

  // XO with React selected
  if (selected.includes(XO_REACT)) {
    await action({
      name: 'xo-react',
      dependencies: xoReact,
      tasks: [writeToPackage('xo', xoReactConfig)],
      successMessage: 'Added xo-react config'
    });
  }

  // Precommit selected
  if (selected.includes(PRECOMMIT)) {
    await action({
      name: 'Precommit',
      dependencies: precommit,
      tasks: [
        writeToPackage(null, precommitConfig),
        writeToPackage('scripts', {
          'lint-staged': 'lint-staged'
        })
      ],
      successMessage:
        'Added lint-staged script, lint-staged config and precommit config'
    });
  }
};

// Prompt the user
try {
  main();
} catch (err) {
  throw err;
}
