import ElementUI from "element-ui";
// @ts-ignore
import enLocale from "element-ui/lib/locale/lang/en";
// @ts-ignore
import zhLocale from "element-ui/lib/locale/lang/zh-CN";
import VueI18n from "vue-i18n";
import App from "./App.vue";
import fetchUtil from "./assets/scripts/fetchUtil";
import router from "./router";

import "element-ui/lib/theme-chalk/index.css";
import Vue from "vue";
import "../static/iconfont";
import "./assets/css/global.css";
import cn from "./assets/lang/cn";
import en from "./assets/lang/en";


Vue.use(VueI18n);


const languages = {
  en: Object.assign(en, enLocale),
  cn: Object.assign(cn, zhLocale)
};
const i18n = new VueI18n({
  locale: "cn",
  messages: languages
});

Vue.use(ElementUI, {
  i18n: (key: string, value: string) => i18n.t(key, value)
});

Vue.config.productionTip = false;

Vue.prototype.$http = fetchUtil;
fetchUtil.setup(i18n, router);

/* ApiHost settings */

const DEVSERVER = "http://preroot.dotwintech.com:3088/raid-monitor/";
const DEVSERVER1 = "http://192.168.1.26:88/raid-monitor/";
const PRODSERVER = "/raid-monitor/";

if (process.env.NODE_ENV === "development") {
  window.APIHOST = DEVSERVER;
} else if (process.env.NODE_ENV === "production") {
  window.APIHOST = PRODSERVER;
}

// tslint:disable-next-line:no-unused-expression
new Vue({
  el: "#app",
  router,
  i18n,
  render: h => h(App)
});

import "./assets/scripts/hack";