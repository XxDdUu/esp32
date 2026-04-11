import { ref, set, off } from "firebase/database";
import { db } from "./firebase";
import { onValue, remove } from "firebase/database";
import type { Device } from "../types/session";

export const addDevice = async (
  deviceId: string,
  data: Omit<Device, "id">
) => {
  const deviceRef = ref(db, `devices/${deviceId}`);
  await set(deviceRef, data);
};

export const listenDevices = (
  userId: string,
  callback: (devices: Device[]) => void
): (() => void) => { 
  const devicesRef = ref(db, "devices");

  const listener = (snapshot: any) => {
    const val = snapshot.val();
    if (!val) return;

    const list = Object.entries(val as Record<string, Omit<Device, "id">>)
      .map(([id, data]) => ({
        id,
        ...data,
      }))
      .filter((d) => d.owner === userId);

    callback(list);
  };

  onValue(devicesRef, listener);

  return () => off(devicesRef, "value", listener);
};


export const deleteDevice = async (deviceId: string) => {
  const deviceRef = ref(db, `devices/${deviceId}`);
  await remove(deviceRef);
};