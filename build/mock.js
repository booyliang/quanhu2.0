require('./check-versions')()
var path = require('path')

var config = require('../config')
if (!process.env.NODE_ENV) {
	process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
  }
var mockGroupUrl = 'http://rap.yryz.com/org/group/all.do?productlineId=3';
var mockLoginUrl = 'http://rap.yryz.com/account/doLogin.do';
var qs = require('qs')
var fs = require('fs');
var opn = require('opn')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')
var utils = require('./utils')
var axios = require('axios')
var pathToRegexp = require('path-to-regexp')

function trim(str, char) {
	let reg = new RegExp(`^[${char}]+|[${char}]+$`, 'g');
	return str.replace(reg, '');
}
var mockAccount = {
	account: 'aiqingmin',
	password: '123456'
};
var mockApiUrl = 'http://rap.yryz.com/mock/getWhiteList.do?projectId=';
var routeApis = [];

if (!process.env.NODE_ENV) {
	process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}


// default port where dev server listens for incoming traffic
let port = process.argv[3] || config.dev.port;

// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()
var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
	publicPath: webpackConfig.output.publicPath,
	quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
	log: () => {}
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
	compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
		hotMiddleware.publish({
			action: 'reload'
		})
		cb()
	})
})
let appName = process.argv[2];


// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)
// 模拟用户登录，请求RAP all project mock Apis
var session = null;
let axiosInst = axios.create();
let request = require('request')
let loginParam = {
	url: mockLoginUrl,
	method: 'POST',
	headers: {
		ContentType: 'application/x-www-form-urlencoded'
	},
	form: mockAccount,
}
request(loginParam, (err, res) => {
	session = res.headers['set-cookie']; // 获取set-cookie字段值 
	// session = session[0];	
	// session = session.substr(session.indexOf('\'') + 1, session.indexOf(';') - session.indexOf('\'') )	
	// console.log("session", session);
	getAllProjects(session)
});

// get all mock project info to a file
function getAllProjects(session) {
	let groupRequest = {
		url: mockGroupUrl,
		method: 'get',
		headers: {
			Cookie: session
		}
	}
	axiosInst.request(groupRequest)
		.then((res) => {
			let groupList = res.data && res.data.groups;
			groupList = groupList.filter((projectItem) => {
				return projectItem.projects.length;
			});

			let projects = [];
			for (let group of groupList) {
				// console.log(group)
				projects.push(...group.projects)
			}
			
			return projects;
		}).then((data) => { //获取各个项目的接口
			let projectApis = data.map(item => {
				return axios.get(mockApiUrl + item.id)

			})
			axios.all(projectApis)
				.then(res => {
					let apiList = [];
					for (let item of res) {
						// console.log(item.request.path)
						let path = item.request.path;
						let parts = path.split('=');
						let pid = parts[parts.length - 1];
						let apis =  item.data
						//.filter(api=>api.indexOf(''))
						 .map(api=>{
							let apiPath = api.replace(/\{[^\}]+\}/g,(m)=>{
								// console.log(m);
								return ':'+ m.substr(1,m.length-2)});
							apiPath = '/'+ trim(apiPath,'/').trim()
							let keys = []
							let re = pathToRegexp(apiPath.split('?')[0], keys)
							return {api,pid:pid, apiPath,re,keys }
						})
						apiList.push(...apis)
					}
					routeApis = apiList;
					// fs.writeFile('./dist/project/apiList.js', JSON.stringify(apiList));
					
				})

		
		});

}



function listenMock() {	
	// 请求处理
	app.all(/qshop-open-api\/services\/.*/, function (req, res, next) {
		let baseHost = 'http://rap.yryz.com/mockjsdata/';
		let reqPath = req.path;
		for (let route of routeApis){
			let {re,api} = route;
			reqPath = reqPath.replace('/qshop-open-api/services','/services');
			if (re.exec(reqPath)) {
				let mockUrl = baseHost + path.join(route.pid, route.api);
				console.log('mockUrl', mockUrl);
				return request(mockUrl).pipe(res);
			} else if (reqPath.indexOf('detail.sgt') >= 0 && route.api.indexOf('detail.sgt') >= 0) { 
				console.log(route, reqPath);
			}
		}
		console.error('无法找到对应的mock接口', reqPath);
		res.json({code:500,msg:'无法找到对应的mock接口'+ reqPath});
	

	})
}

// serve pure static assets
var staticPath = path.join(__dirname, '..', 'src', 'modules', appName, 'static')
if (fs.existsSync(staticPath)) {
	app.use('/' + appName + '/static', express.static(staticPath))
}
app.use('/assets', express.static(path.join(__dirname, '..', 'src', 'common', 'assets')))
app.use('/assets/js', express.static(path.join(__dirname, '..', 'dist', 'assets', 'js')))
var uri = 'http://localhost:' + port + '/' + appName + '/'
devMiddleware.waitUntilValid(function () {
	console.log('> Listening at ' + uri + '\n')
})
listenMock();
module.exports = app.listen(port, function (err) {
	if (err) {
		console.log(err)
		return
	}

	// when env is testing, don't need open it
	if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
		opn(uri)
	}
})
