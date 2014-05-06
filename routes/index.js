var express = require('express');
var router = express.Router();

var config = require('../config');
var m_show_dir = require('../model/show_dir');
var m_show_file = require('../model/show_file');
var m_show_stat = require('../model/show_stat');
var m_show_del = require('../model/show_del');

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
    res.render('data_upload',{ title:'Data Post',
                             err_info:''
                            });
});

router.get('/data_opt',function(req,res){
    res.render('data_opt',{ title:'Data Show'
                            });
});

router.get('/about',function(req,res){
    res.render('about');
});


//ajax
router.get('/ajax_data_show_dir',function(req,res){
    m_show_dir(req,res);
});
router.get('/ajax_data_show_file',function(req,res){
    m_show_file(req,res);
});
router.get('/ajax_data_show_stat',function(req,res){
    m_show_stat(req,res);
});
router.get('/ajax_data_show_del',function(req,res){
    m_show_del(req,res);
});
router.get('/ajax_data_show_3d',function(req,res){
    m_show_file(req,res);
});

module.exports = router;
