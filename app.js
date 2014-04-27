var express = require('express'); 
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var fs = require('fs');
var multiparty = require('multiparty');
var util = require('util');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var config = require('./config');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){
    if(req.url === '/data' && req.method === 'POST'){
        var form = new multiparty.Form({
            uploadDir:'./data/json',
            limit:1000000000 // 1000M
        });
        var fileConfig_json = {};
        var create_date = new Date();
        console.log(create_date);
        form.on('file',function(name,files){
            //建立配置文件
            if(files &&  files.originalFilename){
                fileConfig_json.fieldName = files.fieldName;
                fileConfig_json.fileName = files.originalFilename;
                fileConfig_json.path = files.path;
                fileConfig_json.length = files.ws.bytesWritten;
            }else{
                next(404);
            }
        });
        form.on('field',function(name,value){
            var tmp;
            var stack = [];
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
            fileConfig_json.date = create_date;
            var configFileName = path.join('./data/config/',path.basename(fileConfig_json.path).split('.')[0]+'.json');
            var fileConfig_str = JSON.stringify(fileConfig_json);
            fs.writeFile(configFileName,fileConfig_str,function(err){
                if(err)
                    res.seng(500);
            });
            var list_str = "";
            list_str += "name:" + fileConfig_json.fileName + ",";
            list_str += "servername:" + fileConfig_json.path.split('/')[2].split('.')[0] + ",";
            list_str += "configPath:" + configFileName + ",";
            list_str += "filePath:" + 'data/'+fileConfig_json.path + ",";
            list_str += "data" + create_date + ";";
            fs.appendFile('./data/list.log',list_str,function(err){
                if(err)
                    res.send(500); // dry fixed
            });
        });
        form.parse(req);
        res.render('data_post');
        return;
    }else{
        next();
    }
    
});
app.use('/', routes);
app.use('/users', users);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
