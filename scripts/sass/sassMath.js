const types     = require('node-sass').types;
const getValue  = require('./sassGetValue');

const transform = {
  grad: Math.PI / 200,
  deg: Math.PI / 180,
  turn: Math.PI / 0.5
};

module.exports = function () {

  return {
    'sin($val)': make(Math.sin),
    'cos($val)': make(Math.cos),
    'tan($val)': make(Math.tan),
    'sqrt($val)': make(Math.sqrt),
    'atan2($y, $x)': make2(Math.atan2),

    'abs($val)': make2(Math.abs),
    'pow($val, $pow)': make2(Math.pow),

    'pi()': ()=>types.Number(Math.PI),
  };
};


function make2(fn) {
  return function (...args) {
    args[0].setValue( fn(...args.map(val=>getValue(val))) );
    return args[0];
  }
}

function make(fn) {
  return function (val) {
    if (typeof fn === 'function') {
      let value = getValue(val);
      try {
        let unit = val.getUnit();
        if (transform.hasOwnProperty(unit)) {
          value *= transform[unit];
        }
      } catch (e) {
        console.error( e );
      }
      return types.Number( fn(value) );
    }

    return types.Number( fn );
  }
}
