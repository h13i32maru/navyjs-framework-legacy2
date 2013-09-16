Navy.Transition.Fade = Navy.Class({
  CLASSNAME: 'Navy.Transition.Fade',

  $static: {
    initAnimationStyle: false
  },

  _beforeView: null,
  _afterView: null,

  initialize: function(beforeView, afterView){
    this._beforeView = beforeView;
    this._afterView = afterView;

    if (!this.$static.initAnimationStyle) {
      var animIn  = '@-webkit-keyframes fade_in  {100% {opacity: 1}}';
      var animOut = '@-webkit-keyframes fade_out {100% {opacity: 0}}';
      var styleElm = document.createElement('style');
      styleElm.textContent = animIn + animOut;
      document.head.appendChild(styleElm);
      this.$static.initAnimationStyle = true;
    }

    var elm = afterView.getElement();
    elm.style.webkitAnimation = '0.5s';
    elm.style.opacity = '0';

    if (beforeView) {
      var elm = beforeView.getElement();
      elm.style.webkitAnimation = '0.5s';
    }
  },

  start: function(callback) {
    if (!this._beforeView) {
      var elm = this._afterView.getElement();
      elm.style.opacity = '';
      callback && callback();
      return;
    }

    var cb1 = function(){
      this._beforeView.hide();
      var elm = this._beforeView.getElement();
      elm.removeEventListener('webkitAnimationEnd', cb1);
      elm.style.webkitAnimationName = '';

      var elm = this._afterView.getElement();
      elm.addEventListener('webkitAnimationEnd', cb2);
      elm.style.opacity = 0;
      elm.style.webkitAnimationName = 'fade_in';
    }.bind(this);

    var cb2 = function(){
      var elm = this._afterView.getElement();
      elm.removeEventListener('webkitAnimationEnd', cb2);
      elm.style.opacity = '';
      elm.style.webkitAnimationName = '';
      callback && callback();
    }.bind(this);

    var elm = this._beforeView.getElement();
    elm.addEventListener('webkitAnimationEnd', cb1);
    elm.style.webkitAnimationName = 'fade_out';
  },

  back: function(callback) {
    if (!this._beforeView) {
      return;
    }

    var cb1 = function(){
      this._afterView.hide();
      var elm = this._afterView.getElement();
      elm.removeEventListener('webkitAnimationEnd', cb1);
      elm.style.webkitAnimationName = '';

      var elm = this._beforeView.getElement();
      elm.addEventListener('webkitAnimationEnd', cb2);
      elm.style.opacity = 0;
      elm.style.webkitAnimationName = 'fade_in';
      this._beforeView.show();
    }.bind(this);

    var cb2 = function(){
      var elm = this._beforeView.getElement();
      elm.removeEventListener('webkitAnimationEnd', cb2);
      elm.style.opacity = 1;
      elm.style.webkitAnimationName = '';
      callback && callback();
    }.bind(this);

    var elm = this._afterView.getElement();
    elm.addEventListener('webkitAnimationEnd', cb1);
    elm.style.webkitAnimationName = 'fade_out';
  }
});

