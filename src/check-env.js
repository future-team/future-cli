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
            console.error(chalk.bold.red('Can\'t found package.json file in your project folder! Please check it!'))
            process.exit(1)
        }
        return projectPkg

    },
    checkDirectoryValid: function(dirPath, type){
        var template = configs[type+'Conf']['directoryTemplate']
        var target = Utils.dirTree(dirPath)
        Utils.writeFile(path.join(__dirname, type+'.json'), JSON.stringify(target))
    },
    /**
     * @param inputs
     * @returns {boolean}
     */
    validCmd: function(inputs){
        var args = inputs.args[0];
        var opts = inputs.opts;
        var msgs = [];
        var isOk = true;
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
            console.log(chalk.bold.red(msgs.join('\n')))
            isOk = false
        }
        return isOk
    },
    /**
     *
     * @param inputs
     * @param callback
     */
    preValid: function (inputs, callback) {
        var cmd = inputs.args[0],
            questions = [],
            prompt = null;
        if(!inputs.opts.template){
            questions = [{
                name: 'confirmUseDefaultTemplate',
                type: 'confirm',
                message: chalk.yellow( cmd+' command --template option is dismiss, it will be use default config [react]')
            }];
        }
        if(questions.length){
            prompt = inquirer.prompt(questions);
            prompt.then(function (answers) {
                // Use user feedback for... whatever!!
                if(answers.confirmUseDefaultTemplate === true){
                    inputs.opts.template = 'react'
                    callback && callback(inputs)
                }
            });
        }else{
            callback && callback(inputs)
        }
        return prompt
    }
}
module.exports = checkEnv