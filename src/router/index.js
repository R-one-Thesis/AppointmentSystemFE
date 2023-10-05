import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function ({ store }) {
 
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })
  Router.beforeEach((to, from, next) => {
    const token = store.state.value.user.token;
   
    // Check if the route requires authentication
    if (to.meta.requiresAuth) {
      
      // Check if the token exists in local storage
      if (token) {
        
        next();
      } else {
        // Token does not exist, redirect to login
        next('/Login');
      }
    } else {
      // Route does not require authentication, proceed
      if (to.path === '/Login') {
        // If the user is already authenticated, redirect to dashboard (assuming '/' is the dashboard)
        if (token) {
          next('/');
        } else {
          // If the user is not authenticated, allow access to the login page
          next();
        }
      } else {
        // Allow access to other public routes
        next();
      }
    }
  });
  return Router
})
