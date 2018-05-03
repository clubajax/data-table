const dom = require('@clubajax/dom');
const util = require('./util');

const Scrollable = {
	init () {
		this.classList.add('scrollable');
		this.on('render-body', this.onRender.bind(this));
		this.on('resize', this.onRender.bind(this));
		this.on('pre-render', this.onPreRender.bind(this));
	},

	renderTemplate () {
		if(this.tableHeadWrapper){ return; }
		this.tableHeadWrapper = dom('div', {className: 'table-header-wrapper'}, this);
		this.tableHeader = dom('table', {className: 'table-header', tabindex:'1'}, this.tableHeadWrapper);
		this.thead = dom('thead', {}, this.tableHeader);
		this.tableBodyWrapper = dom('div',
			{
				className: 'table-body-wrapper',
				style: {
					'max-height': this['max-height'],
					'position': this['max-height'] ? 'static' : 'absolute'
				}
			}, this);
		this.tableBody = dom('table', {className: 'table-body', tabindex:'1'}, this.tableBodyWrapper);
		this.tbody = dom('tbody', {}, this.tableBody);
	},

	onPreRender () {
		if(this.table){
			this.scrollPos = this.table.scrollLeft;
		}
	},

	onRender (event) {
		this.sizeColumns();

		if(this.scrollPos){
			const sp = this.scrollPos;
			window.requestAnimationFrame(() => {
				this.scrollLeft = sp;
			});
			this.scrollPos = 0;
		}
	},

	handleScroll (event) {
		const
			head = this.tableHeadWrapper,
			body = this.tableBodyWrapper;
		let amt;

		head.scrollLeft = body.scrollLeft;
		if(head.scrollLeft !== body.scrollLeft) {
			amt = Math.ceil(head.scrollLeft - body.scrollLeft);
			head.style.left = amt + 1 + 'px';
			this.hasShift = true;
		}
		else if(this.hasShift){
			head.style.left = '';
			this.hasShift = false;
		}
	},

	connectScroll (detail) {
		window.requestAnimationFrame(function() {
			if (this.scrollHandle) {
				this.scrollHandle.remove();
			}
			this.scrollHandle = this.on(this.tableBodyWrapper, 'scroll', this.handleScroll.bind(this));
		}.bind(this));
	},

	sizeColumns () {
		const head = this.thead.parentNode;
		const body = this.tbody.parentNode;
		const colSizes = this.colSizes;
		let
			grid = this,
			tempNode = dom('div', {style:{position:'absolute', width: '100px', height: '100px', zIndex:-1}}, document.body),
			gridParent = grid.parentNode,
			i, minWidth, thw, tdw,
			ths = head.querySelectorAll('th'),
			colPercent = (100 / ths.length) + '%',
			firstTR = body.querySelector('tr'),
			tds,
			stretchy = getStretchyColumn(this);

		if(!firstTR){
			return;
		}

		// remove grid from its current location
		// mainly because if it is in a dialog, the animation
		// CSS will mess up dimensions
		tempNode.appendChild(grid);

		tds = firstTR.querySelectorAll('td');

		// reset
		//
		// set containers to absolute and an arbitrary, small width
		// to force cells to squeeze together so we can measure their
		// natural widths

		dom.style(head, {
			position:'absolute',
			width:100
		});
		dom.style(body, {
			position:'absolute',
			width:100
		});

		// reset head THs
		for(i = 0; i < ths.length; i++){
			dom.style(ths[i], {width:'', minWidth:''});
			// TDs shouldn't have a width yet,
			// unless this is a resize
			dom.style(tds[i], {width:'', minWidth:''});
		}

		// wait for DOM to render before getting sizes
		window.requestAnimationFrame(() => {
			// after the next
			for(i = 0; i < ths.length; i++){
				thw = dom.box(ths[i]).width;
				tdw = dom.box(tds[i]).width;
				if (colSizes[i]) {

					dom.style(ths[i], { minWidth: colSizes[i], maxWidth: colSizes[i] });
					dom.style(tds[i], { minWidth: colSizes[i], maxWidth: colSizes[i] });

				} else if(!/fixed\-width/.test(tds[i].className)) {
					minWidth = Math.max(thw, tdw);
					dom.style(ths[i], {minWidth: minWidth});
					dom.style(tds[i], {minWidth: minWidth});
				}

				if (stretchy === 'all') {
					dom.style(tds[i], {width: colPercent});
					dom.style(ths[i], {width: colPercent});
				} else if (stretchy === i) {
					dom.style(tds[i], {width: '100%'});
					dom.style(ths[i], {width: '100%'});
				}
			}

			const headeHeight = dom.box(this.tableHeader).height;
			grid.tableBodyWrapper.style.top = (headeHeight - 1) + 'px';

			// remove temp body styles
			dom.style(head, {
				position:'',
				width:''
			});
			dom.style(body, {
				position:'',
				width:''
			});

			gridParent.appendChild(grid);
			dom.destroy(tempNode);

			this.connectScroll();
		});

	}
};

function getStretchyColumn (self) {
	const sCol = self['stretch-column'];
	const cols = self.columns;
	if (sCol === 'all') {
		return 'all';
	}
	if (sCol === 'none') {
		return -1;
	}
	if (!sCol || sCol === 'last') {
		return cols.length - 1;
	}
	return cols.findIndex(col => col.key === sCol);
}

module.exports = function () {
	if (!this.hasScrollable) {
		util.bindMethods(Scrollable, this);
		this.hasScrollable = true;
	}
};