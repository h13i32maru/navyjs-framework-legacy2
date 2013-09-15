Navy.App = Navy.Class.instance({
  CLASSNAME: 'Navy.App',

  _appConfig: null,
  _sceneConfig: null,

  initialize: function(){
    var notify = new Navy.Notify(2, this._onLoadAllConfig.bind(this));
    this._loadAppJSON(notify.pass.bind(notify));
    this._loadSceneJSON(notify.pass.bind(notify));
  },

  _loadAppJSON: function(callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'config/app.json');
    xhr.onload = function(ev){
      var xhr = ev.target;
      this._appConfig = JSON.parse(xhr.responseText);
      callback();
    }.bind(this);
    xhr.send();
  },

  _loadSceneJSON: function(callback){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'config/scene.json');
    xhr.onload = function(ev){
      var xhr = ev.target;
      this._sceneConfig = JSON.parse(xhr.responseText);
      callback();
    }.bind(this);
    xhr.send();
  },

  _onLoadAllConfig: function(){
    var size = this._appConfig.size;
    Navy.Screen.initialize(this._appConfig, this._sceneConfig, size.width, size.height);
  }
});
