#! /usr/bin/env node

const lib = require('./lib');
const wallpaper = require('wallpaper');
const help = require('./lib/help');
const version = require('./package.json').version;
const reporter = require('./lib/progress-reporter');
const argv = require('minimist')(process.argv.slice(2), {
    boolean: ['help', 'save-config', 'version'],
    alias: {
        w: 'width',
        h: 'height',
        d: 'dir',
        s: 'save-config',
        p: 'photo',
        c: 'category',
        u: 'user',
        l: 'likes',
        o: 'collection',
        q: 'search',
        v: 'version'
    }
});

// --help
if (argv.help) {
    console.log(help);
}

// --version
if (argv.version) {
    console.log('version', version);
}

const options = lib.sanitizeArgs(argv);
const shouldSave = options['save-config'];
const shouldDownload = [
    'photo',
    'category',
    'user',
    'likes',
    'collection',
    'search',
    'random',
    'daily',
    'weekly',
    'featured'
].some(option => options[option] !== undefined);

if (shouldSave || shouldDownload) {
    const promise = lib.readConfig(options);

    if (shouldSave) {
        promise.then(opts => lib.saveConfig(opts))
            .catch(console.log);
    }

    if (shouldDownload) {
        promise.then(opts => {
            const url = lib.createUrl(opts);

            console.log('Request', url);

            return lib.download(opts, url, reporter)
                .then(filename => {
                    console.log('Image saved to', filename);
                    return wallpaper.set(filename);
                })
                .then(() => {
                    console.log('Check it out.');
                })
                .catch(error => {
                    if (error && error.message) {
                        console.log(error.message);
                    }
                });
        });
    }
} else {
    console.log(help);
}
