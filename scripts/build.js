'use strict'
const execSync = require('child_process').execSync;
const errorExitStatus = 1;

async function main()
{
    process.env.NODE_ENV = 'production';
    try {
        execSync('webpack --config webpack/webpack.config.js  --color --progress=profile', {
            stdio: 'inherit',
        });
    } catch (e) {
        process.exit(errorExitStatus);
    }
}

main();