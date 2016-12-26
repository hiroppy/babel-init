'use strict';

const fs       = require('fs-extra');
const spawn    = require('cross-spawn');
const inquirer = require('inquirer');
const presets  = require('./presets');
const plugins  = require('./plugins');

const babelrcTemplate = {
  env    : {},
  ignore : [],
  plugins: [],
  presets: []
};

inquirer.prompt([
  {
    type   : 'checkbox',
    name   : 'presets',
    message: 'Select presets',
    choices: [
      new inquirer.Separator('=== yearly presets'),
      ...presets.yearlyPresets,
      new inquirer.Separator('=== stage presets'),
      ...presets.stagePresets,
      new inquirer.Separator('=== other presets'),
      ...presets.otherPresets
    ]
  },
  {
    type   : 'checkbox',
    name   : 'plugins',
    message: 'Select plugins',
    choices: [
      ...plugins.syntaxPlugins
    ]
  }
]).then((answers) => {
  const presets = answers.presets;
  const plugins = answers.plugins;

  installPackages([
    ...answers.presets.map((preset) => `babel-preset-${preset}`),
    ...answers.plugins.map((plugin) => `babel-plugin-${plugin}`)
  ]);

  createBabelRc({
    presets,
    plugins
  });
});

/**
 * install packages via npm
 */
function installPackages(packages) {
  spawn.sync('npm', [
    'install',
    '-D',
    ...packages
  ], { stdio: 'inherit' });
}

// [TODO] confirm existing .babelrc
/**
 * create .babelrc
 */
function createBabelRc(obj) {

  babelrcTemplate.presets = obj.presets;
  babelrcTemplate.plugins = obj.plugins;

  fs.writeJSONSync('./.babelrc', babelrcTemplate);
  console.log(JSON.stringify(babelrcTemplate, null, 2));
}
