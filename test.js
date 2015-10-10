'use strict';

var test = require('ava');

test('foo', function (t) {
    t.pass();
    t.end();
});

test('bar', function (t) {
    t.plan(2);

    setTimeout(function () {
        t.is('bar', 'bar');
        t.same(['a', 'b'], ['a', 'b']);
    }, 100);
});
