#! /usr/bin/env node

const wallpaper = require('wallpaper');
const minimist = require('minimist');
const lib = require('./lib');
const { boolOptions, minimistAliases, triggerDownload } = require('./lib/args');
const { log, warn, inform, fail, success } = require('./lib/log');
const help = require('./lib/help');
const { cyan } = require('./lib/colors');
const reporter = require('./lib/progress-reporter');
const version = require('./package.json').version;
const schema = require('./lib/schema');

const argv = minimist(process.argv.slice(2), {
  boolean: boolOptions,
  alias: minimistAliases
});

// --help
if (argv.help) {
  log(help);
  return;
}

// --version
if (argv.version) {
  log(`version ${version}`);
  return;
}

const args = lib.sanitizeArgs(argv, warn);
const shouldSave = args['save-config'];
const shouldDownload = triggerDownload.some(trigger => args[trigger]);

if (shouldSave || shouldDownload) {
  const opts = lib.readConfig(args);

  if (shouldSave) {
    const save = Object.keys(schema.options.properties).reduce(
      (acc, key) => (opts[key] ? { ...acc, [key]: opts[key] } : acc),
      {}
    );
    lib.saveConfig(save);
    success(`Saved config as:`);
    inform(JSON.stringify(save, null, 2));
  }

  if (shouldDownload) {
    const url = lib.createUrl(opts);

    inform(`Request ${url}`);

    return lib
      .download(opts, url, reporter)
      .then(filename => {
        success(`Image saved to ${filename}`);
        return wallpaper.set(filename);
      })
      .then(() => log('Check it out.'))
      .catch(err => {
        fail(err);
        if (args.collection && args.collection < 10000) {
          inform('Curated collections are not yet supported.');
        }
        if (args.category) {
          inform(
            'Try one of these categories: nature, people, food, buildings, objects, or technology.'
          );
        }
      });
  }
} else {
  log(`
To learn the commands:
  ${cyan('$ unsplash-wallpaper --help')}
To save the image resolution:
  ${cyan('$ unsplash-wallpaper --width 2880 --height 1800 -s')}
To download and use a random image:
  ${cyan('$ unsplash-wallpaper -r')}
`);
}
