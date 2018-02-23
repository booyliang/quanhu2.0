import Vue from 'vue'
import yryz from './yryz'
import Toast from "../components/toast";
import eventBus from './event-bus'
let env = eventBus.env;
let lang = null;
let resource = null;
const pattern = /\{[0-9]\}/g;
function getResource(key, ...params) {
	let str = resource[key];
	if (typeof str === 'undefined') {
		console.error('没找到相应资源', key);
		return ''
	}
	if (params.length > 0)
		return str.replace(pattern, (match) => {
			let index = parseInt(match[1])
			return params[index]
		});

	return str;
}

function setLanguage(language) {
	if (language === lang)
		return;
	lang = language;
	resource = require(`@/config/resource_${lang}`).default;
	eventBus.$emit('global-message', { type: 'refresh' });

}

function install(Vue, options) {
	setLanguage(env.language)
	Vue.prototype.$R = Vue.R = getResource;

	// nativeActivated: webview页面激活, 传参同httpHeader
	yryz.on('nativeActivated', async (data) => {
		let language = data.language;
		setLanguage(language);
	})

}
export default install

