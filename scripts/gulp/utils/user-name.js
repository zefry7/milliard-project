const execSync = require('child_process').execSync;
const _ = require('lodash');

let author;

module.exports = function getUserName() {
  author = author || _.trim(String(execSync('git config user.name')));
  return author;
};
