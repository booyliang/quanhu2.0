var store = {};

function remove(key) {
	store[key] = null;
	delete store[key];
}

function get(key) {
	return store[key];
}

function set(key, val) {
	store[key] = val;
}
async function getOrSet(key, request, defaultObj) {

	if (store[key]) {
		return store[key]
	}
	if (request === null) {
		store[key] = defaultObj;
		return store[key];
	}
	let res = await this.$http(request);
	store[key] = res.data || defaultObj;
	return store[key];
}

function plugin(Vue) {
	if (plugin.installed) {
		return;
	}

	Object.defineProperties(Vue.prototype, {
		$localStore: {
			get() {
				return {
					remove,
					get,
					getOrSet: getOrSet.bind(this),
					set
				};
			}
		}
	});
}

export default plugin;