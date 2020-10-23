import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

function initApp() {
  new Vue({
    render: (h) => h(App),
  }).$mount("#app");
}

document.addEventListener("deviceready", initApp);
