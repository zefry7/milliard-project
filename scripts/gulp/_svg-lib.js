const gulp = require('gulp');
const svgSymbols = require('gulp-svg-symbols');
const gulpFilter = require('gulp-filter');
const gulpIf = require('gulp-if');
const gulpRename = require('gulp-rename');
const gulpReplace = require("gulp-replace");
const CONFIG = require('./config');

const dir = "app/components/project/svg";

/**
 * Создание библиотеки svg изображений
 * @return {*}
 */
function svg() {
  return gulp.src(`${dir}/symbols/*.svg`)
    .pipe(CONFIG.plumber())
    .pipe(gulpFilter(function (file) {
      return file.stat && file.stat.size
    }))
    .pipe(svgSymbols({
      title: false,
      id: 'svg_%f',
      className: '.svg_%f',
      fontSize: 0
    }))
    .pipe(gulpIf('*.css', gulpRename('_symbols.scss')))
    .pipe(gulpIf('*.svg', gulpReplace(/<svg/, `$& style="display:none;"`)))
    .pipe(gulp.dest(dir))
}

module.exports = svg;
