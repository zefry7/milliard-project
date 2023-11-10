const gulp = require('gulp');
const CONFIG = require('./config');

let tasks = [copyAssetsRoot, copyAssetsTemplateFiles];

module.exports = {
  copyAssets,
  add:(...arr)=>{
    tasks = tasks.concat(arr);
  }
};

function copyAssets(...args) {
  return gulp.series(gulp.parallel(...tasks))(...args);
}

function assets(_glob, dst) {
  const params = {
    'dot': true,
    'nodir': true,
    'base': 'app'
  };

  return gulp.src(addIgnore(_glob), params)
    .pipe(gulp.dest(dst));
}

function copyAssetsRoot() {
  return assets([
    'app/*',
    '!app/*.{html,pug}',
    'app/data/**/*',
    '!app/data/$**/*',
    'app/assets/**/*',
    'app/video*/**/*'
  ], CONFIG.getDestinationRoot());
}


function copyAssetsTemplateFiles() {
  return assets(
    [
      'app/{scripts,styles}/libs/**/*',
      'app/fonts/**/*',
      'app/images/**/*',
    ],
    CONFIG.getDestination('')
  );
}


function addIgnore(list){
  return list.concat([
    '!app/**/bak*/**/*',
    '!app/**/*.{bak,fla}',
    '!app/**/bak*.*',
    '!app/**/.gitignore',
    '!app/**/.npmignore'
  ])
}
