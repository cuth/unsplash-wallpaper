import test from 'ava';
import {
    resolveDir,
    sanitizeArgs,
    readConfig,
    saveConfig,
    createUrl,
    download
} from '../lib';
import fs from 'fs';
import os from 'os';
import path from 'path';
import exists from 'path-exists';
import pify from 'pify';
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
        latest: false,
        dir: path.join(process.cwd(), '/')
    };

    t.same(sanitizeArgs(args), sanitized);
    t.end();
});

test('sanitizeArgs 2', t => {
    const args = {
        _: ['latest'],
        dir: './folder',
        image: 500
    };
    const sanitized = {
        random: false,
        latest: true,
        dir: path.join(process.cwd(), '/folder'),
        image: 500
    };

    t.same(sanitizeArgs(args), sanitized);
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
        grayscale: true,
        random: true,
        latest: false,
        gravity: 'east'
    };

    const value = createUrl(Object.assign({}, DEFAULTS, options));
    const expected = 'https://unsplash.it/g/2880/1800/?gravity=east&random';

    t.is(value, expected);
    t.end();
});

test('createUrl 2', t => {
    const options = {
        grayscale: false,
        random: false,
        latest: true,
        image: 150,
        blur: true
    };

    const value = createUrl(Object.assign({}, DEFAULTS, options));
    const expected = 'https://unsplash.it/2880/1800/?image=150&blur';

    t.is(value, expected);
    t.end();
});

test('createUrl 3', t => {
    const options = {};

    const value = createUrl(Object.assign({}, DEFAULTS, options));
    const expected = 'https://unsplash.it/2880/1800/';

    t.is(value, expected);
    t.end();
});

test('download', async t => {
    const options = {
        dir: __dirname
    };
    const url = 'https://unsplash.it/2880/1800/';
    const stateStack = [];

    const file = await download(options, url, state => stateStack.push(state));
    const doesExist = await exists(file);

    t.ok(doesExist);

    return pify(fs.unlink)(file);
});
