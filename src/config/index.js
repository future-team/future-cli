var reactConf = require('./react')
var angularConf = require('./angular')
var jqueryConf = require('./jquery')
var moduleConf = require('./module')
module.exports = {
    reactConf: reactConf.reactConf,
    angularConf: angularConf.angularConf,
    jqueryConf: jqueryConf.jqueryConf,
    moduleConf: moduleConf.moduleConf,
    getConf: function(type){
        return type
    }
}