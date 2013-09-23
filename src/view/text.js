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

  setLayout: function($super, layout, callback) {
    $super(layout);

    if (!layout) {
      return;
    }

    if (!this._textElement) {
      this._textElement = document.createElement('span');
      this._element.appendChild(this._textElement);
    }

    if (layout.extra) {
      this._textElement.textContent = layout.extra.text;

      if (typeof layout.extra.fontSize === "number") {
        this._textElement.style.fontSize = layout.extra.fontSize + 'px';
      }
    }

    if (layout.sizePolicy == this.SIZE_POLICY_WRAP_CONTENT) {
      this._element.style.display = 'inline';
    }

    callback && setTimeout(callback.bind(null, this), 0);
  }
});
