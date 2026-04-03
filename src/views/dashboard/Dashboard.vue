<script setup lang="ts">
import { computed } from "vue";
import { useSessions } from "@/composables/useSessions";

import MetricCard from "@/components/MetricCard.vue";
import FlowChart from "@/components/FlowChart.vue";

const { sessions } = useSessions();

const recent = computed(() => sessions.value.slice(-50));

const flowData = computed(() =>
  sessions.value.flatMap(s =>
    s.data.map(p => p.flow)
  )
);


// 👉 stats đơn giản
const avgFlow = computed(() =>
  flowData.value.reduce((a, b) => a + b, 0) / (flowData.value.length || 1)
);

const peakFlow = computed(() =>
  Math.max(...flowData.value, 0)
);
</script>

<template>
  <div class="container">
    <h1>📊 Lung Dashboard</h1>

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
        Flow: {{ s.flow }} | Pressure: {{ s.pressure }}
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
}

.cards {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
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
