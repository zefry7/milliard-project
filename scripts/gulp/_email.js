const gulp = require('gulp');
const baseUrl = require('../utils/baseUrl');
const gulpRename = require('gulp-rename');
const gulpReplace = require('gulp-replace');
const Entities = require('html-entities').AllHtmlEntities;
const pug = require('gulp-pug');

const entities = new Entities();
let templateConfig;
try {
  templateConfig = require('../../app/template-mails/config.js');
} catch (e) {
  console.log(e)
}
module.exports = function () {
  if (!templateConfig) {
    return;
  }
  return gulp.series(
    'pug_templates',
    'compile_template-html',
    'compile_template-php',
    'compile_template-text'
  ).call();
};
gulp.task('pug_templates', () => {
  return gulp.src('app/template-mails/*.pug')
    .pipe(pug({
      basedir: '.'
    }))
    .pipe(gulp.dest(baseUrl('', 'app/template-mails')));
});

gulp.task('compile_template-html', () => {
  return generateHTML()
    .pipe(gulp.dest(baseUrl('', 'mails')));
});

gulp.task('compile_template-text', () => {
  const htmlClean = generateHTML();
  return cleanHTML(htmlClean).pipe(gulpRename(function (path) {
    path.basename += "-text";
    path.extname = ".php";
  }))
    .pipe(gulp.dest(baseUrl('', 'mails')));
});

gulp.task('compile_template-php', () => {
  return generatePHP().pipe(gulpRename(function (path) {
    path.basename += "-html";
    path.extname = ".php";
  })).pipe(gulp.dest(baseUrl('', 'mails')));
});

function cleanHTML(html) {
  html = html.pipe(gulpReplace(/<[^>]*>/g, ''))
    .pipe(gulpReplace(/\r\n/g, '<test>'))
    .pipe(gulpReplace(/\s\s/g, ''))
    .pipe(gulpReplace(/<test>/g, '\r\n'))
    .pipe(gulpReplace(/(\n\s*?\n)\s*\n/gi, '$1'))
    .pipe(gulpReplace(/&[a-z]+;/gi, function (match, entity) {
      return entities.decode(match);
    }));
  return html;
}


function generateHTML() {
  let html = gulp.src(['app/template-mails/*.html']);
  Object.keys(templateConfig).forEach((key) => {
    const type = templateConfig[key];
    Object.keys(type).forEach((key) => {
      const settings = type[key];
      html = html.pipe(gulpReplace(`{{${ key }}}`, function () {
        return settings.html || '';
      }));
    });
  });
  return html.pipe(gulp.dest(baseUrl('', 'mails')));
}

function generatePHP() {
  let php = gulp.src(['app/template-mails/*.html']);
  Object.keys(templateConfig).forEach((key) => {
    const type = templateConfig[key];
    Object.keys(type).forEach((key) => {
      const settings = type[key];
      php = php.pipe(gulpReplace(`{{${ key }}}`, function () {
        return settings.php || '';
      }));
    });
  });

  return php;
}
