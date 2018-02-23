<template>
	<div class="not-found ">
		<y-nav v-if="Show"></y-nav>
		<div class="flow_detail">
		<div class="not-found-wrap">
			<div class="not-img not-found-img"></div>
			<p>此页面不存在！</p>
		</div>
	</div>
	</div>
</template>

<script>
	export default{
		name: 'y-not-found',
		data() {
			return {
				Show: this.$yryz.isNative()
			}
		},
		mounted() {
			
			
		}
	}
</script>

<style>
.not-found{	
	height: 100vh;
    background: #fff;
	& .flow_detail{ background: none; }
	& .not-found-wrap{
		& .not-img{
			background-size: cover;
			width: 2.9rem;
			height: 2.5rem;
			margin: 3rem auto 0.5rem auto;
		}
		
		& p{
			text-align: center;
			font-size: .32rem;
			color: #b4b4b4;
		}
	}
}

/*404 page*/
/* .not-found-img{	background-image: url(../../assets/404@2x.png); width: 3.65rem!important; height: 3.12rem!important;} */

/*内容已删除 page*/
/* .removed-img { background-image: url(../../assets/remove@2x.png); width: 3.68rem!important; height: 3.68rem!important;} */
</style>
