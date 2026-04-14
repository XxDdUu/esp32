import { ref } from "vue";
import type { Device } from "@/types/session";

const devices = ref<Device[]>([]);

export const useDevices = () => {
  return { devices };
};
