var fs = require('fs');
var config = require('../config');
var mg_ins1 = require('./wrapMg').mg_ins1;

module.exports = function(req,res,callback){
    var id = req.query.fileId;
    mg_ins1.findMetaByFileId(id,function(err,docs){
        if(err) callback(err);
        var _meta = docs[0];
        _meta.data.ids = "...";
        callback(null,JSON.stringify(_meta));
    });
}