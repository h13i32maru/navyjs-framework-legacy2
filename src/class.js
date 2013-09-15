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
