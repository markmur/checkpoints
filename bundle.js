'use strict';

const path = require('path');
const fs = require('fs-extra');
const readPkg = require('read-pkg');
const inquirer = require('inquirer');
const yarn = require('yarn-api');
const chalk = require('chalk');

const {common, prettier, xo, xoReact, precommit} = require('./dependencies');
const {prettierConfig, xoConfig, precommitConfig} = require('./config');

const PRETTIER = 'prettier';
const XO = 'xo';
const XO_REACT = 'xo-react';
const PRECOMMIT = 'precommit';

const choices = [XO, XO_REACT, PRETTIER, PRECOMMIT];

const logInstall = (dependencies, name = 'dependencies') => console.log(chalk`
{bgGreen.bold Installing ${name}}
{white.bold ${dependencies.join('\n')}}
`);

const logPackageUpdate = message => console.log(chalk`
{bgCyan.bold Updating package} {white.bold ${message}}
`);

/**
 * Install dependencies with Yarn
 * @param  {Array} dependencies - an array of deps to install
 * @param  {Boolean} [dev=false] - set to true to add to devDependencies
 * @return {Promise} returns promise
 */
const installDependencies = (dependencies, dev = false) => {
	return new Promise(resolve => {
		yarn(['add', dev ? '--dev' : null, ...dependencies].filter(x => x), err => {
			if (err) {
				throw err;
			}

			return resolve();
		});
	});
};

/**
 * Write to package.json
 * @param  {String}  key - key in the package JSON object
 * @param  {Object}  config - the configuration to add
 * @return {Promise} returns promise
 */
const writeToPackage = async (key, config) => {
	const pkg = await readPkg({normalize: false});

	logPackageUpdate();

	let updatedPackage = pkg;

	// Merge existing keys
	if (key && key in pkg) {
		updatedPackage[key] = Object.assign({}, updatedPackage[key], config);
	}

	if (key && !(key in pkg)) {
		updatedPackage = {...pkg, [key]: config};
	}

	if (!key) {
		updatedPackage = {...pkg, ...config};
	}

	const pathToPackage = path.resolve(process.cwd(), 'package.json');

	return fs.writeFile(pathToPackage, JSON.stringify(updatedPackage, null, 2));
};

const main = async () => {
	console.log(chalk`
			{magentaBright.bold.underline CHECKPOINT}
			{gray Add linting, code formatting and precommit checks to an existing project}
	`);

	const pkg = await readPkg();

	if (!pkg) {
		throw new Error('Please ensure you are running a node repo');
	}

	const answers = await inquirer.prompt([
		{
			type: 'checkbox',
			name: 'selected',
			message: 'What would you like to add?',
			choices: ['All', new inquirer.Separator(), ...choices]
		}
	]);

	const {selected} = answers;

	if (selected.some(x => x === PRETTIER || x === XO || x === XO_REACT)) {
		logInstall(common, 'common dependencies');
		await installDependencies(common);
	}

	// Prettier selected
	if (selected.includes(PRETTIER)) {
		await installDependencies(prettier, true);
		await writeToPackage('prettier', prettierConfig);
	}

	// XO selected
	if (selected.includes(XO)) {
		await installDependencies(xo, true);
		await writeToPackage('xo', xoConfig);
	}

	// XO with React selected
	if (selected.includes(XO_REACT)) {
		await installDependencies(xoReact, true);
	}

	// Precommit selected
	if (selected.includes(PRECOMMIT)) {
		await installDependencies(precommit, true);
		await writeToPackage(null, precommitConfig);
		await writeToPackage('scripts', {
			'lint-staged': 'lint-staged'
		});
	}
};

// Prompt the user
main();
