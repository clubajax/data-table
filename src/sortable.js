const util = require('./util');

const Sortable = {
	init () {
		console.log('init!', this);
		this.on('render', this.onGridRender.bind(this));
	},

	onGridRender: function () {
		if (this.clickHandle) {
			this.clickHandle.remove();
		}
		this.clickHandle = this.on('header-click', this.onHeaderClick.bind(this));
	},

	onHeaderClick (e) {
		console.log('sort on:', e);
	}
};



module.exports = function () {
	console.log('sortable!', this);
	util.bindMethods(Sortable, this);
};