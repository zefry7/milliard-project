module.exports = unique;

function unique() {
  let val = 0;
  return function (reset) {
    if (reset) val = 0;
    else return "_u" + (++val);
  }
}
