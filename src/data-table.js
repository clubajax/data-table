const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const sortable = require('./sortable');
const clickable = require('./clickable');
const selectable = require('./selectable');
const scrollable = require('./scrollable');
const createComponent = require('./component');
const util = require('./util');

const PERF = true;
let log;

// TODO
// widget / function for content (checkbox)
// automatic virtual scroll after 100+ rows
// optional column widths
// filter / search
// github.io demos


class DataTable extends BaseComponent {

	constructor () {
        super();
        this.editable = false;
        this.clickable = false;
        this.sortable = false;
        this.selectable = false;
        this.scrollable = false;
        this.legacyCheck();
        // this.data = 0;
        // this.schema = false;
        // this.rows = false;
        // this.exclude = [];
    }
    
    onRows(rows) {
        if (!this.schema) {
            return;
        }
        this.loadData(rows);
    }

    // onSchema(schema) {
    //     if (!this.rows) {
    //         return;
    //     }
    //     console.log('schema...', this.rows);
    //     this.loadData(this.rows);
    // }

    loadData(rows) {
        const items = rows || [];
        this.orgItems = items;
        this.legacyCheck(true);
		if (!items.length) {
			this.displayNoData(true);
			return;
		}
		this.displayNoData(false);
		this.items = [...items];
		this.mixPlugins();
		clearTimeout(this.noDataTimer);
		this.onDomReady(() => {
			this.render();
		});
	}

    legacyCheck(disable) {
        if (!disable) {
            this.legacyTimer = setTimeout(() => {
                throw new Error('a `rows` and a `schema` is required');
            }, 1000);
            return;
        }
        clearTimeout(this.legacyTimer);
    }

	domReady () {
        this.perf = this.perf || PERF;
        if (!this.items) {
            this.noDataTimer = setTimeout(() => {
                this.displayNoData(true);
            }, 1000);
        }
	}

	render () {
		this.fire('pre-render');
		this.renderTemplate();
		const columns = this.schema.columns;
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
		const colSizes = [];
		columns.forEach((col, i) => {
			const key = col.key || col;
			const label = col.label === undefined ? col : col.label;
			const css = col.css || col.className || '';
			const options = {
				html: '<span>' + label + '</span>',
				css: css,
				'data-field': key
			};
			if (col.width){
				colSizes[i] = col.width;
				options.style = { width: col.width };
			}
			dom('th', options, tr);
		});
		this.colSizes = colSizes;
		this.headHasRendered = true;
		this.fire('render-header', { thead: this.thead });
	}

	renderBody (items, columns) {
		const exclude = this.exclude;
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

		if (items[0].id === undefined){
			console.warn('Items do not have an ID');
		}

		// TODO: if sort, just reorder - do perf test
		//console.time('render body');
		render(items, columns, this.colSizes, tbody, selectable, () => {
			// PERF: makes no difference:
			//this.table.appendChild(this.tbody);
			//console.timeEnd('render body');
			this.bodyHasRendered = true;
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
        if (this.clickable) {
			clickable.call(this);
		}
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

function render (items, columns, colSizes, tbody, selectable, callback) {
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
		columns.forEach((col, i) => {
            key = col.key || col;
            if (col.component) {
                console.log('COMP HERE');
                html = createComponent(col, item);
            } else {
                html = key === 'index' ? index + 1 : item[key];
                if (col.callback) {
                    html = col.callback(item, index);
                }
            }
			css = key;
			const cellOptions = { html, 'data-field': key, css };
			if (colSizes[i]) {
				cellOptions.style = { width: colSizes[i] };
			}
			// if (editable) {
			// 	cellOptions.tabindex = 1;
			// }
			dom('td', cellOptions, tr);
		});
	});
	callback();
}

// experimental
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

function noop () {

}

module.exports = BaseComponent.define('data-table', DataTable, {
	props: ['schema', 'rows', 'sort', 'selected', 'stretch-column', 'max-height', 'borders'],
	bools: ['sortable', 'selectable', 'scrollable', 'clickable', 'perf']
});
