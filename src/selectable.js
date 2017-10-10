const dom = require('@clubajax/dom');
const util = require('./util');
const SEL_CLASS = 'selected';

const Selectable = {
	init () {
		this.on('row-click', this.onRowClick.bind(this));
		this.on('render-body', this.displaySelection.bind(this));
	},

	onRowClick (e) {
		let currentId;
		if (this.currentRow) {
			this.currentRow.classList.remove(SEL_CLASS);
			currentId = dom.attr(this.currentRow, 'data-row-id');
		}

		this.currentSelection = e.detail.item.id === this.currentSelection ? null : e.detail.item.id;

		this.displaySelection();
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