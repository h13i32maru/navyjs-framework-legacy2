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
