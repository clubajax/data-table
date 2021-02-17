const util = require('./util');
const dom = require('@clubajax/dom');
const on = require('@clubajax/on');

const Clickable = {

	init (grid) {
		this.on('render', this.handleClicks.bind(this));
	},

	handleBodyClick (e) {
		let
			index,
			item,
			emitEvent,
			field,
			row,
			rowId,
			cell = e.target.closest('td');

		if (cell) {
			field = cell.getAttribute('data-field');
		}
		row = e.target.closest('tr');

		if (!row || row.classList.contains('expanded-row')) {
			return;
		}

		index = +row.getAttribute('data-index');
		rowId = dom.attr(row, 'data-row-id');

		if (!rowId) {
			return;
		}

        item = this.getItemById(rowId);
        
        if (!item) {
            // most likely a child table row
            return;
        }

		emitEvent = {
			index: index,
			cell: cell,
			row: row,
			item: item,
			field: field,
			value: item[field],
			target: e.target
		};

		this.fire('row-click', emitEvent);
	},

    handleHeaderClick(event) {
        const isFilter = !!event.target.closest('.filter-btn');
		let
			cell = event.target.closest('th'),
			field = cell && cell.getAttribute('data-field'),
			emitEvent = {
				field: field,
				cell: cell,
                target: event.target,
                isFilter
			};
		if (cell && !cell.classList.contains('toolbar')) {
			this.fire('header-click', emitEvent, true, true);
		}
	},

	handleClicks (event) {
		if (this.handle) {
			this.handle.remove();
		}

		this.handle = on.makeMultiHandle([
			this.on(event.detail.tbody, 'keyup', (e) => {
				if (e.key === 'Enter') {
					this.handleBodyClick(e);
				}
			}),
			this.on(event.detail.tbody, 'click', this.handleBodyClick.bind(this)),
			this.on(event.detail.thead, 'click', this.handleHeaderClick.bind(this))
		]);
	}
};

module.exports = function () {
	if (!this.hasClickable) {
		util.bindMethods(Clickable, this);
		this.hasClickable = true;
	}
};