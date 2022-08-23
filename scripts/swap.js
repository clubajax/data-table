const fs = require('fs');
const files = require('@clubajax/node-file-managment');

// TODO: abort if not JK

files.swapJK('README.md');

const index = files.getFile('./build/index.js').replace(/clubajax\/form/g, 'janiking/form');
fs.writeFileSync('./build/index.js', index);

const pkg = files.readJson('./build/package.json');
delete pkg.dependencies;
files.writeJson('./build/package.json', pkg);
