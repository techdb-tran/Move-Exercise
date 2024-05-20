<template>
  <div class="p-7 h-screen">
    <div class="mr-48">
      <BlackBar><h1 class="text-2xl font-bold">Page Not Found</h1></BlackBar>
    </div>
    <div class="flex flex-col justify-center items-center h-full">
      <span class="font-bold">Page Not Found!</span>
      <span>The page you are looking for does not exist.</span>
      <Button label="Back to home" class="mt-3 bg-primary-color px-10"
        ><RouterLink to="/overview">Back to home</RouterLink></Button
      >
    </div>
  </div>
</template>
<script setup>
import BlackBar from '@/components/UI/BlackBar.vue';
import Button from 'primevue/button';
import { RouterLink } from 'vue-router';
</script>
