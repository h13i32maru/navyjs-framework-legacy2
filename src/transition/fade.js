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
      this._addAnimationStyle();
      this.$static.initAnimationStyle = true;
    }

    beforeView && beforeView.setRawStyle({webkitAnimation: '0.5s'});
    afterView && afterView.setRawStyle({webkitAnimation: '0.5s', opacity: 0});
  },

  _addAnimationStyle: function(){
    var animIn  = '@-webkit-keyframes fade_in  {100% {opacity: 1}}';
    var animOut = '@-webkit-keyframes fade_out {100% {opacity: 0}}';
    var styleElm = document.createElement('style');
    styleElm.textContent = animIn + animOut;
    document.head.appendChild(styleElm);
  },

  start: function(callback) {
    if (!this._beforeView) {
      this._afterView.setRawStyle({opacity: ''});
      callback && callback();
      return;
    }

    var cb1 = function(){
      this._beforeView.hide();
      this._beforeView.setRawStyle({webkitAnimationName: ''});
      this._beforeView.removeRawEventListener('webkitAnimationEnd', cb1);

      this._afterView.addRawEventListener('webkitAnimationEnd', cb2);
      this._afterView.setRawStyle({opacity:0, webkitAnimationName: 'fade_in'});
    }.bind(this);

    var cb2 = function(){
      this._afterView.removeRawEventListener('webkitAnimationEnd', cb2);
      this._afterView.setRawStyle({opacity: '', webkitAnimationName: 'none'});
      callback && callback();
    }.bind(this);

    this._beforeView.addRawEventListener('webkitAnimationEnd', cb1);
    this._beforeView.setRawStyle({webkitAnimationName: 'fade_out'});
  },

  back: function(callback) {
    if (!this._beforeView) {
      return;
    }

    var cb1 = function(){
      this._afterView.hide();
      this._afterView.removeRawEventListener('webkitAnimationEnd', cb1);
      this._afterView.setRawStyle({webkitAnimationName: 'none'});

      this._beforeView.addRawEventListener('webkitAnimationEnd', cb2);
      this._beforeView.setRawStyle({opacity: 0, webkitAnimationName: 'fade_in'});
      this._beforeView.show();
    }.bind(this);

    var cb2 = function(){
      this._beforeView.removeRawEventListener('webkitAnimationEnd', cb2);
      this._beforeView.setRawStyle({opacity: '', webkitAnimationName: 'none'});
      callback && callback();
    }.bind(this);

    this._afterView.addRawEventListener('webkitAnimationEnd', cb1);
    this._afterView.setRawStyle({webkitAnimationName: 'fade_out'});
  }
});

