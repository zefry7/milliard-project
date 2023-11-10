const _ = require('lodash');
const through = require('through2').obj;
const path = require('path');
const gulp = require('gulp');

const gulpPug = require('gulp-pug');
const gulpIf = require('gulp-if');
const gulpRename = require('gulp-rename');
const bitrix = require('./bitrix');
const baseUrl = require('../utils/baseUrl');
const CONFIG = require('./config');
const styles = require('./_styles');

module.exports = gulp.series(_styles(), pug);

function _styles() {
  return styles(through(function initPreloader(chunk, enc, callback) {
    CONFIG.getData()[path.basename(chunk.path, path.extname(chunk.path))] = String(chunk.contents);
    callback();
  }));
}

function pug() {
  const DATA = CONFIG.getData();
  const pugs = ['app/*.pug', '!app/**/_*.pug'];
  if (CONFIG.isBitrix) {
    pugs.push('app/extra/**/*.pug', '!app/limousine.pug', '!app/*test*.pug', '!app/car-component.pug');
  }
  let bundle = gulp.src(pugs, {dot: true})
    .pipe(through(function(chunk, enc, cb) {
      chunk.data = _.assign(
        chunk.data || {},
        {
          entry: {
            name: path.basename(chunk.path, path.extname(chunk.path))
          }
        }
      );
      cb(null, chunk);
    }))
    .pipe(CONFIG.plumber())
    .pipe(gulpPug({
      doctype: 'html',
      basedir: '.',
      data: _.assign({splitProperties, isTemplateEngine: 0}, DATA),
      pretty: true,
      plugins: [
        require("./utils/pug-plugin")({})
      ],
      filters: {
        'plain-text': text => text
      }
    }));

  if (CONFIG.isServe) {
    return bundle
      .pipe(gulp.dest(baseUrl('', '.tmp')))
      .pipe(require('browser-sync').stream());
  }

  bundle = bundle.pipe(require('../utils/appendVersion')(CONFIG.isDev ? Date.now() : ''));

  bundle = bitrix.initTemplate(bundle);

  return bundle
    .pipe(gulpRename((path) => {
      if (DATA.php) {
        path.extname = ".php";
      }
    }))
    .pipe(gulp.dest(CONFIG.getDestinationRoot()));
}



/**
 * Удаляет из объекта obj свойства с ключами удовлетворяющими условию test и возвращает их в новом объекте
 * @param {Object} obj
 * @param {Array|RegExp|{test:Function}} test - объект содержащий функцию test (например RegExp), в которую передается * название ключа, и которая возвращает Boolean - удалять свойство или нет
 * @return {{}}
 */
function splitProperties(obj, test){
  if (Array.isArray(test)) {
    test = TestArray(test);
  }

  return Object.keys(obj).reduce((res, key)=>{
    if (test.test(key)) {
      res[key] = obj[key];
      delete obj[key];
    }
    return res;
  }, {});

  function TestArray(arr){
    return {
      test: itm=>arr.indexOf(itm) >= 0
    }
  }
}
