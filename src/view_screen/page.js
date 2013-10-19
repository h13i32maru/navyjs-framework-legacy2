Navy.Page = Navy.Class(Navy.ViewGroup.ViewGroup, {
  CLASSNAME: 'Navy.Page',

  initialize: function($super, layout, callback) {
    $super(layout, callback);
  },

  setLayout: function($super, layout, callback) {
    // シーン、ページの場合はsize, posは固定値でよい
    layout.visible = true;
    layout.pos = {x:0, y:0};
    layout.sizePolicy = this.SIZE_POLICY_FIXED;
    layout.size = {width: Navy.Config.app.size.width, height: Navy.Config.app.size.height};

    $super(layout, callback);
  },

  setPage: function($super, page) {
    // ignore
  },

  getPage: function() {
    return this;
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
  }
});
