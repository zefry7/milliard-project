import "../components/project/project";
import "../components/project/_promise"
import $ from "../components/vendor/jquery";
import { anchorSmoothScroll } from "../components/project/utils/anchor/checkAnchor";

anchorSmoothScroll()

const {location} = global;
global.jQuery = global.$ = $;

$.when(
  windowLoaded(),
  cssLoaded()
)
  .done(onDocumentReady);

function onDocumentReady() {
  if ($.fn.initPlugins) {
    $(document.body).initPlugins();
  }
  $(document.documentElement).trigger("document:ready");
}

function isDocumentReady() {
  const def = $.Deferred();

  $(document).ready(()=>def.resolve());

  return def.promise();
}

function windowLoaded() {
  const def = $.Deferred();

  $(window)
    .on("load", () => def.resolve());

  return def.promise();
}

function cssLoaded() {
  return $.when(
    ...
    $("link[rel='preload'][as='style']").get().map((itm) => {
      const def = $.Deferred();
      $(itm).on("load", () => def.resolve());
      return def.promise();
    })
  );
}
