$(function () {
    //dom加载完成后调用部分↓
//	根据上个页面携带参数生成空模板
    var Request=new UrlSearch(); //实例化
    console.log(Request)
    var Rid = Request.id;
    var Tem = Request.tem;//用来判断是否携带模板数据，有的话值为1，没有的话为空
    //console.log(Request)
    var sizeObj=analysisTem(Rid);
    var blankW = sizeObj.width;
    var blankH = sizeObj.height;
//  如果携带模板数据,将其渲染,如果没有携带的话,默认打开空模板
	if(Tem==1||Tem=='1'){
	    if(Request.temTitle == 'undefied'){
            Request.temTitle == ''
        }
        if(Request.timesmp == 'undefied'){
            Request.timesmp == 0
        }
        //ajaxurl：Request.dataUrl  ， 图片头部：Request.urlheader  ， 模板型号：Request.temID  ， 模板id：Request.temID ，  模板标题：Request.temTitle  ， 模板时间戳：Request.timesmp
		drawTemplet(Request.dataUrl, Request.urlheader,Request.id,Request.temID,Request.temTitle,Request.timesmp);
	}else{
		drawBlankSpace(blankW,blankH,'#fff');
	}

    //	获取用户登录信息
    var Storage = localStorage.getItem('userInfo');
    var userInfo = JSON.parse(Storage);
    //  图片编辑完成时点击事件
    $('.btnOk').click(function (ev) {
        $('.toolbarWrapper').hide();
        //裁剪确定按钮隐藏
        $('.cutingBoxbtn').hide();
        //图片编辑区隐藏
        $('.cropControls').hide();
        //定义工作区域的其他元素是否可以拖拽
        Isdrag = true;
//		退出裁剪界面时将是否进入裁剪标识符的值进行更改
        cutIng=false;

        $(dblclickThis).removeClass('selectImg');

        var e = ev||event;
        //dblclickThis是双击时选择编辑的那个元素
        //将编辑后的图片数据同步
        if($(dblclickThis).hasClass('element')){//图片素材
        	
	        $(dblclickThis).css({
	            'width':$('.viewPort').css('width'),
	            'height':$('.viewPort').css('height'),
	            'left':parseInt($('.viewPort').css('left'))-parseInt($('.page_content').css('left')) + parseInt($('.cropControls').css('left')) + 'px',
	            'top':parseInt($('.viewPort').css('top')) -parseInt($('.page_content').css('top')) - parseInt($('.page_content').css('margin-top')) +parseInt($('.cropControls').css('top')) + 'px' ,
	        })
	        $(dblclickThis).find('.zoomimg').css({
	            'width':$('.masked').css('width'),
	            'height':$('.masked').css('height'),
	            'left':$('.masked').css('left'),
	            'top':$('.masked').css('top'),
	        })
	        $(dblclickThis).attr('iscutout','true');
			//显示被隐藏的元素
	        $(dblclickThis).removeClass('cropping');
	        
        }else if($(dblclickThis).hasClass('item_content')){//网格元素
        	
	        $(dblclickThis).find('.zoomimg').css({
	            'width':$('.masked').css('width'),
	            'height':$('.masked').css('height'),
	            'left':parseInt($('.masked').css('left'))+'px',
	            'top':parseInt($('.masked').css('top'))+'px',
	        })
	        $('.gridOn').removeClass('gridOn');
        }

        $(dblclickThis).css('overflow','hidden');
        $('.mask').removeClass('on');
        $.dataSync('cancle','裁剪');
        e.preventDefault();
        e.stopPropagation();
    })
//	关闭按钮
    $('.btnclose').click(function (e) {
//		取消裁剪时重新绑定一下四角缩放的事件
        init();
        //裁剪确定按钮隐藏
        $('.cutingBoxbtn').hide();
        //图片编辑区隐藏
        $('.cropControls').hide();
        //定义工作区域的其他元素是否可以拖拽
        Isdrag = true;
//		退出裁剪界面时将是否进入裁剪标识符的值进行更改
        cutIng=false;

        $(dblclickThis).removeClass('selectImg');

        //		显示被隐藏的元素
        $(dblclickThis).removeClass('cropping');

        $(dblclickThis).css('overflow','hidden');
        $('.mask').removeClass('on');
        $('.zoomImgbox').show();
        e.preventDefault();
        e.stopPropagation();
    })

//	给元素缩放层的右下角绑定缩放事件
    Zoom($('#zoomRightBot')[0])
//	元素缩放层的拖拽绑定
//	zoomBoxDarg($('.zoomImgbox')[0])
//	点击非元素位置时隐藏元素缩放层
	$('.sidebarTab').on('click',function () {
		//让操作区元素失去焦点
	    removeFocus();
	})
	$('.header').on('click',function () {
		//让操作区元素失去焦点
	    removeFocus();
	})
    $('#canvaDocument').mousedown(function (ev) {
        var e = ev||event;
        var target = e.target;
        var eventTarget = e.currentTarget;
        
//		console.log($('#zoomRightBot'));
        if ($(target)!=$(clickThis)&&target==eventTarget||target==$('.page_content')[0]) {
        	
			//让操作区元素失去焦点
        	removeFocus();

        }
//      e.preventDefault();
//      e.stopPropagation();
    })

//	给元素缩放层的旋转按钮绑定旋转事件
    rotate($('#rotatebox')[0],$('#zoomImgbox')[0])
//	给文本框添加旋转按钮事件
    rotate($('#textRotatebox')[0],$('.playTextBox')[0],$('.editTextBox')[0])


    //翻转
    $('.routerX').click(function (ev) {
        //翻转样式 0没有翻转 1y垂直翻转 2x水平翻转 3先水平再垂直翻转
        var flipOrientation=$(clickThis).attr('flipOrientation');
        if (flipOrientation==0) {
            var rotateX=0+180;
            var rotateY=0;
            $(clickThis).attr('flipOrientation',2)
        }else if(flipOrientation==1){
            var rotateX=0+180;
            var rotateY=180;
            $(clickThis).attr('flipOrientation',3)
        }else if(flipOrientation==2){
            var rotateX=180+180;
            var rotateY=0;
            $(clickThis).attr('flipOrientation',0)
        }else if(flipOrientation==3){
            var rotateX=180 + 180;
            var rotateY=180;
            $(clickThis).attr('flipOrientation',1)
        }
        var e = ev||event;
        $(clickThis).find('img').css('transform','rotateX('+rotateX+'deg) rotateY('+rotateY+'deg)')

        //console.log(rotateX)
        //同步
        //$.isSynctoend('翻转',htmlType);
        $.dataSync('cancle','翻转');
        ev.preventDefault();
        ev.stopPropagation();
    })
    $('.routerY').click(function (ev) {
        //获取初始翻转角度
        var e = ev||event;
        //翻转样式 0没有翻转 1垂直翻转 2水平翻转 3先水平再垂直翻转
        var flipOrientation=$(clickThis).attr('flipOrientation');
        if (flipOrientation==0) {
            var rotateX=0;
            var rotateY=0+180;
            $(clickThis).attr('flipOrientation',1)
        }else if(flipOrientation==1){
            var rotateX=0;
            var rotateY=180+180;
            $(clickThis).attr('flipOrientation',0)
        }else if(flipOrientation==2){
            var rotateX=180;
            var rotateY=0+180;
            $(clickThis).attr('flipOrientation',3)
        }else if(flipOrientation==3){
            var rotateX=180;
            var rotateY=180+180;
            $(clickThis).attr('flipOrientation',2)
        }

        $(clickThis).find('img').css('transform','rotateX('+rotateX+'deg) rotateY('+rotateY+'deg)');
        //同步
       // $.isSynctoend('翻转',htmlType);
       $.dataSync('cancle','翻转');
        e.preventDefault();
        e.stopPropagation();
    })

//	绑定拉伸功能
// 	pillText($('#dragRightCenter')[0],'right');
// 	pillText($('#dragLeftCenter')[0],'left');

//	文字颜色功能按钮赋值
    var arr = $('.colorList__inner li');
    for (var i=0;i<arr.length;i++) {
        $(arr[i]).css('background',$(arr[i]).attr('data-color'))
    }

//文字功能按钮--字体按钮
    $('.fontbar').click(function (ev) {
        if($('.fontList').is(':hidden')){
            $('.fontList').show();
            $('.colorControls ').hide();
            $('.alignList').hide();
            $('.sizeList').hide();
            $('.spacingList').hide();
            $('.toolbar--transparency').hide();
            $('.toolbar--range').hide();
            var dataFamily = $('.fontbar').attr('font-family');
            $('.fontList__inner li').each(function(){
                var datafamily= $(this).attr('data-fontfamily');
                if (dataFamily == datafamily){
                    $(this).addClass('fontListSelect');
                    $(this).css('background-color', 'rgb(255,236,237)');
                    $(this).siblings('li').removeClass('fontListSelect').css('background-color', 'rgb(255,255,255)');
                }else{
                    $(this).removeClass('fontListSelect');
                    $(this).css('background-color', 'rgb(255,255,255)');
                }
            })
        }else{
            $('.fontList').hide();
        }

        ev.preventDefault();
        ev.stopPropagation();
    });

//文字功能按钮--字号按钮
    $('.sizebar').click(function (ev) {
        if($('.sizeList').is(':hidden')){
            $('.sizeList').show();
            $('.fontList').hide();
            $('.colorControls ').hide();
            $('.alignList').hide();
            $('.spacingList').hide();
            $('.toolbar--transparency').hide();
            $('.toolbar--range').hide();
            //变为可输入状态contenteditable
            var dataSize = $('.sizebar').val();
            $('.sizeList__inner li').each(function(){
                var datasize = $(this).attr('data-size');
                if (dataSize == datasize){
                    $(this).addClass('fontListSelect');
                    $(this).css('background-color', 'rgb(255,236,237)');
                    $(this).siblings('li').removeClass('fontListSelect').css('background-color', 'rgb(255,255,255)')
                }else{
                    $(this).removeClass('fontListSelect');
                    $(this).css('background-color', 'rgb(255,255,255)');
                }
            })
        }else{
            $('.sizeList').hide();
        }
        ev.preventDefault();
        ev.stopPropagation();
    });
    $('.sizeList__inner li').click(function (ev) {
        //var textSize = parseInt($('#page_content').css('width'))/par.width;
        var ev = ev||event;
        fontStand = orfontStand * sizeScale;
        var fontsize = $(this).attr('data-size');

        //当前可取的最小字号
        var currfontsize_min = (12/fontStand)*16;
        if (parseInt(fontsize) < Math.ceil(currfontsize_min)) {
            //实际生效的字号
            fontsize = Math.ceil(currfontsize_min);
        }

        var perSize = $.fontSizePxtoPer(fontsize);//尺寸百分比
        $(this).addClass('fontListSelect');
        $('.editTextBox').css('font-size',perSize);
        $('.TextInner').attr('fontsize',$(this).attr('data-size'));
        $(clickTextThis).css('font-size',perSize);
        $(clickTextThis).find('.innerText').attr('fontsize',fontsize);
        //拿到当前的行高比列
        var lineh = $('.LineSp').val();
        var lineH = lineh * (parseFloat(perSize)*fontStand/100);
        $('.editTextBox').css('line-height', lineH+'px');
        $(clickTextThis).css('line-height',lineH+'px');

        //文字大小改变时改变外层文字拉伸框的大小
        //拿到原来的height（）
        var orTop_ = (strTonumber($('.playTextBox').css('height')));
        var or_Width =  (strTonumber($('.playTextBox').css('width')));

        $('.editTextBox').css('height',$('.TextInner').css('height'));
        $('.playTextBox').css('height',$('.TextInner').css('height'));
        $(clickTextThis).css('height',$('.TextInner').css('height'));
        //宽度--拿到当前的 容器宽度，如果小于字体宽度，设置宽度等于字体宽度
        var w_box = strTonumber($('.editTextBox').css('width'));
        var size_w = (parseInt(perSize)/100)*fontStand;

        //重置拉伸参数

        //设置操作框的两边拖拽按钮的位置
        var changeTop_ = (strTonumber($('.playTextBox').css('height')));
        p3.width = or_Width;
        p3.height = orTop_;
        p3.x = strTonumber($('.editTextBox').css('left'));
        p3.y = strTonumber($('.editTextBox').css('top'));
        var point_ = {};
        point_.x = strTonumber($('.editTextBox').css('left'));
        point_.y = strTonumber($('.editTextBox').css('top'));
        point_.width = or_Width;
        point_.height = orTop_;

        reDraw(point_,getmatrix($('.editTextBox').css('transform')),changeTop_);

        if(w_box < size_w ){
            $('.editTextBox').css('width',size_w+'px');
            $('.playTextBox').css('width',size_w+'px');
            $('.TextInner').css('width',size_w+'px')
        }

        $('.sizeList').hide();
        $('.sizebar').val($(this).attr('data-size'));
        //同步
        //$.isSynctoend('文字大小',htmlType);
        $.dataSync('cancle','文字大小');
        ev.preventDefault();
        ev.stopPropagation();
    });
    $('.sizeList__inner li').hover(function (ev) {
        $(this).siblings('li').css('background-color', 'rgb(255,255,255)');
        $(this).css('background-color', 'rgb(255,236,237)')
    },function(){
        var dataSize = $('.sizebar').val();
        $('.sizeList__inner li').each(function(){
            var datasize = $(this).attr('data-size');
            if (dataSize == datasize){
                $(this).addClass('fontListSelect');
                $(this).css('background-color', 'rgb(255,236,237)');
                $(this).siblings('li').removeClass('fontListSelect').css('background-color', 'rgb(255,255,255)')
            }
        })
    });
//文字功能按钮--文字排列方式按钮
    $('.alignbar').click(function (ev) {
        if($('.alignList').is(':hidden')){
            $('.alignList').show();
            $('.fontList').hide();
            $('.colorControls ').hide();
            $('.sizeList').hide();
            $('.spacingList').hide();
            $('.toolbar--transparency').hide();
            $('.toolbar--range').hide();
        }else{
            $('.alignList').hide();
        }

        ev.preventDefault();
        ev.stopPropagation();
    })
    $('.alignList div').click(function (ev) {
        var ev = ev||event;
        var textAlign = $(this).attr('data-align');
        $('.editTextBox').css('text-align',textAlign);
        $(clickTextThis).css('text-align',textAlign);
        $('.textAlign').attr('data-align',textAlign);
        $('.alignbar ').css('background-image','url("../../images/workimg/text-align-'+textAlign+'.svg")');
        $(this).siblings('div').css('background-color', 'rgb(255,255,255)');
        $(this).css('background-color', 'rgb(255, 236, 237)');

        //同步
        //$.isSynctoend('对齐方式',htmlType);
        $.dataSync('cancle','对齐方式');
        ev.preventDefault();
        ev.stopPropagation();
    });
//文字功能按钮--文字颜色按钮
    $('.colorbar').click(function (ev) {
        var ev = ev||event;
        changeImgColor(this,ev,'text');
        $('.fontList').hide();
        $('.toolbar--transparency').hide();
        $('.alignList').hide();
        $('.sizeList').hide();
        $('.spacingList').hide();
        $('.toolbar--range').hide();
        ev.preventDefault();
        ev.stopPropagation();
    })
/*    $('.colorList__inner li').click(function (ev) {
       // alert(2);
        var ev = ev||event;
        var color = $(this).attr('data-color');
        $('.editTextBox').css('color',color);
        $(clickTextThis).css('color',color);
        $('.colorList').hide();
        $('.colorbar').css('background',color);
        //同步
        //$.isSynctoend('颜色修改',htmlType);
        $.dataSync('cancle','颜色修改');
        ev.preventDefault();
        ev.stopPropagation();
    });*/
//文字功能按钮--间距按钮
    $('.spacingbar').click(function () {
        //判断是开启还是关闭
        if($('.spacingList').is(':hidden')){
            $('.spacingList').show();
            $('.colorList').hide();
            $('.fontList').hide();
            $('.alignList').hide();
            $('.sizeList').hide();
            $('.toolbar--transparency').hide();
            $('.toolbar--range').hide();
        }else{
            $('.spacingList').hide();
        }

    });
//文字功能按钮--字间距按钮-----滑动
    $('.wordSpacing')[0].onmousedown=function () {
        var orTop_ = (strTonumber($('.playTextBox').css('height')));
        var or_Width =  (strTonumber($('.playTextBox').css('width')));
        var point_ = {};
        point_.x = strTonumber($('.editTextBox').css('left'));
        point_.y = strTonumber($('.editTextBox').css('top'));
        point_.width = or_Width;
        point_.height = orTop_;
        document.onmousemove=function () {
            var val = $('.wordSpacing').val();
            $('.showSpacing').html(val);
            var spacRem = $.letterSpacePxtoRem(val);
            //拿到原来的height（）
            //var numberemtopx = val*fontStand/1000;
            //console.log('改变前高度：'+orTop_);
            $('.editTextBox').css('letter-spacing',spacRem);
            $('.editTextBox').find('.TextInner').attr('letterspacing',spacRem);

            $('.editTextBox').css('height',$('.TextInner').css('height'));
            $('.editTextBox').css('width',$('.TextInner').css('width'));

            $(clickTextThis).css('height',$('.TextInner').css('height'));
            $(clickTextThis).css('width',$('.TextInner').css('width'));
            $(clickTextThis).css('letter-spacing',spacRem);
            $('.playTextBox').css('height', $('.TextInner').css('height'));
            $('.playTextBox').css('width',$('.TextInner').css('width'));


            var changeTop_ = (strTonumber($('.playTextBox').css('height')));
            p3.width = or_Width;
            p3.height = orTop_;
            p3.x = strTonumber($('.editTextBox').css('left'));
            p3.y = strTonumber($('.editTextBox').css('top'));
            reDraw(point_,getmatrix($('.editTextBox').css('transform')),changeTop_);

        };
        document.onmouseup=function () {
            //同步

            $.dataSync('cancle','字间距');
            document.onmousemove=null;
        }
    };
    $('.wordSpacing').on('change', function(){
        var orTop_ = (strTonumber($('.playTextBox').css('height')));
        var or_Width =  (strTonumber($('.playTextBox').css('width')));
        var point_ = {};
        point_.x = strTonumber($('.editTextBox').css('left'));
        point_.y = strTonumber($('.editTextBox').css('top'));
        point_.width = or_Width;
        point_.height = orTop_;
        var val = $('.wordSpacing').val();
        $('.showSpacing').html(val);
        var spacRem = $.letterSpacePxtoRem(val);
        //拿到原来的height（）
        //var numberemtopx = val*fontStand/1000;
        //console.log('改变前高度：'+orTop_);
        $('.editTextBox').css('letter-spacing',spacRem);
        $('.editTextBox').find('.TextInner').attr('letterspacing',spacRem);

        $('.editTextBox').css('height',$('.TextInner').css('height'));
        $('.editTextBox').css('width',$('.TextInner').css('width'));

        $(clickTextThis).css('height',$('.TextInner').css('height'));
        $(clickTextThis).css('width',$('.TextInner').css('width'));
        $(clickTextThis).css('letter-spacing',spacRem);
        $('.playTextBox').css('height', $('.TextInner').css('height'));
        $('.playTextBox').css('width',$('.TextInner').css('width'));


        var changeTop_ = (strTonumber($('.playTextBox').css('height')));
        p3.width = or_Width;
        p3.height = orTop_;
        p3.x = strTonumber($('.editTextBox').css('left'));
        p3.y = strTonumber($('.editTextBox').css('top'));
        reDraw(point_,getmatrix($('.editTextBox').css('transform')),changeTop_);
        $.dataSync('cancle','字间距');

    })
//文字功能按钮--行距按钮-----滑动
    $('.LineSp')[0].onmousedown=function () {
        //var textSize = parseInt($('#page_content').css('width'))/par.width;
        //拿到原来的height（）
        var orTop_ = (strTonumber($('.playTextBox').css('height')));
        var or_Width =  (strTonumber($('.playTextBox').css('width')));

        //fontStand = orfontStand * sizeScale;

        var point_ = {};
        point_.x = strTonumber($('.editTextBox').css('left'));
        point_.y = strTonumber($('.editTextBox').css('top'));
        point_.width = or_Width;
        point_.height = orTop_;
        //获取当前字体
        var curFontsize = $('.TextInner').css('font-size');
        document.onmousemove=function () {
            var val = $('.LineSp').val();
            $('.TextInner').attr('lineheight',val);
            $('.showLine').html(val);
            //console.log('原始:'+orTop_);
            //计算当前的 行高
            var lh_ = parseFloat(curFontsize)*val;

            $('.editTextBox').css('line-height',lh_+'px');
            $('.editTextBox').css('height',$('.TextInner').css('height'));
            $('.editTextBox').css('width',$('.TextInner').css('width'));

            $(clickTextThis).css('line-height',lh_+'px');
            $(clickTextThis).css('height',$('.TextInner').css('height'));
            $(clickTextThis).css('width',$('.TextInner').css('width'));

            $('.playTextBox').css('height',$('.TextInner').css('height'));
            $('.playTextBox').css('width',$('.TextInner').css('width'));

            var changeTop_ = (strTonumber($('.playTextBox').css('height')));
            p3.width = or_Width;
            p3.height = orTop_;
            p3.x = strTonumber($('.editTextBox').css('left'));
            p3.y = strTonumber($('.editTextBox').css('top'));
            reDraw(point_,getmatrix($('.editTextBox').css('transform')),changeTop_);
        };
        document.onmouseup=function () {
            //同步
            $.dataSync('cancle','行距');
            document.onmousemove=null;
        }
    }
    $('.LineSp').on('change', function(){
        //拿到原来的height（）
        var orTop_ = (strTonumber($('.playTextBox').css('height')));
        var or_Width =  (strTonumber($('.playTextBox').css('width')));

        //fontStand = orfontStand * sizeScale;

        var point_ = {};
        point_.x = strTonumber($('.editTextBox').css('left'));
        point_.y = strTonumber($('.editTextBox').css('top'));
        point_.width = or_Width;
        point_.height = orTop_;
        //获取当前字体
        var curFontsize = $('.TextInner').css('font-size');
        var val = $('.LineSp').val();
        $('.TextInner').attr('lineheight',val);
        $('.showLine').html(val);
        //console.log('原始:'+orTop_);
        //计算当前的 行高
        var lh_ = parseFloat(curFontsize)*val;

        $('.editTextBox').css('line-height',lh_+'px');
        $('.editTextBox').css('height',$('.TextInner').css('height'));
        $('.editTextBox').css('width',$('.TextInner').css('width'));

        $(clickTextThis).css('line-height',lh_+'px');
        $(clickTextThis).css('height',$('.TextInner').css('height'));
        $(clickTextThis).css('width',$('.TextInner').css('width'));

        $('.playTextBox').css('height',$('.TextInner').css('height'));
        $('.playTextBox').css('width',$('.TextInner').css('width'));

        var changeTop_ = (strTonumber($('.playTextBox').css('height')));
        p3.width = or_Width;
        p3.height = orTop_;
        p3.x = strTonumber($('.editTextBox').css('left'));
        p3.y = strTonumber($('.editTextBox').css('top'));
        reDraw(point_,getmatrix($('.editTextBox').css('transform')),changeTop_);
        $.dataSync('cancle','行距');
    })

//	自调用获取字体列表,绑定点击更换字体
    ;(function () {
        $.ajax({
            type:"post",
            url:config.getFontfamily,
            data:{
                'authorityKey':'9670f10b8b17ea61010375bfbe08138d',
                'userID':userInfo.userID,
                'token':userInfo.token,
                'pageNumber':1,
                'perPageSize':100
            },
            success:function (data) {
                var res = JSON.parse(data);
                var arr = res.result;
                for (var i=0;i<arr.length;i++) {
                    var str = arr[i].ttfName;
                    var str2 = arr[i].showText;
                    var base = new Base64();
                    var s2 = base.decode(str2);
                    var s1 = str.substring(0,str.length-4);
                    var fontObj = {
                        'fontttf':s1,
                        'fontChina':s2
                    };
                    par.fontList.push(fontObj);
                    var $li = '';
                    if(arr[i].typeUser == 1){
                        $li += '<li class="vip" data-fontfamily='+s1+' data-chinaName='+s2+'><img src="'+arr[i].showTtfUrl+'" /><li/>';
                    }else{
                        $li += '<li data-fontfamily='+s1+' data-chinaName='+s2+'><img src="'+arr[i].showTtfUrl+'" /><li/>';
                    }

                    var $parent = $(".fontList__inner");
                    $parent.append($li);
                }
            }
        });
    })();

    $('.fontList__inner').on('click','li',function(){
            var ev = ev||event;
            $(this).addClass('fontListSelect');
            var fontfamily = $(this).attr('data-fontfamily');
            var fant_china =  $(this).attr('data-chinaName');
            //拿到当前的字体图片
            var fontNameul = $(this).find('img').attr('src');
            //判断字体是否加载过
            var isfamily = isSupportFontFamily(fontfamily);
            $('.fontList').hide();

            if(!isfamily){
                //等待字体加载
                $('.loading_font').show();
                $.ajax({
                    type:"post",
                    url:config.getDownloadFontUrl,
                    data:{
                        'authorityKey':'9670f10b8b17ea61010375bfbe08138d',
                        'userID':userInfo.userID,
                        'token':userInfo.token,
                        'ttfName':fontfamily+'.ttf'
                    },
                    success:function (data) {
                        var res = JSON.parse(data);
                        var thisEle = $('.editTextBox');

                        //loadFont(fontfamily);
                        var newStyle = document.createElement('style');
                        var fontUrl = res.fontUrl;
                        newStyle.appendChild(document.createTextNode("\
                        @font-face {\
                          font-family: '" +fontfamily + "';\
                          src: url('"+fontUrl+"');\
                        }\
                        "));
                        document.head.appendChild(newStyle);
                        //检测字体
                        /*fontSpy(fontfamily, {
                            success: function() {
                                // 设置字体为
                                $('.editTextBox').css('font-family',fontfamily);
                                $('.fontbar').html(fontfamily);
                                $('.text_font').hide();
                            },
                            failure: function() {
                                alert('字体加载失败');
                                $('.text_font').hide();
                            }
                        });*/
                        $.checkFont([fontfamily]);
                        $('.fontList').hide();
                    },
                    error:function(){
                        $('.text_font').hide();
                        alert('字体请求失败');
                    }
                });
            }else{
                $('.editTextBox').css('font-family',fontfamily);
                $(clickTextThis).css('font-family',fontfamily);
                $('.fontbar').html(fant_china);
                $('.fontbar').attr('font-family',fontfamily);
            }
            //同步
            //$.isSynctoend('字体',htmlType);
            $.dataSync('cancle','字体');
            ev.preventDefault();
            ev.stopPropagation();
    })
    $('.fontList__inner').on('mouseenter','li',function(){
        $(this).siblings('li').css('background-color', 'rgb(255,255,255)');
        $(this).css('background-color', 'rgb(255,236,237)')
    })
    $('.fontList__inner').on('mouseleave','li',function(){
        var dataFamily = $('.fontbar').attr('font-family');
        $('.fontList__inner li').each(function(){
            var datafamily= $(this).attr('data-fontfamily');
            if (dataFamily == datafamily){
                $(this).addClass('fontListSelect');
                $(this).css('background-color', 'rgb(255,236,237)');
                $(this).siblings('li').removeClass('fontListSelect').css('background-color', 'rgb(255,255,255)');
            }
        })
    })
//动态加载注册字体
//var newStyle = document.createElement('style');
//newStyle.appendChild(document.createTextNode("\
//@font-face {\
//  font-family: 'aa';\
//  src: url(' http://www.photostars.cn/huaWenFont/STFangsong.ttf ');\
//}\
//"));
//document.head.appendChild(newStyle);
    function zoomBoxDarg (obj,obj2) {
        var boj = obj;
        boj.onmousedown=function (ev) {
            ev.preventDefault();
            var oEvent=ev||event;
            var deltaX = event.pageX - parseInt($(boj).css('left'));
            var deltaY = event.pageY - parseInt($(boj).css('top'));
            document.onmousemove = function (ev) {
                var moveEvent=ev||event;
                moveEvent.preventDefault();
                moveEvent.stopPropagation();
                var event = window.event;
                var x  = event.pageX - deltaX;
                var y = event.pageY - deltaY;
                $(obj2).css({'left':x+'px','top':y+'px'});
            };
            document.onmouseup = function () {
                //$.isSynctoend('zoomBoxDarg',htmlType);
                $.dataSync('cancle','zoomBoxDarg');
                document.onmousemove = null;
                document.onmouseup = null;
            }
            oEvent.preventDefault();
            oEvent.stopPropagation();
        };
    }
//外部文字操作框的拖拽
    var textMoveObj = $('#Textmove')[0];
    var obj2 = document.getElementsByClassName('playTextBox');
    textMoveObj.onmousedown=function (ev) {
        ev.preventDefault();
        var oEvent=ev||event;
        var deltaX = event.pageX - strTonumber($(textMoveObj).css('left'));
        var deltaY = event.pageY - strTonumber($(textMoveObj).css('top'));

        //当前父元素的left,top
        var currP_x = strTonumber($(obj2).css('left'));
        var currP_y = strTonumber($(obj2).css('top'));
        ///获取鼠标点击相对于父元素的位置

        var eventP_x = event.pageX - 438 - strTonumber($(obj2).css('left'));
        var eventP_y = event.pageY - 55 - strTonumber($(obj2).css('top'));


       // console.log('鼠标点击x：'+deltaX+'鼠标点击y：'+deltaY);
        document.onmousemove = function (ev) {
            var moveEvent=ev||event;
            moveEvent.preventDefault();
            moveEvent.stopPropagation();
            var event = window.event;

            //获取鼠标移动过程中的位置
            var moveMouse_x = moveEvent.pageX;
            var moveMouse_Y = moveEvent.pageY;

            //设置当前父元素的left top
            var moveP_x = moveMouse_x - 438 - eventP_x;
            var moveP_y = moveMouse_Y - 55 - eventP_y;

            $('.playTextBox').css({'left':moveP_x+'px','top':moveP_y+'px'});
            $('.editTextBox ').css({'left':moveP_x+'px','top':moveP_y+'px'});
            $(clickTextThis).css({
                'left':moveP_x-strTonumber($('#page_content').css('left'))+'px',
                'top':moveP_y-strTonumber($('#page_content').css('top'))-strTonumber($('#page_content').css('margin-top'))+'px'
            });
        };
        document.onmouseup = function (ev) {
        	var e = ev||event;
            p3 = {
                x: strTonumber($('.playTextBox').css('left')),
                y: strTonumber($('.playTextBox').css('top')),
                height: strTonumber($('.playTextBox').css('height')),
                width: strTonumber($('.playTextBox').css('width')),
                rotate: getmatrix($('.playTextBox').css('transform'))
            }
            
            if(oEvent.pageX==e.pageX&&oEvent.pageY==e.pageY){
            	$('.TextInner').blur();
            }
            $.firstOnkey=true;//更改原始值
            document.onmousemove = null;
            document.onmouseup = null;

            //同步
           // $.isSynctoend('文字框移动',htmlType);
           $.dataSync('cancle','文字框移动');
            //修改保存状态
           /* if(par.isSave){
                $('.saveType').text('未保存的更改');
                par.isSave = false;
                var saveSetTimeout = window.setTimeout(function(){
                    $('.saveType').text('保存中');
                    //console.log(JSON.stringify($.templateSysn));
                    $.dataSync('sync');
                    clearTimeout(saveSetTimeout);
                    saveSetTimeout = null;
                },3000);
            }*/

        }
        oEvent.preventDefault();
        oEvent.stopPropagation();
    };
    

//裁剪点击事件
    $('.cut').click(function () {
        $(clickThis).trigger('dblclick');
    })

//删除元素按钮
    $('.remove').click(function () {
    	if($(ElementThis).attr('isbackground')!=true&&$(ElementThis).attr('isbackground')!='true'){
    		$(ElementThis).removeClass('selected');
    		$(ElementThis).remove();
    		$('.toolbarWrapper').slideUp();
    		$('.zoomImgbox').hide();
    		$('.editTextBox').hide();
    		$('.playTextBox').hide();
    		//同步
//  		$.isSynctoend('删除',htmlType)
    		$.dataSync('cancle','删除');
    	}
    })
//打开图层排列功能按钮
    $('.toolbar__item--range').click(function (ev) {
        var e = ev || event;
        if($('.toolbar--range').is(':hidden')){
            $('.toolbar--range').show(200);
             $('.spacingList').hide();
            $('.colorList').hide();
            $('.fontList').hide();
            $('.alignList').hide();
            $('.sizeList').hide();
            $('.toolbar--transparency').hide();
        }else{
            $('.toolbar--range').hide(200);
        }
        var index = $(ElementThis).index();
   		var objArr = $('#page_content>.element');
   		var length = objArr.length;
   		var indexOf = $(ElementThis).index();
		index = length-1-indexOf;//反转数组的index做显示
	    if(index==0){
	    	$('.up>button').prop('disabled',true);
	        $('.up>button').css('color','#bbb');
	    }else{
	        $('.up>button').prop('disabled',false);
	        $('.up>button').css('color','#000');
	    }
	    if(index==objArr.length-1){
	        $('.down>button').prop('disabled',true);
	        $('.down>button').css('color','#bbb');
	    }else{
	    	$('.down>button').prop('disabled',false);
	        $('.down>button').css('color','#000');
	    }
        
        e.preventDefault();
        e.stopPropagation();
    })

//文字输入框获取焦点
    $('.TextInner').click(function () {
        if ($(clickTextThis).css('display')=='none') {
            return;
        }else{
            $('.editTextBox').css('opacity',1);
            $(clickTextThis).hide();
//		drawText($('.TextInner').html(),false,true);
        }
    })


//打开网格间距切换功能框
$('.gridBtn').click(function () {
	$('.GridSpacing').show(200);
	var val = parseInt($(clickgridThis).find('.item_content').css('left'));
	$('.Gridinput').val(val);
    $('.showGridinput').html(val);
})

//网格切换间距功能
    $('.Gridinput')[0].onmousedown=function () {
        document.onmousemove=function () {
            var val = $('.Gridinput').val();
            $('.showGridinput').html(val);
            $(clickgridThis).find('.item_content').css({
            								'left':val+'px',
            								'right':val+'px',
            								'top':val+'px',
            								'bottom':val+'px'
           								 })
        };
        document.onmouseup=function () {
            document.onmousemove=null;
        }
    }

})//$function   END   ↑
// font: 字体名称，ele: 要使用此字体的元素
function loadFont(fontfamily) {
    // 每 0.05 秒检查一次是否加载
    var interval_check = setInterval(function() {
        // 宽度变化，说明字体被加载
        if(isSupportFontFamily(fontfamily)) {
            clearInterval(interval_check);
            // 设置字体为
            $('.editTextBox').css('font-family',fontfamily);
            $('.text_font').hide();
        }
    }, 50);
}
//获取当前是发布页还是下载页
var  htmlHref = window.location.href;
if(htmlHref.search("publish") != -1){
    //发布页
    var htmlType = 'pub';
}else if(htmlHref.search("design") != -1){
    //下载页
    var htmlType = 'down';
}
//单击时选中的网格内元素对象
var clickCutGridThis;
//单击时选中的整体网格对象
var clickgridThis;
//单击时选中的对象(所有元素共用)
var ElementThis;
//单击时选中的图片对象
var clickThis;
//单击时选中的文本对象
var clickTextThis;
//用来标识拖拽函数当前是否可以进行拖拽
var Isdrag=true;
//用来标识是否在裁剪过程中
var cutIng=false;
//封装编辑区域元素的拖拽方法     ↓
function dragDom(dom) {
	var boj = dom;
		boj.onmousedown=function (ev) {
	        $('.search input').blur();//让搜索框的input失去焦点
			if(Isdrag){//判断当前阶段元素是否可以拖拽移动
//				ev.preventDefault();
				var oEvent=ev||event;
				var deltaX = event.pageX - strTonumber($(boj).css('left'));
           		var deltaY = event.pageY - strTonumber($(boj).css('top'));
				var deltaX0 = event.pageX - strTonumber($('.zoomImgbox').css('left'));
           		var deltaY0 = event.pageY - strTonumber($('.zoomImgbox').css('top'));
				
				var divX = $(boj).offset().left;
				var divY = $(boj).offset().top;
				var divX0 = $('.zoomImgbox').offset().left;
				var divY0 = $('.zoomImgbox').offset().top;
				
				var parentX = $(boj).parent().offset().left;
				var parentY = $(boj).parent().offset().top;
				var parentX0 = $('.zoomImgbox').parent().offset().left;
				var parentY0 = $('.zoomImgbox').parent().offset().top;
				
				//给网格元素添加mouseover事件
				//用于标识正在拖拽移动中的元素
                boj.focus();
                $.moveToEnd(boj); 
				moveclick=boj;
				if ($(boj).hasClass('image')&&$(boj).attr('isbackground')!='true') {
					//绑定网格元素的移入移出事件
					var url = $(boj).find('img').attr('src');
					bindGridmouse(url);
				}
				
				document.onmousemove = function (ev) {

					//用于防止网格元素的mouseover不生效
					$(moveclick).css('pointer-events','none');
					
					var moveEvent=ev||event;
					moveEvent.preventDefault();
					moveEvent.stopPropagation();
					var event = window.event;
			        var x  = event.pageX - deltaX;
			        var y = event.pageY - deltaY;
			        var x0  = event.pageX - deltaX0;
			        var y0 = event.pageY - deltaY0;
//					移动其他元素时隐藏缩放外部框,如果为当前元素唤起的外部框，所其一起拖拽移动
                if(boj!=ElementThis){
                    $('.zoomImgbox').hide();
//						移动元素时隐藏顶部按钮栏
                    $('.toolbarWrapper').hide();
                }else{
                    $('.zoomImgbox').css({
                        'left':x0+'px',
                        'top':y0+'px',
                    });
                }

//              如果当前拖拽的对象是背景元素时,其位置为起始点或者操作框没有出现的情况下使其不能位移
                if($(boj).hasClass('backgroundColor')&&$('.zoomImgbox').css('display')=='none'){
                	return;
                }else{
                	$(boj).css({'left':x+'px','top':y+'px'});
                }
              
//					同步四角缩放函数所需数据
                p.x = x;
                p.y = y;
            };
            document.onmouseup = function (ev) {
                document.onmousemove = null;
                document.onmouseup = null;
//					同步透明度
                $('.transparencySliderInput').val($(boj).css('opacity')*100);
                $('.toolbar__sliderValue').val($(boj).css('opacity')*100);
                //建组
//              multiSlected(ev,boj);
				//将编辑层绘制到视图层
		        if($('.editTextBox').css('display')!='none'){
		            var listStyle = $('.list-icon ').attr('list-layout');
		            var text = $('.TextInner').html();
		            drawText(text,listStyle);
                    $.dataSync('cancle','键盘抬起输入文字');
		        }
                //正常编辑状态，建组状态 不执行下面的代码
                if(ev.shiftKey != 1){
                    //清空建组元素
                    par.groupList = [];
                    //修改保存状态
                   // $.isSynctoend('dragDom鼠标抬起',htmlType);
                   $.dataSync('cancle','编辑框拖动事件源');
                    ElementThis = boj;//如果单机选中该元素，将该元素传递给外层变量
                    $('.toolbarBox').hide();
                    $('.toolbar--range').hide();
                    $(boj).siblings(".element").removeClass("selected");
                    //如果没有进行位置更改并且不是在裁剪过程中的话模拟单机事件，显示外部缩放框
                    if(divX==$(boj).offset().left&&divY==$(boj).offset().top&&cutIng==false&&$(boj).attr('elementtype')!='text'&&$(boj).attr('elementtype')!='grid'&&$(boj).attr('isbackground')!='true'){
//						var e = ev||event;
                        //用来区分复制功能的元素
                        $.iscopy = 'copyImg';

                        $('.editTextBox').removeClass('selected');
                        $('.toolbarWrapper').show(400); //顶部颜色操作框
                        $(boj).addClass('selected');

                        $('.imgBoxbtn').slideDown();//显示顶部图片操作按钮（翻转）
                        $('.toolbarFont').hide();//顶部文字功能按钮隐藏
                        var target = boj;
                        clickThis = boj;//如果单机选中该元素，将该元素传递给外层变量

                        var targetWidth = strTonumber($(target).css('width'));
                        var targetHeight = strTonumber($(target).css('height'));
                        var targetLeft = strTonumber($(target).css('left'));
                        var targetTop = strTonumber($(target).css('top'));
                        //  点击元素距离整个操作区域的坐标
                        var targetWorkX = targetLeft + parseInt($('.page_content').css('left'));
                        var targetWorkY = targetTop + parseInt($('.page_content').css('top'))+parseInt($('.page_content').css('margin-top'));
						
						$('.zoomImgbox').css({
						    'width':targetWidth + 'px',
						    'height':targetHeight + 'px',
						    'left':targetWorkX + 'px',
						    'top':targetWorkY + 'px',
						    'transform':$(target).css('transform')
						}).show();
						
                        init();
//						e.preventDefault();
//						e.stopPropagation();
                        //如果没有进行位置更改并且不是在裁剪过程中的话模拟单机事件，显示外部文字操作框
                    }else if(divX==$(boj).offset().left&&divY==$(boj).offset().top&&cutIng==false&&$(boj).attr('elementtype')=='text'){
                        $('.toolbarWrapper').show(400); //顶部颜色操作框
                        $(boj).addClass('selected');
                        //文字操作
                        $.iscopy = 'copyText';
                        $('.editTextBox').addClass('selected');
                        var target = boj;
                        clickTextThis = boj;//如果单机选中该文本元素，将该元素传递给外层变量
                        var word = $(clickTextThis).find('.innerText').html();
                        var listType = $(clickTextThis).find('.innerText').attr('list-layout');
                        //判断是否为标题

                        $('.TextInner').html(word);
                        $('.TextInner').css('width',$(clickTextThis).find('.innerText').css('width')).css('font-size','inherit');
                        /*当前最小字号*/
                        var currfontsize_min = (12/fontStand)*16;
                        /*数据字号*/
                        var font_ = $(clickTextThis).find('.innerText').attr('fontsize');
                        if (font_ < Math.ceil(currfontsize_min)) {
                            font_ = Math.ceil(currfontsize_min);
                        }
                        var fontSize_ = font_;//拿到的是字号
                        var currSize_per = fontSize_*100/orfontStand+'%';
                        var letterSpacing_ = $(clickTextThis).find('.innerText').attr('letterspacing');
                        /*-------------------新加------------------*/
                        //var numberemtopx = Number(letterSpacing_)*fontStand;
                        var line_h = strTonumber($(clickTextThis).find('.innerText').css('line-height'));
                        var istitle_ = $(clickTextThis).find('.innerText').attr('titlebg');
                        var isrotate_ = $(clickTextThis).find('.innerText').attr('isrotate');
//						文字内容编辑框
                        $('.editTextBox').css('width',strTonumber($(clickTextThis).css('width'))+'px').css('height',strTonumber($(clickTextThis).css('height')) + 'px')
                            .css('left',strTonumber($(clickTextThis).css('left'))+strTonumber($('#page_content').css('left'))+'px')
                            .css('top',strTonumber($(clickTextThis).css('top'))+strTonumber($('#page_content').css('top'))+strTonumber($('#page_content').css('margin-top'))+'px')
                            .css('font-size',currSize_per)
                            .css('transform',$(clickTextThis).css('transform'))
                            .css('font-family',$(clickTextThis).css('font-family'))
                            .css('font-weight',$(clickTextThis).css('font-weight'))
                            .css('color',$(clickTextThis).css('color'))
                            .css('letter-spacing',letterSpacing_)
                            .css('line-height',line_h+'px')
                            .css('text-align',$(clickTextThis).css('text-align'))
                            .css('vertical-align',$(clickTextThis).css('vertical-align'))
                            .css('font-style',$(clickTextThis).css('font-style'))
                            .css('opacity',$(clickTextThis).css('opacity'));

//						文字旋转拉伸框
                        $('.playTextBox').show();
                        $('.playTextBox').css('width',$('.editTextBox').css('width'))
                            .css('height',$('.editTextBox').css('height'))
                            .css('left',$('.editTextBox').css('left'))
                            .css('top',$('.editTextBox').css('top'))
                            .css('transform',$(clickTextThis).css('transform'));
                        //键盘事件开关
                        //$.onkey = true;
                        $('.editTextBox').show();
                        //添加一些自定义属性
                        $('.TextInner').attr('list-layout',listType);

                        $('.TextInner').attr('letterspacing',letterSpacing_);
                        $('.TextInner').attr('fontsize',$(clickTextThis).find('.innerText').attr('fontsize'));
                        $('.TextInner').attr('lineheight',$(clickTextThis).find('.innerText').attr('lineheight'));
                        $('.editTextBox').attr('elementtype',$(clickTextThis).attr('elementtype'));
                        $('.editTextBox').attr('data-index',$(clickTextThis).attr('data-index'));
                        if(istitle_ == '1'){
                            $('.TextInner').attr('titlebg',istitle_);
                        }else{
                            $('.TextInner').attr('titlebg','0');
                        }

                        //编辑区拖拽层
                        var palyEle = document.getElementsByClassName('playTextBox');

//						删除操作区域内已有的该文本节点
                        $(clickTextThis).hide();

                        $('.zoomImgbox').hide();
                        $('.imgBoxbtn').hide();

//						打开颜色选择框时将当前字体的各种属性带如文字功能按钮
                        showTextAttribute();
                        //显示顶部文字操作功能按钮
                        $('.toolbarFont').show();
                        inittext();

//                      设置光标
                        po_Last_Div($('.TextInner')[0]);

                        //网格元素模拟单击时选中(mousedown和mouseup时坐标没变化即为单击)
                    }else if(divX==$(boj).offset().left&&divY==$(boj).offset().top&&cutIng==false&&$(boj).attr('elementtype')=='grid'){

                        //用来区分复制功能的元素
                        $.iscopy = 'copyGrid';

                        $('.editTextBox').removeClass('selected');
                        $('.toolbarWrapper').show(400); //顶部颜色操作框
                        $(boj).addClass('selected');

                        $('.imgBoxbtn').slideDown();//显示顶部图片操作按钮（翻转）
                        $('.toolbarFont').hide();//顶部文字功能按钮隐藏
                        var target = boj;
                        clickgridThis = boj;//如果单机选中该元素，将该元素传递给外层变量
                        clickThis=boj;
                        var targetWidth = parseInt($(target).css('width'));
                        var targetHeight = parseInt($(target).css('height'));
                        var targetLeft = parseInt($(target).css('left'));
                        var targetTop = parseInt($(target).css('top'));
                        //  点击元素距离整个操作区域的坐标
                        var targetWorkX = targetLeft + parseInt($('.page_content').css('left'));
                        var targetWorkY = targetTop + parseInt($('.page_content').css('top'))+parseInt($('.page_content').css('margin-top'));

                        $('.zoomImgbox').css({
                            'width':targetWidth + 'px',
                            'height':targetHeight + 'px',
                            'left':targetWorkX + 'px',
                            'top':targetWorkY + 'px',
                            'transform':$(target).css('transform')
                        }).show();

                        initGrid();

                    }

                    //移除网格元素的移入移出事件
                    //用于防止网格元素的mouseover不生效
                    $(moveclick).css('pointer-events','auto');
                    unbindGridmouse();
                    if (isGrid==true) {
                    	
                        $(moveclick).remove();
                        $('.zoomImgbox').hide();
                        isGrid=false;
                        var $parent = $(ev.target).parents('.item_content');
                        
                		$('.item_content').removeClass('gridOn');
						$parent.addClass('gridOn');
						clickCutGridThis=$parent[0];
						//console.log(clickCutGridThis)
                        
                        $(clickCutGridThis).attr('elementType','img');
                    }
                }

				}
				oEvent.preventDefault();
				oEvent.stopPropagation();
				
			}else{//判断当前阶段元素是否可以拖拽移动
				return;
			}
		};
}
//封装拖拽事件END ↑


//封装双击编辑图片事件    ↓
var centerObj={
    x:0,
    y:0
};
var centerObj2={
    x:0,
    y:0
};
var newCenter = {
    x:parseInt($('.viewPort').css('width'))/2,
    y:parseInt($('.viewPort').css('height'))/2,
}
var oldThis={
    x:0,
    y:0
};
var dblclickThis;//双击选中的编辑元素
function imgDblclick($dom) {
    $dom.dblclick(function(e){
//		隐藏选中的图片元素
        $(clickThis).addClass('cropping');

        if (cutIng==true) {
            return;
        }
        //图片编辑区显示
        $('.cropControls').show();
        //重置外部裁剪框END
        var t = this;//双击时选中的对象
        //裁剪确定按钮出现
        $('.cutingBoxbtn').slideDown();
//		双击打开图片裁剪页面时取消其他元素拖拽事件
        Isdrag=false;
//		进入裁剪界面时将是否进入裁剪标识符的值进行更改
        cutIng=true;
//		进入裁剪界面时隐藏外部缩放框
        $('.zoomImgbox').hide();
//		进入裁剪界面时隐藏翻转按钮
        $('.imgBoxbtn').hide();
        $('.toolbarFont').hide();//顶部文字功能按钮隐藏
//		如果img的left值为字符串的话更改为数值
        if($(this).find('.zoomimg').css('left')=='auto'){
            $(this).find('.zoomimg').css('left','0px')
            $(this).find('.zoomimg').css('top','0px')
        }
        editorObjClassname=$(this).attr('class');
        var e = e||event;
        $dom.css('overflow','visible');
        //显示裁剪时的外层box
        $('.mask').addClass('on');

        var iscutout = $(this).attr('iscutout');
        if (iscutout=='true'||iscutout==true) {
            //裁剪过的话取已经存储的参数
            var obj={
                x0:parseInt($(this).css('left'))+parseInt($(this).find('.zoomimg').css('left')) + parseInt($('.page_content').css('left')) ,
                y0:parseInt($(this).css('top'))+parseInt($(this).find('.zoomimg').css('top')) + parseInt($('.page_content').css('top')) + parseInt($('.page_content').css('margin-top')) ,
            }
            var obj2={
                x1:parseInt($(this).css('left')) +parseInt($('.page_content').css('left')) - obj.x0,
                y1:parseInt($(this).css('top')) + parseInt($('.page_content').css('top')) + parseInt($('.page_content').css('margin-top')) -obj.y0,
            }
           // console.log(obj)
            $('.cropControls').css({
//				'width':$(this).find(".zoomimg").css('width'),
//	    		'height':$(this).find(".zoomimg").css('height'),
//	    		'left':parseInt($(this).css('left'))+parseInt($(this).find('.zoomimg').css('left')) + parseInt($('.page_content').css('left')) + 'px',
//	    		'top':parseInt($(this).css('top'))+parseInt($(this).find('.zoomimg').css('top')) + parseInt($('.page_content').css('top')) + parseInt($('.page_content').css('margin-top')) + 'px',
                'width':0,
                'height':0,
                'left':obj.x0+obj2.x1+parseInt($(this).css('width'))/2 + 'px',
                'top':obj.y0+obj2.y1+parseInt($(this).css('height'))/2  + 'px',
//	    		'left':obj.x0 + 'px',
//	    		'top':obj.y0  + 'px',
                'transform':$(this).css('transform'),
            })
            $('.viewPort').css({
                'width':$(this).css('width'),
                'height':$(this).css('height'),
                'left':obj2.x1-parseInt($(this).css('width'))/2-obj2.x1+ 'px',
                'top':obj2.y1-parseInt($(this).css('height'))/2-obj2.y1+'px',
//	    		'transform':$(this).css('transform'),
            })
            $('.inner').css({
                'width':$(this).css('width'),
                'height':$(this).css('height'),
            })
            $('.masked').prop('src',$(this).find("img").prop('src'))
            $('.masked').css({
                'width':$(this).find(".zoomimg").css('width'),
                'height':$(this).find(".zoomimg").css('height'),
//				'left':parseInt($('.viewPort').css('left'))+'px',
//				'top':parseInt($('.viewPort').css('top'))+'px',
                'left':parseInt($(clickThis).find('.zoomimg').css('left'))+'px',
                'top':parseInt($(clickThis).find('.zoomimg').css('top'))+'px',
                'transform':$(this).find("img").css('transform'),
            })
            $('.cropBox').css({
                'width':$('.viewPort').css('width'),
                'height':$('.viewPort').css('height'),
                'left':$('.viewPort').css('left'),
                'top':$('.viewPort').css('top'),
//	    		'transform':$(this).css('transform'),
            })
            $('.uncropbox').css({
                'width':$('.masked').css('width'),
                'height':$('.masked').css('height'),
                'left':$('.masked').css('left'),
                'top':$('.masked').css('top'),
            })
            $('.uncropped').prop('src',$(this).find("img").prop('src'))
            $('.uncropped').css({
                'transform':$(this).find("img").css('transform'),
            })
        }else{//如果不是裁剪过的数据，让裁剪框居中显示
            var obj={
                x0:parseInt($(this).css('left')) + parseInt($('.page_content').css('left')),
                y0:parseInt($(this).css('top')) + parseInt($('.page_content').css('top')) + parseInt($('.page_content').css('margin-top')),
            }
            var obj2={
                x1:parseInt($(this).css('width'))/2/2,
                y1:parseInt($(this).css('height'))/2/2,
            }
            $('.cropControls').css({
//				'width':$(this).find(".zoomimg").css('width'),
//	    		'height':$(this).find(".zoomimg").css('height'),
//	    		'left':parseInt($(this).css('left')) + parseInt($('.page_content').css('left')) + 'px',
//	    		'top':parseInt($(this).css('top')) + parseInt($('.page_content').css('top')) + parseInt($('.page_content').css('margin-top')) + 'px',
                'width':0,
                'height':0,
                'left':obj.x0+obj2.x1+parseInt($(this).css('width'))/2/2+'px',
                'top':obj.y0+obj2.y1+parseInt($(this).css('height'))/2/2+'px',
                'transform':$(this).css('transform'),
            })
            $('.viewPort').css({
                'width':parseInt($(this).css('width'))/2+'px',
                'height':parseInt($(this).css('height'))/2+'px',
//				'left':parseInt($(this).css('width'))/2/2+'px',
//	    		'top':parseInt($(this).css('height'))/2/2+'px',
                'left':obj2.x1-parseInt($(this).css('width'))/2/2-obj2.x1+ 'px',
                'top':obj2.y1-parseInt($(this).css('height'))/2/2-obj2.y1+'px',
//	    		'transform':$(this).css('transform'),
            })
            $('.inner').css({
                'width':parseInt($(this).css('width'))/2+'px',
                'height':parseInt($(this).css('height'))/2+'px',
            })
            $('.masked').prop('src',$(this).find("img").prop('src'))
            $('.masked').css({
                'width':$(this).find(".zoomimg").css('width'),
                'height':$(this).find(".zoomimg").css('height'),
                'transform':$(this).find("img").css('transform'),
//				'left':'-'+parseInt($('.viewPort').css('left'))+'px',
//				'top':'-'+parseInt($('.viewPort').css('top'))+'px',
                'left':parseInt($('.viewPort').css('left'))+'px',
                'top':parseInt($('.viewPort').css('top'))+'px',
            })
            $('.cropBox').css({
                'width':$('.viewPort').css('width'),
                'height':$('.viewPort').css('height'),
                'left':$('.viewPort').css('left'),
                'top':$('.viewPort').css('top'),
//	    		'transform':$(this).css('transform'),
            })
            $('.uncropbox').css({
                'width':$('.masked').css('width'),
                'height':$('.masked').css('height'),
                'left':$('.masked').css('left'),
                'top':$('.masked').css('top'),
            })
            $('.uncropped').prop('src',$(this).find("img").prop('src'))
            $('.uncropped').css({
                'transform':$(this).find("img").css('transform'),
            })
        }
        centerObj={
            x:parseInt($('.viewPort').css('left'))/2+parseInt($('.viewPort').css('width'))/2,
            y:parseInt($('.viewPort').css('top'))/2+parseInt($('.viewPort').css('height'))/2,
        }

        var imgObj = $('.uncropbox')[0];
        imgObj.onmousedown=function (ev) {
            var that = this;
            ev.preventDefault();
            ev.stopPropagation();
            var oEvent=ev||event;
            var event = window.event;
            var dix =event.pageX;
            var diy =event.pageY;
            document.onmousemove = function (ev) {
                var moveEvent=ev||event;
                var ex = moveEvent.pageX;
                var ey = moveEvent.pageY;
                var dx = ex - dix;
                var dy = ey - diy;
                dix = ex;
                diy = ey;
                var matrix = $(clickThis).css('transform');
                var str = matrix.substring(7,matrix.length-1);
                var arr = str.split(',');
                var cdx = dx*arr[0] - dy *arr[2];
                var cdy = dx*arr[2] + dy *arr[0];

                moveEvent.preventDefault();
                moveEvent.stopPropagation();

//				根据旋转角度获取新的坐标▼
                var cdx = dx*arr[0] - dy *arr[2];
                var cdy = dx*arr[2] + dy *arr[0];
                //老算法,存在坐标误差
//				    var x1 = (x + w/2)*arr[0] - (y + h/2)*arr[2] - w/2;
//				    var y1 = (x + w/2)*arr[2] + (y + h/2)*arr[0] - h/2;
//				根据旋转角度获取新的坐标▲

                var x = parseInt($(imgObj).css('left'))+cdx;
                var y = parseInt($(imgObj).css('top'))+cdy;

                //			限制裁剪时拖拽区域（锁边功能）
                var viewW = parseInt($('.viewPort').css('width'));
                var cropW = parseInt($('.uncropbox').css('width'));
                var viewH = parseInt($('.viewPort').css('height'));
                var cropH = parseInt($('.uncropbox').css('height'));
                var viewX = parseInt($('.viewPort').css('left'));
                var viewY = parseInt($('.viewPort').css('top'));
                var cropX = parseInt($('.uncropbox').css('left'));
                var cropY = parseInt($('.uncropbox').css('top'));

                if (x>0) {
                    x=0;
                }
                if(x<-(cropW-viewW)){
                    x=-(cropW-viewW);
                }
                if(y>0){
                    y=0;
                }
                if(y<-(cropH-viewH)){
                    y=-(cropH-viewH);
                }



//				同步四角缩放函数所需数据
                p.x = x;
                p.y = y;
                //			限制区域 （锁边功能）END
                $('.uncropbox').css({'left':x+'px','top':y+'px'});
                //同步裁剪部分数据
                cogradientImg();
            };
            document.onmouseup = function () {
                document.onmousemove = null;
                document.onmouseup = null;
            }
            oEvent.preventDefault();
            oEvent.stopPropagation();
        };

        //绑定裁剪框拉伸选择框
        $('.viewPort>span').show();
        startDrag(ID("dragLeftTop1"),ID("viewPort"),"nw");
        startDrag(ID("dragLeftBot1"),ID("viewPort"),"sw");
        startDrag(ID("dragRightTop1"),ID("viewPort"),"ne");
        startDrag(ID("dragRightBot1"),ID("viewPort"),"se");
//		startDrag(ID("dragTopCenter"),ID("outsideBox"),"n",editorObjClassname);
//		startDrag(ID("dragBotCenter"),ID("outsideBox"),"s",editorObjClassname);
//		startDrag(ID("dragRightCenter"),ID("outsideBox"),"e",editorObjClassname);
//		startDrag(ID("dragLeftCenter"),ID("outsideBox"),"w",editorObjClassname);

        e.preventDefault();
        e.stopPropagation();

        dblclickThis = t;
        initImg();
        $(dblclickThis).addClass('selectImg');

    });
}
//封装双击事件END    ↑

//点击左侧模板,渲染右侧
//	$('.templet').click(function (e) {
//		//$('.page_content').empty()//清空上一套模板
//		$(".page_content .element").remove();//清空区域内所有模板元素
//		var target = e.target || Event.srcElement;
//		var index = $(target).attr('data-index');
//		var jsonObj = json[index];
//		var w1,h1;//操作区屏幕大小
//		var w0,h0;//模板的真实尺寸
//		var w2,h2;//根据屏幕适应后模板尺寸
//		w0 = jsonObj.content.pages[0].width;
//		h0 = jsonObj.content.pages[0].height;
//		w1 = parseInt($('#documentContainer').css('width'));
//		h1 = parseInt($('#documentContainer').css('height'));
//		getPagesize(w1,h1,w0,h0);
//		drawTemplet(jsonObj);
//
//	})


//	var j = {"content":{"canvaDefaultFonts":{"title":{"fontSize":42,"fontFamily":"Abril Fatface"},"subtitle":{"fontSize":24,"fontFamily":"Trocchi"},"body":{"fontSize":16,"fontFamily":"Arimo"}},"defaultFonts":{"title":{},"subtitle":{},"body":{}},"layout":"custom","doctype":{"type":"INLINE","width":800,"height":500,"units":"PIXELS"},"pages":[{"elements":[{"elementIndex":0,"left":0,"top":0,"width":800,"height":500,"rotation":0,"transparency":0,"userEdited":true,"type":"image","mediaId":null,"mediaVersion":null,"isBackground":true,"isRecolorable":true,"isCutout":false,"isDark":false,"backgroundColor":"#ff5c5c"},{"elementIndex":1,"left":28.052805280528055,"top":58.58085808580858,"width":587.7112949032866,"height":388.4609478795705,"rotation":0,"transparency":0,"userEdited":true,"flipOrientation":1,"type":"image","mediaId":"MABKNPccP24.jpg","mediaVersion":1,"isBackground":false,"isRecolorable":false,"isCutout":false,"isDark":false},{"elementIndex":2,"left":462.12059804557276,"top":141.05592925981347,"width":323.130860067308,"height":221.66226500809933,"rotation":0,"transparency":0,"userEdited":true,"type":"image","mediaId":"MABhGuGUKlQ.jpg","mediaVersion":1,"isBackground":false,"isRecolorable":false,"isCutout":false,"isDark":false,"imageBox":{"left":-125.64714487501296,"top":-83.76476325000864,"width":502.5885795000519,"height":335.05905300003457}}],"width":800,"height":500}],"palette":[],"title":null},"media":[]}
//	var urlHeader='http://www.photostars.cn/gallery/';
//	var jsonObj = j;
//	var hsonUrl =
//	drawTemplet('http://www.photostars.cn/webTemplate/data/MTUyMjI4ODI0NjE5MmMxMDAwMDE4bTEwMDAwMTg=.tdf',urlHeader);


//	drawTemplet(dataurl,urlHeader);

//获取根据屏幕大小适应所得的模板大小
//var w1,h1;//操作区屏幕大小
//var w0,h0;//模板的真实尺寸
//var w2,h2;//根据屏幕适应后模板尺寸
//w0 = jsonObj.content.pages[0].width;
//h0 = jsonObj.content.pages[0].height;
//w1 = parseInt($('#canvaDocument').css('width'));
//h1 = parseInt($('#canvaDocument').css('height'));

//封装获取适应屏幕后的模板尺寸     ↓↓
function getPagesize (w1,h1,w0,h0) {
    if (w1*h0>w0*h1) {
        h2 = 0.84*h1;
        w2 = h2*w0/h0;
    } else{
        w2 = 0.84*w1;
        h2 = w2*h0/w0;
    }
    //	获取模板缩放比例
    sizeScale = w2/w0;
    return sizeScale;
}  //↑↑
//getPagesize(w1,h1,w0,h0)
//检测屏幕大小改变的事件
//window.onresize = function(){
//	var w1,h1;//操作区屏幕大小
//	var w0,h0;//模板的真实尺寸
//	var w2,h2;//根据屏幕适应后模板尺寸
//	w0 = jsonObj.content.pages[0].width;
//	h0 = jsonObj.content.pages[0].height;
//	w1 = parseInt($('#canvaDocument').css('width'));
//	h1 = parseInt($('#canvaDocument').css('height'));
//	getPagesize(w1,h1,w0,h0)
//	drawTemplet(jsonObj)
//}
//alert(w2+'==========='+h2)
//获取根据屏幕大小适应所得的模板大小  END

//根据数据渲染页面模板    ↓↓
var w1,h1;//操作区屏幕大小
var w0,h0;//模板的真实尺寸
var w2,h2;//根据屏幕适应后模板尺寸
var jsonU;
//将已有模板渲染需要传的参数(own,jsonUrl,imgUrlheader,id),imgUrlheader没有的话,函数内设置,own为temp

/*id:模版类型号, jsonUrl:ajax 请求接口,图片请求头：imgUrlheader,模板ID ：temId,模板title：tempTle； timeSmp:时间戳*/
function drawTemplet (jsonUrl,imgUrlheader,id,tempId,tempTle,timeSmp) {
	jsonU=jsonUrl;
    //清空保存svg的 数组
    par.svgMedia = [];
    $('.playTextBox').hide();
    $('.editTextBox').hide();
    //从 我的进入 参数是传过来的   ，空模板和点击左侧切换模板 不进行再次赋值
    par.templateId = 0;
    if(tempId && tempTle && timeSmp){
        par.templateId = tempId;
        //从 我的 进来的
        par.templateSysn = {
            'templateId':tempId,
            'templteTitle':tempTle,
            'Timestamp':timeSmp
        }
    }else{
        //点击左侧的模板
       /* if($.templateSysn.templateId != 0 && $.templateSysn.templteTitle != ''&& $.templateSysn.Timestamp != 0){
            $.templateSysn = {
                'templateId':tempId,
                'templteTitle':tempTle,
                'Timestamp':timeSmp
            }
        }*/
    };

   // }//else if(own == 'temp'){
        //从左侧点击，绘制模板
        //获取浏览器缓存的用户信息
        //var userInfo_ = JSON.parse(localStorage.getItem('userInfo'));
        //$('.saveType').text('未进行任何更改');
        /*$.ajax({
            type:'post',
            url:par.urlhead+'worksys/clickTemplate',
            data:{
                'authorityKey':'9670f10b8b17ea61010375bfbe08138d',
                'userID':userInfo_.userID,
                'token':userInfo_.token,
                'templateID':id
            },
            success:function(data) {
                var jsonData = JSON.parse(data);
                var stu = jsonData.status;
                if (stu == 1) {
                    //成功
                    $.templateSysn = {
                        'templateId':jsonData.ownTemplateID,
                        'templteTitle':jsonData.ownTemplateTitle,
                        'Timestamp':jsonData.ownTimestamp
                    }
                } else if (stu == -2) {
                    //token 错误
                    alert('token error！');
                } else{
                    alert('other error！');
                }
            }
        });*/
   // }

    $(".page_content .element").remove();
    $('.zoomImgbox').hide();
    $.ajax({
        type:"get",
        data:id,
        url:jsonUrl,
        success:function (data) {
            if(imgUrlheader){
                imgur = imgUrlheader;
            }else{
                imgur = "http://www.photostars.cn/webHDGallery/";
            }
            var jsonObj = JSON.parse(data);
            //更换模板，上一个模板数据清空
            par.isSave = true;
            $('.saveType').text('未进行任何更改');
            //模板数据
            par.templateJson = [];
            par.templateJson.push(jsonObj);

            par.documentName = jsonObj.content.pages[0].template;
            //获得文件名称
            $('.documentTitle .text').text(par.documentName);

            w0 = jsonObj.content.pages[0].width;
            h0 = jsonObj.content.pages[0].height;

            var jsonWidth=jsonObj.content.pages[0].width;
            var jsonHeight=jsonObj.content.pages[0].height;

            w1 = strTonumber($('#documentContainer').css('width'));
            h1 = strTonumber($('#documentContainer').css('height'));

            par.width = jsonWidth;
            par.height = jsonHeight;
            getPagesize(w1,h1,w0,h0);

            var width = w2;//jsonObj.content.pages[0].width;
            var height = h2;//jsonObj.content.pages[0].height;
            $('.page_content').css('width',width+'px').css('height',height+'px').css('top',50+'%').css('margin-top',-parseInt(height/2)+'px');
            var topcss = $('.page_content').css('top');
            $('.page_content').css('top',parseInt(topcss));
            $('.page_content').css('left',parseInt(w1/2 -width/2) +'px');

            //设置标准字号
            orfontStand = 16;
            var textSize = strTonumber($('#page_content').css('width'))/par.width;

            fontStand = orfontStand * sizeScale;//基本字号
            //设置到父元素
            $('#documentContainer').css('font-size',fontStand+'px');
            var arr = jsonObj.content.pages[0].objects;
            //加载 外部字体
           var fontF_list = [];
           var fontlist = [];
            for (var j=0;j<arr.length;j++) {
                if (arr[j].type == 'text') {
                    //获得需要加载的字体列表
                    var fontname= {
                        'name':arr[j].fontFamily
                    };
                    var fontF_ = fontname.name.replace(/\"/g, "");
                    //如果已经加载过或者是微软雅黑，就不需要再去请求了
                    if(isSupportFontFamily(arr[j].fontFamily) == false && fontF_ != '微软雅黑' && fontF_ != 'STXianhei' && fontF_ != 'Abril Fatface' ){
                        //数组去重
                        var checkunic = false;
                        for(var z=0;z<fontF_list.length;z++){
                            if (fontF_list[z].name == fontname.name && fontF_list.length>0) {
                                checkunic = true;
                            }
                        }
                        if(!checkunic){
                            fontlist.push(arr[j].fontFamily);
                            fontF_list.push(fontname);
                            checkunic = false;
                        }
                        
                    }
                }
            }
            par.isLoad = true;
            if(fontF_list.length>0){
                par.isLoad = false;
                $('.text_font').show();
                $.loadFontface(fontF_list);
            }
            var setIntervalLoadfont = setInterval(function(){
                //等待字体加载完成
                //if(par.isLoad){
                    clearInterval(setIntervalLoadfont);
                    setIntervalLoadfont = null;
                    for (var i=0;i<arr.length;i++) {
                        if (arr[i].type=='photo') {
                            if (arr[i].isBackground==true) {
                                var $div = $("<div class='element image backgroundColor' isBackground=true flipOrientation="+arr[i].flip+" isCutout="+arr[i].isClip+" data-index="+i+"></div>");
                                changeImageColor($div[0]);
                                bgClick($div[0]);//背景的单击事件
                                dragDom($div[0]);
                                $div.css('width',sizeScale*arr[i].width+'px')
                                    .css('height',sizeScale*arr[i].height+'px')
                                    .css('position','absolute')
                                    .css('background-color',arr[i].backgroundColor)
                                    .css('left',sizeScale*arr[i].left)
                                    .css('top',sizeScale*arr[i].top)
                                    .css('transform','rotate('+arr[i].degree+'deg)')
                                    .css('opacity',arr[i].opacity);
                                var $parent = $(".page_content");
                                $parent.append($div);
                            }else{
                                var $imgdiv = $("<div class='element imgElement image' flipOrientation="+arr[i].flip+" isCutout="+arr[i].isClip+" elementType='img' data-index="+i+" ></div>");
                                var $zoomdiv = $("<div class='zoomimg'></div>");
                                $imgdiv.prop('data-index',i);
                                dragDom($imgdiv[0]);
                                imgDblclick($imgdiv);

                                //解析翻转角度值
                                var flipOrientation=arr[i].flip;
                                if (flipOrientation==0) {
                                    var rotateX=0;
                                    var rotateY=0;
                                }else if(flipOrientation==1){
                                    var rotateX=0;
                                    var rotateY=180;
                                }else if(flipOrientation==2){
                                    var rotateX=180;
                                    var rotateY=0;
                                }else if(flipOrientation==3){
                                    var rotateX=180;
                                    var rotateY=180;
                                }
                                var imgSrc_ = $.analyImgSrc(arr[i].imageId);
                                console.log(arr[i])
                                var isClip = arr[i].isClip;
                                if (isClip=='true'||isClip==true) {
                                    var divW=arr[i].width;
                                    var divH=arr[i].height;
                                    var divL=arr[i].left;
                                    var divT=arr[i].top;
                                    var imgW=arr[i].imageClip.width;
                                    var imgH=arr[i].imageClip.height;
                                    var imgL=arr[i].imageClip.left;
                                    var imgT=arr[i].imageClip.top;
                                }else{
                                    var divW=arr[i].width;
                                    var divH=arr[i].height;
                                    var divL=arr[i].left;
                                    var divT=arr[i].top;
                                    var imgW=divW;
                                    var imgH=divH;
                                    var imgL=0;
                                    var imgT=0;
                                }

                                var $img = $("<img class='img' src='"+imgSrc_+"' draggable=false />");
                                $img.css('transform','rotateX('+rotateX+'deg) rotateY('+rotateY+'deg)');
                                $zoomdiv.css('width',sizeScale*imgW+'px')
                                    .css('height',sizeScale*imgH+'px')
                                    .css('left',sizeScale*imgL+'px')
                                    .css('top',sizeScale*imgT+'px');
                                $zoomdiv.append($img);
                                $imgdiv.append($zoomdiv);
                                $imgdiv.css('position','absolute')
                                    .css('left',sizeScale*divL)
                                    .css('top',sizeScale*divT)
                                    .css('width',sizeScale*divW+'px')
                                    .css('height',sizeScale*divH+'px')
                                    .css('transform','rotate('+arr[i].degree+'deg)')
                                    .css('opacity',arr[i].opacity);
                                var $parent = $(".page_content");
                                $parent.append($imgdiv);
                            }
                        }else if(arr[i].type=='text'){
                            var $test = $("<div class='element text'  elementType='text' data-index="+i+"></div>");/* isUppercase = "+arr[i].textTransform()+"*//*flipOrientation="+arr[i].flipOrientation+" isCutout="+arr[i].isClip+"*/
                            var $innertest = $("<div class='innerText' list-layout='false'>"+arr[i].html+"</div>");
                            $test.append($innertest);

                            //计算当前文字的宽度
                           // $.textWidth(arr[i].html,);

                            //当前实际生效的最小字号
                            var currfontsize_min = (12/fontStand)*16;
                            if (arr[i].fontSize< Math.ceil(currfontsize_min)) {
                                arr[i].fontSize = Math.ceil(currfontsize_min);
                            }
                            var fon_size = $.fontSizePxtoPer(arr[i].fontSize);//拿到百 分比 是元基准字体14 的百分比
                            //字体的百分比 * 当前的 基准字体
                            var currfontSize_px = (parseFloat(fon_size)/100) *fontStand;
                            var letterSpacing_ = $.letterSpacePxtoRem(arr[i].letterSpacing);
                            /*-------新加--------*/
                            //字间距单位em转换成px
                            //var numberemtopx = arr[i].letterSpacing*currfontSize_px/1000;
                            /*-------新加--------*/
                            $test.prop('data-index',i);
                            dragDom($test[0]);
                            $innertest.css('width',sizeScale*arr[i].width+'px')
                            /* .css('height',parseInt(sizeScale*arr[i].height)+'px')*/;
                            $test.css('width',sizeScale*arr[i].width+'px')
                                .css('height',sizeScale*arr[i].height+'px')
                                .css('position','absolute')
                                .css('left',sizeScale*arr[i].left+'px')
                                .css('top',sizeScale*arr[i].top+'px')
                                .css('font-size',fon_size)
                                .css('transform','rotate('+arr[i].degree+'deg)')
                                .css('font-family',arr[i].fontFamily).css({
                                'letter-spacing':letterSpacing_,
                                'opacity':arr[i].opacity
                            }).css('text-align',arr[i].horizontalAlignment)
                                .css('vertical-align',arr[i].verticalAlignment)
                                .css('color',arr[i].color);

                            if(arr[i].lineHeight){
                                $test.css('line-height',arr[i].lineHeight*currfontSize_px+'px');//行高比例 * 屏幕缩放比 * 字体px值  arr[i].fontSize不带单位得px值
                                $innertest.attr("lineheight",arr[i].lineHeight);
                            }else{
                                //行高默认值 1 * 字体大小
                                $test.css('line-height',currfontSize_px+'px');//等于真实字体px值
                                $innertest.attr("lineheight",1);
                            }
                            /*设置字体粗细*/
                            if(arr[i].bold){
                                //粗体
                                $test.css('font-weight',arr[i].bold);
                            }
                            /*设置斜体*/
                            if(arr[i].italic){
                                $test.css('font-style','italic');
                            }
                            /*设置大小写*/
                            if(arr[i].textTransform){
                                $test.css('text-transform',arr[i].textTransform);
                                $test.attr('isUppercase',arr[i].textTransform)
                            }
                            //拿到字号
                            $innertest.attr("fontsize",arr[i].fontSize);
                            $innertest.attr("letterspacing",letterSpacing_);
                            //找到子元素标签 并且设置字体大小同父元素
                            var innerChild_div = $innertest.find('div');
                            var innerChild_span = $innertest.find('span');
                            //判断是否是列表
                            if($innertest.find('ul').length>0){
                                //存在列表
                                var innerChild_ul = $innertest.find('ul');
                                var innerChild_li = $innertest.find('li');
                                $innertest.find('ul').css('line-height','inherit')
                                $innertest.find('li').css('line-height','inherit');
                                $innertest.attr("list-layout",'true');
                            }else{
                                $innertest.attr("list-layout",'false');
                            }
                            if(innerChild_div.length>0){
                                // $innertest.find('div').css('font-size',currfontSize_px+'px')
                                $innertest.find('div').css('font-size','inherit')
                            }
                            if(innerChild_span.length>0){
                                // $innertest.find('span').css('font-size',currfontSize_px+'px')
                                $innertest.find('span').css('font-size','inherit')
                            }

                            var $parent = $(".page_content");
                            $parent.append($test);
                            var testH =  $test.css('height');
                            var innertestH =  $innertest.css('height');
                            if(parseInt(testH) != parseInt(innertestH)){
                                //证明文字被挤压折行
                                //console.log('文字折行');
                                //$innertest.css('width',strTonumber($innertest.css('width'))+20+'px');
                               // $test.css('width',strTonumber($innertest.css('width'))+'px');
                                $test.css('height',innertestH)
                                //$test.css('height',$innertest.css('height'));
                            }
                        }else if(arr[i].type=='vector'){//svg
                            var currentSvg = arr[i];
                            //console.log('模板：'+JSON.stringify(currentSvg));
                            $.ajax({
                                type:"get",
                                async: false,
                                url: 'http://www.photostars.cn/webHDGallery/' + currentSvg.imageId,
                                success:function(data){
                                    var frag = $('<div class="element svg" elementType="svg" data-index="'+i+'" svgSrc="'+currentSvg.imageId+'" svgScale="'+sizeScale+'"><div/>');
                                    getColors(frag[0]);
                                    dragDom(frag[0]);
                                    $('.toolbar__slider--transparency').val(1*100);
                                    frag.css({
                                        'width': currentSvg.width*sizeScale+'px',
                                        'height': currentSvg.height*sizeScale+'px',
                                        'transform': 'rotate('+ currentSvg.degree +'deg)',
                                        'position': 'absolute',
                                        'left': currentSvg.left*sizeScale+'px',
                                        'top': currentSvg.top*sizeScale+'px',
                                        'opacity': currentSvg.opacity,/**/
                                    });
                                    
                                    frag.html( $(data).find('svg') );
                                    $('.page_content').append(frag);
                                    frag.find('title').text('');

                                    //因为svg比例有误差,当svg生成后将其自动计算的高度重新赋值给其父元素
						            var svgH = frag.find('svg').css('height');
						            frag.css('height',svgH);

                                    // 初始化svg color
                                    if(currentSvg.fillColors.length>0){
                                        var svgBox = frag.find('svg').children('*');
                                        for(var k = 0; k < currentSvg.fillColors.length; k++) {
                                            var idName = currentSvg.fillColors[k];
                                            for(var h = 0; h < svgBox.length; h++){
                                                var everyLabel = svgBox[h];
                                                if($(everyLabel).attr('id')){
                                                    var curId = $(everyLabel).attr('id').substring(0, 7);

                                                    if(idName.id == curId){  // 如果id名称一样 group1
                                                        if(idName.type == 'idfill'){   // 如果类型一样，是放到idfill外层，还是gfill内层？
                                                            $(everyLabel).css('fill', idName.color);
                                                        }else{
                                                            $(everyLabel).children().each(function(){
                                                                $(this).css('fill', idName.color);
                                                            })
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }

                                }
                            });

                        }else if(arr[i].type=='grid'){//网格
//              	渲染网格元素到pagr_content区
                            gridObj(arr[i],imgur,sizeScale)

                        }
                    }
                //}
            },10)


        }

    });
}
//定义双击编辑时的元素对象
var editorObjClassname;
var boj = document.getElementById('cutbox');
//拖拽
//	boj.onmousedown=function (ev) {
//		ev.preventDefault();
//		var oEvent=ev||event;
//		var divX = $(boj).offset().left;
//		var divY = $(boj).offset().top;
//		var parentX = $(boj).parent().offset().left;
//		var parentY = $(boj).parent().offset().top;
//		document.onmousemove = function (ev) {
//			var moveEvent=ev||event;
//			moveEvent.preventDefault();
//			moveEvent.stopPropagation();
//			var x = moveEvent.clientX - oEvent.clientX + divX - parentX;
//			var y = moveEvent.clientY - oEvent.clientY + divY - parentY;
//	//		$('#cutbox').css('transform','translate('+x+'px,' +y+'px'+')')
//			$('#cutbox').css({'left':x+'px','top':y+'px'});
//		};
//		document.onmouseup = function () {
//			document.onmousemove = null;
//			document.onmouseup = null;
//		}
//		oEvent.preventDefault();
//		oEvent.stopPropagation();
//	};



//	var imgObj = $('.templetImg')[0];
//	var imgObj2 = $('.img')[0];
//	$(".cutBox").dblclick(function(e){
//		editorObjClassname=$(this).attr('class');
//		$('.maskImgbox').show()
//		var e = e||event;
//	    $('.cutBox').css('overflow','visible');
//	    //显示裁剪时的外层box
//	    $('.mask').addClass('on');
//	    $('.templetImg').prop('src',$(this).find(".img").prop('src'))
//	    $('.outsideBox').css({
//	    	'width':$(this).css('width'),
//	    	'height':$(this).css('height'),
//	    	'left':$(this).css('left'),
//	    	'top':$(this).css('top'),
//	    	'transform':$(this).css('transform'),
//	    })
//	    $('.outsideBox .templetImg').css({
//	    	'width':$(this).find(".img").css('width'),
//	    	'height':$(this).find(".img").css('height'),
//	    	'left':$(this).find(".img").css('left'),
//	    	'top':$(this).find(".img").css('top'),
//	    	'transform':$(this).find(".img").css('transform'),
//	    })
//
//
//	    boj.onmousedown=null;
//	    imgObj.onmousedown=function (ev) {
//	    	var that = this;
//			ev.preventDefault();
//			ev.stopPropagation();
//			var oEvent=ev||event;
//		//	$('#cutbox').css('transform','translate(233px,133px)')
//			var divX = $(imgObj).offset().left;
//			var divY = $(imgObj).offset().top;
//			var parentX = $(imgObj).parent().offset().left;
//			var parentY = $(imgObj).parent().offset().top;
//			document.onmousemove = function (ev) {
//				var moveEvent=ev||event;
//				moveEvent.preventDefault();
//				moveEvent.stopPropagation();
//				var x = moveEvent.clientX - oEvent.clientX + divX - parentX;
//				var y = moveEvent.clientY - oEvent.clientY + divY - parentY;
//
//	//			限制裁剪时拖拽区域
//				var width = $(that).parent().css('width');
//				var width2 = $(that).css('width');
//				var height = $(that).parent().css('height');
//				var height2 = $(that).css('height');
//				width = parseInt(width);
//				width2 = parseInt(width2);
//				height = parseInt(height);
//				height2 = parseInt(height2);
//				if(x>0){
//					x=0;
//				}else if(x<width-width2){
//					x=width-width2;
//				};
//				if(y>0){
//					y=0;
//				}else if(y<height-height2)(
//					y=height-height2
//				);
//
//	//			限制区域END
//
//				$('.templetImg').css({'left':x+'px','top':y+'px'});
//				$('#img').css({'left':x+'px','top':y+'px'});
//			};
//			document.onmouseup = function () {
//				document.onmousemove = null;
//				document.onmouseup = null;
//			}
//			oEvent.preventDefault();
//			oEvent.stopPropagation();
//		};
//
//		imgObj2.onmousedown=function (ev) {
//			var that = this;
//			ev.preventDefault();
//			var oEvent=ev||event;
//			var divX = $(imgObj2).offset().left;
//			var divY = $(imgObj2).offset().top;
//			var parentX = $(imgObj2).parent().offset().left;
//			var parentY = $(imgObj2).parent().offset().top;
//			document.onmousemove = function (ev) {
//				var moveEvent=ev||event;
//				moveEvent.preventDefault();
//				moveEvent.stopPropagation();
//				var x = moveEvent.clientX - oEvent.clientX + divX - parentX;
//				var y = moveEvent.clientY - oEvent.clientY + divY - parentY;
//	//			限制裁剪时拖拽区域
//				var width = $(that).parent().css('width');
//				var width2 = $(that).css('width');
//				var height = $(that).parent().css('height');
//				var height2 = $(that).css('height');
//				width = parseInt(width);
//				width2 = parseInt(width2);
//				height = parseInt(height);
//				height2 = parseInt(height2);
//				if(x>0){
//					x=0;
//				}else if(x<width-width2){
//					x=width-width2;
//				};
//				if(y>0){
//					y=0;
//				}else if(y<height-height2)(
//					y=height-height2
//				);
//
//	//			限制区域END
//
//				$('.templetImg').css({'left':x+'px','top':y+'px'});
//				$('#img').css({'left':x+'px','top':y+'px'});
//			};
//			document.onmouseup = function () {
//				document.onmousemove = null;
//				document.onmouseup = null;
//			}
//			oEvent.preventDefault();
//			oEvent.stopPropagation();
//		};
//		//绑定裁剪框拉伸选择框
//		startDrag(ID("dragLeftTop"),ID("outsideBox"),"nw",editorObjClassname);
//		startDrag(ID("dragLeftBot"),ID("outsideBox"),"sw",editorObjClassname);
//		startDrag(ID("dragRightTop"),ID("outsideBox"),"ne",editorObjClassname);
//		startDrag(ID("dragRightBot"),ID("outsideBox"),"se",editorObjClassname);
////		startDrag(ID("dragTopCenter"),ID("outsideBox"),"n",editorObjClassname);
////		startDrag(ID("dragBotCenter"),ID("outsideBox"),"s",editorObjClassname);
////		startDrag(ID("dragRightCenter"),ID("outsideBox"),"e",editorObjClassname);
////		startDrag(ID("dragLeftCenter"),ID("outsideBox"),"w",editorObjClassname);
//
//
//
//		e.preventDefault();
//		e.stopPropagation();
//
//
//	});//内层裁剪框双击事件END


//	console.log(json)


//获取transform中的translate属性值，坐标4是X，坐标5是Y
//	var str = $('.cutBox').css('transform');
//	var strArr = $('.cutBox').css('transform').substring(7,str.length-1).split(',');


//定义缩放
//	$('#dragRightBot')[0].onmousedown=function (ev) {
//		var that = this;
//		ev.preventDefault();
//		var oEvent=ev||event;
//		var currentX = oEvent.clientX;
//		var currentY = oEvent.clientY;
//		var divX = $(imgObj2).offset().left;
//		var divY = $(imgObj2).offset().top;
//		var parentX = $(imgObj2).parent().offset().left;
//		var parentY = $(imgObj2).parent().offset().top;
//		document.onmousemove = function (e) {
//			var moveEvent=e||event;
//			var x = moveEvent.clientX - oEvent.clientX + divX - parentX;
//			var y = moveEvent.clientY - oEvent.clientY + divY - parentY;
//			var disX= moveEvent.clientX - currentX;
//			var disY= moveEvent.clientY - currentY;
//			console.log(disX)
//			$(that).parent().css('width',parseInt($(that).parent().css('width'))+disX+'px');
//			$(that).parent().css('height',parseInt($(that).parent().css('height'))+disY+'px');
//
//			moveEvent.preventDefault();
//			moveEvent.stopPropagation();
//		};
//		document.onmouseup = function () {
//			document.onmousemove = null;
//			document.onmouseup = null;
//		}
//	};








//定义ID函数
var ID = function(id){
    return document.getElementById(id);
};
//拖拽与拉伸方法
//拖拽拉伸所需参数
var params = {
    left: 0,
    top: 0,
    width:0,
    height:0,
    currentX: 0,
    currentY: 0,
    flag: false,
    kind: "drag"
};
var xx,yy ;
//获取相关CSS属性方法
var getCss = function(o,key){
    return o.currentStyle? o.currentStyle[key] : document.defaultView.getComputedStyle(o,false)[key];
};
var sobj;
var startDrag = function(point, target, kind,className,t){//t参数是双击时选中的图片对象
    var classname = className;
    //point是拉伸点，target是被拉伸的目标，其高度及位置会发生改变
    //此处的target与上面拖拽的target是同一目标，故其params.left,params.top可以共用，也必须共用
    //初始化宽高
    params.width = getCss(target, "width");
    params.height = getCss(target, "height");
    //初始化坐标
    if(getCss(target, "left") !== "auto"){
        params.left = getCss(target, "left");
    }
    if(getCss(target, "top") !== "auto"){
        params.top = getCss(target, "top");
    }
    //target是移动对象
    point.onmousedown = function(event){
        sobj={
            w : parseInt($('.viewPort').css('width')),
            h :　parseInt($('.viewPort').css('height')),
            l : parseInt($('.viewPort').css('left')),
            t : parseInt($('.viewPort').css('top')),
            w0 : parseInt($('.uncropbox').css('width')),
            h0 :　parseInt($('.uncropbox').css('height')),
            l0 : parseInt($('.uncropbox').css('left')),
            t0 : parseInt($('.uncropbox').css('top')),
        };
        params.kind = kind;
        params.flag = true;
        if(!event){
            event = window.event;
        }
        var e = event;
        e.preventDefault();
        e.stopPropagation();
        params.currentX = e.clientX;
        params.currentY = e.clientY;

//			将旋转后的坐标转换为正常坐标系
        var ne=newExEy2(params.currentX,params.currentY);
        params.currentX = ne.x;
        params.currentY = ne.y;

        //防止IE文字选中，有助于拖拽平滑
        point.onselectstart = function(){
            return false;
        }
        return false;
    };
    $('body')[0].onmouseup = function(){
        params.flag = false;
        if(getCss(target, "left") !== "auto"){
            params.left = getCss(target, "left");
        }
        if(getCss(target, "top") !== "auto"){
            params.top = getCss(target, "top");
        }
        params.width = getCss(target, "width");
        params.height = getCss(target, "height");
    };
    $('body')[0].onmousemove = function(event){
        var e = event ? event: window.event;
        if(params.flag){

            var nowX = e.clientX, nowY = e.clientY;

//			  	将旋转后的坐标转换为正常坐标系
            var nex=newExEy2(nowX,nowY);
            nowX = nex.x;
            nowY = nex.y;

            var disX = nowX - params.currentX, disY = nowY - params.currentY;

            if(params.kind === "n"){
                //上拉伸
                //高度增加或减小，位置上下移动
                target.style.top = parseInt(params.top) + disY + "px";
                target.style.height = parseInt(params.height) - disY + "px";
                if (classname!=undefined) {
                    $(t).css({
                        'top':parseInt(params.top) + disY + "px",
                        'height':parseInt(params.height) - disY + "px"
                    });
                    //					console.log(classname)
                    $('.templetImg')[0].style.top=parseInt($(t).find('.zoomimg').css('top')) - disY2 + "px";
                    $(t).find('.zoomimg')[0].style.top= parseInt($(t).find('.zoomimg').css('top')) - disY2 + "px";
                }
                moveImgX = nowX;
                moveImgY = nowY;
            }else if(params.kind === "w"){//左拉伸
                target.style.left = parseInt(params.left) + disX + "px";
                target.style.width = parseInt(params.width) - disX + "px";
                if (classname!=undefined) {
                    $(t).css({
                        'left':parseInt(params.left) + disX + "px",
                        'width':parseInt(params.width) - disX + "px"
                    });
                    //					console.log(classname)
                    $('.templetImg')[0].style.left=parseInt($(t).find('.zoomimg').css('left')) - disX2 + "px";
                    $(t).find('.zoomimg')[0].style.left= parseInt($(t).find('.zoomimg').css('left')) - disX2 + "px";
                }
                moveImgX = nowX;
                moveImgY = nowY;
            }else if(params.kind === "e"){//右拉伸
                target.style.width = parseInt(params.width) + disX + "px";
                if (classname!=undefined) {
                    $(t).css({
                        'width':parseInt(params.width) + disX + "px"
                    });
                }
                moveImgX = nowX;
                moveImgY = nowY;
            }else if(params.kind === "s"){//下拉伸
                target.style.height = parseInt(params.height) + disY + "px";
                if (classname!=undefined) {
                    $(t).css({
                        'height':parseInt(params.height) + disY + "px"
                    });
                }
                moveImgX = nowX;
                moveImgY = nowY;
            }else if(params.kind === "nw"){//左上拉伸
                var x = parseInt(params.left) + disX;
                var y = parseInt(params.top) + disY;
                var w = parseInt(params.width) - disX;
                var h = parseInt(params.height) - disY;
                var imgL = sobj.l-(parseInt(params.left) + disX) +sobj.l0;
                var imgT = sobj.t-(parseInt(params.top) + disY) +sobj.t0;
//		            var n=newExEy2(x,y);
//			        x = n.x;
//			        y = n.y;
                //	限制裁剪时拖拽区域（锁边功能）
                if (imgT>0) {
                    y=sobj.t+sobj.t0;
                    h=sobj.h-sobj.t0;
                    imgT=0;
                }
                if (imgL>0) {
                    x=sobj.l+sobj.l0;
                    w=sobj.w-sobj.l0;
                    imgL=0;
                }
                if (w<0) {
                    w=0;
                    x=sobj.l+sobj.w;
                    imgL=sobj.l-(sobj.l+sobj.w) +sobj.l0;
                }
                if (h<0) {
                    h=0;
                    y=sobj.t+sobj.h;
                    imgT=sobj.t-(sobj.t+sobj.h) +sobj.t0;
                }

                target.style.left = x + "px";
                target.style.top = y + "px";
                target.style.width = w + "px";
                target.style.height = h + "px";
                $(target).find('.inner')[0].style.width = w + "px";
                $(target).find('.inner')[0].style.height = h + "px";

//					缩放外部框时同时更改图片坐标,方框原位置-新位置+图片原位置(方框减去多少,图片相反加上多少)
                $('.masked')[0].style.left=imgL+ "px";
                $('.masked')[0].style.top=imgT + "px";
                //同步四角缩放函数所需数据
                p.x = imgL;
                p.y = imgT;
                //同步裁剪部分裁剪框大小数据
                cogradientBox ();
            }else if(params.kind === "ne"){//右上拉伸
                var x = parseInt($('.viewPort').css('left'));
                var y = parseInt(params.top) + disY;
                var w = parseInt(params.width) + disX;
                var h = parseInt(params.height) - disY;
                var imgT = sobj.t-(parseInt(params.top) + disY) +sobj.t0;
                //	限制裁剪时拖拽区域（锁边功能）
                if (w>=sobj.w0+sobj.l0) {
                    w=sobj.w0+sobj.l0;
                }
                if (imgT>0) {
                    y=sobj.t+sobj.t0;
                    h=sobj.h-sobj.t0;
                    imgT=0;
                }
                if (h<0) {
                    h=0;
                    y=sobj.t+sobj.h;
                    imgT=sobj.t-(sobj.t+sobj.h) +sobj.t0;
                }


                target.style.top = y + "px";
                target.style.height = h + "px";
                //右
                target.style.width = w + "px";
                $(target).find('.inner')[0].style.width = w + "px";
                $(target).find('.inner')[0].style.height = h + "px";

//					缩放外部框时同时更改图片坐标,方框原位置-新位置+图片原位置(方框减去多少,图片相反加上多少)

                $('.masked')[0].style.top=imgT + "px";

                //同步四角缩放函数所需数据
                p.y = imgT;

                //同步裁剪部分裁剪框大小数据
                cogradientBox ();

            }else if(params.kind === "sw"){//左下拉伸

                var x = parseInt(params.left) + disX;
                var y = parseInt($('.viewPort').css('top'));
                var w = parseInt(params.width) - disX;
                var h = parseInt(params.height) + disY;
                var imgL = sobj.l-(parseInt(params.left) + disX) +sobj.l0;

                //	限制裁剪时拖拽区域（锁边功能）
                if (h>=sobj.h0+sobj.t0) {
                    h=sobj.h0+sobj.t0;
                }
                if (imgL>0) {
                    x=sobj.l+sobj.l0;
                    w=sobj.w-sobj.l0;
                    imgL=0;
                }
                if (w<0) {
                    w=0;
                    x=sobj.l+sobj.w;
                    imgL=sobj.l-(sobj.l+sobj.w) +sobj.l0;
                }

                target.style.left = x + "px";
                target.style.width = w + "px";
                //下
                target.style.height = h + "px";
                $(target).find('.inner')[0].style.width = w + "px";
                $(target).find('.inner')[0].style.height = h + "px";

//					缩放外部框时同时更改图片坐标,方框原位置-新位置+图片原位置(方框减去多少,图片相反加上多少)
                $('.masked')[0].style.left=imgL + "px";

                //同步四角缩放函数所需数据
                p.x = imgL;
                //同步裁剪部分裁剪框大小数据
                cogradientBox ();

            }else if(params.kind === "se"){//右下拉伸
                var w = parseInt(params.width) + disX;
                var h = parseInt(params.height) + disY;

                //	限制裁剪时拖拽区域（锁边功能）
                if (h>=sobj.h0+sobj.t0) {
                    h=sobj.h0+sobj.t0;
                }
                if (w>=sobj.w0+sobj.l0) {
                    w=sobj.w0+sobj.l0;
                }

                target.style.width = w + "px";
                target.style.height = h + "px";
                $(target).find('.inner')[0].style.width = w + "px";
                $(target).find('.inner')[0].style.height = h + "px";
                //同步裁剪部分裁剪框大小数据
                cogradientBox ();

            }else{//移动
                target.style.left = parseInt(params.left) + disX + "px";
                target.style.top = parseInt(params.top) + disY + "px";
            }
        }
    }
};
//绑定拖拽

//定义操作区点击元素时显示top编辑按钮和缩放按钮（未完成）
//	var clickThis;//单击时选中的对象
//	function clickImgElement(ev) {
//		var e = ev||event;
//		var target = e.currentTarget;
//		clickThis = e.currentTarget;
//
//		var targetWidth = parseInt($(target).css('width'));
//		var targetHeight = parseInt($(target).css('height'));
//		var targetLeft = parseInt($(target).css('left'));
//		var targetTop = parseInt($(target).css('top'));
//		//  点击元素距离整个操作区域的坐标
//		var targetWorkX = targetLeft + parseInt($('.page_content').css('left'));
//		var targetWorkY = targetTop + parseInt($('.page_content').css('top'))+parseInt($('.page_content').css('margin-top'));
//
//		$('.zoomImgbox').css({
//			'width':targetWidth + 'px',
//			'height':targetHeight + 'px',
//			'left':targetWorkX + 'px',
//			'top':targetWorkY + 'px',
//			'transform':$(target).css('transform'),
//		}).show();
//
//		e.preventDefault();
//		e.stopPropagation();
//	}

//定义缩放函数（右下角缩放）
function Zoom(obj){

//	获取dom的样式
    function getStyle(obj,name){
        return (obj.currentStyle || getComputedStyle(obj,false))[name];
    }
    if(obj == undefined){
        return;
    }
//获取其要缩放的父元素
    var oDiv = obj.parentNode;

    var d=0;
    obj.onmousedown=function(ev){
        var ev = ev||event;
        //console.log(oDiv);
        var W = parseInt(getStyle(oDiv,'width'));
        var H = parseInt(getStyle(oDiv,'height'));
        var w0 = parseInt($(clickThis).find('.img').css('width'));
        var h0 = parseInt($(clickThis).find('.img').css('height'));
        if ($(clickThis).find('.img').css('left')!='auto') {
            var l0 = parseInt($(clickThis).find('.img').css('left'));
            var t0 = parseInt($(clickThis).find('.img').css('top'));
        }else{
            var l0=0;
            var t0=0;
        }
//  var fontSize = parseInt(getStyle(oDiv,'fontSize'));
//  var lineHeight = parseInt(getStyle(oDiv,'lineHeight'));

        ev.preventDefault();
        ev.stopPropagation();
        //缩放
        var disX=ev.clientX-oDiv.offsetWidth;
        var disY=ev.clientY-oDiv.offsetHeight;
        var oDivW =  oDiv.offsetWidth;
        var oDivH =  oDiv.offsetHeight;

        $('body')[0].onmousemove=function(ev){

            ev.preventDefault();
            ev.stopPropagation();
            //缩放
            var w=Math.abs(ev.clientX-disX);
            var h=Math.abs(ev.clientY-disY);
//		缩放比例系数（移动结束点坐标减去起始点坐标比上要缩放的dom的宽+高）
            var sw = (w + h)/(oDivW + oDivH);

            var zoomElementLeft = l0*sw - parseInt($('.page_content').css('left'));
            var zoomElementTop = t0*sw - parseInt($('.page_content').css('top'))+parseInt($('.page_content').css('margin-top'));
            oDiv.style.width = W * sw + 'px';
            oDiv.style.height = H * sw + 'px';

            $(clickThis)[0].style.width = W*sw + 'px';
            $(clickThis)[0].style.height = H*sw + 'px';
            if($(clickThis).find('.img')[0]!=undefined){//背景类型的图片没有子元素img，不用进行缩放
                $(clickThis).find('.img')[0].style.width = w0*sw + 'px';
                $(clickThis).find('.img')[0].style.height = h0*sw + 'px';
                $(clickThis).find('.img')[0].style.left = l0*sw + 'px';
                $(clickThis).find('.img')[0].style.top = t0*sw + 'px';
            }
        };


//    var x = $('#zoomLeftTop').offset().left;
//    var y = $('#zoomLeftTop').offset().right;
//	var matrix = $(clickThis).css('transform');
//	var str = matrix.substring(7,matrix.length-1);
//	var arr = str.split(',');
//	var w1 = W*sw;
//	var h1 = H*sw;
//
//	var x1 = (x0 - w1/2)*arr[0] +(y0 - h/2)*arr[2] + w/2;
//	var y1 = (y0 - h1/2)*arr[0] - (x0 - w/2)*arr[2] + h/2;
//
//    oDiv.style.left = x1 + 'px';
//    oDiv.style.top = y1 + 'px';




        $('body')[0].onmouseup=function(ev){
//    	 obj.onmousedown = null;
            $('body')[0].onmousemove = null;
            //撤销保存数据
            $.dataSync('cancle','zoom');
        };

        ev.preventDefault();
    };
}


//定义旋转角度函数
function rotate(obj,changeObj,textBox) {
    var preX,preY;//上一次鼠标点的坐标
    var curX,curY;//本次鼠标点的坐标
    var preAngle;//上一次鼠标点与圆心(150,150)的X轴形成的角度(弧度单位)
    var transferAngle;//当前鼠标点与上一次preAngle之间变化的角度
//	console.log(a)
    //点击事件
    $(obj).mousedown(function(event){
        var matrix = $(changeObj).css('transform');
        var deg = getmatrix(matrix);
        //console.log(matrix)
        //console.log(deg)
//		console.log(changeObj)
        var a = deg;
        preX = event.clientX;
        preY = event.clientY;
//		var ir = parseInt($(changeObj).css('width'))/2+$(changeObj).offset().left;//半径
        var x,y;
        x = $(changeObj).offset().left+parseInt($(changeObj).css('width'))/2;//元素x坐标中心轴坐标
        y = $(changeObj).offset().top+parseInt($(changeObj).css('height'))/2;//元素y坐标中心轴坐标
        //计算当前点击的点与圆心(150,150)的X轴的夹角(弧度) --> 上半圆为负(0 ~ -180), 下半圆未正[0 ~ 180]
        preAngle = Math.atan2(preY - y, preX - x);
        //移动事件
        $("html").mousemove(function(event){
            curX = event.clientX;
            curY = event.clientY;

            var curAngle = Math.atan2(curY - y, curX - x);//分别为x轴和Y轴的半径ir
            transferAngle = curAngle - preAngle;
//			console.log($(changeObj).css('transform'))
            a += (transferAngle * 180 / Math.PI);
//			console.log(transferAngle * 180 / Math.PI)
//			如果是文本框对象,同步旋转文本输入框
            if (textBox!=undefined) {
                $(textBox).rotate(a);
                $(changeObj).rotate(a);
                $(clickTextThis).rotate(a);
                //$(clickTextThis).rotate(a).attr('isrotate','true'); //记录有没有旋转过
                p3.rotate = a;//同步角度
            }else{//图片和文字框的旋转区分开处理
                $(changeObj).rotate(a);
                //			当前选中的元素同步旋转
                $(clickThis).rotate(a);
                p.rotate = a;//同步角度
            }

            preX = curX;
            preY = curY;
            preAngle = curAngle;


            event.preventDefault();
            event.stopPropagation();
        });
        //释放事件
        $("html").mouseup(function(event){
            //同步
            $.dataSync('cancle','rotate');
            setCursorStyle(p.rotate);
            $("html").unbind("mousemove");
            $("html").unbind("mouseup");
           /* //修改保存状态
            if(par.isSave){
                $('.saveType').text('未保存的更改');
                par.isSave = false;
                var saveSetTimeout = window.setTimeout(function(){
                    $('.saveType').text('保存中');
                    $.dataSync('sync');
                    clearTimeout(saveSetTimeout);
                    saveSetTimeout = null;
                },3000);
            }
*/
        });
        event.preventDefault();
        event.stopPropagation();
    });

}


//定义外部缩放层的位移函数，与正常拖拽不同，两者坐标系不一样,拖拽时内层元素层同步移动
//function zoomBoxDarg (obj) {
//	var boj = obj;
//	boj.onmousedown=function (ev) {
//		ev.preventDefault();
//		var oEvent=ev||event;
//		var divX = $(boj).offset().left;
//		var divY = $(boj).offset().top;
//		var divX0 = $(clickThis).offset().left;
//		var divY0 = $(clickThis).offset().top;
//
//		var parentX = $(boj).parent().offset().left;
//		var parentY = $(boj).parent().offset().top;
//		var parentX0 = $(clickThis).parent().offset().left;
//		var parentY0 = $(clickThis).parent().offset().top;
//		document.onmousemove = function (ev) {
//			var moveEvent=ev||event;
//			moveEvent.preventDefault();
//			moveEvent.stopPropagation();
//			var x = moveEvent.clientX - oEvent.clientX +divX - parentX;
//			var y = moveEvent.clientY - oEvent.clientY +divY - parentY;
//			$(boj).css({'left':x+'px','top':y+'px'});
//			$(clickThis).css({
//				'left':moveEvent.clientX - oEvent.clientX +divX0 - parentX0+'px',
//				'top':moveEvent.clientY - oEvent.clientY +divY0 - parentY0+'px',
//			});
//		};
//		document.onmouseup = function () {
//			document.onmousemove = null;
//			document.onmouseup = null;
//		}
//		oEvent.preventDefault();
//		oEvent.stopPropagation();
//	};
//
//
//
//}



//添加图片↓

function addImg(list,width,height) {
	//console.log(list)
	if ($('.TextInner').html().length>0) {
		var word = $('.TextInner').html();
		drawText(word);
	}
	if(list.urlImage==undefined){
		list.urlImage=list.showImageUrl;
	}
	if($('.page_content .element').length>0){//判断模板有没有渲染
		var $imgdiv = $("<div class='element imgElement image addimg' flipOrientation=0 isCutout='false' elementType='img' ></div>");
		var $zoomdiv = $("<div class='zoomimg'></div>")
		var $img = $("<img class='img' src='"+list.urlImage+"' draggable=false />");
		
		//用于标识正在拖拽移动中的元素
		moveclick = $imgdiv[0];
		
	//	获取图片在工作区域展示合适的大小
		var w = parseInt($('.page_content').css('width'));
		var h = parseInt($('.page_content').css('height'));
		var w0 = width;
		var h0 = height;
		var s = Math.round(w/h);
		if (s>1) {
			if (w0>h0) {
				var w1 = w*0.6;
				var h1 = h0/(w0/w1);
			}else{
				var h1 = h*0.8;
				var w1 = w0/(h0/h1);
			}
		}else if(s<1){
			if (w0>h0) {
				var w1 = w*0.8;
				var h1 = h0/(w0/w1);
			} else{
				var h1 = h*0.6;
				var w1 = w0/(h0/h1);
			}
		}else if(s==1){
			if (w0>h0) {
				var w1 = w*0.8;
				var h1 = h0/(w0/w1);
			} else{
				var h1 = h*0.6;
				var w1 = w0/(h0/h1);
			}
		}
		//console.log(s)
		$img.css('width','100%')
			.css('height','100%');
		$zoomdiv.css('width',w1+'px')
				.css('height',h1+'px');
		$zoomdiv.append($img); 	
		$imgdiv.append($zoomdiv); 
		$imgdiv.css('position','absolute')
			.css('left',w/2-w1/2+'px')
			.css('top',h/2-h1/2+'px')
			.css('width',w1+'px')
			.css('height',h1+'px')
			.css('transform','rotate(0)');
		dragDom($imgdiv[0]);
		imgDblclick($imgdiv);
			
		var $parent = $(".page_content"); 
		$parent.append($imgdiv); 

		$('.imgBoxbtn').slideDown();//显示顶部图片操作按钮（翻转）
		var target = $imgdiv[0];
		clickThis = $imgdiv[0];//如果单机选中该元素，将该元素传递给外层变量
		ElementThis = $imgdiv[0];
		var targetWidth = parseInt($(target).css('width'));
		var targetHeight = parseInt($(target).css('height'));
		var targetLeft = parseInt($(target).css('left'));
		var targetTop = parseInt($(target).css('top'));
		//  点击元素距离整个操作区域的坐标
		var targetWorkX = targetLeft + parseInt($('.page_content').css('left'));
		var targetWorkY = targetTop + parseInt($('.page_content').css('top'))+parseInt($('.page_content').css('margin-top'));
		
		$('.zoomImgbox').css({
			'width':targetWidth + 'px',
			'height':targetHeight + 'px',
			'left':targetWorkX + 'px',//边框有1个像素的误差
			'top':targetWorkY + 'px',
			'transform':$(target).css('transform'),
		}).show();
		$.iscopy = 'copyImg';
		init();
	}
    $.dataSync('cancle','addimg');
}

//添加图片↑


// 添加插图svg ↓
function addSvg(list, width, height){
    var base = new Base64();
    var result = base.decode(list.imageID);
    $.ajax({
        type:"get",
        url: list.urlImage,
        success:function(data){
            var frag = $('<div class="element svg addsvg selected" elementType="svg" svgSrc="'+result+'" svgScale="1"><div/>');
            getColors(frag[0]);
            dragDom(frag[0]);
            //  获取图片在工作区域展示合适的大小
            var w = parseInt($('.page_content').css('width'));
            var h = parseInt($('.page_content').css('height'));
            var w0 = width;
            var h0 = height;
            var s = Math.round(w/h);
            if (s>1) {
                if (w0>h0) {
                    var w1 = w*0.6;
                    var h1 = h0/(w0/w1);
                }else{
                    var h1 = h*0.8;
                    var w1 = w0/(h0/h1);
                }
            }else if(s<1){
                if (w0>h0) {
                    var w1 = w*0.8;
                    var h1 = h0/(w0/w1);
                } else{
                    var h1 = h*0.6;
                    var w1 = w0/(h0/h1);
                }
            }else if(s==1){
                if (w0>h0) {
                    var w1 = w*0.8;
                    var h1 = h0/(w0/w1);
                } else{
                    var h1 = h*0.6;
                    var w1 = w0/(h0/h1);
                }
            }
            $('.toolbar__slider--transparency').val(1*100);
            frag.css({
                'width': w1+'px',
                'height': h1+'px',
                'transform': 'rotate(0deg)',
                'position': 'absolute',
                'left': w/2-w1/2+'px',
                'top': h/2-h1/2+'px',
                'opacity': 1,
            });
            frag.html( $(data).find('svg') );
            $('.page_content').append(frag);
            frag.find('title').text('');
            
//          因为svg比例有误差,当svg生成后将其自动计算的高度重新赋值给其父元素
            var svgH = frag.find('svg').css('height');
            frag.css('height',svgH)
            

            var target = frag[0];
            clickThis = frag[0];//如果单机选中该元素，将该元素传递给外层变量
            ElementThis = frag[0];
            var targetWidth = parseInt($(target).css('width'));
            var targetHeight = parseInt($(target).css('height'));
            var targetLeft = parseInt($(target).css('left'));
            var targetTop = parseInt($(target).css('top'));
            //  点击元素距离整个操作区域的坐标
            var targetWorkX = targetLeft + parseInt($('.page_content').css('left'));
            var targetWorkY = targetTop + parseInt($('.page_content').css('top'))+parseInt($('.page_content').css('margin-top'));
            
            $('.zoomImgbox').css({
                'width':targetWidth + 'px',
                'height':targetHeight + 'px',
                'left':targetWorkX + 'px',//边框有1个像素的误差
                'top':targetWorkY + 'px',
                'transform':$(target).css('transform'),
            }).show();
            init();
            $.dataSync('cancle','addsvg');
        }

    });
}
//添加插图svg ↑

//文字部分↓
var titleStr = '点击添加标题';
var titleStr_f = '点击添加副标题';
var contentStr = '点击添加正文';
//添加文字
function addText(fonttype) {
    //调出 文字操作区域
    $('.toolbarWrapper').show();
    $('.toolbarList').hide();
    $('.toolbarFilter').hide();
    $('.toolbarLeft').css('display','block');
    $('.toolbarRight').show();
    $('.zoomImgbox').hide();
    $('.TextInner').removeClass('titlebg');
    //console.log(orfontStand);
    var addTextSize = parseInt($('#page_content').css('width'))/par.width;
    fontStand = orfontStand * addTextSize;//基本字号
    var fontsize_attr = fontStand;
    if ($('.TextInner').html().length>0) {
        var islist = $('.TextInner').attr('list-layout');
        var word = $('.TextInner').html();
        drawText(word,islist);
    }
    var fontattr_ ;
    if (fonttype==1) {
        var w = (262)*addTextSize + 'px';
        var h = 58*addTextSize + 'px';
        fontsize_attr = 42;
        fontattr_ = 42;
        var currfontsize_min = (12/fontStand)*16;
        if (fontsize_attr < Math.ceil(currfontsize_min)) {
            fontsize_attr = Math.ceil(currfontsize_min);
        }
        var fontSize = fontsize_attr*100/orfontStand +'%';

        var lettersp = $.letterSpacePxtoRem('0');
        var word = titleStr;
        var fontweight = '400';
        //$('.TextInner').addClass('titlebg');
        $('.TextInner').attr('titlebg','1');
    }else if(fonttype==2){
        fontsize_attr = 24;
        fontattr_ = 24;
        var currfontsize_min = (12/fontStand)*16;
        if (fontsize_attr < Math.ceil(currfontsize_min)) {
            fontsize_attr = Math.ceil(currfontsize_min);
        }
        var w = (fontsize_attr*7+12)*addTextSize + 'px';

        //计算出当前字体 px
        var fontpx = (fontsize_attr/16)*addTextSize;
        var h = fontpx*1.6 + 'px';
        //当前字号
        var fontSize = fontsize_attr*100/orfontStand +'%';

        var lettersp = $.letterSpacePxtoRem('0');
        var word = titleStr_f;
        var fontweight = '400';
        //$('.TextInner').addClass('titlebg');
        $('.TextInner').attr('titlebg','1');
    }else if(fonttype==3){
        //当前支持最小字号
        fontsize_attr = 16;
        fontattr_ = 16;
        var currfontsize_min = (12/fontStand)*16;
        if (fontsize_attr < Math.ceil(currfontsize_min)) {
            fontsize_attr = Math.ceil(currfontsize_min);
        }
        var w = (fontsize_attr*6+10)*addTextSize+10 + 'px';
        //计算出当前字体 px
        var fontpx = (fontsize_attr/16)*addTextSize;

        var h = fontpx*1.6 + 'px';
        var fontSize = fontsize_attr*100/orfontStand + '%';

        var lettersp = $.letterSpacePxtoRem('0');
        var word =contentStr ;
        var fontweight = '400';
        $('.TextInner').attr('titlebg','0');
    }
    var color_ = '#000';

    $('.TextInner').html(word);
    $('.TextInner').attr('list-layout','false');
    $('.TextInner').attr('addtext','true');//后添加
    $('.TextInner').attr('isrotate','false');//判断是否旋转过
    var w0 = strTonumber(w);
    var h0 = strTonumber(h);
    var contentWidth = parseInt($('#page_content').css('width'));
    var contentHeight = parseInt($('#page_content').css('height'));
    var contentLeft = parseInt($('#page_content').css('left'));
    var contentTop = parseInt($('#page_content').css('top'))+parseInt($('#page_content').css('margin-top'));
    //console.log(parseInt($('.TextInner').css('width')));
    var textLeft = contentLeft+contentWidth/2-w0/2;
    var textTop = contentTop+contentHeight/2-h0/2;
    var lineheightScale = 1;
    $('.editTextBox').addClass('selected');
    $('.editTextBox').css({
        'left':textLeft+'px',
        'top':textTop+'px',
        'font-size':fontSize,
        'font-weight':fontweight,
        'width':w,
        'height':h,
        'text-align':'center',
        'font-family':'STXianhei',
        'letter-spacing':lettersp,
        'color':color_,
        'line-height':((parseFloat(fontSize)*fontStand)/100)*1.4+'px'//拿到当前字体大小得百分比 转化成px的值  乘以行高比
    });
    $('.editTextBox').css('transform','rotate(0)');//重置角度值
    $('.playTextBox').css('transform','rotate(0)');//重置角度值
    $('.TextInner').css({
        'width':w
    }).attr('fontsize',fontattr_).attr('letterspacing',lettersp).attr('lineheight',1.4);
    // $('.editTextBox').css('line-height',$.numberPx(1.4*sizeScale,$('.editTextBox').css('font-size')));
//	文字旋转拉伸框
    $('.playTextBox').show();
    $('.playTextBox').css('width',$('.editTextBox').css('width'))
        .css('height',$('.editTextBox').css('height'))
        .css('left',$('.editTextBox').css('left'))
        .css('top',$('.editTextBox').css('top'));

    $('.editTextBox').slideDown();
    $('.toolbarFont').css('display','block');
    //键盘监听 开关
    //$.onkey = true;
    $('.TextInner').focus();
    //全部选中
    titleSelectAll('TextInner');
//  同步文字属性到顶部功能按钮
    showTextAttribute();

    var $parent = $(".page_content");
    var fonts = $('.TextInner').attr('fontsize');
    var letters = $('.TextInner').attr('letterspacing');
    var istitle_ = $('.TextInner').attr('titlebg');
    var $test = $("<div class='element textElement text' elementType='text' style='display: none;'></div>");
    var $innertest = $("<div class='innerText' list-layout='false' addtext='true' fontsize="+fonts+" letterspacing = "+letters+">"+word+"</div>");
    $test.css({
        'left':strTonumber($('.editTextBox').css('left'))-strTonumber($('#page_content').css('left'))+'px',
        'top':strTonumber($('.editTextBox').css('top'))-strTonumber($('#page_content').css('top'))-strTonumber($('#page_content').css('margin-top'))+'px',
        'font-size':fontSize,
        'font-weight':fontweight,
        'width':w,
        'height':h,
        'text-align':'center',
        'font-family':'STXianhei',
        'letter-spacing':lettersp,
        'color':color_,
        'line-height':(parseFloat(fontSize)*fontStand)/100*1.4+'px'
    });
    $innertest.css({
        'width':w
    }).attr('lineheight',1.4);
    if(istitle_ == 1){
        $innertest.attr('titlebg',istitle_);
    }else{
        $innertest.attr('titlebg','0');
    }
    clickTextThis=$test[0];
    $.iscopy = 'copyText';
    ElementThis=$test[0];
    dragDom($test[0]);
    $test.append($innertest);
    $parent.append($test);
    inittext();
    $.dataSync('cancle','addtext');
}

//将文字操作框内文字读出，渲染操作区域内文字,从编辑层到视图层
function drawText (word,type) {
    //判断是否第一次点击键盘
    $.firstOnkey = true;
    //如果编辑框内文字内容为空，则删除相对应的元素
    if(word.length == 0){
        $(ElementThis).removeClass('selected');
        $(ElementThis).remove();
        $('.toolbarWrapper').slideUp();
        $('.zoomImgbox').hide();
        $('.editTextBox').hide();
        $('.playTextBox').hide();
    }else{
        var $parent = $(".page_content");
        var fonts = $('.TextInner').attr('fontsize');//当前字号

        //实际生效的字号
        var currfontsize_min = (12/fontStand)*16;
        if (parseInt(fonts) < Math.ceil(currfontsize_min)) {
            fonts = Math.ceil(currfontsize_min);
        }

        var fon_size = $.fontSizePxtoPer(fonts);//拿到百分比 是元基准字体14 的百分比
        var font_size_px = parseFloat(fon_size)*fontStand/100;//当前真是px值
        var letters = $('.TextInner').attr('letterspacing');
        var lineheights = $('.TextInner').attr('lineheight');

        var isaddtext = $('.TextInner').attr('addtext');
        var isrotate = $('.TextInner').attr('isrotate');
        var islist = null;
        if(type == 'true'){
            islist = type;
        }else{
            islist = $('.TextInner').attr('list-layout');
        }
        var elementType = $('.editTextBox').attr('elementType');
        var data_index = $('.editTextBox').attr('data-index');
        var isUppercase = $('.editTextBox').attr('isUppercase');
        $(clickTextThis).attr({
            'data-index':data_index,
            'isUppercase':isUppercase
        })
        $(clickTextThis).find('.innerText').attr({
            'list-layout':islist,
            'addtext':"true",
            'isrotate':isrotate,
            'fontsize':$('.TextInner').attr('fontsize'),
            'letterspacing':letters,
            'lineheight':lineheights
        });
        /*---------新加-----------*/
        //var  numberemtopx = Number(letters)*fontStand;
        var widths = $('.TextInner').css('width');

        $(clickTextThis).find('.innerText').html(word);
        $(clickTextThis).find('.innerText').css('width',$('.TextInner').css('width'))/*.css('height',$('.TextInner').css('height'))*/;

        $(clickTextThis).css('width',strTonumber($('.editTextBox').css('width'))+'px')
            .css('height',strTonumber($('.editTextBox').css('height'))+'px')
            .css('left',strTonumber($('.editTextBox').css('left'))-strTonumber($('#page_content').css('left'))+'px')
            .css('top',strTonumber($('.editTextBox').css('top'))-strTonumber($('#page_content').css('top'))-strTonumber($('#page_content').css('margin-top'))+'px')
            .css('font-size',fon_size)//属性值 单位百分比
            .css('transform',$('.editTextBox').css('transform'))
            .css('font-family',$('.editTextBox').css('font-family'))
            .css('font-weight',$('.editTextBox').css('font-weight'))
            .css('color',$('.editTextBox').css('color'))
            .css('letter-spacing',letters) //从属性取值 单位是em
            .css('line-height',lineheights *font_size_px  +'px')//缩放比乘以字体大小
            .css('text-align',$('.editTextBox').css('text-align'))
            .css('text-transform',$('.editTextBox').css('text-transform'));//字体大小写
        //粗体
        $(clickTextThis).css('font-style',$('.editTextBox').css('font-style'));
        $('.TextInner').html('');
//	隐藏文字输入框
        $('.editTextBox').hide();
//	隐藏文字旋转拉伸框
        $('.playTextBox').hide();
        $(clickTextThis).show();
        //$.onkey = false;
    }

}


//文字操作框拉伸功能
function  pillText(obj,pullType) {
    var type = pullType;
//	console.log(obj)
    obj.onmousedown = function (ev) {
        var that = this;
        ev.preventDefault();
        ev.stopPropagation();
        var oEvent = ev || event;
        //	$('#cutbox').css('transform','translate(233px,133px)')
        var divX = $(obj).offset().left;
        var divY = $(obj).offset().top;
        var w = parseInt($('.editTextBox').css('width'));
        var l = parseInt($('.editTextBox').css('left'));
        //记录左边拉伸的位置
        var leftpill_i = 0;
        document.onmousemove = function (ev) {
            var moveEvent = ev || event;
            moveEvent.preventDefault();
            moveEvent.stopPropagation();
            var x = moveEvent.clientX;
            var y = moveEvent.clientY;
            //获得当前字体大小，设置为编辑层的最小宽度
            var edit_minW = parseInt($('.editTextBox').css('font-size'));
            //获得当前编辑层的宽度
            var edit_currW = parseInt($('.playTextBox').css('width'));

            if (type == 'left') {
                $('.playTextBox').css('width', w - (x - divX) + 'px');
                $('.playTextBox').css('height', $('.TextInner').css('height'));
                $('.playTextBox').css('left', l + (x - divX) + 'px');

                //编辑框拖动事件源
                // $('.editboxClickEvent').css('height',parseInt($('.TextInner').css('height'))+10+'px');
                // $('.editboxClickEvent').css('width',w - (x - divX) + 'px');

                if(edit_currW<edit_minW){
                    $('.editTextBox').css('height',$('.TextInner').css('height'));
                    $('.editTextBox').css('width',edit_minW);
                    $('.TextInner').css('width', edit_minW);

                    $(clickTextThis).css('height',$('.TextInner').css('height'));
                    $(clickTextThis).css('width',edit_minW);
                    $(clickTextThis).find('.innerText').css('width', edit_minW);
                    leftpill_i++;
                    //if(leftpill_i >= edit_minW){
                    //左边框停止移动
                    $('.editTextBox').css('left', $('.editTextBox').css('left'));
                    $('.playTextBox').css('left',  $('.editTextBox').css('left'));
                    $(clickTextThis).css('left',  $('.editTextBox').css('left'));
                    //}else{
                    //$('.editTextBox').css('left', l + (x - divX) + 'px');
                    //}
                }else{
                    $('.editTextBox').css('height',$('.TextInner').css('height'));
                    $(clickTextThis).css('height',$('.TextInner').css('height'));
                    $('.TextInner').css('width', w - (x - divX) + 'px');
                    $('.editTextBox').css('width', w - (x - divX) + 'px');
                    $('.editTextBox').css('left', l + (x - divX) + 'px');
                    $(clickTextThis).css('width', w - (x - divX) + 'px');
                    $(clickTextThis).css('left', l + (x - divX) + 'px');

                }
                $('.dragShow_wh').show().css('left', '-60px');
                //显示编辑层的宽高
                var leftW = (w - (x - divX));
                if(leftW<=0){
                    var leftW = 0;
                }
                $('.dragShow_wh .dragShow_whtext').html(leftW + ' x ' + parseInt($('.TextInner').css('height')));
                //设置操作框的两边拖拽按钮的位置
                var dragIcontop = parseInt($('.TextInner').css('height')) / 2 - 7 + 'px';
                $('#dragRightCenter').css('top', dragIcontop);
                $('#dragLeftCenter').css('top', dragIcontop);
            } else if (type == 'right') {
                $('.playTextBox').css('width', w + x - divX + 'px');
                $('.playTextBox').css('height', $('.TextInner').css('height'));
                //编辑框拖动事件源
                // $('.editboxClickEvent').css('height',parseInt($('.TextInner').css('height'))+10+'px');
                // $('.editboxClickEvent').css('width', w + x - divX + 'px');
                if(edit_currW<edit_minW){
                    $('.editTextBox').css('height',$('.TextInner').css('height'));
                    $('.editTextBox').css('width',edit_minW);
                    $('.TextInner').css('width', edit_minW);

                    $(clickTextThis).css('height',$('.TextInner').css('height'));
                    $(clickTextThis).css('width',edit_minW);
                    $(clickTextThis).find('.innerText').css('width', edit_minW);
                }else{
                    $('.editTextBox').css('height',$('.TextInner').css('height'));
                    $('.TextInner').css('width', w + x - divX + 'px');
                    $('.editTextBox').css('width', w + x - divX + 'px');

                    $(clickTextThis).css('height',$('.TextInner').css('height'));
                    $(clickTextThis).find('.innerText').css('width', w + x - divX + 'px');
                    $(clickTextThis).css('width', w + x - divX + 'px');
                }
                //显示编辑层的 宽高
                $('.dragShow_wh').show().css('right', '-60px');
                var rightW = (w + x - divX);
                if(rightW<=0){
                    var rightW = 0;
                }
                $('.dragShow_wh .dragShow_whtext').html(parseInt(rightW) + ' x ' + parseInt($('.TextInner').css('height')));
                //设置操作框的两边拖拽按钮的位置
                var dragIcontop = parseInt($('.TextInner').css('height')) / 2 - 7 + 'px';
                $('#dragRightCenter').css('top', dragIcontop);
                $('#dragLeftCenter').css('top', dragIcontop);
            }

        };
        document.onmouseup = function () {
            $('.dragShow_wh').hide();
            $('.playTextBox').css({
                'width': $('.editTextBox').css('width'),
                'height': $('.editTextBox').css('height')
            });
            document.onmousemove = null;
            document.onmouseup = null;
        };
        oEvent.preventDefault();
        oEvent.stopPropagation();
    };
}
//	文字的属性同步功能按钮
function showTextAttribute () {
    var fontF = $('.editTextBox').css('font-family');
    var fontF_ = fontF.replace(/\"/g, "");
    var fontLen = par.fontList.length;
    for(var i=0;i<fontLen;i++){
        if(fontF_ == par.fontList[i].fontttf){
            $('.fontbar').html(par.fontList[i].fontChina);
            $('.fontbar').attr('font-family',par.fontList[i].fontttf);
        }
    }
    if(fontF_ == 'STXianhei'){
        $('.fontbar').html('华文等线');
        $('.fontbar').attr('font-family','STXianhei');
    }
    if(fontF_ == 'Abril Fatface'){
        $('.fontbar').html('Abril Fatface');
    }
    if(fontF_ == '微软雅黑'){
        $('.fontbar').html('微软雅黑');
    }
    $('.sizebar').val(parseInt($('.TextInner').attr('fontsize')));
    hasTitle();
    //拿到加粗
    var bolder_ = $('.editTextBox').css('font-weight');
    if(bolder_ == '700' || bolder_ == 'bold'){
        $('.bold-icon').css('background-color','rgb(255,236,237)');
    }else{
        $('.bold-icon').css('background-color','rgb(255, 255, 255)');
    }
    //拿到斜体
    var italic_ = $('.editTextBox').css('font-style');
    if(italic_ == 'italic'){
        $('.italic-icon').css('background-color','rgb(255,236,237)');
    }else{
        $('.italic-icon').css('background-color','rgb(255, 255, 255)');
    }
    //拿到大写
    var $alleles = $('.editTextBox').children();
    var allStr = '';
    $alleles.each(function(){
        allStr += ''+$(this).text();
    });
    if(/^[A-Z]+$/.test( allStr ) ){
        //大写的
        $('.upercase-icon').css('background-color','rgb(255,236,237)');
    }else{
        $('.upercase-icon').css('background-color','rgb(255, 255, 255)');
    }
    $('.colorbar').css('background',$('.editTextBox').css('color'));

    //对齐方式
    var textAlign = $('.editTextBox').css('text-align');
    $('.textAlign').attr('data-align',textAlign);
    $('.textAlign_'+textAlign).css('background-color','rgb(255, 236, 237)').siblings().css('background-color','rgb(255, 255, 255)');
    $('.alignbar ').css('background-image','url("../../images/workimg/text-align-'+textAlign+'.svg")');

    //列表属性
    var isList = $('.editTextBox').find('.TextInner').attr('list-layout');
    $('.list-icon').attr('list-layout',isList);
    if(isList == 'true'){
        $('.list-icon').css('background-color','rgb(255,236,237)');
    }else{
        $('.list-icon').css('background-color','rgb(255, 255, 255)');
    }

    //间距
    $('.showSpacing').html($.letterSpaceRemtoPx($('.TextInner').attr('letterspacing')));
    $('.wordSpacing').val($.letterSpaceRemtoPx($('.TextInner').attr('letterspacing')));

    //行高
    var lin = $('.TextInner').attr('lineheight');
    $('.showLine').html(Number(lin).toFixed(1));
    $('.LineSp').val(lin);
}
//标题 设置工具栏 粗体和斜体 禁止
var hasTitle = function(titleObj) {
    var istitl = $('.TextInner').attr('titlebg');
    if (istitl == '1'){
        $('.bold-icon').css('opacity','.4');
        $('.italic-icon').css('opacity','.4');
    }else{
        $('.bold-icon').css('opacity','1');
        $('.italic-icon').css('opacity','1');
    }
};
var titleSelectAll = function(classNmae){
    //	添加文字后选中该文字框内所有文字
    var text=$('.'+classNmae)[0];
    // $('.'+classNmae).attr('isTitltbg','true');
    if(window.getSelection().toString().length>0){
        return false;
    }else{
        if (document.body.createTextRange) {
            var range = document.body.createTextRange();
            range.moveToElementText(text);
            range.select();
        } else if (window.getSelection) {
            var selection = window.getSelection();
            var range = document.createRange();
            range.selectNodeContents(text);
            selection.removeAllRanges();
            selection.addRange(range);
        } else {
            console.log("workjs titleSelectAll none");
        }
    }
};
//计算移动位置
function editTextBoxDarg (obj,obj2) {
    var boj = obj;
    boj.onmousedown=function (ev) {
        ev.preventDefault();
        var oEvent=ev||event;
        var deltaX = event.pageX - parseInt($(boj).css('left'));
        var deltaY = event.pageY - parseInt($(boj).css('top'));
        document.onmousemove = function (ev) {
            var moveEvent=ev||event;
            moveEvent.preventDefault();
            moveEvent.stopPropagation();
            var event = window.event;
            var x  = event.pageX - deltaX;
            var y = event.pageY - deltaY;
            $(obj2).css({'left':x+'px','top':y+'px'});
        };
        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
        }
        oEvent.preventDefault();
        oEvent.stopPropagation();
    };
}

//文字部分↑

//同步裁剪部分图片大小数据
function cogradientImg () {
    $('.masked').css({
        'left':$('.uncropbox').css('left'),
        'top':$('.uncropbox').css('top'),
        'width':$('.uncropbox').css('width'),
        'height':$('.uncropbox').css('height'),
    })
}
//同步裁剪部分裁剪框大小数据
function cogradientBox () {
    $('.cropBox').css({
        'left':$('.viewPort').css('left'),
        'top':$('.viewPort').css('top'),
        'width':$('.viewPort').css('width'),
        'height':$('.viewPort').css('height')
    })
    $('.uncropbox').css({
        'left':$('.masked').css('left'),
        'top':$('.masked').css('top'),
        'width':$('.masked').css('width'),
        'height':$('.masked').css('height')
    })
}

//获取2d旋转角度
function getmatrix(matrix){
    var str = matrix.substring(7,matrix.length-1);
    var arr = str.split(',');
    var aa=Math.round(180*Math.asin(arr[0])/ Math.PI);
    var bb=Math.round(180*Math.acos(arr[1])/ Math.PI);
    var cc=Math.round(180*Math.asin(arr[2])/ Math.PI);
    var dd=Math.round(180*Math.acos(arr[3])/ Math.PI);
    var deg=0;
    if(aa==bb||-aa==bb){
        deg=dd;
    }else if(-aa+bb==180){
        deg=180+cc;
    }else if(aa+bb==180){
        deg=360-cc||360-dd;
    }
    return deg>=360?0:deg;
}

//getmatrix(-0.0173017, -0.99985, 0.99985, -0.0173017, 0, 0)
//console.log(getmatrix(0.184888, 0.98276, -0.98276, 0.184888, 0, 0))


//交换两个DOM节点在文档中的位置
function swapElements(a,b){
    if(a==b)return;
    //记录父元素
    var bp=b.parentNode,ap=a.parentNode;
    //记录下一个同级元素
    var an=a.nextElementSibling,bn=b.nextElementSibling;
    //如果参照物是邻近元素则直接调整位置
    if(an==b)return bp.insertBefore(b,a);
    if(bn==a)return ap.insertBefore(a,b);
    if(a.contains(b)) //如果a包含了b
        return ap.insertBefore(b,a),bp.insertBefore(a,bn);
    else
        return bp.insertBefore(a,b),ap.insertBefore(b,an);
};


//更改图层层级
function topClass (type,ev) {
    var e = ev||event;
//	显示当前层级
    $('.showZindex').remove();
    var index = $(ElementThis).index();
    var objArr = $('#page_content>.element');

    if (type=='up') {
        if($(ElementThis).attr('elementtype')!='text'){//图片或者svg素材
            if (index!=objArr.length-1) {
                swapElements(ElementThis,objArr[index+1])
            }
        }else if($(ElementThis).attr('elementtype')=='text'){//文字素材
            if (index!=objArr.length-1) {
                swapElements(ElementThis,objArr[index+1])
            }
            $('.editTextBox').css('opacity',0);
            $(clickTextThis).show();
            $(clickTextThis).find('.innerText').html($('.TextInner').html())
        }

    } else if(type=='down'){

        if($(ElementThis).attr('elementtype')!='text'){//图片或者svg素材
            if (index!=0) {
                swapElements(ElementThis,objArr[index-1])
            }
        }else if($(ElementThis).attr('elementtype')=='text'){//文字素材
            if (index!=0) {
                swapElements(ElementThis,objArr[index-1])
            }
            $('.editTextBox').css('opacity',0);
            $(clickTextThis).show();
            $(clickTextThis).find('.innerText').html($('.TextInner').html())
        }
    }

//	显示更新后的层级
    var indexOf = $(ElementThis).index();
    var objArr = $('#page_content>.element');
	var length = objArr.length;
	var index = length-1-indexOf;//反转数组的index做显示
    var $ui = $("<div class='showZindex'></div>");
    for (var i=0;i<objArr.length;i++) {
        var $li = $("<li class='z-index'></li>");
        if (i==index) {
            $li.addClass('classOn');
        }
        $ui.append($li);
    }
    var $parent = $(".toolbar__item--range");
    $parent.append($ui);

    if(index==0){
    	$('.up>button').prop('disabled',true);
        $('.up>button').css('color','#bbb');
    }else{
        $('.up>button').prop('disabled',false);
        $('.up>button').css('color','#000');
    }
    if(index==objArr.length-1){
        $('.down>button').prop('disabled',true);
        $('.down>button').css('color','#bbb');
    }else{
    	$('.down>button').prop('disabled',false);
        $('.down>button').css('color','#000');
    }


    $('.showZindex').fadeOut(4000)
    //同步
    //$.isSynctoend('更改图层层级',htmlType);
    $.dataSync('cancle','更改图层层级');
    e.preventDefault();
    e.stopPropagation();
}

//定义单纯渲染JSON数据到工作区的方法
function drawBlankSpace (w,h,color) {
    //console.log('空模板：'+JSON.stringify($.templateSysn));
    var jsonObj = json;
    jsonObj.content.pages[0].objects[0].width=w;
    jsonObj.content.pages[0].objects[0].height=h;
    jsonObj.content.pages[0].objects[0].backgroundColor=color;
    jsonObj.content.pages[0].width=w;
    jsonObj.content.pages[0].height=h;

    w0 = jsonObj.content.pages[0].width;
    h0 = jsonObj.content.pages[0].height;
    w1 = parseInt($('#documentContainer').css('width'));
    h1 = parseInt($('#documentContainer').css('height'));
    getPagesize(w1,h1,w0,h0);
    var width = w2;//jsonObj.content.pages[0].width;
    var height = h2;//jsonObj.content.pages[0].height;

    par.width = w0;
    par.height = h0;

    //初始化同步
    par.nullTemplate = jsonObj.content.template;
    par.templateJson.push(jsonObj);
    par.isSave = false;
    par.templateSysn = {
        'templateId':0,
        'templteTitle':'',
        'Timestamp':0
    };
    par.templateId = 0;
    //var height = h2*sizeScale;
    $('.page_content').css('width',width+'px').css('height',height+'px').css('top',50+'%').css('margin-top',-parseInt(height/2)+'px');
    var topcss = $('.page_content').css('top');
    $('.page_content').css('top',parseInt(topcss));
    //拿到变化后的 基准字体
    var textSize = parseInt($('#page_content').css('width'))/par.width;
    fontStand = orfontStand * sizeScale;
    $('#documentContainer').css('font-size',fontStand+'px');
    $('.page_content').css('left',parseInt(w1/2 -width/2) +'px');
    var arr = jsonObj.content.pages[0].objects;
    for (var i=0;i<arr.length;i++) {
        if (arr[i].type=='photo') {
            if (arr[i].isBackground==true) {
                //console.log(sizeScale*arr[i].height)
                var $div = $("<div class='element image backgroundColor' isBackground=true flipOrientation="+arr[i].flipOrientation+" isCutout="+arr[i].isCutout+" data-index="+i+"></div>");
                changeImageColor($div[0]);
                bgClick($div[0]);//背景的单击事件
                dragDom($div[0]);
                $div.css('width',sizeScale*arr[i].width+'px')
                    .css('height',sizeScale*arr[i].height+'px')
                    .css('position','absolute')
                    .css('background-color',arr[i].backgroundColor)
                    .css('left',sizeScale*arr[i].left)
                    .css('top',sizeScale*arr[i].top)
                    .css('transform','rotate('+arr[i].degree+'deg)');
                var $parent = $(".page_content");
                $parent.append($div);
            }

        }
    }
}

//背景素材单击事件
function bgClick (dom) {
	var boj = dom;
	$(dom).click(function () {
        //用来区分复制功能的元素
        $.iscopy = 'copyImg';

        $('.editTextBox').removeClass('selected');
        $('.toolbarWrapper').show(400); //顶部颜色操作框
        $(boj).addClass('selected');

        $('.imgBoxbtn').slideDown();//显示顶部图片操作按钮（翻转）
        $('.toolbarFont').hide();//顶部文字功能按钮隐藏
        var target = boj;
        clickThis = boj;//如果单机选中该元素，将该元素传递给外层变量
        ElementThis = boj;

        var targetWidth = parseInt($(target).css('width'));
        var targetHeight = parseInt($(target).css('height'));
        var targetLeft = parseInt($(target).css('left'));
        var targetTop = parseInt($(target).css('top'));
        //  点击元素距离整个操作区域的坐标
        var targetWorkX = targetLeft + parseInt($('.page_content').css('left'));
        var targetWorkY = targetTop + parseInt($('.page_content').css('top'))+parseInt($('.page_content').css('margin-top'));

        $('.zoomImgbox').css({
            'width':targetWidth + 'px',
            'height':targetHeight + 'px',
            'left':targetWorkX + 'px',
            'top':targetWorkY + 'px',
            'transform':$(target).css('transform')
        }).show();
        $(dom).css('cursor','move');
        
        init();
	})
}

//当浏览器大小变化时操作区元素同步变化
$(window).resize(function () {
    w0=strTonumber($('.page_content').css('width'));
    h0=strTonumber($('.page_content').css('height'));
    w1 = strTonumber($('#documentContainer').css('width'));
    h1 = strTonumber($('#documentContainer').css('height'));
    if (w1*h0>w0*h1) {
        h2 = 0.84*h1;
        w2 = h2*w0/h0;
    } else{
        w2 = 0.84*w1;
        h2 = w2*h0/w0;
    }
    sizeScale = w2/w0;
    var width = w2;
    var height = h2;
    //当前屏幕比例
    var textSize_ = w2/par.width;
    //拿到变化后的 基准字体
    var fontStand_ = 16 * textSize_;
    //当前比例最小字号
    var currfontsize_min = Math.ceil((12/fontStand_)*16);
    var arr_minfontsize  = $('#page_content .element');
    //是否可以缩放的阈值
    var min_fontsize = true;
    for(var j=0;j<arr_minfontsize.length;j++){
        if($(arr_minfontsize[j]).hasClass('text')){
            //当前字号
            var curFontSize = $(arr_minfontsize[j]).find('.innerText').attr('fontsize');
            if(curFontSize<currfontsize_min){
                min_fontsize = false;
            }
        }
    }

//	此处设置工作区域可缩小的最小尺寸
	if(parseInt($('#documentContainer').css('width'))>700 && min_fontsize){
	    //	获取模板缩放比例
	    $('.page_content').css('width',width+'px').css('height',height+'px').css('top',50+'%').css('margin-top',-parseInt(height/2)+'px');
	    var topcss = $('.page_content').css('top');
	    $('.page_content').css('top',parseInt(topcss));
	    $('.page_content').css('left',parseInt(w1/2 -width/2) +'px');
        //拿到变化后的 基准字体
        var textSize = parseInt($('#page_content').css('width'))/par.width;
        fontStand = 16 * textSize;

//      console.log($('#documentContainer').css('font-size'));
//      console.log(sizeScale);
//      console.log(fontStand);
        $('#documentContainer').css('font-size',fontStand+'px');
        var arr  = $('#page_content .element');
	    for (var i=0;i<arr.length;i++) {

	        if ($(arr[i]).hasClass('image')) {
	            if ($(arr[i]).attr('isBackground')=='true') {
	                $(arr[i]).css('width',sizeScale*strTonumber($(arr[i]).css('width'))+'px')
		                     .css('height',sizeScale*strTonumber($(arr[i]).css('height'))+'px')
		                     .css('left',sizeScale*strTonumber($(arr[i]).css('left'))+'px')
		                     .css('top',sizeScale*strTonumber($(arr[i]).css('top'))+'px')

	            }else{
	                $(arr[i]).find('.zoomimg').css('width',sizeScale*strTonumber($(arr[i]).find('.zoomimg').css('width'))+'px')
	                    					  .css('height',sizeScale*strTonumber($(arr[i]).find('.zoomimg').css('height'))+'px');
	                $(arr[i]).css('width',sizeScale*strTonumber($(arr[i]).css('width'))+'px')
		                     .css('height',sizeScale*strTonumber($(arr[i]).css('height'))+'px')
		                     .css('left',sizeScale*strTonumber($(arr[i]).css('left'))+'px')
		                     .css('top',sizeScale*strTonumber($(arr[i]).css('top'))+'px')
	            }

	        }else if($(arr[i]).hasClass('text')){
                //在属性 中拿到当前字号
                var font_zh = $(arr[i]).find('.innerText').attr('fontsize');
               var fon_size = $.fontSizePxtoPer(font_zh);//拿到百分比 是元基准字体16 的百分比
                //字体的百分比 * 当前的 基准字体
                var currfontSize_px = (parseFloat(fon_size)/100) *fontStand;
                /*-------新加------*/
                var  letter= $(arr[i]).find('.innerText').attr('letterSpecing');
                ///var numberemtopx = Number(letter)*currfontSize_px;

                $(arr[i]).css('width',sizeScale*strTonumber($(arr[i]).css('width'))+'px')/*
                         .css('height',sizeScale*strTonumber($(arr[i]).css('height'))+'px')*/
                         .css('left',sizeScale*strTonumber($(arr[i]).css('left'))+'px')
                         .css('top',sizeScale*strTonumber($(arr[i]).css('top'))+'px')
                    .css('letter-spacing',letter);
                         /*.css('font-size',fon_size)*/;
                $(arr[i]).find('.innerText').css('width',$(arr[i]).css('width'));

                var currli_h = $(arr[i]).find('.innerText').attr('lineheight');
                if(currli_h){
                    $(arr[i]).css('line-height',currli_h*currfontSize_px+'px');//行高比例 * 屏幕缩放比 * 字体px值  arr[i].fontSize不带单位得px值
                }else{
                    //行高默认值 1 * 字体大小
                    $(arr[i]).css('line-height',currfontSize_px+'px');//等于真实字体px值
                }
				//文字缩放时的高度误差
                var innertestH =  $(arr[i]).find('.innerText').css('height');
            	$(arr[i]).css('height',innertestH);
	        }else if($(arr[i]).hasClass('svg')){
	            $(arr[i]).css('width',sizeScale*strTonumber($(arr[i]).css('width'))+'px')
	                     .css('height',sizeScale*strTonumber($(arr[i]).css('height'))+'px')
	                     .css('left',sizeScale*strTonumber($(arr[i]).css('left'))+'px')
	                     .css('top',sizeScale*strTonumber($(arr[i]).css('top'))+'px');
	                     
                //因为svg比例有误差,当svg生成后将其自动计算的高度重新赋值给其父元素
	            var svgH = $(arr[i]).find('svg').css('height');
	            $(arr[i]).css('height',svgH);
	        }else if($(arr[i]).hasClass('grid')){
	            $(arr[i]).css('width',sizeScale*strTonumber($(arr[i]).css('width'))+'px')
	                     .css('height',sizeScale*strTonumber($(arr[i]).css('height'))+'px')
	                     .css('left',sizeScale*strTonumber($(arr[i]).css('left'))+'px')
	                     .css('top',sizeScale*strTonumber($(arr[i]).css('top'))+'px')

	        }

	    }

		//视窗更改大小时如果正处于文字编辑阶段▼
		if($('.editTextBox').css('display')!='none'){

	    	$('.editTextBox').css('width',$(clickTextThis).css('width'))
	    					 .css('height',$(clickTextThis).css('height'))
		                     .css('left',strTonumber($(clickTextThis).css('left'))+strTonumber($('#page_content').css('left'))+'px')
		                     .css('top',strTonumber($(clickTextThis).css('top'))+strTonumber($('#page_content').css('top'))+strTonumber($('#page_content').css('margin-top'))+'px')
		                     .css('font-size',$(clickTextThis).css('font-size'))
							 .css('line-height',$(clickTextThis).css('line-height'));
			$('.TextInner').css('width',$(clickTextThis).find('.innerText').css('width'))
	        
	        //因为文字高度有误差,当文字生成后将其自动计算的高度重新赋值给其父元素
            var textH = $('.TextInner').css('height');
            $('.editTextBox').css('height',textH);
            $('.playTextBox').css('width',$('.editTextBox').css('width'))
			                 .css('height',$('.editTextBox').css('height'))
			                 .css('left',$('.editTextBox').css('left'))
			                 .css('top',$('.editTextBox').css('top'))
		}

		//视窗更改大小时如果正处于文字编辑阶段▲

		//视窗更改大小时如果正处于图片拖拽阶段▼
        var targetWidth = parseInt($(ElementThis).css('width'));
        var targetHeight = parseInt($(ElementThis).css('height'));
        var targetLeft = parseInt($(ElementThis).css('left'));
        var targetTop = parseInt($(ElementThis).css('top'));
        //  点击元素距离整个操作区域的坐标
        var targetWorkX = targetLeft + strTonumber($('.page_content').css('left'));
        var targetWorkY = targetTop + strTonumber($('.page_content').css('top'))+strTonumber($('.page_content').css('margin-top'));

        $('.zoomImgbox').css({
            'width':targetWidth + 'px',
            'height':targetHeight + 'px',
            'left':targetWorkX + 'px',
            'top':targetWorkY + 'px',
            'transform':$(ElementThis).css('transform')
        })
		//视窗更改大小时如果正处于图片拖拽阶段▲


		//视窗更改大小时如果正处于裁剪阶段
		if ($('.cropControls').css('display')!='none') {//正在裁剪图片元素

			if ($(dblclickThis).hasClass('image')&&$(dblclickThis).attr('isbackground')!='true') {

	            var obj={
	                x0:strTonumber($(dblclickThis).css('left'))+strTonumber($(dblclickThis).find('.zoomimg').css('left')) + strTonumber($('.page_content').css('left')) ,
	                y0:strTonumber($(dblclickThis).css('top'))+strTonumber($(dblclickThis).find('.zoomimg').css('top')) + strTonumber($('.page_content').css('top')) + strTonumber($('.page_content').css('margin-top')) ,
	            }
	            var obj2={
	                x1:strTonumber($(dblclickThis).css('left')) +strTonumber($('.page_content').css('left')) - obj.x0,
	                y1:strTonumber($(dblclickThis).css('top')) + strTonumber($('.page_content').css('top')) + strTonumber($('.page_content').css('margin-top')) -obj.y0,
	            }
		        $('.cropControls').css({
		            'width':0,
		            'height':0,
		            'left':obj.x0+obj2.x1+strTonumber($(dblclickThis).css('width'))/2 + 'px',
	                'top':obj.y0+obj2.y1+strTonumber($(dblclickThis).css('height'))/2  + 'px',
		        })
		        $('.viewPort').css({
		            'width':sizeScale*strTonumber($('.viewPort').css('width'))+'px',
		            'height':sizeScale*strTonumber($('.viewPort').css('height'))+'px',
		            'left':sizeScale*strTonumber($('.viewPort').css('left'))+'px',
		            'top':sizeScale*strTonumber($('.viewPort').css('top'))+'px',
		        })
		        $('.inner').css({
		            'width':sizeScale*strTonumber($('.inner').css('width'))+'px',
		            'height':sizeScale*strTonumber($('.inner').css('height'))+'px',
		        })
		        $('.masked').css({
		            'width':sizeScale*strTonumber($('.masked').css('width'))+'px',
		            'height':sizeScale*strTonumber($('.masked').css('height'))+'px',
		            'left':sizeScale*strTonumber($('.masked').css('left'))+'px',
		            'top':sizeScale*strTonumber($('.masked').css('top'))+'px',
		        })
		        $('.cropBox').css({
		            'width':$('.viewPort').css('width'),
		            'height':$('.viewPort').css('height'),
		            'left':$('.viewPort').css('left'),
		            'top':$('.viewPort').css('top'),
		        })
		        $('.uncropbox').css({
		            'width':$('.masked').css('width'),
		            'height':$('.masked').css('height'),
		            'left':$('.masked').css('left'),
		            'top':$('.masked').css('top'),
		        })

			}else if($(dblclickThis).hasClass('item_content')){//正在裁剪网格元素
				//console.log(parseInt($(dblclickThis).css('left')))
		        $('.cropControls').css({
					'width':$(clickgridThis).css('width'),
		    		'height':$(clickgridThis).css('height'),
		    		'left':strTonumber($(clickgridThis).css('left')) + strTonumber($('.page_content').css('left')) + 'px',
		    		'top':strTonumber($(clickgridThis).css('top')) + strTonumber($('.page_content').css('top')) + strTonumber($('.page_content').css('margin-top')) + 'px',
		        })
		        $('.viewPort').css({
		            'width':sizeScale*strTonumber($('.viewPort').css('width'))+'px',
		            'height':sizeScale*strTonumber($('.viewPort').css('height'))+'px',
		            'left':sizeScale*strTonumber($('.viewPort').css('left'))+'px',
		            'top':sizeScale*strTonumber($('.viewPort').css('top'))+'px',
		        })
		        $('.inner').css({
		            'width':sizeScale*strTonumber($('.inner').css('width'))+'px',
		            'height':sizeScale*strTonumber($('.inner').css('height'))+'px',
		        })
		        $('.masked').css({
		            'width':sizeScale*strTonumber($('.masked').css('width'))+'px',
		            'height':sizeScale*strTonumber($('.masked').css('height'))+'px',
		            'left':sizeScale*strTonumber($('.masked').css('left'))+'px',
		            'top':sizeScale*strTonumber($('.masked').css('top'))+'px',
		        })
		        $('.cropBox').css({
		            'width':$('.viewPort').css('width'),
		            'height':$('.viewPort').css('height'),
		            'left':$('.viewPort').css('left'),
		            'top':$('.viewPort').css('top'),
		        })
		        $('.uncropbox').css({
		            'width':$('.masked').css('width'),
		            'height':$('.masked').css('height'),
		            'left':$('.masked').css('left'),
		            'top':$('.masked').css('top'),
		        })
			}

		}
	
  	}
    $.dataSync('cancle','resize');
});
//用于将取出的属性(100px)转为100
function strTonumber (str) {
	var date = str.substr(0,str.length-2);
	return Number(date);
}

//复制函数
function copyElement (obj) {
	var copyType = $(obj).attr('elementtype');
	//判断是否存在操作层
	if(copyType == 'img'||copyType == 'svg'){//复制图片
		var sourceNode = $(obj)[0]; // 获得被克隆的节点对象 
		var clonedNode = sourceNode.cloneNode(true); // 克隆节点 
		//clonedNode.setAttribute("id", "div-" + i); // 修改一下id 值，避免id 重复 
		dragDom(clonedNode);
		//区分背景元素还是图片
		if ($(clonedNode).hasClass('backgroundColor')) {
			bgClick(clonedNode)
		}else if($(clonedNode).attr('elementtype')=='img'){
			imgDblclick($(clonedNode));
		}else if($(clonedNode).attr('elementtype')=='svg'){
			getColors(clonedNode);
		}
		$(clonedNode).css({ 
			'width':$(obj).css('width'),
			'height':$(obj).css('height'),
			'left':parseInt($(obj).css('left'))+40+'px',
			'top':parseInt($(obj).css('top'))+40+'px',
		})
		$(obj).removeClass('selected');
		clickThis=clonedNode;
		ElementThis=clonedNode;
		var targetWidth = parseInt($(clonedNode).css('width'));
		var targetHeight = parseInt($(clonedNode).css('height'));
		var targetLeft = parseInt($(clonedNode).css('left'));
		var targetTop = parseInt($(clonedNode).css('top'));
		//  点击元素距离整个操作区域的坐标
		var targetWorkX = targetLeft + parseInt($('.page_content').css('left'));
		var targetWorkY = targetTop + parseInt($('.page_content').css('top'))+parseInt($('.page_content').css('margin-top'));
		
		$('.zoomImgbox').css({
			'width':targetWidth + 'px',
			'height':targetHeight + 'px',
			'left':targetWorkX + 'px',
			'top':targetWorkY + 'px',
			'transform':$(obj).css('transform'),
		});
		sourceNode.parentNode.appendChild(clonedNode); // 在父节点插入克隆的节点 
		
    }else if(copyType == 'text'){//复制文字
    	$(clickTextThis).find('.innerText').html($('.TextInner').html());
    	$(clickTextThis).show();
    	
    	$(obj).css('display','block');
    	var sourceNode = $(obj)[0]; // 获得被克隆的节点对象
		var clonedNode = sourceNode.cloneNode(true); // 克隆节点 
		//clonedNode.setAttribute("id", "div-" + i); // 修改一下id 值，避免id 重复 
		dragDom(clonedNode);
		imgDblclick($(clonedNode));
		$(clonedNode).css({
			'left':parseInt($(obj).css('left'))+40+'px',
			'top':parseInt($(obj).css('top'))+40+'px',
            'display':'none'
		});
		$('.TextInner').html($(clonedNode).find('.innerText').html());
		
        $(obj).removeClass('selected');
		clickTextThis=clonedNode;
		ElementThis=clonedNode;
		var targetWidth = parseInt($(clonedNode).css('width'));
		var targetHeight = parseInt($(clonedNode).css('height'));
		var targetLeft = parseInt($(clonedNode).css('left'));
		var targetTop = parseInt($(clonedNode).css('top'));
		var l_h = $(obj).css('line-height');
		
		//  点击元素距离整个操作区域的坐标
		var targetWorkX = targetLeft + parseInt($('.page_content').css('left'));
		var targetWorkY = targetTop + parseInt($('.page_content').css('top'))+parseInt($('.page_content').css('margin-top'));
		$('.editTextBox').css({
			'width':targetWidth + 'px',
			'height':targetHeight + 'px',
			'left':targetWorkX + 'px',
			'top':targetWorkY + 'px',
			'transform':$(obj).css('transform'),
            'lineheight':l_h,
            'color':$(obj).css('color'),
		});
		$('.playTextBox').css({
			'width':targetWidth + 'px',
			'height':targetHeight + 'px',
			'left':targetWorkX + 'px',
			'top':targetWorkY + 'px',
			'transform':$(obj).css('transform'),
		});
		$.firstOnkey=true;//更改原始值
		sourceNode.parentNode.appendChild(clonedNode); // 在父节点插入克隆的节点 
		
    }else if(copyType == 'grid'){//复制网格
    	
    	$('.gridOn').removeClass('gridOn');
		var sourceNode = $(obj)[0]; // 获得被克隆的节点对象 
		var clonedNode = sourceNode.cloneNode(true); // 克隆节点 
		//clonedNode.setAttribute("id", "div-" + i); // 修改一下id 值，避免id 重复 
		dragDom(clonedNode);
		griDdblclick($(clonedNode).find('.item_content'))
		girDclick($(clonedNode).find('.item_content'));

		$(clonedNode).css({
			'width':$(clonedNode).css('width'),
			'height':$(clonedNode).css('height'),
			'left':parseInt($(clonedNode).css('left'))+40+'px',
			'top':parseInt($(clonedNode).css('top'))+40+'px',
		})
		
		$(obj).removeClass('selected');
		clickgridThis=clonedNode;
		ElementThis=clonedNode;
		var targetWidth = parseInt($(obj).css('width'));
		var targetHeight = parseInt($(obj).css('height'));
		var targetLeft = parseInt($(obj).css('left'));
		var targetTop = parseInt($(obj).css('top'));
		//  点击元素距离整个操作区域的坐标
		var targetWorkX = targetLeft + parseInt($('.page_content').css('left'));
		var targetWorkY = targetTop + parseInt($('.page_content').css('top'))+parseInt($('.page_content').css('margin-top'));
		//console.log(targetWidth)
		$('.zoomImgbox').css({
			'width':targetWidth + 'px',
			'height':targetHeight + 'px',
			'left':targetWorkX + 'px',
			'top':targetWorkY + 'px',
			'transform':$(obj).css('transform'),
		});
		sourceNode.parentNode.appendChild(clonedNode); // 在父节点插入克隆的节点 
		
    }
    
}
//操作区的元素失去焦点
function removeFocus() {
    if (cutIng==false) {
        $('.cutingBoxbtn').hide();//顶部裁剪确定按钮隐藏
    }
    $('.toolbarWrapper').hide(); //顶部颜色操作框
    $('.imgBoxbtn').hide();//顶部图片功能按钮隐藏
    $('.toolbarFont').hide();//顶部文字功能按钮隐藏
    $('.zoomImgbox').hide();//外部缩放框隐藏
    $('.backgroundColor').css('cursor','auto');//背景元素失去焦点时更改其手势
	$('.gridOn').removeClass('gridOn');//网格内每一格选中的样式取消
	$('.GridSpacing').hide();//关闭网格间距功能框
    //去除建组元素的outline 样式
    if($('.multiSelected')){
        $('.multiSelected').css('outline','none');
    }
    par.groupList = [];
	//确定添加或者编辑的文字,生成操作区域内的文本框，隐藏外部操作框
    //console.log($('.TextInner').html().length)
    if($('.editTextBox').css('display')=='block'){
        if ($('.TextInner').html().length>0) {
            $('.colorList').hide();
            $('.fontList').hide();
            $('.alignList').hide();
            $('.sizeList').hide();
            $('.spacingList').hide();
            var listStyle = $('.list-icon ').attr('list-layout');
            var text = $('.TextInner').html();
            drawText(text,listStyle);

        }else{
            $('.editTextBox').hide();
            $('.playTextBox').hide();
            $(clickTextThis).remove();
        }
    }


    $('.element').removeClass('selected');
} 

