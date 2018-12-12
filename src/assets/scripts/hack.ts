import Vue from "vue";

Vue.prototype.$ts = (key: string) => {
  Vue.prototype.$t(key);
};
