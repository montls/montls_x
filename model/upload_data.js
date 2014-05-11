var fs = require('fs');
var multiparty = require('multiparty');
var path = require('path');

var DataProcess = require("./dataProcess");
var config = require('../config');

module.exports = function(req,res,callback){
    var form = new multiparty.Form({
        uploadDir:'./data/json',
        limit:config.eachFileLimit
    });
    var fileMeta = {};
    form.on('file',function(name,files){
        //如果有文件上传
        if(files && files.originalFilename){
            fileMeta.fileName = files.originalFilename;
            fileMeta.filePath = files.path;
            fileMeta.fileId = files.path.split('/')[2].split('.')[0];
            fileMeta.fileType = path.basename(files.path).split('.')[1]
        }else{
            fs.unlink(config.rootPath + files.path);
            callback("EmptyFile");
        }
    });
    form.on('close',function(){
        //上传格式是否正确
        if(fileMeta.fileType != 'json'){
            fs.unlink(config.rootPath + fileMeta.path);
            callback("NoJSON");
        }
        fs.readFile(config.rootPath+fileMeta.filePath,encoding="utf8",function(err,data_file){
            if(err) callback("UnKnowFile");
            else{
                var _json = JSON.parse(data_file);
                var dp = new DataProcess(fileMeta,_json);
                dp.parseData(function(err){
                    callback(err);
                });
            }
        });
    });
    form.parse(req);
}