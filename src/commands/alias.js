/**
 * read `package.json` file `scripts`, alias it
 * @param args
 */
"use strict"
var fs = require('fs')
var path = require('path')
var chalk = require('chalk')
var spawn = require('child_process').spawn
module.exports = function (opts) {
    try{
        var cmd = opts.args[0]
        var commander = spawn('npm', ['run', cmd])
        commander.stdout.on('data', function(data){
            console.log(''+data);
        });
        commander.stderr.on('data', function(data){
            console.error('run command '+chalk.blue('npm run '+ cmd)+' error : '+ data);
        });
        commander.on('close', function(code){
            console.log('child process exited with code '+code);
        });
    }catch(e){
        console.error('Can\'t found package.json file in your project folder! Please check it', e)
    }
}