Navy.View.Text = Navy.Class(Navy.View.View, {
  CLASSNAME: 'Navy.View.Text',

  /**
   *
   * @param $super
   * @param {TextLayout} layout
   * @param {function} callback
   */
  initialize: function($super, layout, callback) {
    $super(layout);

    this._element.textContent = layout.extra.text;

    callback && callback(this);
  }
});
