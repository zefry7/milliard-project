const types     = require('node-sass').types;

function getValue(p) {
  let _props;
  switch (true) {
    case p instanceof types.Map:
      _props = {};
      for (let i = 0, len = p.getLength(); i < len; i++) {
        _props[p.getKey(i).getValue()] = getValue(p.getValue(i));
      }
      return _props;
    case p instanceof types.List:
      _props = [];
      for (let i = 0, len = p.getLength(); i < len; i++) {
        _props.push(getValue(p.getValue(i)));
      }
      return _props;
    case p instanceof types.Boolean:
    case p instanceof types.String:
    case p instanceof types.Number:
      return p.getValue();

    case p instanceof types.Color:
      const a = p.getA();
      return a < 1
        ? `rgba(${p.getR()},${p.getG()},${p.getB()}, ${a})`
        : `#${hex(p.getR())}${hex(p.getG())}${hex(p.getB())}`;
  }
}

/**
 * @param {Number|String} n
 * @return {string}
 */
function hex(n) {
  n = n.toString(16);
  return (n.length < 2 ? '0' : '') + n;
}

module.exports = getValue;
