const gulp = require("gulp");
const eslint = require("gulp-eslint");

// module.exports = ()=> gulp.src(["./app/components/**/*.js", "!./app/components/wip/**/*"])
//   .pipe(eslint())
//   // eslint.format() outputs the lint results to the console.
//   // Alternatively use eslint.formatEach() (see Docs).
//   .pipe(eslint.format());

module.exports = cb => cb()
