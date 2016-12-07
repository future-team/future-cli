"use strict";
let _ = require('lodash')
let Utils = require('./utils')
let path = require('path')
let fs = require('fs')
let chalk = require('chalk')
let inquirer = require('inquirer')
let gitUser = require('./git-user')()
let configs = require('./config')

function removeWeb(conf) {
    _.forEach(conf.webPathMap, function(value, key){
        // create file path
        if(key == 'mock'){
            value.path += '/'+conf.camelName;
        }
        let filePath = path.join( conf.BASE_PATH, value.path, `${value.fileNameType == 'normal' ? conf.name : conf[value.fileNameType+'Name']}.${value.extension}`);
        // 在 reduces index.es6 中删除
        // export  {<>} from "./question-list.es6";
        if(key == 'reducer'){
            let exPath = path.join(process.cwd() + '/src', value.path, 'index.es6'),
                source = Utils.readFile(exPath)||'' + '\n',
                line	= "",
                content	= "";
            for(let i=0;i<source.length;i++) {
                line = line + source[i];
                if(source[i]=='\n') {
                    // test line
                    let regModule = new RegExp(`\./${conf.name}\.es6'`, 'gi');
                    if(!regModule.test(line)){
                        content = content + line;
                    }
                    line = "";
                }
            }
            Utils.writeFile(exPath, content);
        }
        Utils.removeFile(filePath)
    });
}

function removeComponent(conf) {
    _.forEach(conf.componentPathMap, function(value, key){
        let filePath = path.join( conf.BASE_PATH, value.path, conf.camelName, `${value.fileNameType == 'normal' ? conf.name : conf[value.fileNameType+'Name']}.${value.extension}`);
        Utils.removeFile(filePath)
    });
}

function Remove(inputs){
    let opts = inputs.opts,
        template = opts['template'],
        moduleType = opts['type'],
        name = opts['name'],
        upperCaseName  = name.split('-').map((item)=>{return _.upperFirst(item)}).join(''),
        camelName = _.camelCase(name);
    const templateConf = configs[`${template}Conf`]
    let writeConf = _.extend({
        gitUser: gitUser,
        name: name,
        upperName: upperCaseName,
        camelName: camelName
    }, templateConf);
    // ask confirm
    inquirer.prompt([{
        name: 'confirmRemove',
        type: 'confirm',
        message: chalk.red('Do you confirm to remove '+ chalk.yellow(name + ' '+ moduleType) + ' module ')
    }], function (answers) {
        // Use user feedback for... whatever!!
        if(answers.confirmRemove === true){
            switch (moduleType){
                case 'web':
                    removeWeb(writeConf);
                    break;
                case 'component':
                    removeComponent(writeConf);
                    break;
                default:
                    // 参数错误
                    break;
            }
        }
    });
}
module.exports = Remove;