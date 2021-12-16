const files = require('@clubajax/node-file-managment');
files.copyFile('./build/index.js', '../../janiking-international/jk-gink/node_modules/@clubajax/data-table/index.js');
files.copyFile('./build/index.js.map', '../../janiking-international/jk-gink/node_modules/@clubajax/data-table/index.js.map');
files.copyFile('./build/data-table.css', '../../janiking-international/jk-gink/node_modules/@clubajax/data-table/data-table.css');
files.copyFile('./build/data-table.css.map', '../../janiking-international/jk-gink/node_modules/@clubajax/data-table/data-table.css.map');
console.log('files copied to JK Gink');

// /Users/mwilcox/Sites/clubajax/data-table/package.json
// /Users/mwilcox/Sites/janiking-international/jk-gink/package.json