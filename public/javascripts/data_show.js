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
    var get_content = $("#data-ajax-context");
    var get_footer = $("#data-ajax-footer");
    
    function data_show_opt_show(event){
        
        if(len_clicked == 0 || len_clicked > 4){
            return;
        }
        get_header.empty();
        var child_node = "<span><</span>";
        for(each in a_clicked){
            if(a_clicked[each])
                child_node += "<a>" + a_clicked[each] + "</a>";
        }
        child_node += "<span>></span>";
        get_header.append(child_node);
    }
    
    function data_show_opt_stat(event){
        if(len_clicked == 0 && len_clicked > 4){
            event.preventDefault()
        }
        get_header.empty();
    }
});