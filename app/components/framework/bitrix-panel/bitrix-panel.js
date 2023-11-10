/* eslint-disable */
import { registerPlugins } from "../jquery/plugins/plugins.js";

class BitrixPanel {
  constructor($element) {}

  init(action, ...args) {
    if (action && typeof this[action] === "function") {
      return this[action].apply(this, args);
    }
  }

  destroy() {}
}
registerPlugins({
  name: "bitrixPanel",
  Constructor: BitrixPanel,
  selector: ".bitrix-panel"
});
