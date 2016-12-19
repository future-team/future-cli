"use strict";
var path = require('path')
var fs = require('fs')
var fsExtra = require('fs-extra')
var chalk = require('chalk')
module.exports.getTemplate = function getTemplate(template, name, opts, type) {
    // TODO 如何定义文件的命名
    var filePath = path.join(__dirname, '../templates/'+template+'/'+type+'/'+name+'.'+opts.extension+'.template');
    //assert(existsSync(filePath), `getTemplate: file ${name} not fould`);
    var source = fs.readFileSync(filePath, 'utf-8');
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

module.exports.dirTree = function dirTree(dirPath) {
    var stats = fs.lstatSync(dirPath)
    var baseName = path.basename(dirPath)
    if(['node_modules', 'bower_components'].indexOf(baseName) != -1){
        return false
    }
    let info = {
        path: dirPath,
        name: baseName
    }

    if (stats.isDirectory()) {
        info.type = "folder";
        info.children = fs.readdirSync(dirPath).map(function(child) {
            return dirTree(path.join(dirPath, child));
        });
    } else {
        // Assuming it's a file. In real life it could be a symlink or
        // something else!
        info.type = "file";
    }
    return info;
}

module.exports.logMsg = function(msgs, color, isExit) {
    var isExit = isExit ? isExit : false
    console.log(chalk[color || 'white'](msgs[0]))
    isExit && process.exit(1)
}

module.exports.formatArgs = function(flags, input) {
    var opts = flags;
    var args = input;
    Object.keys(opts).forEach(function (key) {
        var legacyKey = key.replace(/[A-Z]/g, function (m) {
            return '-' + m.toLowerCase();
        });
        opts[legacyKey] = opts[key];
    });
    return { opts: opts, args: args };
}