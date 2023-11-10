/* eslint-disable */
(function(factory) {
  if (typeof exports === "object") {
    module.exports = factory(require("jquery"));
  } else {
    factory(jQuery);
  }
})(function($) {
  const $window = $(window);
  const $body = $(document.body);
  const $root = $(document.documentElement);
  const $all = $root.add($window).add($body);

  return function initScrollTop(value, duration, delay) {
    function scrollTop() {
      $all.scrollTop(0);
    }

    if (arguments.length === 0) {
      return $window.scrollTop() || $body.scrollTop() || $root.scrollTop();
    }
    if (!delay && !duration) {
      $all.scrollTop(value);
    } else {
      $($root, $body)
        .delay(delay || 0)
        .animate(
          {
            scrollTop: value
          },
          duration || 0
        );
    }
    /* $window.on('beforeunload', function(){
      $root.scrollTop(0);
    }); */

    // return scrollTop;
  };
});
