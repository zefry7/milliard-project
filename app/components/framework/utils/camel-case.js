/* eslint-disable */
export default class CamelCase {
  static to(str, isClassName) {
    return str
      .split(/[-_]/g)
      .map(function(itm, index) {
        return index > 0 || isClassName
          ? itm.charAt(0).toUpperCase() + itm.substr(1)
          : itm;
      })
      .join("");
  }

  static from(str) {
    return str.replace(/[A-ZА-Я]/g, l => `-${l.toLowerCase()}`);
  }
}
