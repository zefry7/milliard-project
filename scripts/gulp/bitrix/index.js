const _ = require('lodash');
const gulp = require('gulp');
const path = require('path');
const through = require("through2").obj;
const gulpIf = require('gulp-if');
const gulpRename = require('gulp-rename');

const CONFIG = require('../config');
const assets = require('../_assets');


assets.add(copyBitrixAssets);

function initTemplate(bundle) {
  if (CONFIG.isBitrix){
    return bundle
      .pipe(gulpIf('**/local/templates/**/header.*', split()))
      .pipe(gulpIf(
        '**/templates/**/*',
        gulpRename((path) => {
          path.dirname = path.dirname.replace(/templates(\\|\/)[^/]+(\1|$)/, `templates$1${CONFIG.bitrixTemplateName}$2`);
          path.extname = '.php';
        })
      ))
      // .pipe(gulpIf("*", initComponents()))
      .pipe(initComponents())
      .pipe(initBitrixText())
  }

  return bundle;
}

function initComponents() {
  return through(function (chunk, enc, callback) {
    let str = String(chunk.contents);
    // console.log(chunk.base, path.dirname(chunk.path)===path.resolve(process.cwd(), "app"), path.dirname(chunk.path), path.resolve(process.cwd(), "app"));
    const dir = chunk.base; // path.resolve(process.cwd(), "app");

    const stack = [];
    // const regExp = /<!--\s*(bitrix-module-begin)(?:\s+(true|false))? ([^ ]+?)(?:\s+([^ ]+?))(?:\s+({.+?}))?\s*-->\s*|\s*<!--\s*bitrix-module-end\s*-->/gm;
    const regExp = /<!--\s*(bitrix-module-begin)(?:\s+(.+?)\s*)?-->\s*|\s*<!--\s*bitrix-module-end\s*-->/gm;

    while (true) {
      const exec = regExp.exec(str);
      if (!exec) {
        break;
      }

      const [,isBegin, props] = exec;
      if (isBegin) {
        const {isAjax, component, template, params} = JSON.parse(props);
        // .ajax} !{content.component} !{content.template} !{JSON.stringify(content.params)}
        stack.push({
          component: /:/.test(component) ? component : `${CONFIG.bitrixTemplateName}:${component}`,
          template: template || '.default',
          params: params || {},
          isAjax,
          start: {
            from: exec.index,
            to: regExp.lastIndex
          }
        });
      } else {
        const part = stack.pop();

        const newChunk = chunk.clone({contents: false});
        newChunk.path = path.resolve(dir, `local/components/${part.component.replace(":", "/")}/templates/${part.template}/template.php`);
        newChunk.contents = Buffer.from(`${componentHeader()}\n${str.substring(part.start.to, exec.index)}`);

        this.push(newChunk);

        const oldLastIndex = regExp.lastIndex;
        let res = str.substring(0, part.start.from);
        if (!part.isAjax) {
          res += `\n${componentInclude(part)}`;
        } else {
          // const ajaxChunk = chunk.clone({contents: false});
          // ajaxChunk.path = path.resolve(dir, `local/components/${part.component.replace(":", "/")}/templates/${part.template}/template.php`);
          // ajaxChunk.contents = Buffer.from(ajaxChunk());
          //
          // this.push(ajaxChunk);
        }
        regExp.lastIndex = res.length;
        res += str.substring(oldLastIndex);
        str = res;
      }
    }

    chunk.contents = Buffer.from(str);
    callback(null, chunk);
  });
  /* return split({
    init(chunk) {
      const fileName = getFileName(chunk.path);
      return String(chunk.contents)
        .replace(/<template-name>/g, fileName)
        .replace(/\s*<!--\s*(.+?):(.+?)\s*-->\s*!/, ($0,c,t)=>{
          this.component = c;
          this.template = t;
          return "";
        });
    },
    process(chunk) {
      const dir = path.dirname(chunk.path);
      return (newChunk, i) => {
        if (i === 1) {
          newChunk.path = path.resolve(dir, `local/components/${CONFIG.bitrixTemplateName}/${this.component}/templates/${this.template}/template.php`)

        }
        return newChunk;
      }
    }
  });

  function getFileName(p) {
    return path.basename(p, path.extname(p))
  } */
  // return through(function _components(chunk, enc, callback) {
  //   const _component = chunk.clone({contents: false});
  //   _component.contents = component(chunk);
  //   _component.path = chunk.path + ".component.html";
  //
  //   this.push(_component);
  //   callback(null, chunk);
  // });
}

function initBitrixText() {
  return through(function _initBitrixText(chunk, enc, callback){
    chunk.contents = initArResult(chunk);
    callback(null, chunk);
  });

  function initArResult(chunk) {
    return Buffer.from(String(chunk.contents).replace(
      /<\?-\s*(.+?)\s*-\?>/mg,
      `<?= t($this, $arResult["$1"]) ?>`
      /*
      `<? $APPLICATION->IncludeComponent(
        "${CONFIG.bitrixTemplateName}:text}",
        ".default",
        array("id"=>"$1")
     );?>` */
    ));
  }
}

function split(info = {}) {
  if (typeof info === "string") {
    info = {sep: info};
  }
  const {init, sep, process} = _.assign({init: s => s.contents, process: defaultProcess, sep:"{__BITRIX_SPLIT__}"}, info);
  return through(function splitIn(chunk, enc, callback) {
    String(init(chunk))
      .split(new RegExp(`[ \t\r\n]*${sep}[ \t\r\n]*`, "m"))
      .map(str => {
        const part = chunk.clone({contents: false});
        part.contents = Buffer.from(str);
        return part;
      })
      .map(process(chunk))
      .filter(itm => !!itm)
      .forEach(itm => this.push(itm));

    callback();
  });

  function defaultProcess(chunk) {
    const names = ["header", "footer"];
    const ext = path.extname(chunk.path);
    const dir = path.dirname(chunk.path);
    return (newChunk, i) => {
      if (names[i]) {
        newChunk.path = path.resolve(dir, `${names[i]}${ext}`)
      }
      return newChunk;
    }
  }
}

function copyBitrixAssets(...args){
  if (CONFIG.isBitrix) {
    return gulp.parallel(bitrixCopyExtra)(...args);
  }

  return args[0]();
}

function bitrixCopyExtra() {
  if (!CONFIG.isBitrix) return undefined;

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

function componentHeader() {
  return `<?if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true) die();
  global $APPLICATION;
  /** @var array $arParams */
  /** @var array $arResult */
  /** @global CMain $APPLICATION */
  /** @global CUser $USER */
  /** @global CDatabase $DB */
  /** @var CBitrixComponentTemplate $this */
  /** @var string $templateName */
  /** @var string $templateFile */
  /** @var string $templateFolder */
  /** @var string $componentPath */
  /** @var CBitrixComponent $component */
  $this->setFrameMode(true);
?>`
}

function componentInclude({component, template, params}) {
  return `<? $APPLICATION->IncludeComponent(
  ${JSON.stringify(component)},
  ${JSON.stringify(template)},
  ${phpArray(params)},
  $component ?: false
);?>`
}

function ajaxPage(str) {
  return `<?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php"); ?>
<?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_after.php"); ?>

${str}

<? require($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/epilog_after.php"); ?>
`;
}

function phpArray(params) {
  return `Array(${Object.keys(params).map(key => `${JSON.stringify((`${key}`).toUpperCase())} => ${JSON.stringify(params[key])}`).join(",\n")})`;
}

module.exports = {initTemplate};
