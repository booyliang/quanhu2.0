<!-- Author: Boring -->

<template>

</template>

<script>
export default {
	methods: {
		to404() {
			this.$eventBus.$emit('global-message', {
				type: 'notfound',
				action(app) {
					app.currentView = 'y-not-found';
				}
			});
		}
	},

	async mounted() {
		let {
			coterieId,
			moduleEnum,
			id
			} = this.$route.params;
		let module = this.$utils.getModule(moduleEnum);
		if (!module) {
			console.error(`Module ${moduleEnum} not found.`);
			return this.to404();
		}
		let linkTemplate = module.link;

		if (!linkTemplate) {
			console.error(`Module ${moduleEnum} doesn't have a link.`);
			return this.to404();
		}
		// get the real info id from resource id
		if (id.length === 18) {
			let res = await this.$http.get(`/services/app/v1/module/dynamic/single/${id}`);
			id = res.data.data && res.data.data.infoId;
		}

		let path = linkTemplate.replace(':id', id);
		let query = this.$route.query;
		if (query.type) {
			return this.$router.replace({ path, query });
		}
		// 老的跳转规则
		let routeObj = this.$route.params;
		let type = routeObj.type;
		let custId = routeObj.custId;
		let transferId = routeObj.transferId;
		query = { type, custId, transferId }
		if (coterieId) {
			path = '/coterie/' + coterieId + path;
		}
		return this.$router.replace({ path, query });

	}
};
</script>