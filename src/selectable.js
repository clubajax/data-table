const dom = require('@clubajax/dom');
const util = require('./util');
const SEL_CLASS = 'selected';

const Selectable = {
	init () {
		this.classList.add('selectable');
		this.on('row-click', this.onRowClick.bind(this));
		this.on('render-body', this.displaySelection.bind(this));
	},

	onSelected (value) {
		this.selectRow(value);
	},

	onRowClick (e) {
		this.selectRow(e.detail.item.id);
	},

	selectRow (id) {
		let currentId;
		if (this.currentRow) {
			this.currentRow.classList.remove(SEL_CLASS);
			currentId = dom.attr(this.currentRow, 'data-row-id');
		}

		this.currentSelection = id === this.currentSelection ? null : id;

		let item = this.getItemById(this.currentSelection);

		if (item && item.css === 'unselectable'){
			this.currentSelection = null;
			item = null;
			id = null;
		}

		this.displaySelection();

		if (this.currentSelection) {
			const event = {
				row: this.currentRow,
				item: item,
				value: id
			};
			this.emit('change', event);
		} else {
			this.emit('change');
		}
	},

	displaySelection () {
		if (this.currentSelection) {
			const row = dom.query(this, `[data-row-id="${this.currentSelection}"]`);
			if (row) {
				row.classList.add(SEL_CLASS);
				this.currentRow = row;
			}
		}
	}
};


module.exports = function () {
	if (!this.hasSelectable) {
		util.bindMethods(Selectable, this);
		this.hasSelectable = true;
	}
};