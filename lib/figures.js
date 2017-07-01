const main = {
  tick: '✔︎',
  cross: '✗'
};

const win = {
  tick: '√',
  cross: '×'
};

module.exports = process.platform === 'win32' ? win : main;
