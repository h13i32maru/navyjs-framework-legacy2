Navy.Root = Navy.Class.instance(Navy.ViewGroup.ViewGroup, {
  CLASSNAME: 'Navy.Root',

  /**
   * @param {HTMLElement} parentElm
   */
  initialize: function($super, parentElm) {
    $super();

    var rootElm = document.createElement('div');
    rootElm.style.cssText = 'position:absolute; width:100%; height:100%; overflow:hidden;';
    parentElm.appendChild(rootElm);

    this._element = rootElm;

    var startSceneName = Navy.Config.app.start.scene;
    Navy.Screen.createScene(startSceneName, this._onCreateScene.bind(this));
  },

  _onCreateScene: function(scene) {
    this.addView(scene);
  }
});
