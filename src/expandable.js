const Expandable = {
    init() {
        this.makeExpandable();
    },

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
    },

    isExpanded() {
        // console.log('  is-expanded', !!dom.query(this, '.expanded-row') || this.items.some((m) => m.expanded));
        // console.log('  rows', dom.queryAll(this, 'tr'));
        // console.log('  this', this.items);
        return !!dom.query(this, '.expanded-row') || this.items.some((m) => m.expanded);
    },

    handleExpand(tr, td) {
        const id = dom.attr(tr, 'data-row-id');
        const item = this.getItemById(id);
        const state = dom.attr(td, 'data-expanded');

        console.log('tr', tr);
        console.log('td', td);

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
    },

    makeExpandable() {
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

            this.handleExpand(tr, td);
        });

        setTimeout(() => {
            if (this.schema && this.schema.headerless) {
                this.on('click', 'tr', (e) => {
                    if (e.target.closest('.expanded-row')) {
                        return;
                    }
                    const tr = e.target.closest('tr');
                    const td = dom.query(tr, '[data-expanded]');

                    this.handleExpand(tr, td);
                });
            }
        }, 30);
    },
};

module.exports = function () {
    if (!this.hasExpandable) {
        util.bindMethods(Expandable, this);
        this.hasExpandable = true;
    }
};
