window.Navy = {
  View: {},
  ViewGroup: {}
};

window.addEventListener('DOMContentLoaded', function(){
  Navy.App.initialize();
});
Navy.Class = function(){
  var protoObj;
  var superClass;
  switch (arguments.length) {
  case 1:
    superClass = Navy.Class._RootClass;
    protoObj = arguments[0];
    break;
  case 2:
    if (typeof arguments[0] === 'function') {
      superClass = arguments[0];
    } else {
      superClass = arguments[0].constructor;
    }
    protoObj = arguments[1];
    break;
  default:
    throw new Error('arguments of Navy.Class is 1 or 2.');
  }

  return Navy.Class._create(superClass, protoObj);
};

Navy.Class.instance = function instance(var_args) {
  var _class = Navy.Class.apply(Navy, arguments);
  _class.__manualInitialize__ = true;
  var obj = new _class();
  return obj;
};

/**
 * スーパークラスを指定せずにクラスを生成したときのクラス.
 */
Navy.Class._RootClass = function _RootClass() {};
Navy.Class._RootClass.prototype.initialize = function() {};

Navy.Class._create = function _create(superClass, protoObj){
  var name = protoObj.CLASSNAME || 'Constructor';
  name = name.replace(/[.]/g, '$');
  var Constructor = new Function("return function " +  name + " () { if (typeof this.initialize === 'function' && !this.constructor.__manualInitialize__) { this.initialize.apply(this, arguments); } }")();

  function EmptySuperClass(){}
  EmptySuperClass.prototype = superClass.prototype;
  var superObj = new EmptySuperClass();
  var superObjForWrap = new EmptySuperClass();

  Constructor.prototype = superObj;

  var key;
  var value;
  for (key in protoObj) {
    value = protoObj[key];

    if (typeof value === 'object' && value !== null) {
      if (key !== '$static') {
        throw new Error('object property must be primitive type. property = ' + key);
      }
    }

    if (typeof value === 'function') {
      if (Navy.Class._argumentNames(value)[0] === '$super') {
        value = Navy.Class._wrapFunction(superObjForWrap, key, value);
      }
    }
    Constructor.prototype[key] = value;
  }

  Constructor.prototype.constructor = Constructor;

  return Constructor;
};

/**
 * 関数の仮引数名のリストを取得する.
 * @param {function} func 対象とする関数.
 * @return {string[]} 仮引数名の配列.
 */
Navy.Class._argumentNames = function _argumentNames(func) {
  var names = func.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1]
    .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
    .replace(/\s+/g, '').split(',');
  return names.length == 1 && !names[0] ? [] : names;
};

/**
 * 引数にスーパークラスの関数が渡されるように元の関数をラップして返す。
 * @param {Object} superObj スーパークラスのオブジェクト.
 * @param {string} funcname ラップする関数の名前.
 * @param {function} func ラップする関数.
 * @return {function} ラップした関数.
 */
Navy.Class._wrapFunction = function _wrapFunction(superObj, funcname, func) {
  if (typeof superObj[funcname] !== 'function') {
    throw new Error('override method must be function. function = ' + funcname);
  }

  return function() {
    var _this = this;
    var $super = function() { return superObj[funcname].apply(_this, arguments); };
    var arg = [$super].concat(Array.prototype.slice.call(arguments, 0));
    return func.apply(this, arg);
  };
};
Navy.Notify = Navy.Class({
  CLASSNAME: 'Navy.Notify',

  _count: null,
  _callback: null,

  initialize: function(count, callback) {
    if (arguments.length === 2) {
      this.set(count, callback);
    }
  },

  pass: function(){
    this._count--;

    if (this._count === 0) {
      this._callback();
    }
  },

  set: function(count, callback) {
    if (count === 0) {
      callback();
    } else {
      this._count = count;
      this._callback = callback;
    }
  }
});
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
Navy.Screen = Navy.Class.instance({
  CLASSNAME: 'Navy.Screen',

  _screenElm: null,

  initialize: function(appConfig, sceneConfig, width, height){
    var style = '* {margin:0; padding:0;} html {width:100%; height:100%} body {background-color:#000;}';
    var styleElm = document.createElement('style');
    styleElm.textContent = style;
    document.head.appendChild(styleElm);

    var screenWidth = window.innerWidth;
    var screenHeight = window.innerHeight;
    var scaleWidth = screenWidth / width;
    var scaleHeight = screenHeight / height;
    var scale = Math.min(scaleWidth, scaleHeight);
    var left = (screenWidth - scale * width) / 2;
    var top = (screenHeight - scale * height) / 2;
    document.body.style.position = 'absolute';
    document.body.style.zoom = scale;
    document.body.style.width = width + 'px';
    document.body.style.height = height + 'px';
    document.body.style.left = left + 'px';
    document.body.style.top = top + 'px';

    this._screenElm = document.body;

    var startSceneName = appConfig.start.scene;
    var layout = sceneConfig[startSceneName];

    Navy.ResourceManager.initialize();
    var notify = new Navy.Notify(2, this._onLoadResource.bind(this, layout));
    Navy.ResourceManager.loadLayout(layout.extra.contentLayoutFile, notify.pass.bind(notify));
    Navy.ResourceManager.loadScript(layout.classFile, notify.pass.bind(notify));
  },

  _onLoadResource: function(layout) {
    Navy.Root.initialize(this._screenElm);

    var _class = Navy.ResourceManager.getClass(layout.class);
    var startScene = new _class(layout);
    Navy.Root.addView(startScene);
  }
});
Navy.View.View = Navy.Class({
  CLASSNAME: 'Navy.View.View',

  _layout: null,
  _parentElement: null,
  _element: null,

  /**
   *
   * @param {ViewLayout} layout
   */
  initialize: function(layout, callback) {
    var element = document.createElement('div');

    if (layout) {
      var style = {
        position: 'absolute',
        left: layout.pos.x + 'px',
        top: layout.pos.y + 'px',
        width: layout.size.width + 'px',
        height: layout.size.height + 'px',
        'background-color': layout.backgroundColor
      };
      var cssText = this.convertStyleToCSSText(style);
      element.style.cssText = cssText;
    }

    this._layout = layout;

    this._element = element;

    callback && callback(this);
  },

  convertStyleToCSSText: function(style) {
    var cssText = '';
    for (var key in style) {
      var value = style[key];
      if (value !== undefined) {
        cssText += key + ':' + value + ';';
      }
    }

    return cssText;
  },

  onChangeParentElement: function(oldParentElement, newParentElement) {
    this._parentElement = newParentElement;
  },

  getId: function(){
    return this._layout.id;
  },

  getElement: function(){
    return this._element;
  },

  getParentElement: function(){
    return this._parentElement;
  }
});
Navy.View.Text = Navy.Class(Navy.View.View, {
  CLASSNAME: 'Navy.View.Text',

  /**
   *
   * @param $super
   * @param {TextLayout} layout
   */
  initialize: function($super, layout, callback) {
    $super(layout);

    this._element.textContent = layout.extra.text;

    callback && callback(this);
  }
});
Navy.ViewGroup.ViewGroup = Navy.Class(Navy.View.View, {
  CLASSNAME: 'Navy.ViewGroup.ViewGroup',

  _views: null,

  /**
   *
   * @param $super
   * @param {ViewGroupLayout} layout
   * @param callback
   */
  initialize: function($super, layout, callback) {
    $super(layout);

    this._views = {};

    if (layout && layout.extra.contentLayoutFile) {
      var contentLayoutFile = layout.extra.contentLayoutFile;
      var contentLayouts = Navy.ResourceManager.getLayout(contentLayoutFile);

      callback = callback || function(){};
      var notify = new Navy.Notify(contentLayouts.length, callback.bind(null, this));
      var pass = notify.pass.bind(notify);

      for (var i = 0; i < contentLayouts.length; i++) {
        var contentLayout = contentLayouts[i];
        var _class = Navy.ResourceManager.getClass(contentLayout.class);
        var view = new _class(contentLayout, pass);
        this.addView(view);
      }
    } else {
      callback && callback(this);
    }
  },

  addView: function(view) {
    var element = view.getElement();
    var oldParentElement = view.getParentElement();

    this._element.appendChild(element);
    this._views[view.getId()] = view;

    view.onChangeParentElement(oldParentElement, this._element);
  }
});
Navy.Root = Navy.Class.instance(Navy.ViewGroup.ViewGroup, {
  CLASSNAME: 'Navy.Root',

  /**
   * @param {HTMLElement} parentElm
   */
  initialize: function($super, parentElm) {
    $super();

    var rootElm = document.createElement('div');
    rootElm.style.cssText = 'position:absolute; width:100%; height:100%;';
    parentElm.appendChild(rootElm);
    rootElm.style.backgroundColor = 'red';

    this._element = rootElm;
  }
});
Navy.Scene = Navy.Class(Navy.ViewGroup.ViewGroup, {
  CLASSNAME: 'Navy.Scene',

  initialize: function($super, layout, callback){
    $super(layout, callback);
  }
});
Navy.ResourceManager = Navy.Class.instance({
  CLASSNAME: 'Navy.ResourceManager',

  _layouts: null,
  _scripts: null,

  initialize: function(){
    this._layouts = {};
    this._scripts = {};
  },

  loadLayout: function(layoutFile, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', layoutFile);
    xhr.onload = function(ev){
      var xhr = ev.target;
      var layout = xhr.responseText;
      this._layouts[layoutFile] = layout;
      callback();
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

  getLayout: function(layoutFile) {
    var layout = this._layouts[layoutFile];
    if (layout) {
      return JSON.parse(layout);
    } else {
      throw new Error('not loaded layout. layoutFile = ' + layoutFile);
    }
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
