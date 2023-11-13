import {
  registerPlugins,
  Plugin
} from "../../framework/jquery/plugins/plugins";

class Footer extends Plugin {
  // eslint-disable-next-line no-useless-constructor
  constructor($element) {
    super($element);
  }
}

registerPlugins({
  name: "footer",
  Constructor: Footer,
  selector: ".footer"
});
