#!/usr/bin/env node
'use strict'
let fs = require('fs')
let path = require('path')
let chalk = require('chalk')
const inquirer = require('inquirer')
let meow = require('meow')
let list = require('cli-list')
let pkg = require('../package.json')
let Router = require('../src/router')
let gens = list(process.argv.slice(2))
const checkEnv = require('../src/check-env')
let minicli = null
let cli = gens.map(function (gen) {
    minicli = meow(`Usage: gfs COMMAND [options]
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

console.log(chalk.bold.cyan('Welcome to use GFS-cli!'));
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
    if(!cmd){
        minicli.showHelp()
        return
    }
    // package.json scripts alias
    let scripts = checkEnv.package().scripts || {}
    if(Object.keys(scripts).indexOf(cmd) != -1){
        router.navigate('alias', firstCmd)
        return
    }
    // valid cmd
    // first check `--template`
    if(!firstCmd.opts.template){
        inquirer.prompt([{
            name: 'confirmUseDefaultTemplate',
            type: 'confirm',
            message: chalk.yellow(`${cmd} command --template option is dismiss, it will be use default config [react]`)
        }], function (answers) {
            // Use user feedback for... whatever!!
            if(answers.confirmUseDefaultTemplate === true){
                // TODO add, rm, update should check `process.cwd()` is project root and directory structure is valid
                if(checkEnv.validCmd(firstCmd)) {
                    router.navigate(cmd, firstCmd)
                }
            }
        });
    }else{
        if(checkEnv.validCmd(firstCmd)) {
            router.navigate(cmd, firstCmd)
        }
    }
}catch (e) {
    console.log(chalk.bold.red('command not found!'))
    router.navigate('help', router);
}