/**
*	Author: wangboning
*
*/
<template>
	<transition name="popup">
		<div class="popup">
			<y-mask :transparent="options.transparentMask" @click.native="handleMaskClicked"></y-mask>
			<slot></slot>
		</div>
	</transition>
</template>

<script type="text/javascript">
	import Mask from '@/components/mask';

	export default {
		name: 'y-popup',

		components: {
			[Mask.name]: Mask
		},

		props: {
			options: Object
		},

		data() {
			return {
				impl: null
			};
		},

		methods: {
			open() {
				this.impl.open();
			},

			close() {
				this.impl.close();
			},

			handleMaskClicked() {
				if (this.options.blankClose) {
					this.close();
				}
			},

			initImpl() {
				let parent = null;

				do {
					parent = (parent || this).$parent;
				} while (parent && !parent.$options.popupImpl);

				this.impl = parent;
			}
		},
		
		created() {
			this.initImpl();
			this.$eventBus.$on('router-change', this.close)
		},
		beforeDestroy() {
			this.$eventBus.$off('router-change', this.close)
		},
	};
</script>

<style type="text/css">
	@import "#/css/var.css";

	.popup {
		@apply --full;
		@apply --display-flex;
		position: fixed;
		z-index: 999;
		justify-content: center;

		&.popup-enter-active,
		&.popup-leave-active {
			transition: opacity 0.2s;
		}
		&.popup-enter,
		&.popup-leave-active {
			opacity: 0;
		}

		& > :last-child {
			position: relative;
		}
	}
</style>