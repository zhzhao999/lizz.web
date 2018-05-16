/**
 * @file 公用方法
 */


var url = 'http://www.photostars.cn:8020/index.php/web1_0/';//线上地址
var searchUrl = 'http://www.photostars.cn:8021/';//图片搜索地址
var config = {
  phoneLogin : url + 'accountsys/phoneLogin',  //手机号登录
  emailLogin : url + 'accountsys/mailLogin',  //邮箱登录
  designModeles: url + 'worksys/getDiffTypePoster',  //模板列表
  designFont : url + 'worksys/getFontList',  //操作区左侧文字模板

  getThemeList: url + 'homesys/getThemeList',  //获取首页主题列表
  getThemeTemplate: url +'homesys/getThemeTemplate',  //获取主题下模板列表
  myModuleLists: url + 'ownsys/getOwnTemplate',  //我的作品
  getFontfamily: url + 'worksys/getFontList',	//获取字体包列表
  deleteMyModule: url + 'ownsys/deleteTemplate',  //删除我的作品
  getDownloadFontUrl: url + 'worksys/getDownloadFontUrl',//使用某个字体，获取大的字体包URL
  recommendImage : url + 'worksys/getRecommendImageList',  //推荐图片
  getSearchImages: searchUrl + 'searchImage/', //搜索结果图片
  getMediaBuyInfo : url + 'worksys/getMediaBuyInfo',  //获取付费信息

  uploadOwnImage : url + 'ownsys/uploadOwnImage',   //批量上传
  getUploadImageList: url + 'ownsys/getUploadImageList',    //已上传元素
  deleteUploadImage: url + 'ownsys/deleteUploadImage',  //删除某个已上传元素

  pubtemplateName:url +'ownsys/modifyTemplateName' //上传模板名称
};

//	解析浏览器url携带参数
function UrlSearch  (){
   var name,value; 
   var str=location.href; //取得整个地址栏
   var num=str.indexOf("?") 
   str=str.substr(num+1); //取得所有参数   stringvar.substr(start [, length ]

   var arr=str.split("&"); //各个参数放到数组里
   for(var i=0;i < arr.length;i++){ 
    num=arr[i].indexOf("="); 
    if(num>0){ 
     name=arr[i].substring(0,num);
     value=arr[i].substr(num+1);
     this[name]=value;
     } 
    } 
} 
//var Request=new UrlSearch(); //实例化
//alert(Request.d);//取得参数d
//

// 模板类型尺寸
// col:显示列数
var templateType = [
  {id: 25, 'name': '手机海报', 'width': 1080, 'height': 1920, 'col': 2},
  {id: 27, 'name': '公众号首图', 'width': 900, 'height': 500, 'col': 1},
  {id: 28, 'name': '公众号封面小图', 'width': 200, 'height': 200, 'col': 2},
  {id: 31, 'name': '文章配图横版', 'width': 1080, 'height': 810, 'col': 2},
  {id: 32, 'name': '文章配图方形', 'width': 1080, 'height': 1080, 'col': 2},
  {id: 33, 'name': '文章配图竖版', 'width': 1080, 'height': 1440, 'col': 2},
  {id: 41, 'name': '邀请函', 'width': 1080, 'height': 1920, 'col': 2},
  {id: 51, 'name': '朋友圈封面图', 'width': 1280, 'height': 1184, 'col': 2},
  {id: 61, 'name': '微博封面电脑版', 'width': 920, 'height': 300, 'col': 1},
  {id: 62, 'name': '微博封面手机版', 'width': 640, 'height': 640, 'col': 2},
  {id: 63, 'name': '微博焦点图', 'width': 560, 'height': 260, 'col': 1},
  {id: 71, 'name': '二维码', 'width': 600, 'height': 600, 'col': 2},
]

function analysisTem(id){
  var type = {};
  $.each(templateType, function(index, el){
    if(el.id == id){
      type.name = el.name;
      type.width = el.width;
      type.height = el.height;
      type.col = el.col;
    }
  })
  return type;
}

var regColor = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
/*RGB颜色转换为16进制*/
String.prototype.colorHex = function(){
     var that = this;
     if(/^(rgb|RGB)/.test(that)){
          var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g,"").split(",");
          var strHex = "#";
          for(var i=0; i<aColor.length; i++){
               var hex = Number(aColor[i]).toString(16);
               if(hex === "0"){
                    hex += hex;    
               }
               strHex += hex;
          }
          if(strHex.length !== 7){
               strHex = that;    
          }
          return strHex;
     }else if(regColor.test(that)){
          var aNum = that.replace(/#/,"").split("");
          if(aNum.length === 6){
               return that;    
          }else if(aNum.length === 3){
               var numHex = "#";
               for(var i=0; i<aNum.length; i+=1){
                    numHex += (aNum[i]+aNum[i]);
               }
               return numHex;
          }
     }else{
          return that;    
     }
};

/*16进制颜色转为RGB格式*/
// String.prototype.colorRgb = function(){
//      var sColor = this.toLowerCase();
//      if(sColor && reg.test(sColor)){
//           if(sColor.length === 4){
//                var sColorNew = "#";
//                for(var i=1; i<4; i+=1){
//                     sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));    
//                }
//                sColor = sColorNew;
//           }
//           //处理六位的颜色值
//           var sColorChange = [];
//           for(var i=1; i<7; i+=2){
//                sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));    
//           }
//           return "RGB(" + sColorChange.join(",") + ")";
//      }else{
//           return sColor;    
//      }
// };
// function (){
//      var sColor = this.toLowerCase();
//      if(sColor && reg.test(sColor)){
//           if(sColor.length === 4){
//                var sColorNew = "#";
//                for(var i=1; i<4; i+=1){
//                     sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));    
//                }
//                sColor = sColorNew;
//           }
//           //处理六位的颜色值
//           var sColorChange = [];
//           for(var i=1; i<7; i+=2){
//                sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));    
//           }
//           return "RGB(" + sColorChange.join(",") + ")";
//      }else{
//           return sColor;    
//      }
// }