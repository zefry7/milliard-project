const watch = require('gulp-watch');
const path = require('path');
const gulp = require('gulp');
const templates = require('../templates/templates');

module.exports = (browserSync) => {
  watch([
    'app/images/**/*',
    'app/fonts/**/*'
  ], browserSync.reload);

  watch(excludeTmp(['app/**/*.scss', 'app/styles/**/*']), gulp.parallel('styles'));
  watch(excludeTmp(['app/**/*.{html,pug,json}', '!**/*_bitrix.json']), gulp.parallel('pug'));
  watch(excludeTmp(['app/components/**/*.svg']), gulp.parallel('pug'));
  watch(excludeTmp(['app/components/**/*.js']), gulp.parallel('lint'));


  //TODO on addDir создавать пустые файлы, шаблоны записывать во все создаваемые пустые файлы
  const ignore = "svg|lib|libs|js|assets|images|utils|plugins";
  watch(excludeTmp([
    'app/apps/*',
    'app/components/*/**/*',
    `!app/{components/*,apps}/?(**/)@(${ignore})?(/**/*)`
  ]))
    .on('addDir', (dirPath, stat) => {
      const relative = path.relative(process.cwd(), dirPath);

      const isApps = /app[\\/]apps/.test(relative);
      const name = path.basename(dirPath);

      templates(isApps ? {template: "{apps/**/*,component/**/*.{scss,js}?(.*)}"} : {})({
        name,
        componentName: isApps ? `app-${name}` : undefined,
        saveTo: dirPath,
        relativeSaveTo: relative
      });
    });

  function excludeTmp(list) {
    list.push( '!**/*___jb_tmp___' );
    return list;
  }

  // watch('app/components/svg/symbols/*.svg', start(['svg']));
};
