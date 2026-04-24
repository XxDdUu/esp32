<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import { useSessions } from "@/composables/useSessions";

import FlowChart from "@/components/FlowChart.vue";
import { useRoute } from "vue-router";
import Sidebar from "@/components/layout/Sidebar.vue";
import { getCurrentUser, onUserChanged } from "@/firebase/auth";
import { listenDevices } from "@/firebase/device.service";
import type { Device } from "@/types/session";
import type { User } from "firebase/auth";
import { useSessionFilterStore } from "@/stores/sessionFilter";
import TagsArrowScroll from "@/components/ui/scroll/TagArrowScroll.vue";
import { Tag } from "lucide-vue-next";

const route = useRoute();
const devices = ref<Device[]>([]);
const loading = ref(true);
const user = ref<User | null>(null);
let unsubscribeDevices: (() => void) | null = null;

const filterStore = useSessionFilterStore();

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

const deviceId = computed(() => route.params.id as string | undefined);
const { filteredSessions, selectedSession } = useSessions(deviceId);



const latestSessionGlobal = computed(() => {
  if (!filteredSessions.value.length) return null;

  return [...filteredSessions.value].sort(
    (a, b) => b.createdAt - a.createdAt
  )[0];
});



const currentSession = computed(() => {
  if (filterStore.selectedDay) {
    return selectedSession.value;
  }

  return latestSessionGlobal.value;
});
const device = computed(() =>
  devices.value.find(d => d.id === deviceId.value)
);



const recent = computed(() => {
  if (!currentSession.value) return [];
  return [currentSession.value];
});

const chartData = computed(() => {
  if (!currentSession.value) return [];

  return currentSession.value.data.map(p => ({
    x: currentSession.value!.createdAt + p.t * 1000,
    y: p.flow,
    z: p.pressure
  }));
});

const flowData = computed(() =>
  chartData.value.map(p => p.y)
);
const pressureData = computed(() =>
  chartData.value.map(p => p.z)
);

const avgFlow = computed(() => {
  const arr = chartData.value;
  if (!arr.length) return 0;

  return arr.reduce((sum, p) => sum + p.y, 0) / arr.length;
});

const peakFlow = computed(() => {
  const arr = chartData.value;
  if (!arr.length) return 0;

  return Math.max(...arr.map(p => p.y));
}); 

const lastSeenText = computed(() =>
  device.value?.lastSeen
    ? new Date(device.value.lastSeen).toLocaleString()
    : "N/A"
)
const metricsChartData = computed(() => {
  return filteredSessions.value
    .sort((a, b) => a.createdAt - b.createdAt)
    .map((s) => ({
      time: new Date(s.createdAt).toLocaleTimeString(),
      FEV1: s.metrics?.FEV1,
      FVC: s.metrics?.FVC,
      PEF: s.metrics?.PEF,
      P_peak: s.metrics?.P_peak
    }));
});
</script>

<template>
  <div class="flex h-screen bg-slate-900 text-white overflow-hidden">

    <!-- SIDEBAR -->
    <Sidebar />

    <!-- MAIN -->
    <div class="flex flex-col flex-1 min-w-0">

      <!-- HEADER -->
      <header class="h-14 px-4 flex items-center justify-between border-b border-white/10 backdrop-blur bg-white/5">
        <h1 class="text-lg md:text-xl font-semibold">
          📊 Lung Dashboard 仪表板
        </h1>
        <div class="text-xl">👤</div>
      </header>

      <!-- CONTENT -->
      <main class="flex-1 min-h-0 p-4 flex flex-col gap-4 overflow-hidden">

        <!-- METRICS -->
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

          <div class="card bg-linear-to-br from-red-500 to-red-600">
            <div>
              <p class="text-sm opacity-80">Avg Flow</p>
              <h2 class="text-2xl font-bold">{{ avgFlow }}</h2>
            </div>
            <i class="text-3xl opacity-70">👤</i>
          </div>

          <div class="card bg-gradient-to-br from-orange-400 to-orange-500">
            <div>
              <p class="text-sm opacity-80">Peak Flow</p>
              <h2 class="text-2xl font-bold">{{ peakFlow }}</h2>
            </div>
            <i class="text-3xl opacity-70">📊</i>
          </div>

          <div class="card bg-gradient-to-br from-blue-400 to-blue-500">
            <div>
              <p class="text-sm opacity-80">Data Points</p>
              <h2 class="text-2xl font-bold">{{ recent.length }}</h2>
            </div>
            <i class="text-3xl opacity-70">👥</i>
          </div>

          <div class="card bg-gradient-to-br from-purple-500 to-purple-600">
            <div>
              <p class="text-sm opacity-80">Last Seen</p>
              <h2 class="text-lg font-bold">{{ lastSeenText }}</h2>
            </div>
            <i class="text-3xl opacity-70">📄</i>
          </div>

        </div>

        <!-- CHART SECTION -->
        <div class="flex-1 min-h-0 rounded-xl border border-white/10 bg-white/5 backdrop-blur p-3 overflow-hidden">

          <TagsArrowScroll class="h-full" :scrollAmount="1200">

            <!-- PAGE 1 -->
            <div class="snap-start min-w-full h-full flex flex-col xl:flex-row gap-4">

              <div class="flex-1 min-h-[250px]">
                <FlowChart :dataPoints="flowData" />
              </div>

              <div class="flex-1 min-h-[250px]">
                <FlowChart 
                  :dataPoints="pressureData" 
                  color="red" 
                  bgColor="rgba(255,0,0,0.2)"
                />
              </div>

            </div>

            <!-- PAGE 2 -->
            <div class="snap-start min-w-full h-full flex flex-col xl:flex-row gap-4">

              <!-- LEFT -->
              <div class="flex-1 min-h-[250px] rounded-xl p-4 border border-white/10 bg-white/5 backdrop-blur">
                <FlowChart 
                  :dataObjects="metricsChartData" 
                  :dataKey="'FVC'" 
                  :multiLine="true" 
                />
              </div>

              <!-- RIGHT -->
              <div class="flex-1 min-h-[250px] rounded-xl p-4 border border-white/10 bg-white/5 backdrop-blur overflow-y-auto">

                <div class="flex flex-col gap-4">

                  <div class="card bg-[#38bdf8]">
                    <div>
                      <p class="text-sm opacity-80">FEV1</p>
                      <h2 class="text-2xl font-bold">
                        {{ filteredSessions[0]?.metrics?.FEV1 || 0 }}
                      </h2>
                    </div>
                    <i class="text-3xl opacity-70">📊</i>
                  </div>

                  <div class="card bg-[#34d399]">
                    <div>
                      <p class="text-sm opacity-80">FVC</p>
                      <h2 class="text-2xl font-bold">
                        {{ filteredSessions[0]?.metrics?.FVC || 0 }}
                      </h2>
                    </div>
                    <i class="text-3xl opacity-70">📊</i>
                  </div>

                  <div class="card bg-[#fbbf24]">
                    <div>
                      <p class="text-sm opacity-80">PEF</p>
                      <h2 class="text-2xl font-bold">
                        {{ filteredSessions[0]?.metrics?.PEF || 0 }}
                      </h2>
                    </div>
                    <i class="text-3xl opacity-70">📊</i>
                  </div>

                  <div class="card bg-[#f87171]">
                    <div>
                      <p class="text-sm opacity-80">P_peak</p>
                      <h2 class="text-2xl font-bold">
                        {{ filteredSessions[0]?.metrics?.P_peak || 0 }}
                      </h2>
                    </div>
                    <i class="text-3xl opacity-70">📊</i>
                  </div>

                </div>

              </div>

            </div>

          </TagsArrowScroll>
        </div>

        <!-- TABLE -->
        <div class="flex-1 min-h-0 rounded-xl border border-white/10 bg-white/5 backdrop-blur overflow-hidden">

          <div class="h-full overflow-auto">
            <table class="w-full text-sm">

              <!-- HEADER -->
              <thead class="sticky top-0 bg-slate-800/80 backdrop-blur z-10">
                <tr>
                  <th class="px-4 py-3 text-left">Time</th>
                  <th class="px-4 py-3 text-left">Flow</th>
                  <th class="px-4 py-3 text-left">Pressure</th>
                </tr>
              </thead>

              <!-- BODY -->
              <tbody>
                <template v-for="s in recent" :key="s.createdAt">
                  <tr
                    v-for="d in s.data"
                    :key="d.t"
                    class="border-t border-white/10 hover:bg-white/5 transition"
                  >
                    <td class="px-4 py-2">
                      {{ new Date(s.createdAt + d.t * 1000).toLocaleString() }}
                    </td>

                    <td class="px-4 py-2 text-cyan-400 font-medium">
                      {{ d.flow }}
                    </td>

                    <td class="px-4 py-2 text-red-400">
                      {{ d.pressure }}
                    </td>
                  </tr>
                </template>
              </tbody>

            </table>
          </div>

        </div>

      </main>
    </div>
  </div>
</template>

<style scoped>
.card {
  @apply rounded-xl p-5 text-white flex justify-between items-center shadow-lg 
         transition-all duration-200 hover:scale-[1.02] hover:shadow-xl;
}
</style>