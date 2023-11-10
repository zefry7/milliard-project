/* eslint-disable */
import { registerPlugins } from "../../../../framework/jquery/plugins/plugins.js";
import { FormInput } from "../form-input/form-input";

class Radiogroup extends FormInput {
  constructor($element) {
    super($element);
  }

  init(action, ...args) {
    if (action && typeof this[action] === "function") {
      return this[action].apply(this, args);
    }
  }

  destroy() {}
}
registerPlugins({
  name: "radiogroup",
  Constructor: Radiogroup,
  selector: ".radiogroup"
});
