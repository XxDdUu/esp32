<template>
  <div class="relative w-full h-full">
    <!-- Scroll container -->
    <div
      ref="scrollRef"
      :class="[
        axis === 'x'
          ? 'overflow-x-auto flex'
          : 'overflow-y-auto flex flex-col',
        'scrollbar-hide w-full h-full'
      ]"
      @scroll="updateScrollState"
    >
      <slot />
    </div>

    <!-- START button -->
    <button
      v-if="canScrollStart"
      @click="scroll('start')"
      :class="startBtnClass"
    >
      {{ axis === 'x' ? '←' : '↑' }}
    </button>

    <!-- END button -->
    <button
      v-if="canScrollEnd"
      @click="scroll('end')"
      :class="endBtnClass"
    >
      {{ axis === 'x' ? '→' : '↓' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

const props = defineProps<{
  axis?: "x" | "y";
  scrollAmount?: number;
}>();

const axis = props.axis ?? "x";
const amount = props.scrollAmount ?? 200;

const scrollRef = ref<HTMLElement | null>(null);
const canScrollStart = ref(false);
const canScrollEnd = ref(false);

const updateScrollState = () => {
  const el = scrollRef.value;
  if (!el) return;

  if (axis === "x") {
    canScrollStart.value = el.scrollLeft > 0;
    canScrollEnd.value =
      el.scrollLeft + el.clientWidth < el.scrollWidth;
  } else {
    canScrollStart.value = el.scrollTop > 0;
    canScrollEnd.value =
      el.scrollTop + el.clientHeight < el.scrollHeight;
  }
};

const scroll = (direction: "start" | "end") => {
  const el = scrollRef.value;
  if (!el) return;

  if (axis === "x") {
    el.scrollBy({
      left: direction === "start" ? -amount : amount,
      behavior: "smooth",
    });
  } else {
    el.scrollBy({
      top: direction === "start" ? -amount : amount,
      behavior: "smooth",
    });
  }
};

onMounted(updateScrollState);


// 🎯 Button position dynamic
const startBtnClass = computed(() =>
  axis === "x"
    ? "absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white px-2 py-1 rounded"
    : "absolute top-2 left-1/2 -translate-x-1/2 z-10 bg-black/50 text-white px-2 py-1 rounded"
);

const endBtnClass = computed(() =>
  axis === "x"
    ? "absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white px-2 py-1 rounded"
    : "absolute bottom-2 left-1/2 -translate-x-1/2 z-10 bg-black/50 text-white px-2 py-1 rounded"
);
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
