const gulp = require('gulp');

const styles = require('./_styles');
const scripts = require('./_scripts');
const pug = require('./_pug');
const clean = require('./_clean');
const increaseVersion = require('./_increaseVersion');
const pkg = require('../utils/package');
const {copyAssets} = require('./_assets');
const CONFIG = require('./config');

function build(...args){
  gulp.series(
    gulp.parallel(clean, versioned(pkg.increaseVersion)),
    gulp.parallel(copyAssets, styles(), scripts),
    pug,
    versioned(increaseVersion)
  )(...args);
}


build.description = 'Сборка';
module.exports = build;


function versioned(fn) {
  return CONFIG.noVersion ? cb=>cb() : fn;
}
