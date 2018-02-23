import commonModules from "@/config/modules";
import eventBus from "./event-bus";
let modules = commonModules;
let utils = {
	getUrl(path, params) { },
	getShareUrl() {
		return window.location.href;
	},
	alert(...rests) {
		if (
			window.location.href.indexOf("web.") === -1 &&
			window.location.href.indexOf("m.") === -1 &&
			window.location.href.indexOf("m-mo.") === -1 &&
			window.location.href.indexOf("web-mo.") === -1
		) {
			let err = "";
			for (let rest of rests) {
				if (!rest) continue;
				if (typeof rest === "object") {
					err += JSON.stringify(rest);
				} else {
					err += rest;
				}
			}
			alert(err);
		}
	},
	getModule(id) {
		const module = modules[id];

		if (!module) {
			console.error(`Module "${id}" doesn't exist.`);
		}

		return module;
	},
	refreshOnBack() {
		eventBus.$emit("global-message", { type: "refreshOnBack" });
	},
	refresh() {
		eventBus.$emit("global-message", { type: "refresh" });
	},
	goBack() {
		if (document.getElementById("navigator")) {
			eventBus.$emit("goBack");
		} else {
			window.history.go(-1);
		}
	},
	getQueryString(name) { // 取地址栏参数
		let reg = new RegExp("(^|&)" +  name + "=([^&]*)(&|$)");
		let r = window.location.search.substr(1).match(reg);
		if (r !== null) {
			return unescape(r[2]);
		}
		return null;
	},
	setBrowserShareInfo(title, description) {
		const doc = window.document;
		if (title) {
			doc.title = title || '圈乎';
		}
		if (description) {
			let descriptionEl = doc.querySelector('meta[name="description"]');
			if (!descriptionEl) {
				descriptionEl = doc.createElement('meta');
				descriptionEl.setAttribute('name', 'description');
				doc.head.appendChild(descriptionEl);
			}
			descriptionEl.setAttribute('content', description);
		}
	}
};

utils.install = function (Vue, options) {
	let { moduleModules, appInfo } = options;
	modules = Object.assign(modules, moduleModules);
	utils.NODE_ENV = appInfo.NODE_ENV;
	Vue.prototype.$utils = Vue.utils = utils;
};
export default utils;
