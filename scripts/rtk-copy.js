const files = require('@clubajax/node-file-managment');
files.copyFile('./build/index.js', '../../redtigerkarate/admin/third-party/data-table/index.js');
files.copyFile('./build/index.js.map', '../../redtigerkarate/admin/third-party/data-table/index.js.map');
files.copyFile('./build/data-table.css', '../../redtigerkarate/admin/third-party/data-table/data-table.css');
files.copyFile('./build/data-table.css.map', '../../redtigerkarate/admin/third-party/data-table/data-table.css.map');
files.copyFile('./build/README.md', '../../redtigerkarate/admin/third-party/data-table/README.md');
console.log('files copied to RTK');