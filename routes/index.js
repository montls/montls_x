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
router.post('/data_post',function(req,res){
    res.render('data_post');
});
router.get('/data_show',function(req,res){
    res.render('data_show');
});
router.get('/ajax_data_show_read',function(req,res){
    var list_path = config.rootPath + '/data/list.log';
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
module.exports = router;
