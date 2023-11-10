import {
  registerPlugins,
  Plugin
} from "../../framework/jquery/plugins/plugins";

class History extends Plugin {
  // eslint-disable-next-line no-useless-constructor
  constructor($element) {
    super($element);
  }
}

registerPlugins({
  name: "history",
  Constructor: History,
  selector: ".history"
});
