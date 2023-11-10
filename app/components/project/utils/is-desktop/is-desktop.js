const DESKTOP = "desktop";
const MOBILE = "mobile";
const constants = [
  {
    type: DESKTOP,
    test: 3
  },
  {
    type: MOBILE,
    test: 1
  }
];
let element;


export const isDesktop = _is(DESKTOP);
export const isMobile = _is(MOBILE);

function _is(TYPE) {
  return function inner() {
    return getType() === TYPE;
  };
}

function init() {
  if (!element) {
    element = document.createElement("div");
    element.className = "is-desktop";
    document.body.appendChild(element);
  }
}

export function getType() {
  init();

  const _value = getValue(element);
  for (let i = 0; i < constants.length; i++) {
    if (doTest(constants[i].test, _value)) {
      return constants[i].type;
    }
  }

  return undefined;

  function getValue(_element) {
    return parseFloat(getComputedStyle(_element).width);
  }

  function doTest(test, val, _default) {
    if (!test) return _default;

    switch (typeof test) {
      case "boolean":
      case "number":
      case "string":
        return test === val;

      case "function":
        return test(val);

      default:
        if (typeof test.test === "function") {
          // Регулярные выражения попадают сюда
          // return doTest(test.test, val, _default);
          return test.test(val);
        }
        break;
    }

    return test === val;
  }
}
