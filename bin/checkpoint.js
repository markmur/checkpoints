#!/usr/bin/env node

/* eslint-disable import/no-unassigned-import */

process.title = 'checkpoint';

require('babel-core/register');
require('babel-polyfill');
require('../dist');
