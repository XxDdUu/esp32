<script setup lang="ts">
import { Line } from "vue-chartjs";
import {
  Chart,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
} from "chart.js";
import { computed, ref, onMounted, nextTick } from "vue";
import type { MetricsChartPoint } from "@/types/session";

Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Filler);

const chartRef = ref<any>(null);



const props = defineProps<{
  dataPoints?: number[];
  dataObjects?: MetricsChartPoint[];
  dataKey?: keyof MetricsChartPoint;
  color?: string;
  bgColor?: string;
}>();

const isObjectMode = computed(() => {
  return !!props.dataObjects?.length;
});
const labels = computed(() => {
  if (isObjectMode.value) {
    return props.dataObjects!.map((_, i) => i);
  }
  return props.dataPoints?.map((_, i) => i) ?? [];
});


const chartData = computed(() => {
  // MODE 1: simple number[]
  if (!isObjectMode.value) {
    return {
      labels: labels.value,
      datasets: [
        {
          label: "Flow",
          data: props.dataPoints ?? [],
          borderColor: props.color || "#38bdf8",
          backgroundColor: props.bgColor || "rgba(56,189,248,0.2)",
          fill: true,
          tension: 0.4,
        },
      ],
    };
  }

  // MODE 2: Metrics[]
  return {
    labels: labels.value,

    datasets: [
      {
        label: "FEV1",
        data: props.dataObjects!.map(d => d.FEV1 ?? 0),
        borderColor: "#38bdf8",
        backgroundColor: "rgba(56,189,248,0.15)",
        fill: true,
        tension: 0.4,
        pointRadius: 0,
      },
      {
        label: "FVC",
        data: props.dataObjects!.map(d => d.FVC ?? 0),
        borderColor: "#34d399",
        backgroundColor: "rgba(52,211,153,0.15)",
        fill: true,
        tension: 0.4,
        pointRadius: 0,
      },
      {
        label: "PEF",
        data: props.dataObjects!.map(d => d.PEF ?? 0),
        borderColor: "#fbbf24",
        backgroundColor: "rgba(251,191,36,0.15)",
        fill: true,
        tension: 0.4,
        pointRadius: 0,
      },
      {
        label: "P_peak",
        data: props.dataObjects!.map(d => d.P_peak ?? 0),
        borderColor: "#f87171",
        backgroundColor: "rgba(248,113,113,0.15)",
        fill: true,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };
});


const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: { grid: { display: false } },
    y: { grid: { display: true } },
  },
  plugins: {
    legend: { display: false },
  },
  fill: {
    target: "origin",
  },
};

onMounted(async () => {
  await nextTick();
  setTimeout(() => {
    chartRef.value?.chart?.resize();
  }, 0);
});
</script>

<template>
  <div class="w-full h-full relative">
    <Line ref="chartRef" :data="chartData" :options="options" />
  </div>
</template>
