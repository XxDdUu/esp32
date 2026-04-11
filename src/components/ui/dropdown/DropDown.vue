<template>
  <div class="dropdown" ref="dropdownRef">
    <!-- Trigger -->
    <button @click="toggle">
      <slot name="trigger">Menu</slot>
    </button>

    <!-- Menu -->
    <div
      v-if="open"
      ref="menuRef"
      class="absolute mt-2 w-40 bg-white rounded-lg shadow-lg"
      :class="actualAlign === 'right' ? 'right-0' : 'left-0'"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import { provide } from "vue";

const slots = defineSlots<{
  trigger?: () => any,
  default?: () => any
}>()

const props = defineProps({
  align: {
    type: String,
    default: "left", 
  },
});

const open = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);
const menuRef = ref<HTMLElement | null>(null);

const actualAlign = ref<"left" | "right">("left");



const close = () => {
  open.value = false;
};

const toggle = async () => {
  open.value = !open.value;

  if (open.value) {
    await nextTick();
    updatePosition();
  }
};


const updatePosition = () => {
  if (!dropdownRef.value || !menuRef.value) return;

  const triggerRect = dropdownRef.value.getBoundingClientRect();
  const menuWidth = menuRef.value.offsetWidth;
  const screenWidth = window.innerWidth;

  // nếu bị tràn phải
  if (triggerRect.left + menuWidth > screenWidth) {
    actualAlign.value = "right";
  } else {
    actualAlign.value = "left";
  }
};


// click outside
const handleClickOutside = (e) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    close();
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});


provide("closeDropdown", close);
</script>

<style scoped>
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-trigger {
  padding: 8px 12px;
  background: #333;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 6px;
}

.dropdown-menu {
  position: absolute;
  top: 110%;
  left: 0;
  min-width: 160px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
  padding: 6px 0;
  z-index: 100;
}

/* animation */
.fade-enter-active,
.fade-leave-active {
  transition: 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
