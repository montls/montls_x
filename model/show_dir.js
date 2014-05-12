var config = require('../config');
var mg = require("mongoose");
var mg_ins1 = require("./wrapMg").mg_ins1;

module.exports = function(req,res,callback){
    mg_ins1.getDirList({},function(err,results){
        if(err) callback(err);
        callback(err,results);
    });
}