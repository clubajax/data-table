const files = require('@clubajax/node-file-managment');

function updateVersion() {
    const buildPackage = files.readJson('./scripts/package.json');
    const mainPackage = files.readJson('./package.json');
    
        if (mainPackage.version !== buildPackage.version) {
            // has been manually updated
        } else {
            // increment main version
            const version = mainPackage.version.split('.');
            version[2] = parseInt(version[2], 10) + 1;
            mainPackage.version = version.join('.');
            console.log('package.version changed to:', mainPackage.version);
        }
    buildPackage.version = mainPackage.version;
    if (mainPackage.dependencies) {
        // copy over updated dependencies
        buildPackage.dependencies = mainPackage.dependencies;
    }

    files.writeJson('./scripts/package.json', buildPackage);
    files.writeJson('./package.json', mainPackage);
    files.copyFile('./scripts/package.json', './build/package.json');
    console.log('package.version:', mainPackage.version);
}

updateVersion();