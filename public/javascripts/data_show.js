$(function(){
    //保存选中的文件
    //内容 file_id:file_name
    var a_clicked = {};
    //选中文件的数目
    var len_clicked = 0;
    //请求显示文件夹内的文件信息
    
    var get_header = $("#data-ajax-header");
    var get_content = $("#data-ajax-content");
    var get_footer = $("#data-ajax-footer");
    
    $.get('ajax_data_show_dir',function(json,status){
        var i = 0;
        //解析服务端传回的json文件 遍历生成列表
        JSON.parse(json).forEach(function(each_str){
            if(each_str){
                var each_div;
                var each_selector = "#data-show-file-" + (i%4+1); 
                var each_name = each_str.split(',')[0].split(':')[1];
                var each_id = each_str.split(',')[1].split(':')[1];
                i++;
                each_str = "<a class='data-show-file-a' " + "data=" + each_id + " >" + each_name + "</a><br>";
                $(each_selector).append(each_str);
            }
        });
        //定义选中文件事件
        $('.data-show-file-a').click(function(){
            var file_id = $(this).attr("data");
            if(a_clicked[file_id] === undefined){
                a_clicked[file_id] = $(this).text();
                $(this).css("border","1px solid #83b81a");
                len_clicked++;
                if(len_clicked > 0 && len_clicked <= 4){
                    $("#data-show-opt-show").css("color","#00b7ff");
                    $("#data-show-opt-stat").css("color","#00b7ff");
                }
                if(len_clicked > 4){
                    $("#data-show-opt-show").css("color","#ddd");
                    $("#data-show-opt-stat").css("color","#ddd");
                }
            }else{
                a_clicked[file_id] = undefined;
                $(this).css("border","none");
                len_clicked--;
                if(len_clicked > 0 && len_clicked <= 4){
                    $("#data-show-opt-show").css("color","#00b7ff");
                    $("#data-show-opt-stat").css("color","#00b7ff");
                }
                if(len_clicked == 0 || len_clicked > 4){
                    $("#data-show-opt-show").css("color","#ddd");
                    $("#data-show-opt-stat").css("color","#ddd");
                }
            }
        });
    });
    
    //显示文件内容
    $("#data-show-opt-show").click(function(event){
        //清空下方显示区域
        get_header.empty();
        get_header.css('border',"none");
        get_content.empty();
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
            var child_node = "<table class='data-table'>"
            get_content.empty();
            $.get(query_ajax,function(data){
                append_file_content(data);
            });
        });
    });
    
    //显示文件信息
    $("#data-show-opt-stat").click(function(event){
        get_header.empty();
        get_header.css('border',"none");
        get_content.empty();
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
            var child_node = "<table class='data-table'>"
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
        for(var each in data){
            child_node += "<tr class='data-tr'>"
            for(var i in data[each]){
                child_node +="<td class='data-td'>" + data[each][i] + "</td>";
            }
            child_node += "</tr>";
        }
        child_node += "</table>";
        get_content.append(child_node);
    };
});
