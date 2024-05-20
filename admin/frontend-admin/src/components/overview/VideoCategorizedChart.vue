<script setup>
import Chart from 'primevue/chart';
import { useOverviewStore } from '@/store/storeOverview';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const overviewStore = useOverviewStore();
const { categories } = storeToRefs(overviewStore);

// filter catergories that has 0 view
const filteredCategories = computed(() =>
  categories.value.filter((category) => category.count_views)
);

// Generate valid chart data
const chartData = computed(() => {
  const labels = filteredCategories.value.map((category) => category.name);
  const data = filteredCategories.value.map((category) => Number(category.count_views));
  return {
    labels,
    datasets: [{ data }]
  };
});
</script>

<template>
  <div class="flex justify-center flex-col items-center gap-10">
    <h1 class="text-xl font-bold text-center text-primary-color-hover">
      Overview videos categorized
    </h1>

    <div class="w-2/3">
      <Chart type="pie" :data="chartData" />
    </div>
  </div>
</template>

<style scoped></style>
