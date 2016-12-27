'use strict';

const fs       = require('fs-extra');
const conf     = require('rc')('babelinit');
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

const presetsList = conf.presets && Array.isArray(conf.presets) ?
  conf.presets :
  presets;

const pluginsList = conf.plugins && Array.isArray(conf.plugins) ?
  conf.plugins :
  plugins;

inquirer.prompt([
  {
    type   : 'checkbox',
    name   : 'presets',
    message: 'Select presets',
    choices: presetsList
  },
  {
    type   : 'checkbox',
    name   : 'plugins',
    message: 'Select plugins',
    choices: pluginsList
  }
]).then((answers) => {
  const presets = answers.presets;
  const plugins = [];

  answers.plugins.forEach((e) => {
    plugins.push(...e.split(','));
  });

  installPackages([
    ...presets.map((preset) => `babel-preset-${preset}`),
    ...plugins.map((plugin) => `babel-plugin-${plugin}`)
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
