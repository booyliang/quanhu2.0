import Vue from 'vue';
import Popup from './';

export default {
	components: {
		[Popup.name]: Popup,
	},

	props: {
		options: Object
	},

	data() {
		return {
			defaultOptions: {
				transparentMask: false,
				autoClose: false,
				trigger: null,
				blankClose: true,
				onClosed: null,
				onTriggerClicked: null
			},
			opened: false,
			autoCloseTimer: null,
			AUTO_CLOSE_DELAY: 3000,
			triggers: [],
		};
	},

	computed: {
		finalOptions() {
			return Object.assign({}, this.defaultOptions, this.options);
		}
	},

	methods: {
		open() {
			this.opened = true;
			this.initAutoClose();
		},

		close() {
			clearTimeout(this.autoCloseTimer);
			this.opened = false;

			if (this.finalOptions.onClosed) {
				this.finalOptions.onClosed.call(this);
			}
		},

		initAutoClose() {
			let autoClose = this.finalOptions.autoClose;

			if (autoClose) {
				this.autoCloseTimer = setTimeout(() => {
					this.close();
				}, typeof autoClose === 'number' ? autoClose : this.AUTO_CLOSE_DELAY);
			}
		},

		initTrigger() {
			this.getTrigger();
			this.listenTrigger();
		},

		/**
		 * 获取所有触发弹出的元素，保存为一个由 DOM 元素组成的数组。
		 *
		 * @param {String | Vue | Element | Array<String | Vue | Element>} trigger 触发器表示符。当类型为 String 时期望接受一个 CSS 选择器。默认值为组件配置项中的 trigger。
		 */
		getTrigger(trigger = this.finalOptions.trigger) {
			if (Array.isArray(trigger)) {
				trigger.forEach((trigger) => {
					this.getTrigger(trigger);
				});
				return;
			}

			if (trigger instanceof Vue) {
				this.triggers.push(trigger.$el);
			} else if (typeof trigger === 'string') {
				this.triggers.push(...document.querySelectorAll(trigger));
			} else if (trigger instanceof Element) {
				this.triggers.push(trigger);
			} else {
				console.error(`“${trigger}”不是合法的 trigger。`);
			}
		},

		listenTrigger() {
			this.triggers.forEach((trigger) => {
				trigger.addEventListener('click', () => {
					if (this.finalOptions.onTriggerClicked) {
						this.finalOptions.onTriggerClicked.call(this, trigger);
					}

					this.open();
				});
			});
		},

		unlisten() {
			this.unlistenTrigger();
		},

		unlistenTrigger() {
			document.body.removeEventListener('click', this.handleTriggerClick);
		}
	},

	mounted() {
		this.$nextTick(() => {
			if (this.finalOptions.trigger) {
				this.initTrigger();
			}
		});
	},

	beforeDestroy() {
		this.unlisten();
	},

	popupImpl: true
};