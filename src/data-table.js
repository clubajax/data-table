const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const sortable = require('./sortable');
const clickable = require('./clickable');

const props = ['data', 'sort', 'dir'];
const bools = ['sortable'];

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
		console.log('DATA', this.DOMSTATE, this.sortable, value);
		this.mixPlugins();
		clearTimeout(this.noDataTimer);
		onDomReady(this, () => {
			this.render();
		});
	}

	mixPlugins () {
		sortable.call(this);
		clickable.call(this);
		this.mixPlugins = noop;
	}

	domReady () {
		console.log('attr:', this.sortable);
		this.noDataTimer = setTimeout(() => {
			console.warn('No data');
		}, 1000);
	}

	render () {
		this.fire('pre-render');
		this.renderTemplate();
		this.columns = getColumns(this.data);
		this.renderHeader(this.columns);
		this.renderBody(this.data.items, this.columns);

		this.fire('render', {table: this.table || this, thead: this.thead, tbody: this.tbody});
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

	renderBody (items, columns) {
		const exclude = this.exclude || [];
		dom.clean(this.tbody, true);

		items.forEach((item, i) => {
			item.index = i;
			let
				html, css, key,
				tr = dom('tr', { 'data-index': i, 'data-id': item.id }, this.tbody);
			columns.forEach((col) => {
				key = col.key || col;
				html = item[key];
				css = key;
				dom('td', {html: html, 'data-field': key, tabIndex: 1, css:css}, tr);
			});
		});
		this.fire('render-body', {tbody: this.tbody});

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

function noop () {

}
customElements.define('data-table', DataTable);

module.exports = DataTable;