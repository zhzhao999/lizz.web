$(function(){
    var base = new Base64();
    var userInfo = JSON.parse(localStorage.getItem('userInfo'));
	var app = new Vue({
        el: '#webPc',
        data: {
            fixedParam: {
                authorityKey: '9670f10b8b17ea61010375bfbe08138d',
                userID: userInfo.userID,
                token: userInfo.token,
                totalPage: 0,
                perPageSize: 20, //每页返回数量
                pageNumber: 1,
            },
            //nickName: $.session.get('nickName')
            designWidth: '',
            designHeight: '',
            themeLists: [],
            urlHeader: '',

            themeID: '',  //主题id
            name: '',   //主题名称
            keywords: '',  //主题简介
            themeTemLists: [],
            listsOver: false,  /*加载是否结束，false：未结束，true：结束*/
        },
        created: function(){
            $('.hotDocType').showLoading();
            this.getThemeLists();
        },
        methods: {
            jumpPage: function(id){
                var type = analysisTem(id).name;
                _czc.push(﻿["_trackEvent","首页-模板类型","选择",type,"templateType"]);
                window.location.href = '../design/design.html?id='+id;
            },
        	jumpModule(list){
        		//window.location.href = '../design/design.html?id='+list.tyNumber+'&dataUrl='+list.dataUrl+'&tem=1'+'&temID='+list.templateID+'&urlheader='+this.urlHeader;
				var temT='';
                var temp= 1;
                var timeTmp = 0;
                window.location.href = '../design/design.html?id='+list.tyNumber + '&dataUrl=' + list.dataUrl+'&urlheader=' + this.urlHeader+ '&tem=' + temp+ '&temID=' + list.templateID+'&temTitle='+temT+'&timesmp='+timeTmp;
        	},
            getThemeLists: function(){
                var _this = this;
                $.ajax({
                    url: config.getThemeList,
                    type: 'post',
                    dataType: 'json',
                    async: false,
                    data: {
                        authorityKey: _this.fixedParam.authorityKey,
                        userID: _this.fixedParam.userID,
                        token: _this.fixedParam.token,
                    },
                    success: function(data){
                        if(data.status == 1){
                            if(data.result.length>0){
                                for(var i = 0; i < data.result.length; i++) {
                                    _this.themeLists.push(data.result[i]);
                                }
                            }else{
                                $('.hotDocType').hideLoading();
                            }
                        }else{
                            console.log('error');
                        }
                    }
                })
            },
            getthemeTemLists: function(){
                var _this = this;
                $.ajax({
                    url: config.getThemeTemplate,
                    type: 'post',
                    dataType: 'json',
                    async: false,
                    data: {
                        authorityKey: _this.fixedParam.authorityKey,
                        userID: _this.fixedParam.userID,
                        token: _this.fixedParam.token,
                        perPageSize: _this.fixedParam.perPageSize,
                        pageNumber: _this.fixedParam.pageNumber,
                        themeID: _this.themeID,
                    },
                    success: function(data){
                        if(data.status == 1){
                            _this.totalPage = Math.ceil(data.totalCount/_this.fixedParam.perPageSize);
                            if(_this.totalPage == 1){
                                _this.listsOver = true;
                            }
                            if(data.result.length > 0){
                                for(var i = 0; i < data.result.length; i++) {
                                    _this.urlHeader = data.urlHeader;
                                    data.result[i].width = analysisTem(data.result[i].tyNumber).width;
                                    data.result[i].height = analysisTem(data.result[i].tyNumber).height;
                                    _this.themeTemLists.push(data.result[i]);
                                }
                            }else{
                                _this.listsOver = true;
                                $('.moduleTip').hide();
                                $('.themeDetailHot').hideLoading();
                            }
                        }else{
                            console.log('error');
                        }
                    }
                })
            },
        	docTypeMore: function () {
				var length = $('.docTypeCategory').length;
				
				var arr =$('.docTypeCategory');
				var h=0;
				for (var i=1;i<arr.length;i++) {
					var h0=parseInt($(arr[i]).css('height'));
					h+=h0;
				}
				
				$('.docTypeAdvanced').animate({height:h+200+'px'})
				$('.createClose').fadeIn();
				$('.docTypeCategoryOne').slideUp();
				$('.hotDocType').hide()
        	},
            closeDetail: function(){
                $('.docTypeAdvanced').animate({height:220+'px'})
                $('.createClose').fadeOut();
                $('.docTypeCategoryOne').slideDown();
				$('.hotDocType').show();
            },
            themeTemDetail: function(list){
                $('.themeTemDetail').slideDown();
                $('.indexClose').slideUp();
                this.themeID = list.themeID;
                this.name = list.name;
                this.keywords = list.keywords;
            },
            closeThemeTem: function(){
                $('.themeTemDetail').slideUp();
                $('.indexClose').show();
            },
        },
        watch: {
            themeLists: function(){
                this.$nextTick(function(){
                    $('#hotTheme').imagesLoaded(function(){
                        var container = document.getElementById('hotTheme');
                        var msnry = new Masonry( container , {
                            'itemSelector': '.hotThemeList',
                            'gutter': 30
                        });

                        $('.hotDocType').hideLoading();
                    })
                })
            },
            themeID: function(){
                this.$nextTick(function(){
                    $('.themeDetailHot').showLoading();
                    this.getthemeTemLists();
                })
            },
            themeTemLists: function(){
                this.$nextTick(function(){
                    $('#themeTemplate').imagesLoaded(function(){
                        var container = document.getElementById('themeTemplate');
                        var msnry = new Masonry( container , {
                            'itemSelector': '.themeTemplateList',
                            'gutter': 30
                        });

                        $('.themeDetailHot').hideLoading();
                    })
                })
            },
        }
    })

    
})