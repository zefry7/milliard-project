const gulp = require('gulp');

const _ = require('lodash');
const pxtorem = require('gulp-pxtorem');
const sass = require('gulp-sass')(require('node-sass'));
const csso = require('gulp-csso');
// const autoprefixer = require('gulp-autoprefixer');

const browserSync = require('browser-sync');

const sassInlineImage = require('../sass/sassInlineImage');
const sassMath = require('../sass/sassMath');
const sassRegExp = require('../sass/sassRegExp');
const sassImporter = require('../sass/sassImporter');
const baseUrl = require('../utils/baseUrl');
const emptyPipe = require("./utils/empty-pipe");

const CONFIG = require('./config');



module.exports = styles;

function styles(inline) {
  const src = !inline
    ? ["app/styles/*.scss", "!app/styles/_*.scss", `${CONFIG.release ? "!" : ""}app/styles/inline_*.scss`]
    : ["app/styles/inline_*.scss"];

  return  () => {
    let bundle = gulp.src(src)
        .pipe(CONFIG.plumber())
        .pipe(sass.sync({
          outputStyle: CONFIG.isServe ? 'expanded' : 'compressed',
          functions: _.assign(
            {},
            sassInlineImage({ /* options */}),
            sassMath(),
            sassRegExp()
          ),
          importer: [sassImporter()],
          precision: 10,
          includePaths: ['.']
        }).on('error', sass.logError))
        .pipe(csso({forceMediaMerge: true}))
      /* .pipe(pxtorem({
        rootValue: CONFIG.rootFontSize,
        unitPrecision: 4,
        propList: ["*"],
        replace: true,
        mediaQuery: true
      })) */;

    if (CONFIG.isServe) {
      bundle = bundle
        .pipe(gulp.dest(baseUrl('styles', '.tmp')))
        .pipe(browserSync.stream());
    } else {
      bundle = bundle.pipe(autoprefixer())
        .pipe(inline || emptyPipe())
        .pipe(gulp.dest(CONFIG.getDestination('styles')));
    }

    return bundle;
  }
}
