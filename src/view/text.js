Navy.View.Text = Navy.Class(Navy.View.View, {
  CLASSNAME: 'Navy.View.Text',

  /**
   *
   * @param $super
   * @param {TextLayout} layout
   */
  initialize: function($super, layout) {
    $super(layout);

    layout.pos.x++;
    this._element.textContent = layout.extra.text;
  }
});
