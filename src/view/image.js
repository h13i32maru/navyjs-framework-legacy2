Navy.View.Image = Navy.Class(Navy.View.View, {
  CLASSNAME: 'Navy.View.Image',

  _imgElm: null,
  _autoSize: false,

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

    if (layout) {
      if (layout.size.width === null || layout.size.height === null) {
        this._autoSize = true;
      }
    }

    if (layout && layout.extra.src) {
      Navy.Resource.loadImage(layout.extra.src, function(src, width, height){
        this._onLoadImage(src, width, height);
        callback && callback(this);
      }.bind(this));
    } else {
      this._layout.extra.src = null;
      this._imgElm.src = '';
      callback && setTimeout(callback, 0);
    }
  },

  _onLoadImage: function(src, width, height){
    this._layout.extra.src = src;
    this._imgElm.src = src;

    if (this._autoSize) {
      this.setSize({width: width, height: height});
    }
  }
});
