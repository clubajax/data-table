const util = require('./util');
const dom = require('@clubajax/dom');
const on = require('@clubajax/on');

const Clickable = {

	init (grid) {
		this.on('render', this.handleClicks.bind(this));
	},

	handleBodyClick (event) {
		let
			index,
			item,
			emitEvent,
			field,
			row,
			cell = event.target.closest('td');

		if(!cell){
			return;
		}

		field = cell.getAttribute('data-field');
		row = event.target.closest('tr');

		if(!row){ return; }

		index = +row.getAttribute('data-index');
		item = this.data.items[index];

		emitEvent = {
			index: index,
			cell: cell,
			row: row,
			item: item,
			field: field,
			value: item[field],
			target: event.target
		};

		console.log('emitEvent', emitEvent);
		this.fire('row-click', emitEvent);
	},

	handleHeaderClick (event) {
		let
			cell = event.target.closest('th'),
			field = cell && cell.getAttribute('data-field'),
			emitEvent = {
				field: field,
				cell: cell,
				target: event.target
			};
		console.log('head', emitEvent);
		if(cell) {
			this.fire('header-click', emitEvent);
		}
	},

	handleClicks (event) {
		if(this.handle){
			this.handle.remove();
		}

		this.handle = on.makeMultiHandle([
			this.on(event.detail.tbody, 'keyup', function(e){
				if(e.key === 'Enter'){
					self.handleBodyClick(e);
				}
			}),
			this.on(event.detail.tbody, 'click', this.handleBodyClick.bind(this)),
			this.on(event.detail.thead, 'click', this.handleHeaderClick.bind(this))
		]);


	}
};

module.exports = function () {
	console.log('clickable!', this);
	util.bindMethods(Clickable, this);
};