/* eslint-disable */
import { registerPlugins } from "../../../framework/jquery/plugins/plugins.js";

class SocialBlock {
  constructor($element) {}

  init(action) {
    if (action && typeof this[action] === "function") {
      return this[action]();
    }
  }

  destroy() {}
}
registerPlugins({
  name: "socialBlock",
  Constructor: SocialBlock,
  selector: ".social-block"
});
