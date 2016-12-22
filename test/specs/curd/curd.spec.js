"use strict";
const expect = require('chai').expect
const sinon = require('sinon')
const pkg = require('../../helpers/package.test.json')
const inquirer = require('inquirer');
const navigate = require('../../../src/navigate')
const Utils = require('../../../src/utils')
const checkEnv = require('../../../src/check-env')
const cli = require('../../../src/init-cli')
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
describe('gfs curd', () => {
    beforeEach( () => {

    })

    it('preValid: should auto set `--template` to react', (done) => {
        const gfs = cli(pkg, ['rm', '--type', 'web', '--name', 'question-list'])
        const gfsOpts = Utils.formatArgs(gfs.flags, gfs.input)
        const prop = checkEnv.preValid(gfsOpts,  function(opts){
            expect(opts.opts.template).to.equal('react')
        })
        prop.ui.rl.emit('line', '');
        /*prop.then((answers) => {
            console.log('answers', answers)
            done()
        })*/
        done()
    })

    it('validCmd: show give tip `--type` not set', (done) => {
        const gfs = cli(pkg, ['rm', '--template', 'react', '--name', 'gfs-test'])
        const gfsOpts = Utils.formatArgs(gfs.flags, gfs.input)
        let isOk = null
        const output = testConsoleStdout.inspectSync(function(){
            isOk = checkEnv.validCmd(gfsOpts)
        })
        // expect(isOk).to.be('boolean')
        expect(isOk).to.equal(false)
        done()
    })

    it('validCmd: show give tip `--name` not set', (done) => {
        const gfs = cli(pkg, ['rm', '--template', 'react', '--type', 'web'])
        const gfsOpts = Utils.formatArgs(gfs.flags, gfs.input)
        let isOk = null
        const output = testConsoleStdout.inspectSync(function(){
            isOk = checkEnv.validCmd(gfsOpts)
        })
        // expect(output[0].indexOf('command not found!')).not.equal(-1)
        expect(isOk).to.be.a('boolean')
        expect(isOk).to.equal(false)
        done()
    })

    it('validCmd: it will be ok `--template`, `--type`, `--name` all set', (done) => {
        const gfs = cli(pkg, ['rm', '--template', 'react', '--type', 'web', '--name', 'gfs-test'])
        const gfsOpts = Utils.formatArgs(gfs.flags, gfs.input)
        let isOk = null
        const output = testConsoleStdout.inspectSync(function(){
            isOk = checkEnv.validCmd(gfsOpts)
        })
        // expect(output[0].indexOf('command not found!')).not.equal(-1)
        expect(isOk).to.be.a('boolean')
        expect(isOk).to.equal(true)
        done()
    })

    it('rm: `containers/web/GfsTest.jsx` should not exit.', (done) => {
        done()
    })

    it('add: `containers/web/GfsTest.jsx` should not exit.', (done) => {
        done()
    })
})
