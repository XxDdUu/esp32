<script setup lang="ts">
import { computed, watch } from "vue";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useRoute } from "vue-router";
import { useUiStore } from "@/stores/ui";
import { transition } from "@vueuse/core";
import { CalendarDays, Calendar, CalendarRange } from "lucide-vue-next";
import { Dropdown, DropdownItem } from "@/components/ui/dropdown";
import { useSessions } from "@/composables/useSessions";
import { useSessionFilterStore } from "@/stores/sessionFilter";


const ui = useUiStore();
const route = useRoute();


const deviceId = computed(() => route.params.id as string | undefined);
const { sessions } = useSessions(deviceId);
const filteredSessions = computed(() => {
  if (!deviceId.value) return [];

  return sessions.value.filter(s => s.deviceId === deviceId.value);
});


const filterStore = useSessionFilterStore();


// ===== GROUP LOGIC =====
const groupBy = (type: "day" | "month" | "year") => {
  const map = new Map<
    string,
    { label: string; count: number }
  >();

  filteredSessions.value.forEach((s) => {
    const date = new Date(s.createdAt);

    let key = "";
    let label = "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    if (type === "day") {
      key = `${year}-${month}-${day}`;      
      label = `${day}/${month}/${year}`;
    }

    if (type === "month") {
      key = `${year}-${month}`;           
      label = `${month}/${year}`;
    }

    if (type === "year") {
      key = `${year}`; 
      label = `${year}`;
    }

    if (!map.has(key)) {
      map.set(key, { label, count: 0 });
    }

    map.get(key)!.count++;
  });

  return [...map.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([key, value]) => ({
      key,
      label: value.label,
      count: value.count,
    }));
};
const sessionsBySelectedDay = computed(() => {
  if (!filterStore.selectedDay) return [];

  return filteredSessions.value
    .filter((s) => {
      const d = new Date(s.createdAt);

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");

      const key = `${year}-${month}-${day}`;

      return key === filterStore.selectedDay;
    })
    .sort((a, b) => b.createdAt - a.createdAt); // mới nhất trước
});


const days = computed(() => groupBy("day"));
const months = computed(() => groupBy("month"));
const years = computed(() => groupBy("year"));

const select = (type: "day" | "month" | "year", key: string) => {
  if (type === "day") {
    filterStore.setDay(key);
  }
};
watch(
  sessions,
  () => {
    if (!sessions.value.length) return;

    const latest = [...sessions.value].sort(
      (a, b) => b.createdAt - a.createdAt
    )[0];

    if (!latest) return;

    const d = new Date(latest.createdAt);
    const dayKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

    if (! filterStore.selectedDay) {
      filterStore.setDay(dayKey);
    }

    if (!filterStore.selectedTime) {
      filterStore.setTime(latest.createdAt);
    }
  },
  { immediate: true }
);

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
          <Dropdown align="left">
            
          
          <!-- Trigger -->
          <template #trigger="{ toggle }">
            <div class="px-3">
              <div 
                @click="toggle"
                class="flex items-center w-full gap-2 hover:bg-blue-700 rounded-lg px-5 py-2 cursor-pointer"
              >
                <CalendarDays class="w-4 h-4 text-slate-400" />
                <h3 class="text-sm text-white">Day</h3>
              </div>
            </div>
          </template>


          <!-- Content -->
          <template #default>
            <DropdownItem
              v-for="d in days"
              :key="d.key"
              @click="select('day', d.key)"
              class="bg-[#0f172a] border-accent border rounded-md last:mb-0 flex justify-between"
            >
              <span>{{ d.label }}</span>
              <span class="text-xs text-slate-400">{{ d.count }}</span>
            </DropdownItem>
          </template>

        </Dropdown>
      </div>

      <!-- MONTH -->
      <div class="mb-6">
        <Dropdown align="left">

          <!-- Trigger -->
          <template #trigger="{ toggle }">
            <div class="px-3">
              <div 
                @click="toggle"
                class="flex items-center w-full gap-2 hover:bg-blue-700 rounded-lg px-5 py-2 cursor-pointer"
              >
                <Calendar class="w-4 h-4 text-slate-400" />
                <h3 class="text-sm text-white">Month</h3>
              </div>
            </div>
          </template>

          <!-- Content -->
          <template #default>
            <DropdownItem
              v-for="m in months"
              :key="m.key"
              @click="select('month', m.key)"
              class="bg-[#0f172a] border-accent border rounded-md flex justify-between"
            >
              <span>{{ m.label }}</span> <!-- mm/yyyy -->
              <span class="text-xs text-slate-400">{{ m.count }}</span>
            </DropdownItem>
          </template>

        </Dropdown>
      </div>


     <!-- YEAR -->
      <div>
        <Dropdown align="left">

          <!-- Trigger -->
          <template #trigger="{ toggle }">
            <div class="px-3">
              <div 
                @click="toggle"
                class="flex items-center w-full gap-2 hover:bg-blue-700 rounded-lg px-5 py-2 cursor-pointer"
              >
                <CalendarRange class="w-4 h-4 text-slate-400" />
                <h3 class="text-sm text-white">Year</h3>
              </div>
            </div>
          </template>

          <!-- Content -->
          <template #default>
            <DropdownItem
              v-for="y in years"
              :key="y.key"
              @click="select('year', y.key)"
              class="bg-[#0f172a] border-accent border rounded-md flex justify-between"
            >
              <span>{{ y.label }}</span>
              <span class="text-xs text-slate-400">{{ y.count }}</span>
            </DropdownItem>
          </template>

        </Dropdown>
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