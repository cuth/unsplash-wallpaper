exports.filter = fn => arr => Array.prototype.filter.call(arr, fn);
exports.map = fn => arr => Array.prototype.map.call(arr, fn);
exports.reduce = (fn, acc) => arr => Array.prototype.reduce.call(arr, fn, acc);
exports.some = fn => arr => Array.prototype.some.call(arr, fn);
exports.every = fn => arr => Array.prototype.every.call(arr, fn);
exports.find = fn => arr => Array.prototype.find.call(arr, fn);

exports.compose = (...fns) => data =>
  exports.reduce((acc, fn) => fn(acc), data)(fns);
exports.mergeObjects = arr =>
  arr.length === 0 ? {} : Object.assign({}, ...arr);

exports.print = data => {
  console.log(data);
  return data;
};
