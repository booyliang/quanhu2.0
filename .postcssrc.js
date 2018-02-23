
// https://github.com/michael-ciniawsky/postcss-load-config
var webpack = require('webpack')
var path = require('path')
let appSubDir = 'app';
var fs = require('fs')
function resolve(root, dir) {
	if (appSubDir != '--config')
		return path.join(__dirname, 'src', root, dir)
	else
		return path.join(__dirname, 'src/common', dir)
}
module.exports = {
	"plugins": {
		// to edit target browsers: use "browserlist" field in package.json
		// "autoprefixer": {}
		// 'postcss-import': {},
		'postcss-import': {
			resolve(id, basedir, importOptions) {
				if (id.includes('#')) {
					let path = resolve(appSubDir, id.replace('#', ''));					
					return path
				}
				return id;
			}
		},
		'postcss-url': {
			url(asset) {
				if (asset.absolutePath.indexOf('app') > 0) {
					// console.log(asset)
					if (fs.existsSync(asset.absolutePath))
						return asset.relativePath.replace(/\\/g, '/')
					else
						return asset.url;
				}				
				return asset.url;
			}
		},
		'postcss-cssnext': {
			features: {
				rem: false
			}
		},
	


	}
}