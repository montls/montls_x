$(function(){
    var a_clicked = {};
    var len_clicked = 0;
    $.get('ajax_data_show_read',function(json,status){
        var i = 0;
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
    $("#data-show-opt-show").click(data_show_opt_show);
    $("#data-show-opt-stat").click(data_show_opt_stat);
    
    var get_header = $("#data-ajax-header");
    var get_content = $("#data-ajax-content");
    var get_footer = $("#data-ajax-footer");
    
    function data_show_opt_show(event){
        get_header.empty();
        get_header.css('border',"none");
        get_content.empty();
        if(len_clicked == 0 || len_clicked > 4){
            return;
        }
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
        
        var query_ajax = $("#data-ajax-header > a:nth-child(2)").attr("data");
        child_node = "<table class='data-table'>"
        get_content.empty();
        $.get(query_ajax,function(data){
            for(each in data){
                child_node += "<tr class='data-tr'>"
                for(i in data[each]){
                    child_node +="<td class='data-td'>" + data[each][i] + "</td>";
                }
                child_node += "</tr>";
            }
            child_node += "</table>";
            get_content.append(child_node);
        });
        $('.click-for-ajax-file').click(function(event){
            event.preventDefault();
            var query_ajax = $(this).attr("data");
            var child_node = "<table class='data-table'>"
            get_content.empty();
            $.get(query_ajax,function(data){
                for(each in data){
                    child_node += "<tr class='data-tr'>"
                    for(i in data[each]){
                        child_node +="<td class='data-td'>" + data[each][i] + "</td>";
                    }
                    child_node += "</tr>";
                }
                child_node += "</table>";
                get_content.append(child_node);
            });
        });
    }
    
    function data_show_opt_stat(event){
        get_header.empty();
        get_header.css('border',"none");
        get_content.empty();
        if(len_clicked == 0 && len_clicked > 4){
            event.preventDefault()
        }
    }
});