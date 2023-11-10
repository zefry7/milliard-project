import {
  registerPlugins,
  Plugin
} from "../../framework/jquery/plugins/plugins";
import {$html} from "../dom";

class Preloader extends Plugin {
  constructor($element) {
    super($element);

    $html.addClass("_preloader_hide");
    $element
      .on("transitionend", () => {
        $element.off().remove();
        $html.removeClass("_preloader _preloader_hide")
      })
      .addClass("preloader_hide");
  }
}

registerPlugins({
  name: "preloader",
  Constructor: Preloader,
  selector: ".preloader"
});
