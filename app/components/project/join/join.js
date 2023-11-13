import {
  registerPlugins,
  Plugin
} from "../../framework/jquery/plugins/plugins";

class Join extends Plugin {
  // eslint-disable-next-line no-useless-constructor
  constructor($element) {
    super($element);
  }
}

registerPlugins({
  name: "join",
  Constructor: Join,
  selector: ".join"
});
