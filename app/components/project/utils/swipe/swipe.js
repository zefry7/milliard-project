/* eslint-disable */

(function(factory) {
  if (typeof exports === "object") {
    module.exports = factory(require("jquery"));
  } else {
    factory(jQuery);
  }
})(function($) {
  function now() {
    return new Date().getTime();
  }

  let startTouch;
  let touchMove;
  $(document.documentElement)
    .on("mousedown", function(event) {
      if (!startTouch) {
        startTouch = getMousePosition(event);
        triggerStart(startTouch);
      }
    })
    .on("mousemove", function(event) {
      if (startTouch) {
        const _touchMove = getMousePosition(event);
        triggerMove(startTouch, touchMove, _touchMove, event);
        touchMove = _touchMove;
      }
    })
    .on("mouseup", function(event) {
      if (startTouch) {
        trigger(startTouch, getMousePosition(event));
      }
    })

    .on("touchstart", function(event) {
      if (!startTouch) {
        startTouch = getTouchPosition(event)[0];
        triggerStart(startTouch);
      }
    })
    .on("touchmove", function(event) {
      if (startTouch) {
        const _touchMove = getTouchPosition(event, startTouch.id)[0];
        triggerMove(startTouch, touchMove, _touchMove, event);
        touchMove = _touchMove;
      }
    })
    .on("touchend", function(event) {
      trigger(startTouch, touchMove);
    });

  function triggerStart(start) {
    $(start.target).trigger(
      new $.Event("pep:touchstart", {
        touchstart: {
          x: start.x,
          y: start.y
        }
      })
    );
  }

  function triggerMove(start, prev, current, event) {
    if (!(start && current && prev)) {
      return;
    }

    const dx = current.x - start.x;
    const dy = current.y - start.y;
    const { target } = start;

    $(target).trigger(
      new $.Event("pep:touchmove", {
        touchmove: {
          originalEvent: event,
          dx,
          dy,
          offset: {
            dx: current.x - prev.x,
            dy: current.y - prev.y
          }
        }
      })
    );
  }

  function trigger(start, end) {
    if (!start || !end) {
      return;
    }
    startTouch = undefined;
    touchMove = undefined;

    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const { target } = start;

    $(target).trigger(
      new $.Event("pep:touchend", {
        touchend: {
          dx,
          dy,
          duration: end.timestamp - start.timestamp
        }
      })
    );
    
    if( Math.abs(dx)<5 && Math.abs(dy)<5 ) return;
    
    $(target).trigger(
      new $.Event("pep:swipe", {
        swipe: {
          dx,
          dy,
          direction: getSwipeDirection(dx, dy),
          getDirection: getDirection(dx, dy)
        }
      })
    );
  }

  function getDirection(dx, dy) {
    const a = (Math.atan2(dy, dx) * 180) / Math.PI;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return function(ax, ay, length) {
      if (typeof length === "number" && distance < length) {
        return;
      }

      if (typeof ax === "undefined") {
        ax = 45;
      }
      if (typeof ay === "undefined") {
        ay = ax;
      }

      if (Math.abs(a) < ax) return "right";
      if (180 - Math.abs(a) < ax) return "left";

      if (Math.abs(90 - a) < ay) return "down";
      if (Math.abs(-90 - a) < ax) return "up";
    };
  }
  function getSwipeDirection(dx, dy) {
    if (Math.abs(dx) > Math.abs(dy)) {
      return dx < 0 ? "left" : "right";
    }
    return dy < 0 ? "up" : "down";
  }

  function getMousePosition(event) {
    return {
      timestamp: now(),
      type: "mouse",
      target: event.target,
      x: event.pageX || event.clientX,
      y: event.pageY || event.clientY
    };
  }
  function getTouchPosition(event, touchId) {
    const _map = [];
    const time = now();
    const notID = typeof touchId === "undefined";
    for (let i = 0; i < event.touches.length; i++) {
      if (notID || event.touches[i].identifier === touchId) {
        _map.push(map(event.touches[i]));
      }
    }
    return _map;

    function map(touch) {
      return {
        timestamp: time,
        type: "touch",
        id: touch.identifier,
        target: event.target,
        x: touch.pageX || touch.clientX,
        y: touch.pageY || touch.clientY
      };
    }
  }
});
