const fs = require('fs');
const path = require('path');
const pify = require('pify');
const request = require('request');
const progress = require('request-progress');

const CONFIG_FILE = path.join(__dirname, 'config.json');
const DEFAULTS = require('./defaults');

// return options with safe parameters
exports.sanitizeArgs = options => {
    const sanitized = Object.assign({}, options);

    delete sanitized._;

    sanitized.random = (options._.indexOf('random') > -1);
    sanitized.latest = (options._.indexOf('latest') > -1);
    sanitized.image = options.image || '';

    if (typeof options.dir === 'string' && options.dir.indexOf('.') === 0) {
        sanitized.dir = path.join(process.cwd(), options.dir);
    }

    return sanitized;
};

// return promise with config combined with defaults and options
exports.readConfig = options => {
    return pify(fs.readFile)(CONFIG_FILE, 'utf8')
        .then(config => Object.assign({}, DEFAULTS, JSON.parse(config), options))
        .catch(() => Object.assign({}, DEFAULTS, options));
};

// save the configuration to disk
exports.saveConfig = options => {
    const save = {
        width: options.width,
        height: options.height,
        dir: options.dir
    };

    return pify(fs.writeFile)(CONFIG_FILE, JSON.stringify(save, null, 4), 'utf-8');
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

    const param = params.length ? `?${params.join('&')}` : '';

    return `https://unsplash.it/${grayscale}${options.width}/${options.height}/${param}`;
};

// return promise with filename
exports.download = (options, url, reporter) => {
    const dir = (options.dir === '.') ? process.cwd() : options.dir;
    const rand = Math.random().toString(36).slice(2, 10);
    const uniqueName = path.join(dir, `wallpaper-${rand}.jpg`);

    return new Promise((resolve, reject) => {
        progress(request(url), {
            throttle: 30
        })
        .on('progress', state => reporter(state.percent))
        .on('error', reject)
        .pipe(fs.createWriteStream(uniqueName))
        .on('close', () => {
            reporter(100);
            resolve(uniqueName);
        });
    });
};
