var config = require('../config');
var fs = require('fs');

module.exports = function(req,res){
    var id = req.query.file_id;
    var list_path = config.logList_path;
    var each_list;
    var file_path;
    fs.stat(list_path,function(err,stats){
        if(err) console.log("'~/data/list.log' 您的数据索引目录已丢失或者全部数据文件已丢失");
            
        //判断 "~/data/list.log" 文件是否存在
        if(stats.isFile()){
            fs.readFile(list_path,encoding='utf8',function(err,data){
                if(err)
                    return console.log(err);
                var data_list = data.split(';');
                //遍历 list.log 匹配文件信息 
                for(each in data_list){
                    each_list = data_list[each].split(',');
                    if(id == each_list[1].split(':')[1]){
                        file_path = config.rootPath + each_list[3].split(':')[1];
                        break;
                    }
                }
                //判断 "~/data/json/*.json" 是否存在
                fs.stat(file_path,function(err,stats){
                    if(err){
                        res.send(':Error');
                    }
                    if(stats.isFile()){
                        fs.readFile(file_path,encoding="utf8",function(err,data){
                            if(err){
                                console.log(err);
                                res.send(err);
                            }
                            res.send(data_to_json(data));
                        });
                    }else{
                        res.send(':Error');
                    }
                });
            });
        }else{
            console.log("'~/data/list.log' 不是一个文件");
        }
    });
}

function data_to_json(data){
    var data_json = [];
    var line = [];
    var data_list_row = data.split(config.split_row); 
    for(each in data_list_row){
        data_json.push(data_list_row[each].split(config.split_col));
    }
    return data_json;
}