var config = require('../config');
var mg_ins1 = require('./wrapMg').mg_ins1;
var fs = require('fs');

module.exports = function(req,res,callback){
    var id = req.query.fileId;
    mg_ins1.findMetaByFileId(id,function(err,docs){
        if(err) callback(err);
        mg_ins1.findDataByMeta(docs[0].data.collectionName,function(err,results){
            if(err) callback(err);
            var data_list = {};
            for(var i in results){
                data_list[i] = results[i].data;
            }
            callback(null,JSON.stringify(data_list));
        });
    });
}