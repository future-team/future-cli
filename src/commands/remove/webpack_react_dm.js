"use strict";
var _ = require('lodash');
var Utils = require('../../utils');
var path = require('path');
var fs = require('fs');
var chalk = require('chalk');

module.exports.removeWeb = function removeWeb(conf) {
    _.forEach(conf.webPathMap, function(value, key){
        if(key == 'component'){
            value.path += '/'+conf.camelName;
        }
        let fileName = value.fileNameType == 'normal' ? conf.name : conf[value.fileNameType+'Name'];
        if(key == 'controller'){
            // add `Control` suffix
            fileName += 'Control';
        }
        if(key == 'model') {
            // add `Model` suffix
            fileName += 'Model';
        }
        let filePath = path.join(conf.BASE_PATH, value.path, fileName + '.' + value.extension);
        // Attention!
        // check `config/base.config.js` the `root` config
        // if this point to a directory, this should a multi page app, then should generate `view/pages/<name>.jsx`, `view/<name>.html`
        // if this point to a file, this should a single page app, then should add route to `view/pages/Index.jsx` file.

        // 在 reduces index.es6 中删除
        // export  {<>} from "./question-list.es6";
        // if(key == 'reducer'){
        //     var exPath = path.join(conf.BASE_PATH, value.path, 'index.es6'),
        //         source = Utils.readFile(exPath)||'' + '\n',
        //         line	= "",
        //         content	= "";
        //     for(var i=0;i<source.length;i++) {
        //         line = line + source[i];
        //         if(source[i]=='\n') {
        //             // test line
        //             var regModule = new RegExp('\./'+conf.name+'\.es6', 'gi');
        //             if(!regModule.test(line)){
        //                 content = content + line;
        //             }
        //             line = "";
        //         }
        //     }
        //     Utils.writeFile(exPath, content);
        // }
        try{
            Utils.removeFile(filePath);
            console.log('Remove file '+ chalk.blue(path.relative(conf.BASE_PATH, filePath))+ ' done');
        }catch(e) {
            console.log('Remove file '+ chalk.red(path.relative(conf.BASE_PATH, filePath))+ ' error');
        }
    });
}