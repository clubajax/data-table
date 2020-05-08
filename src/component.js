require('@clubajax/form');
const dom = require('@clubajax/dom');
const on = require('@clubajax/on');
const formatters = require('@clubajax/format');

//
// helpers
//
const SPACE = '&nbsp;';

function toHtml(value, formatter) {
    if (value === null || value === undefined || value === '') {
        return SPACE;
    }
    return formatter.toHtml(value);
}

function fromHtml(value, formatter) {
    // value = dom.normalize(value);
    value = value === SPACE ? '' : value;
    return formatter.from(value);
}

//
// components
//
function createLink(col, item) {
    return dom('a', {
        href: item[col.component.url],
        html: item[col.key],
    });
}

function createInput(col, item, dataTable) {
    const formatter = formatters[col.component.format] || formatters.default;
    function edit(node) {
        const parent = node.parentNode;
        on.emit(parent, 'cell-edit');
        let hadWidth = true;
        if (!parent.style.width) {
            hadWidth = false;
            dom.style(parent, 'width', dom.box(parent).w);
        }
        parent.removeChild(node);
        let exitTimer;
        const input = dom(
            'ui-input',
            {
                type: col.component.subtype || 'text',
                value: fromHtml(node.textContent, formatter),
            },
            parent,
        );

        input.onDomReady(() => {
            // in case all fields are editable, get the first
            dom.query(input.closest('tr'), 'input').focus();
        });

        const destroy = () => {
            parent.appendChild(node);
            input.destroy();
            if (!hadWidth) {
                dom.style(parent, 'width', '');
            }
        };

        input.on('blur', () => {
            if (!input.value && item.added) {
                return;
            }
            destroy();
        });

        input.on('keyup', (e) => {
            exitTimer = setTimeout(() => {
                if (e.key === 'Enter' || e.key === 'Escape') {
                    destroy();
                }
            }, 1);
        });

        // if added and input is empty, don't close on blur
        input.on('change', (e) => {
            e.stopPropagation();
            node.innerHTML = toHtml(e.value, formatter);
            destroy();
            item[col.key] = fromHtml(e.value, formatter);
            on.emit(node, 'cell-change', { value: item });
            clearTimeout(exitTimer);
        });
    }
    const node = dom('div', {
        class: 'td-editable',
        html: formatter.toHtml(item[col.key]) || '&nbsp;',
        tabindex: '0',
    });
    dataTable.on(node, 'click', () => {
        edit(node);
    });
    dataTable.on(node, 'keyup', (e) => {
        if (e.key === 'Enter') {
            edit(node);
        }
    });

    if (item.added) {
        setTimeout(() => {
            edit(node);
        }, 1);
    }
    return node;
}

function createDropdown(col, item, dataTable) {
    const value = item[col.component.key] || item[col.key];
    // console.log('   value', value);
    const input = dom('ui-dropdown', {
        data: () => col.component.options,
        value,
    });
    input.on('change', (e) => {
        e.stopPropagation();
        if (!e || e.value == undefined) {
            return;
        }
        item[col.key] = e.value;
        on.emit(input.parentNode, 'cell-change', { value: item });
    });
    return input;
}

function createCheckbox(col, item, dataTable) {
    const input = dom('ui-checkbox', {
        value: item[col.key],
    });
    input.on('change', (e) => {
        e.stopPropagation();
        if (!e || e.value == undefined) {
            return;
        }
        item[col.key] = e.value;
        on.emit(input.parentNode, 'cell-change', { value: item });
    });
    return input;
}

function createEditRows(col, item, index) {
    // https://mdbootstrap.com/docs/jquery/tables/editable/#!
    // https://codepen.io/mikewax/pen/YWxwPw
    return dom('span', {
        class: 'add-remove',
        html: [
            dom('button', {
                onClick() {
                    on.fire(this, 'action-event', { value: 'add' }, true);
                },
                class: 'tbl-icon-button add',
                type: 'button',
                html: dom('span', { class: 'fas fa-plus' }),
            }),
            dom('button', {
                onClick() {
                    on.fire(this, 'action-event', { value: 'remove' }, true);
                },
                class: 'tbl-icon-button remove',
                type: 'button',
                html: dom('span', { class: 'fas fa-trash-alt' }),
            }),
            dom('button', {
                onClick() {
                    on.fire(this, 'action-event', { value: 'cancel' }, true);
                },
                class: 'tbl-icon-button cancel',
                type: 'button',
                html: dom('span', { class: 'fas fa-ban' }),
            }),
        ],
    });
}

function createActionButton(col, item) {
    return dom('span', {
        class: 'add-remove',
        html: [
            dom('ui-actionbutton', {
                icon: 'gear',
                data: col.component.options,
                'event-name': 'action-event',
                class: 'tbl-icon-button icon-only',
            }),
            dom('button', {
                onClick() {
                    on.fire(this, 'action-event', { value: 'cancel' }, true);
                },
                class: 'tbl-icon-button cancel',
                type: 'button',
                html: dom('span', { class: 'fas fa-ban' }),
            }),
        ],
    });
}

function createComponent(col, item, index, dataTable) {
    // console.log('createComponent');
    switch (col.component.type) {
        case 'link':
            return createLink(col, item);
        case 'ui-input':
            return createInput(col, item, dataTable);
        case 'ui-dropdown':
            return createDropdown(col, item, dataTable);
        case 'ui-checkbox':
            return createCheckbox(col, item, dataTable);
        case 'edit-rows':
            if (col.component.options) {
                return createActionButton(col, item);
            }
            return createEditRows(col, item, index);
        default:
            return item[col.key];
    }
}

module.exports = createComponent;
