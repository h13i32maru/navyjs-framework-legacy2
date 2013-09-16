Navy.Transition.SlideOver = Navy.Class({
  CLASSNAME: 'Navy.Transition.SlideOver',

  $static: {
    initAnimationStyle: false
  },

  _beforeView: null,
  _afterView: null,

  initialize: function(beforeView, afterView){
    this._beforeView = beforeView;
    this._afterView = afterView;

    var width = Navy.Config.app.size.width;

    if (!this.$static.initAnimationStyle) {
      var animIn  = '@-webkit-keyframes slide_over_in  {100% {-webkit-transform: translateX(0)}}';
      var animOut = '@-webkit-keyframes slide_over_out {100% {-webkit-transform: translateX(%width%px)}}'.replace('%width%', width);
      var styleElm = document.createElement('style');
      styleElm.textContent = animIn + animOut;
      document.head.appendChild(styleElm);
    }

    var elm = afterView.getElement();
    elm.style.webkitAnimation = '0.5s both';
    elm.style.webkitTransform = 'translateX(%width%px)'.replace('%width%', width);
  },

  start: function(callback) {
    var elm = this._afterView.getElement();

    var cb = function(){
      this._beforeView.hide();
      var elm = this._afterView.getElement();
      elm.removeEventListener('webkitAnimationEnd', cb);
      elm.style.webkitTransform = '';
      elm.style.webkitAnimationName = '';
      callback && callback();
    }.bind(this);

    elm.addEventListener('webkitAnimationEnd', cb);

    elm.style.webkitAnimationName = 'slide_over_in';
  },

  back: function(callback) {
    this._beforeView.show();
    var elm = this._afterView.getElement();

    var cb = function(){
      var elm = this._afterView.getElement();
      elm.removeEventListener('webkitAnimationEnd', cb);
      callback && callback();
    }.bind(this);

    elm.addEventListener('webkitAnimationEnd', cb);

    elm.style.webkitAnimationName = 'slide_over_out';

  }
});
