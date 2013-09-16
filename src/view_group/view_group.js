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
      Navy.ResourceManager.loadLayout(layout.extra.contentLayoutFile, this._onLoadLayout.bind(this, callback));
    } else {
      callback && callback(this);
    }
  },

  _onLoadLayout: function(callback) {
    var contentLayoutFile = this._layout.extra.contentLayoutFile;
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
  },

  addView: function(view) {
    var element = view.getElement();
    this._element.appendChild(element);
    this._views[view.getId()] = view;
    view.setParent(this);
  },

  removeView: function(view) {
    var element = view.getElement();
    this._element.removeChild(element);
    this._views[view.getId()] = null;
    delete this._views[view.getId()];
    view.setParent(null);
  }
});
