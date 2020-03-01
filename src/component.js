require('@clubajax/form');
const dom = require('@clubajax/dom');

function createLink(col, item) {
    return dom('a', {
        href: item[col.component.url],
        html: item[col.key]
    });
}

function createInput(col, item) {
    function edit(node) {
        const parent = node.parentNode;
        parent.removeChild(node);
        // node.classList.add('hidden');
        const input = dom('ui-input', {
            value: node.textContent
        }, parent);
        input.onDomReady(() => {
            input.input.focus();
        });
        input.on('change', (e) => {
            console.log('change!', e.value);
            node.textContent = e.value;
            parent.appendChild(node);
            input.destroy();
        });
    }
    return dom('div', {
        class: 'td-editable',
        html: item[col.key],
        tabindex: '0',
        onClick() {
            edit(this);
        },
        onKeyup(e) {
            if (e.key === 'Enter') {
                edit(this);
            }
        }
    });
}

function createDropdown(col, item) {
    return dom('ui-dropdown', {
        data: col.component.options,
        value: item[col.key]
    });
}

function createComponent(col, item) {
    switch (col.component.type) {
        case 'link':
            return createLink(col, item);
        case 'ui-input':
            return createInput(col, item);
        case 'ui-dropdown':
            return createDropdown(col, item);
        default:
            return item[col.key];
    }
}

module.exports = createComponent;
