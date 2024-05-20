<script setup>
import { onMounted, ref } from 'vue';
import { getCategories } from '@/apis/videos.api';
import { toast } from 'vue3-toastify';
import CategoryCard from '@/components/category/CategoryCard.vue';
import { useLeftPanelStore } from '@/stores/leftPanel.js';

const LeftPanelStore = useLeftPanelStore();

const categories = ref([]);

onMounted(async () => {
  try {
    const response = await getCategories();
    categories.value = response.data.metadata;
  } catch (error) {
    toast.error(`Error loading categories: ${error.message}`);
  }
});
</script>

<template>
  <section
    class="grid gap-4 mt-3"
    :class="LeftPanelStore.isOpenSidebar ? 'grid-cols-5' : 'grid-cols-6'"
  >
    <CategoryCard v-for="category in categories" :key="category.id" :category="category" />
  </section>
</template>

<style scoped></style>
