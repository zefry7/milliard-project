const gulp = require('gulp');
const pkg = require('../utils/package');

const gulpIf = require('gulp-if');
const rename = require('gulp-rename');
const CONFIG = require('./config');
const assets = require('./_assets');

assets.add(copyBitrixAssets);

function bitrixTemplateName() {
  return pkg.getProjectName();
}

function initTemplate(bundle) {
  if (CONFIG.isBitrix){
    return bundle
      .pipe(gulpIf('local*/**/header.html', remove(/\s*<\/div>\s*<\/body>\s*<\/html>\s*$/igm)))
      .pipe(gulpIf('local*/**/footer.html', remove(/^\s*<html>\s*<body>\s*<div>\s*/igm)))
      .pipe(gulpIf(
        '**/templates/**/*',
        rename(function (path) {
          console.log(2, path.dirname, path.basename , path.extname);
          path.dirname = path.dirname.replace(/templates(\\|\/)[^/]+(\1|$)/, 'templates$1' + bitrixTemplateName() + '$2');
          path.extname = '.php';
        }),
        rename(function (path) {
          path.extname = '.php';
        })
      ))
  }

  return bundle;
}


function remove(regexp) {
  return require('through2').obj(function (chunk, enc, callback) {
    let contents = String(chunk.contents).replace(regexp, '');

    if (chunk.isBuffer() === true) {
      chunk.contents = new Buffer(contents)
    }
    callback(null, chunk);
  })
}

function copyBitrixAssets(cb){
  if (initGulpTasks()) {
    return gulp.parallel(bitrixCopyExtra).apply(this, arguments);
  } else {
    cb();
  }
}
function initGulpTasks(){
  if (CONFIG.isBitrix) {
    gulp.task('bitrix:copy_extra', bitrixCopyExtra);
    return true;
  }
}

function bitrixCopyExtra() {
  if (!CONFIG.isBitrix) return;

  return gulp.src(
    [
      'app/extra/**/*',
      '!**/*.pug',
      '!**/_*.php'
    ],
    {
      'dot': true,
      'nodir': true
    })
    .pipe(gulp.dest('dist'));
}


module.exports = {initTemplate, bitrixTemplateName};
