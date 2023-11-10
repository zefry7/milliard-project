const path = require('path');
const fs = require('fs');
const express = require('express');
const _ = require('lodash');

function run(port, params) {
  return new Promise((resolve, reject)=>{
    const app = express();
    app.set('views', __dirname);
    app.engine('html', lodashTemplateEngine);
    app.set('view engine', 'html');
    app.use(express.static(path.resolve(__dirname, '../app/')));

    let httpServer = require('http').createServer(app);
    httpServer.listen(port, ()=>{resolve(httpServer); console.log('listen on port', 8800)})
      .on('error', error=>reject(error));


    app.get('/', function(req, res, next) {
      res.render('index', _.assign(params, req.query));
    });
  })
}

exports.server = run;


function lodashTemplateEngine(filePath, options, callback) { // define the template engine
  fs.readFile(filePath, function (err, content) {
    if (err) return callback(new Error(err));
    return callback(null, _.template(content.toString())(options));
  });
}
