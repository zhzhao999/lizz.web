//用于标识正在拖拽移动中的元素
var moveclick;
//定义标识,用来区别拖拽的元素时添加到了page_content区还是添加到网格内
var isGrid=false;
//拖拽添加功能
function dragAdd (dom) {
	var obj = dom;
    obj.onmousedown = function(ev) {
    	var Se = ev||event;
        var event = window.event;
        $('.search input').blur();
		//元素开始时的大小及坐标
        var sL = parseInt($(obj).offset().left);
        var sT = parseInt($(obj).offset().top);
        var sW = parseInt($(obj).css('width'));
        var sH = parseInt($(obj).css('height'));
        
        var objX = parseInt($(obj).offset().left);
        var objY = parseInt($(obj).offset().top);
        deltaX = event.pageX - objX;
        deltaY = event.pageY - objY;
        
		var url = $(obj).find('img').attr('data-url');
		var $imgdiv = $("<div class='element imgElement image addimg' flipOrientation=0 isCutout='false' elementType='img' ></div>");
		var $zoomdiv = $("<div class='zoomimg'></div>")
		var $img = $("<img class='img' src='"+url+"' draggable=false />");
		
		var width = parseInt($(obj).css('width'));
		var height = parseInt($(obj).css('height'));
		var w = parseInt($('.page_content').css('width'));
		var h = parseInt($('.page_content').css('height'));
		var w0 = width;
		var h0 = height;
		var s = Math.round(w/h);
		
		//用于标识正在拖拽移动中的元素
		moveclick = $imgdiv[0];
		
		var x;
		var y;
//      绑定网格元素的移入移出事件
		bindGridmouse(url);
		
        document.onmousemove = function(ev) {
        	var Me = ev||event;
            var event = window.event;
            x = event.pageX - deltaX;
            y = event.pageY - deltaY;
            
      		//	获取图片在工作区域展示合适的大小
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
          
          	var moveW = sW;
          	var moveH = sH;
          	var moveScale = Me.clientX/Se.clientX;
          	moveW = moveW*moveScale*2;
          	moveH = moveH*moveScale*2;
          	
          	if (moveW>=w1) {
          		moveW=w1;
          	}
          	if (moveH>=h1) {
          		moveH=h1;
          	}
          
  			$img.css('width','100%')
				.css('height','100%');
			$zoomdiv.css('width',moveW+'px')
					.css('height',moveH+'px');
			$zoomdiv.append($img); 	
			$imgdiv.append($zoomdiv); 
			$imgdiv.css('position','absolute')
				.css('width',moveW+'px')
				.css('height',moveH+'px')
				.css('transform','rotate(0)')
				.css('pointer-events','none');
          
        	$imgdiv.css({'left':x+'px','top':y+'px'})
        	$imgdiv.css('z-index','5000')
        		   .css('position','absolute')
			var $parent = $('body'); 
			$parent.append($imgdiv); 
			
			Me.preventDefault();
			Me.stopPropagation();
			
      	}
        document.onmouseup = function(ev) {
        	var Ee = ev||event;
        	var event = window.event;
//      	模拟单机事件,避免mouseup和click冲突
			if (Se.clientX==Ee.clientX&&Se.clientY==Ee.clientY) {
				$imgdiv.remove();
			}else{
				//用来判断元素是否已经添加进网格元素，如果没有添加到网格，将其添加到page_content区域
				if (isGrid==false) {
				
					var wImg = parseInt($imgdiv.css('width'));
					var HImg = parseInt($imgdiv.css('height'));
					var Wwork = parseInt($('.page_content').css('width'));
					var Hwork = parseInt($('.page_content').css('height'));
					
					var targetX_lt = parseInt($('.page_content').css('left'))+parseInt($('.sidebarTab').css('width'));
					var targetY_lt = parseInt($('.page_content').css('top'))+parseInt($('.page_content').css('margin-top'))+parseInt($('.header').css('height'));
					
					if (x+wImg>targetX_lt&&y+HImg>targetY_lt&&x<targetX_lt+Wwork&&y<targetY_lt+Hwork) {
						var l = x - parseInt($('.page_content').css('left')) - parseInt($('.sidebarTab').css('width'));
						var t = y - parseInt($('.page_content').css('top')) - parseInt($('.page_content').css('margin-top')) - parseInt($('.header').css('height'));
						$imgdiv.css('left',l+'px')
								.css('top',t+'px')
				
						$('.imgBoxbtn').slideDown();//显示顶部图片操作按钮（翻转）
						var target = $imgdiv[0];
						clickThis = $imgdiv[0];//如果单机选中该元素，将该元素传递给外层变量
						ElementThis = $imgdiv[0];
						var targetWidth = parseInt($(target).css('width'));
						var targetHeight = parseInt($(target).css('height'));
						var targetLeft = parseInt($(target).css('left'));
						var targetTop = parseInt($(target).css('top'));
						//  点击元素距离整个操作区域的坐标
						var targetWorkX = l + parseInt($('.page_content').css('left'));
						var targetWorkY = t + parseInt($('.page_content').css('top'))+parseInt($('.page_content').css('margin-top'));
						console.log(parseInt($('.header').css('height')))
						$('.zoomImgbox').css({
							'width':targetWidth + 'px',
							'height':targetHeight + 'px',
							'left':targetWorkX + 'px',//边框有1个像素的误差
							'top':targetWorkY + 'px',
							'transform':$(target).css('transform'),
						}).show();
						
						$.iscopy = 'copyImg';
						init();
						$imgdiv.css('z-index','auto');
			  			dragDom($imgdiv[0]);
						imgDblclick($imgdiv);
			            var $parent = $('.page_content'); 
						$parent.append($imgdiv); 
					}else if(x+wImg<=targetX_lt || y+HImg<=targetY_lt || x>=targetX_lt+Wwork || y>targetY_lt+Hwork){
						$imgdiv.animate({
						    left:sL+'px',
						    top:sT+'px',
						    height:sW+'px',
						    width:sH+'px',
						    opacity:0
						},function () {
							$imgdiv.remove();
						});
					}
				}else{//如果网格元素已经添加拖拽进来的新图片，删除操作中的图片元素
					$imgdiv.remove();
					
                    var $parent = $(ev.target).parents('.item_content');
                    
            		$('.item_content').removeClass('gridOn');
					$parent.addClass('gridOn');
					clickCutGridThis=$parent[0];
                    
					$(clickCutGridThis).attr('elementType','img');
				}
			}
			
            document.onmousemove = null;
            document.onmouseup = null;
            
//          移除网格元素的移入移出事件
            unbindGridmouse();
            isGrid=false;
            Ee.preventDefault();
			Ee.stopPropagation();
        }
        Se.preventDefault();
		Se.stopPropagation();
    }
    obj.ondragstart = function(event) {
        event.preventDefault();
        return false;
    }
}

//绑定网格元素的移入移出事件
function bindGridmouse(url) {
	var noWurl;
	var opacity;
	var isBGcolor=false;
	$('.item>.item_content').mouseover(function() {
		
		if ($(this).attr('elementType')=='img') {
			noWurl = $(this).find('img').attr('src');
			opacity = $(moveclick).css('opacity');
			$(this).find('img').attr('src',url);
			
		}else if($(this).attr('elementType')=='bgclolr'&&isBGcolor==false){
			
			opacity=1;
			$(this).attr('bgcolor',$(this).find('.backgroundColor').css('background-color'));
			var $imgBox = $("<div class='zoomimg placeholder'><img src='"+url+"'></img></div>");
			$imgBox.css({
				'width':'500px',
				'height':'500px',
				'left':0,
				'top':0
			});
			$(this).find('.backgroundColor').remove();
			$(this).append($imgBox);
			isBGcolor=true;
			
		}
		$(moveclick).css('opacity','0.3');
		//用来判断元素是否已经添加进网格元素，如果已经添加到网格，标识其不再往page_content区域渲染
		isGrid=true;
		
	})
	
	$('.item>.item_content').mouseout(function() {
		
		$(moveclick).css('opacity',opacity);
		if ($(this).attr('elementType')=='img') {
			
			$(this).find('img').attr('src',noWurl);
			
		}else if($(this).attr('elementType')=='bgclolr'){
			
            var $bgDiv = $("<div class='backgroundColor placeholder'></div>");
            $bgDiv.css({
                'background-color': $(this).attr('bgcolor'),
                'left':0,
                'top':0,
                'width':'100%',
                'height':'100%'
            })
            $(this).find('.zoomimg').remove();
            $(this).append($bgDiv);
			
		}
		
		isGrid=false;
		isBGcolor=false;
	})
}
//移除网格元素的移入移出事件
function unbindGridmouse() {
	$('.item>.item_content').unbind("mouseover"); 
	$('.item>.item_content').unbind("mouseout"); 
	//用于防止网格元素的mouseover不生效
	$(moveclick).css('pointer-events','auto');
}


//测试部分
//$(function () {
//	dragDom($('.grid')[0]);
//	griDdblclick($('.item_content'));
//	girDclick($('.item_content'));
//})	
	
	
	
//网格单击事件	
function girDclick ($obj) {
	$obj.click(function () {
		$('.item_content').removeClass('gridOn');
//		$(this).parent().siblings(".item").find('.item_content').removeClass("gridOn");
		$(this).addClass('gridOn');
		clickCutGridThis=this;
	});
}
	
	
function griDdblclick($obj) {
	$obj.dblclick(function () {
		if ($(this).attr('elementtype')!='bgclolr'){

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
	        var e = e||event;
	        $(t).css('overflow','visible');
	        //显示裁剪时的外层box
	        $('.mask').addClass('on');
	        
	        var griDelementW = parseInt($(this).find('.zoomimg').css('width'));
	        var griDelementH = parseInt($(this).find('.zoomimg').css('height'));
	        
	//      根据网格缩放后的尺寸
	    	var imgH = parseInt($(this).css('height'));
	    	var imgW = imgH/griDelementH*griDelementW;
	        console.log(this)
	        $('.cropControls').css({
				'width':$(clickgridThis).css('width'),
	    		'height':$(clickgridThis).css('height'),
	    		'left':parseInt($(clickgridThis).css('left')) + parseInt($('.page_content').css('left')) + 'px',
	    		'top':parseInt($(clickgridThis).css('top')) + parseInt($('.page_content').css('top')) + parseInt($('.page_content').css('margin-top')) + 'px',
	            'transform':$(clickgridThis).css('transform'),
	        })
	        $('.viewPort').css({
	            'width':$(this).css('width'),
	            'height':$(this).css('height'),
	            'left':parseInt($(this).parent().css('left'))+parseInt($(this).css('left'))+'px',
	            'top':parseInt($(this).parent().css('top'))+parseInt($(this).css('top'))+'px',
	//	    		'transform':$(this).css('transform'),
	        })
	        $('.inner').css({
	            'width':$(this).css('width'),
	            'height':$(this).css('height'),
	        })
	        $('.masked').prop('src',$(this).find("img").prop('src'));
	        $('.masked').css({
	            'width':imgW+'px',
	            'height':imgH+'px',
				'left':parseInt($(this).find(".zoomimg").css('left'))+'px',
				'top':parseInt($(this).find(".zoomimg").css('top'))+'px',
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
	                var matrix = $(clickgridThis).css('transform');
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
	
			$('.viewPort>span').hide();
	
	        e.preventDefault();
	        e.stopPropagation();
	
	        dblclickThis = t;
	        initImg();
	        $(dblclickThis).addClass('selectImg');
		}	
	});
}

	
	
	
	
	

