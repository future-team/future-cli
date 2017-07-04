"use strict";
var _ = require('lodash');
var Utils = require('../utils');
var path = require('path');
var fs = require('fs');
var inquirer = require('inquirer');
var chalk = require('chalk');

var REACT_REDUX_WEB = 'react_redux_web';
var REACT_REDUX_COMPONENT = 'react_redux_component';
var REACT_DM_WEB = 'react_dm_web';
/**
 *
 * @param inputs
 * @varructor
 */
function Mock(inputs){
    var writeConf = Utils.generateConf(inputs),
        filePath = '', 
        type = writeConf.moduleType, 
        mockPath = inputs.opts.url;
    if(type === REACT_REDUX_WEB || type === REACT_DM_WEB) {
      filePath = path.join( writeConf.BASE_PATH, writeConf.webPathMap.mock.path, mockPath+'.json');
    }else{
      filePath = path.join( writeConf.BASE_PATH, '/mocks/', mockPath+'.json');
    }
    var isExist = fs.existsSync(filePath);
    if(isExist){
        var existPath = path.relative(writeConf.BASE_PATH, filePath);
        var prompt = inquirer.prompt([{
            name: 'confirmAdd',
            type: 'confirm',
            message: chalk.red('It seems that some file already exist!\n')+ chalk.blue(existPath) + chalk.green('\nDo you want to force continue?'),
            default: false
        }]);
        prompt.then(function (answer) {
            if(answer && answer.confirmAdd) {
                try {
                  Utils.writeFile(filePath, '{"code": 200, "data": {}}');
                  console.log('Add file '+ chalk.blue(path.relative(writeConf.BASE_PATH, filePath))+ ' done');
                }catch(e) {
                  console.error('Add file '+ chalk.red(path.relative(writeConf.BASE_PATH, filePath))+ ' error');
                }
            }
            return filePath;
        });
        return prompt;
    }else{
        try {
          Utils.writeFile(filePath, '{"code": 200, "data": {}}');
          console.log('Add file '+ chalk.blue(path.relative(writeConf.BASE_PATH, filePath))+ ' done');
        }catch(e) {
          console.error('Add file '+ chalk.red(path.relative(writeConf.BASE_PATH, filePath))+ ' error');
        }
        return filePath;
    }
}
module.exports = Mock;