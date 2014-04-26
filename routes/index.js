var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});
router.get('/data',function(req,res){
    res.render('data');
});
router.post('/data',function(req,res){
    console.log('req:\n'+req);
    res.render('data');
});
module.exports = router;
