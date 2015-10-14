#! /usr/bin/env node

const lib = require('./lib');
const wallpaper = require('wallpaper');
const argv = require('minimist')(process.argv.slice(2), {
    boolean: ['help', 'save-config', 'grayscale', 'blur', 'version'],
    alias: {
        w: 'width',
        h: 'height',
        d: 'dir',
        s: 'save-config',
        i: 'image',
        x: 'gravity',
        g: 'grayscale',
        b: 'blur',
        v: 'version'
    }
});

// --help
if (argv.help) {
    console.log(require('./lib/help'));
    return;
}

// --version
if (argv.version) {
    console.log('version', require('./package.json').version);
    return;
}

const options = lib.sanitizeArgs(argv);
const shouldSave = options['save-config'];
const shouldDownload = (options.latest || options.random || !!options.image);

if (shouldSave || shouldDownload) {

    const promise = lib.readConfig(options);

    if (shouldSave) {
        promise.then(opts => lib.saveConfig(opts));
    }

    if (shouldDownload) {
        promise.then(opts => {
            const url = lib.createUrl(opts);

            console.log('request ', url);

            return lib.download(opts, url).then(filename => wallpaper.set(filename)).then(() => {
                console.log('Check it out.');
            });
        });
    }

    promise.catch(err => {
        console.log(err);
    });

} else {
    console.log(require('./lib/help'));
}
