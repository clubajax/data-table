const dom = require('@clubajax/dom');
const util = require('./util');
const SEL_CLASS = 'selected';

const Selectable = {
	init () {
		this.on('row-click', this.onRowClick.bind(this));
		this.on('render-body', this.displaySelection.bind(this));
	},

	onRowClick (e) {
		if (this.currentRow) {
			this.currentRow.classList.remove(SEL_CLASS);
		}
		this.currentSelection = e.detail.item.id;
		this.displaySelection();
	},

	displaySelection () {
		if (this.currentSelection) {
			const row = dom.query(`[data-row-id="${this.currentSelection}"]`);
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