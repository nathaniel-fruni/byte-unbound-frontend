import { createRouter, createWebHistory } from "vue-router";
import publicRoutes from "./public";
import adminRoutes from "./admin";

const routes = [
  ...publicRoutes,
  ...adminRoutes,
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated()) {
      next({ path: '/sign-in' });
    } else {
      next();
    }
  } else {
    next();
  }
});

function isAuthenticated() {
  const accessToken = document.cookie.replace(/(?:(?:^|.;\s)access_token\s*=\s*([^;]).$)|^.*$/,"$1");
  console.log('Access token from cookies:', accessToken);
  return accessToken ? true : false;
}

export default router;