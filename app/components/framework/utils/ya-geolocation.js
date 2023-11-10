/* eslint-disable */
(function(factory) {
  module.exports = factory(require("jquery"), ymaps);
})(function($, ymaps) {
  const _def = new $.Deferred();
  ymaps.ready(function() {
    console.log("MAPS: ", ymaps.geolocation);
    if (ymaps.geolocation) {
      _def.resolve(ymaps.geolocation.city);
    }
  });

  return _def.promise();
});
