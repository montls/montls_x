$(function(){
    $("#upload-file").change(function(){
        $("#upload-text").val($(this).val());
    });
    $("#show-data").click(function(){
        $("#ajax-fold").css("opacity",0);
    });
});