import axios from "axios";
import Toast from "@/components/toast";
import env from "./env";
import yryz from './yryz';
let axiosInst = axios.create({
	timeout: 20000
});

axiosInst.install = function (Vue, options) {
	let baseUrls = options.baseUrls || {
		dev: "http://module-dev.quanhu365.com",
		mo: "https://module-mo.quanhu365.com",
		m: "https://module.quanhu365.com",
		test: "http://module-test.quanhu365.com",
		'localhost': 'http://module-dev.quanhu365.com',
	};
	let baseUrl = "";
	let match = window.location.href.match(/([A-Za-z]+)?\./);

	if (match && match.length > 1) {
		baseUrl = baseUrls[match[1].toLowerCase()];
	} else {
		baseUrl = baseUrls["localhost"] || "";
	}
	baseUrl += options.httpPrefix || "/module";
	this.baseUrl = baseUrl;
	Vue.http = Vue.prototype.$http = this;
	this.interceptors.request.use(function (config) {
		if (!config.url) {
			console.log("services请求地址出错", this, config);
		}
		if (config.url.indexOf("http") !== 0) {
			config.url = baseUrl + config.url;
			for (let i in Vue.env) {
				if (i === "install") continue;
				config.headers.common[i] = Vue.env[i];
			}

			// config.headers['userId'] = '300140'; // 测试
		}
		return config;
	});

	this.interceptors.response.use(
		function (res) {
			// for removed recource
			if (
				res.data && res.data.data && parseInt(res.data.data.shelveFlag) === 1
			) {
				Vue.nextTick(() => {
					Vue.eventBus.$emit("global-message", {
						type: "removed",
						action: app => app.currentView = "y-removed"
					});
				});
			}
			return res;
		},
		function (error) {
			if (error.message.indexOf("timeout") > -1) {
				Toast("操作超时！");
			}
			if (error.message.indexOf("Network Error") > -1) {
				if (yryz.isNative())
					Toast("当前网络不可用，请检查网络设置");
			}
			return Promise.reject(error);
		}
	);
};

export default axiosInst;