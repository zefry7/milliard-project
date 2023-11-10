/* eslint-disable */
(function(factory) {
  if (typeof exports === "object") {
    module.exports = factory(
      require("jquery"),
      require("../../../scripts/peppers/plugins")
    );
  } else {
    factory(jQuery, peppers.plugins);
  }
})(function($, plugins) {
  plugins.registerPlugins({
    name: "button",
    Constructor: Button,
    selector: ".button"
  });

  function Button($element) {
    this.init = function(params) {};
  }
});
