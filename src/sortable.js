const util = require('./util');

const Sortable = {
	init () {
		this.isDefaultSort = true;
		this.on('render-header', this.onHeaderRender.bind(this));
		this.on('render', () => {
			this.hasRendered = true;
		});
		this.setSort(this.sort, this.dir);
	},

	onSort () {
		this.setSort();
	},

	setSort () {
		const [sort, dir] = this.sort.split(',').map(w => w.trim());
		console.log('set.sort:', sort, dir);
		this.current = {
			sort,
			dir
		};

		this.items.sort((a, b) => {
			if (a[sort] < b[sort]){
				return 1;
			} else if (a[sort] > b[sort]) {
				return -1;
			}
			return 0;
		});
		if (this.hasRendered) {
			this.renderBody(this.items, this.columns);
		}
	},

	onHeaderRender: function () {
		if (this.clickHandle) {
			this.clickHandle.remove();
		}
		this.clickHandle = this.on('header-click', this.onHeaderClick.bind(this));
	},

	onHeaderClick (e) {
		console.log('sort on:', e);
		let
			dir,
			field = e.detail.field,
			target = e.detail.cell;

		console.log('onHeaderClick', e.detail);

		if (!target || target.className.indexOf('no-sort') > -1) {
			console.log('NOTARGET');
			return;
		}
		if (field === this.current.sort) {
			if (this.current.dir === 'desc') {
				dir = 'asc';
			}
			else if (this.current.dir === 'asc') {
				dir = '';
			}
			else {
				dir = 'desc';
			}
		} else {
			if (this.current.dir === 'desc') {
				dir = 'asc';
			} else {
				dir = 'desc';
			}
		}
		this.sort = `${field},${dir}`;
	}
};


module.exports = function () {
	console.log('sortable!', this);
	util.bindMethods(Sortable, this);
};