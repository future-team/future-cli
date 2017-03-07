"use strict";
var _ = require('lodash');
var Utils = require('../../utils');
var path = require('path');
var fs = require('fs');
var chalk = require('chalk');

module.exports.removeWeb = function removeWeb(conf) {
    var isMultiApp = conf.isMultiApp;
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

        try{
            Utils.removeFile(filePath);
            console.log('Remove file '+ chalk.blue(path.relative(conf.BASE_PATH, filePath))+ ' done');
        }catch(e) {
            console.log('Remove file '+ chalk.red(path.relative(conf.BASE_PATH, filePath))+ ' error');
        }
    });
    var indexHtmlPath = path.join(conf.BASE_PATH, 'view/index.html'),
        indexHtmlCtn = Utils.readFile(indexHtmlPath);
    // need to rewrite `/view/pages/Index.jsx`
    // replace view/index.html `./index.js` => `./bundle.js`
    // 1. remove `import ${conf.upperName}Container from './${conf.upperName}'` to top
    // 2. remove `<Route path="/${conf.camelName}" component={${conf.upperName}Container} />` to `Router`
    var exPath = path.join(conf.BASE_PATH, 'view/pages', 'Index.jsx'),
        source = Utils.readFile(exPath)||'' + '\n',
        line	= "",
        content	= "",
        containerCtn = 'import '+conf.upperName+'Container from \'./'+conf.upperName+'\'',
        routerCtn = '<Route path="/'+conf.camelName+'" component={'+conf.upperName+'Container} />';
    for(var i=0; i<source.length; i++) {
        line = line + source[i];
        if(source[i]=='\n') {
            var containerReg = new RegExp(containerCtn, 'gi'),
                routerReg = new RegExp(routerCtn, 'gi');
            // remove containerCtn or routerCtn once
            if(!containerReg.test(line) && !routerReg.test(line)){
                content = content + line;
            }
            line = "";
        }
    }
    // remove anyway `/view/pages/Index.jsx`
    Utils.writeFile(exPath, content);
    if(isMultiApp){
        indexHtmlCtn = indexHtmlCtn.replace('index.js', 'bundle.js');
    }else{
        // replace view/index.html `./bundle.js` => `./index.js`
        indexHtmlCtn = indexHtmlCtn.replace('bundle.js', 'index.js');
    }
    Utils.writeFile(indexHtmlPath, indexHtmlCtn);
}