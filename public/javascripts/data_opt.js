//保存选中的文件
//内容 file_id:file_name
var a_clicked;
//选中文件的数目
var len_clicked;
//请求显示文件夹内的文件信息
var del_id;

var get_header = $("#data-ajax-header");
var get_content = $("#data-ajax-content");
var get_footer = $("#data-ajax-footer");

function clear_content(){
        get_header.empty();
        get_header.css('border',"none");
        get_content.empty();
}
$(function(){
    
    get_dir();
    function get_dir(){
        $("#data-show-file-1").empty();
        $("#data-show-file-2").empty();
        $("#data-show-file-3").empty();
        $("#data-show-file-4").empty();
        len_clicked = 0;
        a_clicked = {};
        $.get('ajax_data_show_dir',function(json,status){
            var i = 0;
            //解析服务端传回的json文件 遍历生成列表
            JSON.parse(json).forEach(function(each_obj){
                var each_selector = "#data-show-file-" + (i%4+1);
                i++;
                var each_id = each_obj.path.split('/')[2].split('.')[0];
                var each_link = $('<a class ='+'data-show-file-a data='+each_id+' >'+each_obj.fileName+'</a>');
                $(each_selector).append(each_link, $('<br/>') );
            });
            //定义选中文件事件
            function link_on(){
                $("#data-show-opt-show").css("color","#00b7ff");
                $("#data-show-opt-stat").css("color","#00b7ff");
                $("#data-show-opt-del").css("color","#00b7ff");
                $("#data-show-opt-3d").css("color","#00b7ff");
            }
            function link_off(){
                $("#data-show-opt-show").css("color","#ddd");
                $("#data-show-opt-stat").css("color","#ddd");
                $("#data-show-opt-del").css("color","#ddd");
                $("#data-show-opt-3d").css("color","#ddd");
            }
            $('.data-show-file-a').click(function(){
                var file_id = $(this).attr("data");
                if(a_clicked[file_id] === undefined){
                    a_clicked[file_id] = $(this).text();
                    del_id = file_id;
                    $(this).css("border","1px solid #83b81a");
                    len_clicked++;
                    if(len_clicked > 0 && len_clicked <= 4){
                        link_on();
                        if(len_clicked > 1){
                            $("#data-show-opt-del").css("color","#ddd");
                            $("#data-show-opt-3d").css("color","#ddd");
                        }
                    }
                    if(len_clicked > 4){
                        link_off();
                    }
                }else{
                    a_clicked[file_id] = undefined;
                    $(this).css("border","none");
                    len_clicked--;
                    if(len_clicked > 0 && len_clicked <= 4){
                        link_on();
                        if(len_clicked > 1){
                            $("#data-show-opt-del").css("color","#ddd");
                            $("#data-show-opt-3d").css("color","#ddd");
                        }
                    }
                    if(len_clicked == 0 || len_clicked > 4){
                        link_off();
                    }
                }
            });
        });
    }
    //显示文件内容
    $("#data-show-opt-show").click(function(event){
        //清空下方显示区域
        clear_content();
        $(".click-for-ajax-file").off('click');
        
        //判断选中项目是否有选中且小于4个
        if(len_clicked == 0 || len_clicked > 4){
            return;
        }
        //根据选中项目生成可点的标签
        get_header.css("border-bottom","1px dotted #ddd");
        var child_node = "<span><</span>";
        var data_file_query = "";
        for(each in a_clicked){
            if(a_clicked[each]){
                data_file_query = "ajax_data_show_file?file_id=" + each;
                child_node += "<a class='click-for-ajax-file' href='#' data="+ data_file_query +">" + a_clicked[each] + "</a>";
            }
        }
        child_node += "<span>></span>";
        get_header.append(child_node);
        
        //默认显示第一个文件的内容
        var query_ajax = $("#data-ajax-header > a:nth-child(2)").attr("data");
        $.get(query_ajax,function(data){
            append_file_content(data);
        });
        $('.click-for-ajax-file').click(function(event){
            event.preventDefault();
            var query_ajax = $(this).attr("data");
            get_content.empty();
            $.get(query_ajax,function(data){
                append_file_content(data);
            });
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
        $(".click-for-ajax-file").off('click');
        
        //判断选中项目是否有选中且小于4个
        if(len_clicked == 0 || len_clicked > 4){
            return;
        }
        
         //根据选中项目生成可点的标签
        get_header.css("border-bottom","1px dotted #ddd");
        var child_node = "<span><</span>";
        var data_file_query = "";
        for(each in a_clicked){
            if(a_clicked[each]){
                data_file_query = "ajax_data_show_stat?file_id=" + each;
                child_node += "<a class='click-for-ajax-file' href='#' data="+ data_file_query +">" + a_clicked[each] + "</a>";
            }
        }
        child_node += "<span>></span>";
        get_header.append(child_node);
        
         //默认显示第一个文件的内容
        var query_ajax = $("#data-ajax-header > a:nth-child(2)").attr("data");
        child_node =
        $.get(query_ajax,function(data){
            append_stat_content(data);
        });
        
        $('.click-for-ajax-file').click(function(event){
            event.preventDefault();
            var query_ajax = $(this).attr("data");
            get_content.empty();
            $.get(query_ajax,function(data){
                append_stat_content(data);
            });
        });
        
    });
    
    //子函数
    function append_stat_content(data){
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
        for(each in data){
            child_node += "<tr class='data-tr'>"
            child_node +="<td class='data-td'>" + each + "</td>";
            child_node +="<td class='data-td'>" + data[each] + "</td>";
            child_node += "</tr>";
        }
        child_node += "</table>";
        get_content.append(child_node);
    };
    
    $("#data-show-opt-del").click(function(event){
        clear_content();
        if(len_clicked == 0 || len_clicked > 1){
            return;
        }
        $.get("ajax_data_show_del?id="+del_id,function(){});
        
        setTimeout(get_dir,200);
    });
});
