const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');

const props = ['data'];
const bools = [];

class DataTable extends BaseComponent {

	static get observedAttributes () {
		return [...props, ...bools];
	}

	get props () {
		return props;
	}

	get bools () {
		return bools;
	}

	constructor () {
		super();
	}

	onData (value) {
		console.log('DATA', value);
		clearTimeout(this.noDataTimer);
		onDomReady(this, () => {
			this.render();
		});
	}

	domReady () {
		this.noDataTimer = setTimeout(() => {
			console.warn('No data');
		}, 1000);
	}

	render () {
		this.fire('pre-render');
		this.renderTemplate();
		this.renderHeader(getColumns(this.data));
	}

	// is overwritten by scrollable
	renderTemplate () {
		if(this.table){
			return;
		}
		this.table = dom('table', { tabindex:'1' }, this);
		this.thead = dom('thead', {}, this.table);
		this.tbody = dom('tbody', {}, this.table);
	}

	renderHeader (columns) {
		dom.clean(this.thead, true);
		const tr = dom('tr', {}, this.thead);

		columns.forEach((col) => {
			const key = col.key || col;
			const label = col.label === undefined ? col : col.label;
			const css = col.css || col.className || '';
			dom('th', {
				html: '<span>' + label + '</span>',
				css: css,
				'data-field': key
			}, tr);
		});
		this.fire('render-header', {thead: this.thead});
	}
}

function getColumns (data) {
	if(Array.isArray(data.columns)) {
		return data.columns;
	}
	return Object.keys(data.columns).map((key) => {
		return {
			key,
			label: data.columns[key]
		};
	});
}
customElements.define('data-table', DataTable);

module.exports = DataTable;