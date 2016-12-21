'use strict'
var Utils = require('./utils')
var checkEnv = require('./check-env')
var chalk = require('chalk')
var Router = require('./router')
var commandMapToPath = {
    'add': '../src/commands/add',
    'dev': '../src/commands/dev',
    'help': '../src/commands/help',
    'init': '../src/commands/init',
    'rm': '../src/commands/remove',
    'serve': '../src/commands/serve',
    'alias': '../src/commands/alias'
}
function Navigate(cli) {
    var router = new Router()
    var cliOpts = Utils.formatArgs(cli.flags, cli.input)
    var cmd = cliOpts.args[0]
    // register route
    router.registerRoute('add', require('../src/commands/add'));
    router.registerRoute('dev', require('../src/commands/dev'));
    router.registerRoute('help', require('../src/commands/help'));
    router.registerRoute('init', require('../src/commands/init'));
    router.registerRoute('rm', require('../src/commands/remove'));
    router.registerRoute('serve', require('../src/commands/serve'));
    router.registerRoute('alias', require('../src/commands/alias'));

    // navigate
    try {
        if(!cmd){
            // TODO
            return cli.showHelp()
        }

        if(!commandMapToPath[cmd]){
            console.log(chalk.bold.red('command not found!'))
            return router.navigate('help', router);
        }

        // package.json scripts alias
        var scripts = checkEnv.package().scripts || {}
        if(Object.keys(scripts).indexOf(cmd) != -1){
            router.navigate('alias', cliOpts)
            return
        }
        // some options check or set default
        checkEnv.preValid(cliOpts, function(opts){
            if(checkEnv.validCmd(opts)) {
                // async not catch error properly must add one!
                try {
                    router.navigate(cmd, opts)
                }catch (e) {
                    console.log(chalk.bold.red('command not found!'))
                    router.navigate('help', router);
                }
            }
        })
    }catch (e) {
        console.log(chalk.bold.red('command not found!'))
        router.navigate('help', router);
    }
}
module.exports = Navigate