class JsSdk {
	constructor() {
		this.version = "0.1.0";
		this.callbacks = {};
		this.isVerification = false;
		this.appInfo = {};
		this.messageHandler = {};
		if (typeof window.addEventListener !== "undefined") {
			window.addEventListener("message", this.receiveData.bind(this), false);
		} else if (typeof window.attachEvent !== "undefined") {
			window.attachEvent("message", this.receiveData.bind(this));
		}
	}

	_send2Native(message) {
		let invokeData = JSON.stringify(message);
		if (window.JavascriptBridge && window.JavascriptBridge.invoke) {
			window.JavascriptBridge.invoke(invokeData);
		} else if (
			window.webkit &&
			window.webkit.messageHandlers &&
			window.webkit.messageHandlers.invoke
		) {
			window.webkit.messageHandlers.invoke.postMessage(invokeData);
		} else {
			return false;
		}
	}

	send2Native(invokeName, data, timeout, beforeInvoke) {
		return new Promise(async(resolve, reject) => {
			if (beforeInvoke) {
				data = await beforeInvoke(data);
			}
			let message = {
				data: data
			};
			message.invokeName = invokeName;
			let invokeId = new Date().getTime().toString();
			message.invokeId = invokeId;
			this.callbacks[invokeId] = {
				resolve,
				reject
			};
			// 防止服务器一直不返回
			if (timeout) {
				setTimeout(() => {
					let callback = this.callbacks[invokeId];
					if (!callback) return;
					reject("原生没有响应！");
					delete this.callbacks[invokeId];
				}, timeout);
			}
			if (this._send2Native(message) === false) {
				reject(null);
			}
		});
	}

	receiveData(event) {
		try {
			if (!event.data) return;
			let rawData = event.data;
			if (
				typeof rawData !== "string" ||
				(rawData.indexOf("errMsg") < 0 && rawData.indexOf("nativeEvent") < 0)
			) {
				typeof rawData === "string" && alert(rawData);
				return;
			}
			let data;
			data = JSON.parse(rawData); 
			
			if (data.nativeEvent) {
				return this.handleNativeMessage(data);
			}
			let index = data.errMsg.indexOf(":");
			let invokeResult = data.errMsg.substring(index + 1);
			let invokeId = data.invokeId;
			let callback = this.callbacks[invokeId];
			if (!callback) return;
			if (invokeResult === "success") {
				return callback.resolve(data.data);
			} else {
				callback.reject(data);
			}
			delete this.callbacks[invokeId];
		} catch (ex) {
			alert(ex + ": rawData" + JSON.stringify(event.data));
		}
	}

	registerNative(invokeName, beforeInvoke) {
		return (data, timeout) => {
			if (this.isNative()) {
				return this.send2Native(invokeName, data, timeout, beforeInvoke);
			} else {
				console.error("无法调用原生方法:" + invokeName, data);
				return Promise.reject(new Error("无法调用原生方法:" + invokeName));
			}
		};
	}

	onNativeMessage(eventName, cb) {
		if (!this.messageHandler[eventName]) this.messageHandler[eventName] = [];
		this.messageHandler[eventName].unshift(cb);
	}

	offNativeMessage(eventName, cb) {
		let cbs = this.messageHandler[eventName];
		if (cbs) {
			this.messageHandler[eventName] = cbs.filter(func => func !== cb);
		}
	}

	async handleNativeMessage(message) {
		try {
			let cbs = this.messageHandler[message.nativeEvent];
			if (!cbs) {
				return;
			}
			for (let cb of cbs) {
				message.data = await cb(message.data);
				message.errMsg = message.nativeEvent + ":success";
				if (message.data === false)
					break;
			}
			this._send2Native(message);
		} catch (ex) {
			message.errMsg = message.nativeEvent + ":error";
			this._send2Native(message);
		}
	}
	isNative() {
		return (
			(window.JavascriptBridge && window.JavascriptBridge.invoke) ||
			(window.webkit &&
				window.webkit.messageHandlers &&
				window.webkit.messageHandlers.invoke)
		);
	}
}
const sdk = new JsSdk();
let yryz = {
	// 绑定手机
	bindPhone: sdk.registerNative("bindPhone"),
	// 删除问题
	deleteQuestion: sdk.registerNative("deleteQuestion"),
	// 三方分享
	shareToOtherPlat: sdk.registerNative("shareToOtherPlat"),
	// 打开外链，无sdk的webview
	openUrl: sdk.registerNative("openUrl"),
	// 去个人主页
	toPersonalInfo: sdk.registerNative("toPersonalInfo"),
	// 请求头信息
	httpHeader: sdk.registerNative("httpHeader"),
	// 与人聊天
	sessionP2P: sdk.registerNative("sessionP2P"), // 暂未调试
	// 修改状态栏字体颜色
	statusBar: sdk.registerNative("statusBar"),
	// 复制内容至粘贴板
	pasteboard: sdk.registerNative("pasteboard"),
	// 返回
	back: sdk.registerNative("back"),
	// 播放视频
	playVideo: sdk.registerNative("playVideo"),
	// 登录
	login: sdk.registerNative("login"),
	// 地图导航
	mapNavigation: sdk.registerNative("mapNavigation"),
	// 关闭原生loading
	finishLoading: sdk.registerNative("finishLoading"),
	// 用户被踢下线
	kickOut: sdk.registerNative("kickOut"),
	// 获取用户手机已安装的可分享的APP
	getInstallSharePlatform: sdk.registerNative("getInstallSharePlatform"),
	// 评论输入框
	comment: sdk.registerNative('comment'),
	// 获取网络状态
	getNetWorkStatus: sdk.registerNative("getNetWorkStatus"),
	// 通用发布
	publishImageText: sdk.registerNative('publishImageText'),
	// 网络加载失败
	loadingFailed: sdk.registerNative('loadingFailed'),
	// 是否为原生环境
	isNative: sdk.isNative,
	isIOS: function () {
		return !!(window.webkit &&
			window.webkit.messageHandlers &&
			window.webkit.messageHandlers.invoke);
	},
	on: sdk.onNativeMessage.bind(sdk),
	off: sdk.offNativeMessage.bind(sdk),
};
yryz.install = function (Vue) {
	Vue.yryz = Vue.prototype.$yryz = yryz;
};
export default yryz;