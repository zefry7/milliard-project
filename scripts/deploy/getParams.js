const {getProjectId} = require('../utils/package');
const yargs = require('yargs');
const _ = require('lodash');
const toCamelCase = require('../utils/toCamelCase');
const {getCurrentProjectDir} = require('../utils/package');

const alias = initAlias(['pass', 'password'], ['user', 'login']);

const _DEFAULTS = {
	"dev": {
		type: 'local',
		dir: `/mnt/diskstation/web/dev${getCurrentProjectDir()}htdocs/`
	}
};

function getParams(branch) {
  return _.assign({branch}, alias(_DEFAULTS[branch]), alias(getEnv(process.env, branch)), alias(yargs.argv));

  function getEnv(env, b) {
    let regExp = new RegExp(`^${branch}__deploy_(.+)`);
    return Object.keys(env)
      .reduce((res, key) => {
        let _parseKeyResult = regExp.exec(key);
        if (_parseKeyResult) {
          res[toCamelCase(_parseKeyResult[1])] = env[key];
        }
        return res;
      }, {});
  }
}

function initAlias(...aliases) {
  return (obj) => {
    if (obj) {
      aliases.forEach(aliasesList=>{
        for (var i = 0; i < aliasesList.length; i++) {
          if (obj.hasOwnProperty(aliasesList[i])) {
            obj[aliasesList[0]] = obj[aliasesList[i]];
            return;
          }
        }
      });
    }

    return obj;
  }
}

module.exports = getParams;
