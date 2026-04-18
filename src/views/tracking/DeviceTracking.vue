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
  <Sidebar />
  <div class="container">
    <h1 class="text-5xl font-bold mb-4 text-center">📊 Lung Dashboard 仪表板</h1>

    <!-- METRICS -->
    <div class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    <div class="rounded-xl p-5 text-white bg-red-500 flex justify-between items-center shadow">
      <div>
        <p class="text-sm opacity-80">Avg Flow</p>
        <h2 class="text-2xl font-bold">{{ avgFlow }}</h2>
      </div>
      <i class="text-3xl opacity-70">👤</i>
    </div>

    <div class="rounded-xl p-5 text-white bg-orange-400 flex justify-between items-center shadow">
      <div>
        <p class="text-sm opacity-80">Peak Flow</p>
        <h2 class="text-2xl font-bold">{{ peakFlow }}</h2>
      </div>
      <i class="text-3xl opacity-70">📊</i>
    </div>

    <div class="rounded-xl p-5 text-white bg-blue-400 flex justify-between items-center shadow">
      <div>
        <p class="text-sm opacity-80">Data Points</p>
        <h2 class="text-2xl font-bold">{{ recent.length }}</h2>
      </div>
      <i class="text-3xl opacity-70">👥</i>
    </div>

    <div class="rounded-xl p-5 text-white bg-purple-500 flex justify-between items-center shadow">
      <div>
        <p class="text-sm opacity-80">Last Seen</p>
        <h2 class="text-lg font-bold">{{ lastSeenText }}</h2>
      </div>
      <i class="text-3xl opacity-70">📄</i>
    </div>
  </div>


    <!-- CHART -->
    <div class="flex-1 min-h-0">
    <TagsArrowScroll class="h-full" :scrollAmount="1500">

      <!-- PAGE 1 -->
      <div class="snap-start min-w-full shrink-0 h-full flex -mx-2">
        
        <div class="flex-1 h-full px-2">
          <FlowChart :dataPoints="flowData" />
        </div>

        <div class="flex-1 h-full px-2">
          <FlowChart :dataPoints="pressureData" color="red" bgColor="rgb(255, 0, 0, 0.2)"/>
        </div>

      </div>

      <!-- PAGE 2 -->
      <div class="snap-start min-w-full shrink-0 h-full flex gap-4">

      <!-- LEFT -->
      <div class="flex-1 min-w-0 h-full rounded-xl p-4 
                  border border-white/10 
                  bg-white/5 backdrop-blur">
        <FlowChart 
          :dataObjects="metricsChartData" 
          :dataKey="'FVC'" 
          :multiLine="true" 
        />
      </div>

      <!-- RIGHT -->
        <div class="flex-1 min-w-0 h-full rounded-xl p-4 
                    border border-white/10 
                    bg-white/5 backdrop-blur">

          <TagsArrowScroll axis="y" class="h-full" :scrollAmount="300">
            
            <div class="flex flex-col gap-4 min-h-full">
              
              <div class="rounded-xl p-5 text-white bg-[#38bdf8] flex justify-between items-center shadow">
                <div>
                  <p class="text-sm opacity-80">FEV1</p>
                  <h2 class="text-2xl font-bold">
                    {{ filteredSessions[0]?.metrics?.FEV1 || 0 }}
                  </h2>
                </div>
                <i class="text-3xl opacity-70">📊</i>
              </div>

              <div class="rounded-xl p-5 text-white bg-[#34d399] flex justify-between items-center shadow">
                <div>
                  <p class="text-sm opacity-80">FVC</p>
                  <h2 class="text-2xl font-bold">
                    {{ filteredSessions[0]?.metrics?.FVC || 0 }}
                  </h2>
                </div>
                <i class="text-3xl opacity-70">📊</i>
              </div>

              <div class="rounded-xl p-5 text-white bg-[#fbbf24] flex justify-between items-center shadow">
                <div>
                  <p class="text-sm opacity-80">PEF</p>
                  <h2 class="text-2xl font-bold">
                    {{ filteredSessions[0]?.metrics?.PEF || 0 }}
                  </h2>
                </div>
                <i class="text-3xl opacity-70">📊</i>
              </div>

              <div class="rounded-xl p-5 text-white bg-[#f87171] flex justify-between items-center shadow">
                <div>
                  <p class="text-sm opacity-80">P_peak</p>
                  <h2 class="text-2xl font-bold">
                    {{ filteredSessions[0]?.metrics?.P_peak || 0 }}
                  </h2>
                </div>
                <i class="text-3xl opacity-70">📊</i>
              </div>

            </div>

          </TagsArrowScroll>
        </div>

          </div>
        </TagsArrowScroll>
    </div>
    <!-- RAW DATA -->
    <div class="mt-6 w-full overflow-x-auto">
    <table class="w-full text-sm text-left border border-white/10 rounded-xl overflow-hidden">
    
    <!-- HEADER -->
    <thead class="bg-white/10 text-white">
      <tr>
        <th class="px-4 py-3">Time</th>
        <th class="px-4 py-3">Flow</th>
        <th class="px-4 py-3">Pressure</th>
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

          <td class="px-4 py-2 font-medium text-cyan-400">
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
</template>

<style scoped>
.container {
  padding: 20px;
  background: #0f172a;
  min-height: 100vh;
  color: white;

  display: flex;
  flex-direction: column;

  width: 100%;
  max-width: none;  
  height: 100vh;
}


.cards {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;

  justify-content: center;
  flex-wrap: wrap;
}


.chart {
  background: #1e293b;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.list {
  max-height: 200px;
  overflow-y: auto;
}
</style>
