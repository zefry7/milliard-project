/* eslint-disable */
import {registerPlugins, Plugin} from "../../framework/jquery/plugins/plugins";

class CustomPage extends Plugin {
  // eslint-disable-next-line no-useless-constructor
  constructor($element) {
    super($element);
  }
}

registerPlugins({
  name: "customPage",
  Constructor: CustomPage,
  selector: ".custom-page"
});
