//快捷键复制使用的对象
var copyObj;
var curElements = {};
function downJson(element, id){
    curElements = element;
}
$(function(){
    function getQueryString(field, url) {
        var href = url ? url : window.location.href;
        var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
        var string = reg.exec(href);
        return string ? string[1] : null;
    };
    var base = new Base64();
    var userInfo = JSON.parse(localStorage.getItem('userInfo'));
    var addUpload = [];/*批量上传的元素*/
    var app = new Vue({
        el: '#webPc',
        data: {
            nickName: base.decode(userInfo.nickName),
            moduleType: analysisTem(getQueryString('id')),
            demoName: '点击此处设置作品名称',
            currentName: '',
            docNameFlag: false,   /*设计名称弹层*/
            downFlag: false,      /*下载弹层*/
            formatFlag: false,    /*文件类型弹层*/
            qrPayFlag: false,     /*下载信息弹层*/
            fixedParam: {
                authorityKey: '9670f10b8b17ea61010375bfbe08138d',
                userID: userInfo.userID,
                token: userInfo.token,
                perPageSize: 100,  /*每页返回数量*/
                modulePage: 1,
                allTotal: 0,
                imgTotal: 0,
                insertTotal: 0,
                searchAllPage: 1,
                searchImgPage: 1,
                searchInsertPage: 1,
                uploadPage: 1,
            },
            moduleList: [],      /*模板列表*/
            moduleOver: false,   /*模板加载是否结束，false：未结束，true：结束*/
            moduleInfo: {},

            keywords: '',        /*输入的关键字*/
            searchAllKey: '',
            searchAllList: [],       /*图片列表*/
            searchAllOver: false,    /*图片加载是否结束，false：未结束，true：结束*/
            imgCurInfo: {},   /*图片详细信息*/
            imgurlhead:'',  /*图片请求头*/

            searchImageKey: '',  /*图片搜索关键字*/
            searchImgList: [],   /*图片搜索结果列表*/
            searchImgOver: false,  /*搜索是否加载结束，false：未结束，true：结束*/

            searchInsertKey: '',     /*插图搜素关键字*/
            searchInsertList: [],    /*插图搜索结果列表*/
            searchInsertOver: false,  /*搜索是否加载结束，false：未结束，true：结束*/

            imageCurrentType: 0,     /*下拉选框类型*/
            imgAllTab: 0,         /*图片类型切换*/
            imgImgTab: 0,         /*图片类型切换*/
            imgInsertTab: 0,         /*图片类型切换*/
            imageCurrentTab: 2,      /*tab切换当前显示*/
            oneClickImage: true,     /*是否是第一次进入图片大板块，和点击全部共用一个*/
            oneSearchAll: true,
            oneSearchImg: true,      /*是否是第一次搜索图片*/
            oneSearchInsert: true,   /*是否是第一次搜索插图*/

            onClickUpload: true,
            uploadCurrentTab: 0,   /*上传模块tab*/
            uploadLists: [],       /*已上传的图片列表*/
            uploadOver: false,     /*上传列表是否加载结束，false：未结束，true：结束*/
            purchaseLists: [],     /*已购买的列表*/
            


            urlHeader: '',       /*模板前缀*/
            dataUrl: '',         /*模板地址*/

            elements: [],

        },
        created(){
            this.getModules();
            /*if(getQueryString('url')){
                this.setDataUrl('own',getQueryString('url'),getQueryString('id'),getQueryString('imgurl'),getQueryString('temId'),getQueryString('temTitle'),getQueryString('timesmp'));
            }*/

        },
        methods: {
            flagTitleBox(){
                var leftL = $('.documentTitle').offset().left;
                $('.descriptionPopOver').css({
                    'left': leftL+'px',
                })
                var title_ = $('.documentTitle').find('span').text();
                if(title_ == '点击此处设置作品名称'){
                    title_='';
                }
                $('.descriptionPopOver .textInput').val(title_);
                this.docNameFlag = !this.docNameFlag;
            },
            docuName(){
                var length = this.currentName.length;
                if(length == ''){
                    this.demoName = '点击此处设置作品名称';
                    this.docNameFlag = !this.docNameFlag;
                }else if(length < 255){
                    //this.demoName = this.currentName;
                    this.docNameFlag = !this.docNameFlag;
                    $('.documentTitle').find('span').text(this.currentName);
                    //ajax 请求
                    if(htmlHref.search("publish") != -1){
                        //发布页
                        var htmlType = 'pub';
                    }else if(htmlHref.search("design") != -1){
                        //下载页
                        var htmlType = 'down';
                    }
                    if(htmlType == 'down'){
                        if(par.templateId != 0){
                            $.ajax({
                                url: config.pubtemplateName,
                                type: 'post',
                                dataType: 'json',
                                data: {
                                    authorityKey: this.fixedParam.authorityKey,
                                    userID: this.fixedParam.userID,
                                    token: this.fixedParam.token,
                                    ownTemplateID:par.templateId,
                                    templateName:this.currentName
                                },
                                success:function(data){
                                    if(data.status == 1){
                                        console.log('名称输入成功');
                                    }
                                }
                            })
                        }

                    }

                }
            },
            getModules(){  //获取模板列表
                var _this = this;
                $.ajax({
                    url: config.designModeles,
                    type: 'post',
                    dataType: 'json',
                    data: {
                        authorityKey: _this.fixedParam.authorityKey,
                        userID: _this.fixedParam.userID,
                        token: _this.fixedParam.token,
                        perPageSize: _this.fixedParam.perPageSize,
                        pageNumber: _this.fixedParam.modulePage,   /*当前页*/
                        typeNumber: getQueryString('id')   /*模板类型*/
                    },
                    success: function(data){
                        // console.log(data);
                        if(data.status == 1){
                            _this.urlHeader = data.urlHeader;
                            if(data.result.length > 0){
                                if(_this.moduleType.col == 1){  //每一列宽 320px
                                    _this.moduleType.height2 = _this.moduleType.height/(_this.moduleType.width/320);
                                }else if(_this.moduleType.col == 2){  //每一列宽 154px
                                    _this.moduleType.height2 = _this.moduleType.height/(_this.moduleType.width/154);
                                }
                                for(var i = 0; i < data.result.length; i++) {
                                    _this.moduleList.push(data.result[i]);
                                }
                            }else{
                                $('#moduleList').hideLoading();
                                $('.moduleTip').hide();
                                _this.moduleOver = true;
                            }

                        }else{
                            console.log('error');
                        }
                    }
                })
            },
            swichNavType(e){  //切换搜素图片类型
                var cur=e.target.dataset.current;
                if(this.imageCurrentType == cur){
                    return false;
                }else{
                    this.imageCurrentType = cur;
                }
                this.judgeSearchType();
            },
            swichNav(e){  //切换搜索结果类型
                var _this = this;
                var cur=e.target.dataset.current;
                if(this.imageCurrentTab == cur){
                    return false;
                }else{
                    this.imageCurrentTab = cur;
                    $('.resultsSearchInfo').hide();  // 隐藏详细信息弹窗
                }
                $('.imageWrapper').css({'opacity':0, 'z-index':0});
                $('.imageWrapper').eq(cur).css({'opacity':1, 'z-index':10});
                this.judgeSearchType();
            },
            toggleSelectType(){  //控制搜素图片类型显隐
                $('.selectImageType').slideToggle(200);
                if($('.selectImageType').css('display') == 'block'){
                    $('.loading-indicator-overlay').css({'background-color': 'transparent'});
                }
            },
            getImageLists(){
                var _this = this;
                if(this.oneClickImage){  //如果第一次点击进来
                    this.oneClickImage = false;
                    setTimeout(function(){
                        _this.judgeSearchType();
                    },1000)
                }
            },
            judgeSearchType(){  //判断搜素类型
                var _this = this;
                this.keywords = this.keywords.replace(/\s/g, ""); /*清除空格*/

                // console.log(this.keywords);
                if(this.imageCurrentTab == 1){
                    // console.log(this.searchAllKey);
                    if(this.searchAllKey == this.keywords && this.keywords.length != 0){
                        return; //上次的关键字与这次输入的一样，或者不是第一次点击
                    }
                    this.searchAllKey = this.keywords;
                    setTimeout(function(){
                        if(!_this.oneSearchAll){
                            return;
                        }
                        _this.getsearchImgList(_this.fixedParam.searchAllPage, 1, _this.searchAllKey, $('#searchAllList'));
                    }, 0)
                }
                else if(this.imageCurrentTab == 2){
                    // console.log(this.searchImageKey)
                    if(this.searchImageKey == this.keywords && this.keywords.length != 0){
                        return;
                    }
                    // console.log(this.keywords)
                    this.searchImageKey = this.keywords;
                    setTimeout(function(){
                        if(!_this.oneSearchImg){
                            return;
                        }
                        _this.getsearchImgList(_this.fixedParam.searchImgPage, 2, _this.searchImageKey, $('#searchImgList'));
                    }, 0)
                }
                else if(this.imageCurrentTab == 3){
                    // console.log(this.searchInsertKey)
                    if(this.searchInsertKey == this.keywords && this.keywords.length != 0){
                        return;
                    }
                    this.searchInsertKey = this.keywords;
                    setTimeout(function(){
                        if(!_this.oneSearchInsert){
                            return;
                        }
                        _this.getsearchImgList(_this.fixedParam.searchInsertPage, 3, _this.searchInsertKey, $('#searchInsertList'));
                    }, 0)
                }
            },
            getsearchImgList: function(page, lists, key, domID){
                var _this = this;
                $(domID).find('.noneTip').hide();
                if(lists == 1){
                    this.oneSearchAll = false;
                }else if(lists == 2){
                    this.oneSearchImg = false;
                }else if(lists == 3){
                    this.oneSearchInsert = false;
                }
                $.ajax({
                    url: config.getSearchImages,
                    type: 'post',
                    dataType: 'json',
                    async: false,
                    data: {
                        authorityKey: _this.fixedParam.authorityKey,
                        userID: _this.fixedParam.userID,
                        token: _this.fixedParam.token,
                        perPageSize: _this.fixedParam.perPageSize,
                        pageNumber: page,   //当前页
                        typeImage: _this.imageCurrentTab,  //元素类型 1全部（默认） 2照片 3插图
                        searchType: _this.imageCurrentType,  /*下拉元素类型 0 综合， 1 视觉中国  2 花瓣*/
                        searchText: key,
                    },
                    success: function(data){
                        // console.log(data);
                        if(data.status == 1){
                            if(data.result && data.result.length > 0){
                                if(lists == 1){
                                    _this.fixedParam.allTotal = Math.ceil(data.Allcount/_this.fixedParam.perPageSize);

                                    if(_this.fixedParam.allTotal == page){
                                        _this.searchAllOver = true;
                                        $('.searchAllTip').hide();
                                    }

                                    for(var i = 0; i < data.result.length; i++){
                                        _this.searchAllList.push(data.result[i]);
                                    }
                                }else if(lists == 2) {
                                    _this.fixedParam.imgTotal = Math.ceil(data.Allcount/_this.fixedParam.perPageSize);

                                    if(_this.fixedParam.imgTotal == page){
                                        _this.searchImgOver = true;
                                        $('.searchImgTip').hide();
                                    }

                                    for(var i = 0; i < data.result.length; i++){
                                        data.result[i].height = '100px';
                                        _this.searchImgList.push(data.result[i]);
                                    }
                                }else if(lists == 3) {
                                    _this.fixedParam.insertTotal = Math.ceil(data.Allcount/_this.fixedParam.perPageSize);

                                    if(_this.fixedParam.insertTotal == page){
                                        _this.searchInsertOver = true;
                                        $('.searchInsertTip').hide();
                                    }

                                    for(var i = 0; i < data.result.length; i++){
                                        _this.searchInsertList.push(data.result[i]);
                                    }
                                }
                            }else{
                                if(lists == 1){
                                    _this.searchAllOver = true;
                                    $('.searchAllTip').hide();
                                }else if(lists == 2) {
                                    _this.searchImgOver = true;
                                    $('.searchImgTip').hide();
                                }else if(lists == 3) {
                                    _this.searchInsertOver = true;
                                    $('.searchInsertTip').hide();
                                }
                            }
                            
                        }else{
                            $(domID).hideLoading();
                            if(lists == 1){
                                _this.fixedParam.allTotal = 0;
                            }else if(lists == 2) {
                                _this.fixedParam.imgTotal = 0;
                            }else if(lists == 3) {
                                _this.fixedParam.insertTotal = 0;
                            }
                            $(domID).find('.noneTip').show().text('暂时没有此类图片');
                        }
                    }
                })
            },
            moduleDetail(e, info){
                $('.detailInfo').show();  // 显示所有左下角小图标，隐藏点击的那一个
                $(e.target).hide();
                $('.mosuleInfoWrap').fadeIn(300);  // 显示信息弹窗
                this.moduleInfo = info;
            },
            imgAllDetail(e, info){
                $('.detailInfo').show();  // 显示所有左下角小图标，隐藏点击的那一个
                $(e.target).hide();
                $('.resultsSearchInfo').fadeIn(300);  // 显示信息弹窗
                this.imgCurInfo = info;
            },
            closeDetailInfo: function(e){  //关闭模板信息
                $('.detailInfo').show();
                $(e.target).parents('.infoPanel').fadeOut(300);
            },
            setDataUrl(url){/*,temId,temT,timetmp*/
                //this.urlHeader = "http://www.photostars.cn/gallery/";
                drawTemplet(url,this.urlHeader, getQueryString('id'));/*,temId,temT,timetmp*/
            },
            setImage(event,list){
            	$('.search input').blur();
                var w = event.currentTarget.width;
                var h = event.currentTarget.height;
                if(list.fileType == 2){
                    $('.element').removeClass('selected');
                    addSvg(list, w, h);
                }else{
                    addImg(list, w, h);
                }
            },
            setText(ev) {
                var traget = ev.currentTarget;
                var fontType = $(traget).attr('fontType');

                var addEvent = ev || event;
                addEvent.preventDefault();
                addEvent.stopPropagation();
                //调用添加文字函数
                addText(fontType);
            },
            toDown(){
                var _this = this;
                this.downFlag = false;
                $.downProcess();
                $.dataSync('down');
                setTimeout(function(){
                    _this.elements = curElements;
                    // console.log(curElements);
                    // console.log(_this.elements);
                    _this.qrPayFlag = true;
                    $('.downProcess').hide();
                },1000);
            },
            changeMyFlag(flag){
                this.qrPayFlag = flag;
            },
            getPickerPalette: function(e, type){
                var left = parseInt($(e.target).offset().left) + 28;
                var top = parseInt($(e.target).offset().top) + 28;
                
                if(type == 'bg'){
                    $('.colorPicker2').toggle(200);
                    $('.colorPicker2').css({
                        'left': left+'px',
                        'top': top+'px',
                    });
                    $('#pickerPaletteText2').val($('.backgroundColor').css('background-color').colorHex());
                    /*初始化调色板*/
                    $('#pickerPalette2').farbtastic('#pickerPaletteText2');
                }else{
                    $('.colorPicker0').toggle(200);
                    $('.colorPicker0').css({
                        'left': left+'px',
                        'top': top+'px',
                    });
                }
            },
            swichuploadNav: function(e, cur){  //上传模块tab
                var _this = this;
                if(this.uploadCurrentTab == cur){
                    return false;
                }else{
                    this.uploadCurrentTab = cur;
                    if(cur == 0){
                        $('.inlineContentPointer').css('left', '33px');
                    }else if(cur == 1){
                        $('.inlineContentPointer').css('left', '143px');
                    }
                }
                $('.uploadWrapper').css({'opacity':0, 'z-index':0});
                $('.uploadWrapper').eq(cur).css({'opacity':1, 'z-index':10});
                // this.judgeSearchType();
            },
            getUploadLists: function(){
                var _this = this;
                this.onClickUpload = false;
                $('#uploadImage').showLoading();
                $.ajax({
                    url: config.getUploadImageList,
                    type: 'post',
                    dataType: 'json',
                    async: false,
                    data: {
                        authorityKey: _this.fixedParam.authorityKey,
                        userID: _this.fixedParam.userID,
                        token: _this.fixedParam.token,
                        perPageSize: _this.fixedParam.perPageSize,
                        pageNumber: _this.fixedParam.uploadPage,
                    },
                    success: function(data){
                        if(data.status == 1){
                            if(data.result.length > 0){
                                for(var i = 0; i < data.result.length; i++) {
                                    _this.uploadLists.push(data.result[i]);
                                }
                            }else{
                                $('.uploadImageTip').hide();
                                _this.uploadOver = true;
                            }
                            $('#uploadImage').hideLoading();
                        }
                    }
                })
            },
            fileChange: function(el){
                if (!el.target.files[0].size) return;
                this.fileList(el.target);
                el.target.value = '';
            },
            fileList(fileList) {
                var _this = this;
                // 判断上传个数
                let files = fileList.files;
                var length = files.length;
                if(length>20){
                    $('.finalTip').fadeIn(400).text('每次上传小于20张');
                    setTimeout(function(){
                        $('.finalTip').fadeOut(400);
                    }, 3000)
                    return;
                }

                addUpload = [];
                $.each(files, function(i){
                    var file = files[i];
                    if ( /(\.|\/)(jpg|png|jpeg)$/i.test(file.type) ) {
                        let reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = function () {
                            var url = this.result.substring(this.result.indexOf(",")+1, this.result.length);

                            var obj = {};
                            obj.type = file.type.substring(file.type.indexOf("/")+1, file.type.length);
                            obj.fileName = file.name;
                            obj.imageStream = url;
                            addUpload.push(obj);

                            if(i == length-1){
                                _this.uploadMore();
                            }
                        }
                    }else{
                        msgalert('提示', file.name+' 不是图片，请上传图片');
                    }
                })
            },
            uploadMore: function(){
                var _this = this;
                $.ajax({
                    url: config.uploadOwnImage,
                    type: 'post',
                    dataType: 'json',
                    data: {
                        authorityKey: _this.fixedParam.authorityKey,
                        userID: _this.fixedParam.userID,
                        token: _this.fixedParam.token,
                        dataInfo: JSON.stringify(addUpload),
                    },
                    success: function(data){
                        if(data.status == 1){
                            _this.fixedParam.uploadPage = 1;
                            _this.uploadOver = false;
                            _this.uploadLists = [];
                            _this.getUploadLists();
                        }else{
                            $('.finalTip').fadeIn(400).text('上传失败');
                            setTimeout(function(){
                                $('.finalTip').fadeOut(400);
                            }, 3000)
                        }
                    }
                })
            },
            fileDel(index, id) {
                var _this = this;
                msgconfirm('删除', '确定删除当前图片？', function(){
                    $.ajax({
                        url: config.deleteUploadImage,
                        type: 'post',
                        dataType: 'json',
                        async: false,
                        data: {
                            authorityKey: _this.fixedParam.authorityKey,
                            userID: _this.fixedParam.userID,
                            token: _this.fixedParam.token,
                            uploadImageID: id,
                        },
                        success: function(data){
                            if(data.status == 1){
                                _this.uploadLists.splice(index, 1);
                            }
                        }
                    })
                })
            },
            dragenter(el) {
                el.stopPropagation();
                el.preventDefault();
            },
            dragover(el) {
                el.stopPropagation();
                el.preventDefault();
            },
            drop(el) {
                el.stopPropagation();
                el.preventDefault();
                this.fileList(el.dataTransfer);
            },
        },
        watch: {
            searchAllList: function(val){
                var _this = this;
                this.$nextTick(function(){
                    $('#searchAllList').imagesLoaded(function(){
                        var container = document.getElementById('searchAllList');
                        var msnry = new Masonry( container , {
                            'itemSelector': '.imageSearchAll-item',
                            'gutter': 5,
                        });

                        $('.searchAllTip').hide();
                    })
                })
                
            },
            searchImgList: function(){
                var _this = this;
                this.$nextTick(function(){
                    $('#searchImgList').imagesLoaded(function(){
                        var container = document.getElementById('searchImgList');
                        var msnry = new Masonry( container , {
                            'itemSelector': '.imageSearchImg-item',
                            'gutter': 5
                        });

                        $('.searchImgTip').hide();
                    })
                })
                
                // 图片列表渲染完成后执行
            	Vue.nextTick(function () {
	         		var arr = $('#searchImgList li');
	         		for (var i=0;i<arr.length;i++) {
	         			dragAdd(arr[i])
	         		}
	      		})
            },
            searchInsertList: function(){
                var _this = this;
                this.$nextTick(function(){
                    $('#searchInsertList').imagesLoaded(function(){
                        var container = document.getElementById('searchInsertList');
                        var msnry = new Masonry( container , {
                            'itemSelector': '.imageSearchInsert-item',
                            'gutter': 5
                        });

                        $('.searchInsertTip').hide();
                    })
                })
            },
            moduleList: function(){
                $('#moduleList').imagesLoaded(function(){
                    var container = document.getElementById('moduleList');
                    var msnry = new Masonry( container , {
                        'itemSelector': '.modeleBox-item',
                        'gutter': 12
                    });

                    $('.moduleTip').hide();
                })
            },
            uploadLists: function(){
                this.$nextTick(function(){
                    $('#uploadImage').imagesLoaded(function(){
                        var container = document.getElementById('uploadImage');
                        var msnry = new Masonry( container , {
                            'itemSelector': '.uploadImage-item',
                            'gutter': 5
                        });

                        $('.uploadImageTip').hide();
                    })
                })
            },
            imageCurrentType: function(){
                this.$nextTick(function(){
                    if(this.imageCurrentTab == 1){
                        this.searchAllList = [];
                        this.fixedParam.searchAllPage = 1;
                        this.oneSearchAll = true;
                        this.searchAllOver = false;
                        $('.searchAllTip').show();
                    }
                    else if(this.imageCurrentTab == 2){
                        this.searchImgList = [];
                        this.fixedParam.searchImgPage = 1;
                        this.oneSearchImg = true;
                        this.searchImgOver = false;
                        $('.searchImgTip').show();
                    }
                    else if(this.imageCurrentTab == 3){
                        this.searchInsertList = [];
                        this.fixedParam.searchInsertPage = 1;
                        this.oneSearchInsert = true;
                        this.searchInsertOver = false;
                        $('.searchInsertTip').show();
                    }
                })
            },
            searchAllKey: function(){
                this.$nextTick(function(){
                    $('.searchAllTip').show();
                    this.searchAllList = [];
                    this.fixedParam.searchAllPage = 1;
                    this.oneSearchAll = true;
                    this.searchAllOver = false;
                    
                })
            },
            searchImageKey: function(){
                this.$nextTick(function(){
                    $('.searchImgTip').show();
                    this.searchImgList = [];
                    this.fixedParam.searchImgPage = 1;
                    this.oneSearchImg = true;
                    this.searchImgOver = false;
                    
                })
            },
            searchInsertKey: function(){
                this.$nextTick(function(){
                    $('.searchInsertTip').show();
                    this.searchInsertList = [];
                    this.fixedParam.searchInsertPage = 1;
                    this.oneSearchInsert = true;
                    this.searchInsertOver = false;
                    
                })
            },
        },
    })

    $('.tableList').eq(0).addClass('on');
    $('.sidebarBox li').on('click', function(){
        $(this).addClass('on').siblings('li').removeClass('on');
        $('.tableList').eq($(this).index()).addClass('on').siblings('.tableList').removeClass('on');
    });
    /*搜索图片或插图,添加文字标题，发布输入框，文字编辑框*/
    $.firstOnkey = true;
    var onkeypoint_ = {};
    document.onkeydown=function(event){
        var e = event || window.event || arguments.callee.caller.arguments[0];
        
        //ctrl+c复制事件
		var k=e.keyCode||e.which;
		if (e.ctrlKey==1){
		    if(k==67){//ctrl+c
		    	if (!$('.TextInner').is(':focus')) {
		    		if ($('.zoomImgbox').css('display')=='block'||$('.playTextBox').css('display')=='block') {
		    			$(ElementThis).find('.innerText').html($('.TextInner').html());
		    			copyObj = ElementThis;
		    		}
		    	}
               
		    }
		    if(k==86){//ctrl+v
		    	if(copyObj!=undefined&&!$('.TextInner').is(':focus')){//失去焦点
		    		copyElement(copyObj);
		    	  	copyObj = ElementThis;//复制出的对象成为下一次复制的源对象
                    $.dataSync('cancle','键盘抬起复制');
		    	}

		    }
		}
		//删除按键
		if (k==46||k==8){
			if (!$('.TextInner').is(':focus') && !$('.sizebar').is(':focus')) {
				if ($('.zoomImgbox').css('display')=='block'||$('.playTextBox').css('display')=='block') {
					$('.remove').trigger('click');
				}
		   }
          
		}
        //上下左右按键位移
        if($('.zoomImgbox').css('display')=='block'||$('.playTextBox').css('display')=='block'){//图片或者文字编辑框框存在，证明已经选中某个元素
        	if (!$('.TextInner').is(':focus') && !$('.sizebar').is(':focus')) {//防止按键与输入冲突
				var l = $(ElementThis).offset().left;
				var t = $(ElementThis).offset().top;
				if($('.playTextBox').css('display')=='block'){
					var l = $('.editTextBox').offset().left;
					var t = $('.editTextBox').offset().top;
				}
				if (k==37) {//左
					l-=2;
					$(ElementThis).offset({left:l})
				}else if (k==39) {//右
					l+=2;
					$(ElementThis).offset({left:l})
				}if (k==38) {//上
					t-=2;
					$(ElementThis).offset({top:t})
				}if (k==40) {//下
					t+=2;
					$(ElementThis).offset({top:t})
				}
				
				if($('.zoomImgbox').css('display')=='block'){//非文字元素
					$('.zoomImgbox').offset({left:l,top:t})
				}else if($('.playTextBox').css('display')=='block'){//文字元素
					$('.playTextBox').offset({left:l,top:t})
					$('.editTextBox').offset({left:l,top:t})
				}
				
				
		   }
        }
        
        
        
        
        
        
        
        
        
        
//      判断输入框是否发生变化的标识
		if($('.editTextBox ').hasClass('selected')){
	        var textStartLength = $('.TextInner').html().length;
		}      
    
	    document.onkeyup=function (event) {
	    	var e = event || window.event || arguments.callee.caller.arguments[0];

	        //判断dom元素的显示隐藏，或者获取焦点的情况
	        //发布和标题
	        if($('.publishContent').css('display') == 'block' || $('.modalContent').css('display') == 'block'){
	            //发布框/文件名
	
	        }else if($(':focus').attr('name') == 'search_img'){
	            //搜索
	            if(e && e.keyCode==13){ // enter 键
	                app.judgeSearchType();
	            }
	        }else if($('.sizebar').is(':focus')){
                if(e && e.keyCode==13){ // enter 键
                    //失去焦点
                    $('.sizebar').blur();
                    var inputSize = $('.sizebar').val();
                    var currfontsize_min = (12/fontStand)*16;
                    //alert(currfontsize_min);
                    if(isNumber(inputSize)) {
                        //输入的是数字
                        //得到实际生效的字号
                        if (parseInt(inputSize) < Math.ceil(currfontsize_min)) {
                            inputSize = Math.ceil(currfontsize_min);
                        } else if (parseInt(inputSize) > 400) {
                            inputSize = 400;
                        }
                        $('.sizeList__inner li').each(function(){
                            var datasize = $(this).attr('data-size');
                            //实际输入的字号
                            if (parseInt($('.sizebar').val()) == datasize){
                                $(this).addClass('fontListSelect');
                                $(this).css('background-color', 'rgb(255,236,237)');
                                $(this).siblings('li').removeClass('fontListSelect').css('background-color', 'rgb(255,255,255)')
                            }else{
                                $(this).removeClass('fontListSelect');
                                $(this).css('background-color', 'rgb(255,255,255)');
                            }
                        })
                        fontsizeSync(inputSize);
                        $.dataSync('cancle','键盘抬起字号');
                    }else{
                        alert('请输入有效数字');
                    }
                }


            }else if($('.editTextBox ').hasClass('selected')&&k!=37&&k!=38&&k!=39&&k!=40){//避免与上下左右按键冲突
	        	var textEndLength = $('.TextInner').html().length;
	            //是否按下shift
                //是否输入回车
                //isEnterkey(e)
	            if (textStartLength!=textEndLength) {
	                //判断输入框的值是否发生变化
		            if($.firstOnkey){
		                //键盘输入高度自适应变化 拿到原来的height（）
		                var orTop_ = (parseInt($('.TextInner').css('height')));
		                var or_Width =  (parseInt($('.TextInner').css('width')));
		
		                onkeypoint_.x = parseInt($('.editTextBox').css('left'));
		                onkeypoint_.y = parseInt($('.editTextBox').css('top'));
		                onkeypoint_.width = or_Width;
		                onkeypoint_.height = orTop_;
		                
		                $.firstOnkey = false;
		            }
		            var setTimeout = window.setTimeout(function () {
		                $('.playTextBox').css('height',$('.TextInner').css('height'));
		                $('.editTextBox').css('height',$('.TextInner').css('height'));
		                $(clickTextThis).css('height',$('.TextInner').css('height'));
		                
		
		               if ($('.TextInner').find('span') || $('.TextInner').find('div')) {
		                    $('.TextInner').find('span').css('font-size','inherit');
		                    $('.TextInner').find('div').css('font-size','inherit');
		                }
		
		                var changeTop_ = (parseInt($('.TextInner').css('height')));
		                p3.width = or_Width;
		                p3.height = orTop_;
		
		                p3.x = parseInt($('.editTextBox').css('left'));
		                p3.y = parseInt($('.editTextBox').css('top'));
						
		                reDraw(onkeypoint_,getmatrix($('.editTextBox').css('transform')),changeTop_);
		            },10)
		            
				}
	        }
	    };
	};
    /*编辑框回车事件  插入br换行，更换浏览器默认插入的div*/
    var newlineArr = [];
    /*按下enter 键*/
    function isEnterkey(e){
        if(e && e.keyCode == 13){
            var text = $('.TextInner').find('div').text();
            $('.TextInner').find('div').remove();
            insertHtmlAtCaret('<br>'+text);
        }
    }
    /*光标位置插入文本*/
    function insertHtmlAtCaret(html) {
        var sel, range;
        if (window.getSelection) {
            // IE9 and non-IE
            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.deleteContents();
                // Range.createContextualFragment() would be useful here but is
                // non-standard and not supported in all browsers (IE9, for one)
                var el = document.createElement("div");
                el.innerHTML = html;
                var frag = document.createDocumentFragment(), node, lastNode;
                while ((node = el.firstChild)) {
                    lastNode = frag.appendChild(node);
                }
                range.insertNode(frag);
                // Preserve the selection
                if (lastNode) {
                    range = range.cloneRange();
                    range.setStartAfter(lastNode);
                    range.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
        } else if (document.selection && document.selection.type != "Control") {
            // IE < 9
            document.selection.createRange().pasteHTML(html);
        }
    }
    /*字体大小设置*/
function fontsizeSync(inputSize){
    fontStand = orfontStand * sizeScale;
    var fontsize =inputSize;
    var perSize = $.fontSizePxtoPer(fontsize);//尺寸百分比
    $(this).addClass('fontListSelect');
    $('.editTextBox').css('font-size',perSize);
    //实际输入的字号
    $('.TextInner').attr('fontsize',fontsize);
    $(clickTextThis).css('font-size',perSize);
    $(clickTextThis).find('.innerText').attr('fontsize',fontsize);
    //拿到当前的行高比列
    var lineh = $('.LineSp').val();
    var lineH = lineh * (parseFloat(perSize)*fontStand/100);
    $('.editTextBox').css('line-height', lineH+'px');
    $(clickTextThis).css('line-height',lineH+'px');

    //文字大小改变时改变外层文字拉伸框的大小
    //拿到原来的height（）
    var orTop_ = (parseInt($('.playTextBox').css('height')));
    var or_Width =  (parseInt($('.playTextBox').css('width')));

    $('.editTextBox').css('height',$('.TextInner').css('height'));
    $('.playTextBox').css('height',$('.TextInner').css('height'));
    $(clickTextThis).css('height',$('.TextInner').css('height'));
    //宽度--拿到当前的 容器宽度，如果小于字体宽度，设置宽度等于字体宽度
    var w_box = parseInt($('.editTextBox').css('width'));
    var size_w = (parseInt(perSize)/100)*fontStand;

    //重置拉伸参数

    //设置操作框的两边拖拽按钮的位置
    var changeTop_ = (parseInt($('.playTextBox').css('height')));
    p3.width = or_Width;
    p3.height = orTop_;
    p3.x = parseInt($('.editTextBox').css('left'));
    p3.y = parseInt($('.editTextBox').css('top'));
    var point_ = {};
    point_.x = parseInt($('.editTextBox').css('left'));
    point_.y = parseInt($('.editTextBox').css('top'));
    point_.width = or_Width;
    point_.height = orTop_;

    reDraw(point_,getmatrix($('.editTextBox').css('transform')),changeTop_);

    if(parseInt(w_box) < size_w ){
        $('.editTextBox').css('width',size_w+'px');
        $('.playTextBox').css('width',size_w+'px');
        $('.TextInner').css('width',size_w+'px')
    }

    $('.sizeList').hide();
    //同步
    //$.dataSync('cancle','键盘抬起输入文字');
    //$.isSynctoend('文字大小',htmlType);
}
    /*滚动轴*/
    $('.scrollElement').mCustomScrollbar({ theme:"minimal"});
    $('.modeleBox').mCustomScrollbar({ 
        theme:"minimal", 
        callbacks:{ 
            whileScrolling: function(){ 
                if(!app.moduleOver){ 
                    $('.moduleTip').show(); 
                } 
            }, 
            onTotalScroll:function(){ 
                if(!app.moduleOver){ 
                    app.fixedParam.modulePage++; 
                    app.getModules(); 
                } 
            }, 
            onTotalScrollOffset: 200, 
            alwaysTriggerOffsets: false 
        } 
    });
    $('.imageSearchAll').mCustomScrollbar({ 
        theme:"minimal", 
        callbacks:{ 
            whileScrolling: function(){ 
                if(!app.searchAllOver){ 
                    $('.searchAllTip').show(); 
                } 
            },
            onTotalScroll: function(){
                if(!app.searchAllOver){ 
                    app.fixedParam.searchAllPage++; 
                    app.getsearchImgList(app.fixedParam.searchAllPage, 1, app.searchAllKey, $('#searchAllList'));
                }
            },
            onTotalScrollOffset: 200, 
            alwaysTriggerOffsets: false 
        } 
    });
    $('.imageSearchImg').mCustomScrollbar({ 
        theme:"minimal", 
        callbacks:{ 
            whileScrolling: function(){ 
                if(!app.searchImgOver){ 
                    $('.searchImgTip').show(); 
                } 
            }, 
            onTotalScroll: function(){
                if(!app.searchImgOver){ 
                    app.fixedParam.searchImgPage++;
                    /*if(app.keywords.length != 0){
                        app.searchImages(); 
                    }else{
                        app.recommendImg(app.fixedParam.searchImgPage, 2, $('.searchImgTip'), $('.imageSearchImg'), $('#searchImgList'));
                    }*/
                    app.getsearchImgList(app.fixedParam.searchImgPage, 2, app.searchImageKey, $('#searchImgList'));
                } 
            },
            onTotalScrollOffset: 200, 
            alwaysTriggerOffsets: false 
        } 
    });
    $('.imageSearchInsert').mCustomScrollbar({ 
        theme:"minimal", 
        callbacks:{ 
            whileScrolling: function(){ 
                if(!app.searchInsertOver){ 
                    $('.searchInsertTip').show(); 
                } 
            }, 
            onTotalScroll: function(){
                if(!app.searchInsertOver){ 
                    app.fixedParam.searchInsertPage++; 
                    app.getsearchImgList(app.fixedParam.searchInsertPage, 3, app.searchInsertKey, $('#searchInsertList'));
                } 
            },
            onTotalScrollOffset: 200, 
            alwaysTriggerOffsets: false 
        } 
    });
    $('.fontType').mCustomScrollbar({ theme:"minimal"});
    $('.colorControls').mCustomScrollbar({ theme:"minimal"});

    $('.uploadImage').mCustomScrollbar({ 
        theme:"minimal", 
        callbacks:{ 
            whileScrolling: function(){ 
                if(!app.uploadOver){ 
                    $('.uploadImageTip').show(); 
                } 
            }, 
            onTotalScroll: function(){
                if(!app.uploadOver){ 
                    app.fixedParam.uploadPage++; 
                    app.getUploadLists();
                } 
            },
            onTotalScrollOffset: 0, 
            alwaysTriggerOffsets: false 
        } 
    });
	$('.purchaseImage').mCustomScrollbar({ 
        theme:"minimal", 
        callbacks:{ 
            whileScrolling: function(){ 
                // if(!app.searchInsertOver){ 
                //     $('.searchInsertTip').show(); 
                // } 
            }, 
            onTotalScroll: function(){
                // if(!app.searchInsertOver){ 
                //     app.fixedParam.searchInsertPage++; 
                //     app.getsearchImgList(app.fixedParam.searchInsertPage, 3, app.searchInsertKey, $('#searchInsertList'));
                // } 
            },
            onTotalScrollOffset: 200, 
            alwaysTriggerOffsets: false 
        } 
    });

});