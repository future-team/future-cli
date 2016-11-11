/**
 * Created by genffy on 2016/11/1.
 */
"use strict";
var ckRepo = require('../src/check-repo').init();
ckRepo.lookup(function(){
    console.log(ckRepo.templates);
});