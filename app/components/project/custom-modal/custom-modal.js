/* eslint-disable */
import { registerPlugins } from "../../framework/jquery/plugins/plugins";
import "../../framework/modal/modal";

class CustomModal {
  constructor($element) {}

  init(action, ...args) {
    if (action && typeof this[action] === "function") {
      return this[action].apply(this, args);
    }
  }

  destroy() {}
}
registerPlugins({
  name: "customModal",
  Constructor: CustomModal,
  selector: ".custom-modal"
});
