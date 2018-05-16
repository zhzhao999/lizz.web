//同步循环监听
var syncDatainterval = setInterval(function(){
    var $elementsDom = $('#page_content .element');
    if ($elementsDom.length > 0) {
        //修改保存状态
        if (par.isSave && par.nullTemplate) {
            $('.saveType').text('保存中');
            par.isSave = false;
            var jsonL = par.templateJson.length;
            var newJson = par.templateJson[jsonL-1];
            //$.dataSync('sync');
            //console.log('同步'+JSON.stringify(newJson.content.pages[0]));
            $.ajaxTo(newJson,'sync');
        }
    }
},3000)
$.extend({
    /*creatImgLink:function(){
        //转化类型
        var turnType = $('.downWrapper-option select option:selected').val();
        //图片
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
            $.downImg(imgLink,turnType);
        }else if(turnType == "standardPdf"){
            //标准pdf
            $.downStandarPdf();
        }else if(turnType == "printPdf"){
            //打印pdf
            $.downPrintPdf();
        }
        //设置进度条状态
        par.i_ = 100;
        par.s.changeValue(100);

        $('.downProcess').hide();
        $('.downFinish').show();
    },*/
//  downImg: function (imgEle,turnType) {
//      var svgTimeout = window.setTimeout(function(){
//          //转img
//          html2canvas($(".hide_container"), {
//              useCORS:true,
//              height:par.canvasH,
//              width:par.canvasW,
//              onrendered: function (canvas) {
//                  var imgURL = canvas.toDataURL('image/'+turnType);
//                  //var imgURL = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
//                  //window.open(imgURL);
//                  //以下代码为下载此图片功能
//                  imgEle.setAttribute('href',imgURL);
//                  imgEle.click();
//                  var downFinishremove = window.setTimeout(function () {
//                      $('.hide_container').remove();
//                      clearTimeout(downFinishremove);
//                      downFinishremove = null;
//                  },10)
//              }
//          });
//          clearTimeout(svgTimeout);
//          svgTimeout = null;
//      },1000)
//  },
    downPrintPdf:function(data,can){
        //出血设计，两边留白
//      html2canvas($(".hide_container"), {
//          useCORS:true,
//          onrendered: function (canvas) {
                var contentWidth = can.width;
                var contentHeight = can.height;

                //一页pdf显示html页面生成的canvas高度;
                var pageHeight = contentWidth / 592.28 * 841.89;
                //未生成pdf的html页面高度
                var leftHeight = contentHeight;
                //页面偏移
                var position = 40;
                //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
                var imgWidth = 595.28;
                var imgHeight = 592.28/contentWidth * contentHeight;

                //var pageData = canvas.toDataURL('image/jpeg', 1.0);

                var doc = new jsPDF('', 'pt', 'a4');

                var cxLine = 35;//出血线
                var cxSpace = cxLine+5;
                var pdf_width = 595.28;
                var pdf_height = 841.89;
                /*画出血线*/
                doc.setLineWidth(0.5);
                doc.setDrawColor(0,0,0); // draw black lines
                //左上角
                doc.line(0,cxSpace,cxLine, cxSpace); // horizontal line （开始点x，开始点y，结束点x，结束点y）
                doc.line(cxSpace, 0, cxSpace, cxLine); // vertical line

                //右上角
                doc.line(pdf_width-cxLine, cxSpace, pdf_width, cxSpace); // horizontal line
                doc.line(pdf_width-cxSpace, 0, pdf_width-cxSpace, cxLine); // vertical line

                //左下角
                doc.line(0, pdf_height-cxSpace,cxLine, pdf_height-cxSpace); // horizontal line
                doc.line(cxSpace, pdf_height-cxLine, cxSpace, pdf_height); // vertical line

                //右下角
                doc.line(pdf_width-cxLine,  pdf_height-cxSpace, pdf_width,  pdf_height-cxSpace); // horizontal line
                doc.line(pdf_width-cxLine, pdf_height-cxLine, pdf_width-cxLine, pdf_height); // vertical line
                // Output as Data URI
                doc.output('datauri');


                //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
                //当内容未超过pdf一页显示的范围，无需分页
                if (leftHeight < pageHeight) {//页面实际canvas高度，pdf生成的canvas高度
                    doc.addImage(data, 'JPEG', position+1,position+1, imgWidth-2*position-1, imgHeight-1);
                } else {
                    while(leftHeight > 0) {
                        doc.addImage(data, 'JPEG', position+1, position+1, imgWidth-2*position-1, imgHeight-1);
                        leftHeight -= pageHeight;
                        position -= 841.89;
                        //避免添加空白页
                        if(leftHeight > 0) {
                            doc.addPage();
                        }
                    }
                }

                //输出保存命名为content的pdf
                doc.save('content.pdf');
                $('#cloneTemp').remove();
                //设置进度条状态
                par.i_ = 100;
                par.s.changeValue(100);
                $('.downProcess').hide();
//          }
//      });
    },
    downStandarPdf:function(data,can){
        /*html2canvas($(".hide_container"), {
            useCORS:true,
            onrendered: function (canvas) {*/
                var contentWidth = can.width;
                var contentHeight = can.height;

                //一页pdf显示html页面生成的canvas高度;
                var pageHeight = contentWidth / 592.28 * 841.89;
                //未生成pdf的html页面高度
                var leftHeight = contentHeight;
                //页面偏移
                var position = 0;
                //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
                var imgWidth = 595.28;
                var imgHeight = 592.28/contentWidth * contentHeight;

               //var pageData = canvas.toDataURL('image/jpeg', 1.0);

                var pdf = new jsPDF('', 'pt', 'a4');

                //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
                //当内容未超过pdf一页显示的范围，无需分页
                if (leftHeight < pageHeight) {
                    pdf.addImage(data, 'JPEG', position, position, imgWidth, imgHeight);
                } else {
                    while(leftHeight > 0) {
                        pdf.addImage(data, 'JPEG',position, position, imgWidth, imgHeight);
                        leftHeight -= pageHeight;
                        position -= 841.89;
                        //避免添加空白页
                        if(leftHeight > 0) {
                            pdf.addPage();
                        }
                    }
                }

                //输出保存命名为content的pdf
                pdf.save(par.documentName+'.pdf');
                $('#cloneTemp').remove();
            //设置进度条状态
            par.i_ = 100;
            par.s.changeValue(100);
            $('.downProcess').hide();
           /* }
        });*/
    },
    //数据同步到后台
    ajaxTo:function(json_,downstr){
        //获取模板名称
        //var tempName = $('.documentTitle span').text();
        var userInfo_ = JSON.parse(localStorage.getItem('userInfo'));
        /*if(tempName == '点击此处设置作品名称'){
            tempName = '';
        }*/
        //return false;
        var htmlurl = window.location.href;
        var typeNumber = $.getQueryString_('id',htmlurl);
        //console.log('同步之前：'+typeNumber);
        $.ajax({
            type:'post',
            url:par.urlhead+'worksys/syncData',
            data:{
                'authorityKey':'9670f10b8b17ea61010375bfbe08138d',
                'userID':userInfo_.userID,
                'token':userInfo_.token,
                'ownTemplateID':par.templateSysn.templateId,
                'ownTemplateTitle':par.templateSysn.templteTitle,
                'ownTimestamp':par.templateSysn.Timestamp,
                'data':JSON.stringify(json_),/*
                'templateName':tempName,*/
                'typeNumber':parseInt(typeNumber)
            },
            datatype:'json',
            success:function(data){
                    var jsonData_ = JSON.parse(data);
                    var statu = jsonData_.status;
                    if(statu == 1){
                        //成功
                        if(downstr == 'down'){
                            //开始下载
                            // $.downPre(json_,'down');
                            downJson(json_, par.templateSysn.templateId);
                        }else if(downstr == 'sync'){
                            //更改工具栏状态
                            $('.saveType').text('所有更改已保存');
                            par.templateSysn = {
                                'templateId':jsonData_.ownTemplateID,
                                'templteTitle':jsonData_.ownTemplateTitle,
                                'Timestamp':jsonData_.ownTimestamp
                            };
                            par.templateId = jsonData_.ownTemplateID;
                            //可以进行下次同步
                            //par.isSave = true;
                            //将最新的数据赋值
                            //par.templateJson = json_.content.pages
                        }

                    }else if(statu == 2){
                        //token 错误
                        alert('token error!');
                        if(downstr == 'sync'){
                            //par.isSave = true;
                            $('.saveType').text('未保存的更改');
                        }
                    }else if(statu == 4){
                        //同步保存失败
                        alert('save sysn error!');
                        if(downstr == 'sync'){
                            //par.isSave = true;
                            $('.saveType').text('未保存的更改');
                        }
                    }else{
                        //其他失败
                        alert('other error!');
                        if(downstr == 'sync'){
                            //par.isSave = true;
                            $('.saveType').text('未保存的更改');
                        }
                    }
                $('.saveType').text('未进行任何更改');

            },
            error: function(XMLHttpRequest,textStatus ,errorThrown){
                alert(textStatus);
                if(downstr == 'sync'){
                    //par.isSave = true;
                    $('.saveType').text('未保存的更改');
                }
            }
        })
    },
    
});