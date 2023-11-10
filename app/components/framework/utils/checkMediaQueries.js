/* eslint-disable */
import $ from "jquery";

const $w = $(window);

export function checkMediaQueries(params) {
  params = params || {};
  const w = params.w || $w.width();
  const h = params.h || $w.height();

  return function(data) {
    return check("width", w) && check("height", h) && check("ratio", w / h);

    function check(param, val) {
      return check2(`min-${param}`, val, 1) && check2(`max-${param}`, val, -1);
    }

    function check2(param, val, s) {
      return !data.hasOwnProperty(param) || val * s >= data[param] * s;
    }
  };
}
