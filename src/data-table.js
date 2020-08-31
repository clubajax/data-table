const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const sortable = require('./sortable');
const clickable = require('./clickable');
const selectable = require('./selectable');
const scrollable = require('./scrollable');
const createComponent = require('./component');
const formatters = require('@clubajax/format');
const util = require('./util');

const perf = localStorage.getItem('data-table-perf');
const PERF = perf === 'true' || perf === '1';

formatters.checkbox = {
    // for readonly checkbox
    toHtml(value) {
        return dom('div', {
            class: 'tbl-checkbox',
            html: !value ? null : dom('ui-icon', {type: 'check'})
        });
    }
}

// TODO
// widget / function for content (checkbox)
// automatic virtual scroll after 100+ rows
// optional stetchy column for scrollable
// filter / search
// github.io demos
// sticky column:
// https://codepen.io/SimplyPhy/pen/oEZKZo
// https://codepen.io/bjonesAlloy/pen/yLeydLL

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

        this.nodeHolder = dom('div', { class: 'data-table-node-holder' }, document.body);
    }

    get editable() {
        return ((this.schema || {}).columns || []).find((col) => col.component && col.component.type === 'edit-rows');
    }

    onUpdate(item) {
        if (!item) {
            return;
        }
        const rowItem = this.getItemById(item.id);
        if (!rowItem) {
            return;
        }
        let changed = '';
        let column;
        Object.keys(item).forEach((key) => {
            if (rowItem[key] !== item[key]) {
                rowItem[key] = item[key];
                column = this.getColumn(key);
                const td = dom.query(this, `tr[data-row-id="${item.id}"] td[data-field="${key}"]`);
                if (!td) {
                    return;
                }
                const formatter = util.getFormatter(column, rowItem);
                td.innerHTML = formatter.toHtml(rowItem[key]);
                rowItem[key] = formatter.from(td.innerHTML);
                changed = key;
            }
        });
        if (changed) {
            clearTimeout(this.updateTimer);
            this.updateTimer = setTimeout(() => {
                const event = { value: rowItem, column };
                this.emit('change', event);
            }, 400);
        }
    }

    onRows(rows) {
        if (!this.schema) {
            return;
        }
        this.isSchemaUpdate = true;
        this.loadData(rows);
    }

    onLoading(loading) {
        this.displayLoading(loading);
        if (!loading && !this.error && this.items) {
            this.loadData(this.items);
        }
    }

    onError(error) {
        this.displayError(error);
        if (!this.loading && !error && this.items) {
            this.loadData(this.items);
        }
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
            this.expandable = this.schema.expandable;
            dom.classList.toggle(this, 'has-grouped', this.grouped);
            if (this.grouped || this.expandable) {
                this.hasExpandable();
            }
            this.render();
            if (!items.length && !this.loading && !this.error) {
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
        } else {
            clearTimeout(this.legacyTimer);
        }
    }

    domReady() {
        if (!this.items) {
            this.noDataTimer = setTimeout(() => {
                this.displayNoData(!this.loading && !this.error);
            }, 1000);
        }
        this.on(
            'cell-change',
            (e) => {
                const event = { value: e.value, column: e.column };
                console.log('change', e.value);
                if (e.searchItem) {
                    event.searchItem = e.searchItem;
                }
                if (!e.value.added) {
                    console.log('emit');
                    this.emit('change', event);
                }
            },
            null,
            null,
        );
        // @ts-ignore
        this.on('cell-edit', () => {
            dom.attr(this, 'is-editing', true);
        });
        // @ts-ignore
        this.on('cell-blur', () => {
            this.updateStatus();
        });
    }

    getBlankItem() {
        return getBlankItem(this.schema.columns, this.items[0]);
    }

    addRow(index = 0, item) {
        if (!item) {
            // create a blank item, for when adding a row
            item = this.getBlankItem();
            item.added = true;
        }
        this.items.splice(index + 1, 0, item);
        this.loadData(this.items);
    }

    removeRow(index) {
        const item = this.items[index];
        this.emit('remove-row', { value: { index, id: item.id, item } });
    }

    saveRow(index) {
        const item = this.items[index];
        const event = { value: item };
        const added = item.added;
        if (added) {
            item.index = dom.query(this, 'tr.added-row').rowIndex - 1;
            this.emit(added ? 'add-row' : 'change', event);
            item.added = false;
            const row = dom.query(this, 'tr.added-row');
            if (row) {
                row.classList.remove('added-row');
            }
            this.updateStatus();
        }
        
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
                case 'save':
                    this.saveRow(index);
                    break;
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

        // @ts-ignore
        this.on('action-event', (e) => {
            action(e, e.detail.value);
        });

        this.actionEventsSet = true;
    }

    hasExpandable() {
        // @ts-ignore
        this.on('click', '[data-expanded]', (e) => {
            // @ts-ignore
            if (!this.expandable === 'multiple') {
                // first close all rows
                this.items.forEach((item) => {
                    item.expanded = false;
                });
            }

            const td = e.target.closest('td');
            const tr = e.target.closest('tr');
            const id = dom.attr(tr, 'data-row-id');
            const item = this.getItemById(id);
            const state = dom.attr(td, 'data-expanded');
            item.expanded = !(state === 'on');
            if (!item.expanded) {
                const container = dom.query(tr.nextElementSibling, '.expanded-container');
                if (container) {
                    this.fire(
                        'collapse',
                        {
                            node: container,
                            rowIndex: tr.rowIndex,
                            item,
                        },
                        true,
                    );
                    setTimeout(() => {
                        dom.destroy(container.closest('.expanded-row'));
                    }, 30);
                }
            }

            this.render();

            const afterTR = dom.query(this, `[data-row-id="${id}"]`);
            if (item.expanded) {
                this.fire(
                    'expand',
                    {
                        node: dom.query(afterTR.nextElementSibling, '.expanded-container'),
                        rowIndex: afterTR.rowIndex,
                        item,
                    },
                    true,
                );
            }
        });
    }

    refresh(all) {
        if (all) {
            this.render();
        } else {
            this.renderBody(this.items, this.columns);
        }
    }

    render() {
        // @ts-ignore
        this.fire('pre-render');
        if (this.zebra) {
            this.classList.add('zebra');
        }
        this.renderTemplate();
        this.renderFooter();
        const columns = this.schema.columns;
        if (!util.isEqual(columns, this.columns)) {
            this.columns = columns;
            this.renderHeader(this.columns);
        }
        PERF && console.time('render.table.body');
        this.renderBody(this.items, this.columns);
        PERF && console.timeEnd('render.table.body');
        // @ts-ignore
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
        const colSizes = [];
        (columns || []).forEach((col, i) => {
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

                const css = util.classnames(col.css || col.className);
                css(col.align);
                css(col.format || (col.component ? col.component.format : ''));
                if (col.unsortable) {
                    css('unsortable');
                }

                options = {
                    html: dom('span', {
                        class: 'th-content',
                        html: [
                            dom('span', { html: label, class: 'ui-label' }),
                            dom('span', {
                                class: 'sort',
                                html: [
                                    dom('span', { class: 'sort-up fas fa-sort-up' }),
                                    dom('span', { class: 'sort-dn fas fa-sort-down' }),
                                ],
                            }),
                            dom('span', { class: 'filter fas fa-filter' }),
                        ],
                    }),
                    class: css(),
                    'data-field': key,
                };
            }
            if (col.width) {
                colSizes[i] = col.width;
                // @ts-ignore
                options.style = { width: col.width };
            }
            dom('th', options, tr);
        });
        this.colSizes = colSizes;
        this.headHasRendered = true;
        // @ts-ignore
        this.fire('render-header', { thead: this.thead });
    }

    renderBody(items, columns) {
        const tbody = this.tbody;

        dom.queryAll(this, '.expanded-row').forEach((container) => {
            this.nodeHolder.appendChild(container);
        });

        dom.clean(tbody, true);

        if (!items || !items.length) {
            if (!this.loading && !this.error) {
                this.bodyHasRendered = true;
                this.fire('render-body', { tbody: this.tbody }, null);
                this.displayNoData(true);
            }
            return;
        }

        if (items[0].id === undefined) {
            console.warn('Items do not have an id');
        }

        render(items, columns, this.colSizes, tbody, this.selectable, this, () => {
            this.bodyHasRendered = true;
            this.fire('render-body', { tbody: this.tbody }, false);
        });
    }

    renderFooter() {
        // @ts-ignore
        if (this.footer) {
            const colAmount = ((this.schema || {}).columns || []).length;
            this.tfoot = dom(
                'tfoot',
                // @ts-ignore
                { html: dom('tr', { html: dom('td', { html: this.footer, colspan: colAmount }) }) },
                this.table,
            );
        }
    }

    getItemById(id) {
        return this.items.find((item) => '' + item.id === '' + id);
    }

    getColumn(key) {
        return this.schema.columns.find((c) => c.key === key);
    }

    displayLoading(loading) {
        if (!loading && this.loadNode) {
            dom.destroy(this.loadNode);
        }
        if (loading && !this.loadNode) {
            this.loadNode = dom(
                'div',
                {
                    class: 'loader',
                    html: dom('div', { class: 'spinner' }),
                },
                this,
            );
        }
    }

    displayError(error) {
        if (!error && this.errorNode) {
            dom.destroy(this.errorNode);
        }
        if (error && !this.errorNode) {
            if (this.tbody) {
                dom.clean(this.tbody, true);
            }
            dom.destroy(this.loadNode);
            this.errorNode = dom(
                'div',
                {
                    class: 'error',
                    html: dom('div', { class: 'message', html: error.message || error }),
                },
                this,
            );
        }
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
        // @ts-ignore
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
        // @ts-ignore
        if (this.addRemoveHandle) {
            // @ts-ignore
            this.addRemoveHandle.remove();
        }
        clearTimeout(this.legacyTimer);
        this.items = null;
        this.orgItems = null;
        this.schema = null;
        this.table = null;
        this.thead = null;
        this.tbody = null;
        this.tfoot = null;
        dom.destroy(this.nodeHolder);
        super.destroy();
    }
}

function renderRow(item, { index, columns, colSizes, tbody, selectable, dataTable, isChild, isLastChild }) {
    if (!item) {
        return;
    }
    item.index = index;
    let itemCss = util.classnames(item.css || item.class || item.className);
    let html,
        css,
        key,
        rowOptions = { 'data-row-id': item.id },
        tr;

    const expandable = dataTable.expandable;
    const grouped = dataTable.grouped;
    const hasChildIds = item.childIds && item.childIds.length;
    if (selectable) {
        rowOptions.tabindex = 1;
    }

    if (item.added || !item.id) {
        itemCss('added-row');
    }

    if (grouped) {
        if (item.subItemIds || hasChildIds) {
            itemCss('parent-row');
        } else if (isChild) {
            itemCss('child-row');
            if (isLastChild) {
                itemCss('last-child');
            }
        }
    }

    rowOptions.class = itemCss();

    tr = dom('tr', rowOptions, tbody);

    columns.forEach((col, i) => {
        let isExpanded;
        if ((expandable || grouped) && i === 0) {
            isExpanded = item.expanded === undefined ? false : item.expanded === false ? 'off' : 'on';
        }

        key = col.key || col.icon || col;
        css = util.classnames(key);
        css(col.align);
        css(col.format);
        if (col.component) {
            html = createComponent(col, item, index, dataTable);
            css(col.component.type);
            css(col.component.format);
        } else {
            html = key === 'index' ? index + 1 : item[key];
            const fmt = col.formatter || col.format;
            css(fmt);
            if (fmt) {
                if (/property:/.test(fmt)) {
                    const prop = (fmt.split(':')[1] || '').trim();
                    if (prop) {
                        const f = item[prop];
                        html = formatters[fmt].toHtml(html);
                    }
                } else {
                    html = formatters[fmt].toHtml(html);
                }
            }
            if (col.callback) {
                html = col.callback({ value: html, item, index, col, formatters });
            }
        }

        if (isExpanded) {
            html = dom('div', {
                html: [
                    dom('span', { class: isExpanded === 'on' ? 'fas fa-caret-down' : 'fas fa-caret-right' }),
                    dom('span', { html }),
                ],
            });

            css('expand-cell');
        }
        const cellOptions = { html, 'data-field': key, class: css() };
        if (isExpanded) {
            cellOptions['data-expanded'] = isExpanded;
        }
        if (colSizes[i]) {
            cellOptions.style = { width: colSizes[i] };
        }
        dom('td', cellOptions, tr);
    });

    if (item.expanded) {
        if (expandable) {
            // empty contaner below row
            renderExpandedRow(item, index, columns, tbody, dataTable);
        } else if (hasChildIds) {
            // a parent has childIds
            item.childIds.forEach((id, i) => {
                const subitem = dataTable.getItemById(id);
                renderRow(subitem, {
                    index,
                    columns,
                    colSizes,
                    tbody,
                    selectable,
                    dataTable,
                    isChild: true,
                    isLastChild: item.childIds.length - 1 === i,
                });
            });
        } else {
            // children have parentIds
            // converted to subItemIds
            (item.subItemIds || []).forEach((subItemId) => {
                const subitem = dataTable.getItemById(subItemId);
                renderRow(subitem, {
                    index,
                    columns,
                    colSizes,
                    tbody,
                    selectable,
                    dataTable,
                    isChild: true,
                    isLastChild: false,
                });
            });
        }
    }
}

function renderExpandedRow(item, index, columns, tbody, dataTable) {
    let node = dom.query(dataTable.nodeHolder, `[data-row-id="ex-${item.id}"]`);
    if (node) {
        tbody.appendChild(node);
        return;
    }

    node = dom('div', { class: 'expanded-container' });
    const rowOptions = {
        class: 'expanded-row',
        'data-row-id': `ex-${item.id}`,
        html: dom('td', {
            colspan: columns.length + 1,
            html: node,
        }),
    };
    const tr = dom('tr', rowOptions, tbody);

    if (item.expanded === 'external') {
        item.expanded = true;
        dataTable.fire(
            'expand',
            {
                node,
                rowIndex: tr.rowIndex,
                item,
            },
            true,
        );
    }
}

function render(items, columns, colSizes, tbody, selectable, dataTable, callback) {
    items.forEach((item, index) => {
        if (!item.isSubitem) {
            renderRow(item, {
                index,
                columns,
                colSizes,
                tbody,
                selectable,
                dataTable,
                isChild: false,
                isLastChild: false,
            });
        }
    });
    callback();
}

function checkGrouped(items) {
    const grouped = items.some((m) => !!m.parentId);
    if (grouped) {
        const parentMap = items.reduce((acc, item) => {
            if (!item.parentId) {
                item.subItemIds = [];
                item.expanded = false;
                acc[item.id] = item;
            }
            return acc;
        }, {});

        items.forEach((item) => {
            if (item.parentId) {
                parentMap[item.parentId].subItemIds.push(item.id);
                item.isSubitem = true;
            }
        });
    } else if (items.some((m) => !!m.childIds)) {
        items.forEach((item) => {
            if (item.childIds && item.childIds.length) {
                item.expanded = false;
            }
        });

        return true;
    }
    return grouped;
}

function getBlankItem(columns, item) {
    const formatValues = {
        integer: 0,
        number: 0,
        decimal: 0,
        percentage: 0,
    };
    return columns.reduce((acc, col) => {
        // filter out dynamic columns
        if (item && item[col.key] !== undefined) {
            let value;
            if (col.component) {
                switch (col.component.type) {
                    case 'ui-checkbox':
                        value = false;
                        break;
                    case 'ui-minitags':
                        value = [];
                        break;
                    case 'ui-dropdown':
                        value = null;
                        break;
                    default:
                        if (col.format) {
                            value = formatValues[col.format];
                        }
                        if (value === undefined) {
                            value = '';
                        }
                }
            }
            acc[col.key] = value;
        }
        return acc;
    }, {});
}

// experimental
// @ts-ignore
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
    props: ['schema', 'rows', 'extsort', 'selected', 'update', 'max-height', 'borders', 'footer', 'error'],
    bools: ['sortable', 'selectable', 'scrollable', 'clickable', 'perf', 'autoselect', 'zebra', 'loading'],
});
