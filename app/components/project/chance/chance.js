import {
  registerPlugins,
  Plugin
} from "../../framework/jquery/plugins/plugins";

class Chance extends Plugin {
  // eslint-disable-next-line no-useless-constructor
  constructor($element) {
    super($element);
  }
}

registerPlugins({
  name: "chance",
  Constructor: Chance,
  selector: ".chance"
});
