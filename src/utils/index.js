/**
 * Created by genffy on 2016/11/10.
 */
var path = require('path')
var fs = require('fs')
var fsExtra = require('fs-extra')

module.exports.getTemplate = function getTemplate(name, opts, type) {
    // TODO 如何定义文件的命名
    const filePath = path.join(__dirname, `../templates/webpack_react_redux_cortex/${type}/${name}.${opts.extension}.template`);
    //assert(existsSync(filePath), `getTemplate: file ${name} not fould`);
    const source = fs.readFileSync(filePath, 'utf-8');
    return source;
}

module.exports.readFile = function readFile(filePath) {
    return fs.readFileSync(filePath, 'utf-8');
}

module.exports.writeFile = function writeFile(filePath, source) {
    fsExtra.outputFileSync(filePath, source, 'utf-8');
}

module.exports.removeFile = function removeFile(filePath) {
    fsExtra.removeSync(filePath);
}
