/* eslint-disable */
import { registerPlugins } from "../../../framework/jquery/plugins/plugins";

/* var $log = $(document.createElement('div')).appendTo(document.body)
  .css({
    'background': '#000000',
    'color': '#ffffff',
    'font-size': '16px',
    'position': 'fixed',
    'top': 0,
    'left': 0,
    'z-index': 9999
  }); */

class PreventOverscroll {
  constructor($element) {
    let startTouch;
    let touchMove;
    let scrollTop;
    let scrollHeight;
    let viewportHeight;

    const $touchTarget = $element.on("touchstart", onTouchStart);

    this.init = function(params) {
      if (["destroy", "dispose"].indexOf(params) >= 0) {
        destroy();
      } else {
      }
    };

    function destroy() {
      $element.off();
    }

    function onTouchStart(event) {
      if (!startTouch) {
        startTouch = getTouchPosition(event)[0];

        scrollTop = $element.scrollTop();
        $touchTarget.on("touchmove", onTouchMove).on("touchend", onTouchEnd);
      }
    }

    function onTouchMove(event) {
      let _touchMove = getTouchPosition(event, startTouch.id);
      _touchMove = _touchMove[0];

      const dy = _touchMove.y - startTouch.y;

      scrollHeight = Math.floor($element.get(0).scrollHeight);
      viewportHeight = Math.ceil($element.outerHeight());

      // var isOverscroll = false;
      if (
        isOverscrollUp(scrollTop, scrollHeight, viewportHeight, dy) ||
        isOverscrollDown(scrollTop, scrollHeight, viewportHeight, dy)
      ) {
        event.preventDefault();
        // isOverscroll = true;
      }
      // $log.html([scrollTop, scrollHeight, viewportHeight, dy, isOverscroll].join(' | '));

      touchMove = _touchMove;

      function isOverscrollUp(scrollTop, scrollHeight, viewportHeight) {
        return scrollTop - dy <= 0; // && dy > 0;
      }
      function isOverscrollDown(scrollTop, scrollHeight, viewportHeight) {
        return scrollTop - dy >= scrollHeight - viewportHeight; // && dy < 0;
      }
    }

    function onTouchEnd(event) {
      startTouch = undefined;
      touchMove = undefined;
      $touchTarget.off("touchmove", onTouchMove).off("touchend", onTouchEnd);
    }

    function getTouchPosition(event, touchId) {
      const _map = [];
      const notID = typeof touchId === "undefined";
      for (let i = 0; i < event.touches.length; i++) {
        if (notID || event.touches[i].identifier === touchId) {
          _map.push(map(event.touches[i]));
        }
      }
      return _map;

      function map(touch) {
        return {
          id: touch.identifier,
          target: event.target,
          x: touch.screenX || touch.pageX || touch.clientX,
          y: touch.screenY || touch.pageY || touch.clientY
        };
      }
    }
  }
}

registerPlugins({
  name: "preventOverscroll",
  Constructor: PreventOverscroll,
  selector: "[data-prevent-overscroll]"
});
