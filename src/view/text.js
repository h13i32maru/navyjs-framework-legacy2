Navy.View.Text = Navy.Class(Navy.View.View, {
  CLASSNAME: 'Navy.View.Text',

  _textElement: null,

  /**
   *
   * @param $super
   * @param {TextLayout} layout
   * @param {function} callback
   */
  initialize: function($super, layout, callback) {
    $super(layout, callback);
  },

  _createElement: function($super, layout) {
    $super(layout);

    this._textElement = document.createElement('span');
    this._element.appendChild(this._textElement);
  },

  _convertLayoutToExtraStyle: function($super, layout) {
    var style = $super(layout);

    if (!layout.extra) {
      return style;
    }

    if (typeof layout.extra.fontSize === "number") {
      style.fontSize = layout.extra.fontSize + 'px';
    }

    if (layout.sizePolicy == this.SIZE_POLICY_WRAP_CONTENT) {
      style.display = 'inline';
    }

    return style;
  },

  _loadExtraResource: function($super, layout, callback) {
    this._textElement.textContent = layout.extra.text;

    $super(layout, callback);
  }
});
