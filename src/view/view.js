Navy.View.View = Navy.Class({
  CLASSNAME: 'Navy.View.View',

  _layout: null,
  _parentElement: null,
  _element: null,

  /**
   *
   * @param {ViewLayout} layout
   */
  initialize: function(layout, callback) {
    var element = document.createElement('div');

    if (layout) {
      var style = {
        position: 'absolute',
        left: layout.pos.x + 'px',
        top: layout.pos.y + 'px',
        width: layout.size.width + 'px',
        height: layout.size.height + 'px',
        'background-color': layout.backgroundColor
      };
      var cssText = this.convertStyleToCSSText(style);
      element.style.cssText = cssText;
    }

    this._layout = layout;

    this._element = element;

    callback && callback(this);
  },

  convertStyleToCSSText: function(style) {
    var cssText = '';
    for (var key in style) {
      var value = style[key];
      if (value !== undefined) {
        cssText += key + ':' + value + ';';
      }
    }

    return cssText;
  },

  onChangeParentElement: function(oldParentElement, newParentElement) {
    this._parentElement = newParentElement;
  },

  getId: function(){
    return this._layout.id;
  },

  getElement: function(){
    return this._element;
  },

  getParentElement: function(){
    return this._parentElement;
  }
});
