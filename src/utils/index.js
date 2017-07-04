"use strict";
var path = require('path')
var fs = require('fs')
var fsExtra = require('fs-extra')
var chalk = require('chalk')
var _ = require('lodash')
var gitUser = require('../git-user')()
var configs = require('../config')

/**
 * get file template
 * @param template module template name that should be defined in `config`
 * @param name file name
 * @param opts file options
 * @param type file type such as `web` or `component`
 * @return {*}
 */
module.exports.getTemplate = function getTemplate(template, name, opts, type) {
    // TODO 如何定义文件的命名
    var filePath = path.join(__dirname, '../templates/'+template+'/'+type+'/'+name+'.'+opts.extension+'.template');
    //assert(existsSync(filePath), `getTemplate: file ${name} not fould`);
    var source = fs.readFileSync(filePath, 'utf-8');
    return source;
}

/**
 * read file
 * @param filePath
 * @return {*}
 */
module.exports.readFile = function readFile(filePath) {
    return fs.readFileSync(filePath, 'utf-8');
}

/**
 * write file
 * @param filePath
 * @param source
 */
module.exports.writeFile = function writeFile(filePath, source) {
    fsExtra.outputFileSync(filePath, source, 'utf-8');
}

/**
 * delete file
 * @param filePath
 */
module.exports.removeFile = function removeFile(filePath) {
    fsExtra.removeSync(filePath);
}

/**
 * get file tree
 * @param dirPath
 * @return {*}
 */
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

/**
 *
 * @param msgs
 * @param color
 * @param isExit
 */
module.exports.logMsg = function logMsg(msgs, color, isExit) {
    var isExit = isExit ? isExit : false
    console.log(chalk[color || 'white'](msgs[0]))
    isExit && process.exit(1)
}

/**
 *
 * @param flags
 * @param input
 * @return {{opts: *, args: *}}
 */
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

/**
 * check type
 */
module.exports.checkType = function checkType(obj, type) {
    return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase() === type;
}

/**
 * output log
 * @param level
 * @param content
 */
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

/**
 * format inputs to conf
 * uppercase or lowercase
 * @param inputs
 * @return {Object}
 */
module.exports.generateConf = function generateConf(inputs) {
    var opts = inputs.opts;
    var template = opts['template'];
    var type = opts['type'] || 'web';
    var name = opts['name'] || '';
    // need to compose with template
    // --template react-dm --type web -> REACT_DM_WEB
    var moduleType = (template + '-' + type).split('-').map(function(item){return _.lowerCase(item)}).join('_');
    var targetPath = opts['path'];
    var upperCaseName  = name.split('-').map(function(item){return _.upperFirst(item)}).join('');
    var camelName = _.camelCase(name);
    var templateConf = configs[_.camelCase(template)+'Conf'];
    var lowerCaseName = name.split('-').map(function(item){return _.lowerCase(item)}).join('');
    // Attention when `moduleType` type is `REACT_DM_WEB`
    // check `config/base.config.js` the `root` config
    // if this point to a directory, this should a multi page app, then should generate `view/pages/<name>.jsx`, `view/<name>.html`
    // if this point to a file, this should a single page app, then should add route to `view/pages/Index.jsx` file.
    // when remove file, RT.
    if(moduleType === 'react_dm_web'){
        var isMultiApp = true;
        try{
            var projectConf = require(path.join(process.cwd(), '/system/config/base.config.js'));
            isMultiApp = !fs.lstatSync(path.join(process.cwd(), projectConf.root || '')).isDirectory();
        }catch (e){
            console.error('get config file error!', e)
        }
        templateConf.isMultiApp = isMultiApp;
    }
    console.log(isMultiApp);
    var writeConf = _.extend({
        gitUser: gitUser,
        name: name,
        upperName: upperCaseName,
        lowerName: lowerCaseName,
        camelName: camelName,
        moduleType: moduleType
    }, templateConf);

    // targetPath && (writeConf.BASE_PATH = targetPath);
    return writeConf;
}