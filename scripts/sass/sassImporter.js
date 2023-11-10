let path = require('path');
let read = require('../utils/read');

module.exports = sassImporter;

function sassImporter(options) {
  return (url, prev, done) => {
    let filePath = null;
    if (/^~/.test(url)) {
      filePath = path.resolve(process.cwd(), `node_modules/${url.substr(1)}`);
    }

    if (/node_modules\/([^/]+\/)*[^/]+.css$/.test(url)) {
      filePath = path.resolve(path.dirname(prev), url);
    }

    if (filePath && !/\.(css|s[ac]ss)/.test(filePath)) {
      filePath += ".scss";
    }
    // console.log(filePath);
    // if (!path.existsSync(filePath)) {
    //   throw new Error(`Импортируемый файл ${filePath} не найден`);
    // }
    // console.log('after ');
    return filePath && {contents: read(filePath, 'css')};
  }
}
