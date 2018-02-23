
import Env from './env'
import http from './http'
import module from './module'

function setLocalStorage(key, value) {
	key && value && window.localStorage.setItem(key, JSON.stringify(value))
}

function getLocalStorage(key) {
	let value = window.localStorage.getItem(key);
	if (value)
		return JSON.parse(value)
	return null;
}

let cache =  {	
	getData(url, cb, defalutAction) {
		let vm = this.context;

		let key = `${Env.custId || ''}/${module.moduleShortName }${url}` 
		let data = getLocalStorage(key);
		if (data) {
			if (data.data.code === '200')
				cb(data)
		} else if (defalutAction) {
			defalutAction()
		}
		http.get(url).then((res) => {
			if (res.data.code !== '200')
				return 
			setLocalStorage(key, res);
			cb(res)
		})

	},
	async getDataSync(url, cb) {
		let key = `${Env.custId || ''}/${module.moduleShortName }${url}` 
		let data = getLocalStorage(key);
		if (data) {
			if (data.data.code === '200')
				cb(data);
			http.get(url).then((res) => { 
				if (res.data.code !== '200')
					return 
				setLocalStorage(key, res);
				cb(res);
			})
		} else {
			let res = await http.get(url);
			if (res.data.code !== '200')
				return 
			setLocalStorage(key, res);
			cb(res);
		}

	},
	install(Vue) {
		Vue.prototype.$cache = cache
	}
}

export default cache