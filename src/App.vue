
<script setup lang="ts">
    import Navbar from "@/components/layout/Navbar.vue";
    import { ref } from "vue";

    const sidebarOpen = ref(false);

    const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value;
    };
</script>

<template>
    <Navbar @toggleSidebar="toggleSidebar" />
    <router-view />
</template>