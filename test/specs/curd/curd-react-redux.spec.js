"use strict";
const expect = require('chai').expect
const sinon = require('sinon')
const path = require('path')
const fs = require('fs-extra')
const _ = require('lodash')
const pkg = require('../../mockProjectDirectory/package.test.json')
const inquirer = require('inquirer');
const navigate = require('../../../src/navigate')
const Utils = require('../../../src/utils')
const checkEnv = require('../../../src/check-env')
const cli = require('../../../src/init-cli')
const gfsAdd = require('../../../src/commands/add')
const gfsRemove = require('../../../src/commands/remove')
const testConsoleStdout = require("test-console").stdout;
const MOCK_PROJECT_DIRECTORY = path.join(process.cwd(), '/test/mockProjectDirectory')

// clear MOCK_PROJECT_DIRECTORY file
_.forEach(['actions', 'containers', 'entries', 'html', 'less', 'reducers'], (value)=>{
    fs.remove(path.join(MOCK_PROJECT_DIRECTORY, value), (err) => {
        if (err) return console.error(err)
        //console.log('success!')
    })
})
describe('gfs react-redux curd', () => {
    beforeEach( () => {

    })

    it('validCmd: show give tip `--type` not set', (done) => {
        const gfs = cli(pkg, ['rm', '--template', 'react-redux', '--name', 'gfs-test'])
        const gfsOpts = Utils.formatArgs(gfs.flags, gfs.input)
        let isOk = null
        const output = testConsoleStdout.inspectSync(function(){
            isOk = checkEnv.validCmd(gfsOpts)
        })
        expect(isOk).to.be.a('boolean')
        expect(isOk).to.equal(false)
        done()
    })

    it('validCmd: show give tip `--name` not set', (done) => {
        const gfs = cli(pkg, ['rm', '--template', 'react-redux', '--type', 'web'])
        const gfsOpts = Utils.formatArgs(gfs.flags, gfs.input)
        let isOk = null
        const output = testConsoleStdout.inspectSync(function(){
            isOk = checkEnv.validCmd(gfsOpts)
        })
        expect(isOk).to.be.a('boolean')
        expect(isOk).to.equal(false)
        done()
    })

    it('validCmd: it will be ok `--template`, `--type`, `--name` all set', (done) => {
        const gfs = cli(pkg, ['rm', '--template', 'react-redux', '--type', 'web', '--name', 'gfs-test'])
        const gfsOpts = Utils.formatArgs(gfs.flags, gfs.input)
        let isOk = null
        const output = testConsoleStdout.inspectSync(function(){
            isOk = checkEnv.validCmd(gfsOpts)
        })
        expect(isOk).to.be.a('boolean')
        expect(isOk).to.equal(true)
        done()
    })

    it('if not add then rm: `containers/web/GfsTest.jsx` file should not exist.', (done) => {
        const isTrue = fs.existsSync(path.join(MOCK_PROJECT_DIRECTORY, 'containers/web/GfsTest.jsx'))
        expect(isTrue).to.be.a('boolean')
        expect(isTrue).to.equal(false)
        done()
    })

    // add web
    it('`first add --template react-redux --type web --name gfs-test`: `containers/web/GfsTest.jsx` should exist.', (done) => {
        const gfs = cli(pkg, ['add', '--template', 'react-redux', '--type', 'web', '--name', 'gfs-test', '--path', MOCK_PROJECT_DIRECTORY])
        const gfsOpts = Utils.formatArgs(gfs.flags, gfs.input)
        let addFiles = []
        const output = testConsoleStdout.inspectSync(function(){
            addFiles = gfsAdd(gfsOpts)
        })
        addFiles = addFiles.map((item)=>{
            return path.relative(MOCK_PROJECT_DIRECTORY, item.path)
        })
        expect(addFiles.indexOf('containers/web/GfsTest.jsx')).not.equal(-1)
        const isTrue = fs.existsSync(path.join(MOCK_PROJECT_DIRECTORY, 'containers/web/GfsTest.jsx'))
        expect(isTrue).to.be.a('boolean')
        expect(isTrue).to.equal(true)
        done()
    })

    it('`repeat add --template react-redux --type web --name gfs-test`: should give a prompt.', (done) => {
        const gfs = cli(pkg, ['add', '--template', 'react-redux', '--type', 'web', '--name', 'gfs-test', '--path', MOCK_PROJECT_DIRECTORY])
        const gfsOpts = Utils.formatArgs(gfs.flags, gfs.input)
        let addPrompt = null
        const output = testConsoleStdout.inspectSync(function(){
            addPrompt = gfsAdd(gfsOpts)
        })
        addPrompt.ui.rl.emit('line', 'Y');
        addPrompt.then((answer)=>{
            expect(answer.confirmAdd).to.be.a('boolean')
            expect(answer.confirmAdd).to.equal(true)
            done()
        })
    })
    // remove
    it('`rm --template react-redux --type web --name gfs-test`: `containers/web/GfsTest.jsx` should not exist.', (done) => {
        const gfs = cli(pkg, ['rm', '--template', 'react-redux', '--type', 'web', '--name', 'gfs-test', '--path', MOCK_PROJECT_DIRECTORY])
        const gfsOpts = Utils.formatArgs(gfs.flags, gfs.input)
        let rmPrompt = null
        const output = testConsoleStdout.inspectSync(function(){
            rmPrompt = gfsRemove(gfsOpts)
        })
        rmPrompt.ui.rl.emit('line', 'Y');
        rmPrompt.then((answer)=>{
            expect(answer.confirmRemove).to.be.a('boolean')
            expect(answer.confirmRemove).to.equal(true)
            const isTrue = fs.existsSync(path.join(MOCK_PROJECT_DIRECTORY, 'containers/web/GfsTest.jsx'))
            expect(isTrue).to.be.a('boolean')
            expect(isTrue).to.equal(false)
            done()
        })
    })
})
