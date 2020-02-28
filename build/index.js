!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e(require("@clubajax/dom"),require("@clubajax/base-component"),require("@clubajax/on")):"function"==typeof define&&define.amd?define(["@clubajax/dom","@clubajax/base-component","@clubajax/on"],e):"object"==typeof exports?exports["data-table"]=e(require("@clubajax/dom"),require("@clubajax/base-component"),require("@clubajax/on")):t["data-table"]=e(t["@clubajax/dom"],t["@clubajax/base-component"],t["@clubajax/on"])}(this,(function(t,e,s){return function(t){var e={};function s(i){if(e[i])return e[i].exports;var l=e[i]={i:i,l:!1,exports:{}};return t[i].call(l.exports,l,l.exports,s),l.l=!0,l.exports}return s.m=t,s.c=e,s.d=function(t,e,i){s.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},s.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},s.t=function(t,e){if(1&e&&(t=s(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(s.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var l in t)s.d(i,l,function(e){return t[e]}.bind(null,l));return i},s.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return s.d(e,"a",e),e},s.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},s.p="",s(s.s=2)}([function(e,s){e.exports=t},function(t,e){t.exports={bindMethods:function(t,e){Object.keys(t).forEach(s=>{"function"==typeof t[s]&&(e[s]=t[s])}),t.init&&t.init.call(e)},isEqual:function(t,e){return t===e||!(!t&&e||t&&!e)&&JSON.stringify(t)===JSON.stringify(e)}}},function(t,e,s){"use strict";s.r(e);s(3),s(10)},function(t,e,s){const i=s(4),l=s(0),r=s(5),a=s(6),o=s(8),n=s(9),h=s(1);function d(){}t.exports=i.define("data-table",class extends i{constructor(){super(),this.editable=!1,this.clickable=!1,this.sortable=!1,this.selectable=!1,this.scrollable=!1}onRows(t){this.schema&&(this.data={columns:this.schema,items:t},this.onData(this.data))}onSchema(t){this.rows&&(this.data={columns:t,items:this.rows},this.onData(this.data))}onData(t){const e=t?t.items||t.data:null;this.orgItems=e,e?(this.displayNoData(!1),this.items=[...e],this.mixPlugins(),clearTimeout(this.noDataTimer),this.onDomReady(()=>{this.render()})):this.displayNoData(!0)}domReady(){this.perf=this.perf||!0,this.items||(this.noDataTimer=setTimeout(()=>{this.displayNoData(!0)},1e3))}render(){this.fire("pre-render"),this.renderTemplate();const t=function(t){if(Array.isArray(t.columns))return t.columns;return Object.keys(t.columns).map(e=>({key:e,label:t.columns[e]}))}(this.data);h.isEqual(t,this.columns)||(this.columns=t,this.renderHeader(this.columns)),this.renderBody(this.items,this.columns),this.fire("render",{table:this.table||this,thead:this.thead,tbody:this.tbody})}renderTemplate(){this.table||(this.table=l("table",{tabindex:"1"},this),this.thead=l("thead",{},this.table),this.tbody=l("tbody",{},this.table))}renderHeader(t){l.clean(this.thead,!0);const e=l("tr",{},this.thead),s=[];t.forEach((t,i)=>{const r=t.key||t,a={html:"<span>"+(void 0===t.label?t:t.label)+"</span>",css:t.css||t.className||"","data-field":r};t.width&&(s[i]=t.width,a.style={width:t.width}),l("th",a,e)}),this.colSizes=s,this.headHasRendered=!0,this.fire("render-header",{thead:this.thead})}renderBody(t,e){this.exclude;const s=this.tbody;if(l.clean(s,!0),!t||!t.length)return this.bodyHasRendered=!0,this.fire("render-body",{tbody:this.tbody}),void this.displayNoData(!0);this.editable;const i=this.selectable;void 0===t[0].id&&console.warn("Items do not have an ID"),function(t,e,s,i,r,a){t.forEach((t,a)=>{t.index=a;const o=t.css||t.class||t.className;let n,h,d,c,u={"data-row-id":t.id};r&&(u.tabindex=1),o&&(u.class=o),c=l("tr",u,i),e.forEach((e,i)=>{d=e.key||e,n="index"===d?a+1:t[d],e.callback&&(n=e.callback(t,a)),h=d;const r={html:n,"data-field":d,css:h};s[i]&&(r.style={width:s[i]}),l("td",r,c)})}),a()}(t,e,this.colSizes,s,i,()=>{this.bodyHasRendered=!0,this.fire("render-body",{tbody:this.tbody})})}getItemById(t){return this.items.find(e=>""+e.id==""+t)}displayNoData(t){t?this.classList.add("no-data"):this.classList.remove("no-data")}mixPlugins(){this.clickable&&a.call(this),this.sortable&&(a.call(this),r.call(this)),this.selectable&&(a.call(this),o.call(this)),this.scrollable&&n.call(this),this.mixPlugins=d}},{props:["data","schema","rows","sort","selected","stretch-column","max-height","borders"],bools:["sortable","selectable","scrollable","clickable","perf"]})},function(t,s){t.exports=e},function(t,e,s){const i=s(1),l=s(0),r={init(){this.classList.add("sortable"),this.current={},this.on("render-header",this.onHeaderRender.bind(this)),this.setSort()},onSort(){if(!this.sort)return void this.setSort();let[t,e]=this.sort.split(",").map(t=>t.trim());e=t?e||"desc":e,this.setSort(t,e)},setSort(t,e){if(!t&&this.sort){const s=this.sort.split(",").map(t=>t.trim());t=s[0],e=s[1]}if(this.current={sort:t,dir:e},e){const s="asc"===e?-1:1,i="desc"===e?-1:1;this.items.sort((e,l)=>e[t]<l[t]?s:e[t]>l[t]?i:0)}else this.items=[...this.orgItems];this.bodyHasRendered&&this.renderBody(this.items,this.columns),this.headHasRendered&&this.displaySort()},onHeaderRender:function(){this.clickHandle&&this.clickHandle.remove(),this.clickHandle=this.on("header-click",this.onHeaderClick.bind(this)),this.displaySort()},displaySort(){this.currentSortField&&this.currentSortField.classList.remove(this.currentSortClass),this.current.dir&&(this.currentSortField=l.query(this.thead,`[data-field="${this.current.sort}"]`),this.currentSortClass="asc"===this.current.dir?"asc":"desc",this.currentSortField.classList.add(this.currentSortClass));const t=this.current.sort?`${this.current.sort},${this.current.dir}`:null;this.fire("sort",{value:t})},onHeaderClick(t){let e,s=t.detail.field,i=t.detail.cell;!i||i.className.indexOf("no-sort")>-1?console.log("NOTARGET"):(e=s===this.current.sort?"asc"===this.current.dir?"":"desc"===this.current.dir?"asc":"desc":"desc",this.setSort(s,e))}};t.exports=function(){this.hasSortable||(i.bindMethods(r,this),this.hasSortable=!0)}},function(t,e,s){const i=s(1),l=s(0),r=s(7),a={init(t){this.on("render",this.handleClicks.bind(this))},handleBodyClick(t){let e,s,i,r,a,o,n=t.target.closest("td");n&&(r=n.getAttribute("data-field")),a=t.target.closest("tr"),a&&(e=+a.getAttribute("data-index"),o=l.attr(a,"data-row-id"),o&&(s=this.getItemById(o),i={index:e,cell:n,row:a,item:s,field:r,value:s[r],target:t.target},this.fire("row-click",i)))},handleHeaderClick(t){let e=t.target.closest("th"),s={field:e&&e.getAttribute("data-field"),cell:e,target:t.target};e&&this.fire("header-click",s)},handleClicks(t){this.handle&&this.handle.remove(),this.handle=r.makeMultiHandle([this.on(t.detail.tbody,"keyup",t=>{"Enter"===t.key&&this.handleBodyClick(t)}),this.on(t.detail.tbody,"click",this.handleBodyClick.bind(this)),this.on(t.detail.thead,"click",this.handleHeaderClick.bind(this))])}};t.exports=function(){this.hasClickable||(i.bindMethods(a,this),this.hasClickable=!0)}},function(t,e){t.exports=s},function(t,e,s){const i=s(0),l=s(1),r={init(){this.classList.add("selectable"),this.on("row-click",this.onRowClick.bind(this)),this.on("render-body",this.displaySelection.bind(this))},onSelected(t){t!==this.currentSelection&&this.selectRow(t)},onRowClick(t){this.selectRow(t.detail.item.id)},selectRow(t){let e;this.currentRow&&(this.currentRow.classList.remove("selected"),e=i.attr(this.currentRow,"data-row-id")),this.currentSelection=t===this.currentSelection?null:t;let s=this.getItemById(this.currentSelection);if("unselectable"===(s?s.css||s.class||s.className:null)&&(this.currentSelection=null,s=null,t=null),this.displaySelection(),this.currentSelection){const e={row:this.currentRow,item:s,value:t};this.emit("change",e)}else this.emit("change")},displaySelection(){if(this.currentSelection){const t=i.query(this,`[data-row-id="${this.currentSelection}"]`);t&&(t.classList.add("selected"),this.currentRow=t)}}};t.exports=function(){this.hasSelectable||(l.bindMethods(r,this),this.hasSelectable=!0)}},function(t,e,s){const i=s(0),l=s(1),r={init(){this.classList.add("scrollable"),this.on("render-body",this.onRender.bind(this)),this.on("resize",this.onRender.bind(this)),this.on("pre-render",this.onPreRender.bind(this))},renderTemplate(){this.tableHeadWrapper||(this.tableHeadWrapper=i("div",{className:"table-header-wrapper"},this),this.tableHeader=i("table",{className:"table-header",tabindex:"1"},this.tableHeadWrapper),this.thead=i("thead",{},this.tableHeader),this.tableBodyWrapper=i("div",{className:"table-body-wrapper",style:{"max-height":this["max-height"],position:this["max-height"]?"static":"absolute"}},this),this.tableBody=i("table",{className:"table-body",tabindex:"1"},this.tableBodyWrapper),this.tbody=i("tbody",{},this.tableBody))},onPreRender(){this.table&&(this.scrollPos=this.table.scrollLeft)},onRender(t){if(this.sizeColumns(),this.scrollPos){const t=this.scrollPos;window.requestAnimationFrame(()=>{this.scrollLeft=t}),this.scrollPos=0}},handleScroll(t){const e=this.tableHeadWrapper,s=this.tableBodyWrapper;let i;e.scrollLeft=s.scrollLeft,e.scrollLeft!==s.scrollLeft?(i=Math.ceil(e.scrollLeft-s.scrollLeft),e.style.left=i+1+"px",this.hasShift=!0):this.hasShift&&(e.style.left="",this.hasShift=!1)},connectScroll(t){window.requestAnimationFrame(function(){this.scrollHandle&&this.scrollHandle.remove(),this.scrollHandle=this.on(this.tableBodyWrapper,"scroll",this.handleScroll.bind(this))}.bind(this))},sizeColumns(){const t=this.thead.parentNode,e=this.tbody.parentNode,s=this.colSizes;let l,r,a,o,n,h=this,d=i("div",{style:{position:"absolute",width:"100px",height:"100px",zIndex:-1}},document.body),c=h.parentNode,u=t.querySelectorAll("th"),b=100/u.length+"%",f=e.querySelector("tr"),m=function(t){const e=t["stretch-column"],s=t.columns;if("all"===e)return"all";if("none"===e)return-1;if(!e||"last"===e)return s.length-1;return s.findIndex(t=>t.key===e)}(this);if(f){for(d.appendChild(h),n=f.querySelectorAll("td"),i.style(t,{position:"absolute",width:100}),i.style(e,{position:"absolute",width:100}),l=0;l<u.length;l++)i.style(u[l],{width:"",minWidth:""}),i.style(n[l],{width:"",minWidth:""});window.requestAnimationFrame(()=>{for(l=0;l<u.length;l++)a=i.box(u[l]).width,o=i.box(n[l]).width,s[l]?(i.style(u[l],{minWidth:s[l],maxWidth:s[l]}),i.style(n[l],{minWidth:s[l],maxWidth:s[l]})):/fixed\-width/.test(n[l].className)||(r=Math.max(a,o),i.style(u[l],{minWidth:r}),i.style(n[l],{minWidth:r})),"all"===m?(i.style(n[l],{width:b}),i.style(u[l],{width:b})):m===l&&(i.style(n[l],{width:"100%"}),i.style(u[l],{width:"100%"}));const f=i.box(this.tableHeader).height;h.tableBodyWrapper.style.top=f-1+"px",i.style(t,{position:"",width:""}),i.style(e,{position:"",width:""}),c.appendChild(h),i.destroy(d),this.connectScroll()})}}};t.exports=function(){this.hasScrollable||(l.bindMethods(r,this),this.hasScrollable=!0)}},function(t,e,s){}])}));