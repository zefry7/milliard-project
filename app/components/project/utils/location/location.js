/* eslint-disable */
(function(factory) {
  if (typeof exports === "object") {
    module.exports = factory();
    // require('jquery')
  } else {
    factory();
  }
})(function() {
  const paths = {
    floor: "planes-floor"
  };
  function Location(page, data) {
    const href = getPage(page, data);
    if (isTop()) {
      $("#modal-iframe").modal(href);
    } else {
      // $(window.top).trigger('location:set', href);
      top.$(window).trigger("location:set", href);
    }
    // window.location.href =
  }

  Location.back = function() {
    if (isTop()) {
      if (history.length > 1) {
        history.back();
      } else {
        return false;
      }
    } else {
      top.$(window).trigger("history:back");
    }
  };

  return Location;

  function isTop() {
    return window.top === window;
  }

  function getPage(page, query) {
    page = paths.hasOwnProperty(page) ? paths[page] : page;
    const list = [];
    for (const p in query) {
      if (query.hasOwnProperty(p)) {
        list.push(`${p}=${query[p]}`);
      }
    }

    return page + (list.length > 0 ? `?${list.join("&")}` : "");
  }
});
