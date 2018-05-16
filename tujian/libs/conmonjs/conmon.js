
var par = {
    elementsArr:[],
    imgs : [],
    texts:[],
    svgs:[],
    canvasEle:null,
    ctx:null,
    imgUrl:"http://www.photostars.cn/gallery/", //图片请求头
    imgUrl2:"http://www.photostars.cn/webHDGallery/",
    svg:null,
    canvasW:null,
    canvasH:null,
    container:null,
    svgMedia:[],
    documentName:'desiner',
    urlhead:'http://www.photostars.cn:8020/index.php/web1_0/',//ajax 请求头
    isSave:false,//同步状态
    totalJson:{},//同步到后台的数据
    groupList:[],//建组元素
    width:null,//模板原始宽
    height:null,
    templateJson:[],//存储模板操作的数组json数据
    isLoad:true, //判断字体是否加载完成
    fontList:[],//字体列表
    nullTemplate:null,//标记当前是空模板
    templateId:null,
    templateSysn:{}//同步模板字段
};
$.extend({
    /*数据解析*/
    //down  ：sync 数据同步，down 下载图片 ，pub 发布, cancle 撤销
    dataSync:function(down,str){
        //return false;
        //找到子元素 而不是后代元素  先不取网格元素
        var $elementsDom = $('#page_content .element').not(".grid");
        //大于1 表示不是空模板  等于0 表示用户删除空模板的背景
        if($elementsDom.length>1 || $elementsDom.length == 0){
            par.nullTemplate = true;
        }
        if($elementsDom.length>0 && par.nullTemplate){
            //拿到view 层元素
            //如果为空，则返回，提示当前没有要下载的元素，请选择模板
            if(down == 'down'){
                //如果存在正在编辑的 要先绘制到视图层
                if ($('.TextInner').html().length>0) {
                    var word = $('.TextInner').html();
                    var islist = $('.TextInner').attr('list-layout');
                    drawText(word,islist);
                }
            }else if(down == 'pub'){
                //显示加载动画
                if ($('.TextInner').html().length>0) {
                    var word = $('.TextInner').html();
                    var islist = $('.TextInner').attr('list-layout');
                    drawText(word,islist);
                }
            }
            //获得文件名称
            par.documentName = $('.documentTitle .text').text();
            //组装json
            var jsonObj = {};
            jsonObj.content = {};
            jsonObj.content.photostarsFonts = {
                "title": {
                    "fontSize": 42,
                    "fontFamily": "STXianhei"
                },
                "subtitle": {
                    "fontSize": 24,
                    "fontFamily": "Trocchi"
                },
                "body": {
                    "fontSize": 16,
                    "fontFamily": "Arimo"
                }
            };
            jsonObj.content.defaultFonts = {
                "title": {},
                "subtitle": {},
                "body": {}
            };

            var pages = [];
            var page = {};

            page.objects = [];
            page.width = par.width;
            page.height = par.height;
            //作品名称
            page.template = par.documentName;

            var textSize = strTonumber($('#page_content').css('width'))/par.width;
            $elementsDom.each(function(index){
                var currObj = {};
                var thisEle = $(this);
                //判断类型
                if($(this).hasClass('image') && $(this).hasClass('backgroundColor')){
                    //图片 背景
                    currObj.objectIndex = index;
                    currObj.isClip = thisEle.attr('iscutout');
                    currObj.isBackground = true;
                    currObj.type = 'photo';
                    currObj.flip = thisEle.attr('fliporientation');

                    currObj.isRecolorable = true;
                    currObj.isDark = false;
                    currObj.mediaVersion = null;
                    currObj.imageId = null;
                    currObj.freeze = true;

                    //获取存在一点问题
                    var imgbgdeg_ = getmatrix(thisEle.css('transform'));
                    currObj.degree = imgbgdeg_;

                    currObj.opacity = thisEle.css('opacity');
                    currObj.left = strTonumber(thisEle.css('left'))/textSize;
                    currObj.top = strTonumber(thisEle.css('top'))/textSize;
                    currObj.width = strTonumber(thisEle.css('width'))/textSize;
                    currObj.height = strTonumber(thisEle.css('height'))/textSize;
                    currObj.backgroundColor = thisEle.css('background-color');
                }
                if($(this).hasClass('image') && !$(this).hasClass('backgroundColor')){
                    //图片内容
                    currObj.objectIndex = index;
                    currObj.isClip = thisEle.attr('iscutout');

                    if(currObj.isClip == 'true'){
                        currObj.imageClip = {};
                        currObj.imageClip.width = strTonumber(thisEle.find('.zoomimg').css('width'))/textSize;
                        currObj.imageClip.height = strTonumber(thisEle.find('.zoomimg').css('height'))/textSize;
                        currObj.imageClip.left = strTonumber(thisEle.find('.zoomimg').css('left'))/textSize;
                        currObj.imageClip.top = strTonumber(thisEle.find('.zoomimg').css('top'))/textSize;
                    }
                    currObj.isBackground = false;
                    currObj.type = 'photo';

                    //不知道怎么来的
                    currObj.isRecolorable = false;
                    currObj.isDark = false;
                    currObj.mediaVersion = 1;
                    currObj.freeze = true;
                    currObj.flip = thisEle.attr('fliporientation');
                    //获取存在一点问题
                    var imgdeg_ = getmatrix(thisEle.css('transform'));

                    currObj.degree = imgdeg_;
                    currObj.opacity = thisEle.css('opacity');
                    currObj.left = strTonumber(thisEle.css('left'))/textSize;
                    currObj.top = strTonumber(thisEle.css('top'))/textSize;
                    currObj.width = strTonumber(thisEle.css('width'))/textSize;
                    currObj.height = strTonumber(thisEle.css('height'))/textSize;
                    currObj.backgroundColor = thisEle.css('background-color');

                    //从子元素的img的src出解析出来
                    var src_ = thisEle.find('.img').attr('src');
                    var sliceStr= src_.slice(-6,-4);
                    if (sliceStr == 'or') {
                        var media_ = src_.replace(par.imgUrl2,'');
                    }else if (sliceStr == 'sh') {
                        var media_ = src_.replace(par.imgUrl,'');
                    }else{
                        var media_ = src_.replace(par.imgUrl,'');
                    }
                    currObj.imageId = media_;
                }
                if($(this).hasClass('text')||$(this).hasClass('textElement')){
                    //图片内容
                    currObj.objectIndex = index;
                    currObj.type = 'text';

                    //不知道怎么来的
                    currObj.isRecolorable = false;
                    currObj.isDark = false;
                    currObj.mediaVersion = 1;
                    currObj.freeze = true;

                    //列表
                    var islist = $(this).find('.innerText').attr('list-layout');
                    //字体
                    var font_zh = $(this).children('.innerText').attr('fontsize');//拿到字号
                    var letter_ = $(this).find('.innerText').attr('letterspacing');
                    //alert(letter_);
                    var lineHeight = $(this).children('.innerText').attr('lineheight');//行高比例

                    //var textdeg_ = getmatrix(thisEle.css('transform'));
                    if(thisEle.css('display') == 'none'){

                        var str = $('.editTextBox').css('transform');
                    }else{
                        var str = thisEle.css('transform');
                    }
                    var textdeg_ = getmatrix(str);

                    currObj.degree = textdeg_;

                    currObj.verticalAlignment = thisEle.css('vertical-align');
                    currObj.opacity = thisEle.css('opacity');
                    currObj.left =  strTonumber(thisEle.css('left'))/textSize;
                    currObj.top =  strTonumber(thisEle.css('top'))/textSize;
                    currObj.width =  strTonumber(thisEle.css('width'))/textSize;
                    currObj.height = strTonumber(thisEle.css('height'))/textSize;
                    currObj.color = thisEle.css('color');
                    currObj.isList = islist;
                    /*currObj.italic = thisEle.css('font-style');
                    currObj.backgroundColor = thisEle.css('background-color');*/
                    currObj.stylesOverriden = {
                        horizontalAlignment:thisEle.css('text-align'),
                        bold:thisEle.css('font-weight'),
                        fontFamily:thisEle.css('font-family'),
                        fontSize:font_zh,
                        color:thisEle.css('color'),
                        italic:thisEle.css('font-style')
                    };
                    currObj.bold = thisEle.css('font-weight');
                    currObj.fontFamily = thisEle.css('font-family');

                    currObj.fontSize = font_zh;
                    currObj.horizontalAlignment = thisEle.css('text-align');
                    currObj.letterSpacing =(parseFloat(letter_)*1000);
                    currObj.textTransform = thisEle.css('text-transform');
                    currObj.lineHeight = lineHeight;

                    var htmlEle = $(this).find('.innerText').children();
                    var child_html = '';
                    child_html += $(this).find('.innerText').html();
                    currObj.html = child_html;

                    //计算文本的长度
                    /*$.caculateLine(child_html,thisEle);
                    var linesNumber = [];
                    //根据内容数组 newlineArr  计算每行的长度，数组的长度就是行数
                    console.log(par.newlineArr);
                    for(var z = 0;z<par.newlineArr.length;z++){
                        var linetext = par.newlineArr[z];//一行的文本
                        var linelentotal = linetext.length;
                        //计算出文本中有多少个空格
                        var spacep = $.searchSubStr(linetext,'&nbsp;');
                        lineLen = linelentotal + spacep.length -(spacep.length)*6;
                        linesNumber.push(lineLen);
                    }
                    console.log(linesNumber);*/

                }
                if($(this).hasClass('svg') && !$(this).hasClass('backgroundColor')){
                    //svg内容
                    currObj.objectIndex = index;
                    currObj.type = 'vector';

                    //获取存在一点问题
                    var imgdeg_ = getmatrix(thisEle.css('transform'));
                    currObj.degree = imgdeg_;

                    currObj.opacity = thisEle.css('opacity');
                    currObj.left = strTonumber(thisEle.css('left'))/textSize;
                    currObj.top = strTonumber(thisEle.css('top'))/textSize;
                    currObj.width = strTonumber(thisEle.css('width'))/textSize;
                    currObj.height = strTonumber(thisEle.css('height'))/textSize;
                    //从子元素的img的src解析出来
                    currObj.imageId = thisEle.attr('svgSrc');
                    currObj.scale =textSize; /*thisEle.attr('svgScale');*/
                    // 修改的颜色数据
                    var asyncSvgArr = [];
                    asyncSvgArr = asyncScgData(thisEle);
                    currObj.fillColors = asyncSvgArr;
                }
                page.objects.push(currObj);
            });
            pages.push(page);
            jsonObj.content.pages = pages;
            par.totalJson = jsonObj;
           //return false;
            if(down == 'pub'){
                //发布
                $.downPre(jsonObj,down);
            }else if(down == 'down'){
                //数据同步到后台,并且下载
                $.ajaxTo(jsonObj,down);
            }else if(down == 'cancle'){
                //撤销，保存的当前操作的数据
                //比较两个json
                var jsonL = par.templateJson.length;
                var lastJson = par.templateJson[jsonL-1];
               /* console.log(lastJson.content.pages);
                console.log('---------------------------------------------------');
                console.log(JSON.stringify(jsonObj.content.pages));*/
                if(JSON.stringify(lastJson.content.pages) != JSON.stringify(jsonObj.content.pages)){
                    //json 改变  改变状态
                    $('.saveType').text('未保存的更改');
                    par.isSave = true;
                    if(par.templateJson.length>=20){
                        par.templateJson.unshift();
                    }
                    par.templateJson.push(par.totalJson);
                }
            }else if( down == 'sync'){
                    //同步
               /* var jsonL = par.templateJson.length;
                var lastJson = par.templateJson[jsonL-1];
                if(JSON.stringify(lastJson.content.pages) != JSON.stringify(jsonObj.content.pages)){
                    //json 改变  同步数据到后台
                    $.ajaxTo(jsonObj,down);
                }*/
            }

        }else{
            if(down == 'sync'){
                console.log('数据同步画布区为空');
                $('.saveType').text('未进行任何更改');
            }else if(down == 'down'){
                console.log('下载时画布区为空');
            }else if(down == 'pub'){
               console.log('模板为空，不能发布');
            }else if(down == 'cancle'){
                console.log('模板为空');
            }

        }

    },
    //新建一个画图的容器
    downPre:function(data,down){
//      var HTML = '<div class="hide_container" style="font-size:16px;position: absolute;margin: 0 auto;z-index: -1;background-color: #fff;"></div>';
//      $('#documentContainer').append(HTML);
//
//      //设置容器宽高等于模板宽高
//      par.canvasH = data.content.pages[0].height;
//      par.canvasW = data.content.pages[0].width;
//      par.container = $('.hide_container');
//      $('.hide_container').css({
//          'width':data.content.pages[0].width+'px',
//          'height':data.content.pages[0].height+'px'
//      }) ;
//      $.argumentParse(data.content,down);

		$('#page_content').clone().appendTo('#documentContainer');
		$('#documentContainer').children(".page_content:last-child").attr('id','cloneTemp');
		$('#cloneTemp').removeClass('page_content');
		$('#cloneTemp').css('overflow','visible')
					   .css('position','absolute')
					   .css('z-index','-10');
		
		
		
		
		w0=strTonumber($('#cloneTemp').css('width'));
		h0=strTonumber($('#cloneTemp').css('height'));
	    w1 = par.width;
	    h1 = par.height;
        if (w0<h1) {//如果页面模板比真实模板尺寸小时，将需要绘制的div放大后再绘画
        	
		    //	获取模板缩放比例
	        var drawSizeScale = w1/w0;
		    $('#cloneTemp').css('width',par.width+'px').css('height',par.height+'px');
		    
	        //拿到变化后的 基准字体
	        var textSize = parseInt($('#cloneTemp').css('width'))/par.width;
	        fontStand = 16 * textSize;
	        $('#cloneTemp').css('font-size',fontStand+'px');
	
		    var arr  = $('#cloneTemp .element');
		    for (var i=0;i<arr.length;i++) {
		    	
		        if ($(arr[i]).hasClass('image')) {
		        	
		            if ($(arr[i]).attr('isBackground')=='true') {
		                $(arr[i]).css('width',drawSizeScale*strTonumber($(arr[i]).css('width'))+'px')
			                     .css('height',drawSizeScale*strTonumber($(arr[i]).css('height'))+'px')
			                     .css('left',drawSizeScale*strTonumber($(arr[i]).css('left'))+'px')
			                     .css('top',drawSizeScale*strTonumber($(arr[i]).css('top'))+'px')
			                     
		            }else{
		                $(arr[i]).find('.zoomimg').css('width',drawSizeScale*strTonumber($(arr[i]).find('.zoomimg').css('width'))+'px')
		                    					  .css('height',drawSizeScale*strTonumber($(arr[i]).find('.zoomimg').css('height'))+'px');
		                    					  
		                $(arr[i]).css('width',drawSizeScale*strTonumber($(arr[i]).css('width'))+'px')
			                     .css('height',drawSizeScale*strTonumber($(arr[i]).css('height'))+'px')
			                     .css('left',drawSizeScale*strTonumber($(arr[i]).css('left'))+'px')
			                     .css('top',drawSizeScale*strTonumber($(arr[i]).css('top'))+'px')
		            }
		            
		        }else if($(arr[i]).hasClass('text')){
	                //在属性 中拿到当前字号
	
	                var font_zh = $(arr[i]).find('.innerText').attr('fontsize');
	                var fon_size = $.fontSizePxtoPer(font_zh);//拿到百分比 是元基准字体16 的百分比
	                $(arr[i]).css('width',drawSizeScale*strTonumber($(arr[i]).css('width'))+'px')
	                         .css('height',drawSizeScale*strTonumber($(arr[i]).css('height'))+'px')
	                         .css('left',drawSizeScale*strTonumber($(arr[i]).css('left'))+'px')
	                         .css('top',drawSizeScale*strTonumber($(arr[i]).css('top'))+'px')
	                         .css('overflow','visible')
	                         .css('font-size',fon_size);
	                $(arr[i]).find('.innerText').css('width',$(arr[i]).css('width'));
	                //字体的百分比 * 当前的 基准字体
	                var currfontSize_px = (parseFloat(fon_size)/100) *fontStand;
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
		            $(arr[i]).css('width',drawSizeScale*strTonumber($(arr[i]).css('width'))+'px')
		                     .css('height',drawSizeScale*strTonumber($(arr[i]).css('height'))+'px')
		                     .css('left',drawSizeScale*strTonumber($(arr[i]).css('left'))+'px')
		                     .css('top',drawSizeScale*strTonumber($(arr[i]).css('top'))+'px');
		                     
	                //因为svg比例有误差,当svg生成后将其自动计算的高度重新赋值给其父元素
		            var svgH = $(arr[i]).find('svg').css('height');
		            $(arr[i]).css('height',svgH);
		            
		        }else if($(arr[i]).hasClass('grid')){
		        	
		            $(arr[i]).css('width',drawSizeScale*strTonumber($(arr[i]).css('width'))+'px')
		                     .css('height',drawSizeScale*strTonumber($(arr[i]).css('height'))+'px')
		                     .css('left',drawSizeScale*strTonumber($(arr[i]).css('left'))+'px')
		                     .css('top',drawSizeScale*strTonumber($(arr[i]).css('top'))+'px')
		            
		        }
		    	
		    }
        }
		
		
		
		
		
        //以下是对svg的处理
        var svgElem = $("#cloneTemp").find('svg');//divReport为需要截取成图片的dom的id
        svgElem.each(function (index, node) {
            var parentNode = node.parentNode;
            var svg = node.outerHTML.trim();
			var w = strTonumber($(parentNode).css('width'));
			var h =strTonumber($(parentNode).css('height'));
            var canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            canvg(canvas, svg); 
            var url = canvas.toDataURL();
            var img = $('<img src='+url+' />')
            img.css({
            	'width':w+'px',
            	'height':h+'px'
            })
            
            parentNode.removeChild(node);
            parentNode.appendChild(img[0]);
        });
        var timeout = setTimeout(function () {
	        var opts = {
	            logging: false, //日志开关，便于查看html2canvas的内部执行流程
          		useCORS: true // 【重要】开启跨域配置
	        };
	        html2canvas(document.querySelector("#cloneTemp"),opts).then(function(canvas) {
		        	var oCanvas = document.createElement("canvas");
		            oCanvas.width = data.content.pages[0].width;
		            oCanvas.height = data.content.pages[0].height;
		            oCanvas.getContext("2d").drawImage(canvas, 0, 0,data.content.pages[0].width,data.content.pages[0].height);  
			        //图片
			        if(down == 'pub'){
			        	var dataUrl = oCanvas.toDataURL('image/jpeg');
			            $.publicTo(dataUrl);
			        }else{
			        	//转化类型
			       		var turnType = $('.downWrapper-option select option:selected').val();
				        if(turnType == "png" || turnType == "jpg"){
				            var imgLink = document.createElement('a');
				            imgLink.setAttribute('id','downImgurl');
				            imgLink.setAttribute('name','baidu');
				            imgLink.setAttribute('download',par.documentName);
				            document.body.appendChild(imgLink);
				            $("#downImgurl").hide();
				            if(turnType == 'jpg'){
				                turnType = 'jpeg';
				            }

				            var dataUrl = oCanvas.toDataURL('image/'+turnType);
				            $('body').append(oCanvas)
//				            console.log(dataUrl)
				            imgLink.setAttribute('href',dataUrl);
		                    imgLink.click();
		                    var downFinishremove = window.setTimeout(function () {
		                        $('#cloneTemp').remove();
		                        $('#downImgurl').remove();
                                //设置进度条状态
                                par.i_ = 100;
                                //par.s.changeValue(100);
                                $('.downProcess').hide();
                                $('#payWrapper').hide();
		                        clearTimeout(downFinishremove);
		                        downFinishremove = null;
		                    },10)
				            
				        }else if(turnType == "standardPdf"){
				            //标准pdf
				            var pageData = oCanvas.toDataURL('image/jpeg', 1.0);
				            $.downStandarPdf(pageData,oCanvas);
				        }else if(turnType == "printPdf"){
				            //打印pdf
				            var pageData = oCanvas.toDataURL('image/jpeg', 1.0);
				            $.downPrintPdf(pageData,oCanvas);
				        }
				        
			        }

	   		})
        },10)
		
		
    },
    //发布页面 可以有一个加载动画
    downProcess:function(){
        $('.downProcess').show();
        //第一步： 创建舞台
        var stage = new Konva.Stage({
            container: 'process_conva', //设置当前舞台的容器
            width: 520,//设置舞台的宽高全屏
            height: 25
        });

        //第二步： 创建层，一个舞台可以有多个层
        var layer = new Konva.Layer();

        //第三步： 把层添加到舞台上去。
        stage.add(layer);

        //创建的矩形
        par.option={
            x: 1/8 * stage.width(),     //进度条x坐标
            y: 1/2 * stage.height(),    //进度条y坐标
            width: 400,     //进度条的宽度
            height: 10,  //进度条的高度
            fill: '#5495e3',          //进度条内部矩形的填充的颜色
            stroke: '#ddd',
            strokeWidth: 4,
            opactity: .2,               //矩形的透明度
            cornerRadius: 10           //圆角的大小（像素）
        };
        //将option的内容放入Progress中
        par.s=new ProgressBar(par.option);//新建
        par.s.addToGroupOrLayer(layer);//调用js中的函数，传值
        //将矩形添加到层上，由于矩形建立在js中，所以必须到js中添加
        par.i_ = 0;
        var anim = new Konva.Animation(function(frame) {
            if(par.i_>99){
                return false;
            }else{
                par.i_ += 10;
                par.s.changeValue(par.i_);
            }

        }, layer);

        anim.start();
        layer.draw();
    },
    //将数据绘制到 视图层
//  argumentParse:function (confirmData,down) {
//      var canvaFonts = confirmData.canvaDefaultFonts;
//      var Pages = confirmData.pages;
//      //创建canvas
//      //$.createCanvas(canW,canY);
//
//      //模板素材
//      par.elementsArr = Pages[0].objects;
//      //遍历每个素材，拿到有用数据
//      for(var i=0,lena = par.elementsArr.length;i<lena;i++){
//          var eleCurr = par.elementsArr[i];
//          if (par.elementsArr[i].type=='photo') {
//              var imgTemp = {};
//              //取到素材图片对象
//              imgTemp.imgObj = new Image();
//              if(eleCurr.imageId){
//                  var imgsrc = $.analyImgSrc(eleCurr.imageId);
//                  imgTemp.src = imgsrc;
//              }
//              imgTemp.posArr = [eleCurr.left,eleCurr.top,eleCurr.width,eleCurr.height];
//              //旋转角度
//              imgTemp.rotateDeg = eleCurr.degree;
//              //透明度
//              imgTemp.opacity = eleCurr.opacity;
//              //是否为背景
//              imgTemp.isBackground = eleCurr.isBackground;
//              // 0没有翻转 1水平翻转 2垂直翻转 3先水平再垂直翻转 4先垂直再水平翻转
//              imgTemp.flip = eleCurr.flip;
//              //滤镜信息
//              imgTemp.filter = eleCurr.filter;
//              //裁剪信息
//              imgTemp.isClip = eleCurr.isClip;
//
//              if(eleCurr.isClip == 'true'){
//                  imgTemp.clipBox = eleCurr.imageClip;
//              }
//              par.imgs[i] = imgTemp;
//              //绘制
//              $.drawImage(par.imgs[i],par.imgs[i].isBackground,i,eleCurr);
//          }else if(par.elementsArr[i].type=='text'){
//              var textTemp = {};
//              //取到素材文字对象
//              textTemp.posArr = [eleCurr.left,eleCurr.top,eleCurr.width,eleCurr.height];
//              //旋转角度
//              textTemp.rotateDeg = eleCurr.degree;
//              //透明度
//              textTemp.opacity = eleCurr.opacity;
//              //内容
//              textTemp.html = eleCurr.html;
//              //样式
//              textTemp.style_ = {
//                  bold:eleCurr.stylesOverriden.bold,
//                  //字体
//                  fontFamily:eleCurr.stylesOverriden.fontFamily,
//                  //字体大小
//                  fontSize:eleCurr.fontSize,
//
//                  //对齐方式
//                  //对齐方式
//                  horizontalAlignment:eleCurr.horizontalAlignment,
//                  //字间距
//                  letterSpacing:eleCurr.letterSpacing,
//                  //行距
//                  lineHeight_:eleCurr.lineHeight,
//                  //垂直对齐
//                  verticalAlignment:eleCurr.verticalAlignment,
//                  //每行字长
//                  //letterNumber:eleCurr.letterNumber,
//                  //颜色
//                  color:eleCurr.stylesOverriden.color,
//                  //斜体
//                  italic:eleCurr.stylesOverriden.italic
//
//              };
//              par.texts[i] = textTemp;
//              //绘制
//              $.drawTxt(par.texts[i],i,eleCurr);
//          }else if(par.elementsArr[i].type=='vector'){
//              $.drawSvg(par.elementsArr[i],i);
//          }
//
//      }
//     // return false;
//      if(down == 'pub'){
//          $.downImg();
//      }else{
//          $.creatImgLink();
//      }
//
//  },
//  drawImage:function (imgsObj,isback,index,currData) {
//      //首先得判断是否存在旋转，翻转
//      //共有的值
//      var alphaS = imgsObj.opacity;
//      var rota = imgsObj.rotateDeg;
//      // params.ctx.save();
//      if(isback){
//          //背景图片
//          //params.ctx.drawImages(imgsObj.imgObj,0,0);
//          var htm = '';
//          htm += '<div class="backGround'+index+' bg" indexEle="'+index+' " style="position: absolute">';
//
//          if(imgsObj.src){
//              htm += '<img  src="'+imgsObj.src+'" alt="" class="bgImg'+index+'"/>';
//          }
//          htm += '</div>';
//          $(par.container).append(htm);
//          $('.backGround'+index).css({
//              'width':imgsObj.posArr[2]+'px',
//              'height':imgsObj.posArr[3]+'px',
//              'left':imgsObj.posArr[0]+'px',
//              'top':imgsObj.posArr[1]+'px',
//              'background-color':currData.backgroundColor,
//              'transform':'rotate('+rota+'deg)'
//          });
//          if(imgsObj.src){
//              $('.bgImg'+index).css({
//                  'width':imgsObj.posArr[2]+'px',
//                  'height':imgsObj.posArr[3]+'px'
//              });
//          }
//
//      }else{
//          //素材图片
//          //params.ctx.drawImages(imgsObj.imgObj,imgsObj.posArr[0],imgsObj.posArr[1])
//
//          //解析翻转角度值
//          var fz = imgsObj.flip;
//          if (fz==0) {
//              var rotateX=0;
//              var rotateY=0;
//          }else if(fz==1){
//              var rotateX=0;
//              var rotateY=180;
//          }else if(fz==2){
//              var rotateX=180;
//              var rotateY=0;
//          }else if(fz==3){
//              var rotateX=180;
//              var rotateY=180;
//          }
//          var htmSc = '';
//          htmSc += '<div class="scBox'+index+' scBox" indexEle="'+index+' " style="position: absolute">';
//          htmSc +='<div class="zoomimg'+index+'">';
//          htmSc += '<img  src="'+imgsObj.src+'" alt="" class="scImg'+index+' scImg"/>';
//          htmSc +='</div></div>';
//          //旋转，翻转，透明度的操作
//          $(par.container).append(htmSc);
//          $('.scBox'+index).css({
//              'overflow':'hidden',
//              'width':imgsObj.posArr[2]+'px',
//              'height':imgsObj.posArr[3]+'px',
//              'left':imgsObj.posArr[0]+'px',
//              'top':imgsObj.posArr[1]+'px',
//              'transform':'rotate('+rota+'deg)',
//              'opacity':alphaS
//          });
//          $('.scImg'+index).css({
//              'width':'100%',
//              'height':'100%',
//              'position':'absolute',
//              'transform':'rotateX('+rotateX+'deg) rotateY('+rotateY+'deg)'
//          });
//          if(imgsObj.isClip == 'true'){
//              $('.zoomimg'+index).css({
//                  'position':'absolute',
//                  'width':imgsObj.clipBox.width+'px',
//                  'height':imgsObj.clipBox.height+'px',
//                  'left':imgsObj.clipBox.left+'px',
//                  'top':imgsObj.clipBox.top+'px'
//              })
//          }
//
//      }
//
//  },
//  drawTxt:function (txtObj,index,currData) {
//      var alphaS = txtObj.opacity;
//      var rota = txtObj.rotateDeg;
//      //拿到当前的基准字体
//
//      var htmTxt = '';
//      htmTxt += '<div class="txtBox'+index+' txtBox" indexEle="'+index+' " style="position: absolute;font-size: ">';
//      htmTxt += '<div  class="txt'+index+' txt">'+txtObj.html+'</div>';
//      htmTxt +='</div>';
//      //旋转，翻转，透明度的操作
//      $(par.container).append(htmTxt);
//      //不乘以缩放比，利用原始值
//      var fontSize_ = txtObj.style_.fontSize; //字号
//      var currfont_size = parseFloat(fontSize_);//原比例所以 *16   当前字体大小
//      var fontper = currfont_size*100/16 +'%';
//      //console.log(currfont_size);
//      var letterSpacing_ = txtObj.style_.letterSpacing/1000 +'em';
//      var lineH = txtObj.style_.lineHeight_*currfont_size +'px';
//
//      $('.txtBox'+index).css({
//          'width':txtObj.posArr[2]+'px',
//          'height':txtObj.posArr[3]+'px',
//          'left':txtObj.posArr[0]+'px',
//          'top':txtObj.posArr[1]+'px',
//          /*'letter-spacing':txtObj.style.letterSpacing,*/
//          'transform':'rotate('+rota+'deg)',
//          'letter-spacing':letterSpacing_,
//          'line-height':lineH,
//          'opacity':alphaS,
//          'font-size':'16px' //基准字体
//      });
//      //console.log(txtObj.posArr[2]);
//      $('.txt'+index).css({
//          'width':txtObj.posArr[2]+'px',
//          'height':txtObj.posArr[3]+'px',
//          'color':txtObj.style_.color,
//          'font-Family':txtObj.style_.fontFamily,
//          'text-align':txtObj.style_.horizontalAlignment,
//          'verticle-align':txtObj.style_.verticalAlignment,
//           'font-size':fontper,
//          'font-weight':txtObj.style_.bold
//      })
//
//      /*// 设置文字阴影的颜色为黑色，透明度为20%
//      params.ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
//      // 将阴影向右移动15px，向上移动10px
//      params.ctx.shadowOffsetX = 2;
//      params.ctx.shadowOffsetY = 2;
//      // 轻微模糊阴影
//      params.ctx.shadowBlur = 2;
//
//      params.ctx.fillStyle="#058";
//      params.ctx.font="italic small-caps bold 12px arial";
//      params.ctx.textAlign="center";
//      params.ctx.textBaseline ="middle";
//      params.ctx.font="bold 20px Arial";
//      params.ctx.fillText("Hello canvas！",500,100);*/
//  },
//  drawSvg:function (svgObj,index) {
//      $.ajax({
//          type:"get",
//          url: 'http://www.photostars.cn/webHDGallery/' + svgObj.imageId,
//          success:function(data){
//              var frag = $('<div class="element svg svg'+index+'" elementType="svg"><div/>');
//             // var textSize2 = par.width/strTonumber($('#page_content').css('width'));
//              getColors(frag[0]);
//              $('.toolbar__slider--transparency').val(1*100);
//              //alert(textSize2)
//              frag.css({
//                  'width': svgObj.width+'px',
//                  'height': svgObj.height+'px',
//                  'transform': 'rotate('+ svgObj.degree +'deg)',
//                  'position': 'absolute',
//                  'left': svgObj.left+'px',
//                  'top': svgObj.top+'px',
//                  'opacity': svgObj.transparency,/**/
//              });
//              frag.html( $(data).find('svg') );
//              $(par.container).append(frag);
//              frag.find('title').text('');
//
//
//              // 初始化svg color
//              if(svgObj.fillColors.length>0){
//                  var svgBox = frag.find('svg').children('*');
//                  for(var k = 0; k < svgObj.fillColors.length; k++) {
//                      var idName = svgObj.fillColors[k];
//                      for(var h = 0; h < svgBox.length; h++){
//                          var everyLabel = svgBox[h];
//                          if($(everyLabel).attr('id')){
//                              var curId = $(everyLabel).attr('id').substring(0, 7);
//
//                              if(idName.id == curId){  // 如果id名称一样 group1
//                                  if(idName.type == 'idfill'){   // 如果类型一样，是放到idfill外层，还是gfill内层？
//                                      $(everyLabel).css('fill', idName.color);
//                                  }else{
//                                      $(everyLabel).children().each(function(){
//                                          $(this).css('fill', idName.color);
//                                      })
//                                  }
//                              }
//                          }
//                      }
//                  }
//              }
//
//              /**
//               *直接svg转Png的pngBase64
//               */
//              var htmlsvg = $('.hide_container').find('.svg'+index).html();
//              var svgHtml=htmlsvg.trim();
//              var svgTopng = $.getBase64PNG(svgHtml,svgObj);
//              $('.hide_container').find('.svg'+index).remove();
//              var $svgHtml = $('<div class="element svg svg'+index+'" elementType="svg"><img class="svgImg'+index+'" src="" alt=""><div/>');
//              $('.hide_container').append($svgHtml);
//              localStorage.setItem('svgbase64', svgTopng);
//              $svgHtml.css({
//                  'width': svgObj.width+'px',
//                  'height': svgObj.height+'px',
//                  'transform': 'rotate('+ svgObj.degree +'deg)',
//                  'position': 'absolute',
//                  'left': svgObj.left+'px',
//                  'top': svgObj.top+'px',
//                  'opacity': svgObj.transparency
//              });
//             // console.log(svgTopng);
//              $('.svgImg'+index).css({
//                  'width':'100%',
//                  'height':'100%',
//                  'position':'absolute'
//              }).attr('src',svgTopng);
//
//          }
//
//      });
//  },
//  getBase64PNG:function(svgStr,obj) {
//      var canvas = document.createElement("canvas");
//      canvas.width = obj.width/obj.scale;
//      canvas.height = obj.height/obj.scale;
//      console.log(obj.width/obj.scale);
//      console.log(obj.height/obj.scale);
//      $('html').append(canvas);
//      var ctx = canvas.getContext("2d");
//      ctx.drawSvg(svgStr, 0, 0);
//
//      var dataURL = canvas.toDataURL("image/png");
//      $(canvas).remove();
//      return dataURL
//  },
    fontSizePxtoPer:function (px_,scale) {//json的值 转 百分比
        var percent_ = null;

        var Numberpx_ = Number(px_);
        if (scale) {
            Numberpx_ = Numberpx_ * scale;
        }
        percent_ = (Numberpx_/orfontStand)*100 +'%';
        return percent_;
    },
    fontSizePertopx:function (per_) {//百分比转px
        var str=per_.replace("%","");
        return (Number(str)*orfontStand)/100;
    },
    letterSpacePxtoRem:function (px_) {//px 转 em
        var rem_ = null;
        var Numberpx_ = Number(px_); 
        rem_ = Numberpx_/1000 +'em';
        return rem_;
    },
    letterSpaceRemtoPx:function (rem_) {
        var str=rem_.replace("em","");
        var px_ = Number(str)*1000;
        return px_;
    },
    /*进度条*/
    closeFinish:function(closeClas){
        $('.'+closeClas).hide();
    },
    //number * 百分数
    numberPercent:function(num,per){
        //百分数转number
        var perNum = strTonumber(per.replace('%',''));
        var result = perNum*num;
        return (result + '%');
    },
    //number * px
    numberPx:function(num,px_){
        //百分数转number
        var perNum = strTonumber(px_.replace('px',''));
        var result = perNum*num;
        return (result + 'px');
    },
    //验证用户权限
    turnHref:function(href_){
        var userInfo_ = JSON.parse(localStorage.getItem('userInfo'));
        $.ajax({
            type:'post',
            url:par.urlhead+'worksys/judgeCreateAutority',
            data:{
                'authorityKey':'9670f10b8b17ea61010375bfbe08138d',
                'userID':userInfo_.userID,
                'token':userInfo_.token
            },
            datatype:'json',
            success:function(data){
                var jsonData_ = JSON.parse(data);
                var statu = jsonData_.status;
                if(statu == 1){
                    //正确，跳转到我是大师页面
                    //alert('1');
                    location.href = href_;

                }else if(statu == -1){
                    //token 错误
                    alert('arguments error!');
                }else if(statu == -2){
                    //同步保存失败
                    alert('token error!');
                }else{
                    //其他失败
                    alert('没有权限！');
                }
            },
            error: function(XMLHttpRequest,textStatus ,errorThrown){
                alert(textStatus);
            }
        })
    },
    //动态加载外部字体
    loadFontface:function(fontname){
        var fontNameL = fontname.length;
        /*'[{"ttfName":"STHupo.ttf"},{"ttfName":"STSong.ttf"}]'*/
        var fontArr = [];

        for(var i =0;i<fontNameL;i++){
            var fontObj = {};
            fontObj.ttfName = fontname[i].name+'.ttf';
            fontArr.push(fontObj);
        }
        var font_d = JSON.stringify(fontArr);
        var userInfo_ = JSON.parse(localStorage.getItem('userInfo'));
        //console.log(font_d);
        $.ajax({
            type:"post",
            url:'http://www.photostars.cn:8020/index.php/web1_0/worksys/getSeriesDownFontUrls',
            data:{
                'authorityKey':'9670f10b8b17ea61010375bfbe08138d',
                'userID':userInfo_.userID,
                'token':userInfo_.token,
                'fontData':font_d
            },
            success:function (data) {

                var res = JSON.parse(data);
                if(res.status == 1){
                    var dataList =res.fontData;
                    var checkdom_arr = [];

                    var loadfontarr = [];
                    var loadsuccessfont = [];
                    var loadFailedfont = [];
                    for(var i = 0;i<dataList.length;i++){
                        var newStyle = document.createElement('style');
                        var fontUrl = dataList[i].fontUrl;
                        //console.log(fontUrl);
                        newStyle.appendChild(document.createTextNode("\
                            @font-face {\
                              font-family: '" +dataList[i].ttfName.slice(0,dataList[i].ttfName.length-4) + "';\
                              src: url('"+fontUrl+"');\
                            }\
                            "));
                        document.head.appendChild(newStyle);

                        var domobj = {
                            'index':i,
                            'font_family':dataList[i].ttfName.slice(0,dataList[i].ttfName.length-4)
                        };
                        loadfontarr.push(dataList[i].ttfName.slice(0,dataList[i].ttfName.length-4));
                        checkdom_arr.push(domobj);
                    }
                    $.checkFont_(loadfontarr)
                }else if(res.status == -2){
                    alert('字体请求失败 token error');
                }else{
                    alert('字体请求失败 other error')
                }


            },
            error:function(){
                alert('字体请求失败');
                $('.text_font').hide();
                par.isLoad = true;
            }
        });


    },
    //
    checkFont_:function (checkArr) {
        var checkL = checkArr.length;
        WebFont.load({
            custom: {
                families: checkArr,
                text: 'abcdefghijklmnopqrstuvwxyz!'

            },
            timeout: 40000*checkL, // Set the timeout to two seconds
            /*fontloading：这个事件对于呈现的每种字体都会触发一次。
            fontactive：该事件对于加载的每种字体都会触发一次。
            fontinactive：如果字体无法加载，则触发此事件。
            inactive：当浏览器不支持链接字体或者没有任何字体可以加载时，触发此事件。
            loading：所有字体被请求时，触发此事件。
            active：字体渲染时触发此事件。*/
            loading: function() {
            },
            active: function() {
                console.log('完成');
                $('.text_font').hide();
                par.isLoad = true;
            },
            inactive: function() {
                //不支持
                alert('暂不支持该字体');
                $('.text_font').hide();
                par.isLoad = true;
            },
            fontloading: function(fontFamily, fontDescription) {
                console.log('加载中');
            },
            fontactive: function(fontFamily, fontDescription) {
                console.log('渲染中');

            },
            fontinactive: function(fontFamily, fontDescription) {
                //加载失败
                alert(fontFamily+'字体渲染失败');

            }
        });


        /*var num = 0;
        var checkL = checkArr.length;
        var delayTime = 50;
        var setTimeout = 30000 * checkL;

        var interval_check = setInterval(function() {
            setTimeout = setTimeout - delayTime;
            var loadsuccessfont = [];
            var loadFailedfont = [];
            for(var i=0;i<checkL;i++){
                // 返回true，说明字体被加载
                if(isSupportFontFamily(checkArr[i].font_family)){
                    num++;
                    loadsuccessfont.push(checkArr[i].font_family);
                }else{
                    loadFailedfont.push(checkArr[i].font_family);
                }
            }
            if(setTimeout<0){
                //时间超时
                if(num<checkL){
                    alert('部分字体加载失败');
                    //找到加载失败的字体,设置成默认字体

                }
                $('.text_font').hide();
                clearInterval(interval_check);
            }else{
                if(num>=checkL){
                    //加载完成
                    clearInterval(interval_check);
                    $('.text_font').hide();
                } else{
                    //继续循环
                    num = 0;
                }
            }
        }, delayTime);*/
    },
    checkFont:function (fontarr) {
        WebFont.load({
            custom: {
                families: fontarr,
                text: 'abcdefghijklmnopqrstuvwxyz!'

            },
            timeout: 40000, // Set the timeout to two seconds
            /*fontloading：这个事件对于呈现的每种字体都会触发一次。
            fontactive：该事件对于加载的每种字体都会触发一次。
            fontinactive：如果字体无法加载，则触发此事件。
            inactive：当浏览器不支持链接字体或者没有任何字体可以加载时，触发此事件。
            loading：所有字体被请求时，触发此事件。
            active：字体渲染时触发此事件。*/
            loading: function() {
            },
            active: function() {
               // console.log('完成');
                $('.loading_font').hide();
            },
            inactive: function() {
                //不支持
                alert('暂不支持该字体');
                $('.loading_font').hide();
            },
            fontloading: function(fontFamily, fontDescription) {
                console.log('加载中');
            },
            fontactive: function(fontFamily, fontDescription) {
                console.log('渲染字体');
                // 设置字体为
                $('.editTextBox').css('font-family',fontFamily);
                $(clickTextThis).css('font-family',fontFamily);
                var fontLen = par.fontList.length;
                for(var i=0;i<fontLen;i++){
                    if(fontFamily == par.fontList[i].fontttf){
                        $('.fontbar').html(par.fontList[i].fontChina);
                        $('.fontbar').attr('font-family',par.fontList[i].fontttf);
                    }
                }
            },
            fontinactive: function(fontFamily, fontDescription) {
                //加载失败
                alert(fontFamily+'字体渲染失败');

            }
        });
    },
    //解析图片路径
    analyImgSrc:function(media){
        var sliceStr= media.slice(-6,-4);
        //alert(sliceStr);
        var imgSrc = '';
        var media_ = media.replace('webHDGallery/','');
        if(sliceStr == 'or'){
            imgSrc  = par.imgUrl2 + media_;
        }else if(sliceStr == 'sh'){
            imgSrc = par.imgUrl+media_;
        }else{
            imgSrc = par.imgUrl+media_;
        }
        return imgSrc;
    },
    //移动光标位置
    moveToEnd:function (el) {
        if (typeof el.selectionStart == "number") {
            el.selectionStart = el.selectionEnd = el.value.length;
        } else if (typeof el.createTextRange != "undefined") {
            el.focus();
            var range = el.createTextRange();
            range.collapse(false);
            range.select();
        }
    },
    //解析url
    getQueryString_:function(field, url) {
        var href = url ? url : window.location.href;
        var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
        var string = reg.exec(href);
        return string ? string[1] : null;
    },
    /*计算文本的 行数 每行的长度 空格&nbsp; 代表长度1*/
    caculateLine:function (lineText,eleobj){
        par.newlineArr = [];
        var linesArr = lineText.split('<br>');
        for(var m = 0;m<linesArr.length;m++){
            //计算字符的宽度
            $.caculateTextbox(linesArr[m],eleobj);
        }
    },
    /*计算字符宽度获取字符行数*/
    caculateTextbox:function (str,$ele){
    var $pre = $('<span></span>');
        $ele.append($pre);
        //获取文字属性
        var fontsize =$ele.css('font-size');
        var letterspacing = $ele.css('letter-spacing');
        var fontitalic = $ele.css('font-style');
        var fontweight = $ele.css('font-weight');
        var fontfamily = $ele.css('font-family');
        var textboxWidth = $ele.css('width');
        //设置属性
        $pre.css({
            'font-size':fontsize,
            'letter-spacing':letterspacing,
            'font-style':fontitalic,
            'font-weight':fontweight,
            'font-family':fontfamily
        });
        /*遍历字符串*/
        var strWidth = 0;
        //存在空格&nbsp;
        var lineText = '';
        var str_ = str.replace(/ /g,'&nbsp;');
        //返回 &nbsp; 在父串中的位置,将字符串以空格为准 分割成数组
        var spacePos = $.searchSubStr(str_,'&nbsp;');
        var strArr = [];
        if(spacePos.length>0){
            strArr.push(str_.substr(0,spacePos[0]));
            for(var j = 0;j<spacePos.length;j++){
                var spacpos = spacePos[j];
                var sub_ = str_.substr(spacpos,6);
                var nextspacpos = spacePos[j+1];
                strArr.push(sub_);
                var jiange = nextspacpos- (spacpos+6);
                if(jiange>0){
                    //两个空格中间的文本值
                    var sub_next = str_.substr(spacpos+6,jiange);
                    strArr.push(sub_next);
                }

            }
            strArr.push(str_.substr(spacePos[spacePos.length-1]+6,str_.length-(spacePos[spacePos.length-1]+6)));
        }else{
            strArr.push(str_);
        }
        for(var n=0;n<strArr.length;n++){
            //如果是空格
            if(strArr[n] == '&nbsp;'){
                $pre.html(strArr[n]);
                strWidth = strWidth + strTonumber($pre.css('width'));
                if(strWidth>=strTonumber(textboxWidth)){
                    //第一行结束，换行
                    console.log('换行字母'+strArr[n]);
                    console.log('换行字母宽度'+strTonumber($pre.css('width')));
                    console.log('总宽度：'+strWidth);
                    strWidth = 0;
                    par.newlineArr.push(lineText);//一行结束
                    //新的一行
                    lineText = '';
                    lineText += strArr[n];
                }else{
                    lineText += strArr[n];
                }
            }else{
                for(var k=0;k<strArr[n].length;k++){
                    $pre.html(strArr[n][k]);

                    strWidth = strWidth + strTonumber($pre.css('width'));
                    if(strWidth>=strTonumber(textboxWidth)){
                        //第一行结束，换行
                        console.log('换行字母:'+strArr[n][k]);
                        console.log('换行字母宽度:'+strTonumber($pre.css('width')));
                        console.log('总宽度：'+strWidth);
                        strWidth = 0;
                        par.newlineArr.push(lineText);
                        lineText = '';
                        lineText += strArr[n][k];
                    }else{
                        lineText += strArr[n][k];
                    }
                }
            }

        }
        par.newlineArr.push(lineText);
        $pre.remove();
},
/*查找所有子串的位置*/
    searchSubStr:function (str,subStr){
    var positions = new Array();
    var pos = str.indexOf(subStr);
    while(pos>-1){
        positions.push(pos);
        pos = str.indexOf(subStr,pos+1);
    }
    return positions;
}


});