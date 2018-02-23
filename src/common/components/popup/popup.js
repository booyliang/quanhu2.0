import Vue from 'vue';

class Popup {
	/**
	 * @constructor
	 * @param {Object} ComponentOptions 组件的选项对象，一般由 .vue 文件导出。
	 * @param {Object} propsData 构造组件时传入的 propsData，参见 Vue 文档。
	 */
	constructor(ComponentOptions, propsData) {
		this._initInstance(ComponentOptions, propsData);
		this._options = this._instance.finalOptions;
	}

	_initInstance(ComponentOptions, propsData) {
		let Component = Vue.extend(ComponentOptions);
		this._instance = new Component({
			el: document.createElement('div'),
			propsData
		});
		document.body.appendChild(this._instance.$el);
	}

	getInstance() {
		return this._instance;
	}

	setData(data) {
		Object.assign(this._instance, data);
	}

	open() {
		this._instance.open();
	}

	close() {
		this._instance.close();
	}

	_instance;
	_options;
}

export default Popup;