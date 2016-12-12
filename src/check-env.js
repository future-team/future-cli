"use strict"
const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const configs = require('./config')
const Utils = require('./utils')
const chalk = require('chalk')
const checkEnv = {
    package: function(){
        let projectPkg = {}
        try{
            projectPkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8') || '{}')
        }catch(e){
            console.error(chalk.red(`Can't found package.json file in your project folder! Please check it!`))
            process.exit(1)
        }
        return projectPkg

    },
    checkDirectoryValid: function(dirPath, type){
        const template = configs[`${type}Conf`]['directoryTemplate']
        const target = Utils.dirTree(dirPath)
        Utils.writeFile(path.join(__dirname, `${type}.json`), JSON.stringify(target))
    },
    validCmd: function(inputs){
        const args = inputs.args[0];
        const opts = inputs.opts;
        let msgs = [];
        if(['add', 'rm'].indexOf(args) != -1){
            // template default is react
            if(['web', 'component'].indexOf(opts.type) == -1){
                msgs.push(`${args} command --type option is not valid`)
            }
            if(!opts.name){
                msgs.push(`${args} command --name option should not be empty`)
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