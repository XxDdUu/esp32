<script setup lang="ts">
defineProps<{
  title: string;
  value: number;
}>();
</script>

<template>
  <div class="card">
    <h3>{{ title }}</h3>
    <p class="value">{{ value.toFixed(2) }}</p>
  </div>
</template>

<style scoped>
.card {
  background: #1e293b;
  color: white;
  padding: 16px;
  border-radius: 12px;
  width: 150px;
}
.value {
  font-size: 24px;
  font-weight: bold;
}
</style>
