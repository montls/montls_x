var fs = require("fs");
var path = require("path");
var mongoose = require("mongoose");
var Schema = mongoose.Schema; 

var WarpMongo = function(){
    this.list_model;
};

WarpMongo.prototype.connectToDb = function(p_dbName,callback){
    var dbName = p_dbName || "db0";
    if(typeof dbName != "string" )
        callback(new Error("DBName if wrong"));
    mongoose.connect("mongodb://localhost/"+dbName);
    var _db = mongoose.connection;
    _db.on("error",console.error.bind(console,"Connection Error: "));
    _db.once("open",function(){
        callback(null);
    });
}

WarpMongo.prototype.generateSchema = function(p_pattern,p_opts){
    if(typeof p_pattern != 'object')
        return new Error("Pattern is wrong");
    var opts = p_opts || {};
    if(typeof opts != 'object')
        return new Error("Opts is wrong");
    var _schema = new Schema(p_pattern,opts);
    return _schema;
}

WarpMongo.prototype.generateModel = function(p_modelName,p_schema){
    if(typeof p_modelName != "string")
        return new Error("Model name is wrong");
    if(!(p_schema instanceof  Schema))
        return new Error("Schema is wrong");
    var _model = mongoose.model(p_modelName,p_schema);
    return _model;
}

WarpMongo.prototype.generateList = function(){
    var list_schema = mg_ins1.generateSchema({metaList:String},{collection:"list"});
    var list_model = mg_ins1.generateModel("list",list_schema);
    this.list_model = list_model;
}

WarpMongo.prototype.getList = function(p_query,callback){
    this.list_model.find(p_query,callback);
}

WarpMongo.prototype.findCollection = function(p_collName,p_query,callback){
    mongoose.connection.db.collection(p_collName,function(err,collection){
        collection.find(p_query).toArray(callback);
    });
}
var mg_ins1 =new WarpMongo();
//BUG:无法保证链接成功
mg_ins1.connectToDb("db0",function(){});
mg_ins1.generateList();
exports.mg_ins1 = mg_ins1;