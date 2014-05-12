var fs = require("fs");
var path = require("path");
var mongoose = require("mongoose");
var Schema = mongoose.Schema; 

var WarpMongo = function(){
    this.list_model;
    this._meta_schema = {
        embedLegth: Number,
        isEmbedLabel: Boolean,
        elemType: String,
        label:[{type:String,defalut:"Undefined"}],
        fileMeta:{
            fileName: String,
            filePath: String,
            fileId:   String,
            fileType: String
        },
        data:{
            number:         Number,
            collectionName: String
        },
        date: {type:Date,default:Date.now()}
    };
    this._data_schema = {
        "data":[{type:Number,default:0}]
    };
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
    var list_schema = mg_ins1.generateSchema({
        metaName:   String,
        fileName:   String,
        filePath:   String,
        fileId:     String
    },{collection:"list"});
    var list_model = mg_ins1.generateModel("list",list_schema);
    this.list_model = list_model;
}

WarpMongo.prototype.getDirList = function(p_query,callback){
    this.list_model.find(p_query,function(err,results){
        var dir_list = [];
        results.forEach(function(elem){
            dir_list.push([elem.fileName,elem.filePath,elem.fileId]);
        });
        callback(err,dir_list);                 
    });
}

WarpMongo.prototype.findCollection = function(p_collName,p_query,callback){
    mongoose.connection.db.collection(p_collName,function(err,collection){
        collection.find(p_query).toArray(callback);
    });
}

WarpMongo.prototype.findCollectionAndRemove = function(p_collName,callback){
    mongoose.connection.db.dropCollection(p_collName,function(err){
        if(err) callback(err)
        callback(null);
    });
}
WarpMongo.prototype.findMetaByFileId = function(p_fileId,callback){
    var that = this;
    this.findCollection('list',{fileId:p_fileId},function(err,doc0){
        if(err) callback(err);
        var _meta_name = doc0[0].metaName;
        that.findCollection(_meta_name,{},function(err,docs){
            if(err) callback(err);
            callback(null,docs);
        });
    });
}

WarpMongo.prototype.findDataByMeta = function(p_dataName,callback){
    this.findCollection(p_dataName,{},function(err,results){
        if(err) callback(err);
        callback(null,results);
    });
}

WarpMongo.prototype.removeMetaAndDataById = function(p_fileId,callback){
    var that = this;
    this.findCollection('list',{fileId:p_fileId},function(err,doc0){
        if(err) callback(err);
        var _meta_name = doc0[0].metaName;
        var _data_name = "data_"+_meta_name.split('_')[1];
        that.findCollectionAndRemove(_data_name,function(err){
            if(err) callback(err);
            that.findCollectionAndRemove(_meta_name,function(err){
                if(err) callback(err);
                that.list_model.remove({fileId:p_fileId},function(err){
                    if(err) callback(err);
                });
            });
        });
        callback(null,doc0);
    });
}

var mg_ins1 =new WarpMongo();
//BUG:无法保证链接成功
mg_ins1.connectToDb("db0",function(){});
mg_ins1.generateList();
exports.mg_ins1 = mg_ins1;