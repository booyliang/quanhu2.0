/**
*	Author: wangboning
*
*/
<template>
	<div :class="classList"></div>
</template>

<script type="text/javascript">
	export default {
		name: 'y-mask',

		props: {
			transparent: Boolean
		},

		computed: {
			classList() {
				return [
					'mask',
					{
						'mask--transparent': this.transparent
					}
				];
			}
		}
	};
</script>

<style type="text/css">
	@import "#/css/var.css";

	.mask {
		@apply --full;
		@apply --bg-alpha;
		@apply --no-tap-highlight;
	}

	.mask--transparent {
		opacity: 0;
	}
</style>