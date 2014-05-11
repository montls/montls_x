var express = require('express');
var router = express.Router();

var config = require('../config');
var upload_data = require('../model/upload_data');
var m_show_dir = require('../model/show_dir');
var m_show_file = require('../model/show_file');
var m_show_stat = require('../model/show_stat');
//var m_show_del = require('../model/show_del');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Montls_x Index' });
});
router.get('/2d', function(req, res) {
  res.redirect('/data_opt');
});
router.get('/3d', function(req, res) {
  res.redirect('/data_opt');
});
router.get('/data_upload',function(req,res){
    res.render('data_upload',{ title:'Data Post',err_info:''});
});
router.get('/data_opt',function(req,res){
    res.render('data_opt',{ title:'Data Show'});
});
router.get('/about',function(req,res){
    res.render('about');
});

router.post('/data_upload',function(req,res){
    upload_data(req,res,function(info){
        if(info == "EmptyFile")
            res.render('data_upload',{ title:'Data Upload', err_info:'上传文件不能为空' });
        else if(info == "NoJSON")
            res.render('data_upload',{ title:'Data Upload',err_info:'请上传规定格式的JSON文件'});
        else if(info == "UnSave")
            res.render('data_upload',{ title:'Data Upload',err_info:'请上传规定格式的JSON文件'});
        else if(""+info == "null")
            res.render('data_upload',{ title:'Data Upload',err_info:""});
        else
            res.render('data_upload',{ title:'Data Upload',err_info:info});
    });
});

m_show_dir(null,null,null);
////ajax
//router.get('/ajax_data_show_dir',function(req,res){
//    m_show_dir(req,res,function(err,dir_list){
//        if(err) console.log(err);
//        res.send(dir_list);
//    });
//});
//router.get('/ajax_data_show_file',function(req,res){
//    m_show_file(req,res);
//});
//router.get('/ajax_data_show_stat',function(req,res){
//    m_show_stat(req,res);
//});
//router.get('/ajax_data_show_del',function(req,res){
//    m_show_del(req,res);
//});
//router.get('/ajax_data_show_3d',function(req,res){
//    m_show_file(req,res);
//});

module.exports = router;
