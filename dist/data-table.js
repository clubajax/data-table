(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.dataTable = f()}})(function(){var define,module,exports;return (function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

var _gPO = Object.getPrototypeOf || function _gPO(o) { return o.__proto__; };

var _sPO = Object.setPrototypeOf || function _sPO(o, p) { o.__proto__ = p; return o; };

var _construct = _typeof(Reflect) === "object" && Reflect.construct || function _construct(Parent, args, Class) { var Constructor, a = [null]; a.push.apply(a, args); Constructor = Parent.bind.apply(Parent, a); return _sPO(new Constructor(), Class.prototype); };

var _cache = typeof Map === "function" && new Map();

function _wrapNativeSuper(Class) { if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() {} Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writeable: true, configurable: true } }); return _sPO(Wrapper, _sPO(function Super() { return _construct(Class, arguments, _gPO(this).constructor); }, Class)); }

var _on = require('@clubajax/on');

var BaseComponent =
/*#__PURE__*/
function (_HTMLElement) {
  _inherits(BaseComponent, _HTMLElement);

  function BaseComponent() {
    var _this;

    _classCallCheck(this, BaseComponent);

    _this = _possibleConstructorReturn(this, (BaseComponent.__proto__ || Object.getPrototypeOf(BaseComponent)).call(this));
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
        plugin('preAttributeChanged', this, attrName, newVal, oldVal);

        if (this.attributeChanged) {
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
}(_wrapNativeSuper(HTMLElement));

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
module.exports = BaseComponent;

},{"@clubajax/on":8}],2:[function(require,module,exports){
module.exports = require('@clubajax/base-component/src/BaseComponent');

require('@clubajax/base-component/src/template');

require('@clubajax/base-component/src/properties');

require('@clubajax/base-component/src/refs');

},{"@clubajax/base-component/src/BaseComponent":1,"@clubajax/base-component/src/properties":3,"@clubajax/base-component/src/refs":4,"@clubajax/base-component/src/template":5}],3:[function(require,module,exports){
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
        var eventName = this.connectedProps ? 'onConnected' : 'onDomReady';
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
      this.setAttribute(prop, value);

      if (this.attributeChanged) {
        this.attributeChanged(prop, value);
      }

      var fn = this[onify(prop)];

      if (fn) {
        var eventName = this.connectedProps ? 'onConnected' : 'onDomReady';
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

function setObject(node, prop) {
  Object.defineProperty(node, prop, {
    enumerable: true,
    configurable: true,
    get: function get() {
      return this['__' + prop];
    },
    set: function set(value) {
      this['__' + prop] = value;
    }
  });
}

function setProperties(node) {
  var props = node.props || node.properties;

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
  var props = node.bools || node.booleans;

  if (props) {
    props.forEach(function (prop) {
      setBoolean(node, prop);
    });
  }
}

function setObjects(node) {
  var props = node.objects;

  if (props) {
    props.forEach(function (prop) {
      setObject(node, prop);
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

function propNorm(value) {
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

    node[name] = propNorm(value);
  }
});

},{"./BaseComponent":1}],4:[function(require,module,exports){
function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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
(function () {
  if (window['force-no-ce-shim']) {
    return;
  }

  var supportsV1 = 'customElements' in window;
  var nativeShimBase64 = "ZnVuY3Rpb24gbmF0aXZlU2hpbSgpeygoKT0+eyd1c2Ugc3RyaWN0JztpZighd2luZG93LmN1c3RvbUVsZW1lbnRzKXJldHVybjtjb25zdCBhPXdpbmRvdy5IVE1MRWxlbWVudCxiPXdpbmRvdy5jdXN0b21FbGVtZW50cy5kZWZpbmUsYz13aW5kb3cuY3VzdG9tRWxlbWVudHMuZ2V0LGQ9bmV3IE1hcCxlPW5ldyBNYXA7bGV0IGY9ITEsZz0hMTt3aW5kb3cuSFRNTEVsZW1lbnQ9ZnVuY3Rpb24oKXtpZighZil7Y29uc3Qgaj1kLmdldCh0aGlzLmNvbnN0cnVjdG9yKSxrPWMuY2FsbCh3aW5kb3cuY3VzdG9tRWxlbWVudHMsaik7Zz0hMDtjb25zdCBsPW5ldyBrO3JldHVybiBsfWY9ITE7fSx3aW5kb3cuSFRNTEVsZW1lbnQucHJvdG90eXBlPWEucHJvdG90eXBlO09iamVjdC5kZWZpbmVQcm9wZXJ0eSh3aW5kb3csJ2N1c3RvbUVsZW1lbnRzJyx7dmFsdWU6d2luZG93LmN1c3RvbUVsZW1lbnRzLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3aW5kb3cuY3VzdG9tRWxlbWVudHMsJ2RlZmluZScse3ZhbHVlOihqLGspPT57Y29uc3QgbD1rLnByb3RvdHlwZSxtPWNsYXNzIGV4dGVuZHMgYXtjb25zdHJ1Y3Rvcigpe3N1cGVyKCksT2JqZWN0LnNldFByb3RvdHlwZU9mKHRoaXMsbCksZ3x8KGY9ITAsay5jYWxsKHRoaXMpKSxnPSExO319LG49bS5wcm90b3R5cGU7bS5vYnNlcnZlZEF0dHJpYnV0ZXM9ay5vYnNlcnZlZEF0dHJpYnV0ZXMsbi5jb25uZWN0ZWRDYWxsYmFjaz1sLmNvbm5lY3RlZENhbGxiYWNrLG4uZGlzY29ubmVjdGVkQ2FsbGJhY2s9bC5kaXNjb25uZWN0ZWRDYWxsYmFjayxuLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjaz1sLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayxuLmFkb3B0ZWRDYWxsYmFjaz1sLmFkb3B0ZWRDYWxsYmFjayxkLnNldChrLGopLGUuc2V0KGosayksYi5jYWxsKHdpbmRvdy5jdXN0b21FbGVtZW50cyxqLG0pO30sY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHdpbmRvdy5jdXN0b21FbGVtZW50cywnZ2V0Jyx7dmFsdWU6KGopPT5lLmdldChqKSxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITB9KTt9KSgpO30=";

  if (supportsV1 && !window['force-ce-shim']) {
    if (!window['no-native-shim']) {
      eval(window.atob(nativeShimBase64));
      nativeShim();
    }
  } else {
    customElements();
  }

  function customElements() {
    (function () {
      // @license Polymer Project Authors. http://polymer.github.io/LICENSE.txt
      'use strict';

      var g = new function () {}();
      var aa = new Set("annotation-xml color-profile font-face font-face-src font-face-uri font-face-format font-face-name missing-glyph".split(" "));

      function k(b) {
        var a = aa.has(b);
        b = /^[a-z][.0-9_a-z]*-[\-.0-9_a-z]*$/.test(b);
        return !a && b;
      }

      function l(b) {
        var a = b.isConnected;
        if (void 0 !== a) return a;

        for (; b && !(b.__CE_isImportDocument || b instanceof Document);) {
          b = b.parentNode || (window.ShadowRoot && b instanceof ShadowRoot ? b.host : void 0);
        }

        return !(!b || !(b.__CE_isImportDocument || b instanceof Document));
      }

      function m(b, a) {
        for (; a && a !== b && !a.nextSibling;) {
          a = a.parentNode;
        }

        return a && a !== b ? a.nextSibling : null;
      }

      function n(b, a, e) {
        e = e ? e : new Set();

        for (var c = b; c;) {
          if (c.nodeType === Node.ELEMENT_NODE) {
            var d = c;
            a(d);
            var h = d.localName;

            if ("link" === h && "import" === d.getAttribute("rel")) {
              c = d.import;
              if (c instanceof Node && !e.has(c)) for (e.add(c), c = c.firstChild; c; c = c.nextSibling) {
                n(c, a, e);
              }
              c = m(b, d);
              continue;
            } else if ("template" === h) {
              c = m(b, d);
              continue;
            }

            if (d = d.__CE_shadowRoot) for (d = d.firstChild; d; d = d.nextSibling) {
              n(d, a, e);
            }
          }

          c = c.firstChild ? c.firstChild : m(b, c);
        }
      }

      function q(b, a, e) {
        b[a] = e;
      }

      ;

      function r() {
        this.a = new Map();
        this.f = new Map();
        this.c = [];
        this.b = !1;
      }

      function ba(b, a, e) {
        b.a.set(a, e);
        b.f.set(e.constructor, e);
      }

      function t(b, a) {
        b.b = !0;
        b.c.push(a);
      }

      function v(b, a) {
        b.b && n(a, function (a) {
          return w(b, a);
        });
      }

      function w(b, a) {
        if (b.b && !a.__CE_patched) {
          a.__CE_patched = !0;

          for (var e = 0; e < b.c.length; e++) {
            b.c[e](a);
          }
        }
      }

      function x(b, a) {
        var e = [];
        n(a, function (b) {
          return e.push(b);
        });

        for (a = 0; a < e.length; a++) {
          var c = e[a];
          1 === c.__CE_state ? b.connectedCallback(c) : y(b, c);
        }
      }

      function z(b, a) {
        var e = [];
        n(a, function (b) {
          return e.push(b);
        });

        for (a = 0; a < e.length; a++) {
          var c = e[a];
          1 === c.__CE_state && b.disconnectedCallback(c);
        }
      }

      function A(b, a, e) {
        e = e ? e : new Set();
        var c = [];
        n(a, function (d) {
          if ("link" === d.localName && "import" === d.getAttribute("rel")) {
            var a = d.import;
            a instanceof Node && "complete" === a.readyState ? (a.__CE_isImportDocument = !0, a.__CE_hasRegistry = !0) : d.addEventListener("load", function () {
              var a = d.import;
              a.__CE_documentLoadHandled || (a.__CE_documentLoadHandled = !0, a.__CE_isImportDocument = !0, a.__CE_hasRegistry = !0, new Set(e), e.delete(a), A(b, a, e));
            });
          } else c.push(d);
        }, e);
        if (b.b) for (a = 0; a < c.length; a++) {
          w(b, c[a]);
        }

        for (a = 0; a < c.length; a++) {
          y(b, c[a]);
        }
      }

      function y(b, a) {
        if (void 0 === a.__CE_state) {
          var e = b.a.get(a.localName);

          if (e) {
            e.constructionStack.push(a);
            var c = e.constructor;

            try {
              try {
                if (new c() !== a) throw Error("The custom element constructor did not produce the element being upgraded.");
              } finally {
                e.constructionStack.pop();
              }
            } catch (f) {
              throw a.__CE_state = 2, f;
            }

            a.__CE_state = 1;
            a.__CE_definition = e;
            if (e.attributeChangedCallback) for (e = e.observedAttributes, c = 0; c < e.length; c++) {
              var d = e[c],
                  h = a.getAttribute(d);
              null !== h && b.attributeChangedCallback(a, d, null, h, null);
            }
            l(a) && b.connectedCallback(a);
          }
        }
      }

      r.prototype.connectedCallback = function (b) {
        var a = b.__CE_definition;
        a.connectedCallback && a.connectedCallback.call(b);
      };

      r.prototype.disconnectedCallback = function (b) {
        var a = b.__CE_definition;
        a.disconnectedCallback && a.disconnectedCallback.call(b);
      };

      r.prototype.attributeChangedCallback = function (b, a, e, c, d) {
        var h = b.__CE_definition;
        h.attributeChangedCallback && -1 < h.observedAttributes.indexOf(a) && h.attributeChangedCallback.call(b, a, e, c, d);
      };

      function B(b, a) {
        this.c = b;
        this.a = a;
        this.b = void 0;
        A(this.c, this.a);
        "loading" === this.a.readyState && (this.b = new MutationObserver(this.f.bind(this)), this.b.observe(this.a, {
          childList: !0,
          subtree: !0
        }));
      }

      function C(b) {
        b.b && b.b.disconnect();
      }

      B.prototype.f = function (b) {
        var a = this.a.readyState;
        "interactive" !== a && "complete" !== a || C(this);

        for (a = 0; a < b.length; a++) {
          for (var e = b[a].addedNodes, c = 0; c < e.length; c++) {
            A(this.c, e[c]);
          }
        }
      };

      function ca() {
        var b = this;
        this.b = this.a = void 0;
        this.c = new Promise(function (a) {
          b.b = a;
          b.a && a(b.a);
        });
      }

      function D(b) {
        if (b.a) throw Error("Already resolved.");
        b.a = void 0;
        b.b && b.b(void 0);
      }

      ;

      function E(b) {
        this.f = !1;
        this.a = b;
        this.h = new Map();

        this.g = function (b) {
          return b();
        };

        this.b = !1;
        this.c = [];
        this.j = new B(b, document);
      }

      E.prototype.l = function (b, a) {
        var e = this;
        if (!(a instanceof Function)) throw new TypeError("Custom element constructors must be functions.");
        if (!k(b)) throw new SyntaxError("The element name '" + b + "' is not valid.");
        if (this.a.a.get(b)) throw Error("A custom element with name '" + b + "' has already been defined.");
        if (this.f) throw Error("A custom element is already being defined.");
        this.f = !0;
        var c, d, h, f, u;

        try {
          var p = function p(b) {
            var a = P[b];
            if (void 0 !== a && !(a instanceof Function)) throw Error("The '" + b + "' callback must be a function.");
            return a;
          },
              P = a.prototype;

          if (!(P instanceof Object)) throw new TypeError("The custom element constructor's prototype is not an object.");
          c = p("connectedCallback");
          d = p("disconnectedCallback");
          h = p("adoptedCallback");
          f = p("attributeChangedCallback");
          u = a.observedAttributes || [];
        } catch (va) {
          return;
        } finally {
          this.f = !1;
        }

        ba(this.a, b, {
          localName: b,
          constructor: a,
          connectedCallback: c,
          disconnectedCallback: d,
          adoptedCallback: h,
          attributeChangedCallback: f,
          observedAttributes: u,
          constructionStack: []
        });
        this.c.push(b);
        this.b || (this.b = !0, this.g(function () {
          if (!1 !== e.b) for (e.b = !1, A(e.a, document); 0 < e.c.length;) {
            var b = e.c.shift();
            (b = e.h.get(b)) && D(b);
          }
        }));
      };

      E.prototype.get = function (b) {
        if (b = this.a.a.get(b)) return b.constructor;
      };

      E.prototype.o = function (b) {
        if (!k(b)) return Promise.reject(new SyntaxError("'" + b + "' is not a valid custom element name."));
        var a = this.h.get(b);
        if (a) return a.c;
        a = new ca();
        this.h.set(b, a);
        this.a.a.get(b) && -1 === this.c.indexOf(b) && D(a);
        return a.c;
      };

      E.prototype.m = function (b) {
        C(this.j);
        var a = this.g;

        this.g = function (e) {
          return b(function () {
            return a(e);
          });
        };
      };

      window.CustomElementRegistry = E;
      E.prototype.define = E.prototype.l;
      E.prototype.get = E.prototype.get;
      E.prototype.whenDefined = E.prototype.o;
      E.prototype.polyfillWrapFlushCallback = E.prototype.m;
      var F = window.Document.prototype.createElement,
          da = window.Document.prototype.createElementNS,
          ea = window.Document.prototype.importNode,
          fa = window.Document.prototype.prepend,
          ga = window.Document.prototype.append,
          G = window.Node.prototype.cloneNode,
          H = window.Node.prototype.appendChild,
          I = window.Node.prototype.insertBefore,
          J = window.Node.prototype.removeChild,
          K = window.Node.prototype.replaceChild,
          L = Object.getOwnPropertyDescriptor(window.Node.prototype, "textContent"),
          M = window.Element.prototype.attachShadow,
          N = Object.getOwnPropertyDescriptor(window.Element.prototype, "innerHTML"),
          O = window.Element.prototype.getAttribute,
          Q = window.Element.prototype.setAttribute,
          R = window.Element.prototype.removeAttribute,
          S = window.Element.prototype.getAttributeNS,
          T = window.Element.prototype.setAttributeNS,
          U = window.Element.prototype.removeAttributeNS,
          V = window.Element.prototype.insertAdjacentElement,
          ha = window.Element.prototype.prepend,
          ia = window.Element.prototype.append,
          ja = window.Element.prototype.before,
          ka = window.Element.prototype.after,
          la = window.Element.prototype.replaceWith,
          ma = window.Element.prototype.remove,
          na = window.HTMLElement,
          W = Object.getOwnPropertyDescriptor(window.HTMLElement.prototype, "innerHTML"),
          X = window.HTMLElement.prototype.insertAdjacentElement;

      function oa() {
        var b = Y;

        window.HTMLElement = function () {
          function a() {
            var a = this.constructor,
                c = b.f.get(a);
            if (!c) throw Error("The custom element being constructed was not registered with `customElements`.");
            var d = c.constructionStack;
            if (!d.length) return d = F.call(document, c.localName), Object.setPrototypeOf(d, a.prototype), d.__CE_state = 1, d.__CE_definition = c, w(b, d), d;
            var c = d.length - 1,
                h = d[c];
            if (h === g) throw Error("The HTMLElement constructor was either called reentrantly for this constructor or called multiple times.");
            d[c] = g;
            Object.setPrototypeOf(h, a.prototype);
            w(b, h);
            return h;
          }

          a.prototype = na.prototype;
          return a;
        }();
      }

      ;

      function pa(b, a, e) {
        a.prepend = function (a) {
          for (var d = [], c = 0; c < arguments.length; ++c) {
            d[c - 0] = arguments[c];
          }

          c = d.filter(function (b) {
            return b instanceof Node && l(b);
          });
          e.i.apply(this, d);

          for (var f = 0; f < c.length; f++) {
            z(b, c[f]);
          }

          if (l(this)) for (c = 0; c < d.length; c++) {
            f = d[c], f instanceof Element && x(b, f);
          }
        };

        a.append = function (a) {
          for (var d = [], c = 0; c < arguments.length; ++c) {
            d[c - 0] = arguments[c];
          }

          c = d.filter(function (b) {
            return b instanceof Node && l(b);
          });
          e.append.apply(this, d);

          for (var f = 0; f < c.length; f++) {
            z(b, c[f]);
          }

          if (l(this)) for (c = 0; c < d.length; c++) {
            f = d[c], f instanceof Element && x(b, f);
          }
        };
      }

      ;

      function qa() {
        var b = Y;
        q(Document.prototype, "createElement", function (a) {
          if (this.__CE_hasRegistry) {
            var e = b.a.get(a);
            if (e) return new e.constructor();
          }

          a = F.call(this, a);
          w(b, a);
          return a;
        });
        q(Document.prototype, "importNode", function (a, e) {
          a = ea.call(this, a, e);
          this.__CE_hasRegistry ? A(b, a) : v(b, a);
          return a;
        });
        q(Document.prototype, "createElementNS", function (a, e) {
          if (this.__CE_hasRegistry && (null === a || "http://www.w3.org/1999/xhtml" === a)) {
            var c = b.a.get(e);
            if (c) return new c.constructor();
          }

          a = da.call(this, a, e);
          w(b, a);
          return a;
        });
        pa(b, Document.prototype, {
          i: fa,
          append: ga
        });
      }

      ;

      function ra() {
        var b = Y;

        function a(a, c) {
          Object.defineProperty(a, "textContent", {
            enumerable: c.enumerable,
            configurable: !0,
            get: c.get,
            set: function set(a) {
              if (this.nodeType === Node.TEXT_NODE) c.set.call(this, a);else {
                var d = void 0;

                if (this.firstChild) {
                  var e = this.childNodes,
                      u = e.length;
                  if (0 < u && l(this)) for (var d = Array(u), p = 0; p < u; p++) {
                    d[p] = e[p];
                  }
                }

                c.set.call(this, a);
                if (d) for (a = 0; a < d.length; a++) {
                  z(b, d[a]);
                }
              }
            }
          });
        }

        q(Node.prototype, "insertBefore", function (a, c) {
          if (a instanceof DocumentFragment) {
            var d = Array.prototype.slice.apply(a.childNodes);
            a = I.call(this, a, c);
            if (l(this)) for (c = 0; c < d.length; c++) {
              x(b, d[c]);
            }
            return a;
          }

          d = l(a);
          c = I.call(this, a, c);
          d && z(b, a);
          l(this) && x(b, a);
          return c;
        });
        q(Node.prototype, "appendChild", function (a) {
          if (a instanceof DocumentFragment) {
            var c = Array.prototype.slice.apply(a.childNodes);
            a = H.call(this, a);
            if (l(this)) for (var d = 0; d < c.length; d++) {
              x(b, c[d]);
            }
            return a;
          }

          c = l(a);
          d = H.call(this, a);
          c && z(b, a);
          l(this) && x(b, a);
          return d;
        });
        q(Node.prototype, "cloneNode", function (a) {
          a = G.call(this, a);
          this.ownerDocument.__CE_hasRegistry ? A(b, a) : v(b, a);
          return a;
        });
        q(Node.prototype, "removeChild", function (a) {
          var c = l(a),
              d = J.call(this, a);
          c && z(b, a);
          return d;
        });
        q(Node.prototype, "replaceChild", function (a, c) {
          if (a instanceof DocumentFragment) {
            var d = Array.prototype.slice.apply(a.childNodes);
            a = K.call(this, a, c);
            if (l(this)) for (z(b, c), c = 0; c < d.length; c++) {
              x(b, d[c]);
            }
            return a;
          }

          var d = l(a),
              e = K.call(this, a, c),
              f = l(this);
          f && z(b, c);
          d && z(b, a);
          f && x(b, a);
          return e;
        });
        L && L.get ? a(Node.prototype, L) : t(b, function (b) {
          a(b, {
            enumerable: !0,
            configurable: !0,
            get: function get() {
              for (var a = [], b = 0; b < this.childNodes.length; b++) {
                a.push(this.childNodes[b].textContent);
              }

              return a.join("");
            },
            set: function set(a) {
              for (; this.firstChild;) {
                J.call(this, this.firstChild);
              }

              H.call(this, document.createTextNode(a));
            }
          });
        });
      }

      ;

      function sa(b) {
        var a = Element.prototype;

        a.before = function (a) {
          for (var c = [], d = 0; d < arguments.length; ++d) {
            c[d - 0] = arguments[d];
          }

          d = c.filter(function (a) {
            return a instanceof Node && l(a);
          });
          ja.apply(this, c);

          for (var e = 0; e < d.length; e++) {
            z(b, d[e]);
          }

          if (l(this)) for (d = 0; d < c.length; d++) {
            e = c[d], e instanceof Element && x(b, e);
          }
        };

        a.after = function (a) {
          for (var c = [], d = 0; d < arguments.length; ++d) {
            c[d - 0] = arguments[d];
          }

          d = c.filter(function (a) {
            return a instanceof Node && l(a);
          });
          ka.apply(this, c);

          for (var e = 0; e < d.length; e++) {
            z(b, d[e]);
          }

          if (l(this)) for (d = 0; d < c.length; d++) {
            e = c[d], e instanceof Element && x(b, e);
          }
        };

        a.replaceWith = function (a) {
          for (var c = [], d = 0; d < arguments.length; ++d) {
            c[d - 0] = arguments[d];
          }

          var d = c.filter(function (a) {
            return a instanceof Node && l(a);
          }),
              e = l(this);
          la.apply(this, c);

          for (var f = 0; f < d.length; f++) {
            z(b, d[f]);
          }

          if (e) for (z(b, this), d = 0; d < c.length; d++) {
            e = c[d], e instanceof Element && x(b, e);
          }
        };

        a.remove = function () {
          var a = l(this);
          ma.call(this);
          a && z(b, this);
        };
      }

      ;

      function ta() {
        var b = Y;

        function a(a, c) {
          Object.defineProperty(a, "innerHTML", {
            enumerable: c.enumerable,
            configurable: !0,
            get: c.get,
            set: function set(a) {
              var d = this,
                  e = void 0;
              l(this) && (e = [], n(this, function (a) {
                a !== d && e.push(a);
              }));
              c.set.call(this, a);
              if (e) for (var f = 0; f < e.length; f++) {
                var h = e[f];
                1 === h.__CE_state && b.disconnectedCallback(h);
              }
              this.ownerDocument.__CE_hasRegistry ? A(b, this) : v(b, this);
              return a;
            }
          });
        }

        function e(a, c) {
          q(a, "insertAdjacentElement", function (a, d) {
            var e = l(d);
            a = c.call(this, a, d);
            e && z(b, d);
            l(a) && x(b, d);
            return a;
          });
        }

        M ? q(Element.prototype, "attachShadow", function (a) {
          return this.__CE_shadowRoot = a = M.call(this, a);
        }) : console.warn("Custom Elements: `Element#attachShadow` was not patched.");
        if (N && N.get) a(Element.prototype, N);else if (W && W.get) a(HTMLElement.prototype, W);else {
          var c = F.call(document, "div");
          t(b, function (b) {
            a(b, {
              enumerable: !0,
              configurable: !0,
              get: function get() {
                return G.call(this, !0).innerHTML;
              },
              set: function set(a) {
                var b = "template" === this.localName ? this.content : this;

                for (c.innerHTML = a; 0 < b.childNodes.length;) {
                  J.call(b, b.childNodes[0]);
                }

                for (; 0 < c.childNodes.length;) {
                  H.call(b, c.childNodes[0]);
                }
              }
            });
          });
        }
        q(Element.prototype, "setAttribute", function (a, c) {
          if (1 !== this.__CE_state) return Q.call(this, a, c);
          var d = O.call(this, a);
          Q.call(this, a, c);
          c = O.call(this, a);
          d !== c && b.attributeChangedCallback(this, a, d, c, null);
        });
        q(Element.prototype, "setAttributeNS", function (a, c, e) {
          if (1 !== this.__CE_state) return T.call(this, a, c, e);
          var d = S.call(this, a, c);
          T.call(this, a, c, e);
          e = S.call(this, a, c);
          d !== e && b.attributeChangedCallback(this, c, d, e, a);
        });
        q(Element.prototype, "removeAttribute", function (a) {
          if (1 !== this.__CE_state) return R.call(this, a);
          var c = O.call(this, a);
          R.call(this, a);
          null !== c && b.attributeChangedCallback(this, a, c, null, null);
        });
        q(Element.prototype, "removeAttributeNS", function (a, c) {
          if (1 !== this.__CE_state) return U.call(this, a, c);
          var d = S.call(this, a, c);
          U.call(this, a, c);
          var e = S.call(this, a, c);
          d !== e && b.attributeChangedCallback(this, c, d, e, a);
        });
        X ? e(HTMLElement.prototype, X) : V ? e(Element.prototype, V) : console.warn("Custom Elements: `Element#insertAdjacentElement` was not patched.");
        pa(b, Element.prototype, {
          i: ha,
          append: ia
        });
        sa(b);
      }

      ;
      var Z = window.customElements;

      if (!Z || Z.forcePolyfill || "function" != typeof Z.define || "function" != typeof Z.get) {
        var Y = new r();
        oa();
        qa();
        ra();
        ta();
        document.__CE_hasRegistry = !0;
        var ua = new E(Y);
        Object.defineProperty(window, "customElements", {
          configurable: !0,
          enumerable: !0,
          value: ua
        });
      }

      ;
    }).call(self);
  }
})();

},{}],7:[function(require,module,exports){
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
})(this, function () {
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
    var key, computed, result;

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
    var key;

    if (_typeof(prop) === 'object') {
      var bools = {};
      var strings = {};
      var objects = {};
      var events = {};
      Object.keys(prop).forEach(function (key) {
        if (typeof prop[key] === 'boolean') {
          bools[key] = prop[key];
        } else if (_typeof(prop[key]) === 'object') {
          objects[key] = prop[key];
        } else if (typeof prop[key] === 'function') {
          if (/on[A-Z]/.test(key)) {
            events[key] = prop[key];
          } else {
            console.warn('dom warning: function used with `onEvent` syntax');
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
        attachEvent(node, prop, value);
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
    var event = prop.replace('on', '').toLowerCase();
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
  return dom;
});

},{}],8:[function(require,module,exports){
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
})(this, function () {
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
      var bHandle = on(node.ownerDocument.documentElement, 'click', function (e) {
        var target = e.target;

        if (target.nodeType !== 1) {
          target = target.parentNode;
        }

        if (target && !node.contains(target)) {
          callback(e);
        }
      });
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

},{}],9:[function(require,module,exports){
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

},{"./util":14,"@clubajax/dom":7,"@clubajax/on":8}],10:[function(require,module,exports){
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BaseComponent = require('@clubajax/base-component');

var dom = require('@clubajax/dom');

var sortable = require('./sortable');

var clickable = require('./clickable');

var selectable = require('./selectable');

var scrollable = require('./scrollable');

var util = require('./util');

var props = ['data', 'sort', 'selected', 'stretch-column'];
var bools = ['sortable', 'selectable', 'scrollable', 'perf'];
var PERF = true;
var log; // TODO
// widget / function for content (checkbox)
// automatic virtual scroll after 100+ rows
// optional column widths
// filter / search
// github.io demos

var DataTable =
/*#__PURE__*/
function (_BaseComponent) {
  _inherits(DataTable, _BaseComponent);

  _createClass(DataTable, [{
    key: "props",
    get: function get() {
      return props;
    }
  }, {
    key: "bools",
    get: function get() {
      return bools;
    }
  }], [{
    key: "observedAttributes",
    get: function get() {
      return props.concat(bools);
    }
  }]);

  function DataTable() {
    _classCallCheck(this, DataTable);

    return _possibleConstructorReturn(this, (DataTable.__proto__ || Object.getPrototypeOf(DataTable)).call(this));
  }

  _createClass(DataTable, [{
    key: "onData",
    value: function onData(value) {
      var _this = this;

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
      onDomReady(this, function () {
        _this.render();
      });
    }
  }, {
    key: "domReady",
    value: function domReady() {
      var _this2 = this;

      this.perf = this.perf || PERF;
      this.noDataTimer = setTimeout(function () {
        _this2.displayNoData(true);
      }, 1000);
    }
  }, {
    key: "render",
    value: function render() {
      this.fire('pre-render');
      console.time('render');
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
      var _this3 = this;

      var exclude = this.exclude || [];
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

      if (!items[0].id) {
        console.warn('Items do not have an ID');
      } // TODO: if sort, just reorder - do perf test
      //console.time('render body');


      render(items, columns, this.colSizes, tbody, selectable, function () {
        // PERF: makes no difference:
        //this.table.appendChild(this.tbody);
        //console.timeEnd('render body');
        _this3.bodyHasRendered = true;
        requestAnimationFrame(function () {
          console.timeEnd('render');
        });

        _this3.fire('render-body', {
          tbody: _this3.tbody
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
    var itemCss = item.css || item.class || item.className;
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
      rowOptions.class = itemCss;
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
      var itemCss = item.css || item.class || item.className;
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
        rowOptions.class = itemCss;
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

customElements.define('data-table', DataTable);
module.exports = DataTable;

},{"./clickable":9,"./scrollable":11,"./selectable":12,"./sortable":13,"./util":14,"@clubajax/base-component":2,"@clubajax/dom":7}],11:[function(require,module,exports){
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
      className: 'table-body-wrapper'
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

},{"./util":14,"@clubajax/dom":7}],12:[function(require,module,exports){
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
    var itemCss = item ? item.css || item.class || item.className : null;

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

},{"./util":14,"@clubajax/dom":7}],13:[function(require,module,exports){
function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return _sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }

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

    var _sort$split$map = this.sort.split(',').map(function (w) {
      return w.trim();
    }),
        _sort$split$map2 = _slicedToArray(_sort$split$map, 2),
        sort = _sort$split$map2[0],
        dir = _sort$split$map2[1];

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
        dir = 'desc';
      } else if (this.current.dir === 'desc') {
        dir = '';
      } else {
        dir = 'desc';
      }
    } else {
      dir = 'asc';
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

},{"./util":14,"@clubajax/dom":7}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
require('./globals');

require('../../src/data-table');

},{"../../src/data-table":10,"./globals":16}],16:[function(require,module,exports){
window['no-native-shim'] = false;

require('@clubajax/custom-elements-polyfill');

window.on = require('@clubajax/on');
window.dom = require('@clubajax/dom');

},{"@clubajax/custom-elements-polyfill":6,"@clubajax/dom":7,"@clubajax/on":8}]},{},[15])(15)
});