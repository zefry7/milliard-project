const path = require('path');
const watchify = require('watchify');
const browserify = require('browserify');
require('babelify');

const _ = require('lodash');
const _if = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');

const pkg = require('../utils/package');
const read = require('../utils/read');
const unique = require('../utils/unique');
const baseUrl = require('../utils/baseUrl');

const outputDependenciesList = () => false;
const rootFontSize = 16;
const buildDir = "dist";
const htdocs = ""; //"htdocs/";

const info = {
  getCurrentProjectDir: pkg.getCurrentProjectDir,

  init(params) {
    return (cb) => {
      _.assign(info, params);
      cb();
    }
  },

  plumber: () => plumber({errorHandler: notify.onError('Error: <%= error.message %>')}),

  getDestinationRoot() {
    return baseUrl(info.isBitrix ? "" : htdocs, buildDir);
  },

  getDestination(dir) {
    return info.isBitrix
      ? `./${buildDir}/local/templates/${info.bitrixTemplateName}/${dir}`
      : baseUrl(`${htdocs}${dir}`, buildDir)
  },

  rootFontSize,
  author: require("./utils/user-name"),

  isServe: false,
  isDev: false,
  isBitrix: false,
  noVersion: false,

  getBrowserify,

  bitrixTemplateName: pkg.getProjectName(),

  sourcemaps: {
    init: () => _if(info.isServe, sourcemaps.init()),
    write: () => _if(info.isServe, sourcemaps.write())
  },
  getData: () => {
    switch (true) {
      case info.isServe: return DEBUG;
      case info.isDev: return DEV;
      case info.isBitrix: return BITRIX;
      default: return RELEASE;
    }
  }
};
module.exports = info;

const DEBUG = {
  rem: rootFontSize,
  read,
  require,
  unique: unique(),
  pkg,
  _,
  debug: true,
  release: false,
  base_url: base_url(''),
  template_url: base_url(''),
  dist: base_url(''),
  htdocs,
  copyright: 'app/components/copyright.json',
  php: false,
  env: info
};
const RELEASE = _.assign({}, DEBUG, {
  php: false,
  debug: false,
  release: true
});
const DEV = _.assign({}, RELEASE, {
});
const BITRIX = _.assign({}, RELEASE, {
  template_url: base_url(`/local/templates/${info.bitrixTemplateName}/`),
  htdocs: "",
  base_url: base_url('/'),
  copyright: 'app/components/copyright_bitrix.json'
});

const _browserify = {};


function base_url(_base_url) {
  return (str, suffix) => {
    return (suffix ? suffix + '/' : '') + (_base_url + (str || '')).replace(/\/{2}/g, '/');
  }
}


function getBrowserify(entry) {
  if (!entry) return _browserify;
  if (_browserify[entry]) return _browserify[entry];

  const customOpts = {
    entries: [entry], // './app/scripts/main.js'],
    debug: info.isServe || info.isDev,
    transform: ['babelify']
  };
  if (info.isServe) {
    customOpts.plugin = [watchify];
  }
  const opts = _.assign({}, watchify.args, customOpts);
  const b = browserify(opts);
  _browserify[entry] = b;

  if (outputDependenciesList()) {
    const _replace = pathReplace(__dirname);
    const through = require('through2').obj;
    b.pipeline.get('deps').push(through(
      function traceDeps(row, enc, next) {
        const dep = _replace(row.file || row.id);
        const filtered = Object.keys(row.deps).filter(itm => /^[^.]/.test(itm));
        if (filtered.length > 0) {
        // if (/node_modules/.test(dep)) {
          console.log('\x1b[32m%s\x1b[0m', dep);
          console.log(`  ${filtered.join("\n  ")}`);
        }
        next(null, row);
      }
    ));
  }
  return b;

  function pathReplace(dir) {
    dir = require('path').resolve(dir, '../../');
    return path => path.replace(dir, '');
  }
}
