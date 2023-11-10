import {
  registerPlugins,
  Plugin
} from "../../../framework/jquery/plugins/plugins";

class Picture extends Plugin {
  // eslint-disable-next-line no-useless-constructor
  constructor($element) {
    super($element);
  }
}

registerPlugins({
  name: "picture",
  Constructor: Picture,
  selector: ".picture"
});
