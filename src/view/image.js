Navy.View.Image = Navy.Class(Navy.View.View, {
  CLASSNAME: 'Navy.View.Image',

  _imgElm: null,

  initialize: function($super, layout, callback) {
    $super(layout, callback);
  },

  setLayout: function($super, layout, callback) {
    $super(layout);

    if (!this._imgElm) {
      var imgElm = document.createElement('img');
      this._element.appendChild(imgElm);
      this._imgElm = imgElm;
    }

    if (layout && layout.extra.src) {
      Navy.Resource.loadImage(layout.extra.src, function(src){
        this._onLoadImage(src);
        callback && callback(this);
      }.bind(this));
    } else {
      this._layout.extra.src = null;
      this._imgElm.src = '';
      callback && setTimeout(callback, 0);
    }
  },

  _onLoadImage: function(src){
    this._layout.extra.src = src;
    this._imgElm.src = src;
  }
});
