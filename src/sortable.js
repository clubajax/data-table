const util = require('./util');
const dom = require('@clubajax/dom');

const Sortable = {
    init() {
        this.classList.add('sortable');
        this.current = {};
        this.on('render-header', this.onHeaderSortRender.bind(this));
        const { field, dir } = this.extsort || {};
        this.setSort(field, dir);
    },

    onExtsort(sort) {
        // does not fire on init - only on updates
        // data-table.onExtsort fires on init, but use sortable.init instead
        this.setSort(sort.field, sort.dir);
        clearTimeout(this.clickSortHandleTimer);
        if (this.clickSortHandle) {
            this.clickSortHandle.resume();
        }
    },

    setSort(sort, dir) {
        if (!sort) {
            sort = this.schema.sort;
            dir = this.schema.desc ? 'desc' : 'asc';
            this.current.dir = sort;
        }

        sort = sort || '';
        if (typeof sort === 'string') {
            const col = this.schema.columns.find((col) => sort.includes(col.key) || sort.includes(col.sort));
            if (col) {
                sort = col.key || col.sort;
            }
        }

        this.current = {
            sort,
            dir,
        };

        if (!this.extsort) {
            const lt = dir === 'asc' ? -1 : 1;
            const gt = dir === 'desc' ? -1 : 1;
            this.items.sort((a, b) => {
                let word1 = (a[sort] || '').toString().toLowerCase();
                let word2 = (b[sort] || '').toString().toLowerCase();
                if (word1 < word2) {
                    return lt;
                } else if (word1 > word2) {
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
            this.fire('sort', { value: event });
        }
    },

    onHeaderSortRender () {
        if (this.clickSortHandle) {
            this.clickSortHandle.remove();
        }
        this.clickSortHandle = this.on('header-click', this.onHeaderSortClick.bind(this));
        this.displaySort();
    },

    onHeaderSortClick(e) {
        let dir,
            field = e.detail.field,
            target = e.detail.cell;
        
        
        if (!target || e.detail.isFilter || e.detail.isShowCols || target.className.indexOf('no-sort') > -1) {
            return;
        }
        if (field === this.current.sort) {
            dir = this.current.dir === 'asc' ? 'desc' : 'asc';
        } else {
            dir = 'desc';
        }

        if (this.extsort) {
            const col = this.schema.columns.find((col) => field === col.key || field === col.sort);
            if (!col) {
                return;
            }
            if (col.sortKeys || col.sort) {
                field = col.sortKeys || col.sort;
            }
            this.fire('sort', {
                field,
                dir,
            });
        } else {
            this.setSort(field, dir);
        }
        this.clickSortHandle.pause();
        this.clickSortHandleTimer = setTimeout(() => {
            this.clickSortHandle.resume();
        }, 500);
    },
};

module.exports = function () {
    if (!this.hasSortable) {
        util.bindMethods(Sortable, this);
        this.hasSortable = true;
    }
};
