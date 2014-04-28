var express = require('express');
var path = require('path');
var fs = require('fs');
var config = require('../config');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});
router.get('/data_post',function(req,res){
    res.render('data_post');
});
router.post('/data_post',function(req,res){
    res.render('data_post');
});
router.get('/data_show',function(req,res){
    res.render('data_show');
});
router.get('/ajax_data_show_read',function(req,res){
    var list_path = config.rootPath + '/data/list.log';
    console.log(list_path);
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
            console.log(1);
        }
    });
});
router.get('/ajax_data_show_file',function(req,res){
    var id = req.query.file_id;
    var list_path = config.rootPath + '/data/list.log';
    var file_path;
    var each_list
    fs.stat(list_path,function(err,stats){
        if(err)
            return console.log(err);
        if(stats.isFile()){
            fs.readFile(list_path,encoding='utf8',function(err,data){
                if(err)
                    return console.log(err);
                var data_list = data.split(';');
                for(each in data_list){
                    each_list = data_list[each].split(',');
                    if(id == each_list[1].split(':')[1]){
                        file_path = config.rootPath + "/" +each_list[3].split(':')[1];
                        break;
                    }
                }
                fs.stat(file_path,function(err,stats){
                    if(err){
                        console.log(err);
                        res.send(err);
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
                        console.log("Not File!\n");
                        res.send('Not File!');
                    }
                });
            });
        }else{
            console.log(1);
        }
    });
    
});
function data_to_json(data){
    var data_json = [];
    var line = []
    var data_list_row = data.split('\r\n'); //
    for(each in data_list_row){
        data_json.push(data_list_row[each].split('\t\t'));
    }
    return data_json;
}
module.exports = router;
