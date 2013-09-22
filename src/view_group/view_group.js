Navy.ViewGroup.ViewGroup = Navy.Class(Navy.View.View, {
  CLASSNAME: 'Navy.ViewGroup.ViewGroup',

  _views: null,
  _initCallback: null,

  /**
   * @param $super
   * @param {ViewGroupLayout} layout
   * @param callback
   */
  initialize: function($super, layout, callback) {
    this._views = {};

    $super(layout, callback);
  },

  setLayout: function($super, layout, callback) {
    $super(layout);

    if (layout && layout.extra.contentLayoutFile) {
      callback = callback || function(){};
      this._initCallback = callback.bind(null, this);
      Navy.Resource.loadLayout(layout.extra.contentLayoutFile, this._onLoadContentLayout.bind(this));
    } else {
      callback && setTimeout(callback.bind(null, this), 0);
    }
  },

  _onLoadContentLayout: function(contentLayouts) {
    var notify = new Navy.Notify(contentLayouts.length, this._initCallback);
    var pass = notify.pass.bind(notify);

    for (var i = 0; i < contentLayouts.length; i++) {
      var contentLayout = contentLayouts[i];
      var _class = Navy.Resource.getClass(contentLayout.class);
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
