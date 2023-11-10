const fs = require("fs");
const path = require("path");
const glob = require("glob");
const _ = require("lodash");
const read = require("../utils/read");
const toCamelCase = require("../utils/toCamelCase");
const slashes = require('../utils/slashes');

module.exports = options => {
  const opts = _.assign({template: "component/**/*"}, options);

  return ({saveTo, relativeSaveTo, name, componentName: _componentName}) => {
    const componentName = _componentName || name;

    const relativePath = slashes(path.relative(
      relativeSaveTo,
      "app/components/framework/jquery/plugins/plugins"
    ));

    const data = {
      author: JSON.stringify(require("../gulp/config").author()),
      package: JSON.stringify(componentName),
      description: JSON.stringify(`${componentName} - описание`),
      componentName,
      camelCase: toCamelCase(componentName),
      className: toCamelCase(componentName, true),
      appDir: slashes(path.relative(saveTo, path.resolve(process.cwd(), "app"))),
      relativePathNoExt: relativePath.replace(/\.[^./]+$/, "")
    };

    return new Promise(resolve => {
      glob(`${__dirname}/${opts.template}.*`, (err, matches) => {
        matches
          .map(f => {
            if (path.extname(f) === ".lodash") {
              return {
                name: getName(f.replace(".lodash", ""), name),
                content: _.template(read(f))(data)
              };
            }

            return {
              source: f,
              name: getName(f, name)
            }
          })
          .forEach(({source, name: _name, content}) => {
            const saveName = path.resolve(saveTo, _name);
            if (!fs.existsSync(saveName)) {
              fs.mkdir(path.dirname(saveName), { recursive: true }, () => {
                if (content) {
                  fs.writeFile(saveName, content, resolve);
                } else {
                  fs.copyFile(source, saveName, resolve);
                }
              });
            }
          });
      });
    });
  };
};

function getName(f, name) {
  let p = path.relative(__dirname, f);
  p = p.split(/[\\/]/g).slice(1).join("/");

  const fileName = path.basename(p).replace(/^template/, name);
  return path.join(path.dirname(p), fileName);
}
