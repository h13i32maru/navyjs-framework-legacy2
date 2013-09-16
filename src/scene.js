Navy.Scene = Navy.Class(Navy.ViewGroup.ViewGroup, {
  CLASSNAME: 'Navy.Scene',

  _pageStack: null,

  initialize: function($super, layout, callback){
    $super(layout);

    this._pageStack = [];
    var pageName = layout.extra.page;

    Navy.Screen.createPage(pageName, function(page){
      this.addPage(page);
      callback && callback(this);
    }.bind(this));

    //FIXME: remove debug code
    var cb = function(){
      if (this._pageStack.length < 5) {
        this.goToPage('Page' + (Date.now() % 2 + 1));
      } else {
        this._element.removeEventListener('touchend', cb);
        this._element.addEventListener('touchend', function cb(){
          this.backPage();
        }.bind(this));
      }
    }.bind(this);
    this._element.addEventListener('touchend', cb);
  },

  addPage: function(page) {
    if (this._pageStack.length !== 0) {
      var beforePage = this._pageStack[this._pageStack.length - 1].page;
      var transition = new Navy.Transition.SlideOver(beforePage, page);
      this._pageStack.push({
        page: page,
        transition: transition
      });
      this.addView(page);
      transition.start();
    } else {
      this._pageStack.push({
        page: page,
        transition: null
      });
      this.addView(page);
    }
  },

  goToPage: function(pageName) {
    Navy.Screen.createPage(pageName, this.addPage.bind(this));
  },

  backPage: function() {
    if (this._pageStack.length >= 2) {
      var stackObj = this._pageStack[this._pageStack.length - 1];
      var transition = stackObj.transition;
      transition.back(this._onTransitionBackEnd.bind(this));
    }
  },

  _onTransitionBackEnd: function(){
    var stackObj = this._pageStack.pop();
    stackObj.page.destroy();
  }
});
