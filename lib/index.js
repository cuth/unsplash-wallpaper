const fs = require('fs');
const path = require('path');
const pify = require('pify');
const request = require('request');
const progress = require('request-progress');

const CONFIG_FILE = 'config.json';
const DEFAULTS = {
    width: 2880,
    height: 1800,
    dir: '.'
}

// return options with safe parameters
exports.sanitize = options => {

    const sanitized = Object.assign({}, options);

    delete sanitized._;

    sanitized.random = (options._.indexOf('random') > -1);
    sanitized.latest = (options._.indexOf('latest') > -1);
    sanitized.image = options.image || '';

    if (sanitized.dir === 'string' && sanitized.dir.indexOf('.') === 0) {
        options.dir = path.join(process.cwd(), argv.dir);
    }

    return sanitized;
};

// return promise with config combined with defaults and options
exports.readConfig = options => {
    return pify(fs.readFile)('package.json', 'utf8')
        .then(config => Object.assign({}, DEFAULTS, JSON.parse(config), options));
};

// save the configuration to disk
exports.saveConfig = options => {
    if (!options['save-config']) return;

    const save = {
        width: options.width,
        height: options.height,
        dir: options.dir
    };

    fs.writeFileSync(path.join(__dirname, CONFIG_FILE), new Buffer(JSON.stringify(save, null, 4)), 'utf-8');
};

// return a URL string based on options
exports.createUrl = options => {

    // --grayscale
    const grayscale = options.grayscale ? 'g/' : '';

    const params = [];

    // --image #
    if (typeof options.image === 'number' || typeof options.image === 'string') {
        params.push(`image=${options.image}`);
    }

    // --gravity north, east, south, west, center
    if (typeof options.gravity === 'string') {
        params.push(`gravity=${options.gravity}`);
    }

    // random
    if (options.random) {
        params.push('random');
    }

    // --blur
    if (options.blur) {
        params.push('blur');
    }

    const param = params.length ? '?' + params.join('&') : '';

    return `https://unsplash.it/${grayscale}${options.width}/${options.height}/${param}`;
};

// return promise with filename
exports.download = (options, url) => {

    const dir = (options.dir === '.') ? process.cwd() : options.dir;
    const rand = Math.random().toString(36).slice(2, 10);
    const uniqueName = path.join(dir, `wallpaper-${rand}.jpg`);


    return new Promise((resolve, reject) => {

        progress(request(url), {
            throttle: 30
        })
        .on('progress', function (state) {
            process.stdout.write('Downloading [' + progressBar(state.percent, 40) + ']\033[0G');
        })
        .on('error', function (err) {
            console.log('An error has occured while downloading.', err);
            reject(err);
        })
        .pipe(fs.createWriteStream(uniqueName))
        .on('error', function (err) {
            console.log('\nAn error has occured while streaming.', err);
            reject(err);
        })
        .on('close', function () {

            console.log('Downloading [' + progressBar(100, 40) + ']');
            console.log('Image saved to ', uniqueName);

            resolve(uniqueName);
        });
    });
};

function progressBar(percent, length) {
    var barCount = (percent / 100) * length;
    var bar = '';
    for (var x = 0; x < length; x += 1) {
        bar += (x <= barCount) ? '=' : ' ';
    }
    return bar;
}
