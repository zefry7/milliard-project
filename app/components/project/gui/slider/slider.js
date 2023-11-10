/* eslint-disable */
(function(factory) {
  if (typeof exports === "object") {
    module.exports = factory(
      require("jquery"),
      require("../../framework/jquery/plugins/plugins.js")
    );
  } else {
    factory(jQuery, peppers.plugins);
  }
})(function($, plugins) {
  plugins.registerPlugins({
    name: "slider",
    Constructor: Slider,
    selector: ".slider"
  });

  function Slider($element) {
    let $dragging;
    const events = {
      touchstart: {
        move: "touchmove",
        up: "touchend"
      },
      mousedown: {
        move: "mousemove",
        up: "mouseup"
      }
    };
    const isSelect = $element.is(".slider_select");
    if (isSelect) {
      var customValRange;
      initCustomValRange();
    }

    const $bar = $element.find(".slider__bar");
    const $controls = $element.find(".slider__controls");
    const $text = $element
      .find(".slider__line-text")
      .keypress(function(e) {
        return e.which !== 13 && /^[\d., ]$/.test(e.key);
      })
      .on("blur keyup", onChange);

    const value = { left: 0, right: 0 };
    // var minVal = 0, maxVal = 100, step = 25;

    const _data = $element.data();
    const totalRange = {
      min: getData(_data, "min", 0),
      max: getData(_data, "max", 100)
    };
    totalRange.step = getData(_data, "step", 1); // (totalRange.max - totalRange.min) / 10);
    totalRange.min =
      Math.ceil(totalRange.min / totalRange.step) * totalRange.step;
    totalRange.max =
      Math.floor(totalRange.max / totalRange.step) * totalRange.step;

    const MLN = 1000000;
    let precision;
    let multiplier = 1;
    if (totalRange.max > MLN) {
      precision = 3;
      multiplier = MLN;
    }

    const currentRange = { min: totalRange.min, max: totalRange.max };
    update(0);

    this.init = function(params, val) {
      if (["destroy", "dispose"].indexOf(params) >= 0) {
        destroy();
        return;
      }
      switch (params) {
        case "init":
          setValue(val);
          updateViewVal();
          updatePosition();
          updateView(0);
          break;
        case "reset":
          reset();
          break;
        case "test":
          return test(val);
        case "get":
          return getRange();
      }
    };

    $element.find(".slider__control").each(initControl);

    function destroy() {}

    function reset() {
      setValue(totalRange);
      updateViewVal();
      updatePosition();
      updateView(0);
    }
    function test(val) {
      return (
        val === "" ||
        (val > currentRange.min - totalRange.step &&
          val < currentRange.max + totalRange.step)
      );
    }
    function getData(_data, name, def) {
      return _data.hasOwnProperty(name) ? _data[name] : def;
    }
    function initControl() {
      $(this).on("touchstart mousedown", startDrag);
    }

    function startDrag(event) {
      if ($dragging) {
        if ($dragging.is(this)) {
          return;
        }

        stopDragging();
      }

      $dragging = $(this);
      const startPos = getPosition(event);
      const isRight = $dragging.is(".slider__control_right");
      let _startVal;
      let _maxVal;
      let _cssProp;
      let _dir;
      if (isRight) {
        _startVal = value.right;
        _maxVal = 1 - value.left;
        _cssProp = "right";
        _dir = -1;
      } else {
        _startVal = value.left;
        _maxVal = 1 - value.right;
        _cssProp = "left";
        _dir = 1;
      }

      $(document.documentElement)
        .on(`${events[event.type].move}.slider`, onMove)
        .on(`${events[event.type].up}.slider`, onStop);

      function onMove(event) {
        const currentPos = getPosition(event);
        const delta =
          (currentPos.left - startPos.left) / $controls.outerWidth();
        value[_cssProp] = Math.max(
          0,
          Math.min(_maxVal, _startVal + _dir * delta)
        );

        update(0);
      }

      function onStop(event) {
        stopDragging();
        change();
      }
    }

    function onChange(event) {
      if (event.type === "blur" || event.keyCode === 13) {
        setValue({
          min: parseInput($text.first().text()),
          max: parseInput($text.last().text())
        });
        updatePosition();

        change();
      } else {
      }
    }

    function change() {
      clipValue();
      update();
      $element.trigger("slider:change", getRange());
    }

    function getRange() {
      return $.extend({}, currentRange);
    }
    function update(duration) {
      updateVal();
      updateView(duration);
    }
    function updateView(duration) {
      $bar.stop().animate(
        {
          left: `${value.left * 100}%`,
          right: `${value.right * 100}%`
        },
        typeof duration === "undefined" ? 300 : duration
      );
    }

    function setValue(val) {
      currentRange.min = Math.max(
        totalRange.min,
        Math.min(totalRange.max, val.min)
      );
      currentRange.max = Math.max(
        currentRange.min,
        Math.min(totalRange.max, val.max)
      );
    }
    function updateViewVal() {
      if (!isSelect) {
        $text.first().text(formatOutput(currentRange.min));
        $text.last().text(formatOutput(currentRange.max));
      } else {
        // console.log(currentRange.min, currentRange.max);
      }
    }

    /**
     * По значениям минимума и максимума выставляет контроллы
     */
    function updatePosition() {
      // TODO магнититься к реальным точкам
      value.left = value2percentage(currentRange.min);
      value.right = 1 - value2percentage(currentRange.max);
    }

    /**
     * По положению контроллов определяет минимальное и максимальное значение
     */
    function updateVal() {
      currentRange.min = getMin();
      currentRange.max = getMax();
      updateViewVal();

      function getMax() {
        return clip(
          totalRange.max -
            (totalRange.max - totalRange.min) * (1 - calcValue(1 - value.right))
        );
      }
      function getMin() {
        return clip(
          totalRange.min +
            (totalRange.max - totalRange.min) * calcValue(value.left)
        );
      }

      function calcValue(val) {
        if (isSelect) {
          for (let i = 0; i < customValRange.length - 1; i++) {
            if (val < customValRange[i + 1]) {
              return (
                (i +
                  (val - customValRange[i]) /
                    (customValRange[i + 1] - customValRange[i])) /
                (customValRange.length - 1)
              );
            }
          }
        }
        return val;
      }
    }

    function formatOutput(val) {
      val /= multiplier;
      return precision ? val.toFixed(precision).replace(".", ", ") : val;
    }
    function parseInput(val) {
      if (val) {
        val = `${val}`.replace(/\s/g, "").replace(/,/, ".");
      }
      return parseFloat(val) * multiplier || 0;
    }
    function value2percentage(val) {
      let _percent = (val - totalRange.min) / (totalRange.max - totalRange.min);
      if (isSelect) {
        const i = (customValRange.length - 1) * _percent;
        const i1 = Math.floor(i);
        const i2 = Math.ceil(i);

        _percent =
          customValRange[i1] +
          (customValRange[i2] - customValRange[i1]) * (i - i1);
      }

      return _percent;
    }

    /**
     * Примагничивает контроллы к конкретному значению
     */
    function clipValue() {
      value.left = clipPercentage(value.left, 1 - value.right, 0);
      value.right = 1 - clipPercentage(1 - value.right, 1, value.left);

      function clipPercentage(val, maxVal, minVal) {
        if (isSelect) {
          for (let i = 0; i < customValRange.length - 1; i++) {
            if (val < customValRange[i + 1]) {
              return customValRange[i + 1] - val > val - customValRange[i]
                ? customValRange[i]
                : customValRange[i + 1];
            }
          }
        }

        const step = Math.round(
          (totalRange.max - totalRange.min) / totalRange.step
        );
        return (
          Math.round(Math.max(minVal, Math.min(maxVal, val)) * step) / step
        );
      }
    }

    function clip(val) {
      return Math.round(val / totalRange.step) * totalRange.step;
    }

    function getPosition(event) {
      if (typeof event.offsetX !== "undefined") {
        var pos = {
          left: event.clientX,
          top: event.clientY
        };
      } else if (/^touch/.test(event.type)) {
        pos = {
          left: event.originalEvent.touches[0].clientX,
          top: event.originalEvent.touches[0].clientY
        };
      }

      if (pos) {
        const offset = $controls.offset();
        pos.left -= offset.left;
        pos.top -= offset.top;
        return pos;
      }

      return { left: 0, top: 0 };
    }
    function stopDragging() {
      $(document.documentElement).off(".slider");
      $dragging = undefined;
    }

    function initCustomValRange() {
      $(window).on("resize", onResize);
      onResize();

      function onResize() {
        const list = [];
        const $parent = $element.find(".slider__control-number");
        const w = $parent.width();
        const $blocks = $parent.children();
        $blocks.each(function(i) {
          list.push(
            ($(this).position().left +
              (i / ($blocks.length - 1)) * $(this).width()) /
              w
          );
        });
        customValRange = list;
      }
    }
  }
});
