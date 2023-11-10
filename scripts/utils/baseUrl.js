module.exports = baseUrl;

function baseUrl(val, suffix) {
  return require('../gulp/config').getData().dist(val, suffix);
}
