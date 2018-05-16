var userInfo = JSON.parse(localStorage.getItem('userInfo'));
Vue.component('qrcode-pay', {
	template: `
		<div class="modalContent">
	    	<div class="modalContentMask" @click.stop="closePay()"></div>
	    	<div class="dialog fluidDialog">
				<a class="close" title="Close this dialog"  @click.stop="closePay()"></a>
	    		<h2 class="dialog-title">购买付费元素</h2>
	    		<div id="operPayElement">
	    			<div class="payment">
						<table class="itemList">
							<tbody>
								<tr class="license" v-for="list in pages.mediaInfo">
									<td class="thumbnail">
										<div class="cover"><img :src="list.showImageUrl" alt=""></div>
									</td>
									<td class="info">
										<div class="title" :title="list.text">{{list.text?list.text:'暂无名称'}}</div>
										<div class="by">来源：{{list.scource?list.scource:'图简'}}</div>
									</td>
									<td class="price" v-if="myUserInfo.vipType==0">
										<div class="vipFree" v-if="list.priceActual==0">免费</div>
										<div class="vipFree" v-else>￥ {{list.priceActual}}</div>
									</td>
									<td class="price" v-else>
										<div class="vipFree" v-if="list.priceActual==0">会员免费</div>
										<div class="vipFree" v-else>￥ {{list.priceActual}}</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="total talign-rig">  <!-- 统计总价格 -->
						<div><span class="name fl">总计</span><span class="totalCost"><p class="originalPrice"><label>￥ {{pages.totalOriginalPrice}}</label></p></span></div>
						<div class="color" v-if="pages.totalVipPrice!=0"><span class="name fl">会员价</span><span class="totalCost"><p class="originalPrice"><label>￥ {{pages.totalVipPrice}}</label></p></span></div>
						<div class="color"><span class="name fl">全场4折大促</span><span class="totalCost"><p class="presentPrice">￥ {{pages.discountPrice}}</p></span></div></div>
					</div>
					<div class="gratisDownWrapper" v-if="pages.discountPrice == 0">  <!-- 如果价格为0 -->
						<button class="dowm" @click="oneBtnDown()">一键下载</button>
					</div>
					<div class="payDownWrapper" v-else>   <!-- 如果价格不为0 -->
						<span class="openVip"><a href="#">开通会员至少省<em>¥180</em>&gt;&gt;点击了解</a></span>
						<h3 class="mode">支付方式</h3>
						<div class="choice">
							<button class="alipay" @click="payMoney($event, 1)">支付宝</button>
							<button class="wechat" @click="payMoney($event, 2)">微信支付</button>
						</div>
					</div>
		    		<div class="understandInfo">
		    			<a href="#">支付条款服务协议</a>和<a href="#">了解标准与扩展授权</a>
		    		</div>
	    		</div>

				
			    <!-- 付费二维码 -->
			    <div class="qrCodeWrapper" v-if="qrCodeFlag" @click.stop="qrCodeFlag = !qrCodeFlag">
			    	<div class="qrCodeBox">
			    		<div class="qrCode"></div>
			    		<div class="tip">{{qrTip}}扫描二维码完成支付</div>
			    		<div class="price">￥ 100000</div>
			    		<a class="close" title="Close this dialog" @click.stop="qrCodeFlag = !qrCodeFlag"></a>
			    	</div>
			    </div>
			    <!-- 付费二维码end -->
	    	</div>
	    </div>
	`,
	props: {
		parenteles: {
			type: Object
		},
		templateid: {
			type: Number,
			default: 0
		}
	},
	data(){
		return{
            myUserInfo: userInfo,
            fixedParam: {
                authorityKey: '9670f10b8b17ea61010375bfbe08138d',
                userID: userInfo.userID,
                token: userInfo.token,
            },
			parentpages: [],
			pages: {},
            qrCodeFlag: false,    /*二维码弹层*/
            qrTip: '支付宝',
		}
	},
	created(){
		var _this = this;
		this.parentpages = this.parenteles.content.pages;
		var datas =[];
		var removalData = [];
		if(this.templateid){
			datas = [{'id':this.templateid,'type':1}];  //首先设置模板id 
			removalData = [this.templateid];
		}
		$.each(_this.parentpages, function(i){
			var objects = _this.parentpages[i].objects;
			$.each(objects, function(j){
				var object = objects[j];
				var obj = {};
				//isBackground：是否是背景  true是（背景颜色）  false不是（图片）
				if(object.type == 'photo' && !object.isBackground){  //图片
					obj.id = object.imageId;obj.id
					obj.id = obj.id.substring(obj.id.indexOf("/")+1, obj.id.length);
					obj.type = 2;
					if($.inArray(obj.id, removalData) == -1){
						datas.push(obj);
						removalData.push(obj.id);
					}
				}else if(object.type == 'vector'){  //插图
					obj.id = object.imageId;
					obj.type = 3;
					if($.inArray(obj.id, removalData) == -1){
						datas.push(obj);
						removalData.push(obj.id);
					}
				}else if(object.type == 'text'){
					obj.id = object.fontFamily;
					obj.type = 4;
					if($.inArray(obj.id, removalData) == -1){
						datas.push(obj);
						removalData.push(obj.id);
					}
				}
			})
		})

		// console.log(datas);
		$.ajax({
			url: config.getMediaBuyInfo,
			type: 'post',
			dataType: 'json',
			async: false,
			data: {
                authorityKey: _this.fixedParam.authorityKey,
                userID: _this.fixedParam.userID,
                token: _this.fixedParam.token,
	            elementData: JSON.stringify(datas),
			},
			success: function(data){
				if(data.status == 1){
					$('#payWrapper').fadeIn();
					_this.pages = data;
				}
			}
		})
	},
	methods: {
		oneBtnDown: function(){
			// 开始下载 显示进度条
            $('.downProcess').show();
            //重新下载
            //$('.downFinish').hide();
            //下载遮罩层显示进度条
            $.downProcess();
            this.$emit('changemyflag', false);
			$.downPre(this.parenteles, 'down');
		},
		payMoney: function(e, type){
			this.qrCodeFlag = true;
			if(type==1){
				this.qrTip = '支付宝';
			}else if(type==2){
				this.qrTip = '微信';
			}
		},
        closePay: function(){
            this.$emit('changemyflag', false);
        },
	},
})
// function downJsons(element, temId){
// 	console.log(temId);
// 	temId = 679;
// 	// console.log(element);
// 	// console.log(temId);
// 	var pages = element.content.pages;
// 	var datas =[];
// 	var removalData = [];
// 	if(temId){
// 		datas = [{'id':temId,'type':1}];  //首先设置模板id 
// 		removalData = [temId];
// 	}
// 	$.each(pages, function(i){
// 		var objects = pages[i].objects;
// 		$.each(objects, function(j){
// 			var object = objects[j];
// 			var obj = {};
// 			//isBackground：是否是背景  true是（背景颜色）  false不是（图片）
// 			if(object.type == 'photo' && !object.isBackground){  //图片
// 				obj.id = object.imageId;obj.id
// 				obj.id = obj.id.substring(obj.id.indexOf("/")+1, obj.id.length);
// 				obj.type = 2;
// 				if($.inArray(obj.id, removalData) == -1){
// 					datas.push(obj);
// 					removalData.push(obj.id);
// 				}
// 			}else if(object.type == 'vector'){  //插图
// 				obj.id = object.imageId;
// 				obj.type = 3;
// 				if($.inArray(obj.id, removalData) == -1){
// 					datas.push(obj);
// 					removalData.push(obj.id);
// 				}
// 			}else if(object.type == 'text'){
// 				obj.id = object.fontFamily;
// 				obj.type = 4;
// 				if($.inArray(obj.id, removalData) == -1){
// 					datas.push(obj);
// 					removalData.push(obj.id);
// 				}
// 			}
// 		})
// 	})
// 	// console.log(datas);
// 	$.ajax({
// 		url: config.getMediaBuyInfo,
// 		type: 'post',
// 		dataType: 'json',
// 		async: false,
// 		data: {
//             'authorityKey': '9670f10b8b17ea61010375bfbe08138d',
//             'userID': userInfo.userID,
//             'token': userInfo.token,
//             'elementData': JSON.stringify(datas),
// 		},
// 		success: function(data){
// 			if(data.status == 1){

// 				// $('.modalContent').fadeOut();
// 				$('#payWrapper').fadeIn();
// 				showPayInfo(data);
//     			$('.payment').mCustomScrollbar({ theme:"minimal"});
// 				$('#operPayElement .dowm').on('click', function(){
// 					// 开始下载 显示进度条
//                     $('.downProcess').show();
//                     //重新下载
//                     //$('.downFinish').hide();
//                     //下载遮罩层显示进度条
//                     $.downProcess();
// 					$.downPre(element,'down');
// 				});
// 			}
// 		}
// 	})
// }
// // 购买元素信息
// function showPayInfo(data){
// 	var html = '';
// 	html += '<div class="payment">' +
// 				'<table class="itemList">' +
// 					'<tbody>'+ payInfo(data.mediaInfo) +'</tbody>' +
// 				'</table>' +
// 			'</div>' +
// 			'<div class="total talign-rig">' +
// 				'<div><span class="name fl">总计</span><span class="totalCost"><p class="originalPrice"><label>￥ '+ data.totalOriginalPrice +'</label></p></span></div>';
// 	if(data.totalVipPrice != 0){ //会员价不为0的时候，显示会员价
// 		html += '<div class="color"><span class="name fl">会员价</span><span class="totalCost"><p class="originalPrice"><label>￥ '+ data.totalVipPrice +'</label></p></span></div>';
// 	}
// 		html += '<div class="color"><span class="name fl">全场4折大促</span><span class="totalCost"><p class="presentPrice">￥ '+ data.discountPrice +'</p></span></div></div>';
// 	if(data.discountPrice == 0){
// 		html += '<div class="gratisDownWrapper">' +
// 					'<button class="dowm">一键下载</button>' +
// 				'</div>';
// 	}else{
// 		html += '<div class="payDownWrapper">' +
// 					'<span class="openVip"><a href="#">开通会员至少省<em>¥180</em>&gt;&gt;点击了解</a></span>' +
// 					'<h3 class="mode">支付方式</h3>' +
// 					'<div class="choice">' +
// 						'<button class="alipay" onclick="payMoney(1)">支付宝</button>' +
// 						'<button class="wechat" onclick="payMoney(2)">微信支付</button>' +
// 					'</div>' +
// 				'</div>';
// 	}
// 	$('#operPayElement').html(html);
// }
// function payInfo(infos){
// 	var html = '';
// 	$.each(infos, function(i){
// 		var info = infos[i];
// 		if(!info.text) info.text = '暂无名称';
// 		if(!info.scource) info.scource = '图简';
// 		html += '<tr class="license">' +
// 				'<td class="thumbnail">' +
// 					'<div class="cover"><img src="'+ info.showImageUrl +'" alt=""></div>' +
// 				'</td>' +
// 				'<td class="info">' +
// 					'<div class="title">'+ info.text +'</div>' +
// 					'<div class="by">来源：'+ info.scource +'</div>' +
// 				'</td>' +
// 				'<td class="price"><div class="select">';

// 		if(userInfo.vipType == 0){
// 			if(info.priceActual == 0){ //应付价格
// 				html += '<div class="vipFree">免费</div>';
// 			}else{
// 				html += '<div class="vipFree">￥ '+ info.priceActual +'</div>';
// 			}
// 		}else{
// 			if(info.typerUser == 1){ //应付价格
// 				html += '<div class="vipFree">会员免费</div>';
// 			}else{
// 				html += '<div class="vipFree">￥ '+ info.priceActual +'</div>';
// 			}
// 		}
		
		
// 		html += '</div></td></tr>';
// 	})
// 	return html;
// }

// function payMoney(type){
//     $(this).addClass('on').siblings('button').removeClass('on');
//     $('#qrCodeWrapper').fadeIn();
//     if(type == 1){
//         $('#qrCodeBox .tip').html('支付宝扫描二维码完成支付');
//     }else if(type == 2){
//         $('#qrCodeBox .tip').html('微信扫描二维码完成支付');
//     }
// }

/*<div class="modalContent" id="payWrapper" style="display: none;">
	<div class="modalContentMask" @click.stop="closePay()"></div>
	<div class="dialog fluidDialog">
		<h2 class="dialog-title">购买付费元素</h2>
		<div id="operPayElement">
			<div class="payment">
				<table class="itemList">
					<tbody>
						<tr class="license">
							<td class="thumbnail">
								<div class="cover"></div>  <!-- 设置其背景图片 -->
							</td>
							<td class="info">
								<div class="title">1111我是名称我是名称我是名称我是名称我是名称我是名称我是名称我是名称我是名称我是名称</div>
								<div class="by">来源：123</div>
							</td>
							<td class="price">
								<div class="select">
									<i class="iconfont icon-xiala"></i>
									<select>
										<option selected value="1">一次 ￥1</option>
										<option value="2">标准 ￥60</option>
										<option value="3">扩展 ￥120</option>
									</select>
								</div>
								<!-- <div class="vipFree">会员免费</div> -->  <!-- 是会员的时候显示 -->
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="total talign-rig">
				<span class="name fl">总计</span>
				<span class="totalCost">
					<p class="originalPrice"><label>￥ 200</label></p>
					<p class="presentPrice">￥ 10</p>
				</span>
			</div>
			<div class="gratisDownWrapper">  <!-- 如果价格为0 -->
				<button class="dowm" onclick="$.dataSync('down');">一键下载</button>
			</div>
			<!-- 如果价格不为0 -->
			<div class="payDownWrapper" style="display: none;">
				<span class="openVip"><a href="#">开通会员至少省<em>¥180</em>&gt;&gt;点击了解</a></span>
				<h3 class="mode">支付方式</h3>
				<div class="choice">
					<button class="alipay" @click="payMoney($event, 1)">支付宝</button>
					<button class="wechat" @click="payMoney($event, 2)">微信支付</button>
				</div>
			</div>
		</div>
		<div class="understandInfo">
			<a href="#">支付条款服务协议</a>和<a href="#">了解标准与扩展授权</a>
		</div>
		<a class="close" title="Close this dialog"  @click.stop="closePay()"></a>
		
	    付费二维码
	    <div class="qrCodeWrapper" id="qrCodeWrapper" style="display: none;" @click.stop="closeQrCode()">
	    	<div class="qrCodeBox" id="qrCodeBox">
	    		<div class="qrCode"></div>
	    		<div class="tip">微信扫描二维码完成支付</div>
	    		<div class="price">￥ 100000</div>
	    		<a class="close" title="Close this dialog" @click.stop="closeQrCode()"></a>
	    	</div>
	    </div>
	    付费二维码end
	</div>
</div>*/