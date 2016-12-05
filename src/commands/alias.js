"use strict"
/**
 * read `package.json` file `scripts`, alias it
 * @param args
 */
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const spawn = require('child_process').spawn
module.exports = function (opts) {
    try{
        let cmd = opts.args[0]
        let commander = spawn(`npm`, ['run', cmd])
        commander.stdout.on('data', (data) => {
            console.log(`${data}`);
        });

        commander.stderr.on('data', (data) => {
            console.error(`run command ${chalk.blue('npm run '+ cmd)} error : ${data}`);
        });

        commander.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });
    }catch(e){
        console.error(`Can't found package.json file in your project folder! Please check it`, e)
    }
}