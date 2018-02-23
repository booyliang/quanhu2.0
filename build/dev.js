var vendor = require('./vendor')
var appConfig = require('./app-config')
vendor.build(() => { 
	appConfig.build();
	require('./dev-server')
})