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
    var addFiles = [];
    _.forEach(_.cloneDeep(conf.webPathMap), function(value, key){
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
                exPath = path.join(conf.BASE_PATH, value.path, 'index.es6'),
                indexContent = '';
            try{
                indexContent = fs.readFileSync(exPath)
            }catch(e){
                console.log('some thing error', e)
            }
            indexContent += ex;
            addFiles.push({
                path: exPath,
                content: indexContent
            })
        }
        addFiles.push({
            path: filePath,
            content: complied(conf)
        })
    });
    // TODO 在 src 下的 index.jsx 中添加相应的注册
    return addFiles
}
/**
 *
 * @param conf
 */
module.exports.addComponent = function addComponent(conf){
    var addFiles = []
    _.forEach(_.cloneDeep(conf.componentPathMap), function(value, key){
        let template = Utils.getTemplate(conf.templateName, key, value, 'component');
        let complied = _.template(template);
        let filePath = path.join( conf.BASE_PATH, value.path, conf.camelName, (value.fileNameType == 'normal' ? conf.name : conf[value.fileNameType+'Name'])+'.'+value.extension);

        addFiles.push({
            path: filePath,
            content: complied(conf)
        })
    });
    return addFiles
}