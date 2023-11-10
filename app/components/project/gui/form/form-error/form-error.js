/* eslint-disable */
import { registerPlugins } from "../../../../framework/jquery/plugins/plugins.js";

class FormError {
  constructor($element) {}

  init(action, ...args) {
    if (action && typeof this[action] === "function") {
      return this[action].apply(this, args);
    }
  }

  destroy() {}
}
registerPlugins({
  name: "formError",
  Constructor: FormError,
  selector: ".form-error"
});
