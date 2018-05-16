$(function(){
	var app = new Vue({
        el: '#webPc',
        data: {
            //nickName: $.session.get('nickName')
            designWidth: '',
            designHeight: '',
        },
        methods: {
            jumpPage_(id){
                window.location.href = '../publish/publish.html?id='+id;
            },

        	docTypeMore:function () {
				var arr =$('.docTypeCategory');
				var h=0;
				for (var i=1;i<arr.length;i++) {
					var h0=parseInt($(arr[i]).css('height'));
					h+=h0;
				}
        		
        		var length=$('.docTypeAdvanced>.docTypeCategory').length;
        			$('.docTypeAdvanced').animate({
        				height:h+200+'px'
        			}
        		);
        	}
        }

    })

    $(window).resize(function(event) {
        resizeMore();
    });
    resizeMore();
    function resizeMore(){
        /*if($('.docTypeRightMore').height() > 177){
            $('.docTypeMore').addClass('on');
        }else{
            $('.docTypeMore').removeClass('on');
        }*/
    }
    
    
    ;(function () {
    	var arr =$('.docTypeCategory');
		var h=0;
		for (var i=1;i<arr.length;i++) {
			var h0=parseInt($(arr[i]).css('height'));
			h+=h0;
		}
    	
    	var length=$('.docTypeAdvanced>.docTypeCategory').length;
		$('.docTypeAdvanced').animate({
				height:h+200+'px'
			}
		);
    })();

    //关闭

});