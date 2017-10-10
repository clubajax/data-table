const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const sortable = require('./sortable');
const clickable = require('./clickable');
const selectable = require('./selectable');
const util = require('./util');

const props = ['data', 'sort', 'selected'];
const bools = ['sortable', 'selectable'];


// TODO
// Handle no data
// if sort, just reorder - do perf test
//
// TESTS - PERF TESTS
//


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
		const items = value.items || value.data;
		this.orgItems = items;
		this.items = [...items];
		this.mixPlugins();
		clearTimeout(this.noDataTimer);
		onDomReady(this, () => {
			this.render();
		});
	}

	mixPlugins () {
		if (this.sortable) {
			clickable.call(this);
			sortable.call(this);
		}
		if (this.selectable) {
			clickable.call(this);
			selectable.call(this);
		}
		this.mixPlugins = noop;
	}

	domReady () {
		this.noDataTimer = setTimeout(() => {
			console.warn('No data');
		}, 1000);
	}

	render () {
		this.fire('pre-render');
		this.renderTemplate();
		const columns = getColumns(this.data);
		if (!util.isEqual(columns, this.columns)) {
			this.columns = columns;
			this.renderHeader(this.columns);
		}
		this.renderBody(this.items, this.columns);

		this.fire('render', { table: this.table || this, thead: this.thead, tbody: this.tbody });
	}

	// is overwritten by scrollable
	renderTemplate () {
		if (this.table) {
			return;
		}
		this.table = dom('table', { tabindex: '1' }, this);
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

		this.headHasRendered = true;
		this.fire('render-header', { thead: this.thead });

	}

	renderBody (items, columns) {
		const exclude = this.exclude || [];
		dom.clean(this.tbody, true);

		const editable = this.editable;
		const selectable = this.selectable;

		// TODO: if sort, just reorder - do perf test

		items.forEach((item, i) => {
			item.index = i;
			const itemCss = item.css || item.class || item.className;
			let
				html, css, key,
				rowOptions = { 'data-index': i, 'data-row-id': item.id },
				tr;
			if (selectable) {
				rowOptions.tabindex = 1;
			}
			if (itemCss) {
				rowOptions.class = itemCss;
			}

			tr = dom('tr', rowOptions, this.tbody);
			columns.forEach((col) => {
				key = col.key || col;
				html = item[key];
				css = key;
				const cellOptions = { html, 'data-field': key, css };
				if (editable) {
					cellOptions.tabindex = 1;
				}
				dom('td', cellOptions, tr);
			});
		});
		this.bodyHasRendered = true;
		this.fire('render-body', { tbody: this.tbody });
	}

	getItemById (id) {
		return this.items.find(item => ''+item.id === ''+id);
	}
}

function getColumns (data) {
	if (Array.isArray(data.columns)) {
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