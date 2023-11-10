const yargs = require('yargs');

function argv(key, _default = false){
	return yargs.argv[key] || _default;
}

module.exports = argv;