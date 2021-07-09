const util = require('./util');
const dom = require('@clubajax/dom');

const Filterable = {
    init() {
        this.classList.add('filterable');
    },

    // onHeaderFilterRender() {
    //     if (this.clickFilterHandle) {
    //         this.clickFilterHandle.remove();
    //     }
    //     this.clickFilterHandle = this.on('header-click', this.onHeaderFilterClick.bind(this));
    // },

    // onHeaderFilterClick(e) {
    //     const field = e.detail.field;
    //     const target = e.detail.cell;
    //     const col = this.schema.columns.find((c) => c.key === field);
    // },

    getIconFilter(col) {
        if (!dom.isNode(col.filter)) {
            return null;
        }
        if (typeof col.filter === 'boolean') {
            return dom('span', { class: 'fas fa-filter' });
        }

        col.filter.close = () => {
            tooltip.close();
        };
        col.filter.send = (data) => {
            this.fire('filter', {
                col: col,
                value: data.value !== undefined ? data.value : data,
                name: data.name !== undefined ? data.name : '',
            });
        };

        const tooltip = dom('ui-tooltip', {
            value: col.filter,
            'use-click': true,
            'is-button': true,
        });

        return dom('ui-icon', {
            type: 'fas fa-filter',
            html: tooltip,
        });
    },
};

module.exports = function () {
    if (!this.hasFilterable) {
        util.bindMethods(Filterable, this);
        this.hasFilterable = true;
    }
};
