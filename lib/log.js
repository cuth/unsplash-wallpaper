const colors = require('./colors');

const reduce = (fn, acc) => arr => Array.prototype.reduce.call(arr, fn, acc);
const compose = (...fns) => data => reduce((acc, fn) => fn(acc), data)(fns);
const print = data => {
  console.log(data);
  return data;
};

const figures =
  process.platform === 'win32'
    ? {
        tick: '√',
        cross: '×'
      }
    : {
        tick: '✔︎',
        cross: '✗'
      };

const colorize = color => data => colors[color](data);
const figurize = figure => data => `${figures[figure]} ${data}`;
const convertError = data =>
  typeof data === 'object' && typeof data.message === 'string'
    ? data.message
    : data;

exports.log = compose(convertError, print);
exports.warn = compose(
  convertError,
  figurize('cross'),
  colorize('magenta'),
  print
);
exports.inform = compose(colorize('yellow'), print);
exports.fail = compose(convertError, figurize('cross'), colorize('red'), print);
exports.success = compose(figurize('tick'), colorize('green'), print);
