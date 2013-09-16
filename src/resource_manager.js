Navy.ResourceManager = Navy.Class.instance({
  CLASSNAME: 'Navy.ResourceManager',

  _layouts: null,
  _scripts: null,
  _images: null,

  initialize: function(){
    this._layouts = {};
    this._scripts = {};
    this._images = {};
  },

  loadLayout: function(layoutFile, callback) {
    if (this._layouts[layoutFile]) {
      var layoutText = this._layouts[layoutFile];
      var layout = JSON.parse(layoutText);
      callback(layout);
      return;
    }

    var xhr = new XMLHttpRequest();
    xhr.open('GET', layoutFile);
    xhr.onload = function(ev){
      var xhr = ev.target;
      var layoutText = xhr.responseText;
      this._layouts[layoutFile] = layoutText;
      var layout = JSON.parse(layoutText);
      callback(layout);
    }.bind(this);
    xhr.send();
  },

  loadScript: function(scriptFile, callback) {
    var scriptElm = document.createElement('script');
    scriptElm.onload = function(){
      this._scripts[scriptFile] = true;
      callback();
    }.bind(this);
    scriptElm.src = scriptFile;
    document.head.appendChild(scriptElm);
  },

  loadImage: function(imageFile, callback) {
    var image = new Image();
    image.onload = function(){
      this._images[imageFile] = true;
      callback();
    }.bind(this);
    image.src = imageFile;
  },

  getClass: function(className) {
    var chain = className.split('.');
    var _class = window;
    for (var i = 0; i < chain.length; i++) {
      _class = _class[chain[i]];
    }

    return _class;
  }
});
