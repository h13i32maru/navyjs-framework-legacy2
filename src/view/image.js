Navy.View.Image = Navy.Class(Navy.View.View, {
  CLASSNAME: 'Navy.View.Image',

  _imgElm: null,

  initialize: function($super, layout, callback) {
    $super(layout);

    var imgElm = document.createElement('img');
    this._element.appendChild(imgElm);
    this._imgElm = imgElm;

    Navy.ResourceManager.loadImage(layout.extra.src, this._onLoadImage.bind(this, layout.extra.src, callback));
  },

  _onLoadImage: function(src, callback){
    this._imgElm.src = src;
    callback && callback(this);
  }
});
