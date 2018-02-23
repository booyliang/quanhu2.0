import Vue from 'vue'
import Module from '@/js/module'
import moduleRoutes from './router'
import './css/app.css';
let appInfo = process.appInfo;

import AppConfig from '@/config/app'
async function install(Vue) {
	Module.install(Vue, {appInfo, moduleRoutes});
	if (appInfo.NODE_ENV === "development") {
		const Eruda = require("eruda");
		Eruda.init();
	} else {
		const Raven = require('raven-js');
		const RavenVue = require('raven-js/plugins/vue');
		Raven
			.config(AppConfig.sentryConfig.dsn,
			{
				release: AppConfig.release
			}
			).addPlugin(RavenVue, Vue)
			.install();
	}
}
install(Vue)

