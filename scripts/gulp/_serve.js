const gulp = require('gulp');

const browserSync = require('browser-sync');
const proxy = require('http-proxy-middleware');

const styles = require('./_styles');
const scripts = require('./_scripts');
const lint = require('./_lint');
const pug = require('./_pug');

const CONFIG = require('./config');
const {getProjectId} = require('../utils/package');

const createProxyMiddleware = typeof proxy === "function" ? proxy : proxy.createProxyMiddleware;

module.exports = gulp.series(
  require('./_clean'),
  gulp.parallel(styles(), scripts/*, lint, 'svg'*/),
  pug,
  run
);

function run(cb) {
  const middleware = [];
  const srvMiddleware = getMiddleware();
  if (srvMiddleware.pathRewrite) {
    middleware.unshift(pathRewrite(srvMiddleware.pathRewrite));
  }
  if (srvMiddleware.proxy) {
    middleware.unshift(createProxyMiddleware(...srvMiddleware.proxy));
  }


  browserSync({
    notify: false,
    port: 9000,
    logLevel: 'warn',
    https: false,
    server: {
      baseDir: ['.tmp', 'app'],
      serveStaticOptions: {
        extensions: ['html']
      },
      middleware: middleware
    }
  });


  let b = CONFIG.getBrowserify();
  for (let p in b) {
    b[p].on('update', scripts); // on any dep update, runs the bundler
    b[p].on('log', console.log); // output build logs to terminal
  }


  require('./watch')(browserSync);
}

function pathRewrite(rules) {
  return (req, res, next) => {

    req.url = rules.reduce(function (url, rule) {
      if (["string", "function"].indexOf(typeof rule.path) >= 0) {
        return url.replace(rule.test, rule.path);
      }
      return url;
    }, req.url);

    return next();
  };
}

function getMiddleware() {
  /**
   Если от codeigniter (cms, которую использует Женя для API) приходит `Disallowed Key Characters`,
   то проблема, скорее всего, в том, что среди COOKIE в localhost есть параметр содержащий @ в названии
   */
  return {
    proxy: [
      "/api/**/*",
      {
        target: `https://${getProjectId()}.dev.peppers-studio.ru`,
        // auth: "user:password",
        // logLevel: "debug",
        changeOrigin: true
      }
    ],
    pathRewrite: [
      {
        test: /^\/(.+)\/$/,
        path: "/$1.html"
      }
    ]
  };
}
