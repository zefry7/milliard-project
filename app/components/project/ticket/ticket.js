import {
  registerPlugins,
  Plugin
} from "../../framework/jquery/plugins/plugins";

class Ticket extends Plugin {
  // eslint-disable-next-line no-useless-constructor
  constructor($element) {
    super($element);
  }
}

registerPlugins({
  name: "ticket",
  Constructor: Ticket,
  selector: ".ticket"
});
