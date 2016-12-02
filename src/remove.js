"use strict";
var _ = require('lodash')
var utils = require('./utils')
var path = require('path')
var fs = require('fs')
var chalk = require('chalk')
var inquirer = require('inquirer')
var gitUser = require('./git-user')()
var pathMapConf = require('./config/react')

function removeWeb(conf) {
    _.forEach(pathMapConf.webPathMap, function(value, key){
        // create file path
        if(key == 'mock'){
            value.path += '/'+conf.camelName;
        }
        var filepath = path.join( pathMapConf.BASE_PATH, value.path, `${value.fileNameType == 'normal' ? conf.name : conf[value.fileNameType+'Name']}.${value.extension}`);
        // 在 reduces index.es6 中删除
        // export  {<>} from "./question-list.es6";
        if(key == 'reducer'){
            var ex = `export  {${conf.camelName}} from "./${conf.name}.es6";`,
                exPath = path.join(process.cwd() + '/src', value.path, 'index.es6'),
                source = utils.readFile(exPath)||'' + '\n',
                line	= "",
                content	= "";
            for(var i=0;i<source.length;i++) {
                line = line + source[i];
                if(source[i]=='\n') {
                    // test line
                    var regModule = new RegExp(`\./${conf.name}\.es6'`, 'gi');
                    if(!regModule.test(line)){
                        content = content + line;
                    }
                    line = "";
                }
            }
            utils.writeFile(exPath, content);
        }
        utils.removeFile(filepath)
    });
}

function removeComponent(conf) {
    _.forEach(pathMapConf.componentPathMap, function(value, key){
        var filepath = path.join( pathMapConf.BASE_PATH, value.path, conf.camelName, `${value.fileNameType == 'normal' ? conf.name : conf[value.fileNameType+'Name']}.${value.extension}`);
        utils.removeFile(filepath)
    });
}

function Remove(program){
    var args = program.args,
        moduleType = args[2],
        name = args[3],
        upperCaseName  = name.split('-').map((item)=>{return _.upperFirst(item)}).join(''),
        camelName = _.camelCase(name);

    var writeConf = {
        gitUser: gitUser,
        name: name,
        upperName: upperCaseName,
        camelName: camelName
    };
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