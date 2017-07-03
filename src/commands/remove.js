"use strict";
var _ = require('lodash');
var Utils = require('../utils');
var path = require('path');
var fs = require('fs');
var chalk = require('chalk');
var inquirer = require('inquirer');
var reactRedux = require('./remove/webpack_react_redux_cortex');
var reactDm = require('./remove/webpack_react_dm');

function Remove(inputs){
    var writeConf = Utils.generateConf(inputs);
    // ask confirm
    var prompt = inquirer.prompt([{
        name: 'confirmRemove',
        type: 'confirm',
        message: chalk.red('Do you confirm to remove '+ chalk.yellow(writeConf.name + ' '+ writeConf.moduleType) + ' module ')
    }]);
    prompt.then(function (answers) {
        // Use user feedback for... whatever!!
        if(answers.confirmRemove === true){
            switch (writeConf.moduleType){
                case 'react_redux_web':
                    reactRedux.removeWeb(writeConf);
                    break;
                case 'react_redux_component':
                    reactRedux.removeComponent(writeConf);
                    break;
                case 'react_dm_web':
                    reactDm.removeWeb(writeConf);
                    break;
                default:
                    // 参数错误
                    break;
            }
        }
    });
    return prompt;
}
module.exports = Remove;