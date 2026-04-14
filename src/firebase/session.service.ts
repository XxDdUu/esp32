import { ref, onValue } from "firebase/database";
import { db } from "./firebase";
import type { Session } from "@/types/session";

export const listenSessions = (callback: (data: Session[]) => void) => {
  const sessionsRef = ref(db, "sessions");

  onValue(sessionsRef, (snapshot) => {
    const val = snapshot.val();
    if (!val) return;

    const list: Session[] = [];

    Object.entries(val).forEach(([userId, devices]: any) => {
      Object.entries(devices).forEach(([deviceId, sessions]: any) => {
        Object.entries(sessions).forEach(([sessionId, item]: any) => {
          list.push({
            userId,
            deviceId,
            createdAt: item.createdAt,
            metrics: item.metrics,
            data: item.data ? Object.values(item.data) : []
          });
        });
      });
    });

    callback(list);
  });
};
