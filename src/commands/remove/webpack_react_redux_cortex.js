"use strict";
var _ = require('lodash');
var Utils = require('../../utils');
var path = require('path');
var fs = require('fs');
var chalk = require('chalk');

module.exports.removeWeb = function removeWeb(conf) {

    _.forEach(_.cloneDeep(conf.webPathMap), function(value, key){
        // create file path
        if(key == 'mock'){
            value.path += '/'+conf.camelName;
        }
        var filePath = path.join( conf.BASE_PATH, value.path, (value.fileNameType == 'normal' ? conf.name : conf[value.fileNameType+'Name'])+'.'+value.extension);
        // 在 reduces index.es6 中删除
        // export  {<>} from "./question-list.es6";
        if(key == 'reducer'){
            var exPath = path.join(conf.BASE_PATH, value.path, 'index.es6'),
                source = Utils.readFile(exPath)||'' + '\n',
                line	= "",
                content	= "";
            for(var i=0;i<source.length;i++) {
                line = line + source[i];
                if(source[i]=='\n') {
                    // test line
                    var regModule = new RegExp('\./'+conf.name+'\.es6', 'gi');
                    if(!regModule.test(line)){
                        content = content + line;
                    }
                    line = "";
                }
            }
            Utils.writeFile(exPath, content);
        }
        try{
            Utils.removeFile(filePath)
            console.log('Remove file '+ chalk.blue(path.relative(conf.BASE_PATH, filePath))+ ' done')
        }catch(e) {
            console.log('Remove file '+ chalk.red(path.relative(conf.BASE_PATH, filePath))+ ' error')
        }
    });
}

module.exports.removeComponent = function removeComponent(conf) {
    _.forEach(conf.componentPathMap, function(value, key){
        var filePath = path.join( conf.BASE_PATH, value.path, conf.camelName, (value.fileNameType == 'normal' ? conf.name : conf[value.fileNameType+'Name'])+'.'+value.extension);
        try {
            Utils.removeFile(filePath)
            console.log('Remove file '+ chalk.blue(path.relative(conf.BASE_PATH, filePath))+ ' done')
        }catch(e){
            console.log('Remove file '+ chalk.red(path.relative(conf.BASE_PATH, filePath))+ ' error')
        }
    });
}