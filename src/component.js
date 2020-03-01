const dom = require('@clubajax/dom');

function createLink(col, item) {
    return dom('a', {
        href: item[col.component.url],
        html: item[col.key]
    });
}

function createComponent(col, item) {
    console.log('cmp', col, item);
    switch (col.component.type) {
        case 'link':
            return createLink(col, item);
        default:
            return item[col.key];
    }
}

module.exports = createComponent;
