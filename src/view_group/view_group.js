Navy.ViewGroup.ViewGroup = Navy.Class(Navy.View.View, {
  CLASSNAME: 'Navy.ViewGroup.ViewGroup',

  _views: null,

  initialize: function($super, layout) {
    $super(layout);

    this._views = {};

    if (layout && layout.extra.contentLayoutFile) {
      var contentLayoutFile = layout.extra.contentLayoutFile;
      var contentLayouts = Navy.ResourceManager.getLayout(contentLayoutFile);
      for (var i = 0; i < contentLayouts.length; i++) {
        var contentLayout = contentLayouts[i];
        var _class = Navy.ResourceManager.getClass(contentLayout.class);
        var view = new _class(contentLayout);
        this.addView(view);
      }
    }
  },

  addView: function(view) {
    var element = view.getElement();
    var oldParentElement = view.getParentElement();

    this._element.appendChild(element);
    this._views[view.getId()] = view;

    view.onChangeParentElement(oldParentElement, this._element);
  }
});
