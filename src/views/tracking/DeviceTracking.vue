<script setup lang="ts">
import { computed } from "vue";
import { useSessions } from "@/composables/useSessions";

import MetricCard from "@/components/MetricCard.vue";
import FlowChart from "@/components/FlowChart.vue";

const { sessions } = useSessions();

const recent = computed(() => [...sessions.value].reverse().slice(0, 50));
const chartData = computed(() =>
  sessions.value.flatMap(s =>
    s.data.map(p => ({
      x: p.t,
      y: p.flow
    }))
  )
);

const flowData = computed(() =>
  chartData.value.map(p => p.y)
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
  <div class="container">
    <h1 class="text-5xl font-bold mb-4">📊 Lung Dashboard 仪表板</h1>

    <!-- METRICS -->
    <div class="cards">
      <MetricCard title="Avg Flow" :value="avgFlow" />
      <MetricCard title="Peak Flow" :value="peakFlow" />
      <MetricCard title="Data Points" :value="recent.length" />
    </div>

    <!-- CHART -->
    <div class="chart">
      <FlowChart :dataPoints="flowData" />
    </div>

    <!-- RAW DATA -->
    <div class="list">
      <div v-for="(s, i) in recent" :key="i">
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
