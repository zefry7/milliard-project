/* eslint-disable */
import $ from "jquery";
import { registerPlugins } from "../../../../framework/jquery/plugins/plugins.js";
import { FormInput } from "../form-input/form-input";

class Checkbox extends FormInput {
  constructor($element) {
    super($element);
  }

  init(action) {
    switch (action) {
      case "destroy":
      case "dispose":
        this.destroy();

      default:
        break;
    }
  }

  destroy() {}
}
registerPlugins({
  name: "checkbox",
  Constructor: Checkbox,
  selector: ".checkbox"
});
