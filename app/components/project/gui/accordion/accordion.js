/* eslint-disable */
import $ from "jquery";
import { registerPlugins } from "../../../framework/jquery/plugins/plugins.js";
import TemplateEngine from "../../../framework/template-engine/template-engine";
import { unique } from "../../../framework/utils/unique";

TemplateEngine.registerHelper("accordion_id", function(item) {
  return (item.id = item.id || unique("hb-accordion_"));
});

class Accordion {
  constructor($element) {
    $element.on("click", ".accordion__item-head", function(event) {
      if (_isCurrent(this)) {
        const $input = $element.find(`#${$(this).attr("for")}`);
        if ($input.is(":checked")) {
          // requestAnimationFrame(function (number) {
          $input.prop("checked", false).change();
          // });
          event.preventDefault();
        }
      }
    });

    $element.on("change", ".accordion__item-input", function(event) {
      if (_isCurrent(this)) {
        let $list1 = $element.find(".accordion__item-input");
        $list1 = $list1.filter(_isCurrent);

        $list1.each(function() {
          const $collapse = $(this)
            .next()
            .find(".accordion__item-collapse")
            .filter(_isCurrent);
          toggle($collapse, $(this).is(":checked"));
        });
      }
    });

    function toggle($el, visible) {
      if (!!$el.data("$visible") === visible) {
        return;
      }

      if (visible) {
        $el.css({ height: 0 });
      }
      $el
        .stop()
        .css({"will-change": "height"})
        .animate(
          {
            height: visible ? $el.children().outerHeight() : "0"
          },
          200,
          "linear",
          function() {
            $(this).css({
              "height": visible ? "auto" : "",
              "will-change": "height"
            });
          }
        )
        .data("$visible", visible);
    }

    function _isCurrent(item) {
      // console.log();
      return $(typeof item === "object" ? item : this)
        .closest(".accordion")
        .is($element);
    }
  }

  init(action, ...args) {
    if (action && typeof this[action] === "function") {
      return this[action].apply(this, args);
    }
  }

  destroy() {}
}

registerPlugins({
  name: "accordion",
  Constructor: Accordion,
  selector: ".accordion"
});
