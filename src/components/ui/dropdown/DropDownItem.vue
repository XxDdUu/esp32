<template>
  <div class="item hover:bg-emerald-900" @click="handleClick">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { inject } from "vue";

const emit = defineEmits<{
  (e: "click"): void;
}>();

const close = inject<(() => void) | null>("closeDropdown", null);

const handleClick = () => {
  close?.();
  emit("click");
};
</script>

<style scoped>
.item {
  padding: 10px 14px;
  cursor: pointer;
  transition: 0.2s;
}


</style>
