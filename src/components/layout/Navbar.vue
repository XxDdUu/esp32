<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { onUserChanged, logout } from "@/firebase/auth";

const router = useRouter();

const user = ref<any>(null);
const showMenu = ref(false);

const go = (path: string) => router.push(path);

onMounted(() => {
  onUserChanged((u) => {
    user.value = u;
  });
});

const handleLogout = async () => {
  await logout();
  showMenu.value = false;
  router.push("/auth");
};
</script>

<template>
  <nav class="flex items-center justify-between px-6 h-14 bg-slate-900 text-white">
    
    <!-- LEFT -->
    <div class="text-xl font-bold cursor-pointer" @click="go('/')">
      ESP32
    </div>

    <!-- RIGHT -->
    <div class="flex items-center gap-6">

      <button @click="go('/tracking')" class="hover:text-blue-400">
        Tracking
      </button>

      <button @click="go('/devices')" class="hover:text-blue-400">
        Devices
      </button>

      <!-- 👇 NOT LOGIN -->
      <button 
        v-if="!user"
        @click="go('/auth')"
        class="bg-blue-600 px-4 py-1.5 rounded-lg"
      >
        Login
      </button>

      <!-- 👇 LOGIN -->
      <div v-else class="relative">
        <img
          :src="user.photoURL"
          class="w-8 h-8 rounded-full cursor-pointer border"
          @click="showMenu = !showMenu"
        />

        <!-- DROPDOWN -->
        <div
          v-if="showMenu"
          class="absolute right-0 mt-2 w-40 bg-white text-black rounded-lg shadow-lg"
        >
          <div class="px-4 py-2 text-sm border-b">
            {{ user.displayName }}
          </div>

          <button
            @click="handleLogout"
            class="w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </div>

    </div>
  </nav>
</template>
