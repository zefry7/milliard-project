/* eslint-disable */
import $ from "jquery";
import { registerPlugins } from "../../../../framework/jquery/plugins/plugins.js";
import { FormInput } from "../form-input/form-input";

class Select extends FormInput {
  constructor($element) {
    super($element);
    this.$element = $element;

    this.$wrapper = $element.find(".select__wrapper");
    this.$label = $element.find(".select__label");
    this.$value = $element.find(".select__value");
    this.$toggleChecbox = $element.find(".select__toggle");

    this.initOptions();

    this.initExpanding();

    this.initCLosingOnLabelClick();

    $(document.documentElement).on("click", event => this.onOutClick(event));
  }

  initExpanding() {
    const self = this;
    this.$toggleChecbox.on("change", onExpand);
    onExpand();
    function onExpand() {
      self.$wrapper.css({
        height: self.$wrapper.children().outerHeight()
      });
    }
  }

  initCLosingOnLabelClick() {
    const self = this;
    const onLabelClick = (event) => {
      if ($(event.target).is("input")) {
        event.stopImmediatePropagation();
      } else if (self.$toggleChecbox.is(":checked")) {
        requestAnimationFrame(() => {
          this.setExpanded(false);
        });
      }
    };
    this.$label.on("click", onLabelClick);
  }

  setExpanded(expanded = true) {
    if (this.$toggleChecbox.prop("checked") !== expanded) {
      this.$toggleChecbox.prop("checked", expanded).change();
    }
  }

  setValue(value, label) {
    this.$label.text(label);
    this.$value
      .val(value)
      .change()
      .trigger("input:change", { value });
  }

  initOptions() {
    const self = this;
    this.$element.find(".select__option-select").on("change", onOptionsSelect);

    function onOptionsSelect() {
      const label = $(this)
        .closest(".select__option")
        .find(".select__option-text")
        .text();
      const value = $(this).attr("value") ? $(this).val() : label;

      self.setExpanded(false);
      self.setValue(value, label);
    }
  }

  onOutClick(event) {
    if (!$.contains(this.$element.get(0), event.target)) {
      this.setExpanded(false);
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
  name: "select",
  Constructor: Select,
  selector: ".select"
});
