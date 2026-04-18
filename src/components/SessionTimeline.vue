<script setup lang="ts">
import { Scatter } from "vue-chartjs";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { computed } from "vue";
import { useSessionFilterStore } from "@/stores/sessionFilter";

ChartJS.register(LinearScale, PointElement, Tooltip);

const props = defineProps<{
  sessions: any[];
}>();

const filter = useSessionFilterStore();

// convert data
const data = computed(() => ({
  datasets: [
    {
      label: "Sessions",
      data: props.sessions.map((s) => ({
        x: s.createdAt,
        y: 1,
      })),
      pointRadius: 6,
      pointHoverRadius: 8,
    },
  ],
}));

// config
const options = {
  responsive: true,
  scales: {
    x: {
      type: "linear",
      ticks: {
        callback: (value: any) => {
          const d = new Date(value);
          return d.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          });
        },
      },
    },
    y: {
      display: false,
    },
  },
  plugins: {
    tooltip: {
      callbacks: {
        label: (ctx: any) => {
          const d = new Date(ctx.raw.x);
          return d.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          });
        },
      },
    },
  },
  onClick: (evt: any, elements: any[], chart: any) => {
    if (!elements.length) return;

    const index = elements[0].index;
    const point = chart.data.datasets[0].data[index];

    filter.setTime(point.x);
  },
};
</script>

<template>
  <div class="bg-[#0f172a] p-4 rounded-xl">
    <Scatter :data="data" :options="options" />
  </div>
</template>
