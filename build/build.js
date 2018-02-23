require('./check-versions')()
process.env.NODE_ENV = 'production'
var opn = require('opn')
var ora = require('ora')
var rm = require('rimraf')
var path = require('path')
var chalk = require('chalk')
var webpack = require('webpack')
var config = require('../config')
var spinner = ora('building for production...')
var utils = require('./utils')
var vendor = require('./vendor')
var appConfig = require('./app-config')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')


spinner.start()

let circlePath = utils.distPath
rm(circlePath, (err, stats) => {
	if (err) throw err
	appConfig.build();
	vendor.build(build)
});
// new HtmlWebpackPlugin(
let webpackConfig = require('./webpack.prod.conf');
let htmlWebpackOption = {
	filename: utils.resolve('index.html'),
	template: 'index.html',
	inject: true,	
	minify: {
		removeComments: true,
		collapseWhitespace: true,
		removeAttributeQuotes: true
	},
	chunksSortMode: 'dependency'
}

function build() {
	let common = require('./common');
	common.build(() => {
		webpackConfig.plugins.push(new webpack.DllReferencePlugin({
			sourceType: 'var',
			manifest: require(`../dist/common_manifest.json`),
		}))
		webpackConfig.plugins.push(new webpack.DllReferencePlugin({		
				sourceType: 'var',
				manifest: require(`../dist/vendor_manifest.json`),
			}));
		let commonjs =  htmlWebpackOption.commonJs = utils.getCommonJs();
		htmlWebpackOption.commonCss = utils.getCommonCss();
		htmlWebpackOption.vendorJs = utils.getVendorJs();			
		let commonJsHash = commonjs.split('.')[1];
		webpackConfig.output.filename = `[name].${commonJsHash}.[hash:8].js`,
		buildCircle();
	})


}

function buildCircle() {
	spinner.text = 'building circle ';
	
	let plugins = [
		new CopyWebpackPlugin([		
			{
				from: path.resolve(__dirname, '../src/common/assets/static'),
				to: './assets/static',
				ignore: ['.*', '*.json']
			},
			{
				from: path.resolve(__dirname, `../src/app/static`),
				to: './static',
				ignore: ['.*', '*.json']
			},		
		], {
			copyUnmodified: true
		}),
		new HtmlWebpackPlugin(htmlWebpackOption)
	]

	webpackConfig = require('webpack-merge')(webpackConfig, {
		plugins
	})

	// console.log('webpackConfig', webpackConfig)
	webpack(webpackConfig, function (err, stats) {
		spinner.stop()
		if (err) throw err
		process.stdout.write(stats.toString({
			colors: true,
			modules: false,
			children: false,
			chunks: false,
			chunkModules: false
		}) + '\n\n')

		console.log(chalk.cyan('Build complete.\n'))

	})
}
