<script setup lang="ts">
import { computed, ref } from "vue";
import { useSessions } from "@/composables/useSessions";

import MetricCard from "@/components/MetricCard.vue";
import FlowChart from "@/components/FlowChart.vue";
import { useRoute } from "vue-router";
import Sidebar from "@/components/layout/Sidebar.vue";
const { sessions } = useSessions();

const route = useRoute();

const deviceId = computed(() => route.params.id as string | undefined);

const filteredSessions = computed(() => {
  if (!deviceId.value) return [];

  return sessions.value.filter(s => s.deviceId === deviceId.value);
});

const showSidebar = ref(false);

const openSidebar = () => {
  if (!deviceId.value) return;
  showSidebar.value = true;
};

const closeSidebar = () => {
  showSidebar.value = false;
};

const toggleSidebar = () => {
  if (!deviceId.value) return;
  showSidebar.value = !showSidebar.value;
};




const recent = computed(() =>
  [...filteredSessions.value]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 50)
);

const chartData = computed(() =>
  filteredSessions.value.flatMap(s =>
    s.data.map(p => ({
      x: s.createdAt + p.t * 1000,
      y: p.flow,
      z: p.pressure
    }))
  )
);

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


</script>

<template>
  <Sidebar
    :sessions="sessions"
    :show="showSidebar"
    @close="showSidebar = false"
  />
  <div class="container">
    <h1 class="text-5xl font-bold mb-4">📊 Lung Dashboard 仪表板</h1>

    <!-- METRICS -->
    <div class="cards">
      <MetricCard title="Avg Flow" :value="avgFlow" />
      <MetricCard title="Peak Flow" :value="peakFlow" />
      <MetricCard title="Data Points" :value="recent.length" />
    </div>

    <!-- CHART -->
     <div class="relative flex gap-4 w-full justify-center">
      <div class="chart">
        <h1 class="font-bold text-center">流动</h1>
        <FlowChart :dataPoints="flowData" />
      </div>
      <div class="chart">
        <h1 class="font-bold text-center">压力</h1>
        <FlowChart :dataPoints="pressureData" color="#f87171" bgColor="rgba(248, 113, 113, 0.2)" />
      </div>
     </div>
    <!-- RAW DATA -->
    <div class="list">
      <div v-for="s in recent" :key="s.createdAt">
        <div v-for="d in s.data" :key="d.t">
          Flow: {{ d.flow }} | Pressure: {{ d.pressure }}
        </div>
      </div>
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
  align-items: center;

  width: 100%;
  max-width: none;
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
