const dom = require('@clubajax/dom');
const util = require('./util');
const SEL_CLASS = 'selected';

const Selectable = {
	init () {
		this.on('row-click', this.onRowClick.bind(this));
		this.on('render-body', this.displaySelection.bind(this));
	},

	onSelected (value) {
		console.log('attr.select', value);
	},

	onRowClick (e) {
		let currentId;
		if (this.currentRow) {
			this.currentRow.classList.remove(SEL_CLASS);
			currentId = dom.attr(this.currentRow, 'data-row-id');
		}

		this.currentSelection = e.detail.item.id === this.currentSelection ? null : e.detail.item.id;

		this.displaySelection();

		if (this.currentSelection) {
			const event = Object.assign({}, e.detail);
			delete event.target;
			event.value = e.detail.item.id;
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