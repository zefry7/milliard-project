/* eslint-disable */
import { registerPlugins } from "../jquery/plugins/plugins.js";

class BitrixModule {
  constructor($element) {}

  init(action, ...args) {
    if (action && typeof this[action] === "function") {
      return this[action].apply(this, args);
    }
  }

  destroy() {}
}
registerPlugins({
  name: "bitrixModule",
  Constructor: BitrixModule,
  selector: ".bitrix-module"
});
