const gulp = require('gulp');
const pkg = require('../utils/package');
const replace = require('gulp-replace');

module.exports = function increaseVersion() {
  return gulp.src('package.json')
    .pipe(replace(/("version"\s*:\s*")([^"]*)(")/, function () {
      return arguments[1] + pkg.increaseVersion() + arguments[3];
    }))
    .pipe(gulp.dest('./'));
};
