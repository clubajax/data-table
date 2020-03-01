const files = require('@clubajax/node-file-managment');

files.updateBuildPackage();
files.copyFile('./README.md', './build/README.md');
