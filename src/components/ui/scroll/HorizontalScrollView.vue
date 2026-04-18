<template>
  <div class="relative w-full">

    <button
      v-if="canScrollLeft"
      @click="scroll(-1)"
      class="absolute left-2 top-1/2 -translate-y-1/2 z-10
             bg-white shadow rounded-full w-10 h-10 flex items-center justify-center"
    >
      ◀
    </button>

    <div
      ref="scrollRef"
      class="flex h-full overflow-x-auto scroll-smooth snap-x snap-mandatory gap-4 scrollbar-hide"
    >
      <slot />
    </div>

    <button
      v-if="canScrollRight"
      @click="scroll(1)"
      class="absolute right-2 top-1/2 -translate-y-1/2 z-10
             bg-white shadow rounded-full w-10 h-10 flex items-center justify-center"
    >
      ▶
    </button>

  </div>
</template>

<script setup lang="ts">
defineProps<{
  scrollRef: any;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  scroll: (dir: number) => void;
}>();
</script>
