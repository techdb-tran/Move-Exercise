<script setup>
import formatView from '@/utils/formatView';
import { RouterLink } from 'vue-router';

const props = defineProps({
  category: Object,
});
</script>

<template>
  <RouterLink
    :to="{ name: 'category', params: { categoryId: props.category.id } }"
    class="categoryCard hover:opacity-80 cursor-pointer"
  >
    <div class="imgDiv mb-3">
      <img :src="`${props.category.image_url}`" :alt="props.category.name" />
    </div>
    <h3 class="subtitle">{{ props.category.name }}</h3>
    <p class="paragraph mt-1">{{ formatView(props.category.count_views) }} views</p>
  </RouterLink>
</template>

<style scoped>
.imgDiv {
  aspect-ratio: 9/13;
  overflow: clip;
  display: flex;
  justify-content: center;
  align-items: center;
}

.imgDiv img {
  height: 100%;
  object-fit: cover;
}
</style>
