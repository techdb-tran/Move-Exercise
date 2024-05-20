<template>
  <div>
    <SortTime />
  </div>
  <div class="flex">
    <div class="card mt-4 w-1/2">
      <MostViewChart />
    </div>
    <div class="card mt-4 w-1/2">
      <VideoCategorizedChart />
    </div>
  </div>
</template>

<script setup>
import MostViewChart from './MostViewChart.vue';
import VideoCategorizedChart from './VideoCategorizedChart.vue';
import SortTime from './SortTime.vue';
</script>
