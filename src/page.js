Navy.Page = Navy.Class(Navy.ViewGroup.ViewGroup, {
  CLASSNAME: 'Navy.Page',

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
