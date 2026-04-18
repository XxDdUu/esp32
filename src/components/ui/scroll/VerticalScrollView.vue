<template>
  <div class="relative h-full">
    <!-- Scroll container -->
    <div
      ref="scrollRef"
      class="overflow-y-auto scrollbar-hide h-full"
      @scroll="updateScrollState"
    >
      <slot />
    </div>

    <!-- Up button -->
    <button
      v-if="canScrollUp"
      @click="scroll('up')"
      class="absolute top-2 left-1/2 -translate-x-1/2 z-10 bg-black/50 text-white px-2 py-1 rounded"
    >
      ↑
    </button>

    <!-- Down button -->
    <button
      v-if="canScrollDown"
      @click="scroll('down')"
      class="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 bg-black/50 text-white px-2 py-1 rounded"
    >
      ↓
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const props = defineProps<{
  scrollAmount?: number;
}>();

const scrollRef = ref<HTMLElement | null>(null);
const canScrollUp = ref(false);
const canScrollDown = ref(false);

const amount = props.scrollAmount ?? 200;

const updateScrollState = () => {
  const el = scrollRef.value;
  if (!el) return;

  canScrollUp.value = el.scrollTop > 0;
  canScrollDown.value =
    el.scrollTop + el.clientHeight < el.scrollHeight;
};

const scroll = (direction: "up" | "down") => {
  const el = scrollRef.value;
  if (!el) return;

  el.scrollBy({
    top: direction === "up" ? -amount : amount,
    behavior: "smooth",
  });
};

onMounted(() => {
  updateScrollState();
});
</script>

<style scoped>
:deep(.scrollbar-hide) {
  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
