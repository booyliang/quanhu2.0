import ToastVue from './toast.vue';
import Popup from '@/components/popup/popup.js';
import Vue from 'vue';

class Toast extends Popup {
	constructor(message, options) {
		super(ToastVue, {
			message,
			options
		});
	}
}

let toastApi = function (message, options) {
	return new Promise((resolve, reject) => {
		let toast = new Toast(message.toString(), options);
		toast.setData({
			resolve
		});
		toast.open();
	});
};

Vue.Toast = Vue.prototype.$toast = toastApi;

export default toastApi;