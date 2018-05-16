$.extend({
/*    downImg: function () {
    var svgTimeout = window.setTimeout(function(){
        //转img
        html2canvas($(".hide_container"), {
            useCORS:true,
            height:par.canvasH,
            width:par.canvasW,
            onrendered: function (canvas) {
                var imgURL = canvas.toDataURL('image/jpeg');

                //console.log(imgURL);
                return false;
                $.publicTo(imgURL);
                var downFinishremove = window.setTimeout(function () {
                    $('.hide_container').remove();
                    clearTimeout(downFinishremove);
                    downFinishremove = null;
                },1000)
            }
        });
        clearTimeout(svgTimeout);
        svgTimeout = null;
    },5000)

    },*/
    publicTo:function(imgURL){
        var userInfo_ = JSON.parse(localStorage.getItem('userInfo'));
        var templeTtitle = $('#templeTtitle').val();
        var keyword = $('#keyword').val();
        var jsonData_ = JSON.stringify(par.totalJson);
        var base_ = imgURL.replace('data:image/jpeg;base64,','');
		
//获取模板名称
        var tempName = $('.documentTitle span').text();
        if(tempName == '点击此处设置作品名称'){
            tempName = '';
        }
        //return false;
        var id = $.getQueryString_('id');
        $.ajax({
            type:'post',
            url:par.urlhead+'worksys/releaseTemplate',
            data:{
                'authorityKey':'9670f10b8b17ea61010375bfbe08138d',
                'userID':userInfo_.userID,
                'token':userInfo_.token,
                'jsonData':JSON.stringify(par.totalJson),
                'imageData':base_,
                'typeNumber':id,
                'keyWords':keyword,
                'title':templeTtitle
            },
            datatype:'json',
            success:function(data){
                var jsonData_ = JSON.parse(data);
                var statu = jsonData_.status;
                /*int ，-1参数错误 -2 token错误 其它发布失败*/
                if(statu == -1){
                    alert('参数错误');
                }else if(statu == -2){
                    //token 错误
                    alert('token error!');
                }else if(statu == 1){
                    //设置进度条状态
                    par.i_ = 100;
                    par.s.changeValue(100);
                    //$('.downFinish').show();
                    $('#cloneTemp').remove();
                    $('.publishContent').hide();
                    //$('.downFinish').hide();
                    //$('.downFinish').show();
                }else{
                    //其他失败
                    alert('other error!');
                }
                $('.downProcess').hide();
            },
            error: function(XMLHttpRequest,textStatus ,errorThrown){
                alert(textStatus);
                $('.downProcess').hide();
            }
        })

    }


});