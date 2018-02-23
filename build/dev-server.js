require('./check-versions')()
var path = require('path')

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}
var fs = require('fs');
var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')
var utils = require('./utils')
// default port where dev server listens for incoming traffic
let port = process.argv[2];
if (Number.isNaN(parseInt(port)))
	port = process.argv[3]|| config.dev.port;
	

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
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})
let proxys = proxyTable
// proxy api requests
// Object.keys(proxys).forEach(function (context) {
//   var options = proxys[context]
//   if (typeof options === 'string') {
//     options = {
//       target: options,
//       logLevel:'debug',
//       changeOrigin: true,
// 		headers:{Origin:'http://m-dev.ichinaresource.com'}
//     }
//     options.target=options.target
//     // options.target=options.target+'/app'
//   }
//   app.use(proxyMiddleware('/api/services' , options))
// })

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
app.use('/assets/static', express.static(path.join(__dirname, '..','src','common','assets','static')))

var uri = 'http://localhost:' + port
devMiddleware.waitUntilValid(function () {
  console.log('> Listening at ' + uri + '\n')
})

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
