<script setup lang="ts">
import { ref } from "vue";
import { addDevice, listenDevices, deleteDevice } from "@/firebase/device.service";
import { getCurrentUser, onUserChanged } from "@/firebase/auth";
import InputField from "@/components/ui/InputField.vue";
import { onMounted, onBeforeUnmount } from "vue";
import { getStatus } from "@/utils/device";
import { useRouter } from "vue-router";
import type { Device } from "@/types/session";
import type { User } from "firebase/auth";

const router = useRouter();
const deviceId = ref("");
const deviceKey = ref("");
const devices = ref<Device[]>([]);
const loading = ref(true);
const message = ref("");
const user = ref<User | null>(null);
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
const handleDeviceClick = (deviceId: string) => {
  router.push({ name: "tracking", params: { id: deviceId } });
};

</script>

<template>
  <div class="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center px-4">

  <!-- FORM -->
  <div class="w-full max-w-md mt-10 flex flex-col gap-4
              bg-slate-800 border border-[#c084fc] 
              p-6 rounded-xl shadow">

    <h2 class="text-xl font-bold text-[#c084fc]">
      Add ESP32 Device
    </h2>

    <div class="flex flex-col gap-3">
      <InputField
        v-model="deviceId"
        label="Device ID"
        placeholder="esp32_001"
        bg-color="bg-slate-800"
        focus-color="focus:ring-[#c084fc]"
      />

      <InputField
        v-model="deviceKey"
        label="Device Key"
        placeholder="Device Key"
        bg-color="bg-slate-800"
        focus-color="focus:ring-[#c084fc]"
      />
    </div>

    <button
      v-if="user"
      @click="handleAddDevice"
      class="w-full bg-[#c084fc] hover:bg-[#a855f7] text-white py-2 rounded transition"
    >
      Add Device
    </button>

    <p class="text-sm text-slate-400">
      {{ message }}
    </p>
  </div>

  <!-- DEVICE LIST -->
  <div class="w-full max-w-3xl mt-10 flex flex-col gap-4">

    <h2 class="text-xl font-bold text-white">
      Your Devices
    </h2>

    <div v-if="devices.length === 0" class="text-slate-400">
      No devices yet 💀
    </div>

    <!-- LIST -->
    <div class="flex flex-col gap-3">

      <div
        v-for="d in devices"
        :key="d.id"
        @click="handleDeviceClick(d.id)"
        class="flex justify-between items-center p-4 
              border border-slate-700 
              rounded-xl bg-slate-800 
              hover:bg-slate-700 hover:scale-[1.01]
              transition cursor-pointer"
      >
        <!-- LEFT -->
        <div class="flex flex-col gap-1">
          <span class="font-semibold text-white">
            {{ d.id }}
          </span>

          <span class="text-sm text-slate-400">
            Key: {{ d.key }}
          </span>

          <span
            class="text-xs font-semibold"
            :class="{
              'text-green-400': getStatus(d.lastSeen) === 'online',
              'text-yellow-400': getStatus(d.lastSeen) === 'idle',
              'text-red-400': getStatus(d.lastSeen) === 'offline'
            }"
          >
            {{ getStatus(d.lastSeen) }}
          </span>
        </div>

        <!-- RIGHT -->
        <div class="flex items-center gap-3">

          <button
            @click.stop="handleDelete(d.id)"
            class="text-red-400 hover:text-red-300 transition text-sm"
          >
            Delete
          </button>

        </div>
      </div>

    </div>
  </div>

</div>
</template>
