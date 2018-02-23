/**
*	Author: wangboning
*
*/
<template>
	<y-popup v-if="opened" :options="finalOptions" class="toast">
		<div class="toast-body" v-text="message"></div>
	</y-popup>
</template>

<script type="text/javascript">
	import popupMixin from '@/components/popup/mixin';

	export default {
		name: 'y-toast',

		mixins: [popupMixin],

		props: {
			message: String,
		},

		data() {
			return {
				opened: false,
				resolve: null,
				defaultOptions: {
					transparentMask: true,
					autoClose: true,

					onClosed() {
						this.resolve();
					}
				}
			};
		},
	};
</script>

<style type="text/css">
    @import '#/css/var.css';

    .toast-body {
        @apply --bg-alpha;
        @apply --round;
        min-width: 40%;
        max-width: 53.34%;
        text-align: center;
        padding: 0.2rem 0.3rem;
    }
</style>