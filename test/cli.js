'use strict';

const test     = require('ava');
const pify     = require('pify');
const execFile = require('child_process').execFile;
const packages = require('../package.json');

test('should return version number', async (t) => {
  const versionLabel = `Version: ${packages.version}`;
  const stdout       = await pify(execFile)('../bin/index.js', ['-v']);

  t.is(stdout.trim(), versionLabel);
});

test('should return the site url', async (t) => {
  const output = 'Plugins: https://babeljs.io/docs/plugins/';
  const stdout = await pify(execFile)('../bin/index.js', ['--site']);

  t.is(stdout.trim(), output);
});
