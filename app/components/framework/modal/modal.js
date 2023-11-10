/* eslint-disable */
import $ from "jquery";
import { modal } from "tingle.js";
import { registerPlugins } from "../jquery/plugins/plugins";
import TemplateEngine from "../template-engine/template-engine";
import "../../project/utils/prevent-overscroll/prevent-overscroll";
import { $window } from "../../dom";

const $root = $(document.documentElement);
const $body = $(document.body);


var scrollTopStorage = []; // store scroll positions

initClick();

class ModalInstance extends modal {
  constructor(template, info) {
    const $content = $(template(info || {}));

    const data = {
      closeMethods: [], // overlay - закрывать по клику вне попапа, button - закрывать по клику на кнопку, escape - закрывать нажатием на Esc
      cssClass: ModalInstance.getModalCSSClasses($content),
      onOpen: () => this.onOpen(),
      onClose: () => this.onClose(),
      beforeClose: () => this.beforeClose()
    };

    super(data);

    this.$content = $content;

    $(this.modal)
      .on("content:resize", this.checkOverflow.bind(this))
      .closest(".tingle-modal")
      .preventOverscroll();

    $content
      .on("click", "[data-modal-close]", () => this.close())
      .on("modal:close-request", () => this.close());

    this.setContent($content.get(0));
    $body.append(this.modal);
    this.open();

    $content.initPlugins(info);
    $content.data("modal", this);
  }

  static getModalCSSClasses($content) {
    const cssClass = $content.data("tingleClass");
    return cssClass ? cssClass.split(" ") : [];
  }

  close() {
    super.close();
  }

  onOpen() {}

  onClose() {
    this.destroy();

    checkModal(this.modal);
    $(window).scrollTop( scrollTopStorage.pop(), 40 ); // restore previous scroll position
    // $(window).stop().animate({scrollTop:scrollTopStorage.pop()}, 100);
  }

  beforeClose() {
    /**
     * @event Modal#modal:close
     */
    const $event = $.Event("modal:close");
    this.$content.trigger($event);

    if (!$event.isDefaultPrevented()) {
      this.$content.off();
      // closeButton.off();
    }
    return !$event.isDefaultPrevented();
  }

  destroy() {
    super.destroy();

    if (this.$content) {
      this.$content.destroyPlugins();
      delete this.$content;
    }
  }
}

class ModalTemplate {
  /**
   *
   * @param {jQuery} $element
   * @fires Modal#modal:close
   * @listens Modal#content:resize
   * @listens Modal#modal:close-request
   * @constructor
   */
  constructor($element) {
    this.template = TemplateEngine.compile($element.html());
  }

  init(info) {
    return new ModalInstance(this.template, info).$content;
  }
}

export function isModalOpened() {
  return $(".modal").length > 0;
}

export function showModal(selector, params) {
  
  const _scroll = $(window).scrollTop();
  scrollTopStorage.push(_scroll); // store previous scroll position

  $(selector).modal(params);
}

registerPlugins({
  name: "modal",
  Constructor: ModalTemplate,
  selector: false
});

function checkModal(modal) {
  const count = $(".tingle-modal").not(modal).length;
  $body.toggleClass("tingle-enabled", count > 0);
  $window.trigger("modal:count", count);
}

function initClick() {
  $root.on("click", "[data-modal]", function(event) {
    const modal = $(this).data("modal");
    if (modal === undefined || modal === "") {
      return;
    }
    if (event.isDefaultPrevented()) {
      return;
    }
    event.preventDefault();

    const params = $(this).data("modalParams");
    const jQuery = $;
    /**
     * Показать модальное окно в родительском окне, если страница открыта в iframe
     */
    // if (modal === "#feedback" && window !== top) {
    //   jQuery = top.$;
    // }
    jQuery(modal).modal(params);
  });
}
