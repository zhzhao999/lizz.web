/*$(function(){
	function getSvg(url){
		$.ajax({
			url: url,
			type: 'get',
			async: false,
			success: function(xml){
				// console.log(xml);
				var frag = $('<div class="element svg"/>');
				frag.html( $(xml).find('svg') );
				$('#svg').append(frag);
			}
		})
	}
})*/

/*同步获取颜色数据*/
function asyncScgData(that){
	var arrGId = [];
    var arrG = [];
    var svgBox = $(that).find('svg').children('*');
    $.each(svgBox, function(i){
        var id = $(svgBox[i]).attr('id');
        var splitId = null;
        var splitRemId = null;
        if(id){
            splitId = id.substring(0, 5);  //group
            splitRemId = id.substring(0, 7);  //group1，group2，group3...
        }
        // console.log(splitId);
        if($.inArray(splitRemId,arrGId) == -1 && splitId == 'group'){
            arrGId.push(splitRemId);
            arrG.push( $(svgBox[i]) );
        }
    })
    // console.log(arrGId);
    // console.log(arrG);
	// 获取元素的颜色值
	var colors = [];
	$.each(arrG, function(){
		var el = $(this);
		var id = el.attr('id').substring(0, 7);  //截取剩下的id，例 group1 或group1-
		var obj = {};
		
		if(el.attr('style')){
			var col = el.css('fill');
			if(col == 'undefined'){
				obj.color = '#000';
			}else if(col == 'none'){
				obj.color = 'none';
			}else{
				obj.color = col;
			}
			if(el.css('stroke')){
				obj.stroke = el.css('stroke');
			}
			obj.type = 'idfill';  //样式在id所在标签上
			obj.id = id;
		}
		else{
			var col = el.children().eq(0).css('fill');
			if(col == 'undefined'){
				obj.color = '#000';
			}else if(col == 'none'){
				obj.color = 'none';
			}else{
				obj.color = col;
			}
			if(el.children().eq(0).css('stroke')){
				obj.stroke = el.children().eq(0).css('stroke');
			}
			obj.type = 'gfill';
			obj.id = id;
		}
		colors.push(obj);
	})
     // console.log(colors);
	return colors;
}

function getColors(dom){
	$(dom).on('mousedown', function(){
		var that = this;
		$('.toolbarWrapper').show(200);
		var colors = asyncScgData($(that));
		
		var menuList = '';
		for(var i = 0; i < colors.length; i++) {
			var val = colors[i];
			if(val.color && val.color != 'none'){
				menuList += '<li class="toolbarItem toolbar_item--color" style="background-color:'+ val.color +'" title="挑选颜色" type="'+ val.type +'" strok="0" idName="'+ val.id +'" onclick="changeColor(this,event)"></li>';
			}
			if(val.stroke && val.stroke != 'none'){
				menuList += '<li class="toolbarItem toolbar_item--color" style="background-color:'+ val.stroke +'" title="挑选颜色" type="'+ val.type +'" strok="1" idName="'+ val.id +'" onclick="changeColor(this,event)"></li>';
			}
		}
	    $('.toolbarList').html(menuList);
	})
}

function changeColor(dom, e){
	$('.colorPicker').hide(200);  // 调色板隐藏
	var that = dom;
	var type = $(that).attr('type');
	var idName = $(that).attr('idName');
	var strokFlag = $(that).attr('strok');

	// 控制模板位置
	var left = $(that).offset().left - 8;
	$('.scrollableWrapper').css({
		'left': left+'px',
	})
	$('.scrollableWrapper').show(200);

	//console.log($(that).css('background-color').colorHex());
	$('#pickerPaletteText').val($(that).css('background-color').colorHex());	
    /*初始化调色板*/
    $('#pickerPalette').farbtastic('#pickerPaletteText');

	// 点击改变颜色
	$('.scrollableWrapper .colorPaletteEntry').off('click');
	$('.scrollableWrapper .colorPaletteEntry').on('click', function(e){
		var curColor = $(this).css('color');
		$(that).css({
			'background-color': curColor
		});

		/*颜色设置*/
		setChangeColor(idName, type, curColor, strokFlag);
		e.stopPropagation();
	});
	$('#pickerPalette').off('click');
	$('#pickerPalette').on('click', function(){
		var curColor = $('#pickerPaletteText').val();
		$(that).css({
            'background-color': curColor
        });
        /*颜色设置*/
		setChangeColor(idName, type, curColor, strokFlag);
	})
    $('#pickerPaletteText').off('blur');
	$('#pickerPaletteText').on('blur', function(){
		var curColor = $('#pickerPaletteText').val();
		$(that).css({
            'background-color': curColor
        });

        /*颜色设置*/
		setChangeColor(idName, type, curColor, strokFlag);
	})
    e.stopPropagation();  //阻止冒泡
}

function setChangeColor(idName, type, color, strokFlag){
	// console.log(idName, type, color);
	var svgBox = $('.selected').find('svg').children('*');
	$.each(svgBox, function(){
		var $dom = $(this);
		if($dom.attr('id')){
			var curId = $dom.attr('id').substring(0, 7);

			if(idName == curId){  // 如果id名称一样 group1
				if(type == 'idfill'){   // 如果类型一样，是放到idfill外层，还是gfill内层？
					if(strokFlag == 0){
						$dom.css('fill', color);
					}else{
						$dom.css('stroke', color);
					}
				}else{
					if(strokFlag == 0){
						$dom.children().each(function(){
							$(this).css('fill', color);
						})
					}else{
						$dom.children().each(function(){
							$(this).css('stroke', color);
						})
					}
				}
			}
		}
	});
    $.dataSync('cancle','svg颜色修改');
}



/*改变背景颜色*/
function changeImageColor(dom){
	$(dom).on('mousedown', function(){
		var that = this;
		$('.toolbarWrapper').show(200);

		var colors = [];
		colors.push($(that).css('background-color'));

		var menuList = '';
		for(var i = 0; i < colors.length; i++) {
			var val = colors[i];
			menuList += '<li class="toolbarItem toolbar_item--color" style="background-color:'+ val +'" title="挑选颜色" onclick="changeImgColor(this,event)"></li>';
		}
	    $('.toolbarList').html(menuList);
	})
}
function changeImgColor(dom, e, text){
	var that = dom;
	// 控制模板位置
	var left = $(that).offset().left - 8;
	$('.scrollableWrapper').css({
		'left': left+'px'
	})
	$('.scrollableWrapper').show(200);

	$('#pickerPaletteText').val($(dom).css('background-color').colorHex());	
    /*初始化调色板*/
    $('#pickerPalette').farbtastic('#pickerPaletteText');
	if(text && text == 'text'){
		//取消绑定
        $('.scrollableWrapper .colorPaletteEntry').off('click');
        $('.scrollableWrapper .colorPaletteEntry').on('click',function () {
            var curColor = $(this).css('color');
            $(that).css({
                'background-color': curColor
            });
            //设置字体颜色
			$('.editTextBox').css(
				'color',curColor
			)
			$(clickTextThis).css(
				'color',curColor
			)
            //$.dataSync('cancle','颜色修改');
        })

        $('#pickerPalette').off('click');
        $('#pickerPalette').on('click', function(){
			var curColor = $('#pickerPaletteText').val();
			$(that).css({
                'background-color': curColor
            });
            
            //设置字体颜色
			$('.editTextBox').css(
				'color',curColor
			)
			$(clickTextThis).css(
				'color',curColor
			)
		})
        $('#pickerPaletteText').off('blur');
		$('#pickerPaletteText').on('blur', function(){
			var curColor = $('#pickerPaletteText').val();
			$(that).css({
	            'background-color': curColor
	        });

	        //设置字体颜色
			$('.editTextBox').css(
				'color',curColor
			)
			$(clickTextThis).css(
				'color',curColor
			)
		})
	}else if($('.selected').hasClass('grid')){
        // 点击改变背景颜色
        $('.scrollableWrapper .colorPaletteEntry').off('click');
        $('.scrollableWrapper .colorPaletteEntry').on('click', function(e){
            var curColor = $(this).css('color');
            $(that).css({
                'background-color': curColor
            });
			
            var $bgDiv = $("<div class='backgroundColor placeholder'></div>");
            $bgDiv.css({
                'background-color': curColor,
                'left':0,
                'top':0,
                'width':'100%',
                'height':'100%'
            })
            $(clickCutGridThis).find('.placeholder').remove();
            $(clickCutGridThis).append($bgDiv);
            $(clickCutGridThis).attr('elementType','bgclolr');
            //$.dataSync('cancle','颜色修改');
            e.stopPropagation();
        });
        $('#pickerPalette').off('click');
        $('#pickerPalette').on('click', function(){
			var curColor = $('#pickerPaletteText').val();
			$(that).css({
                'background-color': curColor
            });

            var $bgDiv = $("<div class='backgroundColor placeholder'></div>");
            $bgDiv.css({
                'background-color': curColor,
                'left':0,
                'top':0,
                'width':'100%',
                'height':'100%'
            })
            $(clickCutGridThis).find('.placeholder').remove();
            $(clickCutGridThis).append($bgDiv);
            $(clickCutGridThis).attr('elementType','bgclolr');
		})
        $('#pickerPaletteText').off('blur');
		$('#pickerPaletteText').on('blur', function(){
			var curColor = $('#pickerPaletteText').val();
			$(that).css({
	            'background-color': curColor
	        });

	        var $bgDiv = $("<div class='backgroundColor placeholder'></div>");
            $bgDiv.css({
                'background-color': curColor,
                'left':0,
                'top':0,
                'width':'100%',
                'height':'100%'
            })
            $(clickCutGridThis).find('.placeholder').remove();
            $(clickCutGridThis).append($bgDiv);
            $(clickCutGridThis).attr('elementType','bgclolr');
		})
	}else{
        // 点击改变背景颜色
        $('.scrollableWrapper .colorPaletteEntry').off('click');
        $('.scrollableWrapper .colorPaletteEntry').on('click', function(e){
            var curColor = $(this).css('color');
            $(that).css({
                'background-color': curColor
            });

            $('.selected').css({
                'background-color': curColor
            })
            e.stopPropagation();
        });
        $('#pickerPalette').off('click');
        $('#pickerPalette').on('click', function(){
			var curColor = $('#pickerPaletteText').val();
			$(that).css({
                'background-color': curColor
            });

            $('.selected').css({
                'background-color': curColor
            })
		})
        $('#pickerPaletteText').off('blur');
		$('#pickerPaletteText').on('blur', function(){
			var curColor = $('#pickerPaletteText').val();
			$(that).css({
	            'background-color': curColor
	        });

	        $('.selected').css({
                'background-color': curColor
            })
		})
	}
	//修改背景颜色
    $.dataSync('cancle','颜色修改');
    e.stopPropagation();  //阻止冒泡
}

$(function(){
	// 点击改变背景颜色
	$('#pickerPalette2').on('click', function(){
		var curColor = $('#pickerPaletteText2').val();

		$('.backgroundColor').css({
			'background-color': curColor
		})
        $.dataSync('cancle','颜色修改');
	})
	$('#pickerPaletteText2').on('blur', function(){
		var curColor = $('#pickerPaletteText2').val();
		$('.backgroundColor').css({
			'background-color': curColor
		})
	})
	$('#backgroundColor .colorPaletteEntry').on('click', function(e){
		$('.toolbarWrapper').hide();
		var curColor = $(this).css('color');

		$('.backgroundColor').css({
			'background-color': curColor
		});
        par.nullTemplate = true;
        $.dataSync('cancle','颜色修改');
	});

	/*获取当前选中层的类型，设置头部菜单栏的显隐*/
    $(document).on('click', function(){
        var $seleced = $('.selected');
        $('.toolbarBox').hide();
    	//console.log($seleced);
        if($seleced.hasClass('image') && !$seleced.hasClass('backgroundColor')){
            $('.toolbarFilter').show();
        }
        else if($seleced.hasClass('text')){
              $('.toolbarFont').show();
        }
        else if($seleced.hasClass('svg') || $seleced.hasClass('backgroundColor')){
            $('.toolbarList').show();
        }
        else if($seleced.hasClass('grid')){
            $('.toolbarList').show();
            $('.toolbarGridSpacing').show();
        }
    })

	// 修改透明度
    $('.toolbar__button--transparency').on('click', function(e){

		if($(this).siblings('.toolbar--transparency').is(':hidden')){
			$(this).siblings('.toolbar--transparency').show(200);
            $('.spacingList').hide();
            $('.colorList').hide();
            $('.fontList').hide();
            $('.alignList').hide();
            $('.sizeList').hide();
        }else{
            $(this).siblings('.toolbar--transparency').hide(200);
        }

        
    	e.stopPropagation();  //阻止冒泡
    })
    $('.toolbar__slider--transparency').on('click', function(e){
		e.stopPropagation();  //阻止冒泡
    })
    $('.toolbar__slider--transparency').on('mousedown', function(){
    	document.onmousemove=function () {
			var val = $('.toolbar__slider--transparency').val();
			$('.toolbar__sliderValue--transparency').val(val);
			$('.selected').css('opacity', val/100);
		};
		document.onmouseup=function () {
			document.onmousemove=null;
		}
    })
    $('.toolbar__slider--transparency').on('change', function(){
		var val = $('.toolbar__slider--transparency').val();
		$('.toolbar__sliderValue--transparency').val(val);
		$('.selected').css('opacity', val/100);
        $.dataSync('cancle','透明度');
    });

    /*控制翻转框显隐*/
    $('.changeRotate').on('click', function(e){
    	$('.rotateBtn').show(200);
		$('.toolbar--range').hide(200);
    	e.stopPropagation();  //阻止冒泡
    })

    /*调色板阻止冒泡*/
    $('.colorPicker').on('click', function(e){
    	e.stopPropagation();  //阻止冒泡
    })
    /*变色弹层*/
    $('.scrollableWrapper').on('click', function(e){
    	e.stopPropagation();  //阻止冒泡
		$('.colorPicker').hide(200);  // 调色板隐藏
    })
})

$(document).on('click', function(){
    $('.scrollableWrapper').hide(200);
	$('.toolbar').hide(200);  //顶部下拉框隐藏
	$('.selectImageType').slideUp(200);
	$('.colorPicker').hide(200);  // 调色板隐藏
});
