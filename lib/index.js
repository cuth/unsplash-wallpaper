const fs = require('fs');
const path = require('path');
const pify = require('pify');
const request = require('request');
const progress = require('request-progress');
const { options, aliases } = require('./args');

const CONFIG_FILE = path.join(__dirname, 'config.json');
const DEFAULTS = require('./defaults');

// return options with safe parameters
exports.sanitizeArgs = (args, reporter) => {
  const commands = args._.reduce((acc, arg) => {
    acc[arg] = true;
    return acc;
  }, {});
  const opts = Object.assign({}, commands, args);
  return Reflect.ownKeys(opts).reduce((acc, key) => {
    const option = options[key];
    if (option) {
      if (!option.test || option.test(opts[key], opts)) {
        acc[key] = option.transform ? option.transform(opts[key]) : opts[key];
      } else {
        reporter(`${key} ${options[key].error}`);
      }
    } else if (aliases.concat(['_']).indexOf(key) === -1) {
      reporter(`"${key}" is not a valid option`);
    }
    return acc;
  }, {});
};

// return promise with config combined with defaults and options
exports.readConfig = opts => {
  return pify(fs.readFile)(CONFIG_FILE, 'utf8')
    .then(config => Object.assign({}, DEFAULTS, JSON.parse(config), opts))
    .catch(() => Object.assign({}, DEFAULTS, opts));
};

// save the configuration to disk
exports.saveConfig = opts => {
  const save = JSON.stringify(
    {
      width: typeof opts.width === 'number' ? opts.width : undefined,
      height: typeof opts.height === 'number' ? opts.height : undefined,
      dir: opts.dir
    },
    null,
    2
  );

  return pify(fs.writeFile)(CONFIG_FILE, save, 'utf-8').then(() => save);
};

// return a URL string based on options
const onlyStrings = s => typeof s === 'string';
exports.createUrl = opts => {
  const pieces = [
    opts.photo && `/${opts.photo}`,
    opts.category && `/category/${opts.category}`,
    (opts.user || opts.likes) && `/user/${opts.user || opts.likes}`,
    opts.likes && '/likes',
    opts.collection &&
      `/collection/${opts.collection < 10000
        ? 'curated/'
        : ''}${opts.collection}`,
    opts.featured && '/featured',
    opts.width && opts.height && `/${opts.width}x${opts.height}`,
    opts.daily && '/daily',
    opts.weekly && '/weekly'
  ]
    .filter(onlyStrings)
    .join('');
  const search = [
    !pieces && (opts.random || opts.search) && '/random',
    opts.search && `/?${opts.search}`
  ]
    .filter(onlyStrings)
    .join('');

  return `https://source.unsplash.com${pieces}${search}`;
};

// return promise with filename
exports.download = (opts, url, reporter) => {
  const dir = opts.dir === '.' ? process.cwd() : opts.dir;
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
      if (res.request.uri.pathname.indexOf('photo-1446704477871-62a4972035cd') >= 0) {
        reject({
          message: 'The response is the image: we couldn\'t find that photo.'
        });
        return;
      }
      progress(request(url), {
        throttle: 30
      })
        .on('progress', state => {
          reporter(state.percent);
        })
        .pipe(fs.createWriteStream(uniqueName))
        .on('error', reject)
        .on('close', () => {
          reporter(100);
          resolve(uniqueName);
        });
    });
  });
};
