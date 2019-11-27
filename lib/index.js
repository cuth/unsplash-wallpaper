const fs = require('fs');
const path = require('path');
const pify = require('pify');
const request = require('request');
const progress = require('request-progress');
const Conf = require('conf');
const schema = require('./schema');
const { options, aliases } = require('./args');

const config = new Conf({ schema, projectName: 'unsplash-wallpaper' });

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
exports.readConfig = opts => Object.assign({}, config.get('options'), opts);

// save the configuration to disk
exports.saveConfig = opts => config.set('options', opts);

// return a URL string based on options
const onlyStrings = s => typeof s === 'string';
exports.createUrl = opts => {
  const pieces = [
    opts.photo && `/${opts.photo}`,
    opts.category && `/category/${opts.category}`,
    (opts.user || opts.likes) && `/user/${opts.user || opts.likes}`,
    opts.likes && '/likes',
    opts.collection &&
      `/collection/${opts.collection < 10000 ? 'curated/' : ''}${
        opts.collection
      }`,
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
exports.download = (opts, url, reporter = () => {}) => {
  const dir = opts.dir === '.' ? process.cwd() : opts.dir;

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
      const filename = path.basename(res.request.uri.pathname);
      const uniqueName = path.join(dir, `wallpaper-${filename}.jpg`);
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
