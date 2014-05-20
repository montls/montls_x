var get_header = $("#data-ajax-header");
var get_content = $("#data-ajax-content");
var get_footer = $("#data-ajax-footer");

function clear_content(){
        get_header.empty();
        get_header.css('border',"none");
        get_content.empty();
}

var id_clicked = {id:0,elem:undefined};

$(function(){
    
    get_dir();
    function get_dir(){
        $("#data-show-file-1").empty();
        $("#data-show-file-2").empty();
        $("#data-show-file-3").empty();
        $("#data-show-file-4").empty();
        $.get('ajax_data_show_dir',function(list,status){
            var i = 0;
            //解析服务端传回的json文件 遍历生成列表
            list.forEach(function(each_obj){
                var each_selector = "#data-show-file-" + (i%4+1);
                i++;
                var each_link = $('<a class ='+'data-show-file-a data='+each_obj[2]+' >'+each_obj[0]+'</a>');
                $(each_selector).append(each_link, $('<br/>') );
            });
            //dir鼠标选中效果
            $('.data-show-file-a').click(function(event){
                event.preventDefault();
                if(id_clicked.id == 0){
                    $("#data-show-opt span a").css({'color':"#83b81a"});
                    $("#data-show-opt span").hover(function(){
                        $(this).children("span").css({'color':'#83b81a'});
                    },function(){
                        $(this).children("span").css({'color':'#ddd'});
                    });
                    $(this).css({
                        "color":'white',
                        "background-color":"#00b7ff"
                    });
                    id_clicked.id = $(this).attr('data');
                    id_clicked.elem = $(this);
                }else{
                    id_clicked.elem.css({
                        "color":"00b7ff",
                        "background-color":"white"
                    });
                    $(this).css({
                        "color":'white',
                        "background-color":"#00b7ff"
                    });
                    id_clicked.id = $(this).attr('data');
                    id_clicked.elem = $(this);
                }
            });
        });
    }
    //显示文件内容
    $("#data-show-opt-show").click(function(event){
        //清空下方显示区域
        clear_content();
        event.preventDefault();
        var query_ajax = "/ajax_data_show_file?fileId="+id_clicked.id;
        get_content.empty();
        $.get(query_ajax,function(data){
            append_file_content(data);
        });

    });
    
    //子函数
    function append_file_content(data){
        var child_node =  "<table class='data-table'>";
        if(data.toString() == ":Error"){
            $('#error-container').text("文件不存在");
            $('#error-container').css('background-color','#00B7FF');
            get_header.empty();
            get_header.css('border',"none");
            get_content.empty();
            return;
        }
        data = JSON.parse(data);
        $.map(data,function parse_obj(value,i){
            if(i == "序号"){
                if($.isArray(value)){
                    child_node += "<tr class='data-tr'>"
                    child_node +="<td class='data-td'>" + i + "</td>";
                    $.map(value,function(value,i){
                        child_node += "<td class='data-td'>" + value + "</td>";
                    });
                }else{
                    $.map(value,parse_obj);
                }
                delete data[i];
            }
        });
        $.map(data,function parse_obj(value,i){
            if($.isArray(value)){
                child_node += "<tr class='data-tr'>"
                child_node +="<td class='data-td'>" + i + "</td>";
                $.map(value,function(value,i){
                    child_node += "<td class='data-td'>" + value + "</td>";
                });
            }else{
                $.map(value,parse_obj);
            }
        });
        child_node += "</table>";
        get_content.append(child_node);
    };
    
    //显示文件信息
    $("#data-show-opt-stat").click(function(event){
        clear_content();
        event.preventDefault();
        var query_ajax = "/ajax_data_show_stat?fileId="+id_clicked.id;
        get_content.empty();
        $.get(query_ajax,function(data){
            append_stat_content(data);
        });
    });
    
    //子函数
    function append_stat_content(data){
        data = JSON.parse(data);
        if(typeof data != 'object'){
            $('#error-container').text("文件不存在");
            $('#error-container').css('background-color','#00B7FF');
            get_header.empty();
            get_header.css('border',"none");
            get_content.empty();
            return;
        }
        get_content.append(
            $("<table />",{id:"stat-table"}).append(
                c_tr("文件名",data.fileMeta.fileName),
                c_tr("编号",data._id),
                c_tr("关联数据组号",data.data.collectionName),
                c_tr("关联数据大小",data.data.number),
                c_tr("数据建立时间",data.date),
                c_tr("文件ID",data.fileMeta.fileId),
                c_tr("文件路径",data.fileMeta.filePath),
                c_tr("文件数据类型",data.fileMeta.fileType),
                c_tr("标签数量",data.label.length)
            )
        );
        function c_tr(key,value){
            return $("<tr />",{'class':'table-tr'}).append(
                $("<td />",{'class':'stat-td-label',text:key}),
                $("<td />",{'class':'stat-td-content',text:value})
            )
        }
    }
    
    $("#data-show-opt-del").click(function(event){
        clear_content();
        $.get("ajax_data_show_del?fileId="+id_clicked.id,function(){});
        setTimeout(get_dir,200);
    });
});
