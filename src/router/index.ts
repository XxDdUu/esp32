import { createRouter, createWebHistory } from "vue-router";
import AuthPage from "@/views/auth/Auth.vue";
import Devices from "@/views/devices/Devices.vue";
import DeviceTracking from "@/views/tracking/DeviceTracking.vue";

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
    component: DeviceTracking,
  },
  {
    path: "/devices",
    component: Devices,
  },
  { path: "/tracking/:id", name: "tracking", component: DeviceTracking }
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
