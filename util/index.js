'use strict';

module.exports.once = function once(fn) {
  let called = false;
  return function (err) {
    if (called) {
      return undefined;
    }
    called = true;
    return fn(err);
  };
};