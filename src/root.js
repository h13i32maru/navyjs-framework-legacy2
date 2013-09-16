Navy.Root = Navy.Class.instance(Navy.ViewGroup.ViewGroup, {
  CLASSNAME: 'Navy.Root',

  _sceneStack: null,

  /**
   * @param $super
   * @param {HTMLElement} parentElm
   */
  initialize: function($super, parentElm) {
    $super();

    this._sceneStack = [];

    var rootElm = document.createElement('div');
    rootElm.style.cssText = 'position:absolute; width:100%; height:100%; overflow:hidden;';
    parentElm.appendChild(rootElm);

    this._element = rootElm;

    var startSceneName = Navy.Config.app.start.scene;
    this.nextScene(startSceneName);
  },

  nextScene: function(sceneName) {
    this._createScene(sceneName, this._addScene.bind(this));
  },

  backScene: function() {
    if (this._sceneStack.length >= 2) {
      var prevStackObj = this._getPrevStack();
      prevStackObj.scene.onResumeBefore();

      var currentStackObj = this._getCurrentStack();
      currentStackObj.scene.onPauseBefore();
      currentStackObj.transition.back(this._onTransitionBackEnd.bind(this));
    }
  },

  _createScene: function(sceneName, callback) {
    var layout = Navy.Config.scene[sceneName];
    Navy.ResourceManager.loadScript(layout.classFile, this._onLoadScript.bind(this, layout, callback));
  },

  _onLoadScript: function(layout, callback) {
    var _class = Navy.ResourceManager.getClass(layout.class);
    new _class(layout, callback);
  },

  _addScene: function(scene) {
    scene.onCreate();
    scene.onResumeBefore();

    var currentStackObj = this._getCurrentStack();
    if (currentStackObj) {
      var beforeScene = currentStackObj.scene;
      beforeScene.onPauseBefore();
    }

    var transition = new Navy.Transition.Fade(beforeScene, scene);
    this._sceneStack.push({
      scene: scene,
      transition: transition
    });
    this.addView(scene);
    transition.start(this._onTransitionStartEnd.bind(this));
  },

  _removeCurrentScene: function() {
    var stackObj = this._sceneStack.pop();
    stackObj.scene.destroy();
  },

  _getCurrentStack: function() {
    if (this._sceneStack.length >= 1) {
      return this._sceneStack[this._sceneStack.length - 1];
    } else {
      return null;
    }
  },

  _getPrevStack: function(){
    if (this._sceneStack.length >= 2) {
      return this._sceneStack[this._sceneStack.length - 2];
    } else {
      return null;
    }
  },

  _onTransitionStartEnd: function(){
    var prevStackObj = this._getPrevStack();
    if (prevStackObj) {
      prevStackObj.scene.onPauseAfter();
    }

    var currentStackObj = this._getCurrentStack();
    if (currentStackObj) {
      currentStackObj.scene.onResumeAfter();
    }
  },

  _onTransitionBackEnd: function(){
    var prevStackObj = this._getPrevStack();
    if (prevStackObj) {
      prevStackObj.scene.onResumeAfter();
    }

    var currentStackObj = this._getCurrentStack();
    if (currentStackObj) {
      currentStackObj.scene.onPauseAfter();
      currentStackObj.scene.onDestroy();

      this._removeCurrentScene();
    }
  }
});
