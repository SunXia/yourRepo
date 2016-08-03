// JavaScript Document
var _g = function (id) {
    return "string" == typeof id ? document.getElementById(id) : id;
};

var Class = {
  create: function() {
    return function() {
      this.initialize.apply(this, arguments);
    }
  }
}

Object.extend = function(destination, source) {
    for (var property in source) {
        destination[property] = source[property];
    }
    return destination;
}

function addEventHandler(oTarget, sEventType, fnHandler) {
    if (oTarget.addEventListener) {
        oTarget.addEventListener(sEventType, fnHandler, false);
    } else if (oTarget.attachEvent) {
        oTarget.attachEvent("on" + sEventType, fnHandler);
    } else {
        oTarget["on" + sEventType] = fnHandler;
    }
};


var Scroller = Class.create();
Scroller.prototype = {
  initialize: function(idScroller, idScrollMid, options) {
    var oScroll = this, oScroller = _g(idScroller), oScrollMid = _g(idScrollMid);
    
    this.heightScroller = oScroller.offsetHeight;
    this.heightList = oScrollMid.offsetHeight;
    
    if(this.heightList <= this.heightScroller) return;
    
    oScroller.style.overflow = "hidden";
    oScrollMid.appendChild(oScrollMid.cloneNode(true));
    
    this.oScroller = oScroller;    
    this.timer = null;
    
    this.SetOptions(options);
    
    this.side = 1;//1是上 -1是下
    switch (this.options.Side) {
        case "down" :
            this.side = -1;
            break;
        case "up" :
        default :
            this.side = 1;
    }
    
    addEventHandler(oScrollMid , "mouseover", function() { oScroll.Stop(); });
    addEventHandler(oScrollMid , "mouseout", function() { oScroll.Start(); });
    
    if(this.options.PauseStep <= 0 || this.options.PauseHeight <= 0) this.options.PauseStep = this.options.PauseHeight = 0;
    this.Pause = 0;
    
    this.Start();
  },
  //设置默认属性
  SetOptions: function(options) {
    this.options = {//默认值
      Step:            1,//每次变化的px量
      Time:            25,//速度(越大越慢)
      Side:            "up",//滚动方向:"up"是上，"down"是下
      PauseHeight:    0,//隔多高停一次
      PauseStep:    1500//停顿时间(PauseHeight大于0该参数才有效)
    };
    Object.extend(this.options, options || {});
  },
  //滚动
  Scroll: function() {
    var iScroll = this.oScroller.scrollTop, iHeight = this.heightList, time = this.options.Time, oScroll = this, iStep = this.options.Step * this.side;
    
    if(this.side > 0){
        if(iScroll >= (iHeight * 2 - this.heightScroller)){ iScroll -= iHeight; }
    } else {
        if(iScroll <= 0){ iScroll += iHeight; }
    }
    
    if(this.options.PauseHeight > 0){
        if(this.Pause >= this.options.PauseHeight){
            time = this.options.PauseStep;
            this.Pause = 0;
        } else {
            this.Pause += Math.abs(iStep);
            this.oScroller.scrollTop = iScroll + iStep;
        }
    } else { this.oScroller.scrollTop = iScroll + iStep; }
    
    this.timer = window.setTimeout(function(){ oScroll.Scroll(); }, time);
  },
  //开始
  Start: function() {
    this.Scroll();
  },
  //停止
  Stop: function() {
    clearTimeout(this.timer);
  }
};

window.onload = function(){
    new Scroller("idScroller", "idScrollMid",{ PauseHeight:25 });
	new Scroller("idScroller_2", "idScrollMid_2",{ PauseHeight:25 });
}