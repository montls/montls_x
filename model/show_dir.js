var config = require('../config');
var fs = require('fs');

module.exports = function(list_path,res){
    var list_path = config.logList_path;
    fs.stat(list_path,function(err,stats){
        if(err)
            return console.log(err);
        if(stats.isFile()){
            fs.readFile(list_path,encoding='utf8',function(err,data){
                if(err)
                    return console.log(err);
                var data_list = data.split(';');
                var data_json = JSON.stringify(data_list);
                res.send(data_json);
            });
        }else{
            console.log("系统文件被破坏，请重新安装");
        }
    });
}