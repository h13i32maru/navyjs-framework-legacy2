Navy.Scene = Navy.Class(Navy.ViewGroup.ViewGroup, {
  CLASSNAME: 'Navy.Scene',

  initialize: function($super, layout, callback){
    $super(layout);

    var pageName = layout.extra.page;
    Navy.Screen.createPage(pageName, this._onCreateFirstPage.bind(this, callback));
  },

  _onCreateFirstPage: function(callback, page) {
    this.addView(page);
    callback && callback(this);
  }
});
