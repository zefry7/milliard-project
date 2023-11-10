const {execSync} = require('child_process');
const argv = require('./argv');

async function getGitBranch(){
	return process.env.CI_COMMIT_REF_NAME || argv('branch') || execSync('git rev-parse --abbrev-ref HEAD').toString().replace(/^\s*|\s*$/g, '');
}

module.exports = getGitBranch;