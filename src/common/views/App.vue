<template>
	<div id="app">
		<keep-alive :exclude='exclude'>
			<component ref='keepAliveComponent' v-if="$route.meta.keepAlive" v-bind:is="currentView"></component>
		</keep-alive>
		<component v-if="!$route.meta.keepAlive" v-bind:is="currentView"></component>
		<y-control-forward></y-control-forward>

	</div>
</template>
<script>
let needRefreshOnBack = false;
import YControlForward from '@/components/control-forward'
export default {
	components: {
		YControlForward
	},
	watch: {
		'$route'(to, from) {
			this.$eventBus.$emit('router-change');
			if (needRefreshOnBack && to.meta.keepAlive) {
				needRefreshOnBack = false;

				this.refreshComponents = to.matched[to.matched.length - 1].components.default;
				this.handlePopstate();
				return;
			}
			if (this.$refs.keepAliveComponent && from.meta.keepAlive) {
				this.refreshComponents = from.matched[from.matched.length - 1].components.default
			} else {
				this.refreshComponents = null;
			}

		}
	},
	async created() {
		document.title = this.$R('app-name')
		this.$eventBus.$on('global-message', this.handleGlobalMessage)
		window.addEventListener('popstate', this.handlePopstate);
		this.$yryz.isNative() && this.$yryz.finishLoading()
		this.currentView = 'router-view';
		this.$yryz.on('nativeRoute', this.handleNativeRouter);
	},
	beforeDestroy() {
		this.$eventBus.$off('global-message', this.handleGlobalMessage);
		this.$yryz.off('nativeRoute', this.handleNativeRouter);
		window.removeEventListener('popstate', this.handlePopstate);
	},
	data() {
		return {
			currentView: '',
			exclude: '',
			lastComponents: null
		}
	},
	methods: {
		handlePopstate(e) {
			if (window.location.pathname === '/empty') {
				this.$yryz.back();
			}
			// console.log('this.refreshComponents', this.refreshComponents)
			if (!this.refreshComponents) return;
			// console.log(this.refreshComponents)
			let name = this.refreshComponents.name;
			if (!name) console.error('keepalive 路由组件必须定义name', this.refreshComponents);
			// this.exclude.push(name);
			this.exclude = name;
			// console.log(this.exclude)
			this.$nextTick(() => {
				// this.exclude.pop();
				// console.log(this.exclude, window.location.href)
				this.exclude = ''
			})

		},
		goback() {		
			this.$nextTick(() => {
				this.$router.replace('/empty');
				this.$yryz.back();
			});
		},
		refresh() {
			let currentView = this.currentView;
			this.currentView = null;

			if (this.$refs.keepAliveComponent) {
				let opts = this.$refs.keepAliveComponent.$vnode.componentOptions
				let name = opts.Ctor.options.name || opts.tag;
				this.exclude = name;
			}
			this.$nextTick(() => {
				this.currentView = currentView;
				this.exclude = ''
			})
		},
		refreshOnBack() {

			needRefreshOnBack = true;
		},
		handleGlobalMessage(message) {
			// console.log('message', message)
			if (typeof message === 'function') {
				message(this);
			} else if (message.action)
				message.action(this);
			else if (this[message.type])
				this[message.type](message)

		},
		async handleNativeRouter(data) {
			this.$yryz.finishLoading();
			let envData = await this.$yryz.httpHeader(null, 3000);
			for (let key in envData) {
				this.$env[key] = envData[key]
			}
			if (this.$route.fullPath === '/empty') {
				this.$router.push(data);
			} else {
				this.$router.replace(data);
			}				
			this.refresh();
		}
	}
}
</script>
<style>
	@import '../css/global.css';
</style>