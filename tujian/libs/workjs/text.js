//初始字体大小
var fontStand = 16;
var orfontStand = 16;

$(function () {
    $.onkey = false;
    var titleStr_ = '点击添加标题';
    var titleStr_f_ = '点击添加副标题';
    var contentStr_ = '点击添加副正文';

   /*旋转的 hover 事件*/
   $('#textRotatebox').hover(function () {
       $('#textRotatebox').find('img').attr('src','../../images/rotate2.png')
   },function () {
       $('#textRotatebox').find('img').attr('src','../../images/rotate1.png')
   })
   //重置边线的 宽高 以及拖拽按钮的位置
   function setPlayorigin(origin){
       $('.editTextBox').css('height',$('.TextInner').css('height'));

       $('.playTextBox').css('height',$('.'+origin).css('height'));
       $('.playTextBox').css('width',$('.'+origin).css('width'));

   }

    /*粗体*/
    $.isBoldfirst = true;
    $('.bold-icon').click(function (ev) {
        //拿到原来的height（）
        var orTop_ = (parseFloat($('.playTextBox').find('.r_').css('top')))*2;
        var or_Width =  (parseFloat($('.playTextBox').find('#textRotatebox').css('left'))+12)*2;
        //拿到当前的bold值
        var bolder = $('.editTextBox').css('font-weight');
        //判断当前是否是 标题
        var istitle_ = $('.editTextBox .TextInner ').attr('titlebg');
        if(istitle_ == '1'){
            //标题
            return false;
        }else{
            //700：加粗  400：normal
            if(bolder == '700' || bolder == 'bold'){
                //设置normal
                $('.editTextBox').css('font-weight','400');
                $(clickTextThis).css('font-weight','400');
                $(this).css(
                    'background-color','rgb(255,255,255)'
                )
            }else{
                $('.editTextBox').css('font-weight','700');
                $(clickTextThis).css('font-weight','700');
                $(this).css(
                    'background-color','rgb(255,236,237)'
                )
            }
            setPlayorigin('editTextBox');
            $.dataSync('cancle','粗体');
        }
        //同步
        //isSynctoend_('粗体',htmlType);
        ev.preventDefault();
        ev.stopPropagation();

    });
    /*斜体*/
    $('.italic-icon').click(function (ev) {
        //拿到当前的italic值
        var italic = $('.editTextBox').css('font-style');
        var istitle_ = $('.editTextBox .TextInner ').attr('titlebg');
        if(istitle_ == '1'){
            //标题
            return false;
        }else {
            //700：加粗  400：normal
            if (italic == 'italic') {
                //设置normal
                $('.editTextBox').css('font-style', 'inherit');
                $(clickTextThis).css('font-style', 'inherit');
                $(this).css(
                    'background-color', 'rgb(255,255,255)'
                )

            } else {
                $('.editTextBox').css('font-style', 'italic');
                $(clickTextThis).css('font-style', 'italic');
                $(this).css(
                    'background-color', 'rgb(255,236,237)'
                )
            }
            //setPlayorigin('editTextBox');
        }
        //同步
        //isSynctoend_('斜体',htmlType);
        $.dataSync('cancle','斜体');
        ev.preventDefault();
        ev.stopPropagation();
    })
    /*大小写*/
    $('.upercase-icon').click(function (ev) {
        //拿到原来的height（）
        var orTop_ = (parseInt($('.playTextBox').css('height')));
        var or_Width =  (parseInt($('.playTextBox').css('width')));

        var $alleles = $('.editTextBox').children();
        var allStr = '';
        $alleles.each(function(){
            allStr += ''+$(this).text();
        });

        var str = $('.editTextBox .TextInner').html();
        var newStr = '';
        //判断当前的文字的大小写
        var checkStr = $.f_check_uppercase(allStr);
        if(checkStr){
            //true 全是大写，转小写
            newStr = str.toLowerCase();
            $(this).css(
                'background-color','rgb(255,255,255)'
            )
        }else{
            newStr = str.toUpperCase();
            $(this).css(
                'background-color','rgb(255,236,237)'
            )
        }
        $('.editTextBox .TextInner').html(newStr);
        $(clickTextThis).find('.innerText').html(newStr);
        setPlayorigin('editTextBox');
        //重置高度，转大写或者小写会引起容器高度变化

        var changeTop_ = (parseInt($('.playTextBox').css('height')));
        p3.width = or_Width;
        p3.height = orTop_;
        p3.x = parseFloat($('.editTextBox').css('left'));
        p3.y = parseFloat($('.editTextBox').css('top'));
        var point_ = {};
        point_.x = parseInt($('.editTextBox').css('left'));
        point_.y = parseInt($('.editTextBox').css('top'));
        point_.width = or_Width;
        point_.height = orTop_;

        reDraw(point_,getmatrix($('.editTextBox').css('transform')),changeTop_);
//同步
        //isSynctoend_('大小写',htmlType);
        $.dataSync('cancle','大小写');
        ev.preventDefault();
        ev.stopPropagation();
    });
    //检测大写
    $.f_check_uppercase = function(str){
        //只获取字母
        var zmstr= str.match(/[a-zA-Z]/g).join("");
        if(/^[A-Z]+$/.test(zmstr) ){
           return true;
        }else{
            return false;
        }
    };
    //转列表
    $('.list-icon').click(function(ev){
        //拿到当前文字的所占的宽度
        var html_list = $('.editTextBox').find('.TextInner').html();
        //拿到当前的font-size,
        //获取当前的旋转角度
        var imgdeg_ = getmatrix($('.editTextBox').css('transform'));
        //左边点距离列表文字的距离设置
        var currFont_size =  $('.editTextBox').find('.TextInner').css('font-size');
        //alert(currFont_size);
            var islist = $(this).attr('list-layout');
            if(islist == 'true'){
                //列表转文本
                $(this).attr('list-layout','false');
                //找到所有列表节点
                var $listLayNodes = $('.editTextBox ul li');
                var $listLen = $listLayNodes.length;
                var html = '';
                $listLayNodes.each(function(index){
                    var htmlst = $(this).html();
                    $(clickTextThis).find('.innerText').html();
                    if(index == 0){
                        $('.editTextBox .TextInner').html(htmlst);
                        $(clickTextThis).find('.innerText').html(htmlst);
                    }else{
                        $('.editTextBox .TextInner').append(htmlst);
                        $(clickTextThis).find('.innerText').append(htmlst);
                    }
                });
                $('.editTextBox .TextInner').css('display','block');
                $('.editTextBox .TextInner div').css('display','block');
                $('.editTextBox .TextInner').attr('list-layout','false');
                $(this).css(
                    'background-color','rgb(255,255,255)'
                );
                var editwidth_ = $('.editTextBox').css('width');
                //如果角度等于0，禁止点击列表宽度增加
                if(imgdeg_ == 0 && $('.editTextBox').find('.TextInner').attr('addtext') == 'true'){
                    //宽度增加30px
                    var editLayout_width_ = strTonumber(editwidth_)-strTonumber(currFont_size)*1.5 +'px';
                }else{
                    var editLayout_width_ = strTonumber(editwidth_) +'px';
                }
                $('.editTextBox').css('width',editLayout_width_);
                $('.playTextBox').css('width',editLayout_width_);
                $('.editTextBox .TextInner').css('width',editLayout_width_);
                //拿到原来的height（）
                var orTop_ = (strTonumber($('.playTextBox').css('height')));
                var or_Width =  (strTonumber($('.playTextBox').css('width')));
            }else{
                $(this).css(
                    'background-color','rgb(255,236,237)'
                );
                //文本转列表
                $(this).attr('list-layout','true');
                //创建列表容器
                var htm = '';
                //宽度增加30px
                var editwidth = $('.editTextBox').css('width');
                if(imgdeg_ == 0 && $('.editTextBox').find('.TextInner').attr('addtext') == 'true'){
                    //宽度增加当前字体的 1.5倍
                    var editLayout_width = strTonumber(editwidth)+strTonumber(currFont_size)*1.5 +'px';
                }else{
                    var editLayout_width = strTonumber(editwidth) +'px';
                }
                $('.editTextBox').css('width',editLayout_width);
                $('.playTextBox').css('width',editLayout_width);
                //拿到原来的height（）
                var orTop_ = (strTonumber($('.playTextBox').css('height')));
                var or_Width =  (strTonumber($('.playTextBox').css('width')));

                //获得文本内容
                var htmlStr = $('.editTextBox .TextInner').html();
                if($('.TextInner').attr('addtext')){
                    var istitle_ = $('.TextInner').attr('titlebg');
                    if(istitle_ == '1'){//class表示是不是标题，属性istitlebg 表示是否有修改
                        //是标题
                        htm +='<ul class="listLayout" >';/*style="list-style-image:url("'+src+'");"*/
                    }else{
                        htm +='<ul class="listLayout" >';/*style="list-style-image:url("'+src+'");"*/

                    }
                }else{
                    //原模板内容 oninput="this.innerHTML = this.innerText"
                    htm +='<ul class="listLayout" >';/*style="list-style-image:url("'+src+'");"*/

                }

                //var htmlStr_parent = $('.editTextBox').html();
                //解析字符串
                //截取前面不在div包裹的字符串
                var str_before = htmlStr.split('<')[0];
                if(str_before !== ''){
                    //只存在一个列表
                    htm += '<li class="listLayout-first">'+htmlStr+'</li>';
                }else{
                    //找到孩子节点
                    htm += '<li class="listLayout-first">'+str_before+'</li>';
                    //遍历孩子，
                    var $listChildNode = $(".editTextBox .TextInner").children('div');
                    var listChildNode_Len = $listChildNode.length;
                    $listChildNode.each(function(){
                        htm += '<li><div>'+$(this).html()+'</div></li>';
                    })
                }
                htm +='</ul>';
                $('.TextInner').html(htm);
                $(clickTextThis).find('.innerText').html(htm);
                $('.TextInner').attr('list-layout','true')
                $('.editTextBox ul li').css({
                        'list-style-type': 'disc',
                        'list-style-position': 'inside'
                })
                $('.editTextBox ul li div').css({
                   'display':'inline-block'
                })
                $( document ).on( "paste", ".editTextBox ul li", function(e) {
                    textInit(e)
                });
            }
        var changeTop_ = (strTonumber($('.playTextBox').css('height')));
        p3.width = or_Width;
        p3.height = orTop_;
        p3.x = parseFloat($('.editTextBox').css('left'));
        p3.y = parseFloat($('.editTextBox').css('top'));
        var point_ = {};
        point_.x = strTonumber($('.editTextBox').css('left'));
        point_.y = strTonumber($('.editTextBox').css('top'));
        point_.width = or_Width;
        point_.height = orTop_;

        reDraw(point_,getmatrix($('.editTextBox').css('transform')),changeTop_);
        setPlayorigin('editTextBox');
        //同步
        //isSynctoend_('列表',htmlType);
        $.dataSync('cancle','列表');
        ev.preventDefault();
        ev.stopPropagation();
    })
    /*复制*/
    $('.toolbar__label--copy').click(function(ev){
        //判断是否存在操作层
//		if($.iscopy == 'copyImg'){//复制图片
//			var sourceNode = $(clickThis)[0]; // 获得被克隆的节点对象 
//			var clonedNode = sourceNode.cloneNode(true); // 克隆节点 
//			//clonedNode.setAttribute("id", "div-" + i); // 修改一下id 值，避免id 重复 
//			dragDom(clonedNode);
//			//区分背景元素还是图片
//			if ($(clonedNode).hasClass('backgroundColor')) {
//				bgClick(clonedNode)
//			}else{
//				imgDblclick($(clonedNode));
//			}
//			$(clonedNode).css({
//				'width':$(clickThis).css('width'),
//				'height':$(clickThis).css('height'),
//				'left':parseInt($(clickThis).css('left'))+40+'px',
//				'top':parseInt($(clickThis).css('top'))+40+'px',
//			})
//			
//			clickThis=clonedNode;
//			ElementThis=clonedNode;
//			var targetWidth = parseInt($(clickThis).css('width'));
//			var targetHeight = parseInt($(clickThis).css('height'));
//			var targetLeft = parseInt($(clickThis).css('left'));
//			var targetTop = parseInt($(clickThis).css('top'));
//			//  点击元素距离整个操作区域的坐标
//			var targetWorkX = targetLeft + parseInt($('.page_content').css('left'));
//			var targetWorkY = targetTop + parseInt($('.page_content').css('top'))+parseInt($('.page_content').css('margin-top'));
//			
//			$('.zoomImgbox').css({
//				'width':targetWidth + 'px',
//				'height':targetHeight + 'px',
//				'left':targetWorkX + 'px',
//				'top':targetWorkY + 'px',
//				'transform':$(clickThis).css('transform'),
//			});
//			sourceNode.parentNode.appendChild(clonedNode); // 在父节点插入克隆的节点 
//			
//      }else if($.iscopy == 'copyText'){//复制文字
//      	
//      	$(clickTextThis).css('display','block')
//      	var sourceNode = $(clickTextThis)[0]; // 获得被克隆的节点对象
//			var clonedNode = sourceNode.cloneNode(true); // 克隆节点 
//			//clonedNode.setAttribute("id", "div-" + i); // 修改一下id 值，避免id 重复 
//			dragDom(clonedNode);
//			imgDblclick($(clonedNode));
//			$(clonedNode).css({
//				'left':parseInt($(clickTextThis).css('left'))+40+'px',
//				'top':parseInt($(clickTextThis).css('top'))+40+'px',
//              'display':'none'
//			});
//          $(clickTextThis).removeClass('selected');
//			clickTextThis=clonedNode;
//			ElementThis=clonedNode;
//			var targetWidth = parseInt($(clickTextThis).css('width'));
//			var targetHeight = parseInt($(clickTextThis).css('height'));
//			var targetLeft = parseInt($(clickTextThis).css('left'));
//			var targetTop = parseInt($(clickTextThis).css('top'));
//			var l_h = $(clickTextThis).css('line-height');
//			//  点击元素距离整个操作区域的坐标
//			var targetWorkX = targetLeft + parseInt($('.page_content').css('left'));
//			var targetWorkY = targetTop + parseInt($('.page_content').css('top'))+parseInt($('.page_content').css('margin-top'));
//			$('.editTextBox').css({
//				'width':targetWidth + 'px',
//				'height':targetHeight + 'px',
//				'left':targetWorkX + 'px',
//				'top':targetWorkY + 'px',
//				'transform':$(clickTextThis).css('transform'),
//              'lineheight':l_h
//			});
//			$('.playTextBox').css({
//				'width':targetWidth + 'px',
//				'height':targetHeight + 'px',
//				'left':targetWorkX + 'px',
//				'top':targetWorkY + 'px',
//				'transform':$(clickTextThis).css('transform'),
//			});
//			sourceNode.parentNode.appendChild(clonedNode); // 在父节点插入克隆的节点 
//			
//      }else if($.iscopy == 'copyGrid'){//复制网格
//      	
//      	$('.gridOn').removeClass('gridOn');
//			var sourceNode = $(clickgridThis)[0]; // 获得被克隆的节点对象 
//			var clonedNode = sourceNode.cloneNode(true); // 克隆节点 
//			//clonedNode.setAttribute("id", "div-" + i); // 修改一下id 值，避免id 重复 
//			dragDom(clonedNode);
//			griDdblclick($(clonedNode).find('.item_content'))
//			girDclick($(clonedNode).find('.item_content'));
//	
//			$(clonedNode).css({
//				'width':$(clickgridThis).css('width'),
//				'height':$(clickgridThis).css('height'),
//				'left':parseInt($(clickgridThis).css('left'))+40+'px',
//				'top':parseInt($(clickgridThis).css('top'))+40+'px',
//			})
//			
//			clickgridThis=clonedNode;
//			ElementThis=clonedNode;
//			var targetWidth = parseInt($(clickgridThis).css('width'));
//			var targetHeight = parseInt($(clickgridThis).css('height'));
//			var targetLeft = parseInt($(clickgridThis).css('left'));
//			var targetTop = parseInt($(clickgridThis).css('top'));
//			//  点击元素距离整个操作区域的坐标
//			var targetWorkX = targetLeft + parseInt($('.page_content').css('left'));
//			var targetWorkY = targetTop + parseInt($('.page_content').css('top'))+parseInt($('.page_content').css('margin-top'));
//			console.log(targetWidth)
//			$('.zoomImgbox').css({
//				'width':targetWidth + 'px',
//				'height':targetHeight + 'px',
//				'left':targetWorkX + 'px',
//				'top':targetWorkY + 'px',
//				'transform':$(clickgridThis).css('transform'),
//			});
//			sourceNode.parentNode.appendChild(clonedNode); // 在父节点插入克隆的节点 
//			
//      }
		
		
		copyElement(ElementThis);
        //同步
        //isSynctoend_('复制',htmlType);
    	$.dataSync('cancle','复制');
        ev.preventDefault();
        ev.stopPropagation();
    })
    /*去除复制过来的文字样式*/
    $( document ).on( "paste", ".TextInner", function(e) {
        textInit(e)
    });
    //去除复制样式
    function textInit(e) {
        e.preventDefault();
        var text;
        var clp = (e.originalEvent || e).clipboardData;
        if (clp === undefined || clp === null) {
            text = window.clipboardData.getData("text") || "";
            if (text !== "") {
                if (window.getSelection) {
                    var newNode = document.createElement("span");
                    newNode.innerHTML = text;
                    window.getSelection().getRangeAt(0).insertNode(newNode);
                } else {
                    document.selection.createRange().pasteHTML(text);
                }
            }
        } else {
            text = clp.getData('text/plain') || "";
            if (text !== "") {
                document.execCommand('insertText', false, text);
            }
        }
    }
/*
    //判断是否进行同步
    function isSynctoend_(str,own){
        console.log('同步触发源'+str);
        if(own == 'down'){
            //修改保存状态
            if(par.isSave){
                $('.saveType').text('未保存的更改');
                par.isSave = false;
                var saveSetTimeout = window.setTimeout(function(){
                    $('.saveType').text('保存中');
                    //console.log(JSON.stringify($.templateSysn));
                    $.dataSync('sync');
                    clearTimeout(saveSetTimeout);
                    saveSetTimeout = null;
                },3000);
            }
        }

    }*/

});
//
function multiSlected(ev,obj){
//	如果文字正在编辑时点击其他元素,将其生成
    //编辑的同时点击另一个元素，这时如果键盘按下了shift键，表示要多选建组，选中的元素 addclass ：multiSlected
    if($('.editTextBox').css('display')!='none' || $('.zoomImgbox').css('display')!='none' || $('.zoomGroupbox').css('display')!='none'){
        //将编辑层绘制到视图层
        if($('.editTextBox').css('display')!='none'){
            var listStyle = $('.list-icon ').attr('list-layout');
            var text = $('.TextInner').html();
            drawText(text,listStyle);
        }
        $('#zoomImgbox').hide();
        //去除建组元素的outline 样式
        if($('.multiSelected')){
            $('.multiSelected').css('outline','none');
            $('.multiSelected').removeClass('multiSelected');
        }
        //监听键盘事件，shift
        if (ev.shiftKey==1){
            $('.toolbar__item--buildGroup').show();
            //多选建组
            var last_index = $(ElementThis).index();
            var curr_index = $(obj).index();
            //    去重 拿到当前选中的建组元素的层级索引
            var groupListLen = par.groupList.length;
            if(groupListLen>0 && par.groupList[groupListLen-1] == last_index){
                par.groupList.push(curr_index);
            }else{
                par.groupList.push(last_index);
                par.groupList.push(curr_index);
            }
            //console.log(par.groupList);
            //给建组元素添加边框
            //根据层级关系，找到建组元素，添加multiSlected 类 ，加边框，

            //建组元素的 位置信息
            var grouplist_points = [];

            //显示组的 缩放框 zoomGroupbox
            var $elements_group = $('#page_content > .element');
            $elements_group.each(function(index){
                //层级index 的信息匹配
                var group_len = par.groupList.length;
                for(var k = 0;k<group_len;k++){
                    if(par.groupList[k] == index){
                        $(this).css('outline', '1px dashed #333');
                        $(this).addClass('multiSelected');
                        var grouplist_point = {};
                        grouplist_point.index = index;
                        //x,y,x右，y右
                        grouplist_point.point = [parseInt($(this).css('left')),parseInt($(this).css('top')),parseInt($(this).css('left'))+parseInt($(this).css('width')),parseInt($(this).css('top'))+parseInt($(this).css('height'))];
                        grouplist_points.push(grouplist_point);
                    }
                }
            })
            //根据建组元素的位置信息，计算出图层组的 容器位置，首先显示 操作框
            var minleft =grouplist_points[0].point[0] ,mintop=grouplist_points[0].point[1],maxWidth= grouplist_points[0].point[2],maxheight=grouplist_points[0].point[3];
            var pointslen = grouplist_points.length;
            for(var x= 0;x<pointslen;x++){
                minleft = Math.min(minleft,grouplist_points[x].point[0]);
                mintop = Math.min(mintop,grouplist_points[x].point[1]);
                maxWidth = Math.max(maxWidth,grouplist_points[x].point[2]);
                maxheight = Math.max(maxheight,grouplist_points[x].point[3]);
            }
            var groupbox_w = maxWidth - minleft;
            var groupbox_h = maxheight - mintop;
            //左边留白区域的宽
            var lbletf = parseInt($('#page_content').css('left'));
            var lbtop = parseInt($('#page_content').css('top'));
            $('#zoomGroupbox').css({
                'left':minleft +lbletf+'px',
                'top':mintop +lbtop+parseInt($('#page_content').css('margin-top'))+'px',
                'width':groupbox_w+'px',
                'height':groupbox_h+'px',
                'outline':'1px dash #333'
            }).show();

            //绑定旋转事件，当前还不能旋转
            $('#rotate_groupbox').hide();
            $('.tl_group').hide();
            $('.tr_group').hide();
            $('.bl_group').hide();
            //rotate($('#rotate_groupbox')[0],$('#zoomGroupbox')[0])
            //绑定拖拽事件
            console.log($('#zoomGroupbox')[0])
            dragGroup($('#zoomGroupbox')[0]);
        }
    }
}
//建组方法
$('.toolbar__item--buildGroup').click(function(){
    //建组元素的索引值 par.groupList

});
//组的拖拽方法
function dragGroup(obj){
    $(obj).mousedown(function(ev){
        var oEvent=ev||event;
        //鼠标点击位置
        var eventX = event.pageX;
        var eventY = event.pageY;

        //左边留白区域的宽
        var lbletf_ = parseInt($('#page_content').css('left'));
        var lbtop_ = parseInt($('#page_content').css('top'));

        //找到建组元素，获取建组元素的初始位置
        var $elements_group_ = $('#page_content > .element');
        //存储建组元素的left top 信息
        var buildpoints = [];
        $elements_group_.each(function(index){
            //层级index 的信息匹配
            var group_len_ = par.groupList.length;
            for(var j = 0;j<group_len_;j++){
                if(par.groupList[j] == index){
                    //匹配到了
                    var buildpoint = {};
                    buildpoint.index = index;
                    buildpoint.left = parseInt($(this).css('left'));
                    buildpoint.top = parseInt($(this).css('top'));
                    buildpoints.push(buildpoint);
                }
            }
        });
        //建组容器的原始位置
        var groupboxX = parseInt($(obj).css('left'));
        var groupboxY = parseInt($(obj).css('top'));
        document.onmousemove = function (ev) {
            var moveEvent=ev||event;
            moveEvent.preventDefault();
            moveEvent.stopPropagation();
            var event = window.event;
            //移动的距离
            var delX  = event.pageX - eventX;
            var delY = event.pageY - eventY;
            $(obj).css({'left':groupboxX+delX+'px','top':groupboxY+delY+'px'});

        };
        document.onmouseup = function (ev) {
            document.onmousemove = null;
            document.onmouseup = null;
        }
    })
}

//限制输入的是数字类型
function isNumber(val){
    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if(regPos.test(val) || regNeg.test(val)){
        return true;
    }else{
        return false;
    }

}

//显示光标
function po_Last_Div(obj) {
    if (window.getSelection) {//ie11 10 9 ff safari
        obj.focus(); //解决ff不获取焦点无法定位问题
        var range = window.getSelection();//创建range
        range.selectAllChildren(obj);//range 选择obj下所有子内容
        range.collapseToStart();//光标移至最后
    }
}
/*document.onmousedown=function () {
    document.onmouseup=function () {
        //修改保存同步的状态
        alert(1);
        if(par.isSave){
            //$('.saveType').text('未保存的更改');
            par.isSave = false;
            $.dataSync('sync');
        }
    }
}*/
//判断字体是否在系统库中存在
var isSupportFontFamily=function(f){if(typeof f!="string"){return false}var h="Arial";if(f.toLowerCase()==h.toLowerCase()){return true}var e="a";var d=100;var a=100,i=100;var c=document.createElement("canvas");var b=c.getContext("2d");c.width=a;c.height=i;b.textAlign="center";b.fillStyle="black";b.textBaseline="middle";var g=function(j){b.clearRect(0,0,a,i);b.font=d+"px "+j+", "+h;b.fillText(e,a/2,i/2);var k=b.getImageData(0,0,a,i).data;return[].slice.call(k).filter(function(l){return l!=0})};return g(h).join("")!==g(f).join("")};