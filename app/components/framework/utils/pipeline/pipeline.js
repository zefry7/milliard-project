/* eslint-disable */
import $ from "jquery";

export class Pipeline {
  constructor(context) {
    this.context = context || this;
    this._def = new $.Deferred();
    this._def.resolve({});
  }

  pipe(fn) {
    this._def = this._def.then(data => this.through(fn, data));
    return this;
  }

  through(fn, data) {
    const def = new $.Deferred();
    fn.call(this.context, result => def.resolve(result || data), data);
    return def.promise();
  }
}

export function modal(id, data) {
  return function(cb) {
    $.when(init(id), init(data)).done((id, data) => {
      $(id)
        .modal(data)
        .on("modal:close", cb);
    });
  };

  function init(val) {
    if (typeof val === "function") {
      val = val();
    }
    return val;
  }
}

export function template(info, params) {
  return function(cb) {
    const tmpl = info.$template.templateEngine(info.data);
    cb({
      template: tmpl
    });
  };
}

export function menu(name) {
  return function(cb) {
    $(".game-menu")
      .gameMenu("hint", { item: name })
      .one("game-menu__item:close", cb);
  };
}
