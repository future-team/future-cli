const reactConf = require('./react')
const angularConf = require('./angular')
const jqueryConf = require('./jquery')
const moduleConf = require('./module')
module.exports = {
    reactConf: reactConf.reactConf,
    angularConf: angularConf.angularConf,
    jqueryConf: jqueryConf.jqueryConf,
    moduleConf: moduleConf.moduleConf,
    getConf: function(type){
        return type
    }
}