$(function(){
	document.onkeydown=function(event){
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if(e && e.keyCode==13){ // enter 键
            $('#login').trigger('click');
        }
    };

    var regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    var regPhone = /^1\d{10}$/;   /*11位数字*/
    var regPwd = /^[0-9a-zA-Z_]{6,18}$/;
    var app = new Vue({
        el: '#webPc',
        data: {
            accountName: '',    /*当前输入的账号*/
            accountType: 0,     /*1手机号，2邮箱*/
            password: '',       /*密码*/
            accountTip: '',     /*账号错误提示*/
            passwordTip: '',    /*密码错误提示*/
        },
        created: function() {
            
        },
        methods: {
            checkAccount: function(){
                if(this.accountName.length == 0){
                    this.accountTip = '账号不能为空';
                    return;
                }else{
                    this.accountTip = '';
                }
                if(regPhone.test(this.accountName)){
                    this.accountType = 1;   /*1手机号，2邮箱*/
                }else if(regEmail.test(this.accountName)){
                    this.accountType = 2;
                }else{
                    this.accountType = 0;
                    this.accountTip = '请输入手机号/邮箱';
                }
            },
            checkPassword: function(){
                if(this.password.length == 0) {
                    this.passwordTip = '密码不能为空';
                }else if(!regPwd.test(this.password)){
                    this.passwordTip = '请输入6-18位密码';
                }else{
                    this.passwordTip = '';
                }
            },
            submitLogin: function(){
                var _this = this;
                if(this.accountTip == '' && this.passwordTip == ''){
                    Save();
                    _this.checkAccount();
                    var base = new Base64();  
                    var result = base.encode(_this.password);  //加密
                    // 2.解密  
                    // var result2 = base.decode(result);
                    if(this.accountType == 1){  /*手机号登录*/
                        $.ajax({
                            url: config.phoneLogin,
                            type: 'post',
                            dataType: 'json',
                            data: {
                                authorityKey: '9670f10b8b17ea61010375bfbe08138d',
                                zoneNumber: '+86',
                                phoneNumber: _this.accountName,
                                password: result
                            },
                            success: function(data){
                                //console.log(data);
                                if(data.status == 1){
                                    localStorage.setItem('userInfo', JSON.stringify(data));
                                    window.location.href = '../index/createOpus.html';
                                }else if(data.status == -1){
                                    _this.accountTip = '参数出错';
                                }else if(data.status == -3){
                                    _this.passwordTip = '密码错误';
                                }else if(data.status == -4){
                                    _this.passwordTip = '今日输入错误密码次数过多';
                                }else if(data.status == -5){
                                    _this.accountTip = '手机号未注册';
                                }
                            },
                            error: function(){
                                console.log('error');
                            }
                        })
                    }else if(this.accountType == 2) {
                        $.ajax({
                            url: config.emailLogin,
                            type: 'post',
                            dataType: 'json',
                            data: {
                                authorityKey: '9670f10b8b17ea61010375bfbe08138d',
                                emailAddress: _this.accountName,
                                password: result
                            },
                            success: function(data){
                                //console.log(data);
                                if(data.status == 1){
                                    localStorage.setItem('userInfo', JSON.stringify(data));
                                    alert(window.location.href);
                                    window.location.href = '../index/createOpus.html';
                                }else if(data.status == -1){
                                    _this.accountTip = '参数出错';
                                }else if(data.status == -3){
                                    _this.passwordTip = '密码错误';
                                }else if(data.status == -4){
                                    _this.passwordTip = '今日输入错误密码次数过多';
                                }else if(data.status == -5){
                                    _this.accountTip = '邮箱未注册';
                                }
                            }
                        })
                    }
                }
            }
        }
    })
    document.onkeydown=function(event){
        var e = event || window.event || arguments.callee.caller.arguments[0];
         if(e && e.keyCode==13){ // enter 键
            app.submitLogin();
        }
    }
	

    $('#checkbox').on('click', function(){
        $(this).children('span').toggleClass('on');
    })
//记住用户名密码
    $(document).ready(function () {
        if ($.cookie("rmbUser") == "true") {
            $("#checkbox span").hasClass('on');
            app.$data.accountName = $.cookie("username");
            app.$data.password = $.cookie("password");
        }
    });
    function Save() {
        if ($("#checkbox span").hasClass('on')) {
            var str_username = app.$data.accountName;
            var str_password = app.$data.password;
            $.cookie("rmbUser", "true", { expires: 7 }); //存储一个带7天期限的cookie
            $.cookie("username", str_username, { expires: 7 });
            $.cookie("password", str_password, { expires: 7 });
        }
        else {
            $.cookie("rmbUser", "false", { expire: -1 });
            $.cookie("username", "", { expires: -1 });
            $.cookie("password", "", { expires: -1 });
        }
    };
})