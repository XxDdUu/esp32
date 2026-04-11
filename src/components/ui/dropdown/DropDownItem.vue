<template>
  <div class="item" @click="handleClick">
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

.item:hover {
  background: #f3f3f3;
}
</style>
