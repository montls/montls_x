var config = require('../config');
var fs = require('fs');
var mg_ins1 = require('./wrapMg').mg_ins1;

module.exports = function(req,res,callback){
    var id = req.query.fileId;
    mg_ins1.removeMetaAndDataById(id,function(err,docs){
        if(err) callback(err)
        var _file_path = docs[0].filePath;
        fs.unlink(config.rootPath+_file_path,function(err){
            if(err) callback(err)
        })
    });
};