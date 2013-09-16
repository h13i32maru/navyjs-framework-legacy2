Navy.Config = Navy.Class.instance({
  CLASSNAME: 'Navy.Config',

  app: null,
  scene: null,
  page: null,

  initialize: function(callback) {
    var notify = new Navy.Notify(3, callback);
    var pass = notify.pass.bind(notify);
    this._loadAppJSON(pass);
    this._loadSceneJSON(pass);
    this._loadPageJSON(pass);
  },

  _loadAppJSON: function(callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'config/app.json');
    xhr.onload = function(ev){
      var xhr = ev.target;
      this.app = JSON.parse(xhr.responseText);
      callback();
    }.bind(this);
    xhr.send();
  },

  _loadSceneJSON: function(callback){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'config/scene.json');
    xhr.onload = function(ev){
      var xhr = ev.target;
      this.scene = JSON.parse(xhr.responseText);
      callback();
    }.bind(this);
    xhr.send();
  },

  _loadPageJSON: function(callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'config/page.json');
    xhr.onload = function(ev){
      var xhr = ev.target;
      this.page = JSON.parse(xhr.responseText);
      callback();
    }.bind(this);
    xhr.send();
  }
});
