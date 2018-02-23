// import Block from "@/components/block";
// import Toast from "@/components/toast";
// import Actionsheet from "@/components/actionsheet";
// import Indicator from '@/components/indicator'
function install(Vue) {
	Vue.component("y-not-found", require("@/views/not-found"));
	Vue.component("y-removed", require("@/views/removed"));
	// Vue.component("y-nav", require("@/components/nav/nav"));
	// Vue.component("y-nav-search", require("@/components/nav/nav-search"));
	// Vue.component("y-nav-toggle", require("@/components/nav/nav-toggle"));
	// Vue.component("y-button", require("@/components/button/button"));
	// Vue.component("y-slider", require("@/components/slider/slider"));
	// Vue.component("y-tab-bar", require("@/components/tab/tab-bar"));
	// Vue.component("y-tab-container", require("@/components/tab/tab-container"));
	// Vue.prototype.$block = Vue.block = Block;
	// Vue.prototype.$toast = Vue.toast = Toast;
	// Vue.prototype.$actionsheet = Vue.actionsheet = Actionsheet;
	// Vue.prototype.$indicator = Vue.indicator = Indicator;
}
export default install;
