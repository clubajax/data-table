!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e(require("@clubajax/dom"),require("@clubajax/on"),require("@clubajax/base-component"),require("@clubajax/form")):"function"==typeof define&&define.amd?define(["@clubajax/dom","@clubajax/on","@clubajax/base-component","@clubajax/form"],e):"object"==typeof exports?exports["data-table"]=e(require("@clubajax/dom"),require("@clubajax/on"),require("@clubajax/base-component"),require("@clubajax/form")):t["data-table"]=e(t["@clubajax/dom"],t["@clubajax/on"],t["@clubajax/base-component"],t["@clubajax/form"])}(this,(function(t,e,i,s){return function(t){var e={};function i(s){if(e[s])return e[s].exports;var n=e[s]={i:s,l:!1,exports:{}};return t[s].call(n.exports,n,n.exports,i),n.l=!0,n.exports}return i.m=t,i.c=e,i.d=function(t,e,s){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:s})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(i.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)i.d(s,n,function(e){return t[e]}.bind(null,n));return s},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=3)}([function(e,i){e.exports=t},function(t,e){t.exports={bindMethods:function(t,e){Object.keys(t).forEach(i=>{"function"==typeof t[i]&&(e[i]=t[i])}),t.init&&t.init.call(e)},isEqual:function(t,e){return t===e||!(!t&&e||t&&!e)&&JSON.stringify(t)===JSON.stringify(e)}}},function(t,i){t.exports=e},function(t,e,i){"use strict";i.r(e);i(4),i(12)},function(t,e,i){const s=i(5),n=i(0),o=i(6),r=i(7),l=i(8),a=i(9),h=i(10),c=i(1);function d(){}t.exports=s.define("data-table",class extends s{constructor(){super(),this.clickable=!1,this.sortable=!1,this.selectable=!1,this.scrollable=!1,this.legacyCheck()}onRows(t){this.schema&&this.loadData(t)}loadData(t){const e=t||[];this.orgItems=e,this.legacyCheck(!0),e.length?(this.displayNoData(!1),this.items=[...e],this.mixPlugins(),clearTimeout(this.noDataTimer),this.onDomReady(()=>{this.render()})):this.displayNoData(!0)}legacyCheck(t){t?clearTimeout(this.legacyTimer):this.legacyTimer=setTimeout(()=>{throw new Error("a `rows` and a `schema` is required")},1e3)}domReady(){this.perf=this.perf||!0,this.items||(this.noDataTimer=setTimeout(()=>{this.displayNoData(!0)},1e3))}render(){this.fire("pre-render"),this.renderTemplate(),this.renderFooter();const t=this.schema.columns;c.isEqual(t,this.columns)||(this.columns=t,this.renderHeader(this.columns)),this.renderBody(this.items,this.columns),this.fire("render",{table:this.table||this,thead:this.thead,tbody:this.tbody})}renderTemplate(){this.table||(this.table=n("table",{tabindex:"1"},this),this.thead=n("thead",{},this.table),this.tbody=n("tbody",{},this.table))}renderHeader(t){n.clean(this.thead,!0);const e=n("tr",{},this.thead),i=[];t.forEach((t,s)=>{const o=t.key||t,r=void 0===t.label?t:t.label,l=t.css||t.className||"",a={html:[n("span",{html:r,css:"ui-label"}),n("span",{class:"sort-up",html:"&uarr;"}),n("span",{class:"sort-dn",html:"&darr;"})],css:l,"data-field":o};t.width&&(i[s]=t.width,a.style={width:t.width}),n("th",a,e)}),this.colSizes=i,this.headHasRendered=!0,this.fire("render-header",{thead:this.thead})}renderBody(t,e){this.exclude;const i=this.tbody;if(n.clean(i,!0),!t||!t.length)return this.bodyHasRendered=!0,this.fire("render-body",{tbody:this.tbody}),void this.displayNoData(!0);const s=this.selectable;void 0===t[0].id&&console.warn("Items do not have an ID"),function(t,e,i,s,o,r){t.forEach((t,r)=>{t.index=r;const l=t.css||t.class||t.className;let a,c,d,u,b={"data-row-id":t.id};o&&(b.tabindex=1),l&&(b.class=l),u=n("tr",b,s),e.forEach((e,s)=>{d=e.key||e,e.component?a=h(e,t):(a="index"===d?r+1:t[d],e.callback&&(a=e.callback(t,r))),c=d;const o={html:a,"data-field":d,css:c};i[s]&&(o.style={width:i[s]}),n("td",o,u)})}),r()}(t,e,this.colSizes,i,s,()=>{this.bodyHasRendered=!0,this.fire("render-body",{tbody:this.tbody})})}renderFooter(){this.footer&&(this.tfoot=n("tfoot",{html:this.footer},this.table))}getItemById(t){return this.items.find(e=>""+e.id==""+t)}displayNoData(t){t?this.classList.add("no-data"):this.classList.remove("no-data")}mixPlugins(){this.clickable&&r.call(this),(this.sortable||this.schema.sort)&&(r.call(this),o.call(this)),this.selectable&&(r.call(this),l.call(this)),this.scrollable&&a.call(this),this.mixPlugins=d}},{props:["schema","rows","sort","selected","stretch-column","max-height","borders","footer"],bools:["sortable","selectable","scrollable","clickable","perf"]})},function(t,e){t.exports=i},function(t,e,i){const s=i(1),n=i(0),o={init(){this.classList.add("sortable"),this.current={},this.on("render-header",this.onHeaderRender.bind(this)),this.setSort()},onSort(){let[t,e]=this.sort.split(",").map(t=>t.trim());e=t?e||"desc":e,this.setSort(t,e)},setSort(t,e){t||(t=this.schema.sort,e=this.schema.desc?"desc":"asc",this.current.dir=t),this.current={sort:t,dir:e};const i="asc"===e?-1:1,s="desc"===e?-1:1;this.items.sort((e,n)=>e[t]<n[t]?i:e[t]>n[t]?s:0),this.bodyHasRendered&&this.renderBody(this.items,this.columns),this.headHasRendered&&this.displaySort()},onHeaderRender:function(){this.clickHandle&&this.clickHandle.remove(),this.clickHandle=this.on("header-click",this.onHeaderClick.bind(this)),this.displaySort()},displaySort(){this.currentSortField&&this.currentSortField.classList.remove(this.currentSortClass),this.current.dir&&(this.currentSortField=n.query(this.thead,`[data-field="${this.current.sort}"]`),this.currentSortClass="asc"===this.current.dir?"asc":"desc",this.currentSortField&&this.currentSortField.classList.add(this.currentSortClass));const t=this.current.sort?`${this.current.sort},${this.current.dir}`:null;this.fire("sort",{value:t})},onHeaderClick(t){let e,i=t.detail.field,s=t.detail.cell;!s||s.className.indexOf("no-sort")>-1?console.log("NOTARGET"):(e=i===this.current.sort?"asc"===this.current.dir?"desc":"asc":"desc",this.setSort(i,e))}};t.exports=function(){this.hasSortable||(s.bindMethods(o,this),this.hasSortable=!0)}},function(t,e,i){const s=i(1),n=i(0),o=i(2),r={init(t){this.on("render",this.handleClicks.bind(this))},handleBodyClick(t){let e,i,s,o,r,l,a=t.target.closest("td");a&&(o=a.getAttribute("data-field")),r=t.target.closest("tr"),r&&(e=+r.getAttribute("data-index"),l=n.attr(r,"data-row-id"),l&&(i=this.getItemById(l),s={index:e,cell:a,row:r,item:i,field:o,value:i[o],target:t.target},this.fire("row-click",s)))},handleHeaderClick(t){let e=t.target.closest("th"),i={field:e&&e.getAttribute("data-field"),cell:e,target:t.target};e&&this.fire("header-click",i)},handleClicks(t){this.handle&&this.handle.remove(),this.handle=o.makeMultiHandle([this.on(t.detail.tbody,"keyup",t=>{"Enter"===t.key&&this.handleBodyClick(t)}),this.on(t.detail.tbody,"click",this.handleBodyClick.bind(this)),this.on(t.detail.thead,"click",this.handleHeaderClick.bind(this))])}};t.exports=function(){this.hasClickable||(s.bindMethods(r,this),this.hasClickable=!0)}},function(t,e,i){const s=i(0),n=i(1),o={init(){this.classList.add("selectable"),this.on("row-click",this.onRowClick.bind(this)),this.on("render-body",this.displaySelection.bind(this))},onSelected(t){t!==this.currentSelection&&this.selectRow(t)},onRowClick(t){this.selectRow(t.detail.item.id)},selectRow(t){let e;this.currentRow&&(this.currentRow.classList.remove("selected"),e=s.attr(this.currentRow,"data-row-id")),this.currentSelection=t===this.currentSelection?null:t;let i=this.getItemById(this.currentSelection);if("unselectable"===(i?i.class||i.className:null)&&(this.currentSelection=null,i=null,t=null),this.displaySelection(),this.currentSelection){const e={row:this.currentRow,item:i,value:t};this.emit("change",e)}else this.emit("change")},displaySelection(){if(this.currentSelection){const t=s.query(this,`[data-row-id="${this.currentSelection}"]`);t&&(t.classList.add("selected"),this.currentRow=t)}}};t.exports=function(){this.hasSelectable||(n.bindMethods(o,this),this.hasSelectable=!0)}},function(t,e,i){const s=i(0),n=i(1),o={init(){this.classList.add("scrollable"),this.on("render-body",this.onRender.bind(this)),this.on("resize",this.onRender.bind(this)),this.on("pre-render",this.onPreRender.bind(this))},renderTemplate(){this.tableHeadWrapper||(this.tableHeadWrapper=s("div",{className:"table-header-wrapper"},this),this.tableHeader=s("table",{className:"table-header",tabindex:"1"},this.tableHeadWrapper),this.thead=s("thead",{},this.tableHeader),this.tableBodyWrapper=s("div",{className:"table-body-wrapper",style:{"max-height":this["max-height"],position:this["max-height"]?"static":"absolute"}},this),this.tableBody=s("table",{className:"table-body",tabindex:"1"},this.tableBodyWrapper),this.tbody=s("tbody",{},this.tableBody))},onPreRender(){this.table&&(this.scrollPos=this.table.scrollLeft)},onRender(t){if(this.sizeColumns(),this.scrollPos){const t=this.scrollPos;window.requestAnimationFrame(()=>{this.scrollLeft=t}),this.scrollPos=0}},handleScroll(t){const e=this.tableHeadWrapper,i=this.tableBodyWrapper;let s;e.scrollLeft=i.scrollLeft,e.scrollLeft!==i.scrollLeft?(s=Math.ceil(e.scrollLeft-i.scrollLeft),e.style.left=s+1+"px",this.hasShift=!0):this.hasShift&&(e.style.left="",this.hasShift=!1)},connectScroll(t){window.requestAnimationFrame(function(){this.scrollHandle&&this.scrollHandle.remove(),this.scrollHandle=this.on(this.tableBodyWrapper,"scroll",this.handleScroll.bind(this))}.bind(this))},sizeColumns(){const t=this.thead.parentNode,e=this.tbody.parentNode,i=this.colSizes;let n,o,r,l,a,h=this,c=s("div",{style:{position:"absolute",width:"100px",height:"100px",zIndex:-1}},document.body),d=h.parentNode,u=t.querySelectorAll("th"),b=100/u.length+"%",m=e.querySelector("tr"),f=function(t){const e=t["stretch-column"],i=t.columns;if("all"===e)return"all";if("none"===e)return-1;if(!e||"last"===e)return i.length-1;return i.findIndex(t=>t.key===e)}(this);if(m){for(c.appendChild(h),a=m.querySelectorAll("td"),s.style(t,{position:"absolute",width:100}),s.style(e,{position:"absolute",width:100}),n=0;n<u.length;n++)s.style(u[n],{width:"",minWidth:""}),s.style(a[n],{width:"",minWidth:""});window.requestAnimationFrame(()=>{for(n=0;n<u.length;n++)r=s.box(u[n]).width,l=s.box(a[n]).width,i[n]?(s.style(u[n],{minWidth:i[n],maxWidth:i[n]}),s.style(a[n],{minWidth:i[n],maxWidth:i[n]})):/fixed\-width/.test(a[n].className)||(o=Math.max(r,l),s.style(u[n],{minWidth:o}),s.style(a[n],{minWidth:o})),"all"===f?(s.style(a[n],{width:b}),s.style(u[n],{width:b})):f===n&&(s.style(a[n],{width:"100%"}),s.style(u[n],{width:"100%"}));const m=s.box(this.tableHeader).height;h.tableBodyWrapper.style.top=m-1+"px",s.style(t,{position:"",width:""}),s.style(e,{position:"",width:""}),d.appendChild(h),s.destroy(c),this.connectScroll()})}}};t.exports=function(){this.hasScrollable||(n.bindMethods(o,this),this.hasScrollable=!0)}},function(t,e,i){i(11);const s=i(0),n=i(2);function o(t){const e=r(t.toString()),i=/\./.test(e)?function(t){let e=parseFloat(`0.${t}`);return e=Math.round(100*e),e>9?`${e}`:`0${e}`}(e.split(".")[1]):"00";return`$${function(t,e){const i=[];for(;t.length;)i.unshift(t.substring(t.length-e,t.length)),t=t.substring(0,t.length-e);return i}(e.split(".")[0],3).join(",")}.${i}`}function r(t){const e=t.toString().match(/\d|\./g);return e?e.join(""):""}function l(t,e){return t="&nbsp;"===t?"":t,e.fromHtml(t)}const a={currency:{fromHtml:t=>r(t),toHtml:t=>0===t?"$0.00":t?o(t):"&nbsp;"},percentage:{fromHtml:t=>r(t),toHtml:t=>0===t?"0%":t?r(t)+"%":"&nbsp;"},integer:{fromHtml:t=>t.toString().replace(/\D/g,""),toHtml:t=>t.toString().replace(/\D/g,"")},default:{fromHtml:t=>t,toHtml:t=>t}};t.exports=function(t,e){switch(t.component.type){case"link":return function(t,e){return s("a",{href:e[t.component.url],html:e[t.key]})}(t,e);case"ui-input":return function(t,e){const i=a[t.component.format]||a.default;function o(o){const r=o.parentNode;let a,h=!0;r.style.width||(h=!1,s.style(r,"width",s.box(r).w)),r.removeChild(o);const c=s("ui-input",{type:t.component.subtype||"text",value:l(o.textContent,i)},r);c.onDomReady(()=>{c.input.focus()});const d=()=>{r.appendChild(o),c.destroy(),h||s.style(r,"width","")};c.on("blur",()=>{d()}),c.on("keyup",t=>{a=setTimeout(()=>{"Enter"!==t.key&&"Escape"!==t.key||d()},1)}),c.on("change",s=>{s.stopPropagation(),o.innerHTML=function(t,e){return null==t||""===t?"&nbsp;":e.toHtml(t)}(s.value,i),d(),e[t.key]=i.fromHtml(s.value,i),n.emit(o,"change",{value:e}),clearTimeout(a)})}return s("div",{class:"td-editable",html:i.toHtml(e[t.key])||"&nbsp;",tabindex:"0",onClick(){o(this)},onKeyup(t){"Enter"===t.key&&o(this)}})}(t,e);case"ui-dropdown":return function(t,e){const i=s("ui-dropdown",{data:t.component.options,value:e[t.key]});return i.on("change",s=>{s.stopPropagation(),s&&null!=s.value&&(e[t.key]=s.value,n.emit(i.parentNode,"change",{value:e}))}),i}(t,e);case"ui-checkbox":return function(t,e){const i=s("ui-checkbox",{value:e[t.key]});return i.on("change",s=>{s.stopPropagation(),s&&null!=s.value&&(e[t.key]=s.value,n.emit(i.parentNode,"change",{value:e}))}),i}(t,e);default:return e[t.key]}}},function(t,e){t.exports=s},function(t,e,i){}])}));
//# sourceMappingURL=index.js.map