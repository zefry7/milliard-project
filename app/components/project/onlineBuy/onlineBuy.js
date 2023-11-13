import {
  registerPlugins,
  Plugin
} from "../../framework/jquery/plugins/plugins";

class OnlineBuy extends Plugin {
  // eslint-disable-next-line no-useless-constructor
  constructor($element) {
    super($element);
  }
}

registerPlugins({
  name: "onlineBuy",
  Constructor: OnlineBuy,
  selector: ".onlineBuy"
});
