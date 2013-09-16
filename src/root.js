Navy.Root = Navy.Class.instance(Navy.ViewGroup.ViewGroup, {
  CLASSNAME: 'Navy.Root',

  _sceneStack: null,

  /**
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
    Navy.Screen.createScene(startSceneName, this.addScene.bind(this));
  },

  addScene: function(scene) {
    if (this._sceneStack.length !== 0) {
      var beforeScene = this._sceneStack[this._sceneStack.length - 1].scene;
    }

    var transition = new Navy.Transition.Fade(beforeScene, scene);
    this._sceneStack.push({
      scene: scene,
      transition: transition
    });
    this.addView(scene);
    transition.start();
  },

  nextScene: function(sceneName) {
    Navy.Screen.createScene(sceneName, this.addScene.bind(this));
  },

  backScene: function() {
    if (this._sceneStack.length >= 2) {
      var stackObj = this._sceneStack[this._sceneStack.length - 1];
      var transition = stackObj.transition;
      transition.back(this._onTransitionBackEnd.bind(this));
    }
  },

  _onTransitionBackEnd: function(){
    var stackObj = this._sceneStack.pop();
    stackObj.scene.destroy();
  }
});
