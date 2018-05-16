$(function () {
//	var a = gridJson4.pages[0].objects[0];
//	gridObj(a)
})

//渲染grid网格数据
function gridObj (gridObj,imgur,sizeScale) {
	var arr = gridObj.vertexes;
	var obj = gridObj;
	
	if (obj.type=='grid') {
		var $girdDiv = $("<div class='element grid' elementType='grid'></div>");
		var $innerDiv = $("<div class='gridinner'></div>");
		var gridW = obj.width;
		var gridH = obj.height;
		var gridL = obj.left;
		var gridT = obj.top;
		var spacing = obj.gap;
		$girdDiv.css('position','absolute')
                .css('left',gridL)
                .css('top',gridT)
                .css('width',gridW+'px')
                .css('height',gridH+'px')
                .css('transform','rotate('+obj.degree+'deg)')
                .css('opacity',obj.opacity);
                
        $innerDiv.css('position','absolute')
                .css('left',0)
                .css('top',0)
                .css('right',0)
                .css('bottom',0);
	
		var nodeQueue = [];
		var fatherDiv = $("<div class='rows'></div>");
		fatherDiv.css('position','absolute')
                   .css('height','100%')
                   .css('width','100%')
//					console.log(arr)
		var position = getGridDetails(arr);
		
		for (var i=0;i<arr.length;i++) {
			var num = arr.length;
			var outObj={
				box:fatherDiv,
				nodeOne:arr[i],
				num:num,
				fatherType:arr[i].type,
				width:position[i].width,
				height:position[i].height,
				left:position[i].left,
				top:position[i].top,
			}
			nodeQueue.push(outObj)
		}
		
		while (nodeQueue.length!=0){
//			当前操作的一组obj
			var nodeObj =nodeQueue.shift();
			
			var nodeOne = nodeObj.nodeOne;
//			console.log(nodeObj)
			if (nodeOne.type!='vertex') {
				var son =nodeOne.son;
				
				if (nodeOne.type=='columns') {//横向布局时考虑height
					var $columnsDiv= $("<div class='columns'></div>");
					
					$columnsDiv.css('position','absolute')
			                    .css('height',nodeObj.height+'%')
			                    .css('width',nodeObj.width+'%')
			                    .css('top',nodeObj.top+'%')
			                    .css('left',nodeObj.left+'%')
				
				}else if(nodeOne.type=='rows'){
					var $columnsDiv= $("<div class='rows'></div>");
					$columnsDiv.css('position','absolute')
			                    .css('height',nodeObj.height+'%')
			                    .css('width',nodeObj.width+'%')
			                    .css('top',nodeObj.top+'%')
			                    .css('left',nodeObj.left+'%')
				}
				
				//getGridDetails函数放入的是数组,所以不用定义fatherType,当前对象的type指向的就是下一级元素的父类type，如果nodeOne的type为vertex，不会调用该事件
				var position = getGridDetails(son,nodeOne.type);
				for (var i=0;i<son.length;i++) {
//					console.log(position.length)

					var sonObj={
						box:$columnsDiv,
						nodeOne:son[i],
						num:son.length,
						fatherType:nodeOne.type,
						width:position[i].width,
						height:position[i].height,
						left:position[i].left,
						top:position[i].top,
					}
					nodeQueue.push(sonObj)
				}
				nodeObj.box.append($columnsDiv);
			}else if(nodeOne.type=='vertex') {
//				console.log(nodeOne)
				var $sonDiv= $("<div class='item'></div>");
				var $item_contentDiv = $("<div class='item_content'><div class='vignette'></div></div>");
				
				$sonDiv.append($item_contentDiv);
				nodeObj.box.append($sonDiv);
				
				var fatherType = nodeObj.fatherType;
					
				var w = nodeObj.width;
				var h = nodeObj.height;
				var l = nodeObj.left;
				var t = nodeObj.top;
				
				$item_contentDiv.css('position','absolute')
			                    .css('left',spacing+'px')
			                    .css('top',spacing+'px')
			                    .css('right',spacing+'px')
			                    .css('overflow','hidden')
			                    .css('bottom',spacing+'px');
			                    
			    $sonDiv.css('position','absolute')
	                    .css('width',w+'%')
	                    .css('height',h+'%')
	                    .css('left',l+'%')
	                    .css('top',t+'%');
			}

		}
		
		$innerDiv.append(fatherDiv)
		$('.page_content').append($girdDiv)
		$girdDiv.append($innerDiv)
	}

//	将数据填入网格
	var itemArr = $('.gridinner .item');//网格item结构的数组
	var elementArr = obj.rawData;
	for (var i=0;i<elementArr.length;i++) {
		if (elementArr[i].imageId!=undefined) {//图片素材
			
			var imgIndex = elementArr[i].index;
			var imageId = elementArr[i].imageId;
			console.log(url)
			var $zoomimg = $('<div class="zoomimg placeholder"><img src="'+imgur+imageId+'" alt="" /></div>');
			var positionObj = elementArr[i].imageClip;
			$zoomimg.css({
				'position':'absolute',
                'left':positionObj.left + 'px',
                'top':positionObj.top + 'px',
                'width':positionObj.width + 'px',
                'height':positionObj.height + 'px',
			})
			
			var $contentDiv = $(itemArr[imgIndex]).find('.item_content');
            $contentDiv.attr('elementType','img');
            $contentDiv.append($zoomimg);
            
		}else if(elementArr[i].backgroundColor!=undefined){//背景素材
			
			var bgcolor = elementArr[i].backgroundColor;
       		var $bgDiv = $("<div class='backgroundColor placeholder'></div>");
       		var bgIndex = elementArr[i].index;
            $bgDiv.css({
            	'position':'absolute',
                'background-color': bgcolor,
                'left':0,
                'top':0,
                'width':'100%',
                'height':'100%'
            })
            
            var $contentDiv = $(itemArr[bgIndex]).find('.item_content');
            $contentDiv.attr('elementType','bgclolr');
            $contentDiv.append($bgDiv);
            
		}
	}
	
//	没有网格的元素
	for (var i=0;i<itemArr.length;i++) {
		if (i!=imgIndex&&i!=bgIndex) {
			console.log(11111)
			var $noEleDiv = $("<div class='backgroundColor placeholder'></div>");
			var noEleIndex = i;
			$noEleDiv.css({
			    'left': 0,
			    'top': 0,
			    'width': '100%',
			    'height': '100%',
			    'background-image': 'url(https://static.canva.com/static/images/placeholder.jpg)',
			    'background-size': 'auto 100%',
			    'background-position': '45% 50%',
			    'background-repeat': 'repeat-x',
			    'transition': 'opacity .2s linear',
			})
			var $contentDiv = $(itemArr[noEleIndex]).find('.item_content');
            $contentDiv.attr('elementType','noElement');
            $contentDiv.append($noEleDiv);
		}
	}

}


function getGridDetails (arr,type) {
	
	var arr=arr;
	var fatherType = type;
	
	var position =[];
	var sumH = 0;
	var sumW = 0;
	
	if (arr[0].height==undefined&&arr[0].width==undefined) {
//	console.log(fatherType)
		
		if (fatherType==undefined) {
			var type = arr[0].type;
		}else{
			if(fatherType=='columns'){
				var type = 'rows';
			}else if(fatherType=='rows'){
				var type = 'columns';
			}
		}
		
//	console.log(1)

		if (type=='columns') {
			
			var h = 100/arr.length;
			for (var i=0;i<arr.length;i++) {
				var obj;
				if (i == arr.length - 1) {
					obj ={
						height:100 - sumH,
						top:sumH,
						width:100,
						left:0
					}
				} else {
					
					sumH += h;
					obj ={
						height:h,
						top:sumH-h,
						width:100,
						left:0
					}
				}

				position.push(obj)
			}
			
		} else if(type=='rows'){
			
			var w = 100/arr.length;
			for (var i=0;i<arr.length;i++) {
				var obj;
				if (i == arr.length - 1) {
					obj ={
						width:100 - sumW,
						left:sumW,
						top:0,
						height:100
					}
				} else {
					sumW += w;
					obj ={
						width:w,
						left:sumW-w,
						top:0,
						height:100
					}
				}

				position.push(obj)
			}
			
		}
		
	}else{
		if (fatherType==undefined) {
			var type = arr[0].type;
		}else{
			if(fatherType=='columns'){
				var type = 'rows';
			}else if(fatherType=='rows'){
				var type = 'columns';
			}
		}


//		console.log(2)
//		console.log(type)
		if (type=='columns'){
			
			for (var i=0;i<arr.length;i++) {
				var obj;
				if (i == arr.length - 1) {
					obj ={
						height:100 - sumH,
						top:sumH,
						width:100,
						left:0
					}
				} else {
					sumH += arr[i].height;
//					console.log(sumH)
					obj ={
						height:arr[i].height,
						top:sumH-arr[i].height,
						width:100,
						left:0
					}
				}

				position.push(obj)
			}
			
		}else if(type=='rows'){
			
			for (var i=0;i<arr.length;i++) {
				var obj;
				if (i == arr.length - 1) {
					obj ={
						width:100 - sumW,
						left:sumW,
						top:0,
						height:100
					}
				} else {
					sumW += arr[i].width;
					obj ={
						width:arr[i].width,
						left:sumW-arr[i].width,
						top:0,
						height:100
					}
				}

				position.push(obj)
			}
			
		}
		
	}
	return position;
}
			
