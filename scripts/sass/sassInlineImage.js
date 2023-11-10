const fs        = require('fs');
const path      = require('path');
const types     = require('node-sass').types;
const getValue  = require('./sassGetValue');

const filters = {
  'replace': (source, info)=>source.replace(info[0], info[1])
};

module.exports = function sassInlineImage(options) {
  options = options || {};
  options.base = options.base || process.cwd();


  function inlineImage(filePath, props, done) {
    let _props = getValue(props);
    let file = path.resolve(options.base, filePath.getValue());
    let ext  = file.split('.').pop();

    let data = fs.readFileSync(file);
    if (_props) {
      Object.keys(_props)
        .forEach(key=>{
          if (filters.hasOwnProperty(key)) {
            data = filters[key](data.toString(), _props[key]);
          }
        });
    }
    let buffer = Buffer.alloc(data.length, data);
    data = ext === 'svg' ? svg(buffer, ext) : img(buffer, ext);
    return types.String(data);
  }

  return {
    'inline-image($file, $props:null)': inlineImage
  };
};

function svg(buffer) {
  let svg = buffer.toString()
    .replace(/[\n\r]/g, '')
    // .replace(/\#/g, '%23')
    // .replace(/\"/g, '\'')
  ;

  return '"data:image/svg+xml,' + encodeURIComponent(svg) + '"';
}

function img(buffer, ext) {
  return '"data:image/' + ext + ';base64,' + buffer.toString('base64') + '"';
}
