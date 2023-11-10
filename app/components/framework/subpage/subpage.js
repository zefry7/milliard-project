/* eslint-disable */
import $ from "jquery";
import Navigo from "navigo";
import { registerPlugins } from "../jquery/plugins/plugins";
import TemplateEngine from "../template-engine/template-engine";

let data;

const VISIBLE = mod("visible");
const HIDE = mod("hide");
const $root = $(document.documentElement);
let $currentPage;

class SubpageController extends Navigo {
  constructor() {
    super(null, true, "#");
    $root.one("document:ready", event => {
      this.resolve();
    });
  }
}

class Subpage {
  constructor($element) {
    const self = this;
    let hidePromise;
    let $elementView;
    const _class = $element.data("class");
    //
    this.show = show;
    this.hide = hide;
    // this.destroy = destroy;
    let template;

    if ($element.is("[type='text/template']")) {
      template = TemplateEngine.compile($element.html());
    }

    const path = $element.data("page");
    const dataField = $element.data("data");
    if (path) {
      router.on(path, show);
    } else {
      router.on(show);
    }

    function show(params) {
      if ($currentPage)
        $currentPage
          .hide()
          .then($currentPage.destroy())
          .done(_show);
      else _show();

      function _show() {
        hidePromise = undefined;

        if (_class) {
          $root.addClass(_class);
        }
        if (data) {
          data
            .getData(params.id ? `#${params.id}` : undefined)
            .done(function(info) {
              initPage(data.getParam(info, dataField));
            });
        } else {
          initPage();
        }

        function initPage(info) {
          if (template) {
            $elementView = $(template(info))
              .insertAfter($element)
              .initPlugins();
          } else {
            $elementView = $element;
          }
          $elementView.addClass(VISIBLE).removeClass(HIDE);

          $element.trigger("subpage:show");
          $currentPage = self;
        }
      }
    }

    function hide() {
      console.log("hide");
      if (!hidePromise) {
        const def = $.Deferred();
        if ($elementView) {
          $elementView
            // .addClass(HIDE)
            // .removeClass(VISIBLE)
            .detach();
        }
        if (_class) {
          $root.removeClass(_class);
        }

        def.resolve();
        hidePromise = def.promise();
      }

      return hidePromise;
    }
  }

  destroy() {
    return function() {
      // if ($elementView) {
      //   $elementView.destroyPlugins();
      //
      //   if (template) {
      //     $elementView.remove();
      //   }
      //
      // }
    };
  }
}

function mod($mod) {
  return `subpage_${$mod}`;
}

const router = new SubpageController();
registerPlugins({
  name: "subpage",
  Constructor: Subpage,
  selector: "[data-page]"
});
