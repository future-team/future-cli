"use strict"
var fs = require('fs')
var path = require('path')
var inquirer = require('inquirer')
var configs = require('./config')
var Utils = require('./utils')
var chalk = require('chalk')
var checkEnv = {
    package: function(){
        var projectPkg = {}
        try{
            projectPkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8') || '{}')
        }catch(e){
            console.error(chalk.red('Can\'t found package.json file in your project folder! Please check it!'))
            process.exit(1)
        }
        return projectPkg

    },
    checkDirectoryValid: function(dirPath, type){
        var template = configs[type+'Conf']['directoryTemplate']
        var target = Utils.dirTree(dirPath)
        Utils.writeFile(path.join(__dirname, type+'.json'), JSON.stringify(target))
    },
    validCmd: function(inputs){
        var args = inputs.args[0];
        var opts = inputs.opts;
        var msgs = [];
        if(['add', 'rm'].indexOf(args) != -1){
            // template default is react
            if(['web', 'component'].indexOf(opts.type) == -1){
                msgs.push(args+' command --type option is not valid')
            }
            if(!opts.name){
                msgs.push(args+' command --name option should not be empty')
            }
        }
        if(msgs.length){
            Utils.logMsg(msgs, 'red', true)
            return false
        }
        return true
    }
}
module.exports = checkEnv