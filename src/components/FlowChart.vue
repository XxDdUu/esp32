<script setup lang="ts">
import { Line } from "vue-chartjs";
import {
  Chart,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
} from "chart.js";

Chart.register(LineElement, PointElement, LinearScale, CategoryScale);

const props = defineProps<{
  dataPoints: number[];
}>();

const chartData = {
  labels: props.dataPoints.map((_, i) => i),
  datasets: [
    {
      data: props.dataPoints,
      borderColor: "#38bdf8",
      tension: 0.3,
    },
  ],
};
</script>

<template>
  <Line :data="chartData" />
</template>
