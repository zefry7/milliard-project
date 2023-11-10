/* eslint-disable */
import $ from "jquery";

const PREFIX = "peppers.jQueryConstructor.";

/**
 * @param {function} _Class
 * @param {function=} [_BaseClass]
 * @param {string=} [name]
 */
export default function(_Class, _BaseClass, name) {
  switch (typeof _BaseClass) {
    case "function":
      _Class.prototype = Object.create(_BaseClass.prototype);
      _Class.prototype.constructor = _Class;
      _Class.prototype.super = _BaseClass.prototype;
      break;
    case "string":
      name = _BaseClass;
      _BaseClass = undefined;
      break;
  }

  if (!name) name = /^\s*function\s+([^\s()]+)/.exec(_Class.toString())[1];

  name = PREFIX + name;
  return function(...args) {
    let collection = new $();
    this.each(function() {
      const $t = $(this);
      let instance = $t.data(name);
      let $newElement;

      if (!instance) {
        $t.data(name, (instance = new _Class($t)));
      }

      if (typeof instance.init === "function") {
        $newElement = instance.init.apply(instance, args);
      }

      collection = collection.add(
        typeof $newElement !== "undefined" ? $newElement : $t
      );
    });

    return collection;
  };
}
