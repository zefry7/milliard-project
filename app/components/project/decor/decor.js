import {
  registerPlugins,
  Plugin
} from "../../framework/jquery/plugins/plugins";

class Decor extends Plugin {
  // eslint-disable-next-line no-useless-constructor
  constructor($element) {
    super($element);
  }
}

registerPlugins({
  name: "decor",
  Constructor: Decor,
  selector: ".decor"
});
