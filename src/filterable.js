const util = require('./util');
const dom = require('@clubajax/dom');

const Filterable = {
    init() {
        this.classList.add('filterable');
    },

    getIconFilter(col) {
        const id = util.uid('filter');

        const render = (open) => {
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

            const tooltip = dom(
                'ui-tooltip',
                {
                    value: col.filter,
                    'use-click': true,
                    // 'is-button': true,
                    buttonid: id,
                    align: 'B',
                    shift: true,
                    ...(col.filter.tooltipOptions || {}),
                    open,
                },
                document.body,
            );

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

            return tooltip;
        };

        const renderTip = () => {
            return dom('ui-icon', {
                id,
                type: 'fas fa-filter',
                // html: tooltip,
            });
        };

        if (dom.isNode(col.filter)) {
            render();
            return renderTip();
        }

        const tip = renderTip(dom('div'));
        this.once(tip, 'click', () => {
            col.filter = col.filter();
            render(true);
        });
        return tip;
    },
};

module.exports = function () {
    if (!this.hasFilterable) {
        util.bindMethods(Filterable, this);
        this.hasFilterable = true;
    }
};
