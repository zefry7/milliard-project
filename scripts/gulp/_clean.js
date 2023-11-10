const del = require('del');

module.exports = function clean() {
  let list = ['.tmp', 'release'];
  if (!require('./config').isServe) {
    list.push('dist');
  }
  return del(list);
};
