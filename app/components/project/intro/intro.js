import {
  registerPlugins,
  Plugin
} from "../../framework/jquery/plugins/plugins";

class Intro extends Plugin {
  // eslint-disable-next-line no-useless-constructor
  constructor($element) {
    super($element);
  }
}

registerPlugins({
  name: "intro",
  Constructor: Intro,
  selector: ".intro"
});
