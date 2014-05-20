$(function(){
    $("#data-show-opt-3d").click(function(event){
        var child_node;
        clear_content();
        event.preventDefault();
        function gen_switch(value,text){
            return $('<div />', {'class': 'switch-container'}).append(
                        $('<label />',{'class': 'block-switch'}).append(
                            $('<input />',{type:'checkbox', name:'opt', value:value,'class':'checkbox-switch'}),
                            $('<span />',{'data-on':'On','data-off':'off','class':'label-switch'}),
                            $('<span />',{'class':'handle-switch'})
                        ),
                        $('<span />',{text:text})
                    )
        }
        get_content.append(
            $('<form />', { action: '/3d', method: 'POST' }).append(
               $('<div />', {'class': 'form-elem'}).append(
                   gen_switch('EX1','开启EX-1'),
                   $('<div />',{'class':"submit"}).append(
                        $('<input />',{type:'submit',value:"提交至3D显示"})
                   )
               )
            )
        )
    });
});