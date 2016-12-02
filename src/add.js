"use strict";
var _ = require('lodash')
var utils = require('./utils')
var path = require('path')
var fs = require('fs')
var inquirer = require('inquirer')
var chalk = require('chalk')
var gitUser = require('./git-user')()
var pathMapConf = require('./config/react')
const WEB = 'web'
const COMPONENT = 'component'
/**
 * list will to add file path, check it is exist then list then
 * @param type
 * @param conf
 * @param callback
 */
function checkModuleIsExist(type, conf, callback){
    let filePathArr = []
    if(type === WEB) {
        _.forEach(_.cloneDeep(pathMapConf.webPathMap), function(value, key){
            if(key == 'mock'){
                value.path += '/'+conf.camelName;
            }
            let filePath = path.join( pathMapConf.BASE_PATH, value.path, `${value.fileNameType == 'normal' ? conf.name : conf[value.fileNameType+'Name']}.${value.extension}`);
            filePathArr.push(filePath)
        });
    }

    if(type === COMPONENT) {
        _.forEach(_.cloneDeep(pathMapConf.componentPathMap), function(value, key){
            var filePath = path.join( pathMapConf.BASE_PATH, value.path, conf.camelName, `${value.fileNameType == 'normal' ? conf.name : conf[value.fileNameType+'Name']}.${value.extension}`);
            filePathArr.push(filePath)
        });
    }

    let existArr = []
    _.forEach(filePathArr, function(value, key){
        if(fs.existsSync(value)){
            existArr.push(value)
        }
    })
    if(existArr.length){
        let existFiles = existArr.map(function(item, index){
            return (index+1) + '. '+path.relative(pathMapConf.BASE_PATH, item)
        });
        inquirer.prompt([{
            name: 'confirmAdd',
            type: 'confirm',
            message: chalk.red(`It seems that some file already exist!\n`)+ chalk.blue(existFiles.join('\n')) + chalk.green(`\nDo you want to force continue?`),
            default: false
        }], function (answer) {
            if(answer && answer.confirmAdd) {
                callback && callback(type, conf)
            }else{
                return ''
            }
        });
    }else{
        callback && callback(type, conf)
    }
}

/**
 *
 * @param conf
 */
function addWeb(conf){
    _.forEach(pathMapConf.webPathMap, function(value, key){
        var template = utils.getTemplate(key, value, 'web');
        var complied = _.template(template);
        if(key == 'mock'){
            console.log(value.path);
            value.path += '/'+conf.camelName;
            console.log(value.path);
        }
        var filepath = path.join( pathMapConf.BASE_PATH, value.path, `${value.fileNameType == 'normal' ? conf.name : conf[value.fileNameType+'Name']}.${value.extension}`);
        // add register at reduces/index.es6
        // export  {<>} from './question-list.es6'
        // TODO check repeat!
        if(key == 'reducer'){
            var ex = `\r\nexport {${conf.camelName}} from './${conf.name}.es6'`,
                exPath = path.join(process.cwd() + '/src', value.path, 'index.es6');
            fs.appendFile(exPath, ex, function (err) {
                if(err){
                    utils.writeFile(filepath, ex);
                }
            });
        }
        utils.writeFile(filepath, complied(conf))
    });
    // TODO 在 src 下的 index.jsx 中添加相应的注册
}
/**
 *
 * @param conf
 */
function addComponent(conf){
    _.forEach(pathMapConf.componentPathMap, function(value, key){
        var template = utils.getTemplate(key, value, 'component');
        var complied = _.template(template);
        var filepath = path.join( pathMapConf.BASE_PATH, value.path, conf.camelName, `${value.fileNameType == 'normal' ? conf.name : conf[value.fileNameType+'Name']}.${value.extension}`);
        utils.writeFile(filepath, complied(conf))
    });
}
/**
 *
 * @param program
 * @constructor
 */
function Add(program){
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
    checkModuleIsExist(moduleType, writeConf, function(type, conf){
        switch (moduleType){
            case WEB:
                addWeb(writeConf);
                break;
            case COMPONENT:
                addComponent(writeConf);
                break;
            default:
                // 参数错误
                break;
        }
    })
}
module.exports = Add;