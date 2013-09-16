Navy.Transition.SlideOver = Navy.Class(Navy.Transition.Transition, {
  CLASSNAME: 'Navy.Transition.SlideOver',

  $static: {
    initAnimationStyle: false
  },

  _beforeView: null,
  _afterView: null,

  initialize: function(beforeView, afterView){
    this._beforeView = beforeView;
    this._afterView = afterView;

    if (!this.$static.initAnimationStyle) {
      this._addAnimationStyle();
      this.$static.initAnimationStyle = true;
    }

    var width = Navy.Config.app.size.width;
    afterView.setRawStyle({webkitAnimation: '0.5s', webkitTransform: 'translateX(' + width + 'px)'});
  },

  _addAnimationStyle: function(){
    var width = Navy.Config.app.size.width;
    var animIn  = '@-webkit-keyframes slide_over_in  {100% {-webkit-transform: translateX(0)}}';
    var animOut = '@-webkit-keyframes slide_over_out {100% {-webkit-transform: translateX(%width%px)}}'.replace('%width%', width);
    var styleElm = document.createElement('style');
    styleElm.textContent = animIn + animOut;
    document.head.appendChild(styleElm);
  },

  start: function(callback) {
    if (!this._beforeView) {
      this._afterView.setRawStyle({webkitTransform: 'none'});
      callback && callback();
      return;
    }

    var cb = function(){
      this._beforeView.hide();
      this._afterView.removeRawEventListener('webkitAnimationEnd', cb);
      this._afterView.setRawStyle({webkitTransform: 'none', webkitAnimationName: 'none'});
      callback && callback();
    }.bind(this);

    this._afterView.addRawEventListener('webkitAnimationEnd', cb);
    this._afterView.setRawStyle({webkitAnimationName: 'slide_over_in'});
  },

  back: function(callback) {
    if (!this._beforeView) {
      callback && callback();
      return;
    }

    var cb = function(){
      this._afterView.removeRawEventListener('webkitAnimationEnd', cb);
      callback && callback();
    }.bind(this);

    this._beforeView.show();
    this._afterView.addRawEventListener('webkitAnimationEnd', cb);
    this._afterView.setRawStyle({webkitAnimationName: 'slide_over_out'});
  }
});
