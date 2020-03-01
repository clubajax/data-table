const dom = require('@clubajax/dom');

function createLink(col, item) {
    return dom('a', {
        href: item[col.component.url],
        html: item[col.key]
    });
}

function createEditable(col, item) {
    return dom('div', {
        class: 'td-editable',
        html: item[col.key],
        onClick() {
            console.log('CLICK');
        }
    });
}

function createComponent(col, item) {
    switch (col.component.type) {
        case 'link':
            return createLink(col, item);
        case 'editable':
            return createEditable(col, item);
        default:
            return item[col.key];
    }
}

module.exports = createComponent;
