const colors = require('./colors');
const figures = require('./figures');
const { compose, print } = require('./compose');

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
