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
  random: {
    alias: 'r',
    bool: true,
    triggerDownload: true,
    desc: ['Get a random image.', ' --random']
  },
  daily: {
    alias: 'a',
    bool: true,
    triggerDownload: true,
    desc: ['Get a fixed daily image.', ' --user erondu --daily']
  },
  weekly: {
    alias: 'e',
    bool: true,
    triggerDownload: true,
    desc: ['Get a fixed weekly image.', ' --search water --weekly']
  },
  featured: {
    alias: 'f',
    bool: true,
    triggerDownload: true,
    desc: [
      'Limit the results to the curated collections.',
      ' -f --search montreal'
    ]
  },
  width: {
    alias: 'w',
    test: boolOrNumber,
    param: 'Number',
    error: 'must be a number (ex: 1920)',
    desc: ['Set the width of desired image.', ' --width 2880 --save-config']
  },
  height: {
    alias: 'h',
    test: boolOrNumber,
    param: 'Number',
    error: 'must be a number (ex: 1200)',
    desc: [
      'Set the height of desired image.',
      ' --width 2880 --height 1800 --save-config'
    ]
  },
  dir: {
    alias: 'd',
    test: stringType,
    param: 'String',
    error: 'must be a valid directory path',
    transform: resolveDir,
    desc: [
      'Download the image to a specific directory.',
      '"." uses the current working directory.',
      '"./" stores the current working directory even when it changes.',
      ' --dir "/Users/Shared',
      ' --dir "C:UsersPublic',
      ' -d .'
    ]
  },
  'save-config': {
    alias: 's',
    bool: true,
    desc: [
      'Saves any width, height or dir value in a config file.',
      ' -s --width 1600 --height 1200',
      'Leave the values blank to reset width and height:',
      ' -whs'
    ]
  },
  photo: {
    alias: 'p',
    test: stringType,
    param: 'PHOTO ID',
    error:
      'must be a string. If the photo id begins with a hyphen, try wrapping it in quotes.\n\nexample:\n$ unsplash-wallpaper --photo="-oWyJoSqBRM"\n',
    triggerDownload: true,
    desc: [
      'Get a specific image by the photo ID.',
      ' -p WLUHO9A_xik',
      ' --photo="-oWyJoSqBRM"'
    ]
  },
  category: {
    alias: 'c',
    test: stringType,
    param: 'CATEGORY NAME',
    error: 'must be a string',
    triggerDownload: true,
    desc: ['Get a photo in a category.', ' --category nature']
  },
  user: {
    alias: 'u',
    test: stringType,
    param: 'USERNAME',
    error: 'must be a string',
    transform: trimAtSign,
    triggerDownload: true,
    desc: ['Get a photo from a specific user.', ' -u erondu']
  },
  likes: {
    alias: 'l',
    test: (arg, args) =>
      stringType(args.user) ? boolType(arg) : stringType(arg),
    param: 'USERNAME',
    error: 'must be a string or left blank when user contains a string',
    transform: trimAtSign,
    triggerDownload: true,
    desc: ['Get a photo liked by a user.', ' --likes jackie']
  },
  collection: {
    alias: 'o',
    test: numberType,
    param: 'COLLECTION ID',
    error: 'must be a number',
    triggerDownload: true,
    desc: [
      'Get a photo apart of a specific collection.',
      ' --collection 190727'
    ]
  },
  search: {
    alias: 'q',
    test: stringOrNumber,
    param: ['KEYWORD', 'KEYWORD'],
    error: 'must be a string or number',
    transform: encodeURIComponent,
    triggerDownload: true,
    desc: [
      'Get a photo from a search query.',
      ' -q nature,water',
      ' -q="water falls"'
    ]
  },
  version: {
    alias: 'v',
    bool: true
  },
  help: {
    bool: true
  }
};

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
  .map(([key]) => key);

module.exports = {
  resolveDir,
  options,
  optionsArr,
  aliases,
  boolOptions,
  minimistAliases,
  triggerDownload
};
