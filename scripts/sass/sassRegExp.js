const types = require('node-sass').types;
const getValue  = require('./sassGetValue');

module.exports = function sassRegExp() {
  return {
    "reg-exp-test($pattern, $subject)": regExpTest(),
    "reg-exp-replace($pattern, $replacement, $subject)": regExpReplace()
  }
};

function regExpReplace() {
  return function($pattern, $replacement, $subject) {
    return types.String(
      getValue($subject)
        .replace(
          new RegExp(getValue($pattern)),
          getValue($replacement)
        )
    );
  }
}

function regExpTest() {
  return function($pattern, $subject) {
    return types.Boolean(new RegExp(getValue($pattern)).test(getValue($subject)));
  }
}
