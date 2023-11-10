/* eslint-disable */
import { registerPlugins } from "../../../../framework/jquery/plugins/plugins.js";

export class FormInput {
  constructor($element) {
    this.$error = $element.find(".form-error");
    $element.on("validator:error", (event, ...list) => this.onError(list));
    $element.on("input:clear-error", event => {
      this.onError("");
    });
  }

  onError(list) {
    this.$error.html(list ? this.getErrorMessage(list) : "");
  }

  getErrorMessage(list) {
    return list.map(itm => this.getMessage(itm)).join("<br>");
  }

  getMessage(itm) {
    return Object.keys(itm).map(key =>
      typeof itm[key] !== "boolean" ? itm[key] : this.getMessage2(key)
    );
  }

  getMessage2(name) {
    return `${name}`;
  }

  init(action, ...args) {
    if (action && typeof this[action] === "function") {
      return this[action].apply(this, args);
    }
  }

  destroy() {}
}
registerPlugins({
  name: "formInput",
  Constructor: FormInput,
  selector: ".form-input"
});
