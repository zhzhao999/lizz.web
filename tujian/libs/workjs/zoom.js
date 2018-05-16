//  定义缩放函数所需默认变量
    var p = {
      x: 0,
      y: 0,
      height: 0,
      width: 0,
      rotate: 0
    };
    var box, draggableHandler, rotateHandler, resizeHandlers;
	var zoomBoxoldw;
//  init();
//初始化外部素材的缩放
    function init() {
    	p = {
	        x: parseInt($(clickThis).css('left')),
	        y: parseInt($(clickThis).css('top')),
	        height: parseInt($(clickThis).css('height')),
	        width: parseInt($(clickThis).css('width')),
	        rotate: getmatrix($(clickThis).css('transform'))
	    };
        box = document.querySelector('.zoomImgbox');
        rotateHandler = document.querySelector('.rotatebox');
//      draggable = document.querySelector('.draggable');//拖拽对象
        resizeHandlers = Array.prototype.slice.call(document.querySelectorAll('.zoomImgbox span'), 0);
//      draw();
        setCursorStyle(0);
//      bindMoveEvents(draggable);//拖拽事件
//      bindRotateEvents(rotateHandler, box);
        resizeHandlers.map(function(handler) {
            bindResizeEvents_Img(handler);
        });
    }
    
//	初始化裁剪时img的缩放
    function initImg() {
    	p = {
	        x: parseInt($('.uncropbox').css('left')),
	        y: parseInt($('.uncropbox').css('top')),
	        height: parseInt($('.uncropbox').css('height')),
	        width: parseInt($('.uncropbox').css('width')),
	        rotate: getmatrix($('.uncropbox').css('transform'))
	    };
        box = document.querySelector('.uncropbox');
        resizeHandlers = Array.prototype.slice.call(document.querySelectorAll('.uncropbox span'), 0);
        setCursorStyle(0);
        resizeHandlers.map(function(handler) {
            bindResizeEvents_Cut(handler);
        });
    }
    
//	初始化外部网格元素的缩放
    function initGrid() {
    	p = {
	        x: parseInt($(clickgridThis).css('left')),
	        y: parseInt($(clickgridThis).css('top')),
	        height: parseInt($(clickgridThis).css('height')),
	        width: parseInt($(clickgridThis).css('width')),
	        rotate: getmatrix($(clickgridThis).css('transform'))
	    };
        box = document.querySelector('.zoomImgbox');
        resizeHandlers = Array.prototype.slice.call(document.querySelectorAll('.zoomImgbox span'), 0);
        setCursorStyle(0);
        resizeHandlers.map(function(handler) {
            bindResizeEvents_Grid(handler);
        });
    }
    
    

    function bindRotateEvents(node, box) {
      node.onmousedown = function() {
        // 旋转开始
        var event = window.event,
            point = getConterPoint(box),
            prevAngle = Math.atan2(event.pageY - point.y, event.pageX - point.x) - p.rotate * Math.PI / 180;
        document.onmousemove = function() {
          // 旋转
          var event = window.event,
              angle = Math.atan2(event.pageY - point.y, event.pageX - point.x);
          p.rotate = Math.floor((angle - prevAngle) * 180 / Math.PI);
          draw();
        }
        document.onmouseup = function() {
          // 旋转结束
          document.onmousemove = null;
          document.onmouseup = null;
          setCursorStyle(p.rotate);
        }
      }
      node.ondragstart = function(event) {
        event.preventDefault();
        return false;
      }
    }
//外部IMG的缩放事件
    function bindResizeEvents_Img(node) {
        node.onmousedown = function() {
        	p = {
		        x: parseInt($(clickThis).css('left')),
		        y: parseInt($(clickThis).css('top')),
		        height: parseInt($(clickThis).css('height')),
		        width: parseInt($(clickThis).css('width')),
		        rotate: getmatrix($(clickThis).css('transform'))
	    	};
        	var s = {
	     	    w0 : parseInt($(clickThis).find('.zoomimg').css('width')),
	   		 	h0 : parseInt($(clickThis).find('.zoomimg').css('height')),
		   		l0 : parseInt($(clickThis).find('.zoomimg').css('left')),
	    		t0 : parseInt($(clickThis).find('.zoomimg').css('top')),
	        	zoomBoxoldw : parseInt($(clickThis).css('width')),
        	}
          // 缩放开始
          var event = window.event;
          event.preventDefault();
          var { x, y, width, height, rotate } = p;
//        var ex = event.pageX;
//        var ey = event.pageY;
		  var ex = event.pageX - parseInt($('.page_content').css('left')) - parseInt($('.sidebarTab').css('width'));
          var ey = event.pageY - parseInt($('.page_content').css('top'))-parseInt($('.page_content').css('margin-top')) - parseInt($('.header').css('height'));
          // 计算初始状态旋转后的rect
          var transformedRect = transform({
            x,
            y,
            width,
            height
          }, rotate);
          
          // 取得旋转后的8点坐标
          var { point } = transformedRect;

          // 获取当前点和对角线点
          var pointAndOpposite = getPointAndOpposite(point, ex, ey);
//		console.log(pointAndOpposite)
          var { opposite } = pointAndOpposite;
//        console.log(pointAndOpposite)

          // 对角线点的索引即为缩放基点索引
          var baseIndex = opposite.index;

          var oppositeX = opposite.point.x;
          var oppositeY = opposite.point.y;

          // 鼠标释放点距离当前点对角线点的偏移量
          var offsetWidth = Math.abs(ex - oppositeX);
          var offsetHeight = Math.abs(ey - oppositeY);

          // 记录最原始的状态
          var oPoint = {
            x,
            y,
            width,
            height,
            rotate
          };

          document.onmousemove = function() {
            var event = window.event;

            var nex = event.pageX - parseInt($('.page_content').css('left')) - parseInt($('.sidebarTab').css('width'));
            var ney = event.pageY - parseInt($('.page_content').css('top'))-parseInt($('.page_content').css('margin-top')) - parseInt($('.header').css('height'));

            var scale = {
              x: 1,
              y: 1
            };
            var realScale = 1;

            // 判断是根据x方向的偏移量来计算缩放比还是y方向的来计算
            if (offsetWidth > offsetHeight) {
              realScale = Math.abs(nex - oppositeX) / offsetWidth;
            } else {
              realScale = Math.abs(ney - oppositeY) / offsetHeight;
            }

            if ([0, 2, 4, 6].indexOf(baseIndex)>=0) {
              scale.x = scale.y = realScale;
            } else if([1, 5].indexOf(baseIndex)>=0) {
              scale.y = realScale;
            } else if([3, 7].indexOf(baseIndex)>=0) {
              scale.x = realScale;
            }

            var newRect = getNewRect(oPoint, scale, transformedRect, baseIndex);
            p.x = newRect.x;
            p.y = newRect.y;
            p.width = newRect.width;
            p.height = newRect.height;
            draw(s);
          }
        document.onmouseup = function() {
          document.onmousemove = null;
          document.onmouseup = null;
            $.dataSync('cancle','zoom拉伸');
        }
        event.preventDefault();
		event.stopPropagation();
      }
    }

    /**
     * 取得rect中心点
     * @param  {[type]} box [description]
     */
    function getConterPoint(box) {
      return {
        x: box.offsetLeft + box.offsetWidth / 2,
        y: box.offsetTop + box.offsetHeight / 2
      };
    }

    /**
     * 取得鼠标释放点在rect8点坐标中的对应点及其对角线点
     * @param  {[type]} point [description]
     * @param  {[type]} ex    [description]
     * @param  {[type]} ey    [description]
     */
    function getPointAndOpposite(point, ex, ey) {
      let oppositePoint = {};
      let currentPoint = {};

      let minDelta = 1000;
      let currentIndex = 0;
      let oppositeIndex = 0;
		console.log(point)
      point.forEach((p, index) => {
        const delta = Math.sqrt(Math.pow(p.x-ex, 2) + Math.pow(p.y-ey, 2))
        if (delta < minDelta) {
          currentPoint = p;
          currentIndex = index;
          minDelta = delta;
          // 对角线点index相差4
          let offset = 4;
          let oIndex = index - offset;
          if (oIndex < 0) {
            oIndex = index + offset;
          }
          // 取对角线点坐标
          oppositePoint = point.slice(oIndex, oIndex + 1)[0];
          oppositeIndex = oIndex;
        }
      });

      return {
        current: {
          index: currentIndex,
          point: currentPoint
        },
        opposite: {
          index: oppositeIndex,
          point: oppositePoint
        }
      };
    }

    /**
     * 根据缩放基点和缩放比例取得新的rect
     * @param  {[type]} oPoint               [description]
     * @param  {[type]} scale            [description]
     * @param  {[type]} oTransformedRect [description]
     * @param  {[type]} baseIndex        [description]
     * @return {[type]}                  [description]
     */
    function getNewRect(oPoint, scale, oTransformedRect, baseIndex) {
      var scaledRect = getScaledRect({
        x: oPoint.x,
        y: oPoint.y,
        width: oPoint.width,
        height: oPoint.height,
        scale: scale
      });
      var transformedRotateRect = transform_Grid(scaledRect, oPoint.rotate);
      // 计算到平移后的新坐标
      var translatedX = oTransformedRect.point[baseIndex].x - transformedRotateRect.point[baseIndex].x + transformedRotateRect.left;
      var translatedY = oTransformedRect.point[baseIndex].y - transformedRotateRect.point[baseIndex].y + transformedRotateRect.top;

      // 计算平移后元素左上角的坐标
      var newX = translatedX + transformedRotateRect.width / 2 - scaledRect.width / 2;
      var newY = translatedY + transformedRotateRect.height / 2 - scaledRect.height / 2;

      // 缩放后元素的高宽
      var newWidth = scaledRect.width;
      var newHeight = scaledRect.height;

      return {
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight
      };
    }

    function bindMoveEvents(box) {
      box.onmousedown = function() {
        var event = window.event,
            deltaX = event.pageX - p.x,
            deltaY = event.pageY - p.y;
        document.onmousemove = function() {
          var event = window.event;
          p.x = event.pageX - deltaX;
          p.y = event.pageY - deltaY;
          draw();
        }
        document.onmouseup = function() {
          document.onmousemove = null;
          document.onmouseup = null;
        }
      }
      box.ondragstart = function(event) {
        event.preventDefault();
        return false;
      }
    }

    /**
     * 重绘视图
     * @return {[type]} [description]
     */
    function draw(s) {
        css(box, {
        	left: p.x + parseInt($('.page_content').css('left'))+'px',
        	top: p.y + parseInt($('.page_content').css('top'))+parseInt($('.page_content').css('margin-top'))+'px',
       		width: p.width + 'px',
        	height: p.height + 'px',
        	transform: 'rotate(' + p.rotate + 'deg)'
        });
//      console.log(s)
    	css(clickThis, {
	        left: p.x + 'px',
	        top: p.y + 'px',
	        width: p.width + 'px',
	        height: p.height + 'px',
	        transform: 'rotate(' + p.rotate + 'deg)'
        });
     	if($(clickThis).find('.img')[0]!=undefined&&s!=undefined){//背景类型的图片没有子元素img，不用进行缩放
     		var w0 = s.w0;
   		 	var h0 = s.h0;
	   		var l0 = s.l0;
    		var t0 = s.t0;
    		var sle = p.width/s.zoomBoxoldw;
//  		console.log(l0*sle)
	        $(clickThis).find('.zoomimg')[0].style.width = w0*sle + 'px';
	        $(clickThis).find('.zoomimg')[0].style.height = h0*sle + 'px';
	        $(clickThis).find('.zoomimg')[0].style.left = l0*sle + 'px';
	        $(clickThis).find('.zoomimg')[0].style.top = t0*sle + 'px';
        }
     	if($(clickThis).attr('elementtype')=='svg'){//svg比例误差
     		var svgH = $(clickThis).find('svg').css('height');
     		$(clickThis).css('height',svgH);
     		$('.zoomImgbox').css('height',svgH);
     	}
    }

    function setCursorStyle(degree) {
      var topRight = document.querySelector('.tr'),
	      bottomRight = document.querySelector('.br'),
	      bottomLeft = document.querySelector('.bl'),
	      topLeft = document.querySelector('.tl'),
//        top = document.querySelector('.t'),
//        right = document.querySelector('.r'),
//        bottom = document.querySelector('.b'),
//        left = document.querySelector('.l'),
          cursorStyle = getNewCursorArray(degree);
      css(topRight, { 'cursor': cursorStyle[1] });
      css(bottomRight, { 'cursor': cursorStyle[3] });
      css(bottomLeft, { 'cursor': cursorStyle[5] });
      css(topLeft, { 'cursor': cursorStyle[7] });
//    css(top, { 'cursor': cursorStyle[0] });
//    css(right, { 'cursor': cursorStyle[2] });
//    css(bottom, { 'cursor': cursorStyle[4] });
//    css(left, { 'cursor': cursorStyle[6] });
    }

    /**
     * 获取点的鼠标手势
     * @param  {[type]} degree [description]
     * @return {[type]}        [description]
     */
    function getNewCursorArray(degree) {
      const cursorStyleArray = ['ns-resize', 'nesw-resize', 'ew-resize', 'nwse-resize', 'ns-resize', 'nesw-resize', 'ew-resize', 'nwse-resize'];

      const ARR_LENGTH = 8;
      const STEP = 45;

      let startIndex = 0;

      if (degree) {
        startIndex = Math.floor(degree / STEP);
        if (degree % STEP > (STEP / 2)) {
          startIndex += 1;
        }
      }

      if (startIndex > 1) {
        const len = ARR_LENGTH - startIndex;
        return (cursorStyleArray.slice(startIndex, startIndex + len))
                  .concat(cursorStyleArray.slice(0, startIndex));
      }

      return cursorStyleArray;
    }

    function css(node, ops) {
      for (var index in ops) {
        node['style'][index] = ops[index];
      }
    }

//裁剪时IMG的缩放事件
    function bindResizeEvents_Cut(node) {
        node.onmousedown = function() {
        	p = {
		        x: parseInt($('.uncropbox').css('left')),
		        y: parseInt($('.uncropbox').css('top')),
		        height: parseInt($('.uncropbox').css('height')),
		        width: parseInt($('.uncropbox').css('width')),
		        rotate: getmatrix($('.uncropbox').css('transform'))
	   	 	};
//      	锁边所需变量
        	var s = {
	     	    w0 : parseInt($('.uncropbox').css('width')),
	   		 	h0 : parseInt($('.uncropbox').css('height')),
		   		l0 : parseInt($('.uncropbox').css('left')),
	    		t0 : parseInt($('.uncropbox').css('top')),
        	}
        	var viewW0 = parseInt($('.viewPort').css('width'));
			var cropW0 = parseInt($('.uncropbox').css('width'));
			var viewH0 = parseInt($('.viewPort').css('height'));
			var cropH0 = parseInt($('.uncropbox').css('height'));
			var viewX0 = parseInt($('.viewPort').css('left'));
			var viewY0 = parseInt($('.viewPort').css('top'));
			var cropX0 = parseInt($('.uncropbox').css('left'));
			var cropY0 = parseInt($('.uncropbox').css('top'));
        	
			var start={
				oppositeStartX : s.l0 + s.w0,
				oppositeStartY : s.t0 + s.h0,
				scale : s.w0/s.h0,
				x0 : parseInt($('.uncropbox').css('left')),
				y0 : parseInt($('.uncropbox').css('top')),
			}
        	
        	var lockRect={
        		width:0,
        		height:0,
        		x:0,
        		y:0
        	}
        	centerObj2={
        		x:viewX0+viewW0/2,
        		y:viewY0+viewH0/2
        	}
        	console.log(centerObj2)
        	console.log(viewX0+viewW0/2)
        	console.log(viewY0+viewH0/2)
        	newCenter = {
        		x:centerObj2.x-centerObj.x,
        		y:centerObj2.y-centerObj.y,
        	}
          // 缩放开始
          var event = window.event;
          event.preventDefault();
          var { x, y, width, height, rotate } = p;
//        var ex = event.pageX;
//        var ey = event.pageY;
		  var ex = event.pageX - parseInt($('.sidebarTab').css('width')) - parseInt($('.cropControls').css('left'));
          var ey = event.pageY - parseInt($('.header').css('height')) - parseInt($('.cropControls').css('top'));
//		      将旋转后的坐标转换为正常坐标系
console.log('转换前==='+ex)
console.log('转换前==='+ey)
          var n=newExEy(ex,ey);
          ex = n.x;
          ey = n.y;
 console.log('转换后==='+ex)
console.log('转换后==='+ey)         
          
//        var matrix =$(dblclickThis).css('transform');
//        var str = matrix.substring(7,matrix.length-1);
//		  var arr = str.split(','); 
//        var ex1 = ex*arr[0]+ey*arr[2];
//        var ey1 = ey*arr[0]-ex*arr[2];
//        console.log(ex)
          // 计算初始状态旋转后的rect
          var transformedRect = transform({
            x,
            y,
            width,
            height
          }, rotate);
			
          // 取得旋转后的8点坐标
          var { point } = transformedRect;
          // 获取当前点和对角线点
          var pointAndOpposite = getPointAndOpposite_Cut(point, ex, ey);
          console.log(pointAndOpposite)
		  var { opposite } = pointAndOpposite;

          // 对角线点的索引即为缩放基点索引
          var baseIndex = opposite.index;

          var oppositeX = opposite.point.x;
          var oppositeY = opposite.point.y;

          // 鼠标释放点距离当前点对角线点的偏移量
          var offsetWidth = Math.abs(ex - oppositeX);
          var offsetHeight = Math.abs(ey - oppositeY);

          // 记录最原始的状态
          var oPoint = {
            x,
            y,
            width,
            height,
            rotate
          };

          document.onmousemove = function() {
            var event = window.event;
			
            var nex = event.pageX - parseInt($('.sidebarTab').css('width')) - parseInt($('.cropControls').css('left'));
            var ney = event.pageY - parseInt($('.header').css('height')) - parseInt($('.cropControls').css('top'));
            
//      	锁边所需变量
        	var m = {
	     	    w0 : parseInt($('.uncropbox').css('width')),
	   		 	h0 : parseInt($('.uncropbox').css('height')),
		   		l0 : parseInt($('.uncropbox').css('left')),
	    		t0 : parseInt($('.uncropbox').css('top')),
        	}
			var move={
				oppositeStartX : m.l0 + m.w0,
				oppositeStartY : m.t0 + m.h0,
			}
//	          console.log(nex)
//	          console.log(ney)
//			将旋转后的坐标转换为正常坐标系
            var ne=newExEy(nex,ney);
	          nex = ne.x;
	          ney = ne.y;
//          var nex = event.pageX;
//          var ney = event.pageY;
            var scale = {
              x: 1,
              y: 1
            };
            var realScale = 1;

            // 判断是根据x方向的偏移量来计算缩放比还是y方向的来计算
            if (offsetWidth > offsetHeight) {
              realScale = Math.abs(nex - oppositeX) / offsetWidth;
            } else {
              realScale = Math.abs(ney - oppositeY) / offsetHeight;
            }

            if ([0, 2, 4, 6].indexOf(baseIndex)>=0) {
              scale.x = scale.y = realScale;
            } 
//          else if([1, 5].indexOf(baseIndex)>=0) {
//            scale.y = realScale;
//          } else if([3, 7].indexOf(baseIndex)>=0) {
//            scale.x = realScale;
//          }

            var newRect = getNewRect(oPoint, scale, transformedRect, baseIndex);
            
            p.x = newRect.x;
            p.y = newRect.y;
            p.width = newRect.width;
            p.height = newRect.height;
            
			//	限制裁剪时缩放区域（锁边功能）
			var viewW = parseInt($('.viewPort').css('width'));
			var cropW = parseInt($('.uncropbox').css('width'));
			var viewH = parseInt($('.viewPort').css('height'));
			var cropH = parseInt($('.uncropbox').css('height'));
			var viewX = parseInt($('.viewPort').css('left'));
			var viewY = parseInt($('.viewPort').css('top'));
			var cropX = parseInt($('.uncropbox').css('left'));
			var cropY = parseInt($('.uncropbox').css('top'));
			console.log('base==='+baseIndex)

			if(p.width>=lockRect.width&&p.height>=lockRect.height){
				
				switch (baseIndex){
					case 0:
						if (p.width<viewW0-p.x) {
							p.width=viewW0-start.x0;
							p.height=p.width/start.scale;
							lockRect={
								width:p.width,
								height:p.height,
								x:p.x,
								y:p.y
							}
						}else if(p.height<viewH0-p.y){
							p.height=viewH0-start.y0;
							p.width=p.height*start.scale;
							lockRect={
								width:p.width,
								height:p.height,
								x:p.x,
								y:p.y
							}
						}
						
						break;
					case 4:
						if (p.x>0) {
							p.width=start.oppositeStartX;
							p.height=p.width/start.scale;
							p.x=0;
							p.y=start.oppositeStartY-p.height;
							lockRect={
								width:p.width,
								height:p.height,
								x:p.x,
								y:p.y
							}
						}else if(p.y>0){
							p.height=start.oppositeStartY;
							p.width=p.height*start.scale;
							p.x=start.oppositeStartX-p.width;
							p.y=0;
							lockRect={
								width:p.width,
								height:p.height,
								x:p.x,
								y:p.y
							}
						}
						
						break;
					
					case 2:
						if (p.x>0) {
							p.width=start.oppositeStartX;
							p.height=p.width/start.scale;
							p.x=0;
							lockRect={
								width:p.width,
								height:p.height,
								x:p.x,
								y:p.y
							}
						}else if(p.height<viewH0-start.y0){
							p.height=viewH0-start.y0;
							p.width=p.height*start.scale;
							p.x=start.oppositeStartX-p.width;
							lockRect={
								width:p.width,
								height:p.height,
								x:p.x,
								y:p.y
							}
						}
						
						break;
					
					case 6:
						if (p.y>0) {
							p.height=start.oppositeStartY;
							p.width=p.height*start.scale;
							p.y=0;
							lockRect={
								width:p.width,
								height:p.height,
								x:p.x,
								y:p.y
							}
						}else if(p.width<viewW0-start.x0){
							p.width=viewW0-start.x0;
							p.height=p.width/start.scale;
							p.y=start.oppositeStartY-p.height;
							lockRect={
								width:p.width,
								height:p.height,
								x:p.x,
								y:p.y
							}
						}
						
						break;
					
					
					
					
					default:
						break;
				}
				
				
//				if (p.x>0) {
//					p.width=start.oppositeStartX;
//					p.height=p.width/start.scale;
//					if (baseIndex==2) {
//						p.x = 0;
//						p.y = start.y0;
//					}else if(baseIndex==4){
//						p.x = 0;
//						p.y = start.oppositeStartY-p.height;
//					}
//					lockRect={
//						width:p.width,
//						height:p.height,
//						x:p.x,
//						y:p.y
//					}
//				}else if(p.y>0){
//					p.height=start.oppositeStartY;
//					p.width=p.height*start.scale;
//					if (baseIndex==4) {
//						p.x=start.oppositeStartX-p.width;
//						p.y = 0;
//					} else if(baseIndex==6){
//						p.x=start.x0;
//						p.y = 0;
//					}
//					lockRect={
//						width:p.width,
//						height:p.height,
//						x:p.x,
//						y:p.y
//					}
//				}else if(p.width+p.x<viewW0){
//					p.width=viewW0-start.x0;
//					p.height=p.width/start.scale;
//					if (baseIndex==6) {
//						p.x=start.x0;
//						p.y = start.oppositeStartY-p.height;
//					} else if(baseIndex==0){
//						p.x=start.x0;
//						p.y = start.y0;
//					}
//					lockRect={
//						width:p.width,
//						height:p.height,
//						x:p.x,
//						y:p.y
//					}
//				}else if(p.height+p.y<viewH0){
//					p.height=viewH0-start.y0;
//					p.width=p.height*start.scale;
//					if (baseIndex==0) {
//						p.x=start.x0;
//						p.y = start.y0;
//					} else if(baseIndex==2){
//						p.x=start.oppositeStartX-p.width;
//						p.y=start.y0;
//					}
//					lockRect={
//						width:p.width,
//						height:p.height,
//						x:p.x,
//						y:p.y
//					}
//				}
				
			}else{
				p.x=lockRect.x;
				p.y=lockRect.y;
				p.width=lockRect.width;
				p.height=lockRect.height;
			}

            draw_Cut(s);
          }
        document.onmouseup = function() {
          document.onmousemove = null;
          document.onmouseup = null;
        }
        event.preventDefault();
		event.stopPropagation();
      }
    }
        /**
     * 重绘视图
     * @return {[type]} [description]
     */
    function draw_Cut(s) {
        css(box, {
	        left: p.x+'px',
	        top: p.y+'px',
	        width: p.width + 'px',
	        height: p.height + 'px',
        });
 		var w0 = s.w0;
	 	var h0 = s.h0;
	 	var l0 = s.l0;
	 	var t0 = s.t0;
		//同步裁剪部分数据
		cogradientImg();
//		console.log(p)
    }
    
    function getPointAndOpposite_Cut(point, ex, ey) {
      let oppositePoint = {};
      let currentPoint = {};

      let minDelta = 1000;
      let currentIndex = 0;
      let oppositeIndex = 0;
      
      point.forEach((p, index) => {
		
      	if (index==1||index==3||index==5||index==7) {
			return;
      	}
      	
        const delta = Math.sqrt(Math.pow(p.x-ex, 2) + Math.pow(p.y-ey, 2))
		
        if (delta < minDelta) {
          currentPoint = p;
          console.log(currentPoint)
          currentIndex = index;
          minDelta = delta;
          // 对角线点index相差4
          let offset = 4;
          let oIndex = index - offset;
          if (oIndex < 0) {
            oIndex = index + offset;
          }
          // 取对角线点坐标
          oppositePoint = point.slice(oIndex, oIndex + 1)[0];
          oppositeIndex = oIndex;
        }
      });

      return {
        current: {
          index: currentIndex,
          point: currentPoint
        },
        opposite: {
          index: oppositeIndex,
          point: oppositePoint
        }
      };
    }
    


function newExEy (x,y) {
	var matrix = $(clickThis).css('transform');
	var d = getmatrix(matrix);
	var str = matrix.substring(7,matrix.length-1);
	var arr = str.split(',');  
	var centerX = parseInt($('.viewPort').css('width'))/2;
	var centerY = parseInt($('.viewPort').css('height'))/2;	
	var ar = d * Math.PI / 180;
	newX = (x-centerX)*Math.cos(ar)+(y-centerY)*Math.sin(ar)+centerX;
	newY = (y-centerY)*Math.cos(ar)-(x-centerX)*Math.sin(ar)+centerY;
	return obj={
		x:newX,
		y:newY
	}
}
function newExEy2 (x,y) {
	var matrix = $(clickThis).css('transform');
	var d = getmatrix(matrix);
	var str = matrix.substring(7,matrix.length-1);
	var arr = str.split(',');  
	var centerX = parseInt($('.uncropbox').css('width'))/2;
	var centerY = parseInt($('.uncropbox').css('height'))/2;
	var ar = d * Math.PI / 180;
	newX = (x-centerX)*Math.cos(ar)+(y-centerY)*Math.sin(ar)+centerX;
	newY = (y-centerY)*Math.cos(ar)-(x-centerX)*Math.sin(ar)+centerY;
	return obj={
		x:newX,
		y:newY
	}
}
function newExEy_Grid (x,y) {
	var matrix = $(clickgridThis).css('transform');
	var d = getmatrix(matrix);
	var str = matrix.substring(7,matrix.length-1);
	var arr = str.split(',');  
	var centerX = parseInt($(clickgridThis).css('left'))+parseInt($(clickgridThis).css('width'))/2;
	var centerY = parseInt($(clickgridThis).css('top'))+parseInt($(clickgridThis).css('height'))/2;	
	var ar = d * Math.PI / 180;
	newX = (x-centerX)*Math.cos(ar)+(y-centerY)*Math.sin(ar)+centerX;
	newY = (y-centerY)*Math.cos(ar)-(x-centerX)*Math.sin(ar)+centerY;
	return obj={
		x:newX,
		y:newY
	}
}


//外部网格元素Grid的缩放事件
    function bindResizeEvents_Grid(node) {
        node.onmousedown = function(ev) {
        	var Se = ev || event;
        	p = {
		        x: parseInt($(clickgridThis).css('left')),
		        y: parseInt($(clickgridThis).css('top')),
		        height: parseInt($(clickgridThis).css('height')),
		        width: parseInt($(clickgridThis).css('width')),
		        rotate: getmatrix($(clickgridThis).css('transform'))
		    };
        	var s = {
	     	    w0 : parseInt($(clickgridThis).css('width')),
	   		 	h0 : parseInt($(clickgridThis).css('height')),
		   		l0 : parseInt($(clickgridThis).css('left')),
	    		t0 : parseInt($(clickgridThis).css('top')),
        	}
          // 缩放开始
          var event = window.event;
          event.preventDefault();
          var { x, y, width, height, rotate } = p;
//        var ex = event.pageX;
//        var ey = event.pageY;
		  var ex = event.pageX - parseInt($('.page_content').css('left')) - parseInt($('.sidebarTab').css('width'));
          var ey = event.pageY - parseInt($('.page_content').css('top'))-parseInt($('.page_content').css('margin-top')) - parseInt($('.header').css('height'));
          
//        var n=newExEy_Grid(ex,ey);
//        ex = n.x;
//        ey = n.y;
          
          // 计算初始状态旋转后的rect
          var transformedRect = transform_Grid({
            x,
            y,
            width,
            height
          }, rotate);
          
          // 取得旋转后的8点坐标
          var { point } = transformedRect;

          // 获取当前点和对角线点
          var pointAndOpposite = getPointAndOpposite(point, ex, ey);
		console.log(pointAndOpposite)
          var { opposite } = pointAndOpposite;
//        console.log(pointAndOpposite)

          // 对角线点的索引即为缩放基点索引
          var baseIndex = opposite.index;

          var oppositeX = opposite.point.x;
          var oppositeY = opposite.point.y;

          // 鼠标释放点距离当前点对角线点的偏移量
          var offsetWidth = Math.abs(ex - oppositeX);
          var offsetHeight = Math.abs(ey - oppositeY);
console.log(offsetWidth)
          // 记录最原始的状态
          var oPoint = {
            x,
            y,
            width,
            height,
            rotate
          };

          document.onmousemove = function(ev) {
          	var Me = ev || event;
            var event = window.event;

//			var nex = event.pageX;
//          var ney = event.pageY;
            var nex = event.pageX - parseInt($('.page_content').css('left')) - parseInt($('.sidebarTab').css('width'));
            var ney = event.pageY - parseInt($('.page_content').css('top'))-parseInt($('.page_content').css('margin-top')) - parseInt($('.header').css('height'));
            
//          var ne=newExEy_Grid(nex,ney);
//	        nex = ne.x;
//	        ney = ne.y;
	          
            var scale = {
              x: 1,
              y: 1
            };
            var realScale = 1;

            // 判断是根据x方向的偏移量来计算缩放比还是y方向的来计算
//          if (offsetWidth > offsetHeight) {
//            realScale = Math.abs(nex - oppositeX) / offsetWidth;
//          } else {
//            realScale = Math.abs(ney - oppositeY) / offsetHeight;
//          }
            realScaleX = Math.abs(nex - oppositeX) / offsetWidth;
            realScaleY = Math.abs(ney - oppositeY) / offsetHeight;
            
            if ([0, 2, 4, 6].indexOf(baseIndex)>=0) {
              scale.x = realScaleX;
              scale.y = realScaleY;
            } 
//          else if([1, 5].indexOf(baseIndex)>=0) {
//            scale.y = realScale;
//          } else if([3, 7].indexOf(baseIndex)>=0) {
//            scale.x = realScale;
//          }

			
            var newRect = getNewRect_Grid(oPoint, scale, transformedRect, baseIndex);
            p.x = newRect.x;
            p.y = newRect.y;
            p.width = newRect.width;
            p.height = newRect.height;
            
//			var disX = Me.pageX - Se.pageX, disY = Me.pageY - Se.pageY;
//          p.width = s.w0+disX;
//          p.height = s.h0+disY;
            draw_Grid();
          }
        document.onmouseup = function() {
          document.onmousemove = null;
          document.onmouseup = null;
        }
        event.preventDefault();
		event.stopPropagation();
      }
    }
    

    function draw_Grid() {
      css(box, {
        left: p.x + parseInt($('.page_content').css('left'))+'px',
        top: p.y + parseInt($('.page_content').css('top'))+parseInt($('.page_content').css('margin-top'))+'px',
        width: p.width + 'px',
        height: p.height + 'px',
        transform: 'rotate(' + p.rotate + 'deg)'
      });
//    console.log(s)
    css(clickThis, {
        left: p.x + 'px',
        top: p.y + 'px',
        width: p.width + 'px',
        height: p.height + 'px',
        transform: 'rotate(' + p.rotate + 'deg)'
      });
    }
    

    function getNewRect_Grid(oPoint, scale, oTransformedRect, baseIndex) {
      var scaledRect = getScaledRect({
        x: oPoint.x,
        y: oPoint.y,
        width: oPoint.width,
        height: oPoint.height,
        scale: scale
      });
      var transformedRotateRect = transform_Grid(scaledRect, oPoint.rotate);
      // 计算到平移后的新坐标
      var translatedX = oTransformedRect.point[baseIndex].x - transformedRotateRect.point[baseIndex].x + transformedRotateRect.left;
      var translatedY = oTransformedRect.point[baseIndex].y - transformedRotateRect.point[baseIndex].y + transformedRotateRect.top;

      // 计算平移后元素左上角的坐标
      var newX = translatedX + transformedRotateRect.width / 2 - scaledRect.width / 2;
      var newY = translatedY + transformedRotateRect.height / 2 - scaledRect.height / 2;

      // 缩放后元素的高宽
      var newWidth = scaledRect.width;
      var newHeight = scaledRect.height;

      return {
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight
      };
    }