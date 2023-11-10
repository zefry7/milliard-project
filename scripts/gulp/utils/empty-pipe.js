const through = require('through');

let empty = () => through(function onData(data) {
  this.emit('data', data);
}, function onEnd() {
  this.emit('end');
});

module.exports = empty;
