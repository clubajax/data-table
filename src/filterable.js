const util = require('./util');
const dom = require('@clubajax/dom');

const Filterable = {
    init() {
        this.classList.add('filterable');
    },

    getIconFilter(col) {
        if (!dom.isNode(col.filter)) {
            return null;
        }

        if (typeof col.filter === 'boolean') {
            // TODO DOC THIS
            // Is this for testing?
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

        col.filter.dataTable = this;
        col.filter.col = col;

        const tooltip = dom('ui-tooltip', {
            value: col.filter,
            'use-click': true,
            'is-button': true,
            align: 'B',
            shift: true,
            ...(col.filter.tooltipOptions || {})
        });


        tooltip.onDomReady(() => {
            tooltip.popup.on('popup-open', () => {
                if (col.filter.onOpen) {
                    col.filter.onOpen();
                }
            });
            tooltip.popup.on('popup-close', () => {
                if (col.filter.onClose) {
                    col.filter.onClose();
                }
            });
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
