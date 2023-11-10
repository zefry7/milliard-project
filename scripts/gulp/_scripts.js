const path = require('path');
const gulp = require('gulp');
const glob = require('glob');
const vinylSourceStream = require('vinyl-source-stream');
const vinylBuffer = require('vinyl-buffer');
const es = require('event-stream');
const notify = require('gulp-notify');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync');

const pkg = require('../utils/package');
const baseUrl = require('../utils/baseUrl');

const CONFIG = require('./config');


module.exports = scripts;

function scripts(done){
  const globString = CONFIG.isVendor ? "./app/components/lib/vendor*.js" : `./app/scripts/${CONFIG.isServe ? '*' : '!(car-test)'}.js`;
  glob(globString, function (err, files) {
    if (err) done(err);

    let tasks = files.map(function (entry) {
      let fileName = path.basename(entry);

      if (fileName === 'main.js') {
        fileName = `${pkg.getProjectName()}.js`;
      }
      let _bundle = CONFIG.getBrowserify(entry)
        .bundle()
        .on('error', notify.onError('Error: <%= error.message %>'))
        .pipe(CONFIG.plumber())
        .pipe(vinylSourceStream(fileName));

      if (CONFIG.isServe) {
        _bundle = _bundle
          .pipe(gulp.dest(baseUrl('scripts', '.tmp')))
          .pipe(browserSync.stream());
      } else {
        // if (!CONFIG.isDev) {
          _bundle = _bundle
            .pipe(vinylBuffer())
            .pipe(uglify({
              compress: {
                drop_console: true,
                global_defs: {
                  RELEASE: !CONFIG.isServe,
                  DEBUG: CONFIG.isServe
                }
              }
            }));
        // }
        _bundle = _bundle
          .pipe(gulp.dest( CONFIG.isVendor ? "app/scripts/libs" : CONFIG.getDestination('scripts') ));
      }


      return _bundle;
    });

    if (typeof done === 'function') {
      es.merge(tasks).on('end', done);
    }
  });
}
