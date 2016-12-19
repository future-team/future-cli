/**
 * Future normal test
 */
var expect = require('chai').expect
var sinon = require('sinon')
var _ = require('lodash')
var pkg = require('../../package.json')
var navigate = require('../../src/navigate')
describe('gfs', function () {
    var log = [];
    /*console.log = function() {
        log.push([].slice.call(arguments));
    };*/
    beforeEach(function () {
        // gfs
        this.pkg = pkg
        this.gens = ['rm', '--type', 'web', '--name', 'question-list' ]
        this.gfs = require('../../src/init-cli')(pkg, this.gens)
    })

    it( 'should show help list', function () {
        //navigate(this.gfs)
        // process.stdout.write(log.join('\n'), '\n');
        // process.stdout.write(this.gfs.showHelp(), '\n');
        // expect(log.join('\n')).to.equal(this.gfs.showHelp())
    })
});
