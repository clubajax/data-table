const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');

class DataTable extends BaseComponent {
	constructor () {
		super();
		console.log('DATA TABLE');
	}

	domReady () {
		dom('div', {html: 'yay, table'}, this);
	}
}

customElements.define('data-table', DataTable);

module.exports = DataTable;