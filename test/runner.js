'use strict'
var Mocha = require('mocha');
var glob = require('glob');
var path = require('path');
var specFiles = glob.sync(__dirname + '/**/*.spec.*');
var mocha = new Mocha({ timeout: 5000, reporter: 'spec' });
specFiles.forEach(mocha.addFile.bind(mocha));
mocha.run(function (failures) {
    process.on('exit', function () {
        // TODO
        // process.exit(failures);
    });
});
