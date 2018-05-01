const util = require('./util');
const dom = require('@clubajax/dom');

const Sortable = {
	init () {
		this.classList.add('sortable');
		this.current = {};
		this.on('render-header', this.onHeaderRender.bind(this));
		this.setSort();
	},

	onSort () {
		if (!this.sort) {
			this.setSort();
			return;
		}
		let [sort, dir] = this.sort.split(',').map(w => w.trim());
		dir = !!sort ? dir || 'desc' : dir;
		this.setSort(sort, dir);
	},

	setSort (sort, dir) {
		if (!sort && this.sort) {
			const split = this.sort.split(',').map(w => w.trim());
			sort = split[0];
			dir = split[1];
		}

		this.current = {
			sort,
			dir
		};

		if (!dir) {
			this.items = [...this.orgItems];
		} else {
			const lt = dir === 'asc' ? -1 : 1;
			const gt = dir === 'desc' ? -1 : 1;

			this.items.sort((a, b) => {
				if (a[sort] < b[sort]) {
					return lt;
				} else if (a[sort] > b[sort]) {
					return gt;
				}
				return 0;
			});
		}

		if (this.bodyHasRendered) {
			this.renderBody(this.items, this.columns);
		}
		if (this.headHasRendered) {
			this.displaySort();
		}
	},

	onHeaderRender: function () {
		if (this.clickHandle) {
			this.clickHandle.remove();
		}
		this.clickHandle = this.on('header-click', this.onHeaderClick.bind(this));
		this.displaySort();
	},

	displaySort () {
		if (this.currentSortField) {
			this.currentSortField.classList.remove(this.currentSortClass);
		}
		if (this.current.dir) {
			this.currentSortField = dom.query(this.thead, `[data-field="${this.current.sort}"]`);
			this.currentSortClass = this.current.dir === 'asc' ? 'asc' : 'desc';
			this.currentSortField.classList.add(this.currentSortClass);
		}

		const event = this.current.sort ? `${this.current.sort},${this.current.dir}` : null;
		this.fire('sort', { value: event });
	},

	onHeaderClick (e) {
		let
			dir,
			field = e.detail.field,
			target = e.detail.cell;


		if (!target || target.className.indexOf('no-sort') > -1) {
			console.log('NOTARGET');
			return;
		}
		if (field === this.current.sort) {
			if (this.current.dir === 'asc') {
				dir = '';
			}
			else if (this.current.dir === 'desc') {
				dir = 'asc';
			}
			else {
				dir = 'desc';
			}
		} else {
			dir = 'desc';
		}
		this.setSort(field, dir);
	}
};


module.exports = function () {
	if (!this.hasSortable) {
		util.bindMethods(Sortable, this);
		this.hasSortable = true;
	}
};