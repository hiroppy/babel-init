'use strict';

const inquirer = require('inquirer');

const yearlyPresets = [
  'latest',
  'es2015',
  'es2016',
  'es2017'
];

const stagePresets = [
  'stage-3',
  'stage-2',
  'stage-1',
  'stage-0'
];

const otherPresets = [
  'react',
  'env'
];

const presets = [
  new inquirer.Separator('=== yearly presets'),
  ...yearlyPresets,
  new inquirer.Separator('=== stage presets'),
  ...stagePresets,
  new inquirer.Separator('=== other presets'),
  ...otherPresets
];

module.exports = presets;
