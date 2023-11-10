/* eslint-disable */
import $ from "jquery";
import { registerPlugins } from "../../../../framework/jquery/plugins/plugins.js";
import { FormInput } from "../form-input/form-input";

class Input extends FormInput {
  constructor($element) {
    super($element);
    const $input = $element
      .find(".input__input")
      .on("focus blur", onFocus)
      .on("change", onChange);

    this._title = $element.find(".input__title").text();
    this._initAutoSubmit($input);

    function onFocus(event) {
      $element.toggleClass("input_focus", event.type === "focus");
    }

    function onChange(event) {
      $element.toggleClass("input_dirty", !!$input.val());
    }
  }

  getMessage2(errorName) {
    switch (errorName) {
      case "required":
        return `Заполните поле ${this._title}`;
    }

    return super.getMessage2(errorName);
  }

  _initAutoSubmit($input) {
    let oldVal;
    if ($input.is("[data-autosubmit-length]")) {
      $input.on("change keyup", function() {
        const val = $(this).val();
        if (val === oldVal) return;
        oldVal = val;
        if (val.length >= $(this).data("autosubmit-length")) {
          $(this)
            .closest("form")
            .submit();
        }
      });
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
  name: "input",
  Constructor: Input,
  selector: ".input"
});
