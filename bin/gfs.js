#!/usr/bin/env node
'use strict'
let fs = require('fs')
let path = require('path')
let chalk = require('chalk')
let updateNotifier = require('update-notifier')
let Insight = require('insight')
let stringLength = require('string-length')
let rootCheck = require('root-check')
let meow = require('meow')
let list = require('cli-list')
let pkg = require('../package.json')
let Router = require('../src/router')
let gens = list(process.argv.slice(2))
let yaml = require('js-yaml')
const checkEnv = require('../src/check-env')()
let minicli = null
let cli = gens.map(function (gen) {
    minicli = meow(`Usage: gfs COMMANDER [args] [options]
  $ gfs add --template react --type web --name question-detail
  $ gfs rm --template react --type component --name question-detail
Options
  --template  project template, default is [react]
  --type      module type [web|component]
  --name      module name
Examples
  $ gfs add --template react --type web --name question-detail
  $ gfs add --template react --type component --name ask
  $ gfs rm --template react --type component --name ask
  $ gfs rm --template react --type web --name question-detail
`, { pkg: pkg, argv: gen });
    let opts = minicli.flags;
    let args = minicli.input;
    // add un-camelized options too, for legacy
    // TODO: remove some time in the future when generators have upgraded
    Object.keys(opts).forEach(function (key) {
        let legacyKey = key.replace(/[A-Z]/g, function (m) {
            return '-' + m.toLowerCase();
        });
        opts[legacyKey] = opts[key];
    });

    return { opts: opts, args: args };
});
let firstCmd = cli[0] || { opts: {}, args: {} };
let cmd = firstCmd.args[0];
let router = new Router();

console.log(chalk.bold.cyan('\nWelcome to use GFS-cli!\n'));
// register route
router.registerRoute('add', require('../src/add'));
router.registerRoute('dev', require('../src/commands/dev'));
router.registerRoute('help', require('../src/commands/help'));
router.registerRoute('init', require('../src/commands/init'));
router.registerRoute('rm', require('../src/remove'));
router.registerRoute('serve', require('../src/commands/serve'));
router.registerRoute('alias', require('../src/commands/alias'));
process.once('exit', function(code){
    console.log(chalk.cyan('Action was done! Bye~'))
});

try {
    // TODO 检查是否在根目录下 以及目录结构是否合法
    if(!cmd){
        minicli.showHelp()
        return
    }
    // package.json scripts alias
    let scripts = checkEnv.scripts || {}
    if(Object.keys(scripts).indexOf(cmd) != -1){
        router.navigate('alias', firstCmd)
        return
    }
    // valid cmd
    router.navigate(cmd, firstCmd);
}catch (e) {
    router.navigate('help', router);
}
