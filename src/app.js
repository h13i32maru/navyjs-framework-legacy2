Navy.App = Navy.Class.instance({
  CLASSNAME: 'Navy.App',

  initialize: function(){
    Navy.ResourceManager.initialize();
    Navy.Config.initialize(this._onInitConfig.bind(this));
  },

  _onInitConfig: function(){
    Navy.Screen.initialize();
  }
});
