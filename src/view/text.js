Navy.View.Text = Navy.Class(Navy.View.View, {
  CLASSNAME: 'Navy.View.Text',

  initialize: function($super, layout) {
    $super(layout);

    this._element.textContent = layout.extra.text;
  }
});
