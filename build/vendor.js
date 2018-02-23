const webpack = require('webpack');
var path = require('path')
const fs = require('fs')
const utils = require('./utils')

var merge = require('webpack-merge')
var SentryPlugin = require('webpack-sentry-plugin');
var appConfig = require('./app-config');
var appConfig = appConfig.config;

const vendors = [
	'babel-polyfill',
	// ...babelRuntimeHelpers,
	// ...babelRuntimeCoreJs,
	'vue/dist/vue.esm.js', 'axios', 'vue-router', 'moment', 'moment/locale/zh-cn', 'qs', 'md5'

];


webpackConfig = {
	output: {
		path: utils.distPath,
		filename: '[name].[chunkhash:8].js',
		library: '[name]_[chunkhash:8]',
	},
	entry: {
		vendor: vendors,
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			},
			output: {
				comments: false
			},
			sourceMap: false
		}),
		new webpack.DllPlugin({
			path: utils.resolve("vendor_manifest.json"),
			name: '[name]_[chunkhash:8]',

		}),
		new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(zh-cn)$/)
	],
};
if (process.argv[1].indexOf('vendor.js') > -1) {
	if (process.env.npm_config_report) {
		var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
		webpackConfig.plugins.push(new BundleAnalyzerPlugin({analyzerPort:8081}))
	}
	webpack(webpackConfig, function (err, stats) {

		if (err) throw err
		process.stdout.write(stats.toString({
			colors: true,
			modules: false,
			children: false,
			chunks: false,
			chunkModules: false
		}) + '\n\n')

		//   startServer();
	})
}
if (process.argv[1].indexOf('vendor.js') > -1) {
	build();
}
function build (cb) {
	if(process.env.NODE_ENV === 'production') {
		webpackConfig.plugins.push(new SentryPlugin(merge(appConfig.SENTRY_CONFIG, { release: appConfig.RELEASE })));
	}
	webpack(webpackConfig, function (err, stats) {
		if (err) throw err
		process.stdout.write(stats.toString({
			colors: true,
			modules: false,
			children: false,
			chunks: false,
			chunkModules: false
		}) + '\n\n')
		cb&&cb();

		
	})
}
module.exports = {
	build
}