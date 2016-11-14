"use strict";
var _ = require('lodash')
var utils = require('./utils')
var path = require('path')
var fs = require('fs')
var gitUser = require('./git-user')()
var pathMapConf = require('./config/react')
var inquirer = require('inquirer')

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
                exPath = path.join(process.cwd() + '/src', value.path, 'index.es6');
            // TODO how to remove new line reg ?
            utils.writeFile(exPath, (utils.readFile(exPath)||'').replace(new RegExp(ex, 'g'), ''));
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
        opts = program.args,
        cwd = process.cwd(),
        templateType = args[1],
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
        message: 'Do you confirm to remove '+ name + ' '+ moduleType + ' module '
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