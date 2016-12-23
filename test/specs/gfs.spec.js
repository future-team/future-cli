"use strict";
const expect = require('chai').expect
const sinon = require('sinon')
const Stream = require('stream')
const _ = require('lodash')
const pkg = require('../mockProjectDirectory/package.test.json')
const autosubmit = require('../helpers/events').autosubmit;
const inquirer = require('inquirer');
const navigate = require('../../src/navigate')
const cli = require('../../src/init-cli')
const testConsoleStdout = require("test-console").stdout;
function monkeyPatchInquirer (answers) {
    inquirer.prompt = (questions) => {
        return new Promise((resolve, reject) => {
            const key = questions[0].name
            const _answers = {}
            const validate = questions[0].validate
            const valid = validate(answers[key])
            if (valid !== true) {
                reject(valid)
            }
            _answers[key] = answers[key]
            resolve(_answers)
        })
    }
}
describe('gfs', () => {
    beforeEach( () => {

    })

    it('should show help list', () => {
        const gfs = cli(pkg, [])
        // mock `showHelp` easy to test
        gfs.showHelp = function(){
            return -1;
        }
        expect(navigate(gfs)).to.equal(gfs.showHelp())
    })

    it('should give tip `command not found`, then show help list', (done) => {
        const gfs = cli(pkg, ['notFound'])
        let prop = null
        const output1 = testConsoleStdout.inspectSync(function(){
            prop = navigate(gfs)
        })
        expect(output1[0].indexOf('command not found!')).not.equal(-1)
        // TODO how to avoid output in terminal
        prop.ui.rl.input.emit('keypress', '', {name: 'down'});
        prop.ui.rl.input.emit('keypress', '', {name: 'down'});
        /*prop.ui.rl.output.on('data', (data)=>{
            // console.log('output', 'asd')
            return false
        })*/
        console.log('prop.ui.process.stdout', prop.ui.process.stdout)
        const output2 = testConsoleStdout.inspectSync(function(){
            prop.ui.rl.emit('line');
        })
        /*prop.ui.process.stdout.on('message', (data)=>{
            console.log('prop.ui.process', data)
        })*/
        prop.then((answers) => {
            const whereTo = answers.whereTo
            expect(whereTo).to.equal('exit')
            done()
        })
    })
});
