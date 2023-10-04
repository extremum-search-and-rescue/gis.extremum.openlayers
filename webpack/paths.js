'use strict';

const path = require('path');

function resolveApp(relativePath) {
    return path.resolve(__dirname, '..', relativePath);
}

module.exports = {
    appBuild: resolveApp('build'),
    appIndexJs: resolveApp('src/index.js'),
    appIndexHtml: resolveApp('src/index.html'),
    appStrelkiJs: resolveApp('src/strelki.js'),
    appStrelkiHtml: resolveApp('src/strelki.html'), //for debugging pursposes
    appAssets: resolveApp('assets'),
    appSrc: resolveApp('src'),
};
