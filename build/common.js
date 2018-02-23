process.env.NODE_ENV = 'production';
const webpack = require('webpack');
var path = require('path')
const fs = require('fs')
var utils = require('./utils')
var vueLoaderConfig = require('./vue-loader.conf')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
var merge = require('webpack-merge')
var SentryPlugin = require('webpack-sentry-plugin');
var appConfig = require('./app-config');
var appConfig = appConfig.config;

function resolve(dir) { 
	return path.join(__dirname,'..',dir)
}
webpackConfig = {
	entry: {
		common: ['babel-polyfill', `./src/common/main.js`]
	},
	output: {
		path: utils.distPath ,
		filename: '[name].[chunkhash:8].js',
		library: '[name]_[chunkhash:8]',
	},
	resolve: {
		extensions: ['.js', '.vue', '.json'],
		alias: {
			'vue$': 'vue/dist/vue.esm.js',
			'@': resolve('src/common'),
		}
	},
	module: {
		rules: [{
			test: /\.vue$/,
			loader: 'vue-loader',
			options: vueLoaderConfig
		},
		{
			test: /\.js$/,
			loader: 'babel-loader',
			include: [resolve('src')]
		},
		{
			test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
			loader: 'file-loader',
			options: {
				limit: 100000,
				name: './assets/img/[name].[hash:7].[ext]'
			}
		},
		{
			test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
			loader: 'file-loader',
			options: {
				limit: 10,
				name: './assets/fonts/[name].[hash:7].[ext]'
			}
		}
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.appInfo': JSON.stringify(Object.assign({}, {
				NODE_ENV: process.env.NODE_ENV
			}))
		}),
		new webpack.DllReferencePlugin({
			sourceType: 'var',
			manifest: require(`../dist/vendor_manifest.json`),
		}),

		new webpack.DllPlugin({
			path: utils.resolve(`common_manifest.json`),
			name: '[name]_[chunkhash:8]',

		}),
		new ExtractTextPlugin({
			filename: `[name].[contenthash:8].css`
		}),
		new OptimizeCSSPlugin({
			cssProcessorOptions: {
				safe: true
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			},
			sourceMap: false
		}),
		// new webpack.ProvidePlugin({
		// 	 Promise: 'imports-loader?this=>global!exports-loader?global.Promise!es6-promise'          
		// }),
		new webpack.IgnorePlugin(/^\.\/demo/, /common/),
		new SentryPlugin(merge(appConfig.SENTRY_CONFIG, { release: appConfig.RELEASE }))
	],
};

function build(cb) {
	
	if (process.env.npm_config_report && process.argv[1].indexOf('common.js') > -1) {
		var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
		webpackConfig.plugins.push(new BundleAnalyzerPlugin({
			analyzerPort: 8082
		}))
	}

	webpack(webpackConfig, function (err, stats) {
		if (err) throw err;
		process.stdout.write(stats.toString({
			colors: true,
			modules: false,
			children: false,
			chunks: false,
			chunkModules: false
		}) + '\n\n')
		// if (!fs.existsSync(assetsPath)) {
		// 	fs.mkdirSync(assetsPath);
		// }
		// let commonJsName = utils.getFileName(commonPath, /^common\..*\.js$/);
		// fs.renameSync(path.join(commonPath, commonJsName), path.join(assetsPath, commonJsName))
		// let commonCssName = utils.getFileName(commonPath, /^common\..*\.css$/);
		// fs.renameSync(path.join(commonPath, commonCssName), path.join(circlePath, commonCssName));
		// fs.renameSync(commonPath, assetsPath)
		cb && cb()
		// buildSprite(cb);

	})
}

function getSpriteHash(path) {
	let files = fs.readdirSync(path).sort();
	let content = 'totalfile:' + files.length + files.join(',');
	const crypto = require('crypto');
	const hash = crypto.createHash('md5').update(content).digest('hex');
	return hash;

}
if (process.argv[1].indexOf('common.js') > -1) {
	build();
}
module.exports = {
	build
}