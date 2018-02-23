import yryz from './yryz'
import utils from './utils'
import eventBus from './event-bus'
import Toast from '@/components/toast'

let language = utils.getQueryString("language") || 'zh'; // 获取地址栏language参数
// let language =  'zh'; // 获取地址栏language参数

let env = eventBus.env = {
	userId: '',
	language // 语言 zh / en
}
async function setEnv(Vue, options) {
	let newEnv = {};
	try {
		if (yryz.isNative()) {
			let data = await yryz.httpHeader(null, 3000);
			Object.assign(newEnv, data);

		} else if (options.appInfo.NODE_ENV === "development") {
			let defaultEnv = {
				sign: "ceshi", // 未知
				token: "8679ada1xj-cgCWu1qr2SlM1511837605959", // 接口访问凭证
				appVersion: "3.0.0", // APP版本
				v: "1.0", // 未知
				devType: "1", // 1： IOS，2：安卓
				devName: "IOS", // 设备名称
				devId: "123456578", // 当前访问设备id
				ip: "127.0.0.1", // 当前网络ip
				net: "wift", // 网络环境
				custId: "8679ada1xj", // 765npt1huu 0u66cgvpvk 8qjl93ryu3  0m8xwqgrxd  r3l7bbgi 7onb1acsux 2mladd0xal 4qqcxnbnht
				userId: '14767', // 66
			
			};
			Object.assign(newEnv, defaultEnv)
		} 
			
	} catch (ex) {
		// yryz.isNative() && Toast('无法获取原生环境')
	}

	for (let key in newEnv) {
		eventBus.$set(eventBus.env, key, newEnv[key])
	}
	env = eventBus.env
	Vue.prototype.$env = Vue.env = env;

}
env.install = async function (Vue, options) {
	yryz.on('nativeLogin', async () => {
		await setEnv(Vue, options);
		eventBus.$emit('global-message', { type: 'refresh' })
	});
	await setEnv(Vue, options);
	return env;
}

export default env;