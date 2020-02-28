(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.dataTable = f()}})(function(){var define,module,exports;return (function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var _on = require('@clubajax/on');

var BaseComponent = /*#__PURE__*/function (_HTMLElement) {
  _inherits(BaseComponent, _HTMLElement);

  function BaseComponent() {
    var _this;

    _classCallCheck(this, BaseComponent);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(BaseComponent).call(this));
    _this._uid = uid(_this.localName);
    privates[_this._uid] = {
      DOMSTATE: 'created'
    };
    privates[_this._uid].handleList = [];
    plugin('init', _assertThisInitialized(_this));
    return _this;
  }

  _createClass(BaseComponent, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      privates[this._uid].DOMSTATE = privates[this._uid].domReadyFired ? 'domready' : 'connected';
      plugin('preConnected', this);
      nextTick(onCheckDomReady.bind(this));

      if (this.connected) {
        this.connected();
      }

      this.fire('connected');
      plugin('postConnected', this);
    }
  }, {
    key: "onConnected",
    value: function onConnected(callback) {
      var _this2 = this;

      if (this.DOMSTATE === 'connected' || this.DOMSTATE === 'domready') {
        callback(this);
        return;
      }

      this.once('connected', function () {
        callback(_this2);
      });
    }
  }, {
    key: "onDomReady",
    value: function onDomReady(callback) {
      var _this3 = this;

      if (this.DOMSTATE === 'domready') {
        callback(this);
        return;
      }

      this.once('domready', function () {
        callback(_this3);
      });
    }
  }, {
    key: "disconnectedCallback",
    value: function disconnectedCallback() {
      var _this4 = this;

      privates[this._uid].DOMSTATE = 'disconnected';
      plugin('preDisconnected', this);

      if (this.disconnected) {
        this.disconnected();
      }

      this.fire('disconnected');
      var time,
          dod = BaseComponent.destroyOnDisconnect;

      if (dod) {
        time = typeof dod === 'number' ? doc : 300;
        setTimeout(function () {
          if (_this4.DOMSTATE === 'disconnected') {
            _this4.destroy();
          }
        }, time);
      }
    }
  }, {
    key: "attributeChangedCallback",
    value: function attributeChangedCallback(attrName, oldVal, newVal) {
      if (!this.isSettingAttribute) {
        newVal = BaseComponent.normalize(newVal);
        plugin('preAttributeChanged', this, attrName, newVal, oldVal);

        if (this.attributeChanged && BaseComponent.normalize(oldVal) !== newVal) {
          this.attributeChanged(attrName, newVal, oldVal);
        }
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.fire('destroy');

      privates[this._uid].handleList.forEach(function (handle) {
        handle.remove();
      });

      _destroy(this);
    }
  }, {
    key: "fire",
    value: function fire(eventName, eventDetail, bubbles) {
      return _on.fire(this, eventName, eventDetail, bubbles);
    }
  }, {
    key: "emit",
    value: function emit(eventName, value) {
      return _on.emit(this, eventName, value);
    }
  }, {
    key: "on",
    value: function on(node, eventName, selector, callback) {
      return this.registerHandle(typeof node !== 'string' ? // no node is supplied
      _on(node, eventName, selector, callback) : _on(this, node, eventName, selector));
    }
  }, {
    key: "once",
    value: function once(node, eventName, selector, callback) {
      return this.registerHandle(typeof node !== 'string' ? // no node is supplied
      _on.once(node, eventName, selector, callback) : _on.once(this, node, eventName, selector, callback));
    }
  }, {
    key: "attr",
    value: function attr(key, value, toggle) {
      this.isSettingAttribute = true;
      var add = toggle === undefined ? true : !!toggle;

      if (add) {
        this.setAttribute(key, value);
      } else {
        this.removeAttribute(key);
      }

      this.isSettingAttribute = false;
    }
  }, {
    key: "registerHandle",
    value: function registerHandle(handle) {
      privates[this._uid].handleList.push(handle);

      return handle;
    }
  }, {
    key: "DOMSTATE",
    get: function get() {
      return privates[this._uid].DOMSTATE;
    }
  }], [{
    key: "clone",
    value: function clone(template) {
      if (template.content && template.content.children) {
        return document.importNode(template.content, true);
      }

      var frag = document.createDocumentFragment();
      var cloneNode = document.createElement('div');
      cloneNode.innerHTML = template.innerHTML;

      while (cloneNode.children.length) {
        frag.appendChild(cloneNode.children[0]);
      }

      return frag;
    }
  }, {
    key: "addPlugin",
    value: function addPlugin(plug) {
      var i,
          order = plug.order || 100;

      if (!plugins.length) {
        plugins.push(plug);
      } else if (plugins.length === 1) {
        if (plugins[0].order <= order) {
          plugins.push(plug);
        } else {
          plugins.unshift(plug);
        }
      } else if (plugins[0].order > order) {
        plugins.unshift(plug);
      } else {
        for (i = 1; i < plugins.length; i++) {
          if (order === plugins[i - 1].order || order > plugins[i - 1].order && order < plugins[i].order) {
            plugins.splice(i, 0, plug);
            return;
          }
        } // was not inserted...


        plugins.push(plug);
      }
    }
  }, {
    key: "destroyOnDisconnect",
    set: function set(value) {
      privates['destroyOnDisconnect'] = value;
    },
    get: function get() {
      return privates['destroyOnDisconnect'];
    }
  }]);

  return BaseComponent;
}( /*#__PURE__*/_wrapNativeSuper(HTMLElement));

var privates = {},
    plugins = [];

function plugin(method, node, a, b, c) {
  plugins.forEach(function (plug) {
    if (plug[method]) {
      plug[method](node, a, b, c);
    }
  });
}

function onCheckDomReady() {
  if (this.DOMSTATE !== 'connected' || privates[this._uid].domReadyFired) {
    return;
  }

  var count = 0,
      children = getChildCustomNodes(this),
      ourDomReady = onSelfDomReady.bind(this);

  function addReady() {
    count++;

    if (count === children.length) {
      ourDomReady();
    }
  } // If no children, we're good - leaf node. Commence with onDomReady
  //


  if (!children.length) {
    ourDomReady();
  } else {
    // else, wait for all children to fire their `ready` events
    //
    children.forEach(function (child) {
      // check if child is already ready
      // also check for connected - this handles moving a node from another node
      // NOPE, that failed. removed for now child.DOMSTATE === 'connected'
      if (child.DOMSTATE === 'domready') {
        addReady();
      } // if not, wait for event


      child.on('domready', addReady);
    });
  }
}

function onSelfDomReady() {
  privates[this._uid].DOMSTATE = 'domready'; // domReady should only ever fire once

  privates[this._uid].domReadyFired = true;
  plugin('preDomReady', this); // call this.domReady first, so that the component
  // can finish initializing before firing any
  // subsequent events

  if (this.domReady) {
    this.domReady();

    this.domReady = function () {};
  } // allow component to fire this event
  // domReady() will still be called


  if (!this.fireOwnDomready) {
    this.fire('domready');
  }

  plugin('postDomReady', this);
}

function getChildCustomNodes(node) {
  // collect any children that are custom nodes
  // used to check if their dom is ready before
  // determining if this is ready
  var i,
      nodes = [];

  for (i = 0; i < node.children.length; i++) {
    if (node.children[i].nodeName.indexOf('-') > -1) {
      nodes.push(node.children[i]);
    }
  }

  return nodes;
}

function nextTick(cb) {
  requestAnimationFrame(cb);
}

var uids = {};

function uid() {
  var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'uid';

  if (uids[type] === undefined) {
    uids[type] = 0;
  }

  var id = type + '-' + (uids[type] + 1);
  uids[type]++;
  return id;
}

var destroyer = document.createElement('div');

function _destroy(node) {
  if (node) {
    destroyer.appendChild(node);
    destroyer.innerHTML = '';
  }
}

function makeGlobalListeners(name, eventName) {
  window[name] = function (nodeOrNodes, callback) {
    function handleDomReady(node, cb) {
      function onReady() {
        cb(node);
        node.removeEventListener(eventName, onReady);
      }

      if (node.DOMSTATE === eventName || node.DOMSTATE === 'domready') {
        cb(node);
      } else {
        node.addEventListener(eventName, onReady);
      }
    }

    if (!Array.isArray(nodeOrNodes)) {
      handleDomReady(nodeOrNodes, callback);
      return;
    }

    var count = 0;

    function onArrayNodeReady() {
      count++;

      if (count === nodeOrNodes.length) {
        callback(nodeOrNodes);
      }
    }

    for (var i = 0; i < nodeOrNodes.length; i++) {
      handleDomReady(nodeOrNodes[i], onArrayNodeReady);
    }
  };
}

makeGlobalListeners('onDomReady', 'domready');
makeGlobalListeners('onConnected', 'connected');

function testOptions(options) {
  var tests = {
    'prop': 'props',
    'bool': 'bools',
    'attr': 'attrs',
    'properties': 'props',
    'booleans': 'bools',
    'property': 'props',
    'boolean': 'bools'
  };
  Object.keys(tests).forEach(function (key) {
    if (options[key]) {
      console.error("BaseComponent.define found \"".concat(key, "\"; Did you mean: \"").concat(tests[key], "\"?"));
    }
  });
}

BaseComponent.injectProps = function (Constructor, _ref) {
  var _ref$props = _ref.props,
      props = _ref$props === void 0 ? [] : _ref$props,
      _ref$bools = _ref.bools,
      bools = _ref$bools === void 0 ? [] : _ref$bools,
      _ref$attrs = _ref.attrs,
      attrs = _ref$attrs === void 0 ? [] : _ref$attrs;
  Constructor.bools = [].concat(_toConsumableArray(Constructor.bools || []), _toConsumableArray(bools));
  Constructor.props = [].concat(_toConsumableArray(Constructor.props || []), _toConsumableArray(props));
  Constructor.attrs = [].concat(_toConsumableArray(Constructor.attrs || []), _toConsumableArray(attrs));
  Constructor.observedAttributes = [].concat(_toConsumableArray(Constructor.bools), _toConsumableArray(Constructor.props), _toConsumableArray(Constructor.attrs));
};

BaseComponent.define = function (tagName, Constructor) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  testOptions(options);
  BaseComponent.injectProps(Constructor, options);
  customElements.define(tagName, Constructor);
  return Constructor;
};

module.exports = BaseComponent;

},{"@clubajax/on":7}],2:[function(require,module,exports){
"use strict";

module.exports = require('@clubajax/base-component/src/BaseComponent');

require('@clubajax/base-component/src/template');

require('@clubajax/base-component/src/properties');

require('@clubajax/base-component/src/refs');

},{"@clubajax/base-component/src/BaseComponent":1,"@clubajax/base-component/src/properties":3,"@clubajax/base-component/src/refs":4,"@clubajax/base-component/src/template":5}],3:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var BaseComponent = require('./BaseComponent');

function setBoolean(node, prop) {
  var propValue;
  Object.defineProperty(node, prop, {
    enumerable: true,
    configurable: true,
    get: function get() {
      var att = this.getAttribute(prop);
      return att !== undefined && att !== null && att !== 'false' && att !== false;
    },
    set: function set(value) {
      var _this = this;

      this.isSettingAttribute = true;
      value = value !== false && value !== null && value !== undefined;

      if (value) {
        this.setAttribute(prop, '');
      } else {
        this.removeAttribute(prop);
      }

      if (this.attributeChanged) {
        this.attributeChanged(prop, value);
      }

      var fn = this[onify(prop)];

      if (fn) {
        var eventName = this.propsOnReady ? 'onDomReady' : 'onConnected';
        window[eventName](this, function () {
          if (value !== undefined && propValue !== value) {
            value = fn.call(_this, value) || value;
          }

          propValue = value;
        });
      }

      this.isSettingAttribute = false;
    }
  });
}

function setProperty(node, prop) {
  var propValue;
  Object.defineProperty(node, prop, {
    enumerable: true,
    configurable: true,
    get: function get() {
      return propValue !== undefined ? propValue : normalize(this.getAttribute(prop));
    },
    set: function set(value) {
      var _this2 = this;

      this.isSettingAttribute = true;

      if (_typeof(value) === 'object') {
        propValue = value;
      } else {
        this.setAttribute(prop, value);

        if (this.attributeChanged) {
          this.attributeChanged(prop, value);
        }
      }

      var fn = this[onify(prop)];

      if (fn) {
        var eventName = this.propsOnReady ? 'onDomReady' : 'onConnected';
        window[eventName](this, function () {
          if (value !== undefined) {
            propValue = value;
          }

          value = fn.call(_this2, value) || value;
        });
      }

      this.isSettingAttribute = false;
    }
  });
}

function setProperties(node) {
  var props = node.constructor.props || node.props;

  if (props) {
    props.forEach(function (prop) {
      if (prop === 'disabled') {
        setBoolean(node, prop);
      } else {
        setProperty(node, prop);
      }
    });
  }
}

function setBooleans(node) {
  var props = node.constructor.bools || node.bools;

  if (props) {
    props.forEach(function (prop) {
      setBoolean(node, prop);
    });
  }
}

function cap(name) {
  return name.substring(0, 1).toUpperCase() + name.substring(1);
}

function onify(name) {
  return 'on' + name.split('-').map(function (word) {
    return cap(word);
  }).join('');
}

function isBool(node, name) {
  return (node.bools || node.booleans || []).indexOf(name) > -1;
}

function boolNorm(value) {
  if (value === '') {
    return true;
  }

  return normalize(value);
}

function normalize(val) {
  if (typeof val === 'string') {
    val = val.trim();

    if (val === 'false') {
      return false;
    } else if (val === 'null') {
      return null;
    } else if (val === 'true') {
      return true;
    } // finds strings that start with numbers, but are not numbers:
    // '1team' '123 Street', '1-2-3', etc


    if (('' + val).replace(/-?\d*\.?\d*/, '').length) {
      return val;
    }
  }

  if (!isNaN(parseFloat(val))) {
    return parseFloat(val);
  }

  return val;
}

BaseComponent.normalize = normalize;
BaseComponent.addPlugin({
  name: 'properties',
  order: 10,
  init: function init(node) {
    setProperties(node);
    setBooleans(node);
  },
  preAttributeChanged: function preAttributeChanged(node, name, value) {
    if (node.isSettingAttribute) {
      return false;
    }

    if (isBool(node, name)) {
      value = boolNorm(value);
      node[name] = !!value;

      if (!value) {
        node[name] = false;
        node.isSettingAttribute = true;
        node.removeAttribute(name);
        node.isSettingAttribute = false;
      } else {
        node[name] = true;
      }

      return;
    }

    var v = normalize(value);
    node[name] = v;
  }
});

},{"./BaseComponent":1}],4:[function(require,module,exports){
"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var BaseComponent = require('./BaseComponent');

function assignRefs(node) {
  _toConsumableArray(node.querySelectorAll('[ref]')).forEach(function (child) {
    var name = child.getAttribute('ref');
    child.removeAttribute('ref');
    node[name] = child;
  });
}

function assignEvents(node) {
  // <div on="click:onClick">
  _toConsumableArray(node.querySelectorAll('[on]')).forEach(function (child, i, children) {
    if (child === node) {
      return;
    }

    var keyValue = child.getAttribute('on'),
        event = keyValue.split(':')[0].trim(),
        method = keyValue.split(':')[1].trim(); // remove, so parent does not try to use it

    child.removeAttribute('on');
    node.on(child, event, function (e) {
      node[method](e);
    });
  });
}

BaseComponent.addPlugin({
  name: 'refs',
  order: 30,
  preConnected: function preConnected(node) {
    assignRefs(node);
    assignEvents(node);
  }
});

},{"./BaseComponent":1}],5:[function(require,module,exports){
"use strict";

var BaseComponent = require('./BaseComponent');

var lightNodes = {};
var inserted = {};

function insert(node) {
  if (inserted[node._uid] || !hasTemplate(node)) {
    return;
  }

  collectLightNodes(node);
  insertTemplate(node);
  inserted[node._uid] = true;
}

function collectLightNodes(node) {
  lightNodes[node._uid] = lightNodes[node._uid] || [];

  while (node.childNodes.length) {
    lightNodes[node._uid].push(node.removeChild(node.childNodes[0]));
  }
}

function hasTemplate(node) {
  return node.templateString || node.templateId;
}

function insertTemplateChain(node) {
  var templates = node.getTemplateChain();
  templates.reverse().forEach(function (template) {
    getContainer(node).appendChild(BaseComponent.clone(template));
  });
  insertChildren(node);
}

function insertTemplate(node) {
  if (node.nestedTemplate) {
    insertTemplateChain(node);
    return;
  }

  var templateNode = node.getTemplateNode();

  if (templateNode) {
    node.appendChild(BaseComponent.clone(templateNode));
  }

  insertChildren(node);
}

function getContainer(node) {
  var containers = node.querySelectorAll('[ref="container"]');

  if (!containers || !containers.length) {
    return node;
  }

  return containers[containers.length - 1];
}

function insertChildren(node) {
  var i;
  var container = getContainer(node);
  var children = lightNodes[node._uid];

  if (container && children && children.length) {
    for (i = 0; i < children.length; i++) {
      container.appendChild(children[i]);
    }
  }
}

function toDom(html) {
  var node = document.createElement('div');
  node.innerHTML = html;
  return node.firstChild;
}

BaseComponent.prototype.getLightNodes = function () {
  return lightNodes[this._uid];
};

BaseComponent.prototype.getTemplateNode = function () {
  // caching causes different classes to pull the same template - wat?
  //if(!this.templateNode) {
  if (this.templateId) {
    this.templateNode = document.getElementById(this.templateId.replace('#', ''));
  } else if (this.templateString) {
    this.templateNode = toDom('<template>' + this.templateString + '</template>');
  } //}


  return this.templateNode;
};

BaseComponent.prototype.getTemplateChain = function () {
  var context = this,
      templates = [],
      template; // walk the prototype chain; Babel doesn't allow using
  // `super` since we are outside of the Class

  while (context) {
    context = Object.getPrototypeOf(context);

    if (!context) {
      break;
    } // skip prototypes without a template
    // (else it will pull an inherited template and cause duplicates)


    if (context.hasOwnProperty('templateString') || context.hasOwnProperty('templateId')) {
      template = context.getTemplateNode();

      if (template) {
        templates.push(template);
      }
    }
  }

  return templates;
};

BaseComponent.addPlugin({
  name: 'template',
  order: 20,
  preConnected: function preConnected(node) {
    insert(node);
  }
});

},{"./BaseComponent":1}],6:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* UMD.define */
(function (root, factory) {
  if (typeof customLoader === 'function') {
    customLoader(factory, 'dom');
  } else if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') {
    module.exports = factory();
  } else {
    root.returnExports = factory();
    window.dom = factory();
  }
})(void 0, function () {
  'use strict';

  var uids = {},
      destroyer = document.createElement('div');

  function isDimension(prop) {
    return !/opacity|index|flex|weight|^sdcsdcorder|tab|miter|group|zoom/i.test(prop);
  }

  function isNumber(value) {
    if (/\s/.test(value)) {
      return false;
    }

    return !isNaN(parseFloat(value));
  }

  function uid(type) {
    type = type || 'uid';

    if (uids[type] === undefined) {
      uids[type] = 0;
    }

    var id = type + '-' + (uids[type] + 1);
    uids[type]++;
    return id;
  }

  function isNode(item) {
    // safer test for custom elements in FF (with wc shim)
    // fragment is a special case
    return !!item && _typeof(item) === 'object' && (typeof item.innerHTML === 'string' || item.nodeName === '#document-fragment');
  }

  function byId(item) {
    if (typeof item === 'string') {
      return document.getElementById(item);
    }

    return item;
  }

  function style(node, prop, value) {
    var computed, result;

    if (_typeof(prop) === 'object') {
      // object setter
      Object.keys(prop).forEach(function (key) {
        style(node, key, prop[key]);
      });
      return null;
    } else if (value !== undefined) {
      // property setter
      if (typeof value === 'number' && isDimension(prop)) {
        value += 'px';
      }

      node.style[prop] = value;
    } // getter, if a simple style


    if (node.style[prop]) {
      result = node.style[prop];

      if (/px/.test(result)) {
        return parseFloat(result);
      }

      if (/%/.test(result)) {
        return parseFloat(result) * 0.01;
      }

      if (isNumber(result)) {
        return parseFloat(result);
      }

      return result;
    } // getter, computed


    computed = window.getComputedStyle(node);

    if (computed[prop]) {
      result = computed[prop];

      if (isNumber(result)) {
        return parseFloat(result);
      }

      return computed[prop];
    }

    return '';
  }

  function attr(node, prop, value) {
    if (_typeof(prop) === 'object') {
      var bools = {};
      var strings = {};
      var objects = {};
      var events = {};
      var functions = {};
      Object.keys(prop).forEach(function (key) {
        if (typeof prop[key] === 'boolean') {
          bools[key] = prop[key];
        } else if (_typeof(prop[key]) === 'object') {
          objects[key] = prop[key];
        } else if (typeof prop[key] === 'function') {
          if (/on[A-Z]/.test(key)) {
            events[key] = prop[key];
          } else {
            functions[key] = prop[key];
          }
        } else {
          strings[key] = prop[key];
        }
      }); // assigning properties in specific order of type, namely objects last

      Object.keys(bools).forEach(function (key) {
        attr(node, key, prop[key]);
      });
      Object.keys(strings).forEach(function (key) {
        attr(node, key, prop[key]);
      });
      Object.keys(events).forEach(function (key) {
        attr(node, key, prop[key]);
      });
      Object.keys(objects).forEach(function (key) {
        attr(node, key, prop[key]);
      });
      Object.keys(functions).forEach(function (key) {
        attr(node, key, prop[key]);
      });
      return null;
    } else if (value !== undefined) {
      if (prop === 'text' || prop === 'html' || prop === 'innerHTML') {
        // ignore, handled during creation
        return;
      } else if (prop === 'className' || prop === 'class') {
        dom.classList.add(node, value);
      } else if (prop === 'style') {
        style(node, value);
      } else if (prop === 'attr') {
        // back compat
        attr(node, value);
      } else if (typeof value === 'function') {
        if (/on[A-Z]/.test(prop)) {
          attachEvent(node, prop, value);
        } else {
          node[prop] = value;
        }
      } else if (_typeof(value) === 'object') {
        // object, like 'data'
        node[prop] = value;
      } else {
        if (value === false) {
          node.removeAttribute(prop);
        } else {
          node.setAttribute(prop, value);
        }
      }
    }

    return node.getAttribute(prop);
  }

  function attachEvent(node, prop, value) {
    var event = toEventName(prop);
    node.addEventListener(event, value);

    var callback = function callback(mutationsList) {
      mutationsList.forEach(function (mutation) {
        for (var i = 0; i < mutation.removedNodes.length; i++) {
          var n = mutation.removedNodes[i];

          if (n === node) {
            node.removeEventListener(event, value);
            observer.disconnect();
            break;
          }
        }
      });
    };

    var observer = new MutationObserver(callback);
    observer.observe(node.parentNode || document.body, {
      childList: true
    });
  }

  function box(node) {
    if (node === window) {
      node = document.documentElement;
    } // node dimensions
    // returned object is immutable
    // add scroll positioning and convenience abbreviations


    var dimensions = byId(node).getBoundingClientRect();
    return {
      top: dimensions.top,
      right: dimensions.right,
      bottom: dimensions.bottom,
      left: dimensions.left,
      height: dimensions.height,
      h: dimensions.height,
      width: dimensions.width,
      w: dimensions.width,
      scrollY: window.scrollY,
      scrollX: window.scrollX,
      x: dimensions.left + window.pageXOffset,
      y: dimensions.top + window.pageYOffset
    };
  }

  function relBox(node, parentNode) {
    var parent = parentNode || node.parentNode;
    var pBox = box(parent);
    var bx = box(node);
    return {
      w: bx.w,
      h: bx.h,
      x: bx.left - pBox.left,
      y: bx.top - pBox.top
    };
  }

  function size(node, type) {
    if (node === window) {
      node = document.documentElement;
    }

    if (type === 'scroll') {
      return {
        w: node.scrollWidth,
        h: node.scrollHeight
      };
    }

    if (type === 'client') {
      return {
        w: node.clientWidth,
        h: node.clientHeight
      };
    }

    return {
      w: node.offsetWidth,
      h: node.offsetHeight
    };
  }

  function query(node, selector) {
    if (!selector) {
      selector = node;
      node = document;
    }

    return node.querySelector(selector);
  }

  function queryAll(node, selector) {
    if (!selector) {
      selector = node;
      node = document;
    }

    var nodes = node.querySelectorAll(selector);

    if (!nodes.length) {
      return [];
    } // convert to Array and return it


    return Array.prototype.slice.call(nodes);
  }

  function toDom(html, options, parent) {
    var node = dom('div', {
      html: html
    });
    parent = byId(parent || options);

    if (parent) {
      while (node.firstChild) {
        parent.appendChild(node.firstChild);
      }

      return node.firstChild;
    }

    if (html.indexOf('<') !== 0) {
      return node;
    }

    return node.firstChild;
  }

  function fromDom(node) {
    function getAttrs(node) {
      var att,
          i,
          attrs = {};

      for (i = 0; i < node.attributes.length; i++) {
        att = node.attributes[i];
        attrs[att.localName] = normalize(att.value === '' ? true : att.value);
      }

      return attrs;
    }

    function getText(node) {
      var i,
          t,
          text = '';

      for (i = 0; i < node.childNodes.length; i++) {
        t = node.childNodes[i];

        if (t.nodeType === 3 && t.textContent.trim()) {
          text += t.textContent.trim();
        }
      }

      return text;
    }

    var i,
        object = getAttrs(node);
    object.text = getText(node);
    object.children = [];

    if (node.children.length) {
      for (i = 0; i < node.children.length; i++) {
        object.children.push(fromDom(node.children[i]));
      }
    }

    return object;
  }

  function addChildren(node, children) {
    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; i++) {
        if (children[i]) {
          if (typeof children[i] === 'string') {
            node.appendChild(toDom(children[i]));
          } else {
            node.appendChild(children[i]);
          }
        }
      }
    } else if (children) {
      node.appendChild(children);
    }
  }

  function removeChildren(node) {
    var children = [];

    while (node.children.length) {
      var child = node.children[0];
      children.push(node.removeChild(child));
    }

    return children;
  }

  function addContent(node, options) {
    var html;

    if (options.html !== undefined || options.innerHTML !== undefined) {
      html = options.html || options.innerHTML || '';

      if (_typeof(html) === 'object') {
        addChildren(node, html);
      } else {
        // careful assuming textContent -
        // misses some HTML, such as entities (&npsp;)
        node.innerHTML = html;
      }
    }

    if (options.text) {
      node.appendChild(document.createTextNode(options.text));
    }

    if (options.children) {
      addChildren(node, options.children);
    }
  }

  function dom(nodeType, options, parent, prepend) {
    options = options || {}; // if first argument is a string and starts with <, pass to toDom()

    if (nodeType.indexOf('<') === 0) {
      return toDom(nodeType, options, parent);
    }

    var node = document.createElement(nodeType);
    parent = byId(parent);
    addContent(node, options);
    attr(node, options);

    if (parent && isNode(parent)) {
      if (prepend && parent.hasChildNodes()) {
        parent.insertBefore(node, parent.children[0]);
      } else {
        parent.appendChild(node);
      }
    }

    return node;
  }

  function insertAfter(refNode, node) {
    var sibling = refNode.nextElementSibling;

    if (!sibling) {
      refNode.parentNode.appendChild(node);
    } else {
      refNode.parentNode.insertBefore(node, sibling);
    }

    return sibling;
  }

  function place(parent, node, position) {
    if (!parent.children.length || position === null || position === undefined || position === -1 || position >= parent.children.length) {
      parent.appendChild(node);
      return;
    }

    parent.insertBefore(node, parent.children[position]);
  }

  function destroy(node) {
    // destroys a node completely
    //
    if (node) {
      node.destroyed = true;
      destroyer.appendChild(node);
      destroyer.innerHTML = '';
    }
  }

  function clean(node, dispose) {
    //	Removes all child nodes
    //		dispose: destroy child nodes
    if (dispose) {
      while (node.children.length) {
        destroy(node.children[0]);
      }

      return;
    }

    while (node.children.length) {
      node.removeChild(node.children[0]);
    }
  }

  dom.frag = function (nodes) {
    var frag = document.createDocumentFragment();

    if (arguments.length > 1) {
      for (var i = 0; i < arguments.length; i++) {
        frag.appendChild(arguments[i]);
      }
    } else {
      if (Array.isArray(nodes)) {
        nodes.forEach(function (n) {
          frag.appendChild(n);
        });
      } else {
        frag.appendChild(nodes);
      }
    }

    return frag;
  };

  dom.classList = {
    // in addition to fixing IE11-toggle,
    // these methods also handle arrays
    remove: function remove(node, names) {
      toArray(names).forEach(function (name) {
        node.classList.remove(name);
      });
    },
    add: function add(node, names) {
      toArray(names).forEach(function (name) {
        node.classList.add(name);
      });
    },
    contains: function contains(node, names) {
      return toArray(names).every(function (name) {
        return node.classList.contains(name);
      });
    },
    toggle: function toggle(node, names, value) {
      names = toArray(names);

      if (typeof value === 'undefined') {
        // use standard functionality, supported by IE
        names.forEach(function (name) {
          node.classList.toggle(name, value);
        });
      } // IE11 does not support the second parameter
      else if (value) {
          names.forEach(function (name) {
            node.classList.add(name);
          });
        } else {
          names.forEach(function (name) {
            node.classList.remove(name);
          });
        }
    }
  };

  function normalize(val) {
    if (typeof val === 'string') {
      val = val.trim();

      if (val === 'false') {
        return false;
      } else if (val === 'null') {
        return null;
      } else if (val === 'true') {
        return true;
      } // finds strings that start with numbers, but are not numbers:
      // '2team' '123 Street', '1-2-3', etc


      if (('' + val).replace(/-?\d*\.?\d*/, '').length) {
        return val;
      }
    }

    if (!isNaN(parseFloat(val))) {
      return parseFloat(val);
    }

    return val;
  }

  function toArray(names) {
    if (!names) {
      return [];
    }

    return names.split(' ').map(function (name) {
      return name.trim();
    }).filter(function (name) {
      return !!name;
    });
  }

  function toEventName(s) {
    s = s.replace('on', '');
    var str = '';

    for (var i = 0; i < s.length; i++) {
      if (i === 0 || s.charCodeAt(i) > 90) {
        str += s[i].toLowerCase();
      } else {
        str += '-' + s[i].toLowerCase();
      }
    }

    return str;
  }

  dom.normalize = normalize;
  dom.clean = clean;
  dom.query = query;
  dom.queryAll = queryAll;
  dom.byId = byId;
  dom.attr = attr;
  dom.box = box;
  dom.style = style;
  dom.destroy = destroy;
  dom.uid = uid;
  dom.isNode = isNode;
  dom.toDom = toDom;
  dom.fromDom = fromDom;
  dom.insertAfter = insertAfter;
  dom.size = size;
  dom.relBox = relBox;
  dom.place = place;
  dom.removeChildren = removeChildren;
  return dom;
});

},{}],7:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (root, factory) {
  if (typeof customLoader === 'function') {
    customLoader(factory, 'on');
  } else if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') {
    module.exports = factory();
  } else {
    root.returnExports = window.on = factory();
  }
})(void 0, function () {
  'use strict'; // main function

  function on(node, eventName, filter, handler) {
    // normalize parameters
    if (typeof node === 'string') {
      node = getNodeById(node);
    } // prepare a callback


    var callback = makeCallback(node, filter, handler); // functional event

    if (typeof eventName === 'function') {
      return eventName(node, callback);
    } // special case: keydown/keyup with a list of expected keys
    // TODO: consider replacing with an explicit event function:
    // var h = on(node, onKeyEvent('keyup', /Enter,Esc/), callback);


    var keyEvent = /^(keyup|keydown):(.+)$/.exec(eventName);

    if (keyEvent) {
      return onKeyEvent(keyEvent[1], new RegExp(keyEvent[2].split(',').join('|')))(node, callback);
    } // handle multiple event types, like: on(node, 'mouseup, mousedown', callback);


    if (/,/.test(eventName)) {
      return on.makeMultiHandle(eventName.split(',').map(function (name) {
        return name.trim();
      }).filter(function (name) {
        return name;
      }).map(function (name) {
        return on(node, name, callback);
      }));
    } // handle registered functional events


    if (Object.prototype.hasOwnProperty.call(on.events, eventName)) {
      return on.events[eventName](node, callback);
    } // special case: loading an image


    if (eventName === 'load' && node.tagName.toLowerCase() === 'img') {
      return onImageLoad(node, callback);
    } // special case: mousewheel


    if (eventName === 'wheel') {
      // pass through, but first curry callback to wheel events
      callback = normalizeWheelEvent(callback);

      if (!hasWheel) {
        // old Firefox, old IE, Chrome
        return on.makeMultiHandle([on(node, 'DOMMouseScroll', callback), on(node, 'mousewheel', callback)]);
      }
    } // special case: keyboard


    if (/^key/.test(eventName)) {
      callback = normalizeKeyEvent(callback);
    } // default case


    return on.onDomEvent(node, eventName, callback);
  } // registered functional events


  on.events = {
    // handle click and Enter
    button: function button(node, callback) {
      return on.makeMultiHandle([on(node, 'click', callback), on(node, 'keyup:Enter', callback)]);
    },
    // custom - used for popups 'n stuff
    clickoff: function clickoff(node, callback) {
      // important note!
      // starts paused
      //
      var nodeDoc = node.ownerDocument.documentElement;
      var bHandle = makeMultiHandle([on(nodeDoc, 'click', function (e) {
        var target = e.target;

        if (target.nodeType !== 1) {
          target = target.parentNode;
        }

        if (target && !node.contains(target)) {
          callback(e);
        }
      }), on(nodeDoc, 'keyup', function (e) {
        if (e.key === 'Escape') {
          callback(e);
        }
      })]);
      var handle = {
        state: 'resumed',
        resume: function resume() {
          setTimeout(function () {
            bHandle.resume();
          }, 100);
          this.state = 'resumed';
        },
        pause: function pause() {
          bHandle.pause();
          this.state = 'paused';
        },
        remove: function remove() {
          bHandle.remove();
          this.state = 'removed';
        }
      };
      handle.pause();
      return handle;
    }
  }; // internal event handlers

  function onDomEvent(node, eventName, callback) {
    node.addEventListener(eventName, callback, false);
    return {
      remove: function remove() {
        node.removeEventListener(eventName, callback, false);
        node = callback = null;

        this.remove = this.pause = this.resume = function () {};
      },
      pause: function pause() {
        node.removeEventListener(eventName, callback, false);
      },
      resume: function resume() {
        node.addEventListener(eventName, callback, false);
      }
    };
  }

  function onImageLoad(node, callback) {
    var handle = on.makeMultiHandle([on.onDomEvent(node, 'load', onImageLoad), on(node, 'error', callback)]);
    return handle;

    function onImageLoad(e) {
      var interval = setInterval(function () {
        if (node.naturalWidth || node.naturalHeight) {
          clearInterval(interval);
          e.width = e.naturalWidth = node.naturalWidth;
          e.height = e.naturalHeight = node.naturalHeight;
          callback(e);
        }
      }, 100);
      handle.remove();
    }
  }

  function onKeyEvent(keyEventName, re) {
    return function onKeyHandler(node, callback) {
      return on(node, keyEventName, function onKey(e) {
        if (re.test(e.key)) {
          callback(e);
        }
      });
    };
  } // internal utilities


  var hasWheel = function hasWheelTest() {
    var isIE = navigator.userAgent.indexOf('Trident') > -1,
        div = document.createElement('div');
    return "onwheel" in div || "wheel" in div || isIE && document.implementation.hasFeature("Events.wheel", "3.0"); // IE feature detection
  }();

  var matches;
  ['matches', 'matchesSelector', 'webkit', 'moz', 'ms', 'o'].some(function (name) {
    if (name.length < 7) {
      // prefix
      name += 'MatchesSelector';
    }

    if (Element.prototype[name]) {
      matches = name;
      return true;
    }

    return false;
  });

  function closest(element, selector, parent) {
    while (element) {
      if (element[on.matches] && element[on.matches](selector)) {
        return element;
      }

      if (element === parent) {
        break;
      }

      element = element.parentElement;
    }

    return null;
  }

  var INVALID_PROPS = {
    isTrusted: 1
  };

  function mix(object, value) {
    if (!value) {
      return object;
    }

    if (_typeof(value) === 'object') {
      for (var key in value) {
        if (!INVALID_PROPS[key]) {
          object[key] = value[key];
        }
      }
    } else {
      object.value = value;
    }

    return object;
  }

  var ieKeys = {
    //a: 'TEST',
    Up: 'ArrowUp',
    Down: 'ArrowDown',
    Left: 'ArrowLeft',
    Right: 'ArrowRight',
    Esc: 'Escape',
    Spacebar: ' ',
    Win: 'Command'
  };

  function normalizeKeyEvent(callback) {
    // IE uses old spec
    return function normalizeKeys(e) {
      if (ieKeys[e.key]) {
        var fakeEvent = mix({}, e);
        fakeEvent.key = ieKeys[e.key];
        callback(fakeEvent);
      } else {
        callback(e);
      }
    };
  }

  var FACTOR = navigator.userAgent.indexOf('Windows') > -1 ? 10 : 0.1,
      XLR8 = 0,
      mouseWheelHandle;

  function normalizeWheelEvent(callback) {
    // normalizes all browsers' events to a standard:
    // delta, wheelY, wheelX
    // also adds acceleration and deceleration to make
    // Mac and Windows behave similarly
    return function normalizeWheel(e) {
      XLR8 += FACTOR;
      var deltaY = Math.max(-1, Math.min(1, e.wheelDeltaY || e.deltaY)),
          deltaX = Math.max(-10, Math.min(10, e.wheelDeltaX || e.deltaX));
      deltaY = deltaY <= 0 ? deltaY - XLR8 : deltaY + XLR8;
      e.delta = deltaY;
      e.wheelY = deltaY;
      e.wheelX = deltaX;
      clearTimeout(mouseWheelHandle);
      mouseWheelHandle = setTimeout(function () {
        XLR8 = 0;
      }, 300);
      callback(e);
    };
  }

  function closestFilter(element, selector) {
    return function (e) {
      return on.closest(e.target, selector, element);
    };
  }

  function makeMultiHandle(handles) {
    return {
      state: 'resumed',
      remove: function remove() {
        handles.forEach(function (h) {
          // allow for a simple function in the list
          if (h.remove) {
            h.remove();
          } else if (typeof h === 'function') {
            h();
          }
        });
        handles = [];

        this.remove = this.pause = this.resume = function () {};

        this.state = 'removed';
      },
      pause: function pause() {
        handles.forEach(function (h) {
          if (h.pause) {
            h.pause();
          }
        });
        this.state = 'paused';
      },
      resume: function resume() {
        handles.forEach(function (h) {
          if (h.resume) {
            h.resume();
          }
        });
        this.state = 'resumed';
      }
    };
  }

  function getNodeById(id) {
    var node = document.getElementById(id);

    if (!node) {
      console.error('`on` Could not find:', id);
    }

    return node;
  }

  function makeCallback(node, filter, handler) {
    if (filter && handler) {
      if (typeof filter === 'string') {
        filter = closestFilter(node, filter);
      }

      return function (e) {
        var result = filter(e);

        if (result) {
          e.filteredTarget = result;
          handler(e, result);
        }
      };
    }

    return filter || handler;
  }

  function getDoc(node) {
    return node === document || node === window ? document : node.ownerDocument;
  } // public functions


  on.once = function (node, eventName, filter, callback) {
    var h;

    if (filter && callback) {
      h = on(node, eventName, filter, function once() {
        callback.apply(window, arguments);
        h.remove();
      });
    } else {
      h = on(node, eventName, function once() {
        filter.apply(window, arguments);
        h.remove();
      });
    }

    return h;
  };

  on.emit = function (node, eventName, value) {
    node = typeof node === 'string' ? getNodeById(node) : node;
    var event = getDoc(node).createEvent('HTMLEvents');
    event.initEvent(eventName, true, true); // event type, bubbling, cancelable

    return node.dispatchEvent(mix(event, value));
  };

  on.fire = function (node, eventName, eventDetail, bubbles) {
    node = typeof node === 'string' ? getNodeById(node) : node;
    var event = getDoc(node).createEvent('CustomEvent');
    event.initCustomEvent(eventName, !!bubbles, true, eventDetail); // event type, bubbling, cancelable, value

    return node.dispatchEvent(event);
  }; // TODO: DEPRECATED


  on.isAlphaNumeric = function (str) {
    return /^[0-9a-z]$/i.test(str);
  };

  on.makeMultiHandle = makeMultiHandle;
  on.onDomEvent = onDomEvent; // use directly to prevent possible definition loops

  on.closest = closest;
  on.matches = matches;
  return on;
});

},{}],8:[function(require,module,exports){
"use strict";

var util = require('./util');

var dom = require('@clubajax/dom');

var on = require('@clubajax/on');

var Clickable = {
  init: function init(grid) {
    this.on('render', this.handleClicks.bind(this));
  },
  handleBodyClick: function handleBodyClick(e) {
    var index,
        item,
        emitEvent,
        field,
        row,
        rowId,
        cell = e.target.closest('td');

    if (cell) {
      field = cell.getAttribute('data-field');
    }

    row = e.target.closest('tr');

    if (!row) {
      return;
    }

    index = +row.getAttribute('data-index');
    rowId = dom.attr(row, 'data-row-id');

    if (!rowId) {
      return;
    }

    item = this.getItemById(rowId);
    emitEvent = {
      index: index,
      cell: cell,
      row: row,
      item: item,
      field: field,
      value: item[field],
      target: e.target
    };
    this.fire('row-click', emitEvent);
  },
  handleHeaderClick: function handleHeaderClick(event) {
    var cell = event.target.closest('th'),
        field = cell && cell.getAttribute('data-field'),
        emitEvent = {
      field: field,
      cell: cell,
      target: event.target
    };

    if (cell) {
      this.fire('header-click', emitEvent);
    }
  },
  handleClicks: function handleClicks(event) {
    var _this = this;

    if (this.handle) {
      this.handle.remove();
    }

    this.handle = on.makeMultiHandle([this.on(event.detail.tbody, 'keyup', function (e) {
      if (e.key === 'Enter') {
        _this.handleBodyClick(e);
      }
    }), this.on(event.detail.tbody, 'click', this.handleBodyClick.bind(this)), this.on(event.detail.thead, 'click', this.handleHeaderClick.bind(this))]);
  }
};

module.exports = function () {
  if (!this.hasClickable) {
    util.bindMethods(Clickable, this);
    this.hasClickable = true;
  }
};

},{"./util":13,"@clubajax/dom":6,"@clubajax/on":7}],9:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var BaseComponent = require('@clubajax/base-component');

var dom = require('@clubajax/dom');

var sortable = require('./sortable');

var clickable = require('./clickable');

var selectable = require('./selectable');

var scrollable = require('./scrollable');

var util = require('./util');

var PERF = true;
var log; // TODO
// widget / function for content (checkbox)
// automatic virtual scroll after 100+ rows
// optional column widths
// filter / search
// github.io demos

var DataTable = /*#__PURE__*/function (_BaseComponent) {
  _inherits(DataTable, _BaseComponent);

  function DataTable() {
    var _this;

    _classCallCheck(this, DataTable);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DataTable).call(this));
    _this.editable = false;
    _this.clickable = false;
    _this.sortable = false;
    _this.selectable = false;
    _this.scrollable = false;
    _this.data = [];
    _this.exclude = [];
    return _this;
  }

  _createClass(DataTable, [{
    key: "onData",
    value: function onData(value) {
      var _this2 = this;

      var items = value ? value.items || value.data : null;
      this.orgItems = items;

      if (!items) {
        this.displayNoData(true);
        return;
      }

      this.displayNoData(false);
      this.items = _toConsumableArray(items);
      this.mixPlugins();
      clearTimeout(this.noDataTimer);
      this.onDomReady(function () {
        _this2.render();
      });
    }
  }, {
    key: "domReady",
    value: function domReady() {
      var _this3 = this;

      this.perf = this.perf || PERF;

      if (!this.items) {
        this.noDataTimer = setTimeout(function () {
          _this3.displayNoData(true);
        }, 1000);
      }
    }
  }, {
    key: "render",
    value: function render() {
      this.fire('pre-render');
      this.renderTemplate();
      var columns = getColumns(this.data);

      if (!util.isEqual(columns, this.columns)) {
        this.columns = columns;
        this.renderHeader(this.columns);
      }

      this.renderBody(this.items, this.columns);
      this.fire('render', {
        table: this.table || this,
        thead: this.thead,
        tbody: this.tbody
      });
    } // is overwritten by scrollable

  }, {
    key: "renderTemplate",
    value: function renderTemplate() {
      if (this.table) {
        return;
      }

      this.table = dom('table', {
        tabindex: '1'
      }, this);
      this.thead = dom('thead', {}, this.table);
      this.tbody = dom('tbody', {}, this.table);
    }
  }, {
    key: "renderHeader",
    value: function renderHeader(columns) {
      dom.clean(this.thead, true);
      var tr = dom('tr', {}, this.thead);
      var colSizes = [];
      columns.forEach(function (col, i) {
        var key = col.key || col;
        var label = col.label === undefined ? col : col.label;
        var css = col.css || col.className || '';
        var options = {
          html: '<span>' + label + '</span>',
          css: css,
          'data-field': key
        };

        if (col.width) {
          colSizes[i] = col.width;
          options.style = {
            width: col.width
          };
        }

        dom('th', options, tr);
      });
      this.colSizes = colSizes;
      this.headHasRendered = true;
      this.fire('render-header', {
        thead: this.thead
      });
    }
  }, {
    key: "renderBody",
    value: function renderBody(items, columns) {
      var _this4 = this;

      var exclude = this.exclude;
      var tbody = this.tbody;
      dom.clean(tbody, true);

      if (!items || !items.length) {
        this.bodyHasRendered = true;
        this.fire('render-body', {
          tbody: this.tbody
        });
        this.displayNoData(true);
        return;
      }

      var editable = this.editable;
      var selectable = this.selectable;

      if (items[0].id === undefined) {
        console.warn('Items do not have an ID');
      } // TODO: if sort, just reorder - do perf test
      //console.time('render body');


      render(items, columns, this.colSizes, tbody, selectable, function () {
        // PERF: makes no difference:
        //this.table.appendChild(this.tbody);
        //console.timeEnd('render body');
        _this4.bodyHasRendered = true;

        _this4.fire('render-body', {
          tbody: _this4.tbody
        });
      });
    }
  }, {
    key: "getItemById",
    value: function getItemById(id) {
      return this.items.find(function (item) {
        return '' + item.id === '' + id;
      });
    }
  }, {
    key: "displayNoData",
    value: function displayNoData(show) {
      if (show) {
        this.classList.add('no-data');
      } else {
        this.classList.remove('no-data');
      }
    }
  }, {
    key: "mixPlugins",
    value: function mixPlugins() {
      if (this.clickable) {
        clickable.call(this);
      }

      if (this.sortable) {
        clickable.call(this);
        sortable.call(this);
      }

      if (this.selectable) {
        clickable.call(this);
        selectable.call(this);
      }

      if (this.scrollable) {
        scrollable.call(this);
      }

      this.mixPlugins = noop;
    }
  }]);

  return DataTable;
}(BaseComponent);

function render(items, columns, colSizes, tbody, selectable, callback) {
  items.forEach(function (item, index) {
    item.index = index;
    var itemCss = item.css || item["class"] || item.className;
    var html,
        css,
        key,
        rowOptions = {
      'data-row-id': item.id
    },
        tr;

    if (selectable) {
      rowOptions.tabindex = 1;
    }

    if (itemCss) {
      rowOptions["class"] = itemCss;
    }

    tr = dom('tr', rowOptions, tbody);
    columns.forEach(function (col, i) {
      key = col.key || col;
      html = key === 'index' ? index + 1 : item[key];

      if (col.callback) {
        html = col.callback(item, index);
      }

      css = key;
      var cellOptions = {
        html: html,
        'data-field': key,
        css: css
      };

      if (colSizes[i]) {
        cellOptions.style = {
          width: colSizes[i]
        };
      } // if (editable) {
      // 	cellOptions.tabindex = 1;
      // }


      dom('td', cellOptions, tr);
    });
  });
  callback();
}

function lazyRender(allItems, columns, tbody, sorts, callback) {
  var index = 0;

  function renderRows(items) {
    items.forEach(function (item) {
      item.index = index;
      var itemCss = item.css || item["class"] || item.className;
      var html,
          css,
          key,
          rowOptions = {
        'data-row-id': item.id
      },
          tr;

      if (selectable) {
        rowOptions.tabindex = 1;
      }

      if (itemCss) {
        rowOptions["class"] = itemCss;
      }

      tr = dom('tr', rowOptions, tbody);
      columns.forEach(function (col) {
        key = col.key || col;
        html = item[key];
        css = key;
        var cellOptions = {
          html: html,
          'data-field': key,
          css: css
        }; // if (editable) {
        // 	cellOptions.tabindex = 1;
        // }

        dom('td', cellOptions, tr);
      });
      index++;
    });
  }

  allItems = _toConsumableArray(allItems);

  function next() {
    var items = allItems.splice(0, 5);
    renderRows(items);

    if (allItems.length) {
      setTimeout(function () {
        next();
      }, 1);
    } else {
      callback();
    }
  }

  next();
}

function getColumns(data) {
  if (Array.isArray(data.columns)) {
    return data.columns;
  }

  return Object.keys(data.columns).map(function (key) {
    return {
      key: key,
      label: data.columns[key]
    };
  });
}

function noop() {}

module.exports = BaseComponent.define('data-table', DataTable, {
  props: ['data', 'sort', 'selected', 'stretch-column', 'max-height', 'borders'],
  bools: ['sortable', 'selectable', 'scrollable', 'clickable', 'perf']
});

},{"./clickable":8,"./scrollable":10,"./selectable":11,"./sortable":12,"./util":13,"@clubajax/base-component":2,"@clubajax/dom":6}],10:[function(require,module,exports){
"use strict";

var dom = require('@clubajax/dom');

var util = require('./util');

var Scrollable = {
  init: function init() {
    this.classList.add('scrollable');
    this.on('render-body', this.onRender.bind(this));
    this.on('resize', this.onRender.bind(this));
    this.on('pre-render', this.onPreRender.bind(this));
  },
  renderTemplate: function renderTemplate() {
    if (this.tableHeadWrapper) {
      return;
    }

    this.tableHeadWrapper = dom('div', {
      className: 'table-header-wrapper'
    }, this);
    this.tableHeader = dom('table', {
      className: 'table-header',
      tabindex: '1'
    }, this.tableHeadWrapper);
    this.thead = dom('thead', {}, this.tableHeader);
    this.tableBodyWrapper = dom('div', {
      className: 'table-body-wrapper',
      style: {
        'max-height': this['max-height'],
        'position': this['max-height'] ? 'static' : 'absolute'
      }
    }, this);
    this.tableBody = dom('table', {
      className: 'table-body',
      tabindex: '1'
    }, this.tableBodyWrapper);
    this.tbody = dom('tbody', {}, this.tableBody);
  },
  onPreRender: function onPreRender() {
    if (this.table) {
      this.scrollPos = this.table.scrollLeft;
    }
  },
  onRender: function onRender(event) {
    var _this = this;

    this.sizeColumns();

    if (this.scrollPos) {
      var sp = this.scrollPos;
      window.requestAnimationFrame(function () {
        _this.scrollLeft = sp;
      });
      this.scrollPos = 0;
    }
  },
  handleScroll: function handleScroll(event) {
    var head = this.tableHeadWrapper,
        body = this.tableBodyWrapper;
    var amt;
    head.scrollLeft = body.scrollLeft;

    if (head.scrollLeft !== body.scrollLeft) {
      amt = Math.ceil(head.scrollLeft - body.scrollLeft);
      head.style.left = amt + 1 + 'px';
      this.hasShift = true;
    } else if (this.hasShift) {
      head.style.left = '';
      this.hasShift = false;
    }
  },
  connectScroll: function connectScroll(detail) {
    window.requestAnimationFrame(function () {
      if (this.scrollHandle) {
        this.scrollHandle.remove();
      }

      this.scrollHandle = this.on(this.tableBodyWrapper, 'scroll', this.handleScroll.bind(this));
    }.bind(this));
  },
  sizeColumns: function sizeColumns() {
    var _this2 = this;

    var head = this.thead.parentNode;
    var body = this.tbody.parentNode;
    var colSizes = this.colSizes;
    var grid = this,
        tempNode = dom('div', {
      style: {
        position: 'absolute',
        width: '100px',
        height: '100px',
        zIndex: -1
      }
    }, document.body),
        gridParent = grid.parentNode,
        i,
        minWidth,
        thw,
        tdw,
        ths = head.querySelectorAll('th'),
        colPercent = 100 / ths.length + '%',
        firstTR = body.querySelector('tr'),
        tds,
        stretchy = getStretchyColumn(this);

    if (!firstTR) {
      return;
    } // remove grid from its current location
    // mainly because if it is in a dialog, the animation
    // CSS will mess up dimensions


    tempNode.appendChild(grid);
    tds = firstTR.querySelectorAll('td'); // reset
    //
    // set containers to absolute and an arbitrary, small width
    // to force cells to squeeze together so we can measure their
    // natural widths

    dom.style(head, {
      position: 'absolute',
      width: 100
    });
    dom.style(body, {
      position: 'absolute',
      width: 100
    }); // reset head THs

    for (i = 0; i < ths.length; i++) {
      dom.style(ths[i], {
        width: '',
        minWidth: ''
      }); // TDs shouldn't have a width yet,
      // unless this is a resize

      dom.style(tds[i], {
        width: '',
        minWidth: ''
      });
    } // wait for DOM to render before getting sizes


    window.requestAnimationFrame(function () {
      // after the next
      for (i = 0; i < ths.length; i++) {
        thw = dom.box(ths[i]).width;
        tdw = dom.box(tds[i]).width;

        if (colSizes[i]) {
          dom.style(ths[i], {
            minWidth: colSizes[i],
            maxWidth: colSizes[i]
          });
          dom.style(tds[i], {
            minWidth: colSizes[i],
            maxWidth: colSizes[i]
          });
        } else if (!/fixed\-width/.test(tds[i].className)) {
          minWidth = Math.max(thw, tdw);
          dom.style(ths[i], {
            minWidth: minWidth
          });
          dom.style(tds[i], {
            minWidth: minWidth
          });
        }

        if (stretchy === 'all') {
          dom.style(tds[i], {
            width: colPercent
          });
          dom.style(ths[i], {
            width: colPercent
          });
        } else if (stretchy === i) {
          dom.style(tds[i], {
            width: '100%'
          });
          dom.style(ths[i], {
            width: '100%'
          });
        }
      }

      var headeHeight = dom.box(_this2.tableHeader).height;
      grid.tableBodyWrapper.style.top = headeHeight - 1 + 'px'; // remove temp body styles

      dom.style(head, {
        position: '',
        width: ''
      });
      dom.style(body, {
        position: '',
        width: ''
      });
      gridParent.appendChild(grid);
      dom.destroy(tempNode);

      _this2.connectScroll();
    });
  }
};

function getStretchyColumn(self) {
  var sCol = self['stretch-column'];
  var cols = self.columns;

  if (sCol === 'all') {
    return 'all';
  }

  if (sCol === 'none') {
    return -1;
  }

  if (!sCol || sCol === 'last') {
    return cols.length - 1;
  }

  return cols.findIndex(function (col) {
    return col.key === sCol;
  });
}

module.exports = function () {
  if (!this.hasScrollable) {
    util.bindMethods(Scrollable, this);
    this.hasScrollable = true;
  }
};

},{"./util":13,"@clubajax/dom":6}],11:[function(require,module,exports){
"use strict";

var dom = require('@clubajax/dom');

var util = require('./util');

var SEL_CLASS = 'selected';
var Selectable = {
  init: function init() {
    this.classList.add('selectable');
    this.on('row-click', this.onRowClick.bind(this));
    this.on('render-body', this.displaySelection.bind(this));
  },
  onSelected: function onSelected(value) {
    if (value !== this.currentSelection) {
      this.selectRow(value);
    }
  },
  onRowClick: function onRowClick(e) {
    this.selectRow(e.detail.item.id);
  },
  selectRow: function selectRow(id) {
    var currentId;

    if (this.currentRow) {
      this.currentRow.classList.remove(SEL_CLASS);
      currentId = dom.attr(this.currentRow, 'data-row-id');
    }

    this.currentSelection = id === this.currentSelection ? null : id;
    var item = this.getItemById(this.currentSelection);
    var itemCss = item ? item.css || item["class"] || item.className : null;

    if (itemCss === 'unselectable') {
      this.currentSelection = null;
      item = null;
      id = null;
    }

    this.displaySelection();

    if (this.currentSelection) {
      var event = {
        row: this.currentRow,
        item: item,
        value: id
      };
      this.emit('change', event);
    } else {
      this.emit('change');
    }
  },
  displaySelection: function displaySelection() {
    if (this.currentSelection) {
      var row = dom.query(this, "[data-row-id=\"".concat(this.currentSelection, "\"]"));

      if (row) {
        row.classList.add(SEL_CLASS);
        this.currentRow = row;
      }
    }
  }
};

module.exports = function () {
  if (!this.hasSelectable) {
    util.bindMethods(Selectable, this);
    this.hasSelectable = true;
  }
};

},{"./util":13,"@clubajax/dom":6}],12:[function(require,module,exports){
"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var util = require('./util');

var dom = require('@clubajax/dom');

var Sortable = {
  init: function init() {
    this.classList.add('sortable');
    this.current = {};
    this.on('render-header', this.onHeaderRender.bind(this));
    this.setSort();
  },
  onSort: function onSort() {
    if (!this.sort) {
      this.setSort();
      return;
    }

    var _this$sort$split$map = this.sort.split(',').map(function (w) {
      return w.trim();
    }),
        _this$sort$split$map2 = _slicedToArray(_this$sort$split$map, 2),
        sort = _this$sort$split$map2[0],
        dir = _this$sort$split$map2[1];

    dir = !!sort ? dir || 'desc' : dir;
    this.setSort(sort, dir);
  },
  setSort: function setSort(sort, dir) {
    if (!sort && this.sort) {
      var split = this.sort.split(',').map(function (w) {
        return w.trim();
      });
      sort = split[0];
      dir = split[1];
    }

    this.current = {
      sort: sort,
      dir: dir
    };

    if (!dir) {
      this.items = _toConsumableArray(this.orgItems);
    } else {
      var lt = dir === 'asc' ? -1 : 1;
      var gt = dir === 'desc' ? -1 : 1;
      this.items.sort(function (a, b) {
        if (a[sort] < b[sort]) {
          return lt;
        } else if (a[sort] > b[sort]) {
          return gt;
        }

        return 0;
      });
    }

    if (this.bodyHasRendered) {
      this.renderBody(this.items, this.columns);
    }

    if (this.headHasRendered) {
      this.displaySort();
    }
  },
  onHeaderRender: function onHeaderRender() {
    if (this.clickHandle) {
      this.clickHandle.remove();
    }

    this.clickHandle = this.on('header-click', this.onHeaderClick.bind(this));
    this.displaySort();
  },
  displaySort: function displaySort() {
    if (this.currentSortField) {
      this.currentSortField.classList.remove(this.currentSortClass);
    }

    if (this.current.dir) {
      this.currentSortField = dom.query(this.thead, "[data-field=\"".concat(this.current.sort, "\"]"));
      this.currentSortClass = this.current.dir === 'asc' ? 'asc' : 'desc';
      this.currentSortField.classList.add(this.currentSortClass);
    }

    var event = this.current.sort ? "".concat(this.current.sort, ",").concat(this.current.dir) : null;
    this.fire('sort', {
      value: event
    });
  },
  onHeaderClick: function onHeaderClick(e) {
    var dir,
        field = e.detail.field,
        target = e.detail.cell;

    if (!target || target.className.indexOf('no-sort') > -1) {
      console.log('NOTARGET');
      return;
    }

    if (field === this.current.sort) {
      if (this.current.dir === 'asc') {
        dir = '';
      } else if (this.current.dir === 'desc') {
        dir = 'asc';
      } else {
        dir = 'desc';
      }
    } else {
      dir = 'desc';
    }

    this.setSort(field, dir);
  }
};

module.exports = function () {
  if (!this.hasSortable) {
    util.bindMethods(Sortable, this);
    this.hasSortable = true;
  }
};

},{"./util":13,"@clubajax/dom":6}],13:[function(require,module,exports){
"use strict";

function bindMethods(object, context) {
  Object.keys(object).forEach(function (key) {
    if (typeof object[key] === 'function') {
      // console.log('bind', key);
      // object[key] = object[key].bind(context);
      context[key] = object[key];
    }
  });

  if (object.init) {
    object.init.call(context);
  }
}

function isEqual(a, b) {
  if (a === b) {
    return true;
  }

  if (!a && b || a && !b) {
    return false;
  }

  return JSON.stringify(a) === JSON.stringify(b);
}

module.exports = {
  bindMethods: bindMethods,
  isEqual: isEqual
};

},{}],14:[function(require,module,exports){
"use strict";

require('./globals');

require('../../src/data-table');

},{"../../src/data-table":9,"./globals":15}],15:[function(require,module,exports){
"use strict";

// window['no-native-shim'] = false;
// require('@clubajax/custom-elements-polyfill');
window.on = require('@clubajax/on');
window.dom = require('@clubajax/dom');

},{"@clubajax/dom":6,"@clubajax/on":7}]},{},[14])(14)
});