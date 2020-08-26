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
    value = typeof value === 'string' ? value.trim() : value;
    value = value === SPACE ? '' : value;
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

const uidMap = {};
function uid (prefix = 'uid') {
	uidMap[prefix] = uidMap[prefix] || 0;
	uidMap[prefix]++;
	return `${prefix}-${uidMap[prefix]}`;
}


module.exports = {
	bindMethods,
    isEqual,
    classnames,
    getFormatter,
    fromHtml,
    toHtml,
    position,
    uid
};
