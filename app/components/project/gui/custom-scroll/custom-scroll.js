/* eslint-disable */
import $ from "jquery";
import { registerPlugins } from "../../../framework/jquery/plugins/plugins.js";
import "./lib/jquery.nicescroll";

class CustomScroll {
  constructor($element) {
    const $content = $element
      .children(".custom-scroll__content")
      .on("scroll", function() {
        if (this.scrollTop + 100 > this.scrollHeight - $(this).height()) {
          $element.trigger("custom-scroll:total-scroll");
        }
      });
    this.niceScroll = $content.niceScroll({
      autohidemode: false,
      cursorcolor: "#c0c0c0",
      cursorwidth: "7px",
      cursorborder: "none",
      cursorborderradius: "7px",
      background: "#e3e3e3",
      scrollspeed: 100,
      mousescrollstep: 50,
      enableobserver: false
    });

    const ClsMutationObserver = false; // window.MutationObserver || window.WebKitMutationObserver || false;

    if (ClsMutationObserver !== false) {
      this.observer = new ClsMutationObserver(mutations => this.update());
      this.observer.observe($content.get(0), {
        childList: true,
        attributes: true,
        subtree: true
      });
    } else {
      this.tick();
    }
  }

  init(action) {
    if (action && typeof this[action] === "function") {
      return this[action]();
    }
  }

  update() {
    this.niceScroll.onResize();
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      delete this.observer;
    }
    cancelAnimationFrame(this.raf);

    this.niceScroll.remove();
    delete this.niceScroll;
  }

  tick() {
    this.update();
    this.raf = requestAnimationFrame(() => this.tick());
  }
}
registerPlugins({
  name: "customScroll",
  Constructor: CustomScroll,
  selector: ".custom-scroll"
});
