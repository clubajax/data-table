const formatters = require('@clubajax/format');

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

module.exports = {
	bindMethods,
    isEqual,
    classnames,
    getFormatter,
    fromHtml,
    toHtml
};
