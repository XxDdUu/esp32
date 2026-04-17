import { ref, onValue } from "firebase/database";
import { db } from "./firebase";
import type { Session } from "@/types/session";

type Mode = "latest" | "all";

interface ListenOptions {
  mode?: Mode;
  from?: number;        
  to?: number;          
}
export const listenSessions = (
  callback: (data: Session[]) => void,
  options: ListenOptions = {}
) => {
  const { mode = "latest", from, to } = options;

  const sessionsRef = ref(db, "sessions");

  const unsubscribe = onValue(sessionsRef, (snapshot) => {
    const val = snapshot.val();
    if (!val) return;

    const list: Session[] = [];

    Object.entries(val).forEach(([userId, devices]: any) => {
      Object.entries(devices).forEach(([deviceId, sessions]: any) => {

        let latest: any = null;

        Object.entries(sessions).forEach(([sessionId, item]: any) => {
          const createdAt = item.createdAt;

          // 👉 filter theo ngày (nếu có)
          if (from && createdAt < from) return;
          if (to && createdAt > to) return;

          if (mode === "all") {
            list.push({
              userId,
              deviceId,
              createdAt,
              metrics: item.metrics,
              data: item.data ? Object.values(item.data) : []
            });
          } else {
            // mode = latest
            if (!latest || createdAt > latest.createdAt) {
              latest = {
                userId,
                deviceId,
                createdAt,
                metrics: item.metrics,
                data: item.data ? Object.values(item.data) : []
              };
            }
          }
        });

        if (mode === "latest" && latest) {
          list.push(latest);
        }
      });
    });

    callback(list);
  });
  return unsubscribe;
};