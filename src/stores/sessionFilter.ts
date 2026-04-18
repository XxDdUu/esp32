import { defineStore } from "pinia";
import { ref } from "vue";

export const useSessionFilterStore = defineStore("sessionFilter", () => {
  const selectedDay = ref<string | null>(
    localStorage.getItem("selectedDay")
  );

  const selectedTime = ref<number | null>(
    Number(localStorage.getItem("selectedTime")) || null
  );

  const mode = ref<"latest" | "all">(
    (localStorage.getItem("mode") as any) || "latest"
  );

  const setDay = (day: string) => {
    selectedDay.value = day;
    localStorage.setItem("selectedDay", day);

    selectedTime.value = null;
    localStorage.removeItem("selectedTime");

    mode.value = "all";
    localStorage.setItem("mode", "all");
  };

  const setTime = (time: number) => {
    selectedTime.value = time;
    localStorage.setItem("selectedTime", String(time));
  };

  return {
    selectedDay,
    selectedTime,
    mode,
    setDay,
    setTime,
  };
});
