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

export default router;