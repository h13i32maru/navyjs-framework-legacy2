Navy.App = Navy.Class.instance({
  CLASSNAME: 'Navy.App',

  initialize: function(){
    Navy.Resource.initialize();
    Navy.Config.initialize(this._onInitConfig.bind(this));
  },

  _onInitConfig: function(){
    Navy.Root.initialize();
  }
});
