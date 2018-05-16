/**
 * Created by ZZ on 2016/12/6.
 */
(function($) {

    $.alerts = {
        alert: function(title, message, callback) {
            if( title == null ) title = 'Alert';
            $.alerts._show(title, message, null, 'alert', function(result) {
                if( callback ) callback(result);
            });
        },

        confirm: function(title, message, callback) {
            if( title == null ) title = 'Confirm';
            $.alerts._show(title, message, null, 'confirm', function(result) {
                if( callback ) callback(result);
            });
        },


        _show: function(title, msg, value, type, callback) {

            var _html = "";

            if(type == "alert"){
                _html += '<div id="mb_box"></div><div id="mb_con" class="alertWrapper"><span id="mb_tit">' + title + '</span>';
            }
            if(type == "confirm"){
                _html += '<div id="mb_box"></div><div id="mb_con" class="alertBefore"><span id="mb_tit">' + title + '</span>';
            }

            if (type == "alert") {
                _html += '';
            }
                _html += '<div id="mb_ico" class="icon close"></div>';
            if (type == "alert") {
                _html += '<div id="mb_msg" class="mb_msg">' + msg + '</div><div id="mb_btnbox">';
            }
            if (type == "confirm") {
                _html += '<div id="mb_msg">' + msg + '</div><div id="mb_btnbox">';
            }
            if (type == "alert") {
                _html += '<input id="mb_btn_ok" type="button" value="确定" />';
            }
            if (type == "confirm") {
                _html += '<input id="mb_btn_no" type="button" value="取消" />';
                _html += '<input id="mb_btn_ok" type="button" value="确定" />';
            }
            _html += '</div></div>';

            //必须先将_html添加到body，再设置Css样式
            $("body").append(_html); GenerateCss();

            switch( type ) {
                case 'alert':

                    $("#mb_box").click(function(){
                        $.alerts._hide();
                        return;
                    })
                    $("#mb_ico").click( function() {
                        $.alerts._hide();
                        return;
                    });
                    $("#mb_btn_ok").click( function() {
                        $.alerts._hide();
                        callback(true);
                    });
                    $("#mb_btn_ok").focus().keypress( function(e) {
                        if( e.keyCode == 13 || e.keyCode == 27 ) $("#mb_btn_ok").trigger('click');
                    });
                    break;
                case 'confirm':

                    $("#mb_box").click(function(){
                        $.alerts._hide();
                        return;
                    })
                    $("#mb_btn_ok").click( function() {
                        $.alerts._hide();
                        if( callback ) callback(true);
                    });
                    $("#mb_btn_no").click( function() {
                    	//console.log(1234);
                        $.alerts._hide();
                        return;
                    });
                    $("#mb_ico").click( function() {
                        $.alerts._hide();
                        return;
                    });
                    $("#mb_btn_no").focus();
                    $("#mb_btn_ok, #mb_btn_no").keypress( function(e) {
                        if( e.keyCode == 13 ) $("#mb_btn_ok").trigger('click');
                        if( e.keyCode == 27 ) $("#mb_btn_no").trigger('click');
                    });
                    break;


            }
        },
        _hide: function() {
            $("#mb_box,#mb_con").remove();
        }
    }
    // Shortuct functions
    msgalert = function(title, message, callback) {
        $.alerts.alert(title, message, callback);
    }

    msgconfirm = function(title, message, callback) {
        $.alerts.confirm(title, message, callback);
    };





    //生成Css
    var GenerateCss = function () {

        $("#mb_box").css({ width: '100%', height: '100%', zIndex: '100', position: 'fixed',
            filter: 'Alpha(opacity=30)', backgroundColor: 'black', top: '0', left: '0', opacity: '0.3'
        });

        $("#mb_con").css({ zIndex: '102', width: '344px', height: '188px', paddingTop: '20px', position: 'fixed',
            backgroundColor: 'White', borderRadius: '10px', borderTop: '2px solid #fff', textAlign: 'center', boxShadow: '0 0 8px rgba(0,0,0,.3)'
        });

        $("#mb_msg").css({ margin: '30px 0 0', color: '#333', fontSize: '16px', wordBreak: 'break-all', padding: '0 10px', lineHeight: '18px',});
        $(".mb_msg").css({ margin: '30px 0 0', color: '#333', fontSize: '16px', wordBreak: 'break-all', padding: '0 10px', lineHeight: '18px',});

        $(".close").css({ width: '13px', height: '13px', display: 'block', position: 'absolute', right: '10px', top: '9px',
              cursor: 'pointer', background: 'url(../../images/close.png) 0 0 no-repeat', boxSizing: 'border-box'
        });

        $("#mb_tit").css({color:'#000', fontSize: '22px', cursor: 'default'})

        $("#mb_img").css({ marginTop: '30px'});

        $("#mb_btnbox").css({ padding: '0', textAlign: 'center', width: '100%', position: 'absolute', bottom: '30px', display: 'flex',justifyContent: 'space-around' });
        $("#mb_btn_ok,#mb_btn_no").css({ width: '60px', height: '30px', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px', outline:'none' });
        $("#mb_btn_ok").css({ backgroundColor: '#3d71f2'});
        $("#mb_btn_no").css({ backgroundColor: '#fff', color: '#bebdbd', border: '1px solid #bebdbd' });

        var _widht = document.documentElement.clientWidth; //屏幕宽
        var _height = document.documentElement.clientHeight; //屏幕高

        var boxWidth = $("#mb_con").width();
        var boxHeight = $("#mb_con").height();

        //让提示框居中
        $("#mb_con.alertWrapper").css({ top: (_height - boxHeight) / 2 + "px", left: (_widht - boxWidth) / 2 + "px" });


        if($('#msgMask').length > 0){
            var myleft = $('#msgMask').offset().left;
            var mytop = $('#msgMask').offset().top;
            $('.alertBefore').css({left: myleft-134+'px', top: '70px'});
        }else{
            $("#mb_con.alertBefore").css({ top: (_height - boxHeight) / 2 + "px", left: (_widht - boxWidth) / 2 + "px" });
        }
    }


})(jQuery);