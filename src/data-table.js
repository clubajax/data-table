const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const sortable = require('./sortable');
const clickable = require('./clickable');
const selectable = require('./selectable');
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
            html: !value ? null : dom('ui-icon', { type: 'check' }),
        });
    },
};

// TODO
// automatic virtual scroll after 100+ rows
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
        this.propCheck();

        this.nodeHolder = dom('div', { class: 'data-table-node-holder' }, document.body);

        this.makeExpandable();
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
                if (!td || /fa-caret/.test(td.innerHTML)) {
                    // not a td or is a td with the expandable caret
                    return;
                }
                const formatter = util.getFormatter(column, rowItem)[0];
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
            if (!this.items.length) {
                this.displayNoData(true);
            } else {
                this.loadData(this.items);
            }
        }
    }

    onError(error) {
        this.displayError(error);
        if (!this.loading && !error && this.items) {
            this.loadData(this.items);
        }
    }

    onErrors(errors) {
        this.render();
    }

    onCollapse(item) {
        if (!item) {
            // nothing to do
            return;
        }
        let container;
        let tr;
        if (item === true) {
            container = dom.query(this, 'tr.expanded-row');
            if (!container) {
                console.log('no row to collapse');
                return;
            }
            tr = container.previousElementSibling;
            const id = dom.attr(tr, 'data-row-id');
            item = this.getItemById(id);
        } else {
            tr = dom.query(this, `tr[data-row-id="${item.id}"]`);
            if (!tr) {
                console.log('row to collapse not found for', item);
                return;
            }
            container = tr.nextElementSibling;
        }

        //
        item.expanded = false;

        // re-render to change the caret
        // A very inefficient render
        this.render();

        setTimeout(() => {
            dom.destroy(container);
            this.collapse = false;
        }, 30);
    }

    getCellError(index, name) {
        return (this.errors || []).find((e) => e.index === index && e.name === name);
    }

    loadData(rows) {
        const items = rows || [];
        if (util.equal(items, this.orgItems)) {
            return;
        }

        this.propCheck(true);
        this.displayNoData(false);
        this.items = [...items];
        this.mixPlugins();
        clearTimeout(this.noDataTimer);
        this.onDomReady(() => {
            this.grouped = setGrouped(this.items, this.schema);
            if (this.grouped && this.schema.grouped) {
                this.grouped = this.schema.grouped;
            }
            if (this.schema.headerless) {
                this.classList.add('headerless');
            }

            this.expandable = this.schema.expandable || this.schema.headerless;
            dom.classList.toggle(this, 'has-grouped', !!this.grouped || !!this.expandable);

            if (!items.length && !this.loading && !this.error) {
                
                // fixes nav-away no-header bug in distribution
                // if (this.tbody) {
                //     dom.clean(this.tbody, true);
                // }
                // added:
                this.render();
                this.displayNoData(true);
            } else {
                if (this.isExpanded()) {
                    this.updateCells();
                } else {
                    this.render();
                    this.updateStatus();
                }
            }

            this.orgItems = util.copy(items);
        });
    }

    updateCells() {
        // updates cells instead of re-render
        // used during expanded row
        const orgItems = this.orgItems;
        this.items.forEach((item, i) => {
            const org = orgItems[i];
            if (!util.equal(item, org, ['expanded'])) {
                this.schema.columns.forEach((col) => {
                    const key = col.key;
                    if (item[key] !== org[key]) {
                        const cell = this.getCell(item.id, key);
                        if (!cell) {
                            console.log('tbl cell not found:', item.id, key);
                            return;
                        }
                        cell.innerHTML = col.format ? formatters[col.format].toHtml(item[key]) : item[key];
                    }
                });
            }
        });
    }

    getCell(rowId, cellProp) {
        const row = dom.query(this.tbody, `tr[data-row-id="${rowId}"]`);
        if (row) {
            return (
                dom.query(row, `td[data-field="${cellProp}"] .content`) ||
                dom.query(row, `td[data-field="${cellProp}"]`)
            );
        }
        return null;
    }

    updateStatus() {
        if (this.editable) {
            dom.attr(this, 'data-rows', this.items.length);
            dom.attr(this, 'is-editing', false);
        }
    }

    propCheck(disable) {
        if (!disable) {
            this.legacyTimer = setTimeout(() => {
                console.log('(Note: schema should be loaded before rows)');
                console.log('table info:', this.id, this.schema, this.rows);
                throw new Error('a `rows` and a `schema` is required');
            }, 1000);
            return;
        } else {
            clearTimeout(this.legacyTimer);
        }
    }

    getFocused() {
        // the idea is to get focused before render
        // and reset it after rendeer
        // problem is getting the css-path...
        // checkboxes for example do not have ids or other identifiers
        const node = document.activeElement;
        if (this.contains(node)) {
            this.preRenderFocusNode = node;
            console.log('prenode', node);
        }
    }

    setFocused() {
        // see above
        if (this.preRenderFocusNode) {
            setTimeout(() => {
                console.log('postnode', this.preRenderFocusNode);
            }, 30);
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
                if (e.searchItem) {
                    event.searchItem = e.searchItem;
                }
                if (!e.value.added) {
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
        // index is 1-based
        if (!item) {
            this.emit('create-row', { value: { index } });
        } else {
            this.items.splice(index, 0, item);
            this.loadData(this.items);
        }
    }

    removeRow(index) {
        // index is 1-based
        const item = this.items[index];
        this.emit('remove-row', { value: { index, id: item.id, item } });
    }

    getRowIndex(row) {
        const rows = dom.queryAll(this.tbody, 'tr');
        for (let i = 0; i <= rows.length; i++) {
            if (row === rows[i]) {
                return i;
            }
        }
    }

    saveRow(index) {
        // index is 1-based
        const item = this.items[index];
        const event = { value: item };
        const added = item.added;
        if (added) {
            this.emit(added ? 'add-row' : 'change', event);
            item.added = false;
            const row = dom.query(this, 'tr.added-row');
            if (row) {
                row.classList.remove('added-row');
                dom.queryAll(row, 'ui-input,ui-search').forEach((input) => input.onCloseInputs());
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
            const row = e.target.closest('tr');
            const index = this.getRowIndex(row);
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
                default:
                    this.fire('action', {
                        type,
                        item: e.detail.item,
                        index,
                    });
            }
        };

        // @ts-ignore
        this.on('action-event', (e) => {
            action(e, e.detail.value);
        });

        this.actionEventsSet = true;
    }

    isExpanded() {
        return !!dom.query(this, '.expanded-row');
    }

    makeExpandable() {
        const handleExpand = (tr, td) => {
            const id = dom.attr(tr, 'data-row-id');
            const item = this.getItemById(id);
            const state = dom.attr(td, 'data-expanded');

            if (state === 'on' && this.schema.requestCollapse) {
                this.fire(
                    'request-collapse',
                    {
                        // node: container,
                        rowIndex: tr.rowIndex,
                        item,
                    },
                    true,
                );
                return;
            }

            if (this.expandable !== 'multiple' && this.grouped !== 'multiple') {
                // first close all rows
                this.items.forEach((item) => {
                    item.expanded = false;
                });
            }

            item.expanded = !(state === 'on');

            if (!item.expanded && tr.nextElementSibling) {
                // non-request collapse
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
                // non-request expand
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
        };

        this.on('click', '[data-expanded]', (e) => {
            const td = e.target.closest('td');
            const tr = e.target.closest('tr');
            handleExpand(tr, td);
        });

        setTimeout(() => {
            if (this.schema && this.schema.headerless) {
                this.on('click', 'tr', (e) => {
                    if (e.target.closest('.expanded-row')) {
                        return;
                    }
                    const tr = e.target.closest('tr');
                    const td = dom.query(tr, '[data-expanded]');

                    handleExpand(tr, td);
                });
            }
        }, 30);
    }

    refresh(all) {
        if (all) {
            this.render();
        } else {
            this.renderBody(this.items, this.columns);
        }
    }

    render() {
        this.fire('pre-render');
        if (this.zebra) {
            this.classList.add('zebra');
        }
        this.renderTemplate();
        this.renderFooter();
        const columns = this.schema.columns;
        if (!util.isEqual(columns, this.columns)) {
            this.columns = columns;
            this.colSizes = [];
            if (!this.schema.headerless) {
                this.renderHeader(this.columns);
            }
        }
        PERF && console.time('render.table.body');
        this.renderBody(this.items, this.columns);
        PERF && console.timeEnd('render.table.body');
        this.fire('render', { table: this.table || this, thead: this.thead, tbody: this.tbody });
    }

    // is overwritten by scrollable
    renderTemplate() {
        if (this.table) {
            return;
        }
        this.table = dom('table', { tabindex: '1' }, this);
        if (!this.schema.headerless) {
            this.thead = dom('thead', {}, this.table);
        }
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
                options.style = { width: col.width };
            }
            dom('th', options, tr);
        });
        this.colSizes = colSizes;
        this.headHasRendered = true;
        if (this.schema.toolbar) {
            const th = dom('th', {
                class: 'toolbar',
                colspan: columns.length,
            });
            const tr = dom(
                'tr',
                {
                    class: 'toolbar-row',
                    html: th,
                },
                this.thead,
            );

            this.fire(
                'toolbar',
                {
                    node: th,
                },
                true,
            );
        }
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
                    class: 'tbl-error',
                    html: dom('div', { class: 'message', html: error.message || error }),
                },
                this,
            );
        }
    }

    displayNoData(show) {
        const message = this['add-data-message'] || this['no-data-message'];
        const addBtn = !!this['add-data-message'];
        if (!show) {
            this.classList.remove('no-data');
            if (this.noDataNode) {
                dom.destroy(this.noDataNode);
            }
            if (this.noDataHandle) {
                this.noDataHandle.remove();
            }
            return;
        }
        if (!message) {
            this.classList.add('no-data');
            if (this.editable) {
                //add default row
                this.addRow();
            }
            return;
        }
        if (this.noDataHandle) {
            return;
        }
        let btn = null;
        if (addBtn) {
            btn = dom('button', {
                class: 'ui-button',
                html: 'Add Row',
            });
            this.noDataHandle = this.on(btn, 'click', () => {
                this.fire('action-event', { value: 'add' });
            });
        }

        if (!this.noDataNode) {
            this.noDataNode = dom(
                'div',
                {
                    class: 'no-data-container',
                    html: [
                        dom('div', {
                            class: 'message',
                            html: message,
                        }),
                        btn,
                    ],
                },
                this,
            );
        }

        this.hasAddRemove();
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

    const headerless = dataTable.schema.headerless;
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

    if (Array.isArray(dataTable.errors) && dataTable.errors.find((e) => e.errors.index === index)) {
        itemCss('row-error');
    }

    rowOptions.class = itemCss();

    tr = dom('tr', rowOptions, tbody);

    columns.forEach((col, i) => {
        let isExpanded;
        let isExpandedEnd;
        if (expandable && headerless && i === columns.length - 1) {
            isExpandedEnd = !item.expanded ? 'off' : 'on';
        }
        if ((expandable || (grouped && (item.subItemIds || hasChildIds))) && i === 0) {
            if (expandable) {
                isExpanded = !item.expanded ? 'off' : 'on';
                if (headerless) {
                    isExpanded = false;
                }
            } else {
                isExpanded = item.expanded === undefined ? false : item.expanded === false ? 'off' : 'on';
            }
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
                    dom('span', { html, class: 'content' }),
                ],
            });

            css('expand-cell');
        }
        if (dataTable.schema.labeled) {
            html = [
                dom('div', { class: 'tbl-cell-label', html: col.label }),
                dom('div', { class: 'tbl-cell-text', html }),
            ];
        }
        const cellOptions = { html, 'data-field': key, class: css() };
        if (isExpanded) {
            cellOptions['data-expanded'] = isExpanded;
        }
        if (colSizes[i]) {
            cellOptions.style = { width: colSizes[i] };
        }
        dom('td', cellOptions, tr);

        if (isExpandedEnd) {
            dom(
                'td',
                {
                    'data-expanded': isExpandedEnd,
                    class: 'expand-cell',
                    html: dom('i', { class: isExpandedEnd === 'off' ? 'fas fa-angle-down' : 'fas fa-angle-up' }),
                },
                tr,
            );
        }
    });

    if (item.expanded) {
        tr.classList.add('expanded-parent');
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

    node = dom('div', { class: 'expanded-container', id: util.uid('exp') });
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

function setGrouped(items, schema) {
    if (schema.grouped === false && schema.expandable === false) {
        return false;
    }
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
    props: [
        'schema',
        'rows',
        'extsort',
        'selected',
        'update',
        'max-height',
        'borders',
        'footer',
        'error',
        'errors',
        'collapse',
        'add-data-message',
        'no-data-message',
        'static-column'
    ],
    bools: ['sortable', 'selectable', 'scrollable', 'clickable', 'perf', 'autoselect', 'zebra', 'loading'],
});
