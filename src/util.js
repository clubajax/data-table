const formatters = require('@clubajax/format');
const dom = require('@clubajax/dom');

function bindMethods(object, context) {
	Object.keys(object).forEach((key) => {
		if (typeof object[key] === 'function') {
			// console.log('bind', key);
			// object[key] = object[key].bind(context);
			context[key] = object[key];
		}
	});

	if (object.init){
		object.init.call(context);
	}
}

function isEqual (a, b) {
	if (a === b) {
		return true;
	}
	if (!a && b || a && !b) {
		return false;
	}
	return JSON.stringify(a) === JSON.stringify(b);
}

function classnames (firstClass) {
    const css = [];
    if (firstClass) {
        css.push(firstClass);
    }
    const push = (cls) => {
        if (cls === undefined) {
            return css.join(' ');
        }
        if (cls) {
            css.push(cls);
        }
    }
    return push;
}

const SPACE = '&nbsp;';
function toHtml(value, formatter) {
    value = typeof value === 'string' ? value.trim() : value;
    if (value === null || value === undefined || value === '') {
        return SPACE;
    }
    return formatter.toHtml(value);
}

function fromHtml(value, formatter) {
    value = value === SPACE ? '' : value;
    value = typeof value === 'string' ? value.trim() : value;
    return formatter.from(value);
}

function getFormatter(col, item){
    let fmt = col.format || (col.component ? (col.component.format || '') : '');
    if (/property:/.test(fmt)) {
        const prop = (fmt.split(':')[1] || '').trim();
        if (prop) {
            fmt = item[prop];
        } 
    }
    return formatters[fmt] || formatters.default;
}

function position(node, button, {align}) {
    const btn = dom.box(button);
    const n = dom.box(node);
    const gapH = 20;
    const gapV = 5;

    switch (align) {
        case 'left':
            dom.style(node, {
                top: btn.y,
                left: btn.x - n.w - gapH
            })
            break;
        case 'right':

            break;
        case 'bottom':
        default:
            
    }
}

function isNull(item) {
    return item === null || item === undefined || Number.isNaN(item);
}

const uidMap = {};
function uid (prefix = 'uid') {
	uidMap[prefix] = uidMap[prefix] || 0;
	uidMap[prefix]++;
	return `${prefix}-${uidMap[prefix]}`;
}


function copy(data) {
    if (!data) {
        return data;
    }
    const type = getType(data);
    if (type === 'array') {
        return data.map((item) => {
            if (item && typeof item === 'object') {
                return copy(item);
            }
            return item;
        });
    }

    if (type === 'html' || type === 'window') {
        throw new Error('HTMLElements and the window object cannot be copied');
    }

    if (type === 'date') {
        return new Date(data.getTime());
    }

    if (type === 'function') {
        return data;
    }

    if (type === 'map') {
        return new Map(data);
    }

    if (type === 'set') {
        return new Set(data);
    }

    if (type === 'object') {
        return Object.keys(data).reduce((obj, key) => {
            const item = data[key];
            if (typeof item === 'object') {
                obj[key] = copy(item);
            } else {
                obj[key] = data[key];
            }
            return obj;
        }, {});
    }
    return data;
}

function equal(a, b, exclude = []) {
    const typeA = getType(a);
    const typeB = getType(b);
    if (typeA !== typeB) {
        return false;
    }
    const type = typeA;
    if (/number|string|boolean/.test(type)) {
        return a === b;
    }

    if (type === 'date') {
        return a.getTime() === b.getTime();
    }

    if (type === 'nan') {
        return true;
    }

    if (type === 'array') {
        return (
            a.length === b.length &&
            a.every((item, i) => {
                return equal(item, b[i], exclude);
            })
        );
    }

    if (type === 'object' || type === 'map' || type === 'set') {
        const keys = getUniqueKeys(a, b);
        return keys.every((key) => {
            if (exclude.includes(key)) {
                return true;
            }
            return equal(a[key], b[key], exclude);
        });
    }

    return a === b;
}


function getType(item) {
    if (item === null) {
        return 'null';
    }
    if (typeof item === 'object') {
        if (Array.isArray(item)) {
            return 'array';
        }
        if (item instanceof Date) {
            return 'date';
        }
        if (item instanceof Promise) {
            return 'promise';
        }
        if (item instanceof Error) {
            return 'error';
        }
        if (item instanceof Map) {
            return 'map';
        }
        if (item instanceof WeakMap) {
            return 'weakmap';
        }
        if (item instanceof Set) {
            return 'set';
        }
        if (item instanceof WeakSet) {
            return 'weakset';
        }
        if (item === global) {
            if (typeof window !== 'undefined') {
                return 'window';
            }
            return 'global';
        }
        if (item.documentElement || item.innerHTML !== undefined) {
            return 'html';
        }
        if (item.length !== undefined && item.callee) {
            return 'arguments';
        }
    }
    if (typeof item === 'number' && Number.isNaN(item)) {
        return 'nan';
    }
    return typeof item;
}

function getUniqueKeys(...args) {
    const keys = [];
    args.forEach((o) => {
        Object.keys(o).forEach((key) => {
            if (!keys.includes(key)) {
                keys.push(key);
            }
        });
    });
    return keys;
}

module.exports = {
	bindMethods,
    isEqual,
    classnames,
    getFormatter,
    fromHtml,
    toHtml,
    position,
    isNull,
    uid,
    copy,
    equal
};
