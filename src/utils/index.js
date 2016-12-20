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

module.exports.logMsg = function logMsg(msgs, color, isExit) {
    var isExit = isExit ? isExit : false
    console.log(chalk[color || 'white'](msgs[0]))
    isExit && process.exit(1)
}

module.exports.formatArgs = function formatArgs(flags, input) {
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
module.exports.checkType = function checkType(obj, type) {
    return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase() === type;
},
module.exports.logging = function(level, content){
    var levelColorMap = {
            error: 'warn',
            warn: 'red',
            info: 'cyan',
            debug: 'magenta'
        },
        level = level ? level : 'info',
        msg = "";
    try {
        msg = content
    }catch(e){
        console.error(chalk.red('the log content is not valid'))
    }
    if(level === 'info'){
        process.stdout.write(msg);
        process.stdout.write('\n');
    }else{
        process.stdout.write(chalk.bold[levelColorMap[level]](msg));
        process.stdout.write('\n');
    }

}