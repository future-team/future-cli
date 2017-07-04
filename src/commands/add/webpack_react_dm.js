"use strict";
var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var Utils = require('../../utils');
/**
 *
 * @param conf
 */
module.exports.addWeb = function addWeb(conf){
    var addFiles = [],
        isMultiApp = conf.isMultiApp;
    _.forEach(_.cloneDeep(conf.webPathMap), function(value, key){
        let template = Utils.getTemplate(conf.templateName, key, value, 'web');
        let complied = _.template(template);
        // have a sub directory
        if(key == 'components'){
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
        // TODO check repeat!
        if(key == 'html' && isMultiApp){
            // not write `html` file
        }else{
            addFiles.push({
                path: filePath,
                content: complied(conf)
            })
        }
    });
    var indexHtmlPath = path.join(conf.BASE_PATH, 'view/index.html'),
        indexHtmlCtn = Utils.readFile(indexHtmlPath);
    // need to rewrite `/view/pages/Index.jsx`
    // replace view/index.html `./index.js` => `./bundle.js`
    if(isMultiApp){
        // 1. append `import ${conf.upperName}Container from './${conf.upperName}'` to top
        // 2. append `<Route path="/${conf.camelName}" component={${conf.upperName}Container} />` to `Router`
        var exPath = path.join(conf.BASE_PATH, 'view/pages', 'Index.jsx'),
            source = Utils.readFile(exPath)||'' + '\n',
            line	= "",
            content	= "",
            containerCtn = 'import '+conf.upperName+'Container from \'./'+conf.upperName+'\'\n',
            routerCtn = '<Route path="/'+conf.camelName+'" component={'+conf.upperName+'Container} />\n',
            importCount = 0;
        for(var i=0; i<source.length; i++) {
            line = line + source[i];
            if(source[i]=='\n') {
                var containerReg = /import\s.*\sfrom\s.*/gi,
                    routerReg = /<Router\s.*>/gi;
                content = content + line;
                // add containerCtn once
                if(containerReg.test(line) && importCount == 0){
                    importCount = 1;
                    content = content + containerCtn;
                    console.log(containerCtn);
                }
                // add routerCtn once
                if(routerReg.test(line)){
                    content = content + routerCtn;
                    console.log(routerCtn);
                }
                line = "";
            }
        }
        // `/view/pages/Index.jsx`
        addFiles.push({
            path: exPath,
            content: content
        });
        //
        indexHtmlCtn = indexHtmlCtn.replace('index.js', 'bundle.js');
    }else{
        // replace view/index.html `./bundle.js` => `./index.js`
        indexHtmlCtn = indexHtmlCtn.replace('bundle.js', 'index.js');
    }
    addFiles.push({
        path: indexHtmlPath,
        content: indexHtmlCtn
    });
    return addFiles
}