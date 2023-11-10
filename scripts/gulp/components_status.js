const through = require('through2').obj;
const glob = require('glob');

const gulp = require('gulp');
const sassInlineImage = require('../sass/sassInlineImage');
const sassImporter = require('../sass/sassImporter');
const CONFIG = require('./config');

const sass = require('gulp-sass');
const pug = require('gulp-pug');


gulp.task('components_status:scss', function () {
  return gulp.src('components-status/src/components-status.scss')
    .pipe(CONFIG.plumber())
    .pipe(
      sass.sync({
        outputStyle: 'expanded',
        functions: sassInlineImage({ /* options */ }),
        importer: sassImporter(),
      }).on('error', sass.logError)
    )
    .pipe(gulp.dest('components-status/dist/styles'));
});
gulp.task('components_status:pug', function () {
  let statuses = [];
  return gulp.src('components-status/src/components-status.pug')
    .pipe(CONFIG.plumber())
    .pipe(through(function (chunk, enc, callback) {
      glob(
        './app/components/{project,local}/**/package.json',
        function (err, files) {
          if (err) {
            callback(err);
          } else {
            files.forEach(function (entry) {
              statuses.push(read(entry));
            });

            callback(null, chunk);
          }
        }
      );
    }))
    .pipe(pug({
      data: {
        componentsList: statuses
      },
      pretty: true
    }))
    .pipe(gulp.dest('components-status/dist'));
});
gulp.task('components_status', ['components_status:scss', 'components_status:pug']);
