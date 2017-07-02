const os = require('os');
const path = require('path');

const stringType = arg => typeof arg === 'string';
const numberType = arg => typeof arg === 'number';
const boolType = arg => typeof arg === 'boolean';
const boolOrNumber = arg => boolType(arg) || numberType(arg);
const stringOrNumber = arg => stringType(arg) || numberType(arg);
const trimAtSign = arg => (stringType(arg) ? arg.replace(/@/g, '') : arg);

// resolve special characters in the dir path
const resolveDir = dir => {
  if (dir.startsWith('.') && dir.length > 1) {
    return path.join(process.cwd(), dir);
  }
  if (dir.startsWith('~')) {
    return path.join(os.homedir(), dir.substr(1));
  }
  return dir;
};

const options = {
  width: {
    alias: 'w',
    test: boolOrNumber,
    error: 'must be a number (ex: 1920)'
  },
  height: {
    alias: 'h',
    test: boolOrNumber,
    error: 'must be a number (ex: 1200)'
  },
  dir: {
    alias: 'd',
    test: stringType,
    error: 'must be a valid directory path',
    transform: resolveDir
  },
  'save-config': {
    alias: 's',
    bool: true
  },
  photo: {
    alias: 'p',
    test: stringType,
    error:
      'must be a string. If the photo id begins with a hyphen, try wrapping it in quotes.\n\nexample:\n$ unsplash-wallpaper --photo="-oWyJoSqBRM"\n',
    triggerDownload: true
  },
  category: {
    alias: 'c',
    test: stringType,
    error: 'must be a string',
    triggerDownload: true
  },
  user: {
    alias: 'u',
    test: stringType,
    error: 'must be a string',
    transform: trimAtSign,
    triggerDownload: true
  },
  likes: {
    alias: 'l',
    test: (arg, args) =>
      stringType(args.user) ? boolType(arg) : stringType(arg),
    error: 'must be a string or left blank when user contains a string',
    transform: trimAtSign,
    triggerDownload: true
  },
  collection: {
    alias: 'o',
    test: numberType,
    error: 'must be a number',
    triggerDownload: true
  },
  search: {
    alias: 'q',
    test: stringOrNumber,
    error: 'must be a string or number',
    transform: encodeURIComponent,
    triggerDownload: true
  },
  version: {
    alias: 'v',
    bool: true
  },
  help: {
    bool: true
  }
};
const commands = ['random', 'daily', 'weekly', 'featured'];

const objToArr = obj => Reflect.ownKeys(obj).map(k => [k, obj[k]]);
const optionsArr = objToArr(options);
const aliases = optionsArr
  .map(([key, obj]) => obj.alias)
  .filter(alias => alias);
const boolOptions = optionsArr
  .filter(([key, obj]) => obj.bool)
  .map(([key]) => key);
const minimistAliases = optionsArr.reduce((acc, [key, obj]) => {
  if (obj.alias) {
    acc[obj.alias] = key;
  }
  return acc;
}, {});
const triggerDownload = optionsArr
  .filter(([key, obj]) => obj.triggerDownload)
  .map(([key]) => key)
  .concat(commands);

module.exports = {
  resolveDir,
  options,
  commands,
  aliases,
  boolOptions,
  minimistAliases,
  triggerDownload
};
