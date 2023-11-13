import {
  registerPlugins,
  Plugin
} from "../../framework/jquery/plugins/plugins";

class Winners extends Plugin {
  // eslint-disable-next-line no-useless-constructor
  constructor($element) {
    super($element);
  }
}

registerPlugins({
  name: "winners",
  Constructor: Winners,
  selector: ".winners"
});
