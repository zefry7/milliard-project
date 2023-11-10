/* eslint-disable */
import $ from "jquery";
import trim from "../../utils/trim";

$.fn.serializeHash = serializeHash;

/**
 * @param {boolean=false} removeSupporting - удалять параметры начинающиеся со знака подчеркивания (вспомогательные поля)
 * @returns {{}}
 */
export default function serializeHash(removeSupporting = true) {
  let map = {};
  const $t = $(this);
  map = $t.serializeArray().reduce(function(val, item) {
    if (!removeSupporting || item.name.charAt(0) !== "_")
      val[item.name] = trim(item.value);
    return val;
  }, map);

  $t.find("[data-prefix]").each(addPrefix);

  return map;

  function addPrefix() {
    const _t = $(this);
    const _n = _t.attr("name");
    const _p = _t.data("prefix");
    if (map.hasOwnProperty(_n)) {
      map[_n] = _p + map[_n];
    }
  }
}
