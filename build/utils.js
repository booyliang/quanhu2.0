var path = require('path')
var config = require('../config')
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack')
const fs = require('fs');
let utils = {};
let resolve = utils.resolve = function (...dir) {
	return path.join(__dirname, '..', 'dist', ...dir)
};

utils.distPath = utils.resolve();

utils.getFileName=function(dir, re) {
	dir = path.resolve(__dirname, '..', dir)	
	let files = fs.readdirSync(dir);
	for (let file of files) {
		if (file.match(re)) {
			return file;
		}
	}
	throw dir;
}


utils.getLoader = function (loader) { 
	return loader+'-loader' 
	// return process.env.NODE_ENV == 'production'? loader+'-loader' :'happypack/loader?id='+(loader==='vue'?'1':loader)
}

utils.getVendorJs = function () { 
	let file = this.getFileName(('dist') , /^vendor\..*\.js$/);
	return `/${file}`
}
utils.getCommonJs = function () { 
	let file = this.getFileName(path.resolve('dist'), /^common\..*\.js$/);
	return `/${file}`
}
utils.getCommonCss = function () { 
	let file = this.getFileName(path.resolve('dist'), /^common\..*\.css$/);
	return `/${file}`		
}
utils.assetsPath = function (_path) {
  var assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

utils.cssLoaders = function (options) {
  options = options || {}

  var cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders(loader, loaderOptions) {
    var loaders = [cssLoader]
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders('postcss'),
    // postcss: generateLoaders(),
    // less: generateLoaders('less'),
    // sass: generateLoaders('sass', { indentedSyntax: true }),
    // scss: generateLoaders('sass'),
    // stylus: generateLoaders('stylus'),
    // styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
utils.styleLoaders = function (options) {
  var output = []
  var loaders = exports.cssLoaders(options)
  for (var extension in loaders) {
    var loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output
}
module.exports =utils