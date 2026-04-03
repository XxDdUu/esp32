import { createRouter, createWebHistory } from "vue-router";
import AuthPage from "@/views/auth/Auth.vue";
import Dashboard from "@/views/dashboard/Dashboard.vue";
import Devices from "@/views/devices/Devices.vue";

const routes = [
  { path: "/", 
    redirect: "/tracking" 
  },
  {
    path: "/auth",
    component: AuthPage,
  },
  {
    path: "/tracking",
    component: Dashboard,
  },
  {
    path: "/devices",
    component: Devices,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
