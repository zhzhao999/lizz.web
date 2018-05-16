$(function () {
//定义是否可调用发布按钮事件的标识符
var Ispublish = false;
//发布框关闭按钮
$('.closePublish').click(function () {
	$('.publishContent').fadeOut(200);
});
//发布框打开按钮
$('.openPublish').click(function () {
	$('.publishContent').fadeIn(200);
});
	
//发布框输入完成进行判断提交按钮是否打开	
$('.inputbox>input').blur(function () {
	if ($('.keyword').val()!=''&&$('.templeTtitle').val()!='') {
		$('.publishBtn').addClass('publishBtnOk');
		Ispublish = true;
	}else{
		$('.publishBtn').removeClass('publishBtnOk');
		Ispublish = false;
	}
});

//发布按钮事件	
$('.publishBtn').click(function () {
//	if (Ispublish == true) {
		var titleVal = $('.templeTtitle').val();
		var keywordVal = $('.keyword').val();
		if (titleVal.length>30||keywordVal>50) {
			if (titleVal.length>30) {
				$('.templeTtitleBox .info').show();
			}else{
				$('.templeTtitleBox .info').hide();
			}
			if (keywordVal.length>50) {
				$('.keywordBox .info').show();
			}else{
				$('.keywordBox .info').hide();
			}
		} else{
			//开始发布功能，整合模板数据，画模板
			//发布精度条
            $.downProcess();
			$.dataSync('pub');
			
		}

});
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
})
