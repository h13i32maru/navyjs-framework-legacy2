Navy.View.View = Navy.Class({
  CLASSNAME: 'Navy.View.View',

  _layout: null,
  _element: null,
  _parentView: null,

  /**
   *
   * @param {function} callback
   * @param {ViewLayout} layout
   */
  initialize: function(layout, callback) {
    this._layout = layout;
    this._element = document.createElement('div');

    this.setLayout(layout, callback);
  },

  setLayout: function(layout, callback) {
    if (!layout) {
      return;
    }

    var style = {
      position: 'absolute',
      left: layout.pos.x + 'px',
      top: layout.pos.y + 'px',
      zIndex: layout.pos.z,
      width: layout.size.width + 'px',
      height: layout.size.height + 'px',
      backgroundColor: layout.backgroundColor
    };
    this.setRawStyle(style);

    callback && setTimeout(callback.bind(null, this), 0);
  },

  setRawStyle: function(style) {
    var cssText = '';
    for (var key in style) {
      var value = style[key];
      if (value !== undefined) {
        var propertyName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        if (propertyName.indexOf('webkit') === 0) {
          propertyName = '-' + propertyName;
        }

        if (value === '') {
          this._element.style[key] = '';
        } else {
          cssText += propertyName + ':' + value + ';';
        }
      }
    }

    this._element.style.cssText += cssText;
  },

  addRawEventListener: function(eventName, callback) {
    this._element.addEventListener(eventName, callback);
  },

  removeRawEventListener: function(eventName, callback) {
    this._element.removeEventListener(eventName, callback);
  },

  getId: function(){
    return this._layout.id;
  },

  getElement: function(){
    return this._element;
  },

  setParent: function(parentView) {
    this._parentView = parentView;
  },

  show: function() {
    this._element.style.display = '';
  },

  hide: function() {
    this._element.style.display = 'none';
  },

  setSize: function(size) {
    var cssText = '';

    if (typeof size.width === 'number') {
      this._layout.size.width = size.width;
      cssText += 'width:' + size.width + 'px;';
    }

    if (typeof size.height === 'number') {
      this._layout.size.height = size.height;
      cssText += 'height:' + size.height + 'px;';
    }

    this._element.style.cssText += cssText;
  },

  setPos: function(pos) {
    var cssText = '';

    if (typeof pos.x === 'number') {
      var x = parseInt(pos.x, 10);
      this._layout.pos.x = x;
      cssText += 'left:' + x + 'px;';
    }

    if (typeof pos.y === 'number') {
      var y = parseInt(pos.y, 10);
      this._layout.pos.y = y;
      cssText += 'top:' + y + 'px;';
    }

    if (typeof pos.z === 'number') {
      var z = parseInt(pos.z, 10);
      this._layout.pos.z = z;
      cssText += 'z-index:' + z + ';';
    }

    this._element.style.cssText += cssText;
  },

  addPos: function(deltaPos) {
    var x = this._layout.pos.x + (deltaPos.x || 0);
    var y = this._layout.pos.y + (deltaPos.y || 0);
    this.setPos({x: x, y: y});
  },

  getPos: function() {
    return {x: this._layout.pos.x, y: this._layout.pos.y, z: this._layout.pos.z};
  },

  destroy: function() {
    this._parentView.removeView(this);
    this._element = null;
  },

  toJSON: function() {
    return this._layout;
  }
});
