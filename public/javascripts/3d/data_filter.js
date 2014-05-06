$(function(){
    
    $("#data-show-opt-3d").click(function(event){
        var child_node;
        clear_content();
        if(len_clicked == 0 || len_clicked > 1){
            return;
        }
        get_header.css("border-bottom","1px dotted #ddd");
        get_header.append("<span>< </span><span><a href='####'> 选项 </a></span><span> ></span>");
        
        function gen_switch(value,text){
            return $('<div />', {'class': 'switch-container'}).append(
                        $('<label />',{'class': 'block-switch'}).append(
                            $('<input />',{type:'checkbox', name:'upload_opt', value:value,'class':'checkbox-switch'}),
                            $('<span />',{'data-on':'On','data-off':'off','class':'label-switch'}),
                            $('<span />',{'class':'handle-switch'})
                        ),
                        $('<span />',{text:text})
                    )
        }
        get_content.append(
            $('<form />', { action: '/3d', method: 'POST' }).append(
               $('<div />', {'class': 'form-elem'}).append(
                   gen_switch('2D','开启2D图形'),
                   gen_switch('animal','开启动画效果'),
                   gen_switch('control','开启视角控制'),
                   gen_switch('light','使用灯光'),
                   $('<div />',{'class':"submit"}).append(
                        $('<input />',{type:'submit',value:"提交至3D显示"})
                   )
               )
            )
        )
        
        $.get("ajax_data_show_3d?file_id="+del_id,function(data){
        });
    });
});