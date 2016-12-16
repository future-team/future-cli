'use strict';
var inquirer = require('inquirer');
var opn = require('opn');
module.exports = function (app) {
    inquirer.prompt([{
        name: 'whereTo',
        type: 'list',
        message: 'Here are a few helpful resources.\n' +
        '\nI will open the link you select in your browser for you\n',
        choices: [{
            name: 'Take me to the documentation',
            value: 'https://github.com/future-team/future-cli#future-cli'
        }, {
            name: 'File an issue on GitHub',
            value: 'https://github.com/future-team/future-cli/issues'
        }, {
            name: 'Exit!',
            value: 'exit'
        }]
    }], function (answer) {
        if (answer.whereTo === 'exit') {
            return;
        }
        opn(answer.whereTo);
    });
};