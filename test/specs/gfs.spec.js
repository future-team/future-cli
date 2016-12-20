"use strict";
const expect = require('chai').expect
const sinon = require('sinon')
const _ = require('lodash')
const pkg = require('../helpers/package.test.json')
const navigate = require('../../src/navigate')
const cli = require('../../src/init-cli')
describe('gfs', function () {
    beforeEach(function () {
        // gfs
        this.gens = ['rm', '--template', 'react', '--type', 'web', '--name', 'question-list']
    })

    it('should show help list', function () {
        const gfs = cli(pkg, [])
        navigate(gfs)
        // process.stdout.write(log.join('\n'), '\n');
        // process.stdout.write(this.gfs.showHelp(), '\n');
        expect(navigate(gfs)).to.equal(gfs.showHelp())
    })

    it('should give tip `command not found`, then show help list', function(){
        const gfs = cli(pkg, ['notFound'])

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
