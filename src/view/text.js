Navy.View.Text = Navy.Class(Navy.View.View, {
  CLASSNAME: 'Navy.View.Text',

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

    if (layout.extra) {
      this._element.textContent = layout.extra.text;
    }

    callback && setTimeout(callback.bind(null, this), 0);
  }
});
