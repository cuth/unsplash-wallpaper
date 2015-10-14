import test from 'ava';
import * as lib from '../lib';
import path from 'path';

test('sanitizeArgs 1', t => {

    const args = {
        _: ['random'],
        dir: '.'
    };
    const sanitized = {
        random: true,
        latest: false,
        dir: process.cwd(),
        image: ''
    };

    t.same(lib.sanitizeArgs(args), sanitized);
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

    t.same(lib.sanitizeArgs(args), sanitized);
    t.end();
});

test('writeConfig and readConfig', t => {

    const settings = {
        width: 5678,
        height: 1234,
        dir: '/test/dir'
    }

    let revert;

    return lib.readConfig({})
        .then(options => {
            revert = options;
            return lib.saveConfig(settings);
        })
        .then(() => {
            return lib.readConfig({});
        })
        .then(options => {
            t.same(settings, options);
            return lib.saveConfig(revert);
        });
});

test('createUrl', t => {

})
