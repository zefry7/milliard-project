/* eslint-disable */
import { registerPlugins } from "../../../../framework/jquery/plugins/plugins.js";
import { FormInput } from "../form-input/form-input";

class SelectDate extends FormInput {
  constructor($element) {
    super($element);

    this.$input = $element.find(".select-date__input");
    $element.on("input:change", ".select", (event, value) => {
      this.setValue($(event.target).attr("name"), value);
    });

    this._date = new Date(0);
  }

  setValue(name, { value }) {
    // console.log(this.$input, name, value);
    const _val = /_([dmy]){2}$/.exec(name);
    switch (_val && _val[1]) {
      case "d":
        this._date.setDate(value);
        break;
      case "m":
        this._date.setMonth(value - 1);
        break;
      case "y":
        this._date.setYear(value);
        break;
    }
    this.$input.val(this.getDate()).change();
  }

  getDate() {
    return this._date.toUTCString();
  }

  init(action, ...args) {
    if (action && typeof this[action] === "function") {
      return this[action].apply(this, args);
    }
  }

  destroy() {}
}

registerPlugins({
  name: "selectDate",
  Constructor: SelectDate,
  selector: ".select-date"
});
