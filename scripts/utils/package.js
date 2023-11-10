const read = require('./read');

let version;
let _isVersionIncreased;

function getPackage() {
  return read("package.json");
}

module.exports = { getVersion, getProjectName, getProjectDescription, getProjectId, increaseVersion, getCurrentProjectDir, getProjectDirById, getPackage};


function getVersion(suffix) {
  version = version || `${getPackage().version}${suffix ? `_${suffix}` : ''}`;
  return version;
}

function getProjectName() {
  let pkg = getPackage();
  return pkg.project_name || pkg.name;
}

function getProjectDescription() {
  let pkg = getPackage();
  return pkg.description;
}

function getProjectId() {
  let pkg = getPackage();
  return pkg.project_id || '000000';
}


function getCurrentProjectDir() {
  return getProjectDirById(getProjectId())
}
function getProjectDirById(id) {
  return `/20${id.substr(0,2)}/${id}/`;
}

function increaseVersion(cb) {
  if (!_isVersionIncreased) {
    _isVersionIncreased = true;
    version = getVersion().replace(/(\d+\.\d+\.)(\d+)/, (...args)=>args[1] + (++args[2]));
  }

  if (typeof cb === 'function') {
    cb();
  }
  return version;
}
