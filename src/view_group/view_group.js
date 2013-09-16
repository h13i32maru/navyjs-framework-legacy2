Navy.ViewGroup.ViewGroup = Navy.Class(Navy.View.View, {
  CLASSNAME: 'Navy.ViewGroup.ViewGroup',

  _views: null,

  /**
   * @param $super
   * @param {ViewGroupLayout} layout
   * @param callback
   */
  initialize: function($super, layout, callback) {
    $super(layout);

    this._views = {};

    if (layout && layout.extra.contentLayoutFile) {
      var contentLayoutFile = layout.extra.contentLayoutFile;
      var contentLayouts = Navy.ResourceManager.getLayout(contentLayoutFile);

      callback = callback || function(){};
      var notify = new Navy.Notify(contentLayouts.length, callback.bind(null, this));
      var pass = notify.pass.bind(notify);

      for (var i = 0; i < contentLayouts.length; i++) {
        var contentLayout = contentLayouts[i];
        var _class = Navy.ResourceManager.getClass(contentLayout.class);
        var view = new _class(contentLayout, pass);
        this.addView(view);
      }
    } else {
      callback && callback(this);
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
