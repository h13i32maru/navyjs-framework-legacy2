Navy.View.View = Navy.Class({
  CLASSNAME: 'Navy.View.View',

  SIZE_POLICY_FIXED: 'fixed',
  SIZE_POLICY_WRAP_CONTENT: 'wrapContent',

  _id: null,
  _page: null,
  _scene: null,
  _layout: null,
  _element: null,
  _parentView: null,

  /**
   *
   * @param {function} callback
   * @param {ViewLayout} layout
   */
  initialize: function(layout, callback) {
    if (layout) {
      this._id = layout.id;
    }

    this._layout = layout;

    this._createElement(layout);

    this._execLink = this._execLink.bind(this);

    this.setLayout(layout, callback);
  },

  setLayout: function(layout, callback) {
    if (!layout) {
      return;
    }

    this._layout = layout;

    var notify = new Navy.Notify(2, function(){
      this._setRawStyle(style);
      this._setRawStyle(extraStyle);
      callback && callback(this);
    }.bind(this));

    var pass = notify.pass.bind(notify);

    var style = this._convertLayoutToStyle(layout);
    this._loadResource(layout, pass);

    var extraStyle = this._convertLayoutToExtraStyle(layout);
    this._loadExtraResource(layout, pass);
  },

  _createElement: function(layout) {
    this._element = document.createElement('div');
  },

  _convertLayoutToStyle: function(layout) {
    var style = {
      position: 'absolute',
      left: layout.pos.x + 'px',
      top: layout.pos.y + 'px',
      zIndex: layout.pos.z,
      backgroundColor: layout.backgroundColor
    };

    if (layout.sizePolicy == this.SIZE_POLICY_FIXED) {
      style.width = layout.size.width + 'px';
      style.height = layout.size.height + 'px';
    } else {
      layout.size = {};
    }

    if (layout.link) {
      // fixme: とりあえずtouchendで代用してるが、tochstartとかもちゃんと使ってタップ判定すべき.
      this._element.removeEventListener('touchend', this._execLink);
      this._element.addEventListener('touchend', this._execLink);
    }

    return style;
  },

  _loadResource: function(layout, callback) {
    callback && setTimeout(callback, 0);
  },

  _convertLayoutToExtraStyle: function(layout) {
    return {};
  },

  _loadExtraResource: function(layout, callback) {
    callback && setTimeout(callback, 0);
  },

  _setRawStyle: function(style) {
    var cssText = '';
    for (var key in style) {
      var value = style[key];
      if (value !== undefined) {
        var propertyName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        if (propertyName.indexOf('webkit') === 0) {
          propertyName = '-' + propertyName;
        }

        if (value === '') {
          this._element.style[key] = '';
        } else {
          cssText += propertyName + ':' + value + ';';
        }
      }
    }

    this._element.style.cssText += cssText;
  },

  _execLink: function(ev) {
    var type = this._layout.link.type;
    var id = this._layout.link.id;

    switch (type) {
    case 'page':
      this.getScene().linkPage(id);
      break;
    case 'scene':
      Navy.Root.linkScene(id);
      break;
    }
  },

  addRawEventListener: function(eventName, callback) {
    this._element.addEventListener(eventName, callback);
  },

  removeRawEventListener: function(eventName, callback) {
    this._element.removeEventListener(eventName, callback);
  },

  getId: function(){
    return this._id;
  },

  setPage: function(page) {
    this._page = page;
  },

  getPage: function() {
    return this._page;
  },

  setScene: function(scene) {
    this._scene = scene;
  },

  getScene: function() {
    return this._scene;
  },

  getElement: function(){
    return this._element;
  },

  setParent: function(parentView) {
    this._parentView = parentView;
  },

  getParent: function() {
    return this._parentView;
  },

  isVisible: function() {
    if (this._element.style.display === 'none') {
      return false;
    }

    for (var parent = this.getParent(); parent; parent = parent.getParent()) {
      if (!parent.isVisible()) {
        return false;
      }
    }

    return true;
  },

  show: function() {
    this._element.style.display = '';
  },

  hide: function() {
    this._element.style.display = 'none';
  },

  setBackgroundColor: function(backgroundColor) {
    this._layout.backgroundColor = backgroundColor;

    this._setRawStyle({backgroundColor: backgroundColor});
  },

  getBackgroundColor: function() {
    return this._layout.backgroundColor;
  },

  getSize: function() {
    switch (this._layout.sizePolicy) {
    case this.SIZE_POLICY_WRAP_CONTENT:
      if (this._element.clientWidth || this._element.clientHeight) {
        return {
          width: this._element.clientWidth,
          height: this._element.clientHeight
        };
      } else {
        return {
          width: this._element.scrollWidth,
          height: this._element.scrollHeight
        };
      }
    case this.SIZE_POLICY_FIXED:
      return {
        width: this._layout.size.width,
        height: this._layout.size.height
      };
    default:
      throw new Error('unknown size policy. ' + this._layout.sizePolicy);
    }
  },

  setSize: function(size) {
    var cssText = '';

    if (typeof size.width === 'number') {
      this._layout.size.width = size.width;
      cssText += 'width:' + size.width + 'px;';
    }

    if (typeof size.height === 'number') {
      this._layout.size.height = size.height;
      cssText += 'height:' + size.height + 'px;';
    }

    this._element.style.cssText += cssText;
  },

  setPos: function(pos) {
    var cssText = '';

    if (typeof pos.x === 'number') {
      var x = parseInt(pos.x, 10);
      this._layout.pos.x = x;
      cssText += 'left:' + x + 'px;';
    }

    if (typeof pos.y === 'number') {
      var y = parseInt(pos.y, 10);
      this._layout.pos.y = y;
      cssText += 'top:' + y + 'px;';
    }

    if (typeof pos.z === 'number') {
      var z = parseInt(pos.z, 10);
      this._layout.pos.z = z;
      cssText += 'z-index:' + z + ';';
    }

    this._element.style.cssText += cssText;
  },

  addPos: function(deltaPos) {
    var x = this._layout.pos.x + (deltaPos.x || 0);
    var y = this._layout.pos.y + (deltaPos.y || 0);
    this.setPos({x: x, y: y});
  },

  getPos: function() {
    return {x: this._layout.pos.x, y: this._layout.pos.y, z: this._layout.pos.z};
  },

  destroy: function() {
    this._parentView.removeView(this);
    this._element = null;
  },

  toJSON: function() {
    return this._layout;
  }
});
