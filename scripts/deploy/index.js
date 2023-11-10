const gulp = require("gulp");
const fs = require("fs");

const getGitBranch = require("./getGitBranch");
const getParams = require("./getParams");
const getTasks = require("./getTasks");

const DEPLOY = ["dist/**/*", { base: "dist", buffer: false }];

async function main() {
  const branch = await getGitBranch();
  const params = await getParams(branch);
  const tasks = getTasks(params);

  if (tasks) {
    const _tasks = !Array.isArray(tasks) ? [tasks] : tasks;

    if (_tasks.length) {
      return _tasks.reduce(
        (src, filter) => src.pipe(filter),
        gulp.src(...DEPLOY)
      );
    }
  }

  return null;
}

function saveCommitData(cb) {
  const date = new Date();
  const MSK = 180;
  date.setTime(Date.now() + (MSK - date.getTimezoneOffset()) * 60 * 1000);
  fs.appendFile(
    "./app/deploy-log.txt",
    `${process.env.CI_COMMIT_REF_NAME} ${process.env.CI_COMMIT_SHA} ${timestamp(date)} ${process.env.GITLAB_USER_EMAIL} \n`,
    function onAppend(err) {
      if (err) {
        console.log(err);
      }
      cb();
    }
  );
}

function timestamp(date) {
  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  // return date.toLocaleString("ru");
}

module.exports = async function(...args) {
  const branch = await getGitBranch();
  return gulp.series(
    saveCommitData,
    branch === "master" ? "build" : `build_${branch}`,
    main
  )(...args);
};
