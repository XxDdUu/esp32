import { ref, set, off } from "firebase/database";
import { db } from "./firebase";
import { onValue, remove } from "firebase/database";

export const addDevice = async (
  deviceId: string,
  data: any
) => {
  const deviceRef = ref(db, `devices/${deviceId}`);
  await set(deviceRef, data);
};

export const listenDevices = (
  userId: string,
  callback: (devices: any[]) => void
): (() => void) => { 
  const devicesRef = ref(db, "devices");

  const listener = (snapshot: any) => {
    const val = snapshot.val();
    if (!val) return;

    const list = Object.entries(val)
      .map(([id, data]: any) => ({
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