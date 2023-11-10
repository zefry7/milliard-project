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
    name: "customMenu",
    Constructor: CustomMenu,
    selector: ".custom-menu"
  });

  function CustomMenu($element) {
    this.init = function(params) {};
  }
});
