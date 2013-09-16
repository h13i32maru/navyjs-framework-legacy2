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
    var element = document.createElement('div');

    this._layout = layout;
    this._element = element;

    if (layout) {
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
    }

    callback && callback(this);
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

  destroy: function() {
    this._parentView.removeView(this);
    this._element = null;
  }
});
