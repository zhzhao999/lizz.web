
// 定义一个Rect
var p3 = {
    x: 0,
    y: 0,
    height: 0,
    width: 0,
    rotate: 0
};

var box, draggableHandler, rotateHandler, resizeHandlers;
function inittext() {
    p3 = {
        x: strTonumber($('.playTextBox').css('left')),
        y: strTonumber($('.playTextBox').css('top')),
        height: strTonumber($('.playTextBox').css('height')),
        width: strTonumber($('.playTextBox').css('width')),
        rotate: getmatrix($('.playTextBox').css('transform'))
    };
    //console.log(p3)
    box = document.querySelector('.playTextBox');
    resizeHandlers = Array.prototype.slice.call(document.querySelectorAll('.playTextBox span'), 0);
    setCursorStyle_Text(0);
    resizeHandlers.map(function(handler) {
        bindResizeEvents_Text(handler);
    });
}

function bindResizeEvents_Text(node) {
    node.onmousedown = function() {
	    p3 = {
	        x: strTonumber($('.playTextBox').css('left')),
	        y: strTonumber($('.playTextBox').css('top')),
	        height: strTonumber($('.playTextBox').css('height')),
	        width: strTonumber($('.playTextBox').css('width')),
	        rotate: getmatrix($('.playTextBox').css('transform'))
	    };
        // 缩放开始
        var event = window.event;
        event.preventDefault();
        $('.dragShow_wh').show();
        //隐藏ele
        $(clickTextThis).hide();
        var { x, y, width, height, rotate } = p3;
        var ex = event.pageX-parseFloat($('.sidebarTab').css('width'));
        var ey = event.pageY- parseFloat($('.header').css('height'));
        // 计算初始状态旋转后的rect
        var transformedRect = transformRidus({
            x,
            y,
            width,
            height
        }, rotate);

        // 取得旋转后的8点坐标
        var { point } = transformedRect;

        // 获取当前点和对角线点
        var pointAndOpposite = getPointAndOpposite_Text(point, ex, ey);
        var { opposite } = pointAndOpposite;
        var curr_ = null;
        //console.log('对角点x：'+opposite.point.x);
        //console.log('鼠标点击的点：'+ex);
        if($.firstOnkey == false){
            $.firstOnkey = true;
        }

        //console.log(curr_);
        // 对角线点的索引即为缩放基点索引
        var baseIndex = opposite.index;
        var oppositeX = opposite.point.x;
        var oppositeY = opposite.point.y;

        // 鼠标释放点距离当前点对角线点的偏移量
       /* var offsetWidth = Math.abs(ex - oppositeX);
        var offsetHeight = Math.abs(ey - oppositeY);
*/
        var middleX = x + width / 2;
        var middleY = y + height / 2;

        var orginEx = (ex - middleX) * Math.cos(rotate * Math.PI / 180) + (ey - middleY) * Math.sin(rotate * Math.PI / 180) + middleX;
        var orginOx = (oppositeX - middleX) * Math.cos(rotate * Math.PI / 180) + (oppositeY - middleY) * Math.sin(rotate * Math.PI / 180) + middleX;

        var offsetWidth = Math.abs(orginEx - orginOx);
        // 记录最原始的状态
        var oPoint = {
            x,
            y,
            width,
            height,
            rotate
        };
        if(orginEx < orginOx){
            //负的
            curr_ = 0;
        }else{
            curr_ = 1;
        }
        var lastScale = 1;
        var lockRect = {
            x:0,
            y:0,
            width:0,
            height:0
        }

        document.onmousemove = function() {
            var event = window.event;

            var nex = event.pageX  - parseFloat($('.sidebarTab').css('width'));
            var ney = event.pageY - parseFloat($('.header').css('height'));

            var scale = {
                x: 1,
                y: 1
            };
            var realScale = 1;
            //realScale =  Math.sqrt(Math.pow(nex - oppositeX, 2) + Math.pow(ney - oppositeY, 2)) / (2 * offsetOp);
            // 判断是根据x方向的偏移量来计算缩放比还是y方向的来计算

            var orginNex = (nex - middleX) * Math.cos(rotate * Math.PI / 180) + (ney - middleY) * Math.sin(rotate * Math.PI / 180) + middleX;
            realScale = Math.abs(orginNex - orginOx) / offsetWidth;
            var now_ = null;
            if((orginNex - orginOx)<0){
                //负号
                now_ = 0;
            }else{
                now_ = 1;
            }

            if ([0, 2, 4, 6].indexOf(baseIndex)>=0) {
                scale.x = realScale;
                scale.y = 1;
            } else if([1, 5].indexOf(baseIndex)>=0) {
                scale.y = 1;
            } else if([3, 7].indexOf(baseIndex)>=0) {
                scale.x = realScale;
            }
            if(curr_ != now_){
                //相反
                return false;
            }
            var newRect = getNewRect_Text(oPoint, scale, transformedRect, baseIndex);

            if(newRect.width>lockRect.width){
                p3.x = newRect.x;
                p3.y = newRect.y;
                p3.width = newRect.width;
                p3.height = newRect.height;
                if(p3.width<parseFloat($(clickTextThis).css('font-size'))){
                    p3.width=parseFloat($(clickTextThis).css('font-size'))+2;
                    lockRect.width = p3.width;
                    lockRect.height = p3.height;
                    lockRect.x = p3.x;
                    lockRect.y = p3.y;
                }

            }else{
                p3.x = lockRect.x;
                p3.y = lockRect.y;
                p3.width = lockRect.width;
                p3.height = lockRect.height;
            }
            draw3();
            if(baseIndex == 0){
                //右拉
                $('.dragShow_wh').css('right', '-60px');
                $('.dragShow_wh').css('left', 'auto');
            }else{
                $('.dragShow_wh').css('left', '-60px');
                $('.dragShow_wh').css('right', 'auto');
            }

            //显示编辑层的宽高
            $('.dragShow_wh .dragShow_whtext').html(parseInt(p3.width) + ' x ' + parseInt(p3.height));
        }
        document.onmouseup = function() {
            $.dataSync('cancle','文字框拉伸');
            $('.dragShow_wh').css('right', 'auto');
            $('.dragShow_wh').css('left', 'auto');
            $('.dragShow_wh').hide();
            document.onmousemove = null;
            document.onmouseup = null;
        }
    }
}

/**
 * 取得rect中心点
 * @param  {[type]} box [description]
 */


/**
 * 取得鼠标释放点在rect8点坐标中的对应点及其对角线点
 * @param  {[type]} point [description]
 * @param  {[type]} ex    [description]
 * @param  {[type]} ey    [description]
 */
function getPointAndOpposite_Text(point, ex, ey) {
    let oppositePoint = {};
    let currentPoint = {};

    let minDelta = 1000;
    let currentIndex = 0;
    let oppositeIndex = 0;

    point.forEach((p3, index) => {
        const delta = Math.sqrt(Math.pow(p3.x-ex, 2) + Math.pow(p3.y-ey, 2))
       // console.log(delta)
    if (delta < minDelta) {
        currentPoint = p3;
        currentIndex = index;
        minDelta = delta;
        // 对角线点index相差4
        //let oIndex = null;
        if(index == 3){
            let oIndex = 0;
            // 取对角线点坐标
            oppositePoint = point.slice(oIndex, oIndex + 1)[0];
            oppositeIndex = oIndex;
        }else   if(index == 7){
            let oIndex = 2;
            // 取对角线点坐标
            oppositePoint = point.slice(oIndex, oIndex + 1)[0];
            oppositeIndex = oIndex;
        }
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
function getNewRect_Text(oPoint, scale, oTransformedRect, baseIndex) {
    var scaledRect = getScaledRect_Text({
        x: oPoint.x,
        y: oPoint.y,
        width: oPoint.width,
        height: oPoint.height,
        scale: scale
    });
    var transformedRotateRect = transformRidus(scaledRect, oPoint.rotate);
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

/**
 * 重绘视图
 * @return {[type]} [description]
 */
function draw3() {
    css(box, {
        left: p3.x + 'px',
        top: p3.y + 'px',
        width: p3.width + 'px',
        height: p3.height + 'px',
        transform: 'rotate(' + p3.rotate + 'deg)'
    });
    $('.TextInner').css({
        width: p3.width + 'px'
    });
    $('.editTextBox').css({
        left: p3.x + 'px',
        top: p3.y + 'px',
        width: p3.width + 'px',
        height: $('.TextInner').css('height'),
        transform: 'rotate(' + p3.rotate + 'deg)'
    });
    $(clickTextThis).css('left', p3.x-parseInt($('#page_content').css('left'))+'px')
            .css('top',p3.y-parseInt($('#page_content').css('top'))-parseInt($('#page_content').css('margin-top'))+'px')
            .css({
                 width: p3.width + 'px',
                height: $('.TextInner').css('height'),
                transform: 'rotate(' + p3.rotate + 'deg)'
            })
   
    $('.playTextBox').css('height',$('.TextInner').css('height'));
   /* console.log('p3高度：'+p3.height);
    console.log('textinner高度：'+$('.TextInner').css('height'));*/
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

function setCursorStyle_Text(degree) {
    var /*top = document.querySelector('.t'),
        topRight = document.querySelector('.tr'),*/
        right = document.querySelector('.r_'),
        /*bottomRight = document.querySelector('.br'),
        bottom = document.querySelector('.b'),
        bottomLeft = document.querySelector('.bl'),*/
        left = document.querySelector('.l_'),
        /*topLeft = document.querySelector('.tl'),*/
        cursorStyle = getNewCursorArray_Text(degree);
    // css(top, { 'cursor': cursorStyle[0] });
    // css(topRight, { 'cursor': cursorStyle[1] });
    css(right, { 'cursor': cursorStyle[2] });
    // css(bottomRight, { 'cursor': cursorStyle[3] });
    // css(bottom, { 'cursor': cursorStyle[4] });
    // css(bottomLeft, { 'cursor': cursorStyle[5] });
    css(left, { 'cursor': cursorStyle[6] });
    // css(topLeft, { 'cursor': cursorStyle[7] });
}

/**
 * 获取点的鼠标手势
 * @param  {[type]} degree [description]
 * @return {[type]}        [description]
 */
function getNewCursorArray_Text(degree) {
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

function transform3(options, angle) {
    var x = options.x;
    var y = options.y;
    var width = options.width;
    var height = options.height;

    var r = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / 2;
    var a = Math.round(Math.atan(height / width) * 180 / Math.PI);
    var tlbra = 180 - angle - a;
    var trbla = a - angle;
    var ta = 90 - angle;
    var ra = angle;

    var halfWidth = width / 2;
    var halfHeight = height / 2;

    var middleX = x + halfWidth;
    var middleY = y + halfHeight;

    var topLeft = {
        x: middleX + r * Math.cos(tlbra * Math.PI / 180),
        y: middleY - r * Math.sin(tlbra * Math.PI / 180)
    };
    var top = {
        x: middleX + halfHeight * Math.cos(ta * Math.PI / 180),
        y: middleY - halfHeight * Math.sin(ta * Math.PI / 180),
    };
    var topRight = {
        x: middleX + r * Math.cos(trbla * Math.PI / 180),
        y: middleY - r * Math.sin(trbla * Math.PI / 180)
    };
    var right = {
        x: middleX + halfWidth * Math.cos(ra * Math.PI / 180),
        y: middleY + halfWidth * Math.sin(ra * Math.PI / 180),
    };
    var bottomRight = {
        x: middleX - r * Math.cos(tlbra * Math.PI / 180),
        y: middleY + r * Math.sin(tlbra * Math.PI / 180)
    };
    var bottom = {
        x: middleX - halfHeight * Math.sin(ra * Math.PI / 180),
        y: middleY + halfHeight * Math.cos(ra * Math.PI / 180),
    }
    var bottomLeft = {
        x: middleX - r * Math.cos(trbla * Math.PI / 180),
        y: middleY + r * Math.sin(trbla * Math.PI / 180)
    };
    var left = {
        x: middleX - halfWidth * Math.cos(ra * Math.PI / 180),
        y: middleY - halfWidth * Math.sin(ra * Math.PI / 180),
    }
    var minX = Math.min(topLeft.x, topRight.x, bottomRight.x, bottomLeft.x);
    var maxX = Math.max(topLeft.x, topRight.x, bottomRight.x, bottomLeft.x);
    var minY = Math.min(topLeft.y, topRight.y, bottomRight.y, bottomLeft.y);
    var maxY = Math.max(topLeft.y, topRight.y, bottomRight.y, bottomLeft.y);
    return {
        point: [topLeft, top, topRight, right, bottomRight, bottom, bottomLeft, left],
        width: maxX - minX,
        height: maxY - minY,
        left: minX,
        right: maxX,
        top: minY,
        bottom: maxY
    }
}
function transformRidus(options, angle) {
    var x = options.x;
    var y = options.y;
    var width = options.width;
    var height = options.height;

    angle = Math.PI / 180 * angle;

    var r = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / 2;
    var a = Math.atan(height / width);
    var tlbra = Math.PI - angle - a;
    var trbla = a - angle;
    var ta = Math.PI / 2 - angle;
    var ra = angle;

    var halfWidth = width / 2;
    var halfHeight = height / 2;

    var middleX = x + halfWidth;
    var middleY = y + halfHeight;
    var topLeft = {
        x: middleX + r * Math.cos(tlbra),
        y: middleY - r * Math.sin(tlbra)
    };
    var top = {
        x: middleX + halfHeight * Math.cos(ta),
        y: middleY - halfHeight * Math.sin(ta),
    };
    var topRight = {
        x: middleX + r * Math.cos(trbla),
        y: middleY - r * Math.sin(trbla)
    };
    var right = {
        x: middleX + halfWidth * Math.cos(ra),
        y: middleY + halfWidth * Math.sin(ra),
    };
    var bottomRight = {
        x: middleX - r * Math.cos(tlbra),
        y: middleY + r * Math.sin(tlbra)
    };
    var bottom = {
        x: middleX - halfHeight * Math.sin(ra),
        y: middleY + halfHeight * Math.cos(ra),
    }
    var bottomLeft = {
        x: middleX - r * Math.cos(trbla),
        y: middleY + r * Math.sin(trbla)
    };
    var left = {
        x: middleX - halfWidth * Math.cos(ra),
        y: middleY - halfWidth * Math.sin(ra),
    }
    var minX = Math.min(topLeft.x, topRight.x, bottomRight.x, bottomLeft.x);
    var maxX = Math.max(topLeft.x, topRight.x, bottomRight.x, bottomLeft.x);
    var minY = Math.min(topLeft.y, topRight.y, bottomRight.y, bottomLeft.y);
    var maxY = Math.max(topLeft.y, topRight.y, bottomRight.y, bottomLeft.y);
    return {
        point: [topLeft, top, topRight, right, bottomRight, bottom, bottomLeft, left],
        width: maxX - minX,
        height: maxY - minY,
        left: minX,
        right: maxX,
        top: minY,
        bottom: maxY
    }
}


function getScaledRect_Text(params, baseIndex) {
    var { x, y, width, height, scale } = params;
    var offset = {
        x: 0,
        y: 0
    };
    var deltaXScale = scale.x - 1;
    var deltaYScale = scale.y - 1;

    var deltaWidth = width * deltaXScale;
    var deltaHeight = height * deltaYScale;
    var newWidth = width + deltaWidth;
    var newHeight = height + deltaHeight;
    var newX = x - deltaWidth / 2;
    var newY = y - deltaHeight / 2;
    if (baseIndex) {
        var points = [{x, y}, {x: x+ width, y}, {x: x + width, y: y+ height}, {x, y: y+ height}];
        var newPoints = [{x: newX, y: newY}, {x: newX+ newWidth, y: newY}, {x: newX + newWidth, y: newY+ newHeight}, {x: newX, y: newY+ newHeight}];
        offset.x = points[baseIndex].x - newPoints[baseIndex].x;
        offset.y = points[baseIndex].y - newPoints[baseIndex].y;
    }
    return {
        x: newX + offset.x,
        y: newY + offset.y,
        width: newWidth,
        height: strTonumber($('.TextInner').css('height')) //拿到的是上一次的高度parseFloat($('.textPillBox .textPillInner').css('height'))
    }
}
function currBoxHeight(dom,newWidth){
    var letter_ = dom.css('letter-spacing');
    var lineheight_ = dom.css('line-height');
    var fontsize_ = dom.css('font-size');
    var width_ = newWidth;
    var html_ = dom.html();

    var sizePx = parseFloat(fontsize_) + parseFloat(letter_);//每个字占得px
    var lineN = parseInt((width_-parseInt(letter_))/sizePx);//一行可以放多少字
    if(lineN <= 0){
        lineN = 1;
    }
    var fontN = html_.length;//一共多少字
    var lineH = Math.ceil(fontN/lineN);//行数

    boxH = lineH*parseFloat(lineheight_);//容器高度
    //console.log('容器宽度：'+width_+'---------每个字占得px:'+sizePx+'-------一行可以放多少字:'+lineN+'--------一共多少字:'+fontN+'------容器高度:'+lineH);
    return boxH;
}
//重置初始状态
var deltaH = null;
var reDraw = function(options,angle,changeH){
    deltaH = changeH;
    // 计算初始状态旋转后的rect
    var transformedRect = transformRidus(options, angle);

    // 旋转后的点
    var point = transformedRect;
    // 记录最原始的状态
    var oPoint = options;

    var scale = {};
    scale.x = 1;
    scale.y = 1;

    //平移后元素左上角的坐标
    var newRect = getNewRect_ChangeH(oPoint, scale, transformedRect, 0,angle);
    p3.x = newRect.x;
    p3.y = newRect.y;
    p3.width = newRect.width;
    p3.height = newRect.height;
    css(box, {
        left: p3.x + 'px',
        top: p3.y + 'px',
        width: p3.width + 'px',
        height: p3.height + 'px',
        transform: 'rotate(' + p3.rotate + 'deg)'
    });
    $('.TextInner').css({
        width: p3.width + 'px'
    })
    $('.editTextBox').css({
        left: p3.x + 'px',
        top: p3.y + 'px',
        width: p3.width + 'px',
        height: p3.height + 'px',
        transform: 'rotate(' + p3.rotate + 'deg)'
    })
}
function getNewRect_ChangeH(oPoint, scale, oTransformedRect, baseIndex,angle) {
    var scaledRect = getScaledRect_ChangeH({
        x: oPoint.x,
        y: oPoint.y,
        width: oPoint.width,
        height: oPoint.height,
        scale: scale
    });
    var transformedRotateRect = transformRidus(scaledRect,angle);
    // 计算到平移后的新坐标
    var translatedX = oTransformedRect.point[baseIndex].x - transformedRotateRect.point[baseIndex].x + transformedRotateRect.left;
    var translatedY = oTransformedRect.point[baseIndex].y - transformedRotateRect.point[baseIndex].y + transformedRotateRect.top;

    //console.log('translatedX:'+translatedX+"translatedY:"+translatedY);
    // 计算平移后元素左上角的坐标
    var newX = translatedX + transformedRotateRect.width / 2 - scaledRect.width / 2;
    var newY = translatedY + transformedRotateRect.height / 2 - scaledRect.height / 2;
   // console.log('translatedX:'+translatedX+"translatedY:"+translatedY);
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
function getScaledRect_ChangeH(params, baseIndex) {
    var { x, y, width, height, scale } = params;

    var offset = {
        x: 0,
        y: 0
    };
    var deltaXScale = scale.x - 1;
    var deltaYScale = scale.y - 1;

    /*var deltaWidth = width * deltaXScale;
    var deltaHeight = height * deltaYScale;
    var newWidth = width + deltaWidth;
    var newHeight = height + deltaHeight;
    var newX = x - deltaWidth / 2;
    var newY = y - deltaHeight / 2;*/

    var deltaWidth = width * deltaXScale;
    var deltaHeight =deltaH - height;
    //console.log("y："+y);
//  console.log("总高度："+deltaH);
    var newWidth = width + deltaWidth;
    var newHeight = deltaH;

    var newX;
    var newY;

    newX = x - deltaWidth / 2;
    newY = y - deltaHeight / 2;

    return {
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight //拿到的是上一次的高度parseFloat($('.textPillBox .textPillInner').css('height'))
    }
}