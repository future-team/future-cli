"use strict";
var _ = require('lodash');
var Utils = require('../utils');
var path = require('path');
var fs = require('fs');
var inquirer = require('inquirer');
var chalk = require('chalk');
var reactRedux = require('./add/webpack_react_redux_cortex');
var reactDm = require('./add/webpack_react_dm');

var REACT_REDUX_WEB = 'react_redux_web';
var REACT_REDUX_COMPONENT = 'react_redux_component';
var REACT_DM_WEB = 'react_dm_web';
/**
 * list will to add file path, check it is exist then list then
 * @param type
 * @param conf
 * @param callback
 */
function checkModuleIsExist(conf, callback){
    var filePathArr = [], type = conf.moduleType;
    if(type === REACT_REDUX_WEB) {
        _.forEach(_.cloneDeep(conf.webPathMap), function(value, key){
            if(key == 'mock'){
                value.path += '/'+conf.camelName;
            }
            var filePath = path.join( conf.BASE_PATH, value.path, (value.fileNameType == 'normal' ? conf.name : conf[value.fileNameType+'Name'])+'.'+value.extension);
            filePathArr.push(filePath)
        });
    }

    if(type === REACT_REDUX_COMPONENT) {
        _.forEach(_.cloneDeep(conf.componentPathMap), function(value, key){
            var filePath = path.join( conf.BASE_PATH, value.path, conf.camelName, (value.fileNameType == 'normal' ? conf.name : conf[value.fileNameType+'Name'])+'.'+value.extension);
            filePathArr.push(filePath)
        });
    }
    // TODO
    if(type === REACT_DM_WEB) {
        _.forEach(_.cloneDeep(conf.webPathMap), function(value, key){
            var filePath = path.join( conf.BASE_PATH, value.path, conf.camelName, (value.fileNameType == 'normal' ? conf.name : conf[value.fileNameType+'Name'])+'.'+value.extension);
            filePathArr.push(filePath)
        });
    }

    var existArr = [];
    _.forEach(filePathArr, function(value, key){
        if(fs.existsSync(value)){
            existArr.push(value)
        }
    });
    return existArr;
}

function goToAdd(conf) {
    var addFiles = [], type = conf.moduleType;
    switch (type){
        case REACT_REDUX_WEB:
            addFiles = reactRedux.addWeb(conf);
            break;
        case REACT_REDUX_COMPONENT:
            addFiles = reactRedux.addComponent(conf);
            break;
        case REACT_DM_WEB:
            addFiles = reactDm.addWeb(conf);
        default:
            // 参数错误
            break;
    }
    _.forEach(addFiles, function(value, key){
        try {
            Utils.writeFile(value.path, value.content);
            console.log('Add file '+ chalk.blue(path.relative(conf.BASE_PATH, value.path))+ ' done');
        }catch(e) {
            console.error('Add file '+ chalk.red(path.relative(conf.BASE_PATH, value.path))+ ' error');
        }
    });
    return addFiles;
}
/**
 *
 * @param inputs
 * @varructor
 */
function Add(inputs){
    var writeConf = Utils.generateConf(inputs);
    var existArr = checkModuleIsExist(writeConf);
    var isExist = !!existArr.length;
    if(isExist){
        var existFiles = existArr.map(function(item, index){
            return (index+1) + '. '+path.relative(writeConf.BASE_PATH, item);
        });
        var prompt = inquirer.prompt([{
            name: 'confirmAdd',
            type: 'confirm',
            message: chalk.red('It seems that some file already exist!\n')+ chalk.blue(existFiles.join('\n')) + chalk.green('\nDo you want to force continue?'),
            default: false
        }]);
        prompt.then(function (answer) {
            var addFiles = [];
            if(answer && answer.confirmAdd) {
                addFiles = goToAdd(writeConf);
            }
            return addFiles;
        });
        return prompt;
    }else{
        return goToAdd(writeConf);
    }
}
module.exports = Add;