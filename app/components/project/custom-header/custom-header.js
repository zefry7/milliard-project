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
    name: "customHeader",
    Constructor: CustomHeader,
    selector: ".custom-header"
  });

  function CustomHeader($element) {
    this.init = function(params) {};
  }
});


let burgerMenu = document.querySelector(".header__burger")
let headerWrapper = document.querySelector(".header__wrapper")

let linkList = document.querySelectorAll(".custom-menu__item")

burgerMenu.addEventListener("click", () => {
  headerWrapper.classList.toggle('header__wrapper_active')
  document.body.classList.toggle("body-lock")
  burgerMenu.classList.toggle("header__burger_active")
})

linkList.forEach(value => {
  value.addEventListener("click", () => {
    headerWrapper.classList.remove('header__wrapper_active')
    document.body.classList.remove("body-lock")
    burgerMenu.classList.remove("header__burger_active")
  })
})

window.addEventListener("resize", () => {
  if(screen.availWidth > 1024) {
    document.body.classList.remove("body-lock")
    burgerMenu.classList.remove("header__burger_active")
  }
})