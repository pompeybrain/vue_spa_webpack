import Vue from 'vue';
import Router from 'vue-router';
import Layout from './pages/Layout.vue';
import Login from './pages/Login.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      component: Layout,
      children: [
        {
          path: '/server',
          component: () =>
            import(/* webpackChunkName: "server" */ './pages/server.vue')
        },
        {
          path: '/log',
          component: () =>
            import(/* webpackChunkName: "log" */ './pages/log.vue')
        }
      ]
    },
    {
      path: '*',
      component: () =>
        import(/* webpackChunkName: "notfound" */ './pages/NotFound.vue')
    }
  ]
});
