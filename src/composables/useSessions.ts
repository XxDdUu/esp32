import { ref, onMounted, onUnmounted, watch, computed, type Ref } from "vue";
import { listenSessions } from "@/firebase/session.service";
import type { Session } from "@/types/session";
import { useSessionFilterStore } from "@/stores/sessionFilter";


export const useSessions = (deviceId: Ref<string | undefined>) => {
  const sessions = ref<Session[]>([]);
  const filterStore = useSessionFilterStore();
  let unsubscribe: (() => void) | null = null;

    watch(
      deviceId,
      (id) => {
        if (!id) return;
        if (unsubscribe) unsubscribe();

        unsubscribe = listenSessions((data) => {
          sessions.value = data.filter(s => s.deviceId === id);
        }, { mode: "all" });
      },
      { immediate: true }
    );

    onUnmounted(() => {
      if (unsubscribe) unsubscribe();
    });



  const filteredSessions = computed(() => {
    if (!filterStore.selectedDay) return sessions.value;

    return sessions.value.filter((s) => {
      const d = new Date(s.createdAt);
      const [y, m, day] = filterStore.selectedDay!.split("-").map(Number);

      return (
        d.getFullYear() === y &&
        d.getMonth() + 1 === m &&
        d.getDate() === day
      );
    });
  });

  const latestSession = computed(() => {
    if (!filteredSessions.value.length) return null;

    return [...filteredSessions.value].sort(
      (a, b) => b.createdAt - a.createdAt
    )[0];
  });

  const selectedSession = computed(() => {
    if (!filterStore.selectedTime) return latestSession.value;

    return filteredSessions.value.find(
      (s) => s.createdAt === filterStore.selectedTime
    );
  });

  const sessionTimes = computed(() => {
    return filteredSessions.value
      .sort((a, b) => b.createdAt - a.createdAt)
      .map((s) => ({
        key: s.createdAt,
        label: new Date(s.createdAt).toLocaleTimeString(),
      }));
  });

  return {
    sessions,
    filteredSessions,
    latestSession,
    selectedSession,
    sessionTimes,
  };
};