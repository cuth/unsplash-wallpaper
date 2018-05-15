import test from 'ava';
import fs from 'fs';
import os from 'os';
import path from 'path';
import exists from 'path-exists';
import pify from 'pify';
import {
  sanitizeArgs,
  readConfig,
  saveConfig,
  createUrl,
  download
} from '../lib';
import { resolveDir } from '../lib/args';
import * as DEFAULTS from '../lib/defaults';

test('resolveDir 1', t => {
  const dir = './path/to/directory';
  const resolved = path.join(process.cwd(), dir);

  t.same(resolveDir(dir), resolved);
  t.end();
});

test('resolveDir 2', t => {
  const dir = '.';

  t.same(resolveDir(dir), dir);
  t.end();
});

test('resolveDir 3', t => {
  const dir = '~/path/to/directory';
  const resolved = path.join(os.homedir(), '/path/to/directory');

  t.same(resolveDir(dir), resolved);
  t.end();
});

test('sanitizeArgs 1', t => {
  const args = {
    _: ['random'],
    dir: './'
  };
  const sanitized = {
    random: true,
    dir: path.join(process.cwd(), '/')
  };

  t.same(sanitizeArgs(args, () => {}), sanitized);
  t.end();
});

test('sanitizeArgs 2', t => {
  const args = {
    _: ['random'],
    dir: './folder',
    width: 500
  };
  const sanitized = {
    random: true,
    dir: path.join(process.cwd(), '/folder'),
    width: 500
  };

  t.same(sanitizeArgs(args, () => {}), sanitized);
  t.end();
});

test('writeConfig and readConfig', async t => {
  const settings = {
    width: 5678,
    height: 1234,
    dir: '/test/dir'
  };

  const revert = await readConfig({});

  await saveConfig(settings);

  const options = await readConfig({});

  t.same(settings, options);

  return saveConfig(revert);
});

test('createUrl 1', t => {
  const options = {
    random: true
  };

  const value = createUrl(Object.assign({}, DEFAULTS, options));
  const expected = 'https://source.unsplash.com/random';

  t.is(value, expected);
  t.end();
});

test('createUrl 2', t => {
  const options = {
    user: 'erondu',
    width: 1600,
    height: 900
  };

  const value = createUrl(Object.assign({}, DEFAULTS, options));
  const expected = 'https://source.unsplash.com/user/erondu/1600x900';

  t.is(value, expected);
  t.end();
});

test('createUrl 3', t => {
  const options = {
    likes: 'jackie',
    width: 1600,
    height: 900
  };

  const value = createUrl(Object.assign({}, DEFAULTS, options));
  const expected = 'https://source.unsplash.com/user/jackie/likes/1600x900';

  t.is(value, expected);
  t.end();
});

test('createUrl 4', t => {
  const options = {
    collection: '190727',
    width: 1600,
    height: 900
  };

  const value = createUrl(Object.assign({}, DEFAULTS, options));
  const expected = 'https://source.unsplash.com/collection/190727/1600x900';

  t.is(value, expected);
  t.end();
});

test('createUrl 5', t => {
  const options = {
    daily: true
  };

  const value = createUrl(Object.assign({}, DEFAULTS, options));
  const expected = 'https://source.unsplash.com/daily';

  t.is(value, expected);
  t.end();
});

test('createUrl 6', t => {
  const options = {
    category: 'nature',
    weekly: true
  };

  const value = createUrl(Object.assign({}, DEFAULTS, options));
  const expected = 'https://source.unsplash.com/category/nature/weekly';

  t.is(value, expected);
  t.end();
});

test('createUrl 7', t => {
  const options = {
    user: 'erondu',
    daily: true
  };

  const value = createUrl(Object.assign({}, DEFAULTS, options));
  const expected = 'https://source.unsplash.com/user/erondu/daily';

  t.is(value, expected);
  t.end();
});

test('createUrl 8', t => {
  const options = {
    weekly: true,
    search: 'water'
  };

  const value = createUrl(Object.assign({}, DEFAULTS, options));
  const expected = 'https://source.unsplash.com/weekly/?water';

  t.is(value, expected);
  t.end();
});

test('createUrl 9', t => {
  const options = {
    width: 1600,
    height: 900,
    search: 'nature,water'
  };

  const value = createUrl(Object.assign({}, DEFAULTS, options));
  const expected = 'https://source.unsplash.com/1600x900/?nature,water';

  t.is(value, expected);
  t.end();
});

test('createUrl 10', t => {
  const options = {
    photo: 'WLUHO9A_xik',
    width: 1600,
    height: 900
  };

  const value = createUrl(Object.assign({}, DEFAULTS, options));
  const expected = 'https://source.unsplash.com/WLUHO9A_xik/1600x900';

  t.is(value, expected);
  t.end();
});

test('download expected filename', async t => {
  const options = {
    dir: __dirname
  };
  const url = 'https://source.unsplash.com/WLUHO9A_xik/1600x900';
  const expectedFilename = `${__dirname}${path.sep}wallpaper-c86b8baa.jpg`;

  const file = await download(options, url);
  t.is(file, expectedFilename);

  return pify(fs.unlink)(file);
});

test('download', async t => {
  const options = {
    dir: __dirname
  };
  const url = 'https://source.unsplash.com/random';

  const file = await download(options, url);
  const doesExist = await exists(file);

  t.ok(doesExist);

  return pify(fs.unlink)(file);
});

test('download not an image', async t => {
  const options = {
    dir: __dirname
  };
  const url = 'https://source.unsplash.com/';

  return download(options, url).catch(err => {
    t.is(err.message, 'The response was not an image.');
  });
});

test('download error', async t => {
  const options = {
    dir: __dirname
  };
  const url = 'https://source.unsplash.com/WLUHO9A_xiki/1600x900';

  return download(options, url).catch(err => {
    t.is(
      err.message,
      "The response is the image: we couldn't find that photo."
    );
  });
});
