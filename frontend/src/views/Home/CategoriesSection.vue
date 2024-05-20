<script setup>
import BlackBar from '../../components/UI/BlackBar.vue';
import CategoryCard from '../../components/category/CategoryCard.vue';
import { RouterLink } from 'vue-router';
import { onMounted, ref } from 'vue';
import { toast } from 'vue3-toastify';
import { getCategories } from '@/apis/videos.api.js';

const categories = ref([]);

onMounted(async () => {
  try {
    const result = await getCategories();
    categories.value = result.data.metadata?.sort(
      (a, b) => Number(b.count_views) - Number(a.count_views),
    );
  } catch (error) {
    toast.error(`Error loading categories: ${error.message}`);
  }
});
</script>

<template>
  <BlackBar class="my-8" />
  <section id="categories">
    <div class="flex justify-between">
      <h2 class="title">Categories</h2>
      <RouterLink
        :to="{ name: 'browse' }"
        class="text-[18px] text-primary-color hover:text-primary-color-hover"
        >View all</RouterLink
      >
    </div>
    <div class="categoriesGrid grid grid-cols-6 gap-2 my-3">
      <CategoryCard
        v-for="category in categories.slice(0, 6)"
        :key="category.id"
        :category="category"
      />
    </div>
  </section>
</template>

<style scoped></style>
