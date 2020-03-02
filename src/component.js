require('@clubajax/form');
const dom = require('@clubajax/dom');
const on = require('@clubajax/on');

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

        const input = dom('ui-input', {
            value: node.textContent
        }, parent);
        input.onDomReady(() => {
            input.input.focus();
        });
        
        input.on('change', (e) => {
            e.stopPropagation();
            console.log('change!', e.value);
            console.log('item', item);
            node.textContent = e.value;
            parent.appendChild(node);
            input.destroy();
            item[col.key] = e.value;
            on.emit(node, 'change', {value: item});
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
    const input = dom('ui-dropdown', {
        data: col.component.options,
        value: item[col.key]
    });
    input.on('change', (e) => {
        e.stopPropagation();
        if (!e || e.value == undefined) {
            return;
        }
        item[col.key] = e.value;
        on.emit(input.parentNode, 'change', {value: item});
    });
    return input;
}

function createCheckbox(col, item) {
    const input = dom('ui-checkbox', {
        value: item[col.key]
    });
    input.on('change', (e) => {
        e.stopPropagation();
        if (!e || e.value == undefined) {
            return;
        }
        item[col.key] = e.value;
        on.emit(input.parentNode, 'change', {value: item});
    });
    return input;
}

function createComponent(col, item) {
    switch (col.component.type) {
        case 'link':
            return createLink(col, item);
        case 'ui-input':
            return createInput(col, item);
        case 'ui-dropdown':
            return createDropdown(col, item);
        case 'ui-checkbox':
            return createCheckbox(col, item);
        default:
            return item[col.key];
    }
}

module.exports = createComponent;
