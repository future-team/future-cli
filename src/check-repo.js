/**
 * Created by genffy on 2016/11/1.
 *
 * 检查repo https://github.com/future-team/generator-future-static
 * 1. 是否在本地
 * 2. 是否需要更新
 * 返回 app/templates 下的目录列表 & 对应的 package.json 的模版信息
 * 
 */
'use strict';
var path = require('path');
var fs = require('fs');
var os = require('os');
var _ = require('lodash');
var globby = require('globby');
var ora = require('ora');
var untildify = require('untildify');
var escapeStrRe = require('escape-string-regexp');
var download = require('download-git-repo');
var gitclone = require('git-clone');
var uid = require('uid');
var rm = require('rimraf').sync;
var childProcess = require('child_process');

var REPO_NAME = 'generator-future-static';
var win32 = process.platform === 'win32';
var MAX_LOOP = 5;
function getDirectories(srcpath) {
    return fs.readdirSync(srcpath).filter(function(file) {
        return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
}
var CheckRepo = module.exports = function CheckRepo() {
    var npmRoot;
    this.templates = [];
    // this.lookups = ['.', 'generators', 'lib/generators'];
    try {
        npmRoot = childProcess.execSync('npm root -g');
    } catch (e) {}
    this.npmRoot = npmRoot && npmRoot.toString().trim() || '';
    this.maxLoop = 1;
};

CheckRepo.prototype.lookup = function (cb) {
    var generatorsModules = this.findGeneratorsIn(this.getNpmPaths());
    var templates = {};
    var self = this.lookup;
    var that = this;
    if(this.maxLoop > MAX_LOOP){
        console.error("lookup overflow max size, please try later again.");
        process.exit(1);
    }
    this.maxLoop++;
    generatorsModules.forEach(function (modulePath) {
        var _sep = modulePath.split(path.sep);
        if(_.isArray(_sep)){
            templates[_sep[_sep.length-1]] = modulePath;
        }
    });

    if(!templates[REPO_NAME]){
        // 递归
        this.cloneRepo(function(){
            self.call(that, cb);
        });
    }else{
        // get
        try{
            var temps = getDirectories(path.join(templates[REPO_NAME], 'app/templates'));
            temps.forEach(function(item){
                var obj = {
                    name: item,
                    path: path.join(templates[REPO_NAME], 'app/templates', item),
                    base: path.join(templates[REPO_NAME], 'app/')
                };
                that.templates.push(obj);
            });
        }catch(e){
            console.error('get templates name error ', e.message);
            process.exit(1);
        }
        !!_.isFunction(cb) && cb();
    }
};
/**
 * clone or pull repo
 * @param cb
 */
CheckRepo.prototype.cloneRepo = function(cb){
    var targetPath = this.npmRoot + '/generator-future-static';
    var repo = 'https://github.com/future-team/generator-future-static.git';
    var spinner = null;
    // TODO check permissions
    /*fs.access(tmp, fs.W_OK, function(err) {
        if(err){
            console.error("can't write, you should use `sudo` before commander");
            process.exit(1);
        }
        console.log("can write");
    });*/
    var args = [], processer = null;
    if(fs.existsSync(targetPath)){
        spinner = ora('update template ');
        spinner.start();
        args.push('-C');
        args.push(targetPath);
        args.push('pull');
        console.log('new directory'+process.cwd());
        processer = childProcess.spawn('git', args);
    }else{
        spinner = ora('downloading template ');
        spinner.start();
        args.push('clone');
        args.push('--');
        args.push(repo);
        args.push(targetPath);
        processer = childProcess.spawn('git', args);
    }
    processer.on('close', function(data) {
        spinner.stop();
        if (data == 0) {
            //npm --prefix ./some_project install ./some_project
            childProcess.spawn('npm', ['--prefix', targetPath, 'install', targetPath], {stdio: 'inherit'})
                .on('error', function (err) {
                    console.error('npm install :err', 'install', targetPath);
                    throw err;
                })
                .on('close', function () {
                    !!_.isFunction(cb) && cb();
                });
        } else {
            console.error("git " + args.join(' ') + " failed with status " + data) ;
            process.exit(1);
        }
    });
    processer.on('exit', function(data) {
        console.log('exit ',data)
    });
};

/**
 * Search npm for every available generators.
 * Generators are npm packages who's name start with `generator-` and who're placed in the
 * top level `node_module` path. They can be installed globally or locally.
 *
 * @param {Array}  List of search paths
 * @return {Array} List of the generator modules path
 */

CheckRepo.prototype.findGeneratorsIn = function (searchPaths) {
    var modules = [];

    searchPaths.forEach(function (root) {
        if (!root) {
            return;
        }

        modules = globby.sync([
            'generator-*',
            '@*/generator-*'
        ], { cwd: root }).map(function (match) {
            return path.join(root, match);
        }).concat(modules);
    });

    return modules;
};

/**
 * Get the npm lookup directories (`node_modules/`)
 * @return {Array} lookup paths
 */
CheckRepo.prototype.getNpmPaths = function () {
    var paths = [];

    // Add NVM prefix directory
    if (process.env.NVM_PATH) {
        paths.push(path.join(path.dirname(process.env.NVM_PATH), 'node_modules'));
    }

    // Adding global npm directories
    // We tried using npm to get the global modules path, but it haven't work out
    // because of bugs in the parseable implementation of `ls` command and mostly
    // performance issues. So, we go with our best bet for now.
    if (process.env.NODE_PATH) {
        paths = _.compact(process.env.NODE_PATH.split(path.delimiter)).concat(paths);
    }

    // global node_modules should be 4 or 2 directory up this one (most of the time)
    paths.push(path.join(__dirname, '../../../..'));
    paths.push(path.join(__dirname, '../..'));

    // adds support for generator resolving when yeoman-generator has been linked
    if (process.argv[1]) {
        paths.push(path.join(path.dirname(process.argv[1]), '../..'));
    }

    // Default paths for each system
    if (win32) {
        paths.push(path.join(process.env.APPDATA, 'npm/node_modules'));
    } else {
        paths.push('/usr/lib/node_modules');
        paths.push('/usr/local/lib/node_modules');
    }

    // Walk up the CWD and add `node_modules/` folder lookup on each level
    process.cwd().split(path.sep).forEach(function (part, i, parts) {
        var lookup = path.join.apply(path, parts.slice(0, i + 1).concat(['node_modules']));

        if (!win32) {
            lookup = '/' + lookup;
        }

        paths.push(lookup);
    });
    return paths.reverse();
};

// init
CheckRepo.init = function(){
    return new CheckRepo();
};