module.exports = require("through2").obj((chunk, enc, callback)=>{callback(null, chunk)});
