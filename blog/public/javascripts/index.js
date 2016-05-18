/**
 * Created by tzr4032369 on 2016/5/16.
 */



$(document).ready(function(){
        $(".like").click(function(){
            var article_id = this.dataset.id;
            var obj = $(this);
            $.ajax({
                url:'/like?article_id='+article_id,
                type:'get',
                success:function(data){
                    if(data.status=='ok'){
                        obj.html('<i class="fa fa-thumbs-o-up like_icon" aria-hidden="true"></i>'+data.msg);
                    }else{
                        console.log('wrong');
                    }
                },
                error:function(err){
                    console.log(err);
                }
            })
        });
});
