<script setup lang="ts">
import { Line } from "vue-chartjs";
import {
  Chart,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
} from "chart.js";
import { computed } from "vue";

Chart.register(LineElement, PointElement, LinearScale, CategoryScale);

const props = defineProps<{
  dataPoints: number[];
  color?: string;
  bgColor?: string;
}>();

const chartData = computed(() => ({
  labels: props.dataPoints.map((_, i) => i),
  datasets: [
    {
      label: "Flow",
      data: props.dataPoints,
      borderColor: props.color || "#38bdf8",
      backgroundColor: props.bgColor || "rgba(56, 189, 248, 0.2)",
      tension: 0.3,
      fill: true,
    },
  ],
}));
</script>

<template>
  <Line :data="chartData" />
</template>
