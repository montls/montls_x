var fs = require('fs');
var multiparty = require('multiparty');
var path = require('path');
var config = require('../config');

module.exports = function(req,res,next){
    if(req.url === '/data_post' && req.method === 'POST'){
        var form = new multiparty.Form({
            uploadDir:'./data/json',
            limit:config.eachFileLimit
        });
        
        //数据配置文件格式(json)
        //fieldName: 前端name
        //fileName: 文件名
        //path: 文件储存地址
        //length: 文件长度
        //othre field: 依据前端POST的数据
        var fileConfig_json = {};
        var _file;
        form.on('file',function(name,files){
            //如果有文件上传
            if(files && files.originalFilename){
                fileConfig_json.fieldName = files.fieldName;
                fileConfig_json.fileName = files.originalFilename;
                fileConfig_json.path = files.path;
                fileConfig_json.length = files.ws.bytesWritten;
            }else{
                _file = files;
            }
        });
            
        form.on('field',function(name,value){
            var tmp;
            var stack = [];
            //如果有POST信息
            //解析每一个POST信息
            if(fileConfig_json[name]){
                tmp = fileConfig_json[name];
                if(tmp instanceof Array){
                    fileConfig_json[name].push(value);
                }else{
                    stack.push(tmp,value);
                    fileConfig_json[name] = stack;
                }
            }else{
                fileConfig_json[name] = value;
            }
        });
        form.on('close',function(){
            //如果没有文件上传
            if(fileConfig_json.fileName === undefined){
                // 将 “文件为空的错误提示” 在上传页显示
                res.render('data_post',{ title:'Data Post',
                             err_info:'上传文件不能为空'
                            });
                fs.unlink(config.rootPath + _file.path)
                return;
            }
            //上传格式是否正确
            var file_type = path.basename(fileConfig_json.path).split('.')[1]
            if(file_type != 'json'){
                fs.unlink(config.rootPath + fileConfig_json.path);
                res.render('data_post',{ title:'Data Post',
                             err_info:'请上传规定格式的JSON文件'
                            });
                return;
            }
            //将上传文件的配置文件写到相应的 "~/config/~.json" 下
            var configFileName = path.join('./data/config/',path.basename(fileConfig_json.path).split('.')[0]+'.json');
            var fileConfig_str = JSON.stringify(fileConfig_json);
            fs.writeFile(configFileName,fileConfig_str,function(err){
                if(err)   console.log('./data/config文件夹不存在');
            });
            
            //将配置文件的索引信息追加到 "~/list.log" 文件中
            //name: 数据文件名
            //storageName: 数据文件储存名
            //configPath: 数据配置文件地址
            //filePath: 数据文件地址
            //date: 记录时间
            var list_str = "";
            list_str += "name:" + fileConfig_json.fileName + ",";
            list_str += "storageName:" + fileConfig_json.path.split('/')[2].split('.')[0] + ",";
            list_str += "configPath:" + configFileName + ",";
            list_str += "filePath:" + fileConfig_json.path + ",";
            list_str += "date" + new Date() + ";";
            fs.appendFile('./data/list.log',list_str,function(err){
                if(err)   console.log('./data/list.log 无法正确打开，请检查配置路径');
            });
            res.render('data_post',{ title:'Data Post',
                                 err_info:''
                                });
            return;
        });
        form.parse(req);
    }else{
        next();
    }
}