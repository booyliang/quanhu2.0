<template>
	<div v-if="demo" class="demo_page">
		<component :is="demo"></component>
	</div>
	<pre v-else v-text="error.toString()"></pre>
</template>

<script>
	/**
	 * 获取可能存在的应该跳转到的模块名。
	 *
	 * @param {String} name 当前模块名。
	 * @return {String} 应该跳转到的模块名。
	 */
	function getRedirectTarget(name) {
		for (let [currentName, targetName] of redirects) {
			if (name === currentName || currentName.includes(name)) {
				return targetName;
			}
		}
	}

	let redirects = new Map([
		['item', 'list'],
		['flow', 'flow-list']
	]);

	export default {
		data() {
			return {
				demo: null,
				error: ''
			};
		},

		created() {
			this.getDemo();
		},

		methods: {
			getDemo() {
				let {
					type,
					name
				} = this.$route.params;

				try {
					if (type) {
						this.demo = require(`@/${type}/${name}/demo`);
					} else {
						this.demo = require(`@/components/${name}/demo`);
					}
				} catch (error) {
					let redirectTarget = getRedirectTarget(name);

					if (redirectTarget) {
						this.$router.replace(`./${redirectTarget}`);
						this.getDemo();
						return;
					}

					this.error = error;
				}
			}
		},
	};
</script>

<style type="text/css" >
	@import "#/css/var.css";

	.demo_page {
		@apply --layout;
		padding-top: var(--layout-space);
		padding-bottom: var(--layout-space);
	}
</style>