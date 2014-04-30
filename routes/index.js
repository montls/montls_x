var express = require('express');
var router = express.Router();

var config = require('../config');
var m_show_dir = require('../model/show_dir');
var m_show_file = require('../model/show_file');
var m_show_stat = require('../model/show_stat');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Montls_x Index' });
});
router.get('/2d', function(req, res) {
  res.render('2d');
});
router.get('/3d', function(req, res) {
  res.render('3d');
});
router.get('/data_post',function(req,res){
    res.render('data_post',{ title:'Data Post',
                             err_info:''
                            });
});

router.get('/data_show',function(req,res){
    res.render('data_show',{ title:'Data Show'
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

module.exports = router;
