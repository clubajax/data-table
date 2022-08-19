window.dom = require('@clubajax/dom');
window.on = require('@clubajax/on');
require('@clubajax/base-component');
require('@clubajax/form');

window.util = require('../src/util');

require('./filter-components');

mocha.allowUncaught();
