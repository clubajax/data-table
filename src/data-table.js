const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const sortable = require('./sortable');
const clickable = require('./clickable');
const selectable = require('./selectable');
const scrollable = require('./scrollable');
const util = require('./util');

const props = ['data', 'sort', 'selected', 'stretch-column'];
const bools = ['sortable', 'selectable', 'scrollable', 'perf'];
const PERF = true;
let log;

// TODO
// widget / function for content (checkbox)
// automatic virtual scroll after 100+ rows
// optional column widths
// filter / search
// github.io demos


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
		const items = value ? value.items || value.data : null;
		this.orgItems = items;
		if (!items) {
			this.displayNoData(true);
			return;
		}
		this.displayNoData(false);
		this.items = [...items];
		this.mixPlugins();
		clearTimeout(this.noDataTimer);
		onDomReady(this, () => {
			this.render();
		});
	}

	domReady () {
		this.perf = this.perf || PERF;
		this.noDataTimer = setTimeout(() => {
			this.displayNoData(true);
		}, 1000);
	}

	render () {
		this.fire('pre-render');
		console.time('render');
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
		const tbody = this.tbody;
		dom.clean(tbody, true);

		if(!items || !items.length){
			this.bodyHasRendered = true;
			this.fire('render-body', { tbody: this.tbody });
			this.displayNoData(true);
			return;
		}

		const editable = this.editable;
		const selectable = this.selectable;

		if (!items[0].id){
			console.warn('Items do not have an ID');
		}

		// TODO: if sort, just reorder - do perf test
		//console.time('render body');
		render(items, columns, tbody, selectable, () => {
			// PERF: makes no difference:
			//this.table.appendChild(this.tbody);
			//console.timeEnd('render body');
			this.bodyHasRendered = true;
			requestAnimationFrame(() => {
				console.timeEnd('render');
			});
			this.fire('render-body', { tbody: this.tbody });
		});

	}

	getItemById (id) {
		return this.items.find(item => ''+item.id === ''+id);
	}

	displayNoData (show) {
		if (show) {
			this.classList.add('no-data');
		} else {
			this.classList.remove('no-data');
		}
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
		if (this.scrollable) {
			scrollable.call(this);
		}
		this.mixPlugins = noop;
	}
}

function render (items, columns, tbody, selectable, callback) {
	items.forEach((item, index) => {
		item.index = index;
		const itemCss = item.css || item.class || item.className;
		let
			html, css, key,
			rowOptions = { 'data-row-id': item.id },
			tr;

		if (selectable) {
			rowOptions.tabindex = 1;
		}
		if (itemCss) {
			rowOptions.class = itemCss;
		}

		tr = dom('tr', rowOptions, tbody);
		columns.forEach((col) => {
			key = col.key || col;
			html = key === 'index' ? index + 1 : item[key];
			css = key;
			const cellOptions = { html, 'data-field': key, css };
			// if (editable) {
			// 	cellOptions.tabindex = 1;
			// }
			dom('td', cellOptions, tr);
		});
	});
	callback();
}

function lazyRender (allItems, columns, tbody, sorts, callback) {
	let index = 0;
	function renderRows (items) {
		items.forEach((item) => {
			item.index = index;
			const itemCss = item.css || item.class || item.className;
			let
				html, css, key,
				rowOptions = { 'data-row-id': item.id },
				tr;
			if (selectable) {
				rowOptions.tabindex = 1;
			}
			if (itemCss) {
				rowOptions.class = itemCss;
			}

			tr = dom('tr', rowOptions, tbody);
			columns.forEach((col) => {
				key = col.key || col;
				html = item[key];
				css = key;
				const cellOptions = { html, 'data-field': key, css };
				// if (editable) {
				// 	cellOptions.tabindex = 1;
				// }
				dom('td', cellOptions, tr);
			});
			index++;
		});
	}

	allItems = [...allItems];

	function next () {
		const items = allItems.splice(0, 5);
		renderRows(items);

		if(allItems.length){
			setTimeout(() => {
				next();
			},1);
		} else {
			callback();
		}
	}
	next();
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