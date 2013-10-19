Navy.View.Image = Navy.Class(Navy.View.View, {
  CLASSNAME: 'Navy.View.Image',

  _imgElm: null,

  initialize: function($super, layout, callback) {
    $super(layout, callback);
  },

  _createElement: function($super, layout) {
    $super(layout);

    var imgElm = document.createElement('img');
    this._element.appendChild(imgElm);
    this._imgElm = imgElm;
  },

  _convertLayoutToExtraStyle: function($super, layout) {
    return $super(layout);
  },

  _loadExtraResource: function($super, layout, callback) {
    if (layout && layout.extra.src) {
      Navy.Resource.loadImage(layout.extra.src, function(src, width, height){
        this._onLoadImage(src, width, height);
        $super(layout, callback);
      }.bind(this));
    } else {
      this._layout.extra.src = null;
      this._imgElm.src = '';
      $super(layout, callback);
    }
  },

  _onLoadImage: function(src, width, height){
    this._layout.extra.src = src;
    this._imgElm.src = src;

    if (this._layout.sizePolicy == this.SIZE_POLICY_WRAP_CONTENT) {
      this.setSize({width: width, height: height});
    }
  }
});
