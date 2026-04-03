<script setup lang="ts">
import { ref } from "vue";
import { addDevice, listenDevices, deleteDevice } from "@/firebase/device.service";
import { getCurrentUser, onUserChanged } from "@/firebase/auth";
import InputField from "@/components/ui/InputField.vue";
import { onMounted, onBeforeUnmount } from "vue";
import { getStatus } from "@/utils/device";


const deviceId = ref("");
const deviceKey = ref("");
const devices = ref<any[]>([]);
const loading = ref(true);
const message = ref("");
const user = ref<any>(null);
let unsubscribeDevices: (() => void) | null = null;


onMounted(() => {
  user.value = getCurrentUser();

  onUserChanged((u) => {
    user.value = u;

    if (unsubscribeDevices) unsubscribeDevices();
    if (user.value) {
      unsubscribeDevices = listenDevices(user.value.uid, (list) => {
        devices.value = list;
        loading.value = false;
      });
    } else {
      devices.value = [];
    }
  });

  if (user.value) {
    unsubscribeDevices = listenDevices(user.value.uid, (list) => {
      devices.value = list;
      loading.value = false;
    });
  }
});

onBeforeUnmount(() => {
  if (unsubscribeDevices) unsubscribeDevices();
});

const handleDelete = async (id: string) => {
  if (!confirm("Delete this device?")) return;

  await deleteDevice(id);
};


const handleAddDevice = async () => {
  const user = getCurrentUser();

  if (!user) {
    message.value = "You must login first!";
    return;
  }

  if (!deviceId.value || !deviceKey.value) {
    message.value = "Missing fields!";
    return;
  }

  try {
    await addDevice(deviceId.value, {
      owner: user.uid,
      key: deviceKey.value,
      createdAt: Date.now(),
    });

    message.value = "Device added successfully! 🚀";

    deviceId.value = "";
    deviceKey.value = "";
  } catch (err) {
    console.error(err);
    message.value = "Error adding device";
  }
};
</script>

<template>
  <div class="max-w-md mx-auto mt-10 space-y-4">

    <h2 class="text-xl font-bold">Add ESP32 Device</h2>

    <InputField
      v-model="deviceId"
      label="Device ID"
      placeholder="Device ID (e.g. esp32_001)"
    />

    <InputField
      v-model="deviceKey"
      label="Device Key"
      placeholder="Device Key"
    />

    <button
        v-if="user"
      @click="handleAddDevice"
      class="w-full bg-blue-600 text-white py-2 rounded"
    >
      Add Device
    </button>

    <p class="text-sm text-gray-500">{{ message }}</p>

  </div>
   <div class="max-w-2xl mx-auto mt-10">

    <h2 class="text-xl font-bold mb-4">Your Devices</h2>

    <div v-if="devices.length === 0">
      No devices yet 💀
    </div>

    <div class="space-y-3">
      <div
        v-for="d in devices"
        :key="d.id"
        class="flex justify-between items-center p-4 border rounded-lg bg-white shadow-sm"
      >
        <div>
          <div class="font-semibold">{{ d.id }}</div>
          <div class="text-sm text-gray-500">
            Key: {{ d.key }}
          </div>
          <span v-if="getStatus(d.lastSeen) === 'online'">🟢 Online</span>
        <span v-else-if="getStatus(d.lastSeen) === 'idle'">🟡 Idle</span>
        <span v-else>🔴 Offline</span>
        </div>

        <button
          @click="handleDelete(d.id)"
          class="text-red-500 hover:text-red-700"
        >
          Delete
        </button>
      </div>
    </div>

  </div>
</template>
