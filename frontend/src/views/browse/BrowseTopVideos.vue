<script setup>
import { getCategories } from '@/apis/videos.api.js';
import { computed, onMounted, ref, watch } from 'vue';
import { toast } from 'vue3-toastify';
import Dropdown from 'primevue/dropdown';
import VideoCard from '@/components/video-components/VideoCard.vue';
import useLoadMore from '@/utils/useLoadMore';
import DotsLoading from '@/components/UI/DotsLoading.vue';
import { useLeftPanelStore } from '@/stores/leftPanel.js';
import { getTopVideos } from '@/apis/videos.api.js';

const LeftPanelStore = useLeftPanelStore();

const PageSize = 12;
const categories = ref([]);
const videos = ref([]);
const loadMoreElement = ref();
const LoadMoreIsShowing = ref(true);

const allCategories = computed(() => {
  const allOption = {
    id: 'all',
    name: 'All Categories',
  };
  return [allOption, ...categories.value];
});

const levelOptions = [
  {
    name: 'All levels',
    value: 'all',
  },
  {
    name: 'Beginner',
    value: 'Beginner',
  },
  {
    name: 'Intermediate',
    value: 'Intermediate',
  },
  {
    name: 'Advanced',
    value: 'Advanced',
  },
];

const sortOptions = [
  {
    name: 'Most recent',
    value: 'mostRecent',
    sort_by: 'most_recent',
    sort_order: 'DESC',
  },
  {
    name: 'Views (High to Low)',
    value: 'viewsDesc',
    sort_by: 'total_view',
    sort_order: 'DESC',
  },
  {
    name: 'Views (Low to High)',
    value: 'viewsAsc',
    sort_by: 'total_view',
    sort_order: 'ASC',
  },
  {
    name: 'Duration (Long to Short)',
    value: 'durationDesc',
    sort_by: 'duration_time',
    sort_order: 'DESC',
  },
  {
    name: 'Duration (Short to Long)',
    value: 'durationAsc',
    sort_by: 'duration_time',
    sort_order: 'ASC',
  },
  {
    name: 'Rating (High to Low)',
    value: 'ratingDesc',
    sort_by: 'average_rates',
    sort_order: 'DESC',
  },
  {
    name: 'Rating (Low to High)',
    value: 'ratingAsc',
    sort_by: 'average_rates',
    sort_order: 'ASC',
  },
];

const selectedCategory = ref('All Categories');
const selectedLevel = ref('all');

const selectedSort = ref('mostRecent');

const sortBy = computed(() => {
  const sortItem = sortOptions.find((option) => option.value === selectedSort.value);
  return sortItem.sort_by;
});

const sortOrder = computed(() => {
  const sortItem = sortOptions.find((option) => option.value === selectedSort.value);
  return sortItem.sort_order;
});

const { resetLoadMore } = useLoadMore(
  loadMoreElement,
  LoadMoreIsShowing,
  videos,
  getTopVideos,
  PageSize,
  selectedCategory,
  selectedLevel,
  sortBy,
  sortOrder,
);

onMounted(async () => {
  try {
    const result = await getCategories();
    categories.value = result.data.metadata;
  } catch (error) {
    toast.error(`Error loading categories: ${error.message}`);
  }
});

watch([selectedLevel, selectedCategory, selectedSort], () => {
  resetLoadMore();
});
</script>

<template>
  <section>
    <!-- Filter selection div -->
    <div class="filter-container flex gap-6 justify-end items-center text-[12px]">
      <label for="level" class="font-semibold flex gap-3 items-center"
        >LEVEL
        <Dropdown
          class="text-sm"
          scrollHeight="400px"
          v-model="selectedLevel"
          :options="levelOptions"
          optionValue="value"
          optionLabel="name"
      /></label>

      <label class="font-semibold flex gap-3 items-center"
        >CATEGORY
        <Dropdown
          scrollHeight="400px"
          v-model="selectedCategory"
          :options="allCategories"
          optionValue="name"
          optionLabel="name"
      /></label>

      <label for="sort-by" class="font-semibold flex gap-3 items-center"
        >SORT BY
        <Dropdown
          scrollHeight="400px"
          v-model="selectedSort"
          :options="sortOptions"
          optionValue="value"
          optionLabel="name"
      /></label>
    </div>

    <!-- videos div -->
    <div
      class="mt-6 grid gap-4"
      :class="LeftPanelStore.isOpenSidebar ? 'grid-cols-3' : 'grid-cols-4'"
    >
      <VideoCard v-for="video in videos" :key="video.id" :video="video" />
    </div>
    <div class="loadMoreDiv flex justify-center py-10">
      <DotsLoading ref="loadMoreElement" v-if="LoadMoreIsShowing" />
    </div>
  </section>
</template>

<style scoped></style>
