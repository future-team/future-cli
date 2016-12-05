const fs = require('fs')
const path = require('path')
module.exports = function checkEnv() {
    "use strict";
    let projectPkg = {}
    try{
        projectPkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8') || '{}')
    }catch(e){
        console.error(`Can't found package.json file in your project folder! Please check it`, e)
        process.exit(1)
    }
    return projectPkg
}