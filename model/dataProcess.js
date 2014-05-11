var mg_ins1 = require("./wrapMg").mg_ins1;
var Schema = require("mongoose").Schema;

var DataProcess = function(p_fileMate, p_JSON){
    this.fileMate = p_fileMate;
    this.JSON = p_JSON;
};

DataProcess.prototype.parseData = function(callback){
    this._data = this.JSON.data;
    this._meta = this.JSON.meta;
    this._tr;
    this._eflag;
    this._tp;
    this._label;
    var data_schema_pattern = {};
    var data_schema_opts = {};
    var meta_schema_pattern = {};
    var meta_schema_opts = {};
    var data_schema;
    var data_model;
    var meta_schema;
    var meta_model;
    
    //基本参数检测
    if(typeof this._meta.embedLegth != 'number')
        callback(new Error("meta <embedLegth> Error"));
    this._tr = this._meta.embedLegth;
    if(typeof this._meta.isEmbedLabel != 'boolean')
        callback(new Error("meta <isEmbedLabel> Error"));
    this._eflag = this._meta.isEmbedLabel;
    if(typeof this._meta.elemType != 'string')
        callback(new Error("meta <elemType> Error"));
    this._tp = this._meta.elemType;
    if(this._tr == 0){
        if(!(this._meta.elemLabel instanceof Array))
            callback(new Error("meta <elemLabel> Error"));
        this._label = this._meta.elemLabel;
        if(!(this._data instanceof Array))
            callback(new Error("data Error"));
        
        //生成基本信息
        data_schema_pattern.data = [{type:Number,default:0}];
        data_schema_opts.collection = "data_"+Date.now();
        meta_schema_pattern = {
            embedLegth: Number,
            isEmbedLabel: Boolean,
            elemType: String,
            label:[{type:String,defalut:"Undefined"}],
            fileMate:{
                fileName: String,
                filePath: String,
                fileId:   String,
                fileType: String
            },
            data:{
                number:         Number,
                collectionName: String,
                ids:            [{type:Schema.Types.ObjectId, ref:'data_model'}]
            },
            date: {type:Date,default:Date.now()}
        }
        meta_schema_opts.collection = "meta_"+Date.now();
        data_schema = mg_ins1.generateSchema(data_schema_pattern,data_schema_opts);
        data_model = mg_ins1.generateModel(data_schema_opts.collection,data_schema);
        meta_schema = mg_ins1.generateSchema(meta_schema_pattern,meta_schema_opts);
        meta_model = mg_ins1.generateModel(meta_schema_opts.collection,meta_schema);
        
        //保存数据配置文件
        var meta_doc = new meta_model({
            embedLegth:     this._tr,
            isEmbedLabel:   this._eflag,
            elemType:       this.tp,
            label:          this._label,
            fileMate:{
                fileName:   this.fileMate.fileName,
                filePath:   this.fileMate.filePath,
                fileId:     this.fileMate.fileId,
                fileType:   this.fileMate.fileType
            },
            data:{
                number:         _data_len,
                collectionName: data_schema_opts.collection,
            }
        });
        meta_doc.save(function(err){
            if(err) callback(err);
        });
        
        //传入数据，并更新meta链接
        var _data_len = this._data.length;
        for(var i=0;i<_data_len;i++){
            if(!(this._data[i] instanceof Array))
               callback(new Error("data Error"));
            data_model.create({data:this._data[i]},function(err,doc){
                if(err) callback(err);
                meta_doc.data.ids.push(doc._id);
                meta_doc.save();
            });
        }
        
        //记录当前存在的配置文件
        var _l_doc = mg_ins1.list_model({metaList:meta_schema_opts.collection});
        _l_doc.save(function(err,list){
            callback(err);
        });
    }
}

module.exports = DataProcess;