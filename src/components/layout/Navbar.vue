<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getCurrentUser, onUserChanged, logout } from "@/firebase/auth";
import type { User } from "firebase/auth";
import { Dropdown, DropdownItem } from "@/components/ui/dropdown";
import { listenDevices } from "@/firebase/device.service";
import type { Device } from "@/types/session";
import { getStatus, getStatusColor } from "@/utils/device";
import { Menu, X } from "lucide-vue-next";
import { useUiStore } from "@/stores/ui";

const route = useRoute();
const router = useRouter();
const devices = ref<Device[]>([]);
const loading = ref(true);
const user = ref<User | null>(null);
let unsubscribeDevices: (() => void) | null = null;
const selectedDeviceId = computed(() => route.params.id as string | undefined);
const ui = useUiStore();

const selectedDevice = computed(() =>
  devices.value.find(d => d.id === selectedDeviceId.value)
);

const isTrackingPage = computed(() =>
  route.path.startsWith("/tracking")
);

const selectDevice = (id: string) => {
  showDevicesDropdown.value = false;
  router.push(`/tracking/${id}`);
};

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


const showDevicesDropdown = ref(false);



const go = (path: string) => router.push(path);

onMounted(() => {
  onUserChanged((u) => {
    user.value = u;
  });
});

const handleLogout = async () => {
  await logout();
  router.push("/auth");
};
</script>

<template>
  <nav class="flex items-center justify-between px-6 h-14 bg-slate-900 text-white">
    
    <!-- LEFT -->
     <div class="flex items-center gap-6">
      <div class="text-xl font-bold cursor-pointer" @click="go('/')">
        ESP32
      </div>
        <button
          v-if="selectedDevice"
          @click="ui.toggleSidebar()"
          class="px-2 py-1 text-sm border border-slate-500 rounded-md
                text-slate-300 hover:bg-slate-800 transition"
        >
            <Menu v-if="!ui.sidebarOpen" class="w-4 h-4" />
          <X v-else class="w-4 h-4" />
        </button>
    </div>  
    <!-- RIGHT -->
    <div class="flex items-center gap-6">

    <!-- TRACKING -->
      <template v-if="isTrackingPage">
        <Dropdown align="right">
          <!-- Trigger -->
          <template #trigger="{ toggle }">
            <button
                @click="toggle"
              class="px-3 py-1.5 border border-slate-500 rounded-md
                    text-slate-200
                    hover:bg-slate-800 hover:border-slate-400
                    transition flex items-center gap-2"
            >
              <span>Tracking /</span>

              <span v-if="selectedDevice" class="font-semibold">
                {{ selectedDevice.id }}
              </span>

              <span v-else class="text-slate-400">
                Select device
              </span>

              <!-- status dot -->
              <span
                v-if="selectedDevice"
                class="w-2 h-2 rounded-full"
                :class="getStatusColor(getStatus(selectedDevice.lastSeen))"
              />
            </button>
          </template>

          <!-- Content -->
          <div v-if="loading" class="px-4 py-2 text-sm">
            Loading...
          </div>

          <DropdownItem 
            v-for="d in devices"
            :key="d.id + d.key"
            @click="selectDevice(d.id)"
            class="bg-[#0f172a] border-accent border rounded-md last:mb-0"
          >
            <div class="flex flex-col ">
              
              <!-- Device ID -->
              <span class="font-medium">
                {{ d.id }}
              </span>

              <!-- Key -->
              <span class="text-xs text-slate-400">
                Key: {{ d.key }}
              </span>

              <!-- Status -->
              <span
                class="text-xs font-semibold"
                :class="getStatusColor(getStatus(d.lastSeen))"
              >
                {{ getStatus(d.lastSeen) }}
              </span>

            </div>
          </DropdownItem>


          <div v-if="!loading && devices.length === 0" class="px-4 py-2 text-sm">
            No devices
          </div>
        </Dropdown>
      </template>

      <!-- NOT tracking page -->
      <template v-else>
        <button
          @click="go('/tracking')"
          class="hover:text-blue-400"
        >
          Tracking
        </button>
      </template>

      <!-- DEVICES -->
      <button @click="go('/devices')" class="hover:text-blue-400">
        Devices
      </button>

      <!-- LOGIN -->
      <button 
        v-if="!user"
        @click="go('/auth')"
        class="hover:text-blue-400"
      >
        Login
      </button>

      <!-- USER -->
      <div v-else>
        <Dropdown align="right">  
          <template #trigger>
            <img
              :src="user.photoURL || undefined"
              class="w-8 h-8 rounded-full cursor-pointer border"
            />
          </template>

          <div class="px-4 py-2 text-sm border-b">
            {{ user.displayName }}
          </div>

          <DropdownItem @click="handleLogout">
            Logout
          </DropdownItem>
        </Dropdown>
      </div>

    </div>

  </nav>
</template>
