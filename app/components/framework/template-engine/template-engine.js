/* eslint-disable */
import $ from "jquery";
import Handlebars from "handlebars";
import { registerPlugins } from "../jquery/plugins/plugins";
import "./template-engine__helpers";

export default Handlebars;

function TemplateEngine($element) {
  const template = Handlebars.compile($element.html());
  this.init = function(data, params) {
    let $result;
    if (data) {
      $result = $(template(data));
      params = $.extend({}, params || {});

      if (!(add("append") || add("prepend") || add("before") || add("after"))) {
        if (params.toParent) {
          $element.parent().append($result);
        } else {
          $element.after($result);
        }
      }

      $result.initPlugins(params.plugins);
    }

    return $result;

    function add(name) {
      if (!params.hasOwnProperty(name)) {
        return false;
      }

      let $container;
      if (params[name] !== false) {
        if (typeof params[name] === "function") {
          params[name]($result);
          return true;
        }
        if (["object", "string"].indexOf(typeof params[name]) >= 0) {
          $container = $(params[name]);
        } else if (params.toParent) {
          $container = $element.parent();
        }

        if ($container) {
          $container[name]($result);
          return true;
        }
      } else {
        return true;
      }
      return false;
    }
  };
}

registerPlugins({
  name: "templateEngine",
  Constructor: TemplateEngine,
  selector: false
});
