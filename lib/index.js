const fs = require('fs');
const os = require('os');
const path = require('path');
const pify = require('pify');
const request = require('request');
const progress = require('request-progress');

const CONFIG_FILE = path.join(__dirname, 'config.json');
const DEFAULTS = require('./defaults');

// resolve special characters in the dir path
exports.resolveDir = dir => {
    if (dir.startsWith('.') && dir.length > 1) {
        return path.join(process.cwd(), dir);
    }
    if (dir.startsWith('~')) {
        return path.join(os.homedir(), dir.substr(1));
    }
    return dir;
};

// return options with safe parameters
exports.sanitizeArgs = options => {
    const flags = {};
    flags[options._[0]] = true;
    const sanitized = Object.assign({}, flags, options);
    delete sanitized._;
    if (typeof sanitized.dir === 'string') {
        sanitized.dir = exports.resolveDir(sanitized.dir);
    }
    if (typeof sanitized.search === 'string') {
        sanitized.search = sanitized.search.replace(/\s/g, ',');
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
exports.saveConfig = opts => {
    const save = {
        width: (typeof opts.width === 'number') ? opts.width : undefined,
        height: (typeof opts.height === 'number') ? opts.height : undefined,
        dir: opts.dir
    };

    return pify(fs.writeFile)(CONFIG_FILE, JSON.stringify(save, null, 4), 'utf-8');
};

// return a URL string based on options
exports.createUrl = opts => {
    const pieces = [
        opts.photo && `/${opts.photo}`,
        opts.category && `/category/${opts.category}`,
        (opts.user || opts.likes) && `/user/${opts.user || opts.likes}`,
        opts.likes && '/likes',
        opts.collection && `/collection/${opts.collection}`,
        opts.random && '/random',
        opts.featured && '/featured',
        opts.width && opts.height && `/${opts.width}x${opts.height}`,
        opts.daily && '/daily',
        opts.weekly && '/weekly',
        opts.search && `/?${opts.search}`
    ];

    return `https://source.unsplash.com${pieces.join('')}`;
};

// return promise with filename
exports.download = (options, url, reporter) => {
    const dir = (options.dir === '.') ? process.cwd() : options.dir;
    const rand = Math.random().toString(36).slice(2, 10);
    const uniqueName = path.join(dir, `wallpaper-${rand}.jpg`);

    return new Promise((resolve, reject) => {
        request.head(url, (err, res, body) => {
            if (err) {
                reject(err);
                return;
            }
            if (res.headers['content-type'].indexOf('image') === -1) {
                reject({
                    message: 'The response was not an image.'
                });
                return;
            }
            progress(request(url), {
                throttle: 30
            })
            .on('progress', state => {
                reporter(state.percent);
            })
            .on('error', reject)
            .pipe(fs.createWriteStream(uniqueName))
            .on('close', () => {
                reporter(100);
                resolve(uniqueName);
            });
        });
    });
};
