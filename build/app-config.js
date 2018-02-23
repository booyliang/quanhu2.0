const merge = require('webpack-merge')
const fs = require('fs');
const path = require('path');
const Package = require('../package.json')

var baseConfig = require('../config/app.base.json');

let config = Object.assign({}, baseConfig);
let env = process.argv[3];
if (!env || !isNaN(parseInt(env))) {
	env = "dev";
}
let envConfig = require(`../config/app.${env}.json`);
config = merge(baseConfig, envConfig)
config.RELEASE = Package.version;
let appConfig = JSON.stringify(config, null, 2);

var build = function() {
	let configMain = [`var appConfig=${appConfig};`, 
		'export default Object.freeze(appConfig);'];
	fs.writeFileSync(path.join(__dirname,'..','src', 'common', 'config', 'app.js'), configMain.join('\n'), 'utf8');
}

if (process.argv[1].indexOf('app-config.js') > -1) {
	build();
}

module.exports = {
	build,
	config
}