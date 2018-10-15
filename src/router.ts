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
        }
      ]
    },
    {
      path: '*',
      component: resolve => import('./pages/NotFound.vue')
    }
  ]
});
