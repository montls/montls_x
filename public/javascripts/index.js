$(function(){
    $(document).scroll(function(){
        var left = $("#left-content-fixed");
        var add = $(document).scrollTop();
        var top = 0;
        if(add <= 47){
            top = 57 - 57/44*add;
        }
        //console.log(top);
        left.css("top",top+"px");
    });
})