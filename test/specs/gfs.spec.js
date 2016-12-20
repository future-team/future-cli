"use strict";
const expect = require('chai').expect
const sinon = require('sinon')
const _ = require('lodash')
const pkg = require('../helpers/package.test.json')
const navigate = require('../../src/navigate')
const cli = require('../../src/init-cli')
const testConsoleStdout = require("test-console").stdout;
describe('gfs', function () {
    beforeEach(function () {
        // gfs
        this.gens = ['rm', '--template', 'react', '--type', 'web', '--name', 'question-list']
    })

    it('should show help list', function () {
        const gfs = cli(pkg, [])
        // mock `showHelp` easy to test
        gfs.showHelp = function(){
            return -1;
        }
        expect(navigate(gfs)).to.equal(gfs.showHelp())
    })

    it('should give tip `command not found`, then show help list', function(){
        const gfs = cli(pkg, ['notFound'])
        var output = testConsoleStdout.inspectSync(function(){
            navigate(gfs)
        })
        expect(output[0].indexOf('command not found!')).not.equal(-1)
    })

    it('should give promt to confirm default `--template` option `react` ', function(){
        const gfs = cli(pkg, ['rm', '--type', 'web', '--name', 'question-list'])

    })

    it('should give tip `command not found`, then show help list', function(){
        const gfs = cli(pkg, ['rm', '--template', 'react', '--type', 'web', '--name', 'question-list'])

    })

    it('should give tip `command not found`, then show help list', function(){
        const gfs = cli(pkg, ['notFound'])

    })

});
