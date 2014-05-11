var config = require('../config');
var mg = require("mongoose");
var mg_ins1 = require("./wrapMg").mg_ins1;

module.exports = function(req,res,callback){
    mg_ins1.getList({},function(err,results){
        if(err) callback(err);
        results.forEach(function(elem){
            mg_ins1.findCollection(elem.metaList,{},function(err,docs){
                docs.forEach(function(elem){
                    res.send(elem.fileMate.fileName);
                });
            });
        });
    });
}