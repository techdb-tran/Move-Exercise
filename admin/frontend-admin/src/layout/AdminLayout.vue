<script setup>
import { RouterView } from 'vue-router'
import HeaderComponent from '@/components/header/HeaderComponent.vue'
import LeftPanel from '@/components/left-panel/LeftPanel.vue'
</script>
<template>
  <HeaderComponent />
  <div>
    <LeftPanel />
    <div class="ml-60 mt-14 h-screen"><RouterView /></div>
  </div>
</template>
<style scoped></style>
