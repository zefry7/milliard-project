const path = require("path");
const _ = require("lodash");
const {task, src, dest} = require("gulp");
const {Font, woff2} = require("fonteditor-core");
const {obj: through} = require("through2");

const cssFontTemplate = cssFont`@font-face {
  font-family: '${"name"}';
  src: ${cssFont`url('${"path"}') format('${"format"}')`};
  font-weight: ${"weight"};
  font-style: ${"style"};
}
`;

task("fonts", () => {
  return src(["app/fonts/**/*.@(otf|ttf|OTF|TTF)"], {base: "app/"})
    .pipe(fonter({
      subset: subset(subsetRange(32, 126), subsetRange(1040, 1103), "₽ёЁz¢£¥¨©«®´¸»ˆ˚˜–—‘’‚“”„•…‹›€™"),
      formats: ["woff", "woff2"]
    }))
    .pipe(dest("app/"));
});

function subsetRange(from, to) {
  const arr = [];
  for (let i = getVal(from), last = getVal(to); i <= last; i++) {
    arr.push(i);
  }
  return arr;

  function getVal(val) {
    return typeof val === "string" ? val.charCodeAt(0) : +val;
  }
}

function subset(...args) {
  return args.reduce(init, []);

  function init(arr, item) {
    switch (typeof item) {
      case "number":
        arr.push(item);
        break;
      case "string":
        arr.push(...item.split("").map(l => l.charCodeAt(0)));
        break;
      default:
        if (Array.isArray(item)) {
          arr.push(...item);
        }
        break;
    }
    return arr;
  }
}

const woff2init = (() => {
  let promise;
  return () => {
    if (!promise) {
      promise = woff2.init();
    }
    return promise;
  };
})();


/**
 *
 * @param {object} options
 * @param {['ttf'|'woff'|'woff2'|'eot'|'otf'|'svg']} options.formats
 * @param {[]?} options.subset
 * @param {boolean?} options.hinting
 * @param {boolean?} options.compound2simple
 * @param {function?} options.inflate
 * @param {boolean?} options.combinePath
 */
function fonter(options) {
  const list = [];
  let json;
  return through(
    async function fonterInner(chunk, enc, callback) {
    const ext = path.extname(chunk.path);
    const filename = path.basename(chunk.path, ext);
    const dir = path.dirname(chunk.path);

    if (!json) {
      json = chunk.clone({ contents: false });
      // json.path = path.resolve(chunk.cwd, chunk.base, "styles", "_fonts.scss");
      json.path = path.resolve(chunk.cwd, chunk.base, "fonts", "fonts.css");
    }
    await woff2init();

    const font = Font.create(chunk.contents, _.assign({type: ext.substr(1).toLowerCase()}, options));

    const fontItem = parseFont(font.get());
    list.push(fontItem);

    options.formats.forEach(type => {
      const file = chunk.clone({ contents: false });
      file.path = `${dir}${path.sep}${filename.replace(/\s+/g, "-")}.${type}`;
      file.contents = font.write({type});

      fontItem.src.push({
        path: path.relative(path.dirname(json.path), file.path).split(path.sep).join("/"),
        format: type,
      });

      this.push(file);
    });

    callback();
  },
    function addJSON(cb) {
      if (json) {
        // const content = JSON.stringify(list, null, "  ");
        const content = list.map(cssFontTemplate).join("\n");

        json.contents = Buffer.from(content);
        this.push(json);
      }
      cb();
    }
  );
}

function parseFont({name: fontInfo}) {
  const weights = {
    normal: 400,
    regular: 400,
    bold: 700,
    thin: 100,
    extra_light: 200,
    ultra_light: 200,
    light: 300,
    medium: 500,
    semi_bold: 600,
    demi_bold: 600,
    extra_bold: 800,
    ultra_bold: 800,
    black: 900,
    heavy: 900,
  };

  let weight = "normal";
  let style = "normal";
  let unknownSubFamily = false;
  const subFamily = fontInfo.preferredSubFamily || fontInfo.fontSubFamily;

  if (subFamily) {
    const sub = subFamily.toLowerCase().split(" ");
    const i = sub.indexOf("italic");
    if (i >= 0) {
      style = "italic";
      sub.splice(i, 1);
    }
    if (sub.length > 0) {
      if (weights.hasOwnProperty(sub[0])){
        weight = weights[sub[0]];
      } else if (+sub[0] > 0) {
        [weight] = sub;
      } else {
        unknownSubFamily = true;
      }
    }
  }

  const name = unknownSubFamily ? fontInfo.fontFamily : fontInfo.preferredFamily || fontInfo.fontFamily;

  return { name, weight, style, src: [] };
}





function cssFont(parts, ...keys) {
  return (info) => {
    return parts
      .reduce((str, part, i) => {
        switch (typeof keys[i]) {
          case "string":
            return str + part + info[keys[i]];
          case "function":
            return str + part + info.src.map(keys[i]).join(",\n    ");
          default:
            return str + part ;
        }
      }, '');
  };
}
