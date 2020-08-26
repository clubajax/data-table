const util = require('./util');
const dom = require('@clubajax/dom');

const Sortable = {
    init() {
        this.classList.add('sortable');
        this.current = {};
        this.on('render-header', this.onHeaderRender.bind(this));
        const {field, dir} = this.extsort || {};
        this.setSort(field, dir);
    },

    onExtsort(sort) {
        // does not fire on init - only on updates
        // data-table.onExtsort fires on init, but use sortable.init instead
        this.setSort(sort.field, sort.dir);
        clearTimeout(this.clickHandleTimer);
        if (this.clickHandle) {
            this.clickHandle.resume();
        }
    },


    setSort(sort, dir) {
        if (!sort) {
            sort = this.schema.sort;
            dir = this.schema.desc ? 'desc' : 'asc';
            this.current.dir = sort;
        }

        if (Array.isArray(sort)) {
            const col = this.schema.columns.find(col => sort.includes(col.key));
            sort = col.key;
        }

        this.current = {
            sort,
            dir,
        };

        const lt = dir === 'asc' ? -1 : 1;
        const gt = dir === 'desc' ? -1 : 1;

        if (!this.extsort) {
            this.items.sort((a, b) => {
                if (a[sort] < b[sort]) {
                    return lt;
                } else if (a[sort] > b[sort]) {
                    return gt;
                }
                return 0;
            });

            if (this.bodyHasRendered) {
                this.renderBody(this.items, this.columns);
            }
        }
        if (this.headHasRendered) {
            this.displaySort();
        }
    },

    onHeaderRender: function() {
        if (this.clickHandle) {
            this.clickHandle.remove();
        }
        this.clickHandle = this.on('header-click', this.onHeaderClick.bind(this));
        this.displaySort();
    },

    displaySort() {
        if (this.currentSortField) {
            this.currentSortField.classList.remove(this.currentSortClass);
        }
        if (this.current.dir) {
            this.currentSortField = dom.query(this.thead, `[data-field="${this.current.sort}"]`);
            this.currentSortClass = this.current.dir === 'asc' ? 'asc' : 'desc';
            if (this.currentSortField) {
                this.currentSortField.classList.add(this.currentSortClass);
            }
        }

        const event = this.current.sort ? `${this.current.sort},${this.current.dir}` : null;
        
        if (!this.extsort) {
            this.fire('sort', {value: event});
        }
    },

    onHeaderClick(e) {
        let dir,
            field = e.detail.field,
            target = e.detail.cell;

        if (!target || target.className.indexOf('no-sort') > -1) {
            return;
        }
        if (field === this.current.sort) {
            dir = this.current.dir === 'asc' ? 'desc' : 'asc';
        } else {
            dir = 'desc';
        }
        
        if (this.extsort) {
            const col = this.schema.columns.find(col => field === col.key);
            if (col.sortKeys) {
                field = col.sortKeys;
            }
            this.fire('sort', {
                field,
                dir
            })
        } else {
            this.setSort(field, dir);
        }
        this.clickHandle.pause();
        this.clickHandleTimer = setTimeout(() => {
            this.clickHandle.resume();
        }, 1000);
    },
};

module.exports = function() {
    if (!this.hasSortable) {
        util.bindMethods(Sortable, this);
        this.hasSortable = true;
    }
};
