require('@clubajax/form');
const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const sortable = require('./sortable');
const clickable = require('./clickable');
const selectable = require('./selectable');
const filterable = require('./filterable');
const createComponent = require('./component');
const formatters = require('@clubajax/format');
const util = require('./util');

formatters.checkbox = {
    // for readonly checkbox
    toHtml(value) {
        return dom('div', {
            class: 'tbl-checkbox',
            html: !value ? null : dom('ui-icon', { type: 'check' }),
        });
    },
    from(v) {
        return v;
    },
};

// TODO
// automatic virtual scroll after 100+ rows
// github.io demos
// sticky column:
// https://codepen.io/SimplyPhy/pen/oEZKZo
// https://codepen.io/bjonesAlloy/pen/yLeydLL
// https://codepen.io/paulobrien/full/LBrMxa

class DataTable extends BaseComponent {
    constructor() {
        super();
        this.clickable = false;
        this.sortable = false;
        this.selectable = false;
        this.scrollable = false;
        this.filterable = false;
        this.schemaLoaded = false;

        this.propCheck();

        this.nodeHolder = dom('div', { class: 'data-table-node-holder' }, document.body);

        this.makeExpandable();
        // this.error = undefined;
        // this.loading = undefined;
        // this.errors = undefined;
        // this.zebra = undefined;
        // this.extsort = undefined;
        // this.rows = undefined;

        window.tablePerf = (enabled) => {
            util.storage('data-table-perf', enabled);
        };
        this.isInit = true;

    }

    get isPerf() {
        return util.storage('data-table-perf');
    }

    get isPerfInit() {
        return this.isInit && util.storage('data-table-perf');
    }

    timeName(type) {
        return `table-${type}-${this.name}`;
    }

    get editable() {
        return ((this.schema || {}).columns || []).find((col) => col.component && col.component.type === 'edit-rows');
    }

    onConnected() {
        console.log('table.connected');
    }

    onUpdate(item) {
        if (!item) {
            // initializing
            return;
        }

        const rowItem = this.getItemById(item.id);
        if (!rowItem) {
            return;
        }


        let changed = '';
        let column;
        Object.keys(item).forEach((key) => {
            if (typeof item[key] !== 'object' && rowItem[key] !== item[key]) {
                rowItem[key] = item[key];
                column = this.getColumn(key);
                let td = dom.query(this, `tr[data-row-id="${item.id}"] td[data-field="${key}"]`);
                if (!td) {
                    // not a td or is a td with the expandable caret
                    return;
                }
                const formatter = util.getFormatter(column, rowItem)[0];
                if (td.querySelector('.data-table-field')) {
                    const input = td.querySelector('input');
                    if (input) {
                        input.value = formatter.to(rowItem[key]);
                    }
                    return;
                }
                if (/fa-caret/.test(td.innerHTML)) {
                    td = dom.query(td, '.content');
                }

                let val = formatter.toHtml(rowItem[key]);
                if (typeof val === 'string' || typeof val === 'number') {
                    if (column.callback) {
                        val = column.callback({ value: val, item, index: 0, column, formatters });
                    }
                    td.innerHTML = val;
                } else {
                    td.innerHTML = '';
                    td.appendChild(val);
                }
                changed = key;
            }
        });

        // if (changed) {
        //     clearTimeout(this.updateTimer);
        //     this.updateTimer = setTimeout(() => {
        //         const event = { value: rowItem, column };
        //         this.emit('change', event);
        //         this.setCheckAll();
        //     }, 100);
        // }
    }

    onRows(rows) {
        if (!this.schema) {
            return;
        }
        if (!this.schema.columns) {
            this.schema.columns = [];
        }
        this.loadData(rows);
    }

    onSchema(schema) {
        // console.log('on.schema', schema);
        // only detects changes
        // not for init
        // only works if the is a key change
        if (!this.orgSchema || !this.orgSchema.key) {
            return;
        }
        if (this.orgSchema.key !== schema.key) {
            // NOTE:
            // This is not necessary
            // rerender the whole grid with a new key
            //
            // console.log('schema.render');
            // this.orgSchema = util.copy(schema);
            // this.render();
        }
        if (!schema) {
            console.error('schema not set', schema);
        }
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
        if (!util.equal(this.schema, this.orgSchema)) {
            this.orgSchema = util.copy(this.schema);
        }

        if (util.equal(items, this.orgItems)) {
            return;
        }

        if (util.equalUids(items, this.orgItems)) {
            items.forEach((item) => {
                this.onUpdate(item);
            });
            return;
        }
        this.isInit = false;

        // check for hidden columns
        //  This needs to be run on every data update
        //  because the schema gets updated as well
        this.hiddenHandled = true;
        this.storageKey =
            this.id ||
            this.schema.columns
                .reduce((acc, col) => {
                    const key = col.key || col.sort;
                    acc.push(key);
                    return acc;
                }, [])
                .join('-');
        let hidden = util.storage(this.storageKey);
        if (hidden) {
            this.schema.columns.forEach((col) => {
                const key = col.key || col.sort || col.icon;
                col.hidden = hidden.includes(key);
            });
        } else if (!this['no-save-columns']) {
            hidden = this.schema.columns.filter((c) => c.hidden).map((c) => c.key || c.sort);
            util.storage(this.storageKey, hidden);
        }

        if (this.readonly) {
            const cols = this.schema.columns;
            const editIndex = cols.findIndex((c) => c.icon === 'edit');
            if (editIndex > -1) {
                cols.splice(editIndex, 1);
            }
            cols.filter((c) => c.component).forEach((col) => {
                // delete col.component.type;
                col.component.readonly = true;
            });
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
            if (this.schema.staticColumn) {
                dom.attr(this, 'static-column', true);
            }
            if (this.schema.showHideColumns) {
                dom.attr(this, 'show-hide-columns', true);
            }

            this.expandable = this.schema.expandable || this.schema.headerless;
            dom.classList.toggle(this, 'has-grouped', !!this.grouped || !!this.expandable);

            // console.log('\ntable', this.name);
            if (!items.length && !this.loading && !this.error) {
                // fixes nav-away no-header bug in distribution
                // if (this.tbody) {
                //     dom.clean(this.tbody, true);
                // }
                // added:
                this.render();
                this.displayNoData(true);
            } else {
                // console.log('load.data...');
                if (this.isExpanded() && this.hasRows()) {
                    // console.log('   update...');
                    this.updateCells();
                } else {
                    // console.log('   render...');
                    this.render();
                    this.updateStatus();
                }
            }

            this.orgItems = util.copy(items);

            this.setCheckAll();
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
            }, 2000);
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
                const event = { value: e.value, column: e.column, selected: e.selected };
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

    getIconFilter(col) {
        // to be overwritten by filterable
        return dom('span', { class: 'fas fa-check' });
    }

    toggleColumns() {
        if (!this['show-hide-columns']) {
            return;
        }
        const cols = this.schema.columns;
        cols.forEach((c, i) => {
            const cls = `h${i + 1}`;
            if (c.hidden) {
                dom.classList.add(this, cls);
            } else {
                dom.classList.remove(this, cls);
            }
        });
    }

    getColumnMenu() {
        if (!this.colMenu) {
            const cols = this.schema.columns;
            this.colMenu = dom('div', {
                class: 'tbl-popup',
                html: cols.map((col, i) => {
                    const disabled = i === cols.length - 1;
                    return dom('ui-checkbox', {
                        disabled,
                        name: col.key || col.sort,
                        value: !col.hidden,
                        label: col.label,
                    });
                }),
            });
            if (cols.length > 20) {
                console.warn('Not enough classes to handle the amount of columns');
            }
            this.on(this.colMenu, 'change', (e) => {
                const cols = this.schema.columns;
                const column = cols.find((c) => c.key === e.name || c.sort === e.name);
                column.hidden = !e.value;

                if (!this['no-save-columns']) {
                    const hidden = this.schema.columns.filter((c) => c.hidden).map((c) => c.key || c.sort);
                    util.storage(this.storageKey, hidden);
                }

                this.toggleColumns();
                this.fire('column-change', { column });
            });
        }
        const tooltip = dom('ui-tooltip', {
            value: this.colMenu,
            'use-click': true,
            'is-button': true,
        });
        return dom('ui-icon', {
            type: 'fas fa-ellipsis-v',
            html: tooltip,
        });
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

    toggleCheckAll(value) {
        dom.queryAll(this, 'tbody td.ui-checkbox ui-checkbox').forEach((check) => {
            check.checked = value;
        });
        this.emit('check-all', { value });
    }

    setCheckAll() {
        if (!this.checkboxToggle) {
            return;
        }
        const prop = this.getCheckProperty();
        if (this.items.every((m) => m[prop])) {
            this.checkboxToggle.value = true;
        } else if (!this.items.some((m) => m[prop])) {
            this.checkboxToggle.value = false;
        } else {
            this.checkboxToggle.intermediate = true;
        }
    }

    getCheckProperty() {
        // gets the item property used to determine
        // whether the item is selected
        // there could be multiple checkboxes -
        // assuming the first
        const col = this.schema.columns.find((c) => c.component && c.component.type === 'ui-checkbox');
        return col ? col.key || col.sort : null;
    }

    isExpanded() {
        // console.log('  is-expanded', !!dom.query(this, '.expanded-row') || this.items.some((m) => m.expanded));
        // console.log('  rows', dom.queryAll(this, 'tr'));
        // console.log('  this', this.items);
        return !!dom.query(this, '.expanded-row') || this.items.some((m) => m.expanded);
    }

    hasRows() {
        return !!dom.query(this, 'body tr');
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
                if (!afterTR.nextElementSibling) {
                    console.warn('Parent has no children');
                    return;
                }
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
            const radio = e.target.closest('ui-radio');
            const td = e.target.closest('td');
            const tr = e.target.closest('tr');
            if (radio) {
                const id = dom.attr(tr, 'data-row-id');
                dom.queryAll(this, 'td > div > ui-radio').forEach((radio) => {
                    radio.checked = `${radio.id}` === `${id}`;
                });
                this.items.forEach((item) => {
                    if (`${item.id}` === `${id}`) {
                        item.selected = true;
                        this.emit('select', { value: item.id, item });
                    } else {
                        item.selected = false;
                    }
                });
                return;
            }

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
        if (this.destroyed) {
            console.log('not rendering a destroyed data-table', this.name);
            return;
        }
        if (!this.schema) {
            this.rerenderCount = this.rerenderCount ? this.rerenderCount + 1 : 1;
            if (this.rerenderCount > 10) {
                console.error('After 10 rerenders, there is no schema', this.name, this.destroyed);
                return;
            }
            setTimeout(() => {
                this.render();
            }, 100);
        }
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
        this.renderBody(this.items, this.columns);
        this.toggleColumns();
        this.fire('render', { table: this.table || this, thead: this.thead, tbody: this.tbody });
    }

    // is overwritten by scrollable
    renderTemplate() {
        if (this.table || !this.schema) {
            return;
        }
        this.table = dom('table', { tabindex: '1' }, this);
        if (!this.schema.headerless) {
            this.thead = dom('thead', {}, this.table);
        }
        this.tbody = dom('tbody', {}, this.table);
    }

    renderHeader(columns) {
        if (this.columnButton) {
            this.columnButton.parentNode.removeChild(this.columnButton);
        }

        dom.clean(this.thead, true);
        const tr = dom('tr', {}, this.thead);
        const colSizes = [];
        const lastCol = [...columns].reverse().find((c) => !c.hidden);
        const hideShow = this['show-hide-columns'] || this.schema.showHideColumns;

        (columns || []).forEach((col, i) => {
            const hasHideShowCols = hideShow && col === lastCol;
            let options;
            if (col.component && col.component.all) {
                // check-all
                const input = dom('ui-checkbox', { intermediate: true });
                input.on('change', (e) => {
                    e.stopPropagation();
                    if (!e || e.value == undefined) {
                        return;
                    }
                    this.toggleCheckAll(input.value);
                });
                options = {
                    class: 'ui-checkbox',
                    html: input,
                };
                this.checkboxToggle = input;
            } else if (!col.key && col.icon) {
                // edit column
                options = {
                    html: dom('span', { class: 'fas fa-pencil-alt' }),
                    'data-field': 'edit',
                };
                this.hasAddRemove();
            } else {
                const key = col.key || col;
                const label = col.label === undefined ? col : col.label;

                const css = util.classnames(col.css || col.className);
                css(col.bordered ? 'bordered' : undefined);
                css(typeof col.align === 'function' ? col.align({ col }) : col.align);
                css(col.class);
                css(col.format || (col.component ? col.component.format : ''));
                if (col.unsortable) {
                    css('unsortable');
                }

                const hasFilter = dom.isNode(col.filter);
                css(hasFilter ? 'filter' : null);

                if (hasHideShowCols) {
                    css('hide-show-col');
                }

                options = {
                    html: [
                        dom('span', {
                            class: 'th-content',
                            html: dom('span', { html: label, class: 'tbl-label' }),
                        }),
                        dom('span', {
                            class: 'sort',
                            html: [
                                dom('span', { class: 'sort-up fas fa-sort-up' }),
                                dom('span', { class: 'sort-dn fas fa-sort-down' }),
                            ],
                        }),
                        hasFilter ? dom('span', { class: 'filter-btn', html: this.getIconFilter(col) }) : false,
                    ],
                    class: css(),
                    'data-field': typeof key === 'string' ? key : key.sort,
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

        if (hideShow) {
            const parent = dom.query(this.thead, 'tr th:last-child');
            if (this.columnButton) {
                parent.appendChild(this.columnButton);
            } else {
                this.columnButton = dom('span', { class: 'cols-btn', html: this.getColumnMenu() }, parent);
            }
        }
        this.fire('render-header', { thead: this.thead });
    }

    renderBody(items, columns) {
        this.isPerf && console.time(this.timeName('body'));
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
            this.isPerf && console.timeEnd(this.timeName('body'));
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
        const btnCls = this['add-button-class'] ? `ui-button ${this['add-button-class']}` : 'ui-button';
        const btnTxt = this['add-button-text'] || 'Add Row';
        if (addBtn) {
            btn = dom('button', {
                class: btnCls,
                html: btnTxt,
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
        if (this.schema.columns.find((c) => c.filter)) {
            clickable.call(this);
            filterable.call(this);
        }
        this.mixPlugins = noop;
    }

    destroy() {
        this.destroyed = true;
        if (this.addRemoveHandle) {
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
        // console.log('***DESTROY***', this.name);
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

    const schema = dataTable.schema;
    const headerless = schema.headerless;
    const expandable = schema.expandable;
    const grouped = schema.grouped;
    const hasChildIds = item.childIds && item.childIds.length;
    if (selectable) {
        rowOptions.tabindex = 1;
    }

    if (item.added || !item.id) {
        itemCss('added-row');
    }

    if (grouped) {
        if (!item.parentId) {
            itemCss('parent-row');
        } else if (isChild) {
            itemCss('child-row');
            if (isLastChild) {
                itemCss('last-child');
            }
        }
    }

    if (item.disabled) {
        rowOptions.disabled = true;
    }

    if (Array.isArray(dataTable.errors) && dataTable.errors.find((e) => e.errors.index === index)) {
        itemCss('row-error');
    }

    rowOptions.class = itemCss();

    tr = dom('tr', rowOptions, tbody);

    columns.forEach((col, i) => {
        // if (col.hidden) {
        //     return true;
        // }
        let isExpanded;
        let isExpandedEnd;
        const canExpand = schema.canExpand ? schema.canExpand(item) : true;
        if (expandable && headerless && canExpand && i === columns.length - 1) {
            isExpandedEnd = !item.expanded ? 'off' : 'on';
        }
        if (canExpand && (expandable || (grouped && (item.subItemIds || hasChildIds))) && i === 0) {
            if (expandable) {
                isExpanded = !item.expanded ? 'off' : 'on';
                if (headerless) {
                    isExpanded = false;
                }
            } else {
                isExpanded = item.expanded === undefined ? false : item.expanded === false ? 'off' : 'on';
            }
        }

        key = col.key || col.icon || col.sort;
        css = util.classnames(key);
        css(col.bordered ? 'bordered' : undefined);
        css(typeof col.align === 'function' ? col.align({ col, item }) : col.align);
        css(col.class);
        css(col.format);
        if (shouldRender(col.component, item)) {
            if (item.disabled && col.component.type === 'ui-checkbox') {
                html = formatters.checkbox.toHtml(item[key]);
            } else {
                html = createComponent(col, item, index, dataTable);
            }
            css(!col.component.readonly ? col.component.type : null);
            css(col.component.format);
            css('unsortable');
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
                    dataTable.schema.radios ? dom('ui-radio', { checked: item.selected, id: item.id }) : null,
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

function shouldRender(component, item) {
    return component && (!component.noRender || component.noRender(item));
}

function renderExpandedRow(item, index, columns, tbody, dataTable) {
    // row that contains a form or content other than hidden rows

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

function renderTotals(items, columns, tbody, dataTable) {
    const rowOptions = {
        class: 'totals-row',
    };
    const tr = dom('tr', rowOptions, tbody);
    const totals = dataTable.schema.totals;
    columns.forEach((col, i) => {
        const ttl = totals[i] || {};
        let html = ttl.label ? ttl.label : ttl.callback ? ttl.callback(items, col) : '';
        if (col.format && col.format !== 'checkbox') {
            html = formatters[col.format].toHtml(html);
        }
        const css = util.classnames();
        css(col.bordered ? 'bordered' : undefined);
        css(ttl.align || (typeof col.align === 'function' ? col.align({ col }) : col.align));
        css(col.format);
        css(ttl.class);

        dom(
            'td',
            {
                html,
                class: css(),
            },
            tr,
        );
    });
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

    if (dataTable.schema.totals) {
        renderTotals(items, columns, tbody, dataTable);
    }

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

        items.forEach((item) => {
            if (item.subItemIds && !item.subItemIds.length) {
                delete item.subItemIds;
                item.childless = true;
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
        'static-column',
        'add-button-class',
        'add-button-text',
        'name',
    ],
    bools: [
        'sortable',
        'selectable',
        'scrollable',
        'clickable',
        'perf',
        'autoselect',
        'zebra',
        'loading',
        'readonly',
        'show-hide-columns',
        'no-save-columns',
    ],
});
