const Editable = {
    init() {},

    addRow(index = 0, item) {
        // index is 1-based
        if (!item) {
            this.emit('create-row', { value: { index } });
        } else {
            this.items.splice(index, 0, item);
            this.loadData(this.items);
        }
    },

    removeRow(index) {
        // index is 1-based
        const item = this.items[index];
        this.emit('remove-row', { value: { index, id: item.id, item } });
    },

    getRowIndex(row) {
        const rows = dom.queryAll(this.tbody, 'tr');
        for (let i = 0; i <= rows.length; i++) {
            if (row === rows[i]) {
                return i;
            }
        }
    },

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
    },

    cancelEdit() {
        const index = this.items.findIndex((item) => item.added);
        this.items.splice(index, 1);
        // plus one, to allow for the header
        this.table.deleteRow(index + 1);
        this.updateStatus();
    },

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

        this.on('action-event', (e) => {
            action(e, e.detail.value);
        });

        this.actionEventsSet = true;
    },
};

module.exports = function () {
    if (!this.hasEditable) {
        util.bindMethods(Editable, this);
        this.hasEditable = true;
    }
};
