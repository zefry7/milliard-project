const through = require('through2').obj;
const gulp = require('gulp');
const Typograf = require("typograf");
const gulpTypograf = require("gulp-typograf");
const gulpRename = require("gulp-rename");

// npm install --save-dev gulp-typograf@latest typograf@latest

function jsonTypograf(params) {
  var typograf = new Typograf({
    locale: ['ru', 'en-US'],
    htmlEntity: { type: 'name' }
  });

  if (params.disableRules) {
    params.disableRules.forEach(typograf.disableRule.bind(typograf));
  }


  return through(function (chunk, enc, callback) {
    var contents = String(chunk.contents);
    var data = JSON.parse(contents);
    data = removeBR(data, params.remove_br);
    data = doTypograf(data);

    contents = JSON.stringify(data, null, "  ");

    if (chunk.isBuffer() === true) {
      chunk.contents = new Buffer(contents)
    }
    callback(null, chunk);
  });





  function removeBR(data, target) {
    if (Array.isArray(data)) {
      data = data.map(_do)
    } else {
      if (Array.isArray(target)) {
        for (var i = 0; i < target.length; i++) {
          data = removeBR(data, target[i]);
        }
      } else {
        switch (typeof target) {
          case "string":
            if (target) {
              target = target.split(".");
              var valueName = target.shift();
              if (data.hasOwnProperty(valueName)) {
                data[valueName] = removeBR(data[valueName], target.join("."));
              }
            } else if (typeof data === "string") {
              data = data.replace(/<br\/?>/g, " ");
            }
            break;
        }
      }
    }

    return data;

    function _do(itm) {
      return removeBR(itm, target)
    }
  }
  function doTypograf(data) {
    switch (typeof data) {
      case "string":
        return /[а-яА-ЯёЁ]/.test(data) ? typograf.execute(data) : data;
      case "object":
        for (var p in data) {
          if (data.hasOwnProperty(p)) {
            data[p] = doTypograf(data[p]);
          }
        }
        break;
    }
    return data;
  }
}



gulp.task('typograf', function () {
  return gulp.src(["app/dist/**/*.{html,php}"])
    .pipe(gulpTypograf({
      locale: ['ru', 'en-US'],
      htmlEntity: { type: 'name' }
    }))
    .dist("app/dist");
});
gulp.task('typograf:json', function () {
  return gulp.src(["app/data/*.json", "!app/data/*-typograf.json"])
    .pipe(jsonTypograf({
      "remove_br": ["description", "points.modal.text.text"],
      //TODO добавить обработку только тех полей, которые указаны в поле typograf, сейчас обрабатываются все поля, в которых есть русский текст
      "typograf": "",
      "disableRules": [
        /**
         * Правила https://github.com/typograf/typograf/blob/dev/docs/RULES.ru.md
         */
        "ru/money/*",
        "common/nbsp/replaceNbsp",
        "common/space/delLeadingBlanks",
        "common/space/delTrailingBlanks",
        "common/space/trimLeft",
        "common/space/trimRight"
      ]
    }))
    // .pipe(gulpRename({
    //   suffix:"-typograf"
    // }))
    .pipe(gulp.dest("app/data"));
});
