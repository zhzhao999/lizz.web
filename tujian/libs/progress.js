function ProgressBar(option){
    this._init(option);
}
//属性：  width， height ， x， y  ，innerStyle， outerStyle ， cornerRadius  
//行为：修改进度条的进度  changeValue( val )       
// 把进度条添加到层：addToGroupOrLayer( arg );  
ProgressBar.prototype={
    _init:function(option){
        this.width=option.width;
        this.height=option.height;
        this.x=option.x;
        this.y=option.y;
        this.fill=option.fill;
        this.stroke=option.stroke;
        this.strokeWidth=option.strokeWidth;//线条宽度  
        // this.rect=option.rect;//传递过来的矩形  

        var innerRect=new Konva.Rect({
            x:this.x,
            y:this.y,
            width:0,
            height:this.height,
            fill:this.fill,//填充色  
            cornerRadius: 1/2* this.height,
            id:'innerRect',
            name:'zzz'
        });
        this.innerRect=innerRect;//填充的内部矩形  
        var outerRect=new Konva.Rect({
            x:this.x,
            y:this.y,
            width:this.width,
            height:this.height,
            stroke:this.stroke,//框的线条颜色  
            cornerRadius: 1/2* this.height
        });
        this.outerRect=outerRect;

        this.Group=new Konva.Group({
            x:0,
            y:0
        });
        this.Group.add(innerRect);//将创建的矩形添加到父盒子Group中，有利于整理当创建多个矩形时调用  
        this.Group.add(outerRect);

    },
    addToGroupOrLayer:function(layer){
        layer.add(this.Group);//将父亲盒子Group添加层上去  
    },
    changeValue: function( val ) {
        //传进来的进度  
        if( val > 1 ) { //   1 - 100   vs   0 -1     =>0.5  
            val = val /100;
        }
        //做动画 val = .3 .7  
        var width2 = this.width * val; //最终进度条内部矩形的 宽度。  

        // 通过“id选择器”去查找内部的子元素。对应innerRect里面的ID  
        var innerRect = this.Group.findOne('#innerRect');
        // find:返回一个数组，findOne:返回一个  
        //类选择器，可能会查找多个  
        // var innerRect = this.Group.findOne('.zzz');  
        //标签选择器  
        // var innerRect = this.Group.findOne('Rect');  
        // 和Jquery中的查找方式很相似  
        // var innerRect = this.innerRect;  

        // to动画系统： 让我们的物件 变换到某个状态  
        // 让我们的 物件从 "当前状态 到 下面设置的状态，  
        innerRect.to({
            width: width2,
            duration: .3,//当前的状态到宽度为width2的状态，持续0.3秒  
            easing: Konva.Easings.EasIn//动画效果  
        });

    }
}  