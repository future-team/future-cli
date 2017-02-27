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
    var addFiles = []
    _.forEach(_.cloneDeep(conf.webPathMap), function(value, key){
        let template = Utils.getTemplate(conf.templateName, key, value, 'web');
        let complied = _.template(template);
        // have a sub directory
        if(key == 'component'){
            value.path += '/'+conf.camelName;
        }
        let filePath = path.join(conf.BASE_PATH, value.path, (value.fileNameType == 'normal' ? conf.name : conf[value.fileNameType+'Name'])+'.'+value.extension);
        console.log(template)
        // Attention!
        // check `config/base.config.js` the `root` config
        // if this point to a directory, this should a multi page app, then should generate `view/pages/<name>.jsx`, `view/<name>.html`
        // if this point to a file, this should a single page app, then should add route to `view/pages/Index.jsx` file.

        // TODO check repeat!

        addFiles.push({
            path: filePath,
            content: complied(conf)
        })
    });
    // TODO 在 src 下的 index.jsx 中添加相应的注册
    return addFiles
}