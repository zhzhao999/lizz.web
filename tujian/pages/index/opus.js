$(function(){
	$('.editable').on('click', function(){
		$(this).focus().select();
        $(this).selectionStart = 0;
        $(this).selectionEnd = $(this).val().length;
	});
	/*瀑布流*/
	
    window.addEventListener('resize', function(){
      //minigrid('.masonryLayout', '.masonryLayoutColumn');
    });
    //图片头
    var imgUrl_ = '';
    var base = new Base64();
    var userInfo = JSON.parse(localStorage.getItem('userInfo'));
    var app = new Vue({
        el: '#webPc',
        data: {
            currentPage: 1,
            moduleLists: [],
            fixedParam: {
                authorityKey: '9670f10b8b17ea61010375bfbe08138d',
                userID: userInfo.userID,
                token: userInfo.token,
                perPageSize: 20,  /*每页返回数量*/
                currentPage: 1,
            },
            moduleOver: false,
            flagNone: false,
        },
        created(){
            $('.homeDesigns').showLoading();
            this.getMyModule();
        },
        methods: {
            jumpPage(val, url,id,temT,timeTmp){
                //var date_ = new Date(timeTmp);
                //ts = Math.round(date_.getTime()/1000).toString();
                //alert(ts);
                /*val:模版类型号, url:ajax 请求接口,图片请求头：imgurl,模板ID ：temId,模板title：temTitle*//*&imgurl=' + imgUrl_+ '&temId=' + temTitle+ '*/
                var temp= 1;
                window.location.href = '../design/design.html?id='+val + '&dataUrl=' + url+'&urlheader=' + imgUrl_+ '&tem=' + temp+ '&temID=' + id+ '&temTitle='+temT+'&timesmp='+timeTmp;
            },
            getMyModule() {
                var _this = this;
                $.ajax({
                    url: config.myModuleLists,
                    type: 'post',
                    dataType: 'json',
                    data: {
                        authorityKey: _this.fixedParam.authorityKey,
                        userID: _this.fixedParam.userID,
                        token: _this.fixedParam.token,
                        perPageSize: _this.fixedParam.perPageSize,
                        pageNumber: _this.fixedParam.currentPage,   /*当前页*/
                    },
                    success: function(data){
                        if(data.status == 1){
                            if(data.result.length > 0){
                                for(var i = 0; i < data.result.length; i++) {
                                    data.result[i].typeName = analysisTem(data.result[i].typeNumber).name;
                                    data.result[i].ownTimestamp_own = data.result[i].ownTimestamp;
                                    data.result[i].ownTimestamp = formatDate(new Date(data.result[i].ownTimestamp * 1000), 'yyyy-MM-dd hh:mm');
                                    _this.moduleLists.push(data.result[i]);
                                    imgUrl_ = data.urlHeader;
                                }
                            }else{
                                _this.flagNone = true;
                                $('.moduleTip').hide();
                                _this.moduleOver = true;
                            }
                            
                        }else{
                            console.log('error');
                        }
                    }
                })
            },
            copyModule(id){
                var _this = this;
                console.log(id);
                return;
                $.ajax({
                    url: config.copyTem,
                    type: 'post',
                    dataType: 'json',
                    data: {
                        authorityKey: _this.fixedParam.authorityKey,
                        userID: _this.fixedParam.userID,
                        token: _this.fixedParam.token,
                        ownTemplateID: id,
                    },
                    success: function(data){
                        if(data.status == 1){
                            console.log(data);
                            //_this.moduleLists.unshift();   //在列表最前边添加对象
                        }else{
                            console.log('error');
                        }
                    }
                })
            },
            deleteModule(id){
                var _this = this;
                msgconfirm('删除', '是否确认删除?', function(){
                    var idx = null;
                    $.each(_this.moduleLists, function(index, el) {
                        if(el.ownTemplateID == id){
                            idx = index;
                        }
                    });
                    $.ajax({
                        url: config.deleteMyModule,
                        type: 'post',
                        dataType: 'json',
                        data: {
                            authorityKey: _this.fixedParam.authorityKey,
                            userID: _this.fixedParam.userID,
                            token: _this.fixedParam.token,
                            ownTemplateID: id,
                        },
                        success: function(data){
                            if(data.status == 1){ //1删除成功  -3删除失败 -2token错误-1参数出错
                                _this.moduleLists.splice(idx, 1);
                            }else if(data.status == -3){
                                alert('删除失败');
                            }else if(data.status == -2){
                                alert('token错误');
                            }else{
                                alert('参数出错');
                            }
                        }
                    })
                })
            },

        },
        watch: {
            moduleLists: function(){
                this.$nextTick(function(){
                    $('#grid').imagesLoaded(function(){
                        var container = document.getElementById('grid');
                        var msnry = new Masonry( container , {
                            'itemSelector': '.masonryLayoutColumn',
                            'gutter': 30
                        });

                        $('.homeDesigns').hideLoading();
                    })
                })

            }
        }
    })

    $(window).scroll(function(){
        var flag = checkScroll($(this));
        if(!app.moduleOver){
            $('.moduleTip').show();
        }
        if(!app.moduleOver && flag){
            app.fixedParam.currentPage++;
            app.getMyModule();
        }
    });

    function checkScroll(dom){
        var scrollTop = dom.scrollTop();
    　　var scrollHeight = $(window).height();  //可视区域高度
    　　var windowHeight = $(document).height();   //文档高度

    　　if(windowHeight-scrollTop-scrollHeight == 0){
            return true;
    　　}else{
            return false;
        }
    }

function formatDate (date, fmt) {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    var o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (var k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            var str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
    return fmt;
};
function padLeftZero (str) {
    return ('00' + str).substr(str.length);
};
});