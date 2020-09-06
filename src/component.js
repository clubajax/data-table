require('@clubajax/form');
const dom = require('@clubajax/dom');
const on = require('@clubajax/on');
const { getFormatter, position, fromHtml, uid } = require('./util');
//
// helpers
//
const SPACE = '&nbsp;';
const PERF = localStorage.getItem('data-table-perf');
let focusTimeout;
//
// components
//
function createLink(col, item) {
    return dom('a', {
        href: item[col.component.url],
        html: item[col.key],
    });
}

function create(col, item, dataTable, type, compType) {
    const formatter = getFormatter(col, item);
    function edit(node, timerTriggered) {
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
            compType,
            {
                type: col.component.subtype || 'text',
                value: fromHtml(node.textContent, formatter),
                class: `data-table-field input ${type}`,
                placeholder: col.component.placeholder,
                autoselect: true,
            },
            parent,
        );

        input.onDomReady(() => {
            // in case all fields are editable, get the first
            const row = timerTriggered ? parent.closest('tr.added-row') : parent.closest('tr');
            if (row) {
                clearTimeout(focusTimeout);
                focusTimeout = setTimeout(() => {
                    dom.query(row, 'input').focus();
                }, 100);
            }
        });

        const destroy = () => {
            if (window.keepPopupsOpen) {
                return;
            }
            const changed = item[col.key] !== formatter.from(input.value);
            item[col.key] = formatter.from(input.value);
            node.innerHTML = formatter.toHtml(input.value);
            parent.appendChild(node);
            input.destroy();
            if (changed) {
                on.emit(node, 'cell-change', {value: item, column: col});
            }
            if (!hadWidth) {
                dom.style(parent, 'width', '');
            }
        };

        input.on('blur', () => {
            if (!input.value && item.added) {
                return;
            }
            on.emit(dataTable, 'cell-blur');
            destroy();
        });

        input.on('keyup', (e) => {
            exitTimer = setTimeout(() => {
                if (e.key === 'Enter' || e.key === 'Escape') {
                    destroy();
                }
            }, 1);
        });

        input.onCloseInputs = destroy;

        // if added and input is empty, don't close on blur
        input.on('change', (e) => {
            e.stopPropagation();
        });
    }
    const editCell = dataTable.schema.columns.find(c => c.component && c.component.type === 'edit-rows');
    const noEdit = editCell ? editCell.component.noEdit : false;
    const editable = item.added || (!noEdit && !(col.component || {}).noEdit);

    const node = dom('div', {
        class: editable ? 'td-editable' : '',
        html: formatter.toHtml(item[col.key]) || '&nbsp;',
        tabindex: editable ? '0' : '-1',
    });

    if (editable) {
        dataTable.on(node, 'focus', () => {
            edit(node);
        });

        dataTable.on(node, 'keyup', (e) => {
            if (e.key === 'Enter') {
                edit(node);
            }
        });

        if (!node.textContent.trim() || item.added) {
            setTimeout(() => {
                edit(node, true);
            }, 1);
        }
    }

    const error = dataTable.getCellError(item.index, col.key);

    if (error) {
        node.parentNode.appendChild(dom('div', {class: 'cell-error', html: error.message}));
    }

    return node;
}

function createInput(col, item, dataTable) {
    return create(col, item, dataTable, 'input', 'ui-input');
}

function createDate(col, item, dataTable) {
    return create(col, item, dataTable, 'date', 'date-input');
}

function createSearch(col, item, dataTable) {
    let items;
    let value = item[col.component.key] || item[col.key];

    function edit(node) {
        value = item[col.component.key] || item[col.key];
        const parent = node.parentNode;
        on.emit(parent, 'cell-edit');
        let hadWidth = true;
        if (!parent.style.width) {
            hadWidth = false;
            dom.style(parent, 'width', dom.box(parent).w);
        }
        parent.removeChild(node);
        const input = dom(
            'ui-search',
            {
                value,
                data: [],
                autoselect: true,
                class: 'data-table-field search',
            },
            parent,
        );

        input.onDomReady(() => {
            // in case all fields are editable, get the first
            clearTimeout(focusTimeout);
            focusTimeout = setTimeout(() => {
                dom.query(input.closest('tr'), 'input').focus();
            });
        });

        const destroy = () => {
            if (window.keepPopupsOpen) {
                return;
            }
            parent.appendChild(node);
            input.destroy();
            if (!hadWidth) {
                dom.style(parent, 'width', '');
            }
            on.emit(parent.parentNode, 'cell-change', { value: item, column: col });
        };

        input.on('blur', () => {
            if (!input.value && item.added) {
                return;
            }
            on.emit(dataTable, 'cell-blur');
            destroy();
            // TODO:
            // There is no focus after selecting an item,
            // so it selects the same input again
            // SOLUTION: after select, move to nextSibilingElement
        });

        input.on('keyup', (e) => {
            exitTimer = setTimeout(() => {
                if (e.key === 'Enter' || e.key === 'Escape') {
                    destroy();
                }
            }, 1);
        });

        input.on('change', (e) => {
            e.stopPropagation();
            if (!e || e.value == undefined) {
                return;
            }
            item[col.key] = e.value;

            const searchItem = items.find((m) => m.value === e.value);
            node.innerHTML = searchItem.display || searchItem.alias || searchItem.label;
            // on.emit(input.parentNode, 'cell-change', { value: item, column: col, searchItem });
            destroy();
        });

        input.on('search', (e) => {
            e.stopPropagation();
            if (!e || e.detail.value == undefined) {
                return;
            }
            col.component.search(e.detail.value).then((data) => {
                input.data = data;
                items = data;
            });
        });
    }

    const node = dom('div', {
        class: 'td-editable',
        html: value || '&nbsp;',
        tabindex: '0',
    });
    dataTable.on(node, 'focus', () => {
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
    const input = dom('ui-dropdown', {
        data: () => col.component.options,
        value,
        class: 'data-table-field select',
        placeholder: col.component.placeholder,
    });
    input.on('change', (e) => {
        e.stopPropagation();
        if (!e || e.value == undefined) {
            return;
        }
        item[col.key] = e.value;
        if (col.component.onChange) {
            col.component.onChange({ value: item, column: col });
        }
        if (col.component.renders) {

            const rowId = dom.attr(input.closest('tr'), 'data-row-id');
            const value = item[col.key];
            const selector = `tbody tr[data-row-id="${rowId}"] ui-dropdown[value="${value}"] button`;
            setTimeout(() => {
                dataTable.refresh();
                setTimeout(() => {
                    const drop = dom.query(dataTable, selector);
                    if (drop) {
                        drop.focus();
                    } else {
                        console.log('DROP NOT FOUND', selector);
                    }
                }, 30)
            }, 1);
        }
        on.emit(input.parentNode, 'cell-change', { value: item, column: col });
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
        on.emit(input.parentNode, 'cell-change', { value: item, column: col });
    });
    return input;
}

function createTags(col, item, dataTable) {
    
    const value = item[col.component.key] || item[col.key] || [];
    function edit() {
        const tags = dom(
            'ui-minitags',
            {
                class: 'data-table-minitags',
                data: col.component.options,
                readonly: col.component.readonly,
                value,
            },
            container,
        );

        const destroy = () => {
            item[col.key] = tags.value;
            tags.destroy();
            on.emit(container, 'cell-change', { value: item });
        };

        tags.on('change', (e) => {
            e.stopPropagation();
        });

        tags.on('popup-close', () => {
            destroy();
        });

        if (col.component.readonly) {
            const h = tags.on('clickoff', () => {
                destroy();
                h.remove();
            });
            h.resume();
        }
    }

    const button = dom('button', {
        class: 'fas fa-tags',
        disabled: !value.length,
    });
    const container = dom('div', {
        class: 'minitag-button-container',
        html: button,
    });

    dataTable.on(button, 'click', edit);

    return container;
}

function createEditRows(col, item, index) {
    // https://mdbootstrap.com/docs/jquery/tables/editable/#!
    // https://codepen.io/mikewax/pen/YWxwPw
    return dom('span', {
        class: 'add-remove',
        html: [
            col.component.noAdd
                ? null
                : dom('button', {
                      onClick() {
                          on.fire(this, 'action-event', { value: 'add' }, true);
                      },
                      class: 'tbl-icon-button add',
                      type: 'button',
                      html: dom('span', { class: 'fas fa-plus' }),
                  }),
            col.component.noRemove
                ? null
                : dom('button', {
                      onClick() {
                          on.fire(this, 'action-event', { value: 'remove' }, true);
                      },
                      class: 'tbl-icon-button remove',
                      type: 'button',
                      html: dom('span', { class: 'fas fa-trash-alt' }),
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
    switch (col.component.type) {
        case 'link':
            return createLink(col, item);
        case 'ui-input':
            return createInput(col, item, dataTable);
        case 'ui-dropdown':
            return createDropdown(col, item, dataTable);
        case 'ui-search':
            return createSearch(col, item, dataTable);
        case 'date-input':
            return createDate(col, item, dataTable);
        case 'ui-checkbox':
            return createCheckbox(col, item, dataTable);
        case 'ui-minitags':
            return createTags(col, item, dataTable);
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
