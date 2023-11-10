const _ = require('lodash');
const fs = require('fs');
const path = require('path');

module.exports = read;

function read(_path, type, args) {
  if (typeof type === 'object') {
    args = type;
    type = undefined;
  }
  args = _.assign({}, args);

  type = type || _path.split(".").pop() || 'json';
  _path = path.resolve(path.resolve(__dirname, '../../'), _path);

  if (fs.existsSync(_path)) {

    let data = fs.readFileSync(_path, "utf-8");
    switch (type){
      case "json":
        data = JSON.parse(data);
        if (args.extend && data['@extend']) {
          data = _merge(read(path.resolve(path.dirname(_path), data['@extend']), type, args), data);
        }
        break;
      case "svg":
        data = data
          .replace('<?xml version="1.0" encoding="utf-8"?>', "")
          .replace(/<!--.+?-->/g, "");

        if (args.leaveId !== true) {
          data = data.replace(/\sid=".+?"/g, "");
        }
        break;
    }
    return data;
  } else {
    if (args.quite !== true) {
      console.error(`${_path} doesn't exist`);
    }
  }

  return "";

  function _merge(dst, src) {
    for (let i = 1; i < arguments.length; i++) {
      for (let p in arguments[i]) {
        if (arguments[i].hasOwnProperty(p)) {
          let srcType = getType(src[p]);
          let dstType = getType(dst[p]);
          switch (true) {
            case !dst.hasOwnProperty(p):
            case dstType !== srcType:
            case dstType === 'plain':
            case srcType === 'plain':
              dst[p] = arguments[i][p];
              break;

            default:
              _merge(dst[p], src[p]);
          }
        }

      }
    }
    return dst;
  }
  function getType(obj) {
    return Array.isArray(obj) ? 'array' : typeof obj === 'object' ? 'object' : 'plain';
  }
};
