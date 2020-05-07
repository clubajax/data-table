const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const sortable = require('./sortable');
const clickable = require('./clickable');
const selectable = require('./selectable');
const scrollable = require('./scrollable');
const createComponent = require('./component');
const formatters = require('@clubajax/format'); 
const util = require('./util');

const PERF = true;
let log;

// TODO
// widget / function for content (checkbox)
// automatic virtual scroll after 100+ rows
// optional column widths
// filter / search
// github.io demos

class DataTable extends BaseComponent {
    constructor() {
        super();
        this.clickable = false;
        this.sortable = false;
        this.selectable = false;
        this.scrollable = false;
        this.legacyCheck();
        // this.data = 0;
        // this.schema = false;
        // this.rows = false;
        // this.exclude = [];
    }

    get editable() {
        return this.schema && this.schema.columns.find((col) => col.component && col.component.type === 'edit-rows');
    }

    onRows(rows) {
        if (!this.schema) {
            return;
        }
        this.isSchemaUpdate = true;
        this.loadData(rows);
    }

    loadData(rows) {
        const items = rows || [];
        this.orgItems = items;
        this.legacyCheck(true);
        this.displayNoData(false);
        this.items = [...items];
        this.mixPlugins();
        clearTimeout(this.noDataTimer);
        this.onDomReady(() => {
            this.grouped = checkGrouped(this.items);
            dom.classList.toggle(this, 'has-grouped', this.grouped);
            if (this.grouped) {
                this.hasExpandable();
            }
            this.render();
            if (!items.length) {
                this.displayNoData(true);
                if (this.editable) {
                    //add default row
                    this.addRow();
                }
            }
            this.updateStatus();
        });
    }

    updateStatus() {
        if (this.editable) {
            dom.attr(this, 'data-rows', this.items.length);
            dom.attr(this, 'is-editing', false);
        }
    }

    legacyCheck(disable) {
        if (!disable) {
            this.legacyTimer = setTimeout(() => {
                throw new Error('a `rows` and a `schema` is required');
            }, 1000);
            return;
        }
        clearTimeout(this.legacyTimer);
    }

    domReady() {
        this.perf = this.perf || PERF;
        if (!this.items) {
            this.noDataTimer = setTimeout(() => {
                this.displayNoData(true);
            }, 1000);
        }
        this.on('cell-change', (e) => {
            if (!dom.query(this, 'input')) {
                this.emit(e.value.added ? 'add-row' : 'change', { value: e.value });
                this.updateStatus();
            }
        });
        this.on('cell-edit', () => {
            dom.attr(this, 'is-editing', true);
        });
    }

    getBlankItem() {
        return this.schema.columns.reduce((acc, col) => {
            if (col.key) {
                acc[col.key] = null;
            }
            return acc;
        }, {});
    }

    addRow(index = 0, item) {
        console.log('ADD ROW');
        if (!item) {
            // create a blank item, for when adding a row
            item = this.getBlankItem();
            item.added = true;
        }
        this.items.splice(index + 1, 0, item);
        this.loadData(this.items);
    }

    removeRow(index) {
        this.emit('remove-row', { value: { index } });
    }

    cancelEdit() {
        const index = this.items.findIndex((item) => item.added);
        this.items.splice(index, 1);
        // plus one, to allow for the header
        this.table.deleteRow(index + 1);
        this.updateStatus();
    }

    hasAddRemove() {
        if (this.actionEventsSet) {
            return;
        }
        const action = (e, type) => {
            const index = e.target.closest('tr').rowIndex - 1;
            switch (type) {
                case 'add':
                    this.addRow(index);
                    break;
                case 'remove':
                    this.removeRow(index);
                    break;
                case 'cancel':
                    this.cancelEdit();
                    break;
            }
        };

        this.on('action-event', (e) => {
            action(e, e.detail.value);
        });

        this.actionEventsSet = true;
    }

    hasExpandable() {
        this.on('click', '[data-expanded]', (e) => {
            console.log('EXPAND', e);
            const td = e.target.closest('td');
            const tr = e.target.closest('tr');
            const id = dom.attr(tr, 'data-row-id');
            const item = this.getItemById(id);
            const state = dom.attr(td,'data-expanded')
            console.log(' - state ', state);
            console.log('item', item);
            item.expanded = !(state === 'on');
            this.render();
        });
    }

    render() {
        this.fire('pre-render');
        this.renderTemplate();
        this.renderFooter(this.schema.columns.length);
        const columns = this.schema.columns;
        if (!util.isEqual(columns, this.columns)) {
            this.columns = columns;
            this.renderHeader(this.columns);
        }
        this.renderBody(this.items, this.columns);

        this.fire('render', { table: this.table || this, thead: this.thead, tbody: this.tbody });
    }

    // is overwritten by scrollable
    renderTemplate() {
        if (this.table) {
            return;
        }
        this.table = dom('table', { tabindex: '1' }, this);
        this.thead = dom('thead', {}, this.table);
        this.tbody = dom('tbody', {}, this.table);
    }

    renderHeader(columns) {
        dom.clean(this.thead, true);
        const tr = dom('tr', {}, this.thead);
        if (this.grouped) {
            dom('th', {
                class: 'expandable'
            }, tr);   
        }
        const colSizes = [];
        columns.forEach((col, i) => {
            let options;
            if (!col.key && col.icon) {
                options = {
                    html: dom('span', { class: 'fas fa-pencil-alt' }),
                    'data-field': 'edit',
                };
                this.hasAddRemove();
            } else {
                const key = col.key || col;
                const label = col.label === undefined ? col : col.label;

                let css = col.css || col.className || '';
                if (col.unsortable) {
                    css += ' unsortable';
                }

                options = {
                    html: [
                        dom('span', { html: label, class: 'ui-label' }),
                        dom('span', { class: 'sort-up', html: '&uarr;' }),
                        dom('span', { class: 'sort-dn', html: '&darr;' }),
                    ],
                    class: css,
                    'data-field': key,
                };
            }
            if (col.width) {
                colSizes[i] = col.width;
                options.style = { width: col.width };
            }
            dom('th', options, tr);
        });
        this.colSizes = colSizes;
        this.headHasRendered = true;
        this.fire('render-header', { thead: this.thead });
    }

    renderBody(items, columns) {
        const tbody = this.tbody;
        dom.clean(tbody, true);

        if (!items || !items.length) {
            this.bodyHasRendered = true;
            this.fire('render-body', { tbody: this.tbody });
            this.displayNoData(true);
            return;
        }

        if (items[0].id === undefined) {
            console.warn('Items do not have an ID');
        }

        render(items, columns, this.colSizes, tbody, this.selectable, this.grouped, () => {
            this.bodyHasRendered = true;
            this.fire('render-body', { tbody: this.tbody });
        });
    }

    renderFooter(colAmount) {
        if (this.footer) {
            this.tfoot = dom(
                'tfoot',
                { html: dom('tr', { html: dom('td', { html: this.footer, colspan: colAmount }) }) },
                this.table,
            );
        }
    }

    getItemById(id) {
        return this.items.find((item) => '' + item.id === '' + id);
    }

    displayNoData(show) {
        if (show) {
            this.classList.add('no-data');
        } else {
            this.classList.remove('no-data');
        }
    }

    mixPlugins() {
        if (this.clickable) {
            clickable.call(this);
        }
        if (this.extsort || this.schema.sort) {
            clickable.call(this);
            sortable.call(this);
        }
        if (this.selectable) {
            clickable.call(this);
            selectable.call(this);
        }
        if (this.scrollable) {
            scrollable.call(this);
        }
        this.mixPlugins = noop;
    }

    destroy() {
        if (this.addRemoveHandle) {
            this.addRemoveHandle.remove();
        }
    }
}

function renderRow(item, index, columns, colSizes, tbody, selectable, grouped) {
    item.index = index;
    let itemCss = item.css || item.class || item.className || '';
    let html,
        css,
        key,
        rowOptions = { 'data-row-id': item.id },
        tr;

    if (selectable) {
        rowOptions.tabindex = 1;
    }
    if (item.added) {
        itemCss += ' added-row';
    }
    if (itemCss) {
        rowOptions.class = itemCss;
    }

    tr = dom('tr', rowOptions, tbody);
    columns.forEach((col, i) => {
        if (grouped && i === 0) {
            const isExpanded = item.expanded === undefined ? false : item.expanded === false ? 'off' : 'on';
            dom('td', {
                html: dom('span', {
                    class: 'expandable-buttons',
                    html: [
                        dom('span', {class: 'fas fa-chevron-right'}),
                        dom('span', {class: 'fas fa-chevron-down'})
                    ]
                }),
                class: 'expandable',
                'data-expanded': isExpanded
            }, tr);   
        }
        key = col.key || col.icon || col;
        css = key;
        if (col.component) {
            html = createComponent(col, item, index);
            css += ' ' + col.component.type;
        } else {
            html = key === 'index' ? index + 1 : item[key];
            const fmt = col.formatter || col.format; 
            if (fmt) {
                html = formatters[fmt].toHtml(html);
            }
            if (col.callback) {
                html = col.callback({value: html, item, index, col, formatters});
            }
        }
        const cellOptions = { html, 'data-field': key, class: css };
        if (colSizes[i]) {
            cellOptions.style = { width: colSizes[i] };
        }
        dom('td', cellOptions, tr);
    });

    if (item.expanded) {
        item.subitems.forEach((subitem) => {
            renderRow(subitem, index, columns, colSizes, tbody, selectable, grouped);
        })
    }
}
function render(items, columns, colSizes, tbody, selectable, grouped, callback) {
    items.forEach((item, index) => {
        renderRow(item, index, columns, colSizes, tbody, selectable, grouped);
    });
    callback();
}

function checkGrouped(items) {
    let grouped;
    items.forEach((item) => {
        if ((item.subitems && item.subitems.length) || item.childIds) {
            item.expanded = false;
            grouped = true;
            item.subitems.forEach((item) => {
                item.isSubitem = true;
            })
        }
    });
    return grouped;
}

// experimental
function lazyRender(allItems, columns, tbody, sorts, callback) {
    let index = 0;
    function renderRows(items) {
        items.forEach((item) => {
            item.index = index;
            const itemCss = item.css || item.class || item.className;
            let html,
                css,
                key,
                rowOptions = { 'data-row-id': item.id },
                tr;
            if (selectable) {
                rowOptions.tabindex = 1;
            }
            if (itemCss) {
                rowOptions.class = itemCss;
            }

            tr = dom('tr', rowOptions, tbody);
            columns.forEach((col) => {
                key = col.key || col;
                html = item[key];
                css = key;
                const cellOptions = { html, 'data-field': key, css };
                dom('td', cellOptions, tr);
            });
            index++;
        });
    }

    allItems = [...allItems];

    function next() {
        const items = allItems.splice(0, 5);
        renderRows(items);

        if (allItems.length) {
            setTimeout(() => {
                next();
            }, 1);
        } else {
            callback();
        }
    }
    next();
}

function noop() {}

module.exports = BaseComponent.define('data-table', DataTable, {
    props: ['schema', 'rows', 'extsort', 'selected', 'stretch-column', 'max-height', 'borders', 'footer'],
    bools: ['sortable', 'selectable', 'scrollable', 'clickable', 'perf'],
});
