'use strict'
var meow = require('meow')
function Cli(pkg, argv) {
    var helpStr = 'Usage: gfs COMMAND [options]\n'+
        '  $ gfs add --template react --type web --name question-detail\n'+
        '  $ gfs rm --template react --type component --name question-detail\n'+
        'Options\n'+
        '  --template  project template, default is [react]\n'+
        '  --type      module type [web|component]\n'+
        '  --name      module name\n'+
        'Examples\n'+
        '  $ gfs add --template react --type web --name question-detail\n'+
        '  $ gfs add --template react --type component --name ask\n'+
        '  $ gfs rm --template react --type component --name ask\n'+
        '  $ gfs rm --template react --type web --name question-detail\n';

    return meow({help: helpStr, pkg: pkg, argv: argv })
}
module.exports = Cli
