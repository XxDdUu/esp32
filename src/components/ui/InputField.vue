<script setup lang="ts">
defineProps<{
  modelValue: string;
  label: string;
  type?: string;
}>();

defineEmits(["update:modelValue"]);
</script>

<template>
  <div class="relative w-full">
    <!-- INPUT -->  
    <input
      :type="type || 'text'"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      placeholder=" "
      class="peer w-full h-12 px-3 pt-4 pb-2 text-sm 
             border border-gray-300 rounded-lg 
             bg-white
             focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    <!-- LABEL -->
    <label
      class="absolute left-3 z-10 px-1 text-sm transition-all
             bg-white

             top-1/2 -translate-y-1/2
             text-gray-400

             peer-focus:top-0 peer-focus:-translate-y-1/2
             peer-focus:text-blue-600

             peer-not-placeholder-shown:top-0 
             peer-not-placeholder-shown:-translate-y-1/2
             peer-not-placeholder-shown:text-gray-700"
    >
      {{ label }}
    </label>
  </div>
</template>
