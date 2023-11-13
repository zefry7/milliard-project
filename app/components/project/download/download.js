import {
  registerPlugins,
  Plugin
} from "../../framework/jquery/plugins/plugins";

class Download extends Plugin {
  // eslint-disable-next-line no-useless-constructor
  constructor($element) {
    super($element);
  }
}

registerPlugins({
  name: "download",
  Constructor: Download,
  selector: ".download"
});
