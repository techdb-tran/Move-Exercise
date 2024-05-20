<script setup>
import LeftPanelDashboard from '@/components/left-panel/LeftPanelDashboard.vue';
import { RouterView } from 'vue-router';
import SteamerHeaderComponent from '@/components/Header/SteamerHeaderComponent.vue';
</script>

<template>
  <SteamerHeaderComponent />
  <LeftPanelDashboard />
  <div class="ml-60"><RouterView /></div>
</template>

<style scoped></style>
