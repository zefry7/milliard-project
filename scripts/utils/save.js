module.exports = save;

function save(content, path) {
  require("fs").writeFile(path, content, function () {});
};
