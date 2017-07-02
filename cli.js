#! /usr/bin/env node

const wallpaper = require('wallpaper');
const minimist = require('minimist');
const lib = require('./lib');
const { boolOptions, minimistAliases, triggerDownload } = require('./lib/args');
const { log, warn, inform, fail, success } = require('./lib/log');
const help = require('./lib/help');
const reporter = require('./lib/progress-reporter');
const version = require('./package.json').version;

const argv = minimist(process.argv.slice(2), {
  boolean: boolOptions,
  alias: minimistAliases
});

// --help
if (argv.help) {
  log(help);
}

// --version
if (argv.version) {
  log(`version ${version}`);
}

const args = lib.sanitizeArgs(argv, warn);
const shouldSave = args['save-config'];
const shouldDownload = triggerDownload.some(trigger => args[trigger]);

if (shouldSave || shouldDownload) {
  const promise = lib.readConfig(args);

  if (shouldSave) {
    promise
      .then(opts => lib.saveConfig(opts))
      .then(config => {
        success(`Saved config as:`);
        inform(config);
      })
      .catch(fail);
  }

  if (shouldDownload) {
    promise.then(opts => {
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
    });
  }
}
