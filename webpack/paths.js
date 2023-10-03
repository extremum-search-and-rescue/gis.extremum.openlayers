'use strict';

const path = require('path');

function resolveApp(relativePath) {
    return path.resolve(__dirname, '..', relativePath);
}

module.exports = {
    appBuild: resolveApp('build'),
    appIndexJs: resolveApp('src/index.js'),
    appStrelkiJs: resolveApp('src/strelki.js'),
    appIndexHtml: resolveApp('src/index.html'),
    appAssets: resolveApp('assets'),
    appSrc: resolveApp('src'),
};
