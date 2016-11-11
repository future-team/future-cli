#!/usr/bin/env node
'use strict';
console.log('hello GFS-cli\n');
var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var updateNotifier = require('update-notifier');
var Insight = require('insight');
var stringLength = require('string-length');
var rootCheck = require('root-check');
var meow = require('meow');
var list = require('cli-list');
var pkg = require('../package.json');
var Router = require('../src/router');
var gens = list(process.argv.slice(2));
var yaml = require('js-yaml');

var cli = gens.map(function (gen) {
    var minicli = meow({ help: false, pkg: pkg, argv: gen });
    var opts = minicli.flags;
    var args = minicli.input;
    // add un-camelized options too, for legacy
    // TODO: remove some time in the future when generators have upgraded
    Object.keys(opts).forEach(function (key) {
        var legacyKey = key.replace(/[A-Z]/g, function (m) {
            return '-' + m.toLowerCase();
        });
        opts[legacyKey] = opts[key];
    });

    return { opts: opts, args: args };
});

var firstCmd = cli[0] || { opts: {}, args: {} };
var cmd = firstCmd.args[0];
var router = new Router();

// regist route
router.registerRoute('add', require('../src/add'));
router.registerRoute('dev', require('../src/commands/dev'));
router.registerRoute('help', require('../src/commands/help'));
router.registerRoute('init', require('../src/commands/init'));
router.registerRoute('remove', require('../src/commands/remove'));
router.registerRoute('serve', require('../src/commands/serve'));
router.registerRoute('default', require('../src/commands/default'));
process.once('exit', function(){
    console.log('process exit...')
});

if(!cmd){
    router.navigate('help');
}else{

    // check config file or create it
    // .gfs.yml
    router.navigate(cmd, firstCmd);
}