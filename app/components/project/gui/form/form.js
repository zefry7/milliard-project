/* eslint-disable */
import $ from "jquery";
import { registerPlugins } from "../../../framework/jquery/plugins/plugins.js";
import * as validator from "../../../framework/validator/validator";
import { api } from "../../../framework/api/api";

import "./input/input";
import "./checkbox/checkbox";
import "./radiogroup/radiogroup";
import "./select/select";
import "./select-date/select-date";

// import {validate} from "../gui/error-text/error-text";

// import Inputmask from 'inputmask/dist/inputmask/jquery.inputmask';
// import "inputmask/dist/inputmask/inputmask.numeric.extensions";

class Form {
  constructor($element) {
    const self = this;
    this.$element = $element;
    this.$submit = $element.find('[type="submit"]');
    _initRemoveErrorOnFocus($element);
    _initVerificationOnChange($element);
    _initFormSubmit($element, this);

    function _initFormSubmit($element, self) {
      $element.on("submit", event => {
        self.onFormSubmit(event);
      });
    }

    function _initVerificationOnChange($element) {
      $element.find(":input[name]").on("change input", event => {
        if (!/^_/.test($(event.target).attr("name"))) {
          self.onFormChange();
        }
      });
    }

    function _initRemoveErrorOnFocus($element) {
      $element.find(":input").on("change input focus", function(event) {
        $(event.target).trigger("input:clear-error");
      });
    }
  }

  onFormChange() {
    this.isValid = !this.getValidationErrors();
    this.updateActive();
  }

  onFormSubmit(event) {
    event.preventDefault();

    if (this.isSubmittable) {
      const validationErrors = this.getValidationErrors();
      if (!validationErrors) {
        const def = $.Deferred();
        const event = new $.Event("form:submit", {
          form: { params: this.serialize(), deferred: def }
        });
        this.$element.trigger(event);

        if (!event.isDefaultPrevented()) {
          const action = this.$element.attr("action");
          api
            .send(action, {
              requestMethod: this.$element.attr("method")
            })(event.form.params)
            .done(data => {
              this.$element.trigger(
                new $.Event(
                  "form:response",
                  {
                    form: {
                      action,
                      data: event.form.params
                    }
                  }
                ),
                data
              );
              def.resolve(data);
            })
            .fail(error => {
              this.$element.trigger("form:error", error);
              this.showErrors(error);
              def.reject(error);
            });
        }

        this.lock(def.promise());
      } else {
        this.showErrors(validationErrors);
      }
    }
  }

  serialize() {
    const disabled = this.$element
      .find(":input:disabled")
      .removeAttr("disabled");
    const data = this.$element
      .serializeArray()
      .filter(({ name, value }) => name.charAt(0) !== "_")
      .reduce((res, {name, value}) => {
        res[name] = value;
        return res;
      }, {});
    disabled.attr("disabled", "disabled");
    return data;
  }

  lock(promise) {
    this.isLocked = true;

    promise.always(() => {
      this.isLocked = false;
    });
  }

  /**
   * Проверяет поля ввода и возвращает выявленные ошибки
   *
   * @param data
   * @param validations
   * @return {ApiError|boolean} - возвращает false, если нет ошибок
   */
  getValidationErrors(data, validations) {
    return validator.verificate(
      data || this.serialize(),
      validations || this.getValidations()
    );
  }

  /**
   * @param {ApiError} error
   */
  showErrors(error) {
    console.log("errors", error);
    let validations = this.$element.find("[data-validations]");
    if (error) {
      Object.keys(error.errors).forEach(key => {
        const $input = this.$element.find(`[name="${key}"]`);
        $input.trigger("validator:error", error.errors[key]);
        validations = validations.not($input);
      });
    }

    validations.trigger("validator:error", "");
  }

  getValidations() {
    const res = {};
    this.$element.find("[data-validations]").each(function() {
      res[$(this).attr("name")] = validator.parseDataAttribute(
        $(this).data("validations")
      );
    });

    return res;
  }

  init(action, ...args) {
    if (action && typeof this[action] === "function") {
      return this[action].apply(this, args);
    }
  }

  /**
   * Очистить форму `$().form('pristine')`
   */
  pristine() {
    this.$element.find(".input input").val("");
  }

  destroy() {}

  get isSubmittable() {
    // return true;
    return !this.isLocked;// && this.isValid;
  }

  updateActive() {
    // $submit.attr('disabled', 'disabled');
    if (this.isSubmittable) {
      this.$submit.removeAttr("disabled");
    } else {
      this.$submit.attr("disabled", "disabled");
    }
  }
}

registerPlugins({
  name: "form",
  Constructor: Form,
  selector: ".form"
});
