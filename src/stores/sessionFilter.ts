import { defineStore } from "pinia";
import { ref } from "vue";

export const useSessionFilterStore = defineStore("sessionFilter", () => {
  const mode = ref<"latest" | "all">("latest");
  const selectedDay = ref<string | null>(null);
  const selectedTime = ref<number | null>(null);

  const setDay = (day: string) => {
    selectedDay.value = day;
    selectedTime.value = null;
    mode.value = "all";
  };

  const setTime = (time: number) => {
    selectedTime.value = time;
  };

  return {
    mode,
    selectedDay,
    selectedTime,
    setDay,
    setTime,
  };
});