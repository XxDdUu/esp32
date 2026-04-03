import { ref, onMounted } from "vue";
import { listenSessions } from "@/firebase/session.service";
import type { Session } from "@/types/session";

export const useSessions = () => {
  const sessions = ref<Session[]>([]);

  onMounted(() => {
    listenSessions((data) => {
      sessions.value = data;
      console.log("Sessions updated:", sessions.value);
    });
  });

  return { sessions };
};
