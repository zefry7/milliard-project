/**
 * Добавляет антикэш параметр v в ссылки на css и js файлы
 */

const pkg = require('./package');

module.exports = (suffix)=>require('gulp-replace')(
  /(<\s*(?:link|script)[^>]+(?:src|href)=)(['"])((?!(https?:)?\/\/)[^'"]+\.(?:css|js))\2/g,
  `$1$2$3?v=${pkg.getVersion(suffix)}$2`
);
