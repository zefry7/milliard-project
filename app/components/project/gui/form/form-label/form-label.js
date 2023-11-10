/* eslint-disable */
import { registerPlugins } from "../../../../framework/jquery/plugins/plugins.js";

class FormLabel {
  constructor($element) {}

  init(action, ...args) {
    if (action && typeof this[action] === "function") {
      return this[action].apply(this, args);
    }
  }

  destroy() {}
}
registerPlugins({
  name: "formLabel",
  Constructor: FormLabel,
  selector: ".form-label"
});
