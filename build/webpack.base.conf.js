var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var fs = require('fs');
// var happypack = require('./happypack')
function resolve(dir) {
	return path.join(__dirname, '..', dir)
}
// console.log('utils',utils)
let webpackConfig = {
	entry: {
		app: ['babel-polyfill', `./src/app/main.js`]
	},
	output: {
		path: config.build.assetsRoot,
		filename: '[name].js',
		publicPath: process.env.NODE_ENV === 'production' ?
			`/` :
			config.dev.assetsPublicPath
	},
	plugins: [
		new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(zh-cn)$/),

		new webpack.DefinePlugin({
			'process.appInfo': JSON.stringify(Object.assign({}, {
				NODE_ENV: process.env.NODE_ENV
			}))
		})

	],
	resolve: {
		extensions: ['.js', '.vue', '.json'],
		alias: {
			'vue$': 'vue/dist/vue.esm.js',
			'@': resolve('src/common'),
			'@config': resolve('config/')

		}
	},
	resolveLoader: {
		alias: {
			'yryz-url-loader': resolve('build/yryz-url-loader'),
		},
	},
	module: {
		rules: [

			{
				test: /\.vue$/,
				loader: utils.getLoader('vue'),
				options: vueLoaderConfig
			},
			{
				test: /\.js$/,
				loader: utils.getLoader('babel'),
				include: [resolve('src')]
			},
			
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 100000, //将所有图片都打包到css中
					name: './img/[name].[ext]',
					include:[resolve(`src/app/assets/column`)]
				}
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'file-loader',
				options: {
					limit: 1000,
					name: './fonts/[name].[hash:7].[ext]'
				}
			}
		]
	}
};

module.exports = webpackConfig;