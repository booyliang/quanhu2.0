var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')

var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
var SentryPlugin = require('webpack-sentry-plugin');
var appConfig = require('./app-config');
var appConfig = appConfig.config;

var fs = require('fs');
var env = config.build.env;
let assetsCommon = 'dist/assets';
let circleDist = 'dist';
config.build.assetsRoot = config.build.assetsRoot;
var webpackConfig = merge(baseWebpackConfig, {
	devtool: config.build.productionSourceMap ? '#source-map' : false,
	output: {
		path: config.build.assetsRoot,
		filename: '[name].[hash:8].js',
		// chunkFilename: '[id].[hash:8].js'
	},
	module: {

		rules: [{
			test: /\.css$/,
			loader: ExtractTextPlugin.extract({
				use: ['css-loader', 'postcss-loader'],
				fallback: 'vue-style-loader'
			}),

		}, ]
	},
	plugins: [
		new webpack.IgnorePlugin(/eruda$/),
		// http://vuejs.github.io/vue-loader/en/workflow/production.html
		new webpack.DefinePlugin({
			'process.env': env
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			},
			sourceMap: false,
			output: {
				comments: false
			},
		}),
		// extract css into its own file
		new ExtractTextPlugin({
			filename: '[name].[contenthash:8].css'
		}),
		// Compress extracted CSS. We are using this plugin so that possible
		// duplicated CSS from different components can be deduped.
		new OptimizeCSSPlugin({
			cssProcessorOptions: {
				safe: true
			}
		}),
		new SentryPlugin(merge(appConfig.SENTRY_CONFIG, { release: appConfig.RELEASE }))
	]
})

let staticDir = utils.resolve('src', 'app', 'static');

if (fs.existsSync(staticDir)) {
	console.log('copy static Dir', staticDir)
	webpackConfig.plugins.push(
		new CopyWebpackPlugin([{
			from: staticDir,
			to: config.build.assetsSubDirectory,
			ignore: ['.*']
		}])
	);
}



if (config.build.productionGzip) {
	var CompressionWebpackPlugin = require('compression-webpack-plugin')

	webpackConfig.plugins.push(
		new CompressionWebpackPlugin({
			asset: '[path].gz[query]',
			algorithm: 'gzip',
			test: new RegExp(
				'\\.(' +
				config.build.productionGzipExtensions.join('|') +
				')$'
			),
			threshold: 10240,
			minRatio: 0.8
		})
	)
}

if (config.build.bundleAnalyzerReport) {
	var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
	webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig