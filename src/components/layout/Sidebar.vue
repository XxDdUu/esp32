<script setup lang="ts">
import { computed, ref } from "vue";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useUiStore } from "@/stores/ui";
import { transition } from "@vueuse/core";
import type { Session } from "@/types/session";
import { CalendarDays, Calendar, CalendarRange } from "lucide-vue-next";

const ui = useUiStore();

interface Props {
  sessions: Session[];
  show: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  sessions: () => [],  // ✅ default applied e
  show: false,
});

const emit = defineEmits<{
  (e: "close"): void;
  (e: "select", payload: { type: "day" | "month" | "year"; key: string }): void;
  (e: "update:open", open: boolean): void;
}>();

// ===== GROUP LOGIC =====
const groupBy = (type: "day" | "month" | "year") => {
  const map = new Map<string, number>();

  props.sessions.forEach((s) => {
    const date = new Date(s.createdAt);

    let key = "";

    if (type === "day") {
      key = date.toISOString().slice(0, 10);
    }

    if (type === "month") {
      key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    }

    if (type === "year") {
      key = `${date.getFullYear()}`;
    }

    map.set(key, (map.get(key) || 0) + 1);
  });

  return [...map.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([key, count]) => ({ key, count }));
};

const days = computed(() => groupBy("day"));
const months = computed(() => groupBy("month"));
const years = computed(() => groupBy("year"));

const select = (type: any, key: string) => {
  emit("select", { type, key });
};
</script>

<template>
  <transition name="slide">
    <Sheet 
      :open="ui.sidebarOpen"
      @update:open="ui.closeSidebar()"
    >
    <SheetContent side="left" class="w-72 bg-slate-900 text-white">
      
      <SheetHeader>
        <SheetTitle class="text-white">📊 Analytics</SheetTitle>
      </SheetHeader>

      <!-- DAY -->
      <div class="mt-4 mb-6">
          <div class="flex items-center ml-3 gap-2">
          <CalendarDays class="w-4 h-4 text-slate-400" />
          <h3 class="text-sm text-white">Day</h3>
        </div>
        <div
          v-for="d in days"
          :key="d.key"
          @click="select('day', d.key)"
          class="flex justify-between cursor-pointer hover:bg-slate-800 px-2 py-1 rounded"
        >
          <span>{{ d.key }}</span>
          <span class="text-xs text-slate-400">{{ d.count }}</span>
        </div>
      </div>

      <!-- MONTH -->
      <div class="mb-6">
          <div class="flex items-center ml-3 gap-2">
        <Calendar class="w-4 h-4 text-slate-400" />
        <h3 class="text-sm text-white">Month</h3>
        </div>
        <div
          v-for="m in months"
          :key="m.key"
          @click="select('month', m.key)"
          class="flex justify-between cursor-pointer hover:bg-slate-800 px-2 py-1 rounded"
        >
          <span>{{ m.key }}</span>
          <span class="text-xs text-slate-400">{{ m.count }}</span>
        </div>
      </div>

      <!-- YEAR -->
      <div>
          <div class="flex items-center ml-3 gap-2">
        <CalendarRange class="w-4 h-4 text-slate-400" />
        <h3 class="text-sm text-white">Year</h3>
        </div>
        <div
          v-for="y in years"
          :key="y.key"
          @click="select('year', y.key)"
          class="flex justify-between cursor-pointer hover:bg-slate-800 px-2 py-1 rounded"
        >
          <span>{{ y.key }}</span>
          <span class="text-xs text-slate-400">{{ y.count }}</span>
        </div>
      </div>
    </SheetContent>
  </Sheet>
  </transition>
</template>
<style scoped>

.slide-enter-from {
  transform: translateX(-100%);
}
.slide-enter-to {
  transform: translateX(0);
}
.slide-leave-from {
  transform: translateX(0);
}
.slide-leave-to {
  transform: translateX(-100%);
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
</style>