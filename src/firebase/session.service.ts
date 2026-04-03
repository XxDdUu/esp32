import { ref, onValue } from "firebase/database";
import { db } from "./firebase";
import type { Session } from "@/types/session";

export const listenSessions = (callback: (data: Session[]) => void) => {
  const sessionsRef = ref(db, "sessions/test");

  onValue(sessionsRef, (snapshot) => {
    const val = snapshot.val();
    console.log("Current sessions:", val);

    if (!val) return;

    const list: Session[] = Object.values(val);

    callback(list);
  });
};
