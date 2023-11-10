import $ from "../../../vendor/jquery";
import { $window } from "../../dom";


const $header = $(".header");

export function anchorSmoothScroll() {
  $(document).on('click', 'a[href^="#"]', function (event) {
    event.preventDefault();
    console.log(this);
    $('html, body').animate({
      scrollTop: $($.attr(this, 'href')).offset().top
    }, 500);
  });
}

function moveToElement($element) {
  if (!$element.length) return;
  $(getScrollingElement()).stop().animate({
    scrollTop: $element.offset().top - $header.height()
  }, 500);
}

function getScrollingElement() {
  return document.scrollingElement || document.documentElement;
}


anchorSmoothScroll();

$window.on("preloader:hide", () => {
  if (location.hash)
    setTimeout(() => moveToElement($(location.hash)), 0)
});
