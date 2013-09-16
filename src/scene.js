Navy.Scene = Navy.Class(Navy.ViewGroup.ViewGroup, {
  CLASSNAME: 'Navy.Scene',

  _pageStack: null,

  initialize: function($super, layout, callback){
    var notify = new Navy.Notify(4, callback.bind(null, this));
    var pass = notify.pass.bind(notify);

    $super(layout, pass);

    var bottomLayout = {
      class: 'Navy.Page',
      id: '$bottom',
      pos: {x:0, y:0},
      size: {width: layout.size.width, height: layout.size.height},
      extra: {
        contentLayoutFile: layout.extra.contentBottomLayoutFile
      }
    };

    var bottomPage = new Navy.Page(bottomLayout, pass);
    this.addView(bottomPage);

    var topLayout = {
      class: 'Navy.Page',
      id: '$top',
      pos: {x:0, y:0, z:100},
      size: {width: layout.size.width, height: layout.size.height},
      extra: {
        contentLayoutFile: layout.extra.contentTopLayoutFile
      }
    };

    var topPage = new Navy.Page(topLayout, pass);
    this.addView(topPage);

    this._pageStack = [];
    var pageName = layout.extra.page;

    Navy.Screen.createPage(pageName, function(page){
      this.addPage(page);
      pass();
    }.bind(this));

    //FIXME: remove debug code
    var cb = function(){
      if (this._pageStack.length < 5) {
        this.nextPage('Page' + (Date.now() % 2 + 1));
      } else {
        this._element.removeEventListener('touchend', cb);
        this._element.addEventListener('touchend', function cb(){
          this.backPage();
        }.bind(this));
      }
    }.bind(this);
    this._element.addEventListener('touchend', cb);
  },

  onCreate: function() {
    console.log('onCreate', this.CLASSNAME);
  },

  onResumeBefore: function(){
    console.log('onResumeBefore', this.CLASSNAME);
  },

  onResumeAfter: function(){
    console.log('onResumeAfter', this.CLASSNAME);
  },

  onPauseBefore: function(){
    console.log('onPauseBefore', this.CLASSNAME);
  },

  onPauseAfter: function(){
    console.log('onPauseAfter', this.CLASSNAME);
  },

  onDestroy: function(){
    console.log('onDestroy', this.CLASSNAME);
  },

  addPage: function(page) {
    page.onCreate();
    page.onResumeBefore();

    var currentStackObj = this._getCurrentStack();
    if (currentStackObj) {
      var beforePage = currentStackObj.page;
      beforePage.onPauseBefore();
    }

    var transition = new Navy.Transition.SlideOver(beforePage, page);
    this._pageStack.push({
      page: page,
      transition: transition
    });
    this.addView(page);
    transition.start(this._onTransitionStartEnd.bind(this));
  },

  nextPage: function(pageName) {
    Navy.Screen.createPage(pageName, this.addPage.bind(this));
  },

  backPage: function() {
    if (this._pageStack.length >= 2) {
      var stackObj = this._pageStack[this._pageStack.length - 1];
      var transition = stackObj.transition;
      transition.back(this._onTransitionBackEnd.bind(this));
    }
  },

  _getCurrentStack: function() {
    if (this._pageStack.length >= 1) {
      return this._pageStack[this._pageStack.length - 1];
    } else {
      return null;
    }
  },

  _getPrevStack: function(){
    if (this._pageStack.length >= 2) {
      return this._pageStack[this._pageStack.length - 2];
    } else {
      return null;
    }
  },

  _onTransitionStartEnd: function(){
    var prevStackObj = this._getPrevStack();
    if (prevStackObj) {
      prevStackObj.page.onPauseAfter();
    }

    var currentStackObj = this._getCurrentStack();
    if (currentStackObj) {
      currentStackObj.page.onResumeAfter();
    }
  },

  _onTransitionBackEnd: function(){
    var prevStackObj = this._getPrevStack();
    if (prevStackObj) {
      prevStackObj.page.onResumeAfter();
    }

    var currentStackObj = this._getCurrentStack();
    if (currentStackObj) {
      currentStackObj.page.onPauseAfter();
      currentStackObj.page.onDestroy();

      var stackObj = this._pageStack.pop();
      stackObj.page.destroy();
    }
  }
});
