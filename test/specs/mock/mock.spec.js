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
const gfsMock = require('../../../src/commands/mock')
const testConsoleStdout = require("test-console").stdout;
const MOCK_PROJECT_DIRECTORY = path.join(process.cwd(), '/test/mockProjectDirectory')

// clear MOCK_PROJECT_DIRECTORY file
fs.remove(path.join(MOCK_PROJECT_DIRECTORY, 'src'), (err) => {
    if (err) return console.error(err)
    //console.log('success!')
})
describe('gfs mock', () => {
    beforeEach( () => {

    })
    it('`gfs mock /path/to/server/get/data`: `html/mocks/path/to/server/get/data.json` should exist.', (done) => {
        const gfs = cli(pkg, ['mock', '--template', 'react-dm', '--type', 'web', '--path', '/path/to/server/get/data', MOCK_PROJECT_DIRECTORY])
        const gfsOpts = Utils.formatArgs(gfs.flags, gfs.input)
        let filePath = ''
        const output = testConsoleStdout.inspectSync(function(){
            filePath = gfsMock(gfsOpts)
        })
        filePath = path.relative(MOCK_PROJECT_DIRECTORY, filePath)
        expect(filePath=='src/view/mocks/path/to/server/get/data.json').not.equal(-1)
        const isTrue = fs.existsSync(path.join(MOCK_PROJECT_DIRECTORY, 'src/view/mocks/path/to/server/get/data.json'))
        expect(isTrue).to.be.a('boolean')
        expect(isTrue).to.equal(true)
        done()
    })
    it('`repeat mock /path/to/server/get/data`: should give a prompt.', (done) => {
        const gfs = cli(pkg, ['mock', '--template', 'react-dm', '--type', 'web', '--path', '/path/to/server/get/data', MOCK_PROJECT_DIRECTORY])
        const gfsOpts = Utils.formatArgs(gfs.flags, gfs.input)
        let addPrompt = null
        const output = testConsoleStdout.inspectSync(function(){
            addPrompt = gfsMock(gfsOpts)
        })
        addPrompt.ui.rl.emit('line', 'Y');
        addPrompt.then((answer)=>{
            expect(answer.confirmAdd).to.be.a('boolean')
            expect(answer.confirmAdd).to.equal(true)
            done()
        })
    })

    it('`not module type mock /path/to/server/get/data`: use `/mocks/` default path.', (done) => {
        const gfs = cli(pkg, ['mock', '--path', '/path/to/server/get/data', MOCK_PROJECT_DIRECTORY])
        const gfsOpts = Utils.formatArgs(gfs.flags, gfs.input)
        let filePath = ''
        const output = testConsoleStdout.inspectSync(function(){
            filePath = gfsMock(gfsOpts)
        })
        filePath = path.relative(MOCK_PROJECT_DIRECTORY, filePath)
        expect(filePath=='mocks/path/to/server/get/data.json').not.equal(-1)
        const isTrue = fs.existsSync(path.join(MOCK_PROJECT_DIRECTORY, 'mocks/path/to/server/get/data.json'))
        expect(isTrue).to.be.a('boolean')
        expect(isTrue).to.equal(true)
        done()
    })
})