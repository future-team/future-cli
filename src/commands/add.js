"use strict";
var _ = require('lodash')
var Utils = require('../utils')
var path = require('path')
var fs = require('fs')
var inquirer = require('inquirer')
var chalk = require('chalk')
var gitUser = require('../git-user')()
var configs = require('../config')
var WEB = 'web'
var COMPONENT = 'component'
/**
 * list will to add file path, check it is exist then list then
 * @param type
 * @param conf
 * @param callback
 */
function checkModuleIsExist(type, conf, callback){
    var filePathArr = []
    if(type === WEB) {
        _.forEach(_.cloneDeep(conf.webPathMap), function(value, key){
            if(key == 'mock'){
                value.path += '/'+conf.camelName;
            }
            var filePath = path.join( conf.BASE_PATH, value.path, (value.fileNameType == 'normal' ? conf.name : conf[value.fileNameType+'Name'])+'.'+value.extension);
            filePathArr.push(filePath)
        });
    }

    if(type === COMPONENT) {
        _.forEach(_.cloneDeep(conf.componentPathMap), function(value, key){
            var filePath = path.join( conf.BASE_PATH, value.path, conf.camelName, (value.fileNameType == 'normal' ? conf.name : conf[value.fileNameType+'Name'])+'.'+value.extension);
            filePathArr.push(filePath)
        });
    }

    var existArr = []
    _.forEach(filePathArr, function(value, key){
        if(fs.existsSync(value)){
            existArr.push(value)
        }
    })
    return existArr;
}

/**
 *
 * @param conf
 */
function addWeb(conf){
    var addFiles = []
    _.forEach(conf.webPathMap, function(value, key){
        let template = Utils.getTemplate(conf.templateName, key, value, 'web');
        let complied = _.template(template);
        if(key == 'mock'){
            value.path += '/'+conf.camelName;
        }
        let filePath = path.join( conf.BASE_PATH, value.path, (value.fileNameType == 'normal' ? conf.name : conf[value.fileNameType+'Name'])+'.'+value.extension);
        // add register at reduces/index.es6
        // export  {<>} from './question-list.es6'
        // TODO check repeat!
        if(key == 'reducer'){
            let ex = '\nexport {'+conf.camelName+'} from \'./'+conf.name+'.es6\'',
                exPath = path.join(process.cwd() + '/src', value.path, 'index.es6'),
                indexContent = '';
            /*fs.appendFile(exPath, ex, function (err) {
                if(err){
                    Utils.writeFile(filePath, ex);
                }
            });*/
            try{
                indexContent = fs.readFileSync(exPath)
            }catch(e){
                console.log('some thing error')
            }
            indexContent += ex;
            addFiles.push({
                path: filePath,
                content: indexContent
            })
        }
        addFiles.push({
            path: filePath,
            content: complied
        })
        /*try {
            Utils.writeFile(filePath, complied(conf))
            console.log('Add file '+ chalk.blue(path.relative(conf.BASE_PATH, filePath))+ ' done')
        }catch(e) {
            console.error('Add file '+ chalk.red(path.relative(conf.BASE_PATH, filePath))+ ' error')
        }*/
    });
    // TODO 在 src 下的 index.jsx 中添加相应的注册
    return addFiles
}
/**
 *
 * @param conf
 */
function addComponent(conf){
    var addFiles = []
    _.forEach(conf.componentPathMap, function(value, key){
        let template = Utils.getTemplate(conf.templateName, key, value, 'component');
        let complied = _.template(template);
        let filePath = path.join( conf.BASE_PATH, value.path, conf.camelName, (value.fileNameType == 'normal' ? conf.name : conf[value.fileNameType+'Name'])+'.'+value.extension);

        addFiles.push({
            path: filePath,
            content: complied
        })
        /*try {
            Utils.writeFile(filePath, complied(conf))
            console.log('Add file '+ chalk.blue(path.relative(conf.BASE_PATH, filePath))+ ' done')
        }catch(e) {
            console.error('Add file '+ chalk.red(path.relative(conf.BASE_PATH, filePath))+ ' error')
        }*/
    });
    return addFiles
}
function goToAdd(type, conf) {
    var addFiles = []
    switch (type){
        case WEB:
            addFiles = addWeb(conf);
            break;
        case COMPONENT:
            addFiles = addComponent(conf);
            break;
        default:
            // 参数错误
            break;
    }
    _.forEach(addFiles, function(value, key){
        try {
            Utils.writeFile(value.path, value.content)
            console.log('Add file '+ chalk.blue(path.relative(conf.BASE_PATH, value.path))+ ' done')
        }catch(e) {
            console.error('Add file '+ chalk.red(path.relative(conf.BASE_PATH, value.path))+ ' error')
        }
    })
}
/**
 *
 * @param program
 * @varructor
 */
function Add(inputs){
    var opts = inputs.opts
    var template = opts['template']
    var moduleType = opts['type']
    var name = opts['name']
    var upperCaseName  = name.split('-').map(function(item){return _.upperFirst(item)}).join('')
    var camelName = _.camelCase(name)
    var templateConf = configs[template+'Conf']
    var writeConf = _.extend({
        gitUser: gitUser,
        name: name,
        upperName: upperCaseName,
        camelName: camelName
    }, templateConf)

    var existArr = checkModuleIsExist(moduleType, writeConf)
    var isExist = !!existArr.length
    if(isExist){
        var existFiles = existArr.map(function(item, index){
            return (index+1) + '. '+path.relative(writeConf.BASE_PATH, item)
        });
        var prompt = inquirer.prompt([{
            name: 'confirmAdd',
            type: 'confirm',
            message: chalk.red('It seems that some file already exist!\n')+ chalk.blue(existFiles.join('\n')) + chalk.green('\nDo you want to force continue?'),
            default: false
        }]);
        return prompt.then(function (answer) {
            var addFiles = []
            if(answer && answer.confirmAdd) {
                addFiles = goToAdd(moduleType, writeConf)
            }
            return new Promise(function(resolve){
                resolve(addFiles)
            })
        })
    }else{
        var addFiles = goToAdd(moduleType, writeConf)
        return new Promise(function(resolve){
            resolve(addFiles)
        })
    }
}
module.exports = Add;