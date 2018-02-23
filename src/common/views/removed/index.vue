<template>
	<div class="not-found not-delete-remove">
		<y-nav v-if="showNav"></y-nav>
		<div class="not-found-wrap">
			<div class="not-img removed-img"></div>
			<p>你访问的内容已被删除</p>
		</div>
	</div>
</template>

<script>
	export default{
		name: 'y-removed',
		computed: {
			showNav() {
				return this.$route.query.type !== "forward" && this.$yryz.isNative()
			}
		},
		mounted() {
			var appDom = document.getElementById('app')
			if (appDom) appDom.className = '';
			if (this.$route.query.type === "forward") {
				this.$yryz.infoRemove();
			}
		}
	}
</script>

<style>
	.not-delete-remove {
		& .not-found-wrap {
			padding-top: 3rem;
			& .not-img {
				margin-top: 0;
			}
		}
	}
</style>